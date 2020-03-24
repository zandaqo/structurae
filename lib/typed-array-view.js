const ArrayView = require('./array-view');

/**
 * A DataView based TypedArray that supports endianness and can be set at any offset.
 *
 * @extends DataView
 */
class TypedArrayView extends ArrayView {
  /**
   * Returns a number at a given index.
   *
   * @param {number} index
   * @returns {number}
   */
  get(index) {
    const { View } = this.constructor;
    const offset = this.constructor.getLength(index);
    return View.toJSON(this, offset);
  }

  /**
   * Allows iterating over objects views stored in the array.
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
   * Returns the byte length of an array view to hold a given amount of numbers.
   *
   * @param {number} size
   * @returns {number}
   */
  static getLength(size) {
    return size << this.View.offset;
  }

  /**
   * Calculates the size of an array from it's byte length.
   *
   * @param {number} length
   * @returns {number}
   */
  static getSize(length) {
    return length >> this.View.offset;
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
