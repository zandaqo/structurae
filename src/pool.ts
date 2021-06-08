import { BitArray } from "./bit-array";
import { getLSBIndex } from "./utilities";

/**
 * Manages availability of objects in object pools.
 */
export class Pool extends BitArray {
  nextAvailable = 0;

  /**
   * @param size the size of the pool
   */
  constructor(size: number) {
    super(size);
    this.fill(4294967295);
  }

  /**
   * Makes a given index available.
   *
   * @param index index to be freed
   */
  free(index: number): void {
    const { bucket, position } = this.getBitPosition(index);
    this[bucket] |= 1 << position;
    this.nextAvailable = bucket;
  }

  /**
   * Gets the next available index in the pool.
   *
   * @return the next available index
   */
  get(): number {
    const { nextAvailable } = this;
    if (!~nextAvailable) return -1;
    const record = this[nextAvailable];
    const index = getLSBIndex(record);
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
}
