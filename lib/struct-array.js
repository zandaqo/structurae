/**
 * @typedef StructField
 * @property {string} name
 * @property {string} type
 * @property {number} [size]
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
 * @extends DataView
 */
class StructArray extends DataView {
  /**
   * @param {Array<StructField>} fields
   * @param {number} size
   * @param {ArrayBuffer} [buffer]
   * @param {number} [byteOffset]
   * @param {number} [byteLength]
   */
  constructor(fields, size, buffer, byteOffset, byteLength) {
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
   * @param {number} index
   * @param {string} field
   * @returns {*}
   */
  get(index, field) {
    const { schema } = this;
    const offset = this.getByteOffset(index, field);
    const { type, size, littleEndian } = schema[field];
    const method = FieldTypes[type].get;
    return this[method](offset, littleEndian, size);
  }

  /**
   * @param {number} index
   * @param {string} field
   * @param {*} value
   * @returns {this}
   */
  set(index, field, value) {
    const { schema } = this;
    const offset = this.getByteOffset(index, field);
    const { type, littleEndian } = schema[field];
    const method = FieldTypes[type].set;
    this[method](offset, value, littleEndian);
    return this;
  }

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
   * @type {number}
   */
  get size() {
    return this.buffer.byteLength >> this.offset;
  }

  /**
   * @param {number} index
   * @param {number} field
   * @returns {number}
   */
  getByteOffset(index, field) {
    const { offset, offsets } = this;
    return (index << offset) + offsets[field];
  }

  /**
   * @param {number} index
   * @returns {Object}
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

module.exports = StructArray;
