const BigInt = globalThis.BigInt || Number;

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
  return (((b + (b >> 4)) & 0xf0f0f0f) * 0x1010101) >> 24;
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

/**
 * Returns the minimum amount of bits necessary to hold a given number.
 *
 * @param {number} number
 * @returns {number} the amount of bits
 */
function getBitSize(number) {
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

const typeGetters = {
  int8: DataView.prototype.getInt8,
  uint8: DataView.prototype.getUint8,
  int16: DataView.prototype.getInt16,
  uint16: DataView.prototype.getUint16,
  int32: DataView.prototype.getInt32,
  uint32: DataView.prototype.getUint32,
  float32: DataView.prototype.getFloat32,
  float64: DataView.prototype.getFloat64,
  bigint64: DataView.prototype.getBigInt64,
  biguint64: DataView.prototype.getBigUint64,
};

const typeSetters = {
  int8: DataView.prototype.setInt8,
  uint8: DataView.prototype.setUint8,
  int16: DataView.prototype.setInt16,
  uint16: DataView.prototype.setUint16,
  int32: DataView.prototype.setInt32,
  uint32: DataView.prototype.setUint32,
  float32: DataView.prototype.setFloat32,
  float64: DataView.prototype.setFloat64,
  bigint64: DataView.prototype.setBigInt64,
  biguint64: DataView.prototype.setBigUint64,
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

/**
 * Converts a JS string into a UTF8 byte array.
 * Shamelessly stolen from Google Closure:
 * https://github.com/google/closure-library/blob/master/closure/goog/crypt/crypt.js
 *
 * TODO: use TextEncoder#encode/encodeInto when the following issues are resolved:
 * - https://bugs.chromium.org/p/v8/issues/detail?id=4383
 * - https://bugs.webkit.org/show_bug.cgi?id=193274
 *
 * @param {string} string
 * @param {Uint8Array} [bytes]
 * @returns {Uint8Array}
 */
function stringToUTF8(string, bytes) {
  const out = bytes || [];
  let p = 0;
  for (let i = 0; i < string.length; i++) {
    let c = string.charCodeAt(i);
    if (c < 128) {
      out[p++] = c;
    } else if (c < 2048) {
      out[p++] = (c >> 6) | 192;
      out[p++] = (c & 63) | 128;
    } else if (
      (c & 0xfc00) === 0xd800 &&
      i + 1 < string.length &&
      (string.charCodeAt(i + 1) & 0xfc00) === 0xdc00
    ) {
      // Surrogate Pair
      c = 0x10000 + ((c & 0x03ff) << 10) + (string.charCodeAt(++i) & 0x03ff);
      out[p++] = (c >> 18) | 240;
      out[p++] = ((c >> 12) & 63) | 128;
      out[p++] = ((c >> 6) & 63) | 128;
      out[p++] = (c & 63) | 128;
    } else {
      out[p++] = (c >> 12) | 224;
      out[p++] = ((c >> 6) & 63) | 128;
      out[p++] = (c & 63) | 128;
    }
  }
  return out;
}

/**
 * Converts a UTF8 byte array into a JS string.
 *
 * @param {Uint8Array} bytes
 * @returns {string}
 */
function UTF8ToString(bytes) {
  const out = [];
  let pos = 0;
  let c = 0;
  while (pos < bytes.length) {
    const c1 = bytes[pos++];
    if (c1 < 128) {
      out[c++] = String.fromCharCode(c1);
    } else if (c1 > 191 && c1 < 224) {
      out[c++] = String.fromCharCode(((c1 & 31) << 6) | (bytes[pos++] & 63));
    } else if (c1 > 239 && c1 < 365) {
      // Surrogate Pair
      const u =
        (((c1 & 7) << 18) |
          ((bytes[pos++] & 63) << 12) |
          ((bytes[pos++] & 63) << 6) |
          (bytes[pos++] & 63)) -
        0x10000;
      out[c++] = String.fromCharCode(0xd800 + (u >> 10));
      out[c++] = String.fromCharCode(0xdc00 + (u & 1023));
    } else {
      out[c++] = String.fromCharCode(
        ((c1 & 15) << 12) | ((bytes[pos++] & 63) << 6) | (bytes[pos++] & 63),
      );
    }
  }
  return out.join('');
}

module.exports = {
  log2,
  popCount32,
  getLSBIndex,
  getBitSize,
  typeGetters,
  typeSetters,
  typeOffsets,
  stringToUTF8,
  UTF8ToString,
};
