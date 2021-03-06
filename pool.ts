import { BitArray } from "./bit-array.ts";
import { getLSBIndex } from "./utilities.ts";

/**
 * Implements a fast algorithm to manage availability of objects in an object pool using a BitArray.
 *
 * @example
 * // create a pool of 1600 indexes
 * const pool = Pool.create(100 * 16);
 *
 * // get the next available index and make it unavailable
 * pool.get();
 * //=> 0
 * pool.get();
 * //=> 1
 *
 * // set index available
 * pool.free(0);
 * pool.get();
 * //=> 0
 *
 * pool.get();
 * //=> 2
 */
export class Pool extends BitArray {
  nextAvailable = 0;

  /**
   * Creates a Pool of the specified size.
   *
   * @param size the size of the pool
   * @return a new Pool
   */
  static create<T extends typeof BitArray>(
    this: T,
    size: number,
  ): InstanceType<T> {
    const pool = new this(this.getLength(size));
    pool.fill(4294967295);
    return pool as InstanceType<T>;
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
