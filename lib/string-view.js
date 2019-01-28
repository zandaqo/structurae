const { searchNaive, searchShiftOr } = require('./algorithms');

const Encoder = new TextEncoder();
const Decoder = new TextDecoder();

/**
 * Extends Uint8Array to handle C-like representation of UTF-8 strings.
 *
 * @extends Uint8Array
 */
class StringView extends Uint8Array {
  /**
   * Performs an in-place replacement within the StringView
   * of all occurrences of a given pattern with a given replacement.
   *
   * @param {Collection} pattern the pattern to be replaced
   * @param {Collection} replacement the replacement
   * @returns {StringView}
   */
  replace(pattern, replacement) {
    let position = 0;
    while (position < this.length) {
      const currentIndex = this.search(pattern, position);
      if (!~currentIndex) break;
      this.set(replacement, currentIndex);
      position = currentIndex + replacement.length;
    }
    return this;
  }

  /**
   * Reverses the characters of the StringView in-place.
   *
   * @returns {StringView}
   */
  reverse() {
    const last = this.length - 1;
    for (let i = 0, j = last; i < j; i++, j--) {
      [this[i], this[j]] = [this[j], this[i]];
    }
    let j = this.length;
    while (--j > 0) {
      switch ((this[j] & 0xF0) >> 4) {
        case 0xF:
          [this[j], this[j - 3]] = [this[j - 3], this[j]];
          [this[j - 1], this[j - 2]] = [this[j - 2], this[j - 1]];
          j -= 3;
          break;
        case 0xE:
          [this[j], this[j - 2]] = [this[j - 2], this[j]];
          j -= 2;
          break;
        case 0xC:
        case 0xD:
          [this[j], this[j - 1]] = [this[j - 1], this[j]];
          j--;
          break;
      }
    }
    return this;
  }

  /**
   * Returns the index within the calling StringView
   * of the first occurrence of the specified value, starting the search at start.
   * Returns -1 if the value is not found.
   *
   * @param {Collection} searchValue the value to search for
   * @param {number} [fromIndex] the index at which to start the search
   * @returns {number} the index of the first occurrence of the specified value
   */
  search(searchValue, fromIndex = 0) {
    if (this.length > 256 && searchValue.length < 32) {
      return searchShiftOr(this, searchValue, fromIndex, this.constructor.masks);
    }
    return searchNaive(this, searchValue, fromIndex);
  }

  /**
   * Returns a string representation of the StringView.
   *
   * @returns {string}
   */
  toString() {
    return Decoder.decode(this.trim());
  }

  /**
   * Returns a StringView without trailing zeros.
   *
   * @returns {StringView}
   */
  trim() {
    const end = this.indexOf(0);
    return (~end) ? this.subarray(0, end) : this;
  }

  /**
   * Creates a StringView from a string.
   *
   * @param {string} string the string to encode
   * @param {number} [size] the size of the StringView in bytes
   * @returns {StringView} a new StringView
   */
  static fromString(string, size) {
    const encoded = Encoder.encode(string);
    if (size) {
      const view = new this(size);
      view.set(encoded);
      return view;
    }
    return new this(encoded);
  }

  /**
   * Returns the size in bytes of a given string.
   *
   * @param {string} string the string to check
   * @returns {number} the size in bytes
   */
  static getStringSize(string) {
    let size = 0;
    for (let i = 0; i < string.length; i++) {
      const code = string.codePointAt(i);
      if (code < 0x0080) size += 1; // 1-byte
      else if (code < 0x0800) size += 2; // 2-byte
      else if (code < 0x10000) size += 3; // 3-byte
      else { // 4-byte
        size += 4;
        i++;
      }
    }
    return size;
  }
}

/**
 * @type Int8Array
 * @private
 */
StringView.masks = new Int8Array(256).fill(-1);

module.exports = StringView;
