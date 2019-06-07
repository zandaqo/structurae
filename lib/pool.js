const BitArray = require('./bit-array');
const utilities = require('./utilities');

/**
 * Manages availability of objects in object pools.
 *
 * @extends BitArray
 */
class Pool extends BitArray {
  /**
   * @param {number} size the size of the pool
   */
  constructor(size) {
    super(size);
    this.fill(4294967295);
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

    return (nextAvailable << 5) + index;
  }

  /**
   * Makes a given index available.
   *
   * @param {number} index index to be freed
   * @returns {void}
   */
  free(index) {
    const { bucket, position } = this.getBitPosition(index);
    this[bucket] |= 1 << position;
    this.nextAvailable = bucket;
  }
}

module.exports = Pool;
