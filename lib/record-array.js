const utilities = require('./utilities');

/**
* @typedef {('Int8' | 'Uint8' | 'Int16' | 'Uint16'
 * | 'Int32' | 'Uint32' | 'Float32' | 'Float64'
 * | 'BigInt64' | 'BigUint64' | 'String' )} RecordFieldType
*/

/**
 * @typedef {Object} RecordField
 * @property {string} name
 * @property {RecordFieldType} type
 * @property {number} [size] the maximum size in bytes for a string type
 * @property {boolean} [littleEndian]
 */

const StringView = require('./string-view');

/**
 * @private
 */
const fieldSizes = {
  Int8: 1,
  Uint8: 1,
  Int16: 2,
  Uint16: 2,
  Int32: 4,
  Uint32: 4,
  Float32: 4,
  Float64: 8,
  BigInt64: 8,
  BigUint64: 8,
  String: 0,
  Int8Array: 0,
  Uint8Array: 0,
  Uint8ClampedArray: 0,
  Int16Array: 0,
  Uint16Array: 0,
  Int32Array: 0,
  Uint32Array: 0,
  Float32Array: 0,
  Float64Array: 0,
  BigInt64Array: 0,
  BigUint64Array: 0,
};

/**
 * @private
 */
const typedArrays = {
  Int8Array,
  Uint8Array,
  Uint8ClampedArray,
  Int16Array,
  Uint16Array,
  Int32Array,
  Uint32Array,
  Float32Array,
  Float64Array,
  BigInt64Array,
  BigUint64Array,
};

/**
 * Extends DataView to use ArrayBuffer as an array of records or C-like structs.
 *
 * @deprecated
 * @extends DataView
 */
class RecordArray extends DataView {
  /**
   * @param {Array<RecordField>} fields an array field descriptions
   * @param {number} [size] the amount of structs in the array,
   *                        optional if an existing ArrayBuffer is used
   * @param {ArrayBuffer} [buffer] an existing ArrayBuffer to use for structs
   * @param {number} [byteOffset] the byteOffset in an existing ArrayBuffer
   * @param {number} [byteLength] the byteLength in an existing ArrayBuffer
   * @example
   * const people = new RecordArray([
   *   { name: 'age', type: 'Uint8' },
   *   { name: 'score', type: 'Float32' },
   * ], 20);
   *
   * const cars = new RecordArray([
   *   { name: 'name', type: 'String', size: 10 },
   *   { name: 'speed', type: 'Float32' }
   * ], 100)
   */
  constructor(fields, size = 1, buffer, byteOffset, byteLength) {
    const lastField = fields[fields.length - 1];
    if (!lastField.end) new.target.initialize(fields);
    const lastOffset = lastField.end;
    const offset = Math.ceil(Math.log2(lastOffset));
    const data = buffer || new ArrayBuffer(size << offset);
    super(data, byteOffset, byteLength);

    const schema = {};
    for (let i = 0; i < fields.length; i++) {
      schema[fields[i].name] = fields[i];
    }

    Object.defineProperties(this, {
      fields: { value: fields },
      offset: { value: offset },
      schema: { value: schema },
      byteView: { value: new StringView(this.buffer, this.byteOffset, this.byteLength) },
    });
  }

  /**
   * Returns the value of a given field of a record at the given index.
   *
   * @param {number} index the index of a record
   * @param {string} field the name of the field
   * @returns {*} value of the field
   * @example
   * const people = new RecordArray([
   *   { name: 'age', type: 'Uint8' },
   *   { name: 'score', type: 'Float32' },
   * ], 20);
   *
   * person.get(0, 'age');
   */
  get(index, field) {
    const { type, size, littleEndian } = this.schema[field];
    const offset = this.getByteOffset(index, field);
    switch (type) {
      case 'Int8':
        return this.getInt8(offset);
      case 'Uint8':
        return this.getUint8(offset);
      case 'Int16':
        return this.getInt16(offset, littleEndian);
      case 'Uint16':
        return this.getUint16(offset, littleEndian);
      case 'Int32':
        return this.getInt32(offset, littleEndian);
      case 'Uint32':
        return this.getUint32(offset, littleEndian);
      case 'Float32':
        return this.getFloat32(offset, littleEndian);
      case 'Float64':
        return this.getFloat64(offset, littleEndian);
      case 'BigInt64':
        return this.getBigInt64(offset, littleEndian);
      case 'BigUint64':
        return this.getBigUint64(offset, littleEndian);
      case 'String':
        return this.getString(offset, size);
      default:
        return this.getArray(offset, size, type);
    }
  }

  /**
   * @param {number} offset
   * @param {number} size
   * @param {string} type
   * @returns {RecordArray}
   */
  getArray(offset, size, type) {
    return new typedArrays[type](this.buffer, this.byteOffset + offset, size);
  }

  /**
   * @param {number} offset
   * @param {number} size
   * @returns {StringView}
   */
  getString(offset, size) {
    return this.byteView.subarray(offset, offset + size);
  }

