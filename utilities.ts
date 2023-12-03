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
  return 31 - Math.clz32(value & -value);
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
