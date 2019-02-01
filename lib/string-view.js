const { searchNaive, searchShiftOr } = require('./algorithms');

const Encoder = new TextEncoder();
const Decoder = new TextDecoder();

/**
 * Extends Uint8Array to handle C-like representation of UTF-8 encoded strings.
 *
 * @extends Uint8Array
 */
class StringView extends Uint8Array {
  /**
   * Iterates over the characters in the StringView.
   *
   * @yields {string}
   * @example
   * const stringView = StringView.fromString('abc😀');
   * [...stringView.characters()]
   * //=> ['a', 'b', 'c', '😀']
   */
  * characters() {
    for (let i = 0; i < this.length; i++) {
      if (this[i] >> 6 !== 2) {
        yield this.toChar(i);
      }
    }
  }

  /**
   * Returns a new string consisting of the single UTF character
   * located at the specified character index.
   *
   * @param {number} [index=0] a character index
   * @returns {string} a string representing the character
   * @example
   * const stringView = StringView.fromString('abc😀');
   * stringView.charAt(0);
   * //=> 'a'
   * stringView.charAt(3);
   * //=> '😀'
   */
  charAt(index = 0) {
    return this.toChar(this.getCharStart(index));
  }

  /**
   * @private
   * @param {number} index
   * @returns {number}
   */
  getCharEnd(index) {
    const point = this[index];
    if (point < 0x80) return index;
    switch ((point & 0xF0) >> 4) {
      case 0xF: return index + 3;
      case 0xE: return index + 2;
      case 0xD:
      case 0xC: return index + 1;
      default: return -1;
    }
  }

  /**
   * @private
   * @param {number} index
   * @param {number} [startCharIndex=-1]
   * @param {number} [startIndex=0]
   * @returns {number}
   */
  getCharStart(index, startCharIndex = -1, startIndex = 0) {
    let current = startCharIndex;
    for (let i = startIndex; i < this.length; i++) {
      if (this[i] >> 6 !== 2) current++;
      if (current === index) return i;
    }
    return -1;
  }

  /**
   * Performs an in-place replacement within the StringView
   * of all occurrences of a given pattern with a given replacement.
   *
   * @param {Collection} pattern the pattern to be replaced
   * @param {Collection} replacement the replacement
   * @returns {StringView}
   * @example
   * const stringView = StringView.fromString('abc😀a');
   * const pattern = StringView.fromString('a');
   * const replacement = StringView.fromString('d');
   * stringView.replace(pattern, replacement).toString();
   * //=> 'dbc😀d'
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
   * @example
   * const stringView = StringView.fromString('abc😀a');
   * stringView.reverse().toString();
   * //=> 'a😀cba'
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
   * @param {number} [fromIndex=0] the index at which to start the search
   * @returns {number} the index of the first occurrence of the specified value
   * @example
   * const stringView = StringView.fromString('abc😀a');
   * const searchValue = StringView.fromString('😀');
   * stringView.search(searchValue);
   * //=> 3
   */
  search(searchValue, fromIndex = 0) {
    if (this.length > 256 && searchValue.length < 32) {
      return searchShiftOr(this, searchValue, fromIndex, this.constructor.masks);
    }
    return searchNaive(this, searchValue, fromIndex);
  }

  /**
   * The amount of UTF characters in the StringView.
   *
   * @type {number}
   * @example
   * const stringView = StringView.fromString('abc😀a');
   * stringView.size
   * //=> 5
   * stringView.length
   * //=> 8
   */
  get size() {
    let size = 0;
    for (let i = 0; i < this.length; i++) {
      if ((this[i] >> 6) !== 2) size++;
    }
    return size;
  }

  /**
   * Returns a string of characters between the start and end
   * character indexes, or to the end of the string.
   *
   * @param {number} indexStart the character index of the first character to include
   * @param {number} [indexEnd] the character index of the first character to exclude
   * @returns {string} a new string containing the specified part of the given string
   * @example
   * const stringView = StringView.fromString('abc😀a');
   * stringView.substring(0, 4);
   * //=> 'abc😀'
   * stringView.substring(2);
   * //=> 'c😀a'
   */
  substring(indexStart, indexEnd = this.size) {
    const start = this.getCharStart(indexStart);
    const end = this.getCharStart(indexEnd, indexStart, start);
    const sub = this.subarray(start, this.getCharEnd(end) + 1);
    return Decoder.decode(sub);
  }

  /**
   * @private
   * @param {number} index
   * @returns {string}
   */
  toChar(index) {
    const point = this[index];
    if (point < 0x80) return String.fromCodePoint(point);
    switch ((point & 0xF0) >> 4) {
      case 0xF: return String.fromCodePoint(((point & 0x07) << 18)
        | ((this[index + 1] & 0x3F) << 12)
        | ((this[index + 2] & 0x3F) << 6)
        | ((this[index + 3] & 0x3F)));
      case 0xE: return String.fromCodePoint(((point & 0x0F) << 12)
        | ((this[index + 1] & 0x3F) << 6)
        | ((this[index + 2] & 0x3F)));
      case 0xD:
      case 0xC: return String.fromCodePoint(((point & 0x1F) << 6)
        | ((this[index + 1] & 0x3F)));
      default: return '';
    }
  }

  /**
   * Returns a string representation of the StringView.
   *
   * @returns {string}
   * @example
   * const stringView = StringView.fromString('abc😀a');
   * stringView.toString();
   * //=> 'abc😀a'
   * stringView == 'abc😀a'
   * //=> true
   */
  toString() {
    return Decoder.decode(this.trim());
  }

  /**
   * Returns a StringView without trailing zeros.
   *
   * @returns {StringView}
   * @example
   * const stringView = StringView.fromString('abc😀a', 10);
   * stringView
   * //=> StringView [ 97, 98, 99, 240, 159, 152, 128, 97, 0, 0 ]
   * stringView.trim();
   * //=> StringView [ 97, 98, 99, 240, 159, 152, 128, 97 ]
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
   * @example
   * const stringView = StringView.fromString('abc😀a');
   * stringView
   * //=> StringView [ 97, 98, 99, 240, 159, 152, 128, 97 ]
   *
   * const stringView = StringView.fromString('abc😀a', 10);
   * stringView
   * //=> StringView [ 97, 98, 99, 240, 159, 152, 128, 97, 0, 0 ]
   */
  static fromString(string, size) {
    const encoded = Encoder.encode(string);
    if (size) {
      const view = new this(size);
      view.set(encoded);
      return view;
    }
    return new this(encoded.buffer);
  }

  /**
   * Returns the size in bytes of a given string without encoding it.
   *
   * @param {string} string the string to check
   * @returns {number} the size in bytes
   * @example
   * const stringView = StringView.getByteSize('abc😀a');
   * //=> 8
   */
  static getByteSize(string) {
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
