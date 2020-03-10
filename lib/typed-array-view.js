/**
 * A DataView based TypedArray that supports endianness and can be set at any offset.
 *
 * @extends DataView
 */
class TypedArrayView extends DataView {
  /**
   * Returns a number at a given index.
   *
   * @param {number} index
   * @returns {number}
   */
  get(index) {
    const { View } = this.constructor;
    return View.toJSON(this, index << View.offset);
  }

  /**
   * Sets a number at a given index.
   *
   * @param {number} index
   * @param {number} value
   * @returns {TypedArrayView}
   */
  set(index, value) {
    const { View } = this.constructor;
    View.from(value, this, index << View.offset);
    return this;
  }

  /**
   * Returns the amount of available numbers in the array.
   *
   * @type {number}
   */
  get size() {
    return this.byteLength >> this.constructor.View.offset;
  }


  /**
   * Allows iterating over numbers stored in the instance.
   *
   * @returns {Iterable<number>}
   */
  * [Symbol.iterator]() {
    const { size } = this;
    for (let i = 0; i < size; i++) {
      yield this.get(i);
    }
  }

  /**
   * Returns an array representation of the array view.
   *
   * @returns {Array<number>}
   */
  toJSON() {
    return this.constructor.toJSON(this, 0, this.byteLength);
  }

  /**
   * Returns the byte length of an array view to hold a given amount of numbers.
   *
   * @param {number} size
   * @returns {number}
   */
  static getLength(size) {
    return size << this.View.offset;
  }

  /**
   * Creates an array view from a given array of numbers.
   *
   * @param {ArrayLike<number>} value
   * @param {View} [array]
   * @param {number} [start=0]
   * @param {number} [length]
   * @returns {TypedArrayView}
   */
  static from(value, array, start = 0, length = this.getLength(value.length)) {
    const view = array || this.of(value.length);
    new Uint8Array(view.buffer, view.byteOffset + start, length).fill(0);
    const { View } = this;
    const size = length >> View.offset;
    for (let i = 0; i < size; i++) {
      View.from(value[i], view, start + (i << View.offset));
    }
    return view;
  }

  /**
   * Returns an array representation of a given view.
   *
   * @param {View} view
   * @param {number} [start=0]
   * @param {length} [length]
   * @returns {Array<number>}
   */
  static toJSON(view, start = 0, length) {
    const { View } = this;
    const size = length >> View.offset;
    const array = new Array(size);
    for (let i = 0; i < size; i++) {
      array[i] = View.toJSON(view, start + (i << View.offset));
    }
    return array;
  }

  /**
   * Creates an empty array view of specified size.
   *
   * @param {number} size
   * @returns {TypedArrayView}
   */
  static of(size = 1) {
    const buffer = new ArrayBuffer(this.getLength(size));
    return new this(buffer);
  }
}

/**
 * @type {Class<TypeView>}
 */
TypedArrayView.View = undefined;

/**
 * @type {number}
 */
TypedArrayView.itemLength = 0;

module.exports = TypedArrayView;
