/**
 * @typedef RecordField
 * @property {string} name
 * @property {string} type
 * @property {number} [size] the maximum size in bytes for a string type
 * @property {boolean} [littleEndian]
 */

/**
 * @private
 */
const FieldTypes = {
  Int8: { size: 1, get: 'getInt8', set: 'setInt8' },
  Uint8: { size: 1, get: 'getUint8', set: 'setUint8' },
  Int16: { size: 2, get: 'getInt16', set: 'setInt16' },
  Uint16: { size: 2, get: 'getUint16', set: 'setUint16' },
  Int32: { size: 4, get: 'getInt32', set: 'setInt32' },
  Uint32: { size: 4, get: 'getUint32', set: 'setUint32' },
  Float32: { size: 4, get: 'getFloat32', set: 'setFloat32' },
  Float64: { size: 8, get: 'getFloat64', set: 'setFloat64' },
  BigInt64: { size: 8, get: 'getBigInt64', set: 'setBigInt64' },
  BigUint64: { size: 8, get: 'getBigUint64', set: 'setBigUint64' },
  String: { get: 'getString', set: 'setString' },
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
    let hasString = 0;
    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];
      if (field.type === 'String') hasString = true;
      offsets[field.name] = lastOffset;
      schema[field.name] = field;
      lastOffset += (field.size || FieldTypes[field.type].size);
    }

    const offset = Math.ceil(Math.log2(lastOffset));
    const length = size << offset;
    const data = buffer || new ArrayBuffer(length);
    super(data, byteOffset, byteLength);

    const stringView = hasString ? new Uint8Array(this.buffer) : undefined;
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
    const method = FieldTypes[type].get;
    return this[method](offset, littleEndian, size);
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
    const { type, littleEndian } = this.schema[field];
    const offset = this.getByteOffset(index, field);
    const method = FieldTypes[type].set;
    this[method](offset, value, littleEndian);
    return this;
  }

  // todo pad/unpad strings?
  /**
   * @param {number} offset
   * @param {boolean} littleEndian
   * @param {number} size
   * @returns {Uint8Array}
   */
  getString(offset, littleEndian, size) {
    return this.stringView.subarray(offset, size + 1);
  }

  /**
   * @param {number} offset
   * @param {Collection} value
   * @returns {Uint8Array}
   */
  setString(offset, value) {
    this.stringView.set(value, offset);
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
}

module.exports = RecordArray;
