const ArrayView = require('./array-view');

/**
 * Extends Uint8Array to handle C-like representation of UTF-8 encoded strings.
 *
 * @extends Uint8Array
 */
class StringView extends Uint8Array {
  /**
   * Iterates over the characters in the StringView.
   *
   * @returns {Iterable<string>}
   * @example
   * const stringView = StringView.fromString('abc😀');
   * [...stringView.characters()]
   * //=> ['a', 'b', 'c', '😀']
   */
  *characters() {
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
    switch ((point & 0xf0) >> 4) {
      case 0xf:
        return index + 3;
      case 0xe:
        return index + 2;
      case 0xd:
      case 0xc:
        return index + 1;
      default:
        return -1;
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
      switch ((this[j] & 0xf0) >> 4) {
        case 0xf:
          [this[j], this[j - 3]] = [this[j - 3], this[j]];
          [this[j - 1], this[j - 2]] = [this[j - 2], this[j - 1]];
          j -= 3;
          break;
        case 0xe:
          [this[j], this[j - 2]] = [this[j - 2], this[j]];
          j -= 2;
          break;
        case 0xc:
        case 0xd:
          [this[j], this[j - 1]] = [this[j - 1], this[j]];
          j--;
          break;
        default:
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
      return this.searchShiftOr(searchValue, fromIndex);
    }
    return this.searchNaive(searchValue, fromIndex);
  }

  /**
   * @private
   * @param {Collection} searchValue
   * @param {number} start
   * @returns {number}
   */
  searchNaive(searchValue, start) {
    const wordLength = searchValue.length;
    const max = this.length - wordLength;
    outer: for (let i = start; i <= max; i++) {
      for (let j = 0; j < wordLength; j++) {
        if (this[i + j] !== searchValue[j]) {
          continue outer;
        }
      }
      return i;
    }
    return -1;
  }

  /**
   * @private
   * @param {Collection} searchValue
   * @param {number} start
   * @returns {number}
   */
  searchShiftOr(searchValue, start) {
    const { masks } = this.constructor;
    const m = searchValue.length;
    const m1 = 1 << m;
    masks.fill(-1);
    let r = -2;
    for (let i = 0; i < m; i++) {
      masks[searchValue[i]] &= ~(1 << i);
    }
    for (let i = start; i < this.length; i++) {
      r |= masks[this[i]];
      r <<= 1;
      if ((r & m1) === 0) {
        return i - m + 1;
      }
    }
    return -1;
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
      if (this[i] >> 6 !== 2) size++;
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
    return this.constructor.decoder.decode(sub);
  }

  /**
   * @private
   * @param {number} index
   * @returns {string}
   */
  toChar(index) {
    const point = this[index];
    if (point < 0x80) return String.fromCodePoint(point);
    switch ((point & 0xf0) >> 4) {
      case 0xf:
        return String.fromCodePoint(
          ((point & 0x07) << 18) |
            ((this[index + 1] & 0x3f) << 12) |
            ((this[index + 2] & 0x3f) << 6) |
            (this[index + 3] & 0x3f),
        );
      case 0xe:
        return String.fromCodePoint(
          ((point & 0x0f) << 12) | ((this[index + 1] & 0x3f) << 6) | (this[index + 2] & 0x3f),
        );
      case 0xd:
      case 0xc:
        return String.fromCodePoint(((point & 0x1f) << 6) | (this[index + 1] & 0x3f));
      default:
        return '';
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
    return this.constructor.decode(this);
  }

  /**
   * @returns {string}
   */
  toJSON() {
    return this.constructor.decode(this);
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
    return ~end ? this.subarray(0, end) : this;
  }

  /**
   * Converts a UTF8 byte array into a JS string.
   * Shamelessly stolen from Google Closure:
   * https://github.com/google/closure-library/blob/master/closure/goog/crypt/crypt.js
   *
   * @param {Uint8Array} bytes
   * @returns {string}
   */
  static decode(bytes) {
    const out = [];
    let pos = 0;
    let c = 0;
    while (pos < bytes.length) {
      const c1 = bytes[pos++];
      // bail on zero byte
      if (c1 === 0) break;
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
   * @param {Array|Uint8Array} bytes
   * @param {number} [start=0]
   * @param {number} [length]
   * @returns {number}
   */
  static encode(string, bytes, start = 0, length) {
    let p = start;
    for (let i = 0; i < string.length; i++) {
      let c = string.charCodeAt(i);
      if (c < 128) {
        bytes[p++] = c;
      } else if (c < 2048) {
        bytes[p++] = (c >> 6) | 192;
        bytes[p++] = (c & 63) | 128;
      } else if (
        (c & 0xfc00) === 0xd800 &&
        i + 1 < string.length &&
        (string.charCodeAt(i + 1) & 0xfc00) === 0xdc00
      ) {
        // Surrogate Pair
        c = 0x10000 + ((c & 0x03ff) << 10) + (string.charCodeAt(++i) & 0x03ff);
        bytes[p++] = (c >> 18) | 240;
        bytes[p++] = ((c >> 12) & 63) | 128;
        bytes[p++] = ((c >> 6) & 63) | 128;
        bytes[p++] = (c & 63) | 128;
      } else {
        bytes[p++] = (c >> 12) | 224;
        bytes[p++] = ((c >> 6) & 63) | 128;
        bytes[p++] = (c & 63) | 128;
      }
    }
    if (!length) return p;

    // zero out remaining bytes
    while (p < length) {
      bytes[p++] = 0;
    }
    return p;
  }

  /**
   * Creates a StringView from a string or an array like object.

   * @param {...*} args
   * @returns {Uint8Array|StringView}
   */
  static from(...args) {
    // pass to builtin from if invoked on an array instead of string
    if (args[0] && typeof args[0] !== 'string') return super.from(...args);
    const [value, view, start, length] = args;
    // no view is supplied
    if (!view) {
      const array = [];
      this.encode(value, array);
      return new this(array);
    }
    const array = new Uint8Array(view.buffer, view.byteOffset + start, length || view.byteLength);
    this.encode(value, array, 0, length);
    return view;
  }

  /**
   * Returns a string representation of a given view.
   *
   * @param {View} view
   * @param {number} [start=0]
   * @param {length} [length]
   * @returns {string}
   */
  static toJSON(view, start = 0, length) {
    return this.decode(new this(view.buffer, view.byteOffset + start, length));
  }

  /* istanbul ignore next */
  /**
   * @deprecated Use String.getLength instead.
   * @param {string} string
   * @returns {number}
   */
  static getByteSize(string) {
    return this.getLength(string);
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
  static getLength(string) {
    let size = 0;
    for (let i = 0; i < string.length; i++) {
      const code = string.codePointAt(i);
      if (code < 0x0080) size += 1;
      // 1-byte
      else if (code < 0x0800) size += 2;
      // 2-byte
      else if (code < 0x10000) size += 3;
      // 3-byte
      else {
        // 4-byte
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

/**
 * @deprecated
 * @type TextEncoder
 */
StringView.encoder = new TextEncoder();

/**
 * @deprecated
 * @type TextDecoder
 */
StringView.decoder = new TextDecoder();

/**
 * @type {Class<ArrayView>}
 */
StringView.ArrayClass = ArrayView;

module.exports = StringView;
