const log2 = {
  1: 0,
  2: 1,
  4: 2,
  8: 3,
  16: 4,
  32: 5,
  64: 6,
  128: 7,
  256: 8,
  512: 9,
  1024: 10,
  2048: 11,
  4096: 12,
  8192: 13,
  16384: 14,
  32768: 15,
};

/**
 * @extends Uint16Array
 */
class Pool extends Uint16Array {
  /**
   * @param {number} size the size of the pool
   */
  constructor(size) {
    super(size >> 4);
    this.fill(65535);
    Object.defineProperties(this, {
      nextAvailable: { value: 0, writable: true },
    });
  }

  /**
   * @returns {number} the first available index
   */
  acquire() {
    const { nextAvailable } = this;
    if (!~nextAvailable) return -1;
    const record = this[nextAvailable];
    const index = log2[record & -record];
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
   * @param {number} index index to be released
   * @returns {void}
   */
  release(index) {
    const record = index >> 4;
    const position = index - (record << 4);
    this[record] |= 1 << position;
    this.nextAvailable = record;
  }
}

module.exports = Pool;
