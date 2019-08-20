const StringView = require('./string-view');

/**
 * An array of StringViews. Uses an ArrayBuffer to hold an array of UTF-8 encoded strings.
 */
class StringArrayView {
  /**
   * @param {ArrayBuffer} buffer the buffer to use
   * @param {number} byteOffset the byte offset into the buffer
   * @param {number} byteLength the total length of the buffer to use
   * @param {number} stringLength the maximum length of a string inside the array
   */
  constructor(buffer, byteOffset, byteLength, stringLength) {
    this.stringLength = stringLength;
    this.bytes = new Uint8Array(buffer, byteOffset, byteLength);
  }

  /**
   * Returns a StringView at a given index.
   *
   * @param {number} index
   * @returns {StringView}
   */
  get(index) {
    return new StringView(
      this.bytes.buffer, this.bytes.byteOffset + (index * this.stringLength), this.stringLength,
    );
  }

  /**
   * Sets a string or StringView at a given index.
   *
   * @param {number} index
   * @param {string|StringView} value
   * @returns {StringArrayView}
   */
  set(index, value) {
    const view = value instanceof Uint8Array ? value
      : StringView.fromString(value, this.stringLength);
    this.bytes.set(view, index * this.stringLength);
    return this;
  }

  /**
   * Returns the amount of available strings in the array.
   *
   * @type {number}
   */
  get size() {
    return this.bytes.byteLength / this.stringLength;
  }


  /**
   * Allows iterating over strings stored in the array.
   *
   * @returns {Iterable<StringView>}
   */
  * [Symbol.iterator]() {
    const { size } = this;
    for (let i = 0; i < size; i++) {
      yield this.get(i);
    }
  }

  /**
   * Returns an array of strings held inside the array view.
   *
   * @returns {Array<string>}
   */
  toObject() {
    const { size } = this;
    const array = new Array(size);
    for (let i = 0; i < size; i++) {
      array[i] = this.get(i).toString();
    }
    return array;
  }

  /**
   * Creates an array view from a given array of strings.
   *
   * @param {ArrayLike<string>} value an array of strings to store in the new array view
   * @param {number} stringLength the maximum length of a string
   * @param {StringArrayView} [array] an existing StringArrayView to populate with given strings
   * @returns {StringArrayView}
   */
  static from(value, stringLength, array) {
    const view = array || this.of(value.length, stringLength);
    const { size } = view;
    for (let i = 0; i < size; i++) {
      const string = StringView.fromString(value[i], stringLength);
      view.bytes.set(string, i * stringLength);
    }
    return view;
  }

  /**
   * Returns the byte length of an array view to hold a given amount of strings.
   *
   * @param {number} size the amount of strings
   * @param {number} stringLength the maximum length of a string
   * @returns {number}
   */
  static getLength(size, stringLength) {
    return size * stringLength;
  }

  /**
   * Creates an empty array view of specified size.
   *
   * @param {number} size the amount of strings
   * @param {number} stringLength the maximum length of a string
   * @returns {StringArrayView}
   */
  static of(size = 1, stringLength = 1) {
    const buffer = new ArrayBuffer(size * stringLength);
    return new this(buffer, 0, buffer.byteLength, stringLength);
  }
}

module.exports = StringArrayView;
