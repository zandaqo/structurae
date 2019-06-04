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
 * @param {number} value
 * @returns {number}
 */
function popCount32(value) {
  const a = value - ((value >> 1) & 0x55555555);
  const b = (a & 0x33333333) + ((a >> 2) & 0x33333333);
  return ((b + (b >> 4) & 0xF0F0F0F) * 0x1010101) >> 24;
}

/**
 * @param {number} value
 * @returns {number}
 */
function getLSBIndex(value) {
  return log2[value & -value];
}

module.exports = {
  log2,
  popCount32,
  getLSBIndex,
};
