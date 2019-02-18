/**
 * @typedef RecordField
 * @property {string} name
 * @property {string} type
 * @property {number} [size] the maximum size in bytes for a string type
 * @property {boolean} [littleEndian]
 */

const StringView = require('./string-view');

/**
 * @private
 */
const FieldSizes = {
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
};

/**
 * Extends DataView to use ArrayBuffer as an array of records or C-like structs.
 *
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
    const offsets = {};
    const schema = {};
    let lastOffset = 0;
    let hasString = false;
    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];
      if (field.type === 'String') hasString = true;
      offsets[field.name] = lastOffset;
      schema[field.name] = field;
      lastOffset += (field.size || FieldSizes[field.type]);
    }

    const offset = Math.ceil(Math.log2(lastOffset));
    const length = size << offset;
    const data = buffer || new ArrayBuffer(length);
    super(data, byteOffset, byteLength);

    const stringView = hasString ? new StringView(this.buffer) : undefined;
    Object.defineProperties(this, {
      fields: { value: fields },
      offset: { value: offset },
      offsets: { value: offsets },
      schema: { value: schema },
      stringView: { value: stringView },
    });
  }

  /**
   * Returns the value of a given field of a struct at the given index.
   *
   * @param {number} index the index of a struct
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
    }
    return 0;
  }

  /**
   * Sets a value to a field of a struct at a given index.
   *
   * @param {number} index the index of a struct
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
    }
    return this;
  }

  /**
   * @param {number} offset
   * @param {number} size
   * @returns {StringView}
   */
  getString(offset, size) {
    return this.stringView.subarray(offset, offset + size);
  }

  /**
   * @param {number} offset
   * @param {Collection} value
   * @param {number} size
   * @returns {void}
   */
  setString(offset, value, size) {
    if (value.length === size) {
      this.stringView.set(value, offset);
    } else {
      this.stringView.subarray(offset, offset + size)
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
   * @param {number} index the index of the struct
   * @param {string} field the name of the field
   * @returns {number} the byte offset
   */
  getByteOffset(index, field) {
    const { offset, offsets } = this;
    return (index << offset) + offsets[field];
  }

  /**
   * The object representation of a given struct.
   *
   * @param {number} index the index of the struct
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
   * Returns the length of underlying ArrayBuffer required to hold the given amount of records.
   *
   * @param {Array<RecordField>} fields an array field descriptions
   * @param {number} [size] the amount of structs in the array
   * @returns {number}
   */
  static getLength(fields, size) {
    let lastOffset = 0;
    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];
      lastOffset += (field.size || FieldSizes[field.type]);
    }
    return size << Math.ceil(Math.log2(lastOffset));
  }
}

module.exports = RecordArray;
