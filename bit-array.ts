import type { Bit } from "./utility-types.ts";

type BitPosition = {
  bucket: number;
  position: number;
};

/**
 * Uses Uint32Array as an array or vector of bits. It's a simpler version of BitField
 * that only sets and checks individual bits.
 *
 * @example
 * const array = BitArray.create(10);
 * array.getBit(0);
 * //=> 0
 * array.setBit(0).getBit(0);
 * //=> 1
 * array.size;
 * //=> 10
 * array.length;
 * //=> 1
 */
export class BitArray extends Uint32Array {
  lastPosition: BitPosition = { bucket: 0, position: 0 };

  static get [Symbol.species]() {
    return Uint32Array;
  }

  /**
   * The amount of bits in the array.
   */
  get size(): number {
    return this.length << 5;
  }

  /**
   * Creates a BitArray of the specified size.
   *
   * @param size the maximum amount of bits in the array
   * @return a new BitArray
   */
  static create<T extends typeof BitArray>(
    this: T,
    size: number,
  ): InstanceType<T> {
    return new this(this.getLength(size)) as InstanceType<T>;
  }

  /**
   * Returns the length of the underlying TypedArray required to hold the given amount of bits.
   *
   * @param size the amount of bits
   * @return the required length
   */
  static getLength(size: number): number {
    return Math.ceil(size / 32);
  }

  /**
   * Returns the bit at a given index.
   *
   * @param index the index
   * @return the bit
   */
  getBit(index: number): Bit {
    const { bucket, position } = this.getBitPosition(index);
    return ((this[bucket] >> position) & 1) as Bit;
  }

  getBitPosition(index: number): BitPosition {
    const bucket = index >> 5;
    this.lastPosition.bucket = bucket;
    this.lastPosition.position = index - (bucket << 5);
    return this.lastPosition;
  }

  /**
   * Sets the bit at a given index.
   *
   * @param index the index
   * @param value the value
   * @return this
   */
  setBit(index: number, value: Bit = 1): this {
    const { bucket, position } = this.getBitPosition(index);
    this[bucket] = (this[bucket] & ~(1 << position)) | (value << position);
    return this;
  }
}
