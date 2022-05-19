import type { IndexedCollection } from "./utility-types.ts";
import type { PrimitiveView } from "./view-types.ts";

export class StringView extends DataView implements PrimitiveView<string> {
  static viewLength = 0;
  static masks = new Int8Array(256).fill(-1);
  static decoder = new TextDecoder();
  static encoder = new TextEncoder();

  /**
   * The amount of UTF characters in the StringView.
   */
  get size() {
    let size = 0;
    for (let i = 0; i < this.byteLength; i++) {
      if (this.getUint8(i) >> 6 !== 2) size++;
    }
    return size;
  }

  /**
   * Converts a UTF8 byte array into a JS string.
   * Adopted from Google Closure:
   * https://github.com/google/closure-library/blob/master/closure/goog/crypt/crypt.js
   *
   * @param view the view to decode
   * @param start the starting offset
   * @param length the byte length to decode
   * @return the JavaScript value
   */
  static decode(view: DataView, start = 0, length = view.byteLength): string {
    if (length > 200) {
      const arrayOffset = view.byteOffset + start;
      const arrayLength = length === view.byteLength
        ? length - arrayOffset
        : length;
      return this.decoder.decode(
        new Uint8Array(view.buffer, arrayOffset, arrayLength),
      );
    }
    const out = [];
    const end = start + length;
    let pos = start;
    let c = 0;
    while (pos < end) {
      const c1 = view.getUint8(pos++);
      // bail on zero byte
      if (c1 === 0) break;
      if (c1 < 128) {
        out[c++] = c1;
      } else if (c1 > 191 && c1 < 224) {
        out[c++] = ((c1 & 31) << 6) | (view.getUint8(pos++) & 63);
      } else if (c1 > 239 && c1 < 365) {
        // Surrogate Pair
        const u = (((c1 & 7) << 18) |
          ((view.getUint8(pos++) & 63) << 12) |
          ((view.getUint8(pos++) & 63) << 6) |
          (view.getUint8(pos++) & 63)) -
          0x10000;
        out[c++] = 0xd800 + (u >> 10);
        out[c++] = 0xdc00 + (u & 1023);
      } else {
        out[c++] = ((c1 & 15) << 12) |
          ((view.getUint8(pos++) & 63) << 6) |
          (view.getUint8(pos++) & 63);
      }
    }
    return String.fromCharCode.apply(String, out);
  }

  /**
   * Converts a JS string into a UTF8 byte array.
   * Adopted from Deno:
   * https://github.com/denoland/deno/blob/18a684ab1c20914e13c27bc10e20bda6396ea38d/extensions/web/08_text_encoding.js#L79
   *
   * @param value the value to encode
   * @param view the view to encode into
   * @param start the view offset to start
   * @param length the byte length to encode
   * @return the amount of written bytes
   */
  static encode(
    value: string,
    view: DataView,
    start = 0,
    length?: number,
  ): number {
    let written = 0;
    const valueLength = value.length;
    const byteLength = length ?? (valueLength << 1) + valueLength;
    if (byteLength > 300) {
      ({ written } = this.encoder.encodeInto(
        value,
        new Uint8Array(view.buffer, view.byteOffset + start, length),
      ));
    } else {
      let read = 0;
      const maxLength = Math.min(byteLength, view.byteLength);
      while (read < valueLength) {
        const badCodePoint = 0xfffd;
        const codeUnit = value.charCodeAt(read++);
        const surrogateMask = codeUnit & 0xfc00;
        let codePoint = codeUnit;
        if (surrogateMask === 0xd800) {
          if (read < valueLength) {
            const nextCodeUnit = value.charCodeAt(read);
            if ((nextCodeUnit & 0xfc00) === 0xdc00) {
              codePoint = 0x10000 + ((codeUnit & 0x3ff) << 10) +
                (nextCodeUnit & 0x3ff);
              read++;
            } else {
              codePoint = badCodePoint;
            }
          } else {
            codePoint = badCodePoint;
          }
        } else if (surrogateMask === 0xdc00) {
          codePoint = badCodePoint;
        }
        const availableSpace = maxLength - written;
        if (availableSpace < 4) {
          if (
            availableSpace < 1 ||
            (availableSpace < 2 && codePoint >= 0x80) ||
            (availableSpace < 3 && codePoint >= 0x800) ||
            codePoint >= 0x10000
          ) {
            const isSurrogatePair = codePoint !== codeUnit &&
              codePoint !== badCodePoint;
            read -= isSurrogatePair ? 2 : 1;
            break;
          }
        }

        if (codePoint < 0x80) {
          view.setUint8(start + written++, codePoint);
        } else if (codePoint < 0x800) {
          view.setUint8(start + written++, 0xc0 | (0x1f & (codePoint >> 6)));
          view.setUint8(start + written++, 0x80 | (0x3f & codePoint));
        } else if (codePoint < 0x10000) {
          view.setUint8(start + written++, 0xe0 | (0x0f & (codePoint >> 12)));
          view.setUint8(start + written++, 0x80 | (0x3f & (codePoint >> 6)));
          view.setUint8(start + written++, 0x80 | (0x3f & codePoint));
        } else {
          view.setUint8(start + written++, 0xf0 | (0x07 & (codePoint >> 18)));
          view.setUint8(start + written++, 0x80 | (0x3f & (codePoint >> 12)));
          view.setUint8(start + written++, 0x80 | (0x3f & (codePoint >> 6)));
          view.setUint8(start + written++, 0x80 | (0x3f & codePoint));
        }
      }
    }
    if (length) {
      // zero-out remaining bytes if length is provided
      let caret = written;
      while (caret < length) view.setUint8(start + caret++, 0);
    }
    return written;
  }

