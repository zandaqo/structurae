const StringView = require('./string-view');
const StringArrayView = require('./string-array-view');
const ArrayViewMixin = require('./array-view');
const TypedArrayViewMixin = require('./typed-array-view');
const ExtendedDataView = require('./extended-data-view');
const { typeOffsets, typeGetters, typeSetters } = require('./utilities');

/**
 * @typedef {('int8' | 'uint8' | 'int16' | 'uint16'
 * | 'int32' | 'uint32' | 'float32' | 'float64'
 * | 'bigint64' | 'biguint64' | 'string' | 'array' | 'object' | 'typedarray'
 * | Class<ArrayView>|Class<ObjectView>|Class<TypedArrayView>)} ObjectViewFieldType
 */

/**
 * @typedef {Object} ObjectViewField
 * @property {ObjectViewFieldType} type
 * @property {number} [size] the maximum size in bytes for a string type
 * @property {boolean} [littleEndian]
 * @property {number} [length]
 * @property {number} [start]
 * @property {Class<ArrayView>|Class<ObjectView>|Class<TypedArrayView>} [view]
 * @property {string} getter
 * @property {string} setter
 */

/**
 * @extends DataView
 */
class ObjectView extends ExtendedDataView {
  /**
   * Returns the value or view of a given field.
   *
   * @param {string} field the name of the field
   * @returns {*} value of the field
   */
  get(field) {
    const {
      getter, start, kind, littleEndian, view: View, length, itemLength,
    } = this.constructor.schema[field];
    if (kind === 'number') return this[getter](start, littleEndian);
    return new View(this.buffer, this.byteOffset + start, length, itemLength);
  }

  /**
   * Returns the JavaScript value of a given field.
   *
   * @param {string} field the name of the field
   * @returns {*} value of the field
   */
  getValue(field) {
    const fieldOptions = this.constructor.schema[field];
    const { start, getter, kind } = fieldOptions;
    const arg = kind === 'number' ? fieldOptions.littleEndian : fieldOptions;
    return this[getter](start, arg);
  }

  /**
   * Sets a value to a field.
   *
   * @param {string} field the name of the field
   * @param {*} value the value to be set
   * @returns {ObjectView}
   */
  set(field, value) {
    this.setValue(field, value);
    return this;
  }

  /**
   * Sets an ObjectView value to a field.
   *
   * @param {string} field the name of the field
   * @param {ObjectView|ArrayView|TypedArrayView|StringView} value the view to set
   * @returns {ObjectView}
   */
  setView(field, value) {
    const { start } = this.constructor.schema[field];
    new Uint8Array(this.buffer, this.byteOffset, this.byteLength)
      .set(
        new Uint8Array(value.buffer, value.byteOffset, value.byteLength),
        start,
      );
    return this;
  }

  /**
   * @deprecated use `ObjectView#toJSON()` instead.
   * Returns an Object corresponding to the object view.
   *
   * @returns {Object}
   */
  toObject() {
    return this.toJSON();
  }

  /**
   * Returns an Object corresponding to the object view.
   *
   * @returns {Object}
   */
  toJSON() {
    return this.getObject(0, { view: this.constructor });
  }

  /**
   * Assigns fields of a given object to the provided object view
   * or a new object view.
   *
   * @param {Object} object the object to take data from
   * @param {ObjectView} [view] the object view to assign fields to
   * @returns {ObjectView}
   */
  static from(object, view) {
    const objectView = view || new this(new ArrayBuffer(this.getLength()));
    objectView.setObject(0, object, { view: objectView.constructor });
    return objectView;
  }

  /**
   * Returns the byte length of an object view.
   *
   * @returns {number}
   */
  static getLength() {
    if (!this.isInitialized) this.initialize();
    return this.objectLength;
  }

  /**
   * @private
   * @returns {void}
   */
  static initialize() {
    const { schema } = this;
    const fields = Object.keys(schema);
    let lastOffset = 0;
    for (let i = 0; i < fields.length; i++) {
      const name = fields[i];
      const field = schema[name];
      field.start = lastOffset;
      const kind = this.getFieldKind(field);
      if (Reflect.has(this.types, kind)) {
        field.kind = kind;
        this.types[kind](field);
      } else {
        throw TypeError(`Type "${field.type}" is not a valid type.`);
      }
      lastOffset += field.length;
    }
    this.objectLength = lastOffset;
    this.fields = fields;
    this.isInitialized = true;
  }

  /**
   * @private
   * @param {ObjectViewField} field
   * @returns {string}
   */
  static getFieldKind(field) {
    const { type, size } = field;
    switch (type) {
      case 'int8':
      case 'uint8':
      case 'int16':
      case 'uint16':
      case 'int32':
      case 'uint32':
      case 'float32':
      case 'float64':
      case 'bigint64':
      case 'biguint64':
        if (size) return 'typedarray';
        return 'number';
      case 'string':
        if (size) return 'stringarray';
        return 'string';
      default:
        if (typeof type === 'string') return type;
        if (size) return 'array';
        return 'object';
    }
  }
}

ObjectView.types = {
  /**
   * @param {ObjectViewField} field
   * @returns {void}
   */
  number(field) {
    const { type } = field;
    field.length = 1 << typeOffsets[type];
    field.getter = typeGetters[type];
    field.setter = typeSetters[type];
  },
  /**
   * @param {ObjectViewField} field
   * @returns {void}
   */
  typedarray(field) {
    const { type, littleEndian, size } = field;
    field.view = TypedArrayViewMixin(type, littleEndian);
    field.length = field.view.getLength(size);
    field.getter = 'getTypedArray';
    field.setter = 'setTypedArray';
  },
  /**
   * @param {ObjectViewField} field
   * @returns {void}
   */
  string(field) {
    field.view = StringView;
    field.getter = 'getString';
    field.setter = 'setString';
  },
  /**
   * @param {ObjectViewField} field
   * @returns {void}
   */
  stringarray(field) {
    const { length, size } = field;
    field.view = StringArrayView;
    field.length = StringArrayView.getLength(size, length);
    field.getter = 'getStringArray';
    field.setter = 'setStringArray';
    field.itemLength = length;
  },
  /**
   * @param {ObjectViewField} field
   * @returns {void}
   */
  object(field) {
    const { type } = field;
    field.view = type;
    field.length = type.getLength();
    field.getter = 'getObject';
    field.setter = 'setObject';
  },
  /**
   * @param {ObjectViewField} field
   * @returns {void}
   */
  array(field) {
    const { type, size } = field;
    field.view = ArrayViewMixin(type);
    field.length = field.view.getLength(size);
    field.getter = 'getArray';
    field.setter = 'setArray';
  },
};

/**
 * @private
 * @type {Array<ObjectViewField>}
 */
ObjectView.fields = undefined;

/**
 * @private
 */
ObjectView.schema = undefined;

/**
 * @private
 */
ObjectView.objectLength = 0;

/** @type {boolean} */
ObjectView.isInitialized = false;

module.exports = ObjectView;
