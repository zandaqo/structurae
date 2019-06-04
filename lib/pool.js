const utilities = require('./utilities');

/**
 * Manages availability of objects in object pools.
 *
 * @extends Uint16Array
 */
class Pool extends Uint16Array {
  /**
   * @param {number} size the size of the pool
   */
  constructor(size) {
    super(Pool.getLength(size));
    this.fill(65535);
    Object.defineProperties(this, {
      nextAvailable: { value: 0, writable: true },
    });
  }

  /**
   * Gets the next available index in the pool.
   *
   * @returns {number} the next available index
   */
  get() {
    const { nextAvailable } = this;
    if (!~nextAvailable) return -1;
    const record = this[nextAvailable];
    const index = utilities.getLSBIndex(record);
    this[nextAvailable] &= ~(1 << index);

    // record is full, find next empty
    if (this[nextAvailable] === 0) {
      this.nextAvailable = -1;
      for (let i = 0; i < this.length; i++) {
        if (this[i] !== 0) {
          this.nextAvailable = i;
          break;
        }
      }
    }

    return (nextAvailable << 4) + index;
  }

  /**
   * Makes a given index available.
   *
   * @param {number} index index to be freed
   * @returns {void}
   */
  free(index) {
    const record = index >> 4;
    const position = index - (record << 4);
    this[record] |= 1 << position;
    this.nextAvailable = record;
  }

  /**
   * Returns the length of underlying TypedArray required to hold the pool.
   *
   * @param {number} size
   * @returns {number}
   */
  static getLength(size) {
    return Math.ceil(size / 16);
  }
}

module.exports = Pool;
