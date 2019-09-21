const StringView = require('./string-view');
const { ArrayViewMixin } = require('./array-view');
const TypedArrayViewMixin = require('./typed-array-view');
const { typeOffsets, typeGetters, typeSetters } = require('./utilities');

/**
 * @typedef {Class<ArrayView>|Class<ObjectView>|Class<TypedArrayView>|Class<StringView>} ViewType
 */

/**
 * @typedef {ArrayView|ObjectView|TypedArrayView|StringView} View
 */

/**
 * @typedef {'int8'|'uint8'|'int16'|'uint16'|'int32'
 * |'uint32'|'float32'|'float64'|'bigint64'|'biguint64'} PrimitiveFieldType
 */

/**
 * @typedef {(PrimitiveFieldType|string|ViewType)} ObjectViewFieldType
 */

/**
 * @typedef {Object} ObjectViewField
 * @property {ObjectViewFieldType} type
 * @property {number} [size] the maximum size in bytes for a string type
 * @property {boolean} [littleEndian]
 * @property {number} [length]
 * @property {number} [start]
 * @property {ViewType} [View]
 * @property {string} [getter]
 * @property {string} [setter]
 * @property {number} [itemLength]
 */

/**
 * A DataView based C-like struct to store JavaScript objects in ArrayBuffer.
 *
 * @extends DataView
 */
class ObjectView extends DataView {
  /**
   * Returns a number for primitive fields or a view for all other fields.
   *
   * @param {string} field the name of the field
   * @returns {*} value of the field
   */
  get(field) {
    const {
      getter, start, kind, littleEndian, View, length,
    } = this.constructor.schema[field];
    if (kind === 'number') return this[getter](start, littleEndian);
    return new View(this.buffer, this.byteOffset + start, length);
  }

  /**
   * @private
   * @param {number} position
   * @param {ObjectViewField} field
   * @returns {Object}
   */
  getObject(position, field) {
    const { View, length } = field;
    const view = new View(this.buffer, this.byteOffset + position, length);
    return view.toJSON();
  }

  /**
   * @private
   * @param {number} position
   * @param {ObjectViewField} field
   * @returns {Array<number>}
   */
  getTypedArray(position, field) {
    const { View, size } = field;
    const { typeGetter, offset, littleEndian } = View;
    const result = new Array(size);
    for (let i = 0; i < size; i++) {
      result[i] = this[typeGetter](position + (i << offset), littleEndian);
    }
    return result;
  }

  /**
   * Returns the JavaScript value of a given field.
   *
   * @param {string} field the name of the field
   * @returns {*} value of the field
   */
  getValue(field) {
    const options = this.constructor.schema[field];
    const { start, getter, kind } = options;
    const arg = kind === 'number' ? options.littleEndian : options;
    return this[getter](start, arg);
  }

  /**
   * Returns a view of a given field.
   *
   * @param {string} field the name of the field
   * @returns {*} view of the field
   */
  getView(field) {
    const { View, start, length } = this.constructor.schema[field];
    return new View(this.buffer, this.byteOffset + start, length);
  }

  /**
   * Sets a JavaScript value to a field.
   *
   * @param {string} field the name of the field
   * @param {*} value the value to be set
   * @returns {ObjectView}
   */
  set(field, value) {
    const options = this.constructor.schema[field];
    const {
      kind, start, setter, littleEndian,
    } = options;
    const arg = kind === 'number' ? littleEndian : options;
    this[setter](start, value, arg);
    return this;
  }

  /**
   * @private
   * @param {number} position
   * @param {Object} value
   * @param {ObjectViewField} field
   * @returns {void}
   */
  setObject(position, value, field) {
    const { View, length } = field;
    const view = new View(this.buffer, this.byteOffset + position, length);
    View.from(value, view);
  }

  /**
   * @private
   * @param {number} position
   * @param {ArrayLike<number>} value
   * @param {ObjectViewField} field
   * @returns {void}
   */
  setTypedArray(position, value, field) {
    const { View, size, length } = field;
    const { typeSetter, offset, littleEndian } = View;
    new Uint8Array(this.buffer, this.byteOffset + position, length)
      .fill(0);
    const max = (size < value.length ? size : value.length);
    for (let i = 0; i < max; i++) {
      this[typeSetter](position + (i << offset), value[i], littleEndian);
    }
  }

  /**
   * Sets an View to a field.
   *
   * @param {string} field the name of the field
   * @param {View} value the view to set
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
   * Returns an Object corresponding to the view.
   *
   * @returns {Object}
   */
  toJSON() {
    const { fields } = this.constructor;
    const result = {};
    for (let i = 0; i < fields.length; i++) {
      const name = fields[i];
      result[name] = this.getValue(name);
    }
    return result;
  }

  /**
   * Assigns fields of a given object to the provided view or a new object view.
   *
   * @param {Object} object the object to take data from
   * @param {ObjectView} [view] the object view to assign fields to
   * @returns {ObjectView}
   */
  static from(object, view) {
    const objectView = view || new this(new ArrayBuffer(this.getLength()));
    if (view) {
      // zero out existing view
      new Uint8Array(objectView.buffer, objectView.byteOffset, objectView.byteLength)
        .fill(0);
    }
    const { fields } = objectView.constructor;
    for (let i = 0; i < fields.length; i++) {
      const name = fields[i];
      if (Reflect.has(object, name)) objectView.set(name, object[name]);
    }
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
   * Initializes the object view class.
   *
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
        if (size) return 'array';
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
    const { type, littleEndian } = field;
    field.View = TypedArrayViewMixin(type, littleEndian);
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
    field.View = TypedArrayViewMixin(type, littleEndian);
    field.length = field.View.getLength(size);
    field.getter = 'getTypedArray';
    field.setter = 'setTypedArray';
  },
  /**
   * @param {ObjectViewField} field
   * @returns {void}
   */
  string(field) {
    field.View = StringView;
    field.getter = 'getObject';
    field.setter = 'setObject';
  },
  /**
   * @param {ObjectViewField} field
   * @returns {void}
   */
  object(field) {
    const { type } = field;
    field.View = type;
    field.length = type.getLength();
    field.getter = 'getObject';
    field.setter = 'setObject';
  },
  /**
   * @param {ObjectViewField} field
   * @returns {void}
   */
  array(field) {
    const { type, size, length } = field;
    field.View = type === 'string' ? ArrayViewMixin(StringView, length) : ArrayViewMixin(type);
    field.length = field.View.getLength(size);
    field.getter = 'getObject';
    field.setter = 'setObject';
    field.itemLength = field.View.itemLength;
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

/**
 * Creates an ObjectView class with a given schema.
 *
 * @param {object} schema the schema to use for the class
 * @param {Class<ObjectView>} [ObjectViewClass] an optional ObjectView class to extend
 * @returns {Class<ObjectView>}
 */
function ObjectViewMixin(schema, ObjectViewClass = ObjectView) {
  class Base extends ObjectViewClass {}
  Base.schema = schema;
  Base.initialize();
  return Base;
}

module.exports = {
  ObjectView,
  ObjectViewMixin,
};