  /**
   * Sets a value to a field of a record at a given index.
   *
   * @param {number} index the index of a record
   * @param {string} field the name of the field
   * @param {*} value the value to be set
   * @returns {this}
   * @example
   * const people = new RecordArray([
   *   { name: 'age', type: 'Uint8' },
   *   { name: 'score', type: 'Float32' },
   * ], 20);
   *
   * person.set(0, 'age', 10);
   * person.get(0, 'age');
   * //=> 10
   */
  set(index, field, value) {
    const { type, littleEndian, size } = this.schema[field];
    const offset = this.getByteOffset(index, field);
    switch (type) {
      case 'Int8':
        this.setInt8(offset, value);
        break;
      case 'Uint8':
        this.setUint8(offset, value);
        break;
      case 'Int16':
        this.setInt16(offset, value, littleEndian);
        break;
      case 'Uint16':
        this.setUint16(offset, value, littleEndian);
        break;
      case 'Int32':
        this.setInt32(offset, value, littleEndian);
        break;
      case 'Uint32':
        this.setUint32(offset, value, littleEndian);
        break;
      case 'Float32':
        this.setFloat32(offset, value, littleEndian);
        break;
      case 'Float64':
        this.setFloat64(offset, value, littleEndian);
        break;
      case 'BigInt64':
        this.setBigInt64(offset, value, littleEndian);
        break;
      case 'BigUint64':
        this.setBigUint64(offset, value, littleEndian);
        break;
      case 'String':
        this.setString(offset, value, size);
        break;
      default:
        this.setArray(offset, value, size, type);
        break;
    }
    return this;
  }

  /**
   * @param {number} offset
   * @param {ArrayLike} value
   * @param {number} size
   * @param {string} type
   * @returns {RecordArray}
   */
  setArray(offset, value, size, type) {
    const array = new typedArrays[type](this.buffer, this.byteOffset + offset, size);
    if (value.length < array.length) array.fill(0);
    array.set(value);
    return this;
  }

  /**
   * @param {number} offset
   * @param {Collection} value
   * @param {number} size
   * @returns {void}
   */
  setString(offset, value, size) {
    if (value.length === size) {
      this.byteView.set(value, offset);
    } else {
      this.byteView.subarray(offset, offset + size)
        .fill(0)
        .set(value);
    }
  }

  /**
   * @type {number} The amount of structs in the array.
   * @example
   * const people = new RecordArray([
   *   { name: 'age', type: 'Uint8' },
   *   { name: 'score', type: 'Float32' },
   * ], 20);
   *
   * people.size
   * //=> 20
   */
  get size() {
    return this.buffer.byteLength >> this.offset;
  }

  /**
   * Returns the byte offset in the ArrayBuffer of a given field.
   *
   * @param {number} index the index of the record
   * @param {string} field the name of the field
   * @returns {number} the byte offset
   */
  getByteOffset(index, field) {
    return (index << this.offset) + this.schema[field].start;
  }

  /**
   * The object representation of a given record.
   *
   * @param {number} index the index of the record
   * @returns {Object}
   * @example
   * const people = new RecordArray([
   *   { name: 'age', type: 'Uint8' },
   *   { name: 'score', type: 'Float32' },
   * ], 20);
   *
   * person.set(0, 'age', 10).set(0, 'score', 5.0).toObject(0);
   * //=> { age: 10, score: 5.0 }
   */
  toObject(index) {
    const { fields } = this;
    const result = {};
    for (let i = 0; i < fields.length; i++) {
      const { name } = fields[i];
      result[name] = this.get(index, name);
    }
    return result;
  }

  /**
   * Stores a given object as a record at a given index.
   *
   * @param {number} index the index of the record
   * @param {Object} object the object to be stored
   * @returns {RecordArray}
   * @example
   * const people = new RecordArray([
   *   { name: 'age', type: 'Uint8' },
   *   { name: 'score', type: 'Float32' },
   * ], 20);
   *
   * person.set(0, 'age', 10).set(0, 'score', 5.0).toObject(0);
   * //=> { age: 10, score: 5.0 }
   */
  fromObject(index, object) {
    const { fields } = this;
    for (let i = 0; i < fields.length; i++) {
      const { name } = fields[i];
      if (Reflect.has(object, name)) this.set(index, name, object[name]);
    }
    return this;
  }

  /**
   * Returns the length of underlying ArrayBuffer required to hold the given amount of records.
   *
   * @param {Array<RecordField>} fields an array field descriptions
   * @param {number} [size] the amount of structs in the array
   * @returns {number}
   */
  static getLength(fields, size) {
    const lastField = fields[fields.length - 1];
    if (!lastField.end) this.initialize(fields);
    return size << Math.ceil(Math.log2(lastField.end));
  }

  /**
   * @private
   * @param {Array} fields
   * @returns {void}
   */
  static initialize(fields) {
    let lastOffset = 0;
    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];
      const { type } = field;
      let fieldSize = field.size;
      if (!Reflect.has(fieldSizes, type)) {
        throw TypeError(`Type "${type}" is not a valid type.`);
      }
      const isArray = Reflect.has(typedArrays, type);
      if (isArray) {
        const bytesPerElement = typedArrays[type].BYTES_PER_ELEMENT;
        lastOffset = utilities.getGTEMultiple(lastOffset, bytesPerElement);
        fieldSize *= bytesPerElement;
      }
      field.start = lastOffset;
      lastOffset += (fieldSize || fieldSizes[type]);
      field.end = lastOffset;
    }
  }
}

module.exports = RecordArray;
