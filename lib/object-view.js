const StringView = require('./string-view');
const DataArrayMixin = require('./array-view');
const {
  Int8View,
  Uint8View,
  Int16View,
  Uint16View,
  Int32View,
  Uint32View,
  Float32View,
  Float64View,
  BigInt64View,
  BigUint64View,
} = require('./typed-array-view');

/**
 * @typedef {('int8' | 'uint8' | 'int16' | 'uint16'
 * | 'int32' | 'uint32' | 'float32' | 'float64'
 * | 'bigint64' | 'biguint64' | 'string' | 'array' | 'object'
 * | Class<ArrayView>|Class<ObjectView>|Class<TypedArrayView>)} ObjectViewFieldType
 */

/**
 * @typedef {Object} ObjectViewField
 * @property {ObjectViewFieldType} type
 * @property {number} [size] the maximum size in bytes for a string type
 * @property {boolean} [littleEndian]
 * @property {number} [start]
 * @property {number} [length]
 * @property {Constructor} [ctor]
 */

/**
 * @private
 */
const fieldSizes = {
  int8: 1,
  uint8: 1,
  int16: 2,
  uint16: 2,
  int32: 4,
  uint32: 4,
  float32: 4,
  float64: 8,
  bigint64: 8,
  biguint64: 8,
  string: 0,
};

const arrayClasses = {
  int8: Int8View,
  uint8: Uint8View,
  int16: Int16View,
  uint16: Uint16View,
  int32: Int32View,
  uint32: Uint32View,
  float32: Float32View,
  float64: Float64View,
  bigint64: BigInt64View,
  biguint64: BigUint64View,
};

/**
 *
 * @extends DataView
 */
class ObjectView extends DataView {
  /**
   * @param {ArrayBuffer} [buffer] an existing ArrayBuffer to use
   * @param {number} [byteOffset] the byteOffset in an existing ArrayBuffer
   * @param {number} [byteLength] the byteLength in an existing ArrayBuffer
   */
  constructor(buffer, byteOffset, byteLength) {
    const { isInitialized } = new.target;
    if (!isInitialized) new.target.initialize();
    const data = buffer || new ArrayBuffer(new.target.getLength());
    super(data, byteOffset, byteLength);

    Object.defineProperties(this, {
      byteView: { value: new Uint8Array(this.buffer, this.byteOffset, this.byteLength) },
    });
  }

  /**
   * Returns the value of a given field.
   *
   * @param {string} field the name of the field
   * @returns {*} value of the field
   */
  get(field) {
    const {
      type, littleEndian, start, ctor, length,
    } = this.constructor.schema[field];
    switch (type) {
      case 'int8':
        return this.getInt8(start);
      case 'uint8':
        return this.getUint8(start);
      case 'int16':
        return this.getInt16(start, littleEndian);
      case 'uint16':
        return this.getUint16(start, littleEndian);
      case 'int32':
        return this.getInt32(start, littleEndian);
      case 'uint32':
        return this.getUint32(start, littleEndian);
      case 'float32':
        return this.getFloat32(start, littleEndian);
      case 'float64':
        return this.getFloat64(start, littleEndian);
      case 'bigint64':
        return this.getBigInt64(start, littleEndian);
      case 'biguint64':
        return this.getBigUint64(start, littleEndian);
      default:
        return this.getObject(start, length, ctor);
    }
  }

  /**
   * @private
   * @param {number} start
   * @param {number} length
   * @param {Class<ArrayView>|Class<TypedArrayView>
   *   |Class<ObjectView>|Class<StringView>} [Ctor=StringView]
   * @returns {ArrayView|TypedArrayView|ObjectView|StringView}
   */
  getObject(start, length, Ctor = StringView) {
    return new Ctor(this.buffer, this.byteOffset + start, length);
  }

  /**
   * Sets a value to a field.
   *
   * @param {string} field the name of the field
   * @param {*} value the value to be set
   * @returns {ObjectView}
   */
  set(field, value) {
    const {
      type, littleEndian, start, ctor, length,
    } = this.constructor.schema[field];
    switch (type) {
      case 'int8':
        this.setInt8(start, value);
        break;
      case 'uint8':
        this.setUint8(start, value);
        break;
      case 'int16':
        this.setInt16(start, value, littleEndian);
        break;
      case 'uint16':
        this.setUint16(start, value, littleEndian);
        break;
      case 'int32':
        this.setInt32(start, value, littleEndian);
        break;
      case 'uint32':
        this.setUint32(start, value, littleEndian);
        break;
      case 'float32':
        this.setFloat32(start, value, littleEndian);
        break;
      case 'float64':
        this.setFloat64(start, value, littleEndian);
        break;
      case 'bigint64':
        this.setBigInt64(start, value, littleEndian);
        break;
      case 'biguint64':
        this.setBigUint64(start, value, littleEndian);
        break;
      case 'string':
        this.setString(start, value, length);
        break;
      case 'array':
        this.setArray(start, value, length, ctor);
        break;
      default:
        this.setObject(start, value, length, ctor);
        break;
    }
    return this;
  }

