const utilities = require('./utilities');

/**
 * A bit array that supports constant time rank and O(logN) time select operations.
 *
 * @extends Uint16Array
 */
class RankedBitArray extends Uint16Array {
  /**
   * @param {Object} [options]
   * @param {number} [options.size=16] the number of bits
   * @param {...*} [args]
   */
  constructor(options = {}, ...args) {
    const { size = 16 } = options;
    if (args.length) {
      super(...args);
    } else {
      super(RankedBitArray.getLength(size));
    }
    Object.defineProperties(this, {
      lastPosition: { value: Object.seal({ bucket: 0, position: 0 }) },
    });
  }

  /**
   * Returns the bit value at a given index.
   *
   * @param {number} index
   * @returns {number} the next available index
   */
  get(index) {
    const { bucket, position } = this.getBitPosition(index);
    return (this[bucket] >> position) & 1;
  }

  /**
   * Sets the bit value at a given index.
   *
   * @param {number} index
   * @param {number} [value]
   * @returns {RankedBitArray}
   */
  set(index, value = 1) {
    if (index.length) {
      super.set(index, value);
      return this;
    }
    const { bucket, position } = this.getBitPosition(index);
    this[bucket] = (this[bucket] & ~(1 << position)) | (value << position);
    this.updateRanks(bucket, value || -1);
    return this;
  }

  /**
   * Returns the amount of available bits in the array.
   *
   * @type {number}
   */
  get size() {
    return (this.length >> 1) << 4;
  }

  /**
   * @private
   * @param {number} index
   * @returns {BitCoordinates}
   */
  getBitPosition(index) {
    const bucket = index >> 4;
    this.lastPosition.bucket = bucket;
    this.lastPosition.position = index - (bucket << 4);
    return this.lastPosition;
  }

  /**
   * @private
   * @param {number} bucket
   * @param {number} value
   * @returns {void}
   */
  updateRanks(bucket, value) {
    for (let i = (this.length >> 1) + bucket; i < this.length; i++) {
      this[i] += value;
    }
  }

  /**
   * Returns the rank of a bit at a given index.
   *
   * @param {number} index
   * @returns {number}
   */
  rank(index) {
    const { bucket, position } = this.getBitPosition(index);
    const value = this[bucket];
    // mask out following bits
    const masked = value & ((1 << position + 1) - 1);
    const localRank = utilities.popCount32(masked);
    const bucketRank = bucket ? this[(this.length >> 1) + bucket - 1] : 0;
    return bucketRank + localRank;
  }

  /**
   * Returns the select of a bit at a given index.
   *
   * @param {number} index
   * @returns {number}
   */
  select(index) {
    const middle = this.length >> 1;
    let left = middle;
    let right = this.length - 1;
    let bucketRankId = 0;
    while (left <= right) {
      bucketRankId = (right + left) >> 1;
      if (index > this[bucketRankId]) {
        left = bucketRankId + 1;
      } else if (index < this[bucketRankId]) {
        right = bucketRankId - 1;
      } else if (index === this[bucketRankId - 1]) { // preceded by a duplicate
        right = bucketRankId - 1;
      } else {
        break;
      }
    }
    bucketRankId = index === this[bucketRankId] ? bucketRankId : left;

    let rank = bucketRankId > middle ? this[bucketRankId - 1] : 0;
    const bucket = bucketRankId - middle;
    let value = this[bucket];
    while (value) {
      const position = utilities.getLSBIndex(value);
      value &= value - 1;
      rank++;
      if (rank === index) {
        return (bucket << 4) + position;
      }
    }
    return -1;
  }

  /**
   * Returns the length of underlying TypedArray required to hold the bit array.
   *
   * @param {number} size
   * @returns {number}
   */
  static getLength(size) {
    return Math.ceil(size / 16) << 1;
  }
}

module.exports = RankedBitArray;
