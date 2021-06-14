/**
 * Lookup table for powers of 2
 */
export const log2: Record<number, number> = {
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
  65536: 16,
  131072: 17,
  262144: 18,
  524288: 19,
  1048576: 20,
  2097152: 21,
  4194304: 22,
  8388608: 23,
  16777216: 24,
  33554432: 25,
  67108864: 26,
  134217728: 27,
  268435456: 28,
  536870912: 29,
  1073741824: 30,
  2147483648: 31,
};

/**
 * Counts set bits in a given number.
 *
 * @param value the number
 * @return the amount of set bits
 */
export function popCount32(value: number): number {
  const a = value - ((value >> 1) & 0x55555555);
  const b = (a & 0x33333333) + ((a >> 2) & 0x33333333);
  return (((b + (b >> 4)) & 0xf0f0f0f) * 0x1010101) >> 24;
}

/**
 * Returns the index of the Least Significant Bit in a number.
 *
 * @param value the number
 * @return the index of LSB
 */
export function getLSBIndex(value: number): number {
  if (value === 2147483648) return 31;
  return log2[value & -value];
}

/**
 * Returns the minimum amount of bits necessary to hold a given number.
 *
 * @param number the number
 * @return the amount of bits necessary
 */
export function getBitSize(number: number): number {
  if (number < 281474976710656) return (Math.log2(number) | 0) + 1;
  const n = BigInt(number);
  const [zero, one, two] = [BigInt(0), BigInt(1), BigInt(2)];
  let high = BigInt(53);
  let low = BigInt(48);

  while (high - low > one) {
    const mid = (high + low) / two;
    const maskHigh = (one << high) - (one << mid);
    if ((maskHigh & n) > zero) {
      low = mid;
    } else {
      high = mid;
    }
  }
  return Number(low + one);
}

export function getLog2(value: number): number {
  return Math.ceil(Math.log2(value));
}