  /**
   * Creates a StringView from a string or an array like object.
   *
   * @param value the string to encode
   * @return the new view
   */
  static from(value: string): StringView {
    const length = this.getLength(value);
    const view = new this(new ArrayBuffer(length));
    this.encode(value, view);
    return view;
  }

  /**
   * Returns the size in bytes of a given string.
   *
   * @param string the string to check
   * @return the size in bytes
   */
  static getLength(string = ""): number {
    let size = 0;
    for (let i = 0; i < string.length; i++) {
      const code = string.codePointAt(i)!; // todo test
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

  /**
   * Returns a new string consisting of the single UTF character
   * located at the specified character index.
   *
   * @param index a character index
   * @return a string representing the character
   */
  charAt(index = 0): string {
    return this.toChar(this.getCharStart(index));
  }

  /**
   * Iterates over the characters in the StringView.
   */
  *characters(): Generator<string, void, unknown> {
    for (let i = 0; i < this.byteLength; i++) {
      if (this.getUint8(i) >> 6 !== 2) {
        yield this.toChar(i);
      }
    }
  }

  /**
   * Returns the string encoded in the StringView.
   */
  get(): string {
    return (this.constructor as typeof StringView).decode(this);
  }

  /**
   * Returns the index of the first byte of a character.
   *
   * @param index a character index
   * @return the index of the first byte of a character
   */
  getCharStart(index: number, startCharIndex = -1, startIndex = 0): number {
    let current = startCharIndex;
    for (let i = startIndex; i < this.byteLength; i++) {
      if (this.getUint8(i) >> 6 !== 2) current++;
      if (current === index) return i;
    }
    return -1;
  }

  /**
   * Performs an in-place replacement within the StringView
   * of all occurrences of a given pattern with a given replacement.
   *
   * @param pattern the pattern to be replaced
   * @param replacement the replacement
   * @return this
   */
  replace(pattern: IndexedCollection, replacement: IndexedCollection): this {
    let position = 0;
    while (position < this.byteLength) {
      const currentIndex = this.indexOf(pattern, position);
      if (!~currentIndex) break;
      new Uint8Array(this.buffer).set(replacement, currentIndex);
      position = currentIndex + replacement.length;
    }
    return this;
  }

  /**
   * Reverses the characters of the StringView in-place.
   *
   * @return this
   */
  reverse(): this {
    const last = this.byteLength - 1;
    for (let i = 0, j = last; i < j; i++, j--) {
      this.swapChar(i, j);
    }
    let j = this.byteLength;
    while (--j > 0) {
      switch ((this.getUint8(j) & 0xf0) >> 4) {
        case 0xf:
          this.swapChar(j, j - 3);
          this.swapChar(j - 1, j - 2);
          j -= 3;
          break;
        case 0xe:
          this.swapChar(j, j - 2);
          j -= 2;
          break;
        case 0xc:
        case 0xd:
          this.swapChar(j, j - 1);
          j--;
          break;
        default:
          break;
      }
    }
    return this;
  }

  /**
   * Checks whether the provided encoded sequence is found inside the view.
   *
   * @param searchValue the value to search for
   * @param position the starting position
   * @return whether the value is found
   */
  includes(searchValue: IndexedCollection, position?: number): boolean {
    return this.indexOf(searchValue, position) !== -1;
  }

  /**
   * Returns the index within the StringView
   * of the first occurrence of the specified value, starting the search at start.
   * Returns -1 if the value is not found.
   *
   * @param searchValue the value to search for
   * @param fromIndex the index at which to start the search
   * @return the index of the first occurrence of the specified value
   */
  indexOf(searchValue: IndexedCollection, fromIndex = 0): number {
    if (this.byteLength > 256 && searchValue.length < 32) {
      return this.searchShiftOr(searchValue, fromIndex);
    }
    return this.searchNaive(searchValue, fromIndex);
  }

  searchNaive(searchValue: IndexedCollection, start: number): number {
    const wordLength = searchValue.length;
    const max = this.byteLength - wordLength;
    outer:
    for (let i = start; i <= max; i++) {
      for (let j = 0; j < wordLength; j++) {
        if (this.getUint8(i + j) !== searchValue[j]) {
          continue outer;
        }
      }
      return i;
    }
    return -1;
  }

  searchShiftOr(searchValue: IndexedCollection, start: number): number {
    const { masks } = this.constructor as typeof StringView;
    const m = searchValue.length;
    const m1 = 1 << m;
    masks.fill(-1);
    let r = -2;
    for (let i = 0; i < m; i++) {
      masks[searchValue[i]] &= ~(1 << i);
    }
    for (let i = start; i < this.byteLength; i++) {
      r |= masks[this.getUint8(i)];
      r <<= 1;
      if ((r & m1) === 0) {
        return i - m + 1;
      }
    }
    return -1;
  }

  /**
   * Encodes a given string into the StringView
   */
  set(value: string): void {
    (this.constructor as typeof StringView).encode(
      value,
      this,
      0,
      this.byteLength,
    );
  }

  /**
   * Returns a string of characters between the start and end
   * character indexes, or to the end of the string.
   *
   * @param indexStart the character index of the first character to include
   * @param indexEnd the character index of the first character to exclude
   * @return a new string containing the specified part of the given string
   */
  substring(indexStart = 0, indexEnd = this.size): string {
    const start = this.getCharStart(indexStart);
    // return empty string if no character is found;
    if (start === -1) return "";
    const end = this.getCharStart(indexEnd, indexStart, start);
    return (this.constructor as typeof StringView).decode(
      this,
      start,
      end - start + 1,
    );
  }

  toChar(index: number): string {
    // check boundaries
    if (index < 0 || index > this.byteLength) return "";
    const point = this.getUint8(index);
    if (point < 0x80) return String.fromCodePoint(point);
    switch ((point & 0xf0) >> 4) {
      case 0xf:
        return String.fromCodePoint(
          ((point & 0x07) << 18) |
            ((this.getUint8(index + 1) & 0x3f) << 12) |
            ((this.getUint8(index + 2) & 0x3f) << 6) |
            (this.getUint8(index + 3) & 0x3f),
        );
      case 0xe:
        return String.fromCodePoint(
          ((point & 0x0f) << 12) |
            ((this.getUint8(index + 1) & 0x3f) << 6) |
            (this.getUint8(index + 2) & 0x3f),
        );
      case 0xd:
      case 0xc:
        return String.fromCodePoint(
          ((point & 0x1f) << 6) | (this.getUint8(index + 1) & 0x3f),
        );
      default:
        return "";
    }
  }

  /**
   * Returns a string value of the StringView.
   */
  toJSON(): string {
    return this.get();
  }

  /**
   * Returns a string value of the StringView.
   */
  toString(): string {
    return this.get();
  }

  /**
   * Returns a StringView without trailing zeros.
   */
  trim(): StringView {
    let end = -1;
    while (++end < this.byteLength) {
      if (this.getUint8(end) === 0) break;
    }
    return end !== this.byteLength
      ? new (this.constructor as typeof StringView)(
        this.buffer,
        this.byteOffset,
        end,
      )
      : this;
  }

  swapChar(i: number, j: number): void {
    const temp = this.getUint8(i);
    this.setUint8(i, this.getUint8(j));
    this.setUint8(j, temp);
  }
}
