/**
 * Uses Uint32Array as a vector or array of bits.
 *
 * @extends Uint32Array
 */
class BitArray extends Uint32Array {
  /**
   * @param {number} [size=32] the number of bits
   * @param {...*} [args]
   */
  constructor(size = 32, ...args) {
    if (size.length || size instanceof ArrayBuffer) {
      super(size, ...args);
    } else {
      super(new.target.getLength(size));
    }
    Object.defineProperties(this, {
      lastPosition: { value: Object.seal({ bucket: 0, position: 0 }) },
    });
  }

  /**
   * Returns the bit value at a given index.
   *
   * @param {number} index
   * @returns {number}
   */
  getBit(index) {
    const { bucket, position } = this.getBitPosition(index);
    return (this[bucket] >> position) & 1;
  }

  /**
   * Sets the bit value at a given index.
   *
   * @param {number} index
   * @param {number} [value=1]
   * @returns {BitArray}
   */
  setBit(index, value = 1) {
    const { bucket, position } = this.getBitPosition(index);
    this[bucket] = (this[bucket] & ~(1 << position)) | (value << position);
    return this;
  }

  /**
   * Returns the amount of available bits in the array.
   *
   * @type {number}
   */
  get size() {
    return this.length << 5;
  }

  /**
   * @protected
   * @param {number} index
   * @returns {BitCoordinates}
   */
  getBitPosition(index) {
    const bucket = index >> 5;
    this.lastPosition.bucket = bucket;
    this.lastPosition.position = index - (bucket << 5);
    return this.lastPosition;
  }

  /**
   * Returns the length of underlying TypedArray required to hold the bit array.
   *
   * @param {number} size
   * @returns {number}
   */
  static getLength(size) {
    return Math.ceil(size / 32);
  }

  /**
   * @type {Uint32ArrayConstructor}
   */
  static get [Symbol.species]() {
    return Uint32Array;
  }
}

module.exports = BitArray;
