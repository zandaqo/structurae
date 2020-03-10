/**
 * An array of ObjectViews. Uses DataView to operate on an array of JavaScript objects
 * stored in an ArrayBuffer.
 *
 * @extends DataView
 */
class ArrayView extends DataView {
  /**
   * Returns an object view at a given index.
   *
   * @param {number} index
   * @returns {ObjectView}
   */
  get(index) {
    const { itemLength, View } = this.constructor;
    return new View(
      this.buffer, this.byteOffset + (index * itemLength), itemLength,
    );
  }

  /**
   * Returns an object at a given index.
   *
   * @param {number} index
   * @returns {Object}
   */
  getValue(index) {
    const { itemLength, View } = this.constructor;
    return View.toJSON(this, index * itemLength);
  }

  /**
   * Sets an object at a given index.
   *
   * @param {number} index
   * @param {Object} value
   * @returns {ArrayView}
   */
  set(index, value) {
    const { itemLength, View } = this.constructor;
    View.from(value, this, this.byteOffset + index * itemLength, itemLength);
    return this;
  }

  /**
   * Sets an object view at a given index.
   *
   * @param {number} index
   * @param {ObjectView} value
   * @returns {ArrayView}
   */
  setView(index, value) {
    const { itemLength } = this.constructor;
    new Uint8Array(this.buffer, this.byteOffset + (index * itemLength), itemLength)
      .set(new Uint8Array(value.buffer, value.byteOffset, value.byteLength));
    return this;
  }

  /**
   * Returns the amount of available objects in the array.
   *
   * @type {number}
   */
  get size() {
    return this.byteLength / this.constructor.itemLength;
  }


  /**
   * Allows iterating over objects views stored in the array.
   *
   * @returns {Iterable<ObjectView>}
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
   * @returns {Array<Object>}
   */
  toJSON() {
    return this.constructor.toJSON(this, 0, this.byteLength);
  }

  /**
   * Creates an array view from a given array of objects.
   *
   * @param {ArrayLike<Object>} value
   * @param {View} [array]
   * @param {number} [start=0]
   * @param {number} [length]
   * @returns {ArrayView}
   */
  static from(value, array, start = 0, length = this.getLength(value.length)) {
    const view = array || this.of(value.length);
    new Uint8Array(view.buffer, view.byteOffset + start, length).fill(0);
    const { View, itemLength } = this;
    const size = length / itemLength;
    const max = (size < value.length ? size : value.length);
    for (let i = 0; i < max; i++) {
      const startOffset = start + i * itemLength;
      View.from(value[i], view, startOffset, itemLength);
    }
    return view;
  }

  /**
   * Returns an array representation of a given array view.
   *
   * @param {View} view
   * @param {number} [start=0]
   * @param {length} [length]
   * @returns {Object}
   */
  static toJSON(view, start, length) {
    const { View, itemLength } = this;
    const size = length / itemLength;
    const array = new Array(size);
    for (let i = 0; i < size; i++) {
      const startOffset = start + i * itemLength;
      array[i] = View.toJSON(view, startOffset, itemLength);
    }
    return array;
  }

  /**
   * Returns the byte length of an array view to hold a given amount of objects.
   *
   * @param {number} size
   * @returns {number}
   */
  static getLength(size) {
    return size * this.itemLength;
  }

  /**
   * Creates an empty array view of specified size.
   *
   * @param {number} size
   * @returns {ArrayView}
   */
  static of(size = 1) {
    const buffer = new ArrayBuffer(this.getLength(size));
    return new this(buffer);
  }
}

/**
 * @type {number}
 */
ArrayView.itemLength = 0;

/**
 * @type {ObjectView}
 */
ArrayView.View = undefined;

module.exports = ArrayView;
