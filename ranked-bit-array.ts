import type { Bit } from "./utility-types.ts";
import { BitArray } from "./bit-array.ts";
import { getLSBIndex, popCount32 } from "./utilities.ts";

/**
 * A bit array that supports constant time rank and O(logN) time select operations.
 *
 * @example
 * const array = RankedBitArray.create(10);
 * array.setBit(1).setBit(3).setBit(7);
 * array.rank(2);
 * //=> 1
 * array.rank(7);
 * //=> 2
 * array.select(2);
 * //=> 3
 */
export class RankedBitArray extends BitArray {
  /**
   * The amount of bits in the array.
   */
  get size(): number {
    return (this.length >> 1) << 5;
  }

  /**
   * Returns the length of the underlying TypedArray required to hold the given amount of bits.
   *
   * @param size the amount of bits
   * @return the required length
   */
  static getLength(size: number): number {
    return Math.ceil(size / 32) << 1;
  }

  /**
   * Returns the rank of a bit at a given index.
   *
   * @param index the index
   * @return the rank
   */
  rank(index: number): number {
    const { bucket, position } = this.getBitPosition(index);
    const value = this[bucket];
    // mask out following bits
    const masked = value & ((1 << position) - 1);
    const localRank = popCount32(masked);
    const bucketRank = bucket ? this[(this.length >> 1) + bucket - 1] : 0;
    return bucketRank + localRank;
  }

  /**
   * Returns the select of a bit at a given index.
   *
   * @param index the index
   * @return the select
   */
  select(index: number): number {
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
      } else if (index === this[bucketRankId - 1]) {
        // preceded by a duplicate
        right = bucketRankId - 1;
      } else {
        break;
      }
    }
    bucketRankId = index === this[bucketRankId] ? bucketRankId : left;

    if (bucketRankId >= this.length) return -1;

    let rank = bucketRankId > middle ? this[bucketRankId - 1] : 0;
    const bucket = bucketRankId - middle;
    let value = this[bucket];
    while (value) {
      const position = getLSBIndex(value);
      value &= value - 1;
      rank++;
      if (rank === index) {
        return (bucket << 5) + position;
      }
    }
    return -1;
  }

  /**
   * Sets the bit at a given index.
   *
   * @param index the index
   * @param value the value
   * @return this
   */
  setBit(index: number, value: Bit = 1): this {
    super.setBit(index, value);
    const change = value || -1;
    for (
      let i = (this.length >> 1) + this.lastPosition.bucket;
      i < this.length;
      i++
    ) {
      this[i] += change;
    }
    return this;
  }
}
