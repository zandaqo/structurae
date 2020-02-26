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
    return View.get(index << View.offset, this);
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
    View.set(index << View.offset, value, this);
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
    return [...this];
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
   * @param {TypedArrayView} [array]
   * @returns {TypedArrayView}
   */
  static from(value, array) {
    const view = array || this.of(value.length);
    if (array) {
      new Uint8Array(array.buffer, array.byteOffset, array.byteLength)
        .fill(0);
    }
    const { size } = view;
    for (let i = 0; i < size; i++) {
      view.set(i, value[i]);
    }
    return view;
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
