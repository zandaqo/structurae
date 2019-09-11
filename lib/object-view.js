const StringView = require('./string-view');
const StringArrayView = require('./string-array-view');
const ArrayViewMixin = require('./array-view');
const TypedArrayViewMixin = require('./typed-array-view');
const { typeOffsets, typeGetters, typeSetters } = require('./utilities');

/**
 * @typedef {(string|Class<ObjectView>)} ObjectViewFieldType
 */

/**
 * @typedef {Object} ObjectViewField
 * @property {ObjectViewFieldType} type
 * @property {number} [size] the maximum size in bytes for a string type
 * @property {boolean} [littleEndian]
 * @property {number} [length]
 * @property {number} [start]
 * @property {Class<ArrayView>|Class<ObjectView>|Class<TypedArrayView>
 *   |Class<StringView>|Class<StringArrayView>} [View]
 * @property {string} [getter]
 * @property {string} [setter]
 * @property {number} [itemLength]
 */

/**
 * @extends DataView
 */
class ObjectView extends DataView {
  /**
   * Returns the value or view of a given field.
   *
   * @param {string} field the name of the field
   * @returns {*} value of the field
   */
  get(field) {
    const {
      getter, start, kind, littleEndian, View, length, itemLength,
    } = this.constructor.schema[field];
    if (kind === 'number') return this[getter](start, littleEndian);
    return new View(this.buffer, this.byteOffset + start, length, itemLength);
  }

  /**
   * @private
   * @param {number} position
   * @param {ObjectViewField} field
   * @returns {Array<Object>}
   */
  getArray(position, field) {
    const { size, type: View, itemLength } = field;
    const json = new Array(size);
    for (let i = 0; i < size; i++) {
      const view = new View(this.buffer, this.byteOffset + position + (i * itemLength), itemLength);
      json[i] = view.toJSON();
    }
    return json;
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
   * @returns {string}
   */
  getString(position, field) {
    return new StringView(this.buffer, this.byteOffset + position, field.length).toString();
  }

  /**
   * @private
   * @param {number} position
   * @param {ObjectViewField} field
   * @returns {Array<string>}
   */
  getStringArray(position, field) {
    const { size, itemLength } = field;
    const array = new Array(size);
    for (let i = 0; i < size; i++) {
      const string = new StringView(
        this.buffer, this.byteOffset + position + (i * itemLength), itemLength,
      );
      array[i] = string.toString();
    }
    return array;
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
    const fieldOptions = this.constructor.schema[field];
    const {
      kind, start, setter, littleEndian,
    } = fieldOptions;
    const arg = kind === 'number' ? littleEndian : fieldOptions;
    this[setter](start, value, arg);
    return this;
  }

  /**
   * @private
   * @param {number} position
   * @param {ArrayLike<object>} value
   * @param {ObjectViewField} field
   * @returns {void}
   */
  setArray(position, value, field) {
    const { size, type: View, itemLength } = field;
    const max = (size < value.length ? size : value.length);
    for (let i = 0; i < max; i++) {
      const view = new View(this.buffer, this.byteOffset + position + (i * itemLength), itemLength);
      View.from(value[i], view);
    }
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
   * @param {string} value
   * @param {ObjectViewField} field
   * @returns {void}
   */
  setString(position, value, field) {
    new Uint8Array(this.buffer, this.byteOffset + position, field.length)
      .fill(0)
      .set(StringView.fromString(value));
  }

  /**
   * @private
   * @param {number} position
   * @param {string} value
   * @param {ObjectViewField} field
   * @returns {void}
   */
  setStringArray(position, value, field) {
    const { length, size, itemLength } = field;
    const array = new Uint8Array(this.buffer, this.byteOffset + position, length);
    array.fill(0);
    const max = (size < value.length ? size : value.length);
    for (let i = 0; i < max; i++) {
      const string = StringView.fromString(value[i], itemLength);
      array.set(string, i * itemLength);
    }
  }

  /**
   * @private
   * @param {number} position
   * @param {ArrayLike<number>} value
   * @param {ObjectViewField} field
   * @returns {void}
   */
  setTypedArray(position, value, field) {
    const { View, size } = field;
    const { typeSetter, offset, littleEndian } = View;
    const max = (size < value.length ? size : value.length);
    for (let i = 0; i < max; i++) {
      this[typeSetter](position + (i << offset), value[i], littleEndian);
    }
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
    const { fields } = this.constructor;
    const result = {};
    for (let i = 0; i < fields.length; i++) {
      const name = fields[i];
      result[name] = this.getValue(name);
    }
    return result;
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
    field.getter = 'getString';
    field.setter = 'setString';
  },
  /**
   * @param {ObjectViewField} field
   * @returns {void}
   */
  stringarray(field) {
    const { length, size } = field;
    field.View = StringArrayView;
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
    const { type, size } = field;
    field.View = ArrayViewMixin(type);
    field.length = field.View.getLength(size);
    field.getter = 'getArray';
    field.setter = 'setArray';
    field.itemLength = type.objectLength;
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
