/**
 * An array of ObjectViews. Uses DataView to operate on an array of JavaScript objects
 * stored in an ArrayBuffer.
 *
 * @extends DataView
 */
class ArrayView extends DataView {
  /**
   * Returns an object at a given index.
   *
   * @param {number} index
   * @returns {Object}
   */
  get(index) {
    const { View } = this.constructor;
    const offset = this.constructor.getLength(index);
    return View.toJSON(this, offset);
  }

  /**
   * Returns an object view at a given index.
   *
   * @param {number} index
   * @returns {ObjectView}
   */
  getView(index) {
    const { itemLength, View } = this.constructor;
    const offset = this.constructor.getLength(index);
    return new View(this.buffer, this.byteOffset + offset, itemLength);
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
    const offset = this.constructor.getLength(index);
    View.from(value, this, this.byteOffset + offset, itemLength);
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
    const offset = this.constructor.getLength(index);
    new Uint8Array(this.buffer, this.byteOffset + offset, itemLength).set(
      new Uint8Array(value.buffer, value.byteOffset, value.byteLength),
    );
    return this;
  }

  /**
   * Returns the amount of available objects in the array.
   *
   * @type {number}
   */
  get size() {
    return this.constructor.getSize(this.byteLength);
  }

  /**
   * Allows iterating over object views stored in the array.
   *
   * @returns {Iterable<ObjectView>}
   */
  *[Symbol.iterator]() {
    const { size } = this;
    for (let i = 0; i < size; i++) {
      yield this.getView(i);
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
    const size = this.getSize(length);
    const max = size < value.length ? size : value.length;
    for (let i = 0; i < max; i++) {
      const offset = this.getLength(i);
      View.from(value[i], view, start + offset, itemLength);
    }
    return view;
  }

  /**
   * Returns an array representation of a given array view.
   *
   * @param {View} view
   * @param {number} [start=0]
   * @param {number} [length]
   * @returns {Object}
   */
  static toJSON(view, start, length) {
    const { View, itemLength } = this;
    const size = this.getSize(length);
    const array = new Array(size);
    for (let i = 0; i < size; i++) {
      const offset = this.getLength(i);
      array[i] = View.toJSON(view, start + offset, itemLength);
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
    return (size * this.itemLength) | 0;
  }

  /**
   * Calculates the size of an array from it's byte length.
   *
   * @param {number} length
   * @returns {number}
   */
  static getSize(length) {
    return (length / this.itemLength) | 0;
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

/**
 * @type {WeakMap<Class<View>, Class<ArrayView>>}
 */
ArrayView.Views = new WeakMap();

/**
 * @type {Class<ArrayView>}
 */
ArrayView.ArrayClass = ArrayView;

module.exports = ArrayView;