  /**
   * @private
   * @param {number} start
   * @param {ArrayView|TypedArrayView|ArrayLike<number>} value
   * @param {number} length
   * @param {Class<ArrayView>|Class<TypedArrayView>} Ctor
   * @returns {ObjectView}
   */
  setArray(start, value, length, Ctor) {
    if (value instanceof Ctor) {
      this.byteView.set(value.byteView, start);
    } else {
      const arrayView = new Ctor(this.buffer, this.byteOffset + start, length);
      const { size } = arrayView;
      const max = size < value.length ? size : value.length;
      for (let i = 0; i < max; i++) {
        arrayView.set(i, value[i]);
      }
    }

    return this;
  }

  /**
   * @private
   * @param {number} start
   * @param {ObjectView|Object} value
   * @param {number} [length]
   * @param {Class<ObjectView>} [Ctor]
   * @returns {ObjectView}
   */
  setObject(start, value, length, Ctor) {
    if (value instanceof ObjectView) {
      this.byteView.set(value.byteView, start);
    } else {
      const typedObject = start === 0 ? this
        : new Ctor(this.buffer, this.byteOffset + start, length);
      const { fields } = typedObject.constructor;
      for (let i = 0; i < fields.length; i++) {
        const name = fields[i];
        if (Reflect.has(value, name)) typedObject.set(name, value[name]);
      }
    }
    return this;
  }

  /**
   * @private
   * @param {number} start
   * @param {StringView|string} value
   * @param {number} length
   * @returns {ObjectView}
   */
  setString(start, value, length) {
    if (value instanceof StringView) {
      this.byteView.set(value, start);
    } else {
      const stringView = StringView.fromString(value);
      this.byteView.subarray(start, start + length)
        .fill(0)
        .set(stringView);
    }
    return this;
  }

  /**
   * Returns an Object corresponding to the object view.
   *
   * @returns {Object}
   */
  toObject() {
    const { fields, schema } = this.constructor;
    const result = {};
    for (let i = 0; i < fields.length; i++) {
      const name = fields[i];
      const { type } = schema[name];
      let value = this.get(name);
      if (value.buffer) {
        value = type === 'string' ? value.toString() : value.toObject();
      }
      result[name] = value;
    }
    return result;
  }

  /**
   * Assigns fields of a given object to the provided object view
   * or a new object view.
   *
   * @param {Object} object the object to take data from
   * @param {ObjectView} objectView the object view to assign fields to
   * @returns {ObjectView}
   */
  static from(object, objectView = new this()) {
    objectView.setObject(0, object);
    return objectView;
  }

  /**
   * Returns the byte length of an object view.
   *
   * @returns {number}
   */
  static getLength() {
    if (!this.isInitialized) this.initialize();
    const lastField = this.schema[this.fields[this.fields.length - 1]];
    return lastField.start + lastField.length;
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
      const { type, size } = field;
      let byteSize = 0;
      const isPrimitive = typeof type === 'string';
      const isArray = !!size;
      // account for wrong primitive type
      if (isPrimitive && !Reflect.has(fieldSizes, type)) {
        throw TypeError(`Type "${type}" is not a valid type.`);
      }
      if (isArray) {
        field.ctor = isPrimitive ? arrayClasses[type] : DataArrayMixin(type);
        field.type = 'array';
        byteSize = field.ctor.getLength(size);
      } else if (!isPrimitive) {
        field.type = 'object';
        field.ctor = type;
        byteSize = type.getLength();
      }
      field.start = lastOffset;
      field.length = field.length || byteSize || fieldSizes[type];
      lastOffset += field.length;
    }
    this.fields = fields;
    this.isInitialized = true;
  }
}
/**
 * @private
 * @type {Array<ObjectViewField>}
 */
ObjectView.fields = undefined;

/**
 * @private
 */
ObjectView.schema = undefined;

/** @type {boolean} */
ObjectView.isInitialized = false;

module.exports = ObjectView;
