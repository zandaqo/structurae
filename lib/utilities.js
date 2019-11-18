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
 * @param {number} value
 * @returns {number}
 */
function popCount32(value) {
  const a = value - ((value >> 1) & 0x55555555);
  const b = (a & 0x33333333) + ((a >> 2) & 0x33333333);
  return ((b + (b >> 4) & 0xF0F0F0F) * 0x1010101) >> 24;
}

/**
 * Returns the index of the Least Significant Bit in a number.
 *
 * @param {number} value
 * @returns {number}
 */
function getLSBIndex(value) {
  if (value === 2147483648) return 31;
  return log2[value & -value];
}

const typeGetters = {
  int8: 'getInt8',
  uint8: 'getUint8',
  int16: 'getInt16',
  uint16: 'getUint16',
  int32: 'getInt32',
  uint32: 'getUint32',
  float32: 'getFloat32',
  float64: 'getFloat64',
  bigint64: 'getBigInt64',
  biguint64: 'getBigUint64',
};

const typeSetters = {
  int8: 'setInt8',
  uint8: 'setUint8',
  int16: 'setInt16',
  uint16: 'setUint16',
  int32: 'setInt32',
  uint32: 'setUint32',
  float32: 'setFloat32',
  float64: 'setFloat64',
  bigint64: 'setBigInt64',
  biguint64: 'setBigUint64',
};

const typeOffsets = {
  int8: 0,
  uint8: 0,
  int16: 1,
  uint16: 1,
  int32: 2,
  uint32: 2,
  float32: 2,
  float64: 3,
  bigint64: 3,
  biguint64: 3,
};


module.exports = {
  log2,
  popCount32,
  getLSBIndex,
  typeGetters,
  typeSetters,
  typeOffsets,
};
