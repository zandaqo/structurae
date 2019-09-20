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
    return this.get(index).toJSON();
  }

  /**
   * Sets an object at a given index.
   *
   * @param {number} index
   * @param {Object} value
   * @returns {ArrayView}
   */
  set(index, value) {
    this.constructor.View.from(value, this.get(index));
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
   * @deprecated use `ArrayView#toJSON()` instead.
   * Returns an array representation of the array view.
   *
   * @returns {Array<Object>}
   */
  toObject() {
    return this.toJSON();
  }

  /**
   * Returns an array representation of the array view.
   *
   * @returns {Array<Object>}
   */
  toJSON() {
    const { size } = this;
    const json = new Array(size);
    for (let i = 0; i < size; i++) {
      json[i] = this.get(i).toJSON();
    }
    return json;
  }

  /**
   * Creates an array view from a given array of objects.
   *
   * @param {ArrayLike<Object>} value
   * @param {ArrayView} [array]
   * @returns {ArrayView}
   */
  static from(value, array) {
    const view = array || this.of(value.length);
    if (array) {
      new Uint8Array(view.buffer, view.byteOffset, view.byteLength).fill(0);
    }
    const { size } = view;
    const max = (size < value.length ? size : value.length);
    for (let i = 0; i < max; i++) {
      view.set(i, value[i]);
    }
    return view;
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

/**
 * Creates an ArrayView class for a given ObjectView class.
 *
 * @param {Class<ObjectView>|Class<StringView>} ObjectViewClass
 * @param {number} [itemLength]
 * @returns {Class<ArrayView>}
 */
function ArrayViewMixin(ObjectViewClass, itemLength) {
  if (ObjectViewClass.initialize && !ObjectViewClass.isInitialized) {
    ObjectViewClass.initialize();
  }
  class Base extends ArrayView {}
  Base.View = ObjectViewClass;
  Base.itemLength = ObjectViewClass.objectLength || itemLength;
  return Base;
}


module.exports = {
  ArrayView,
  ArrayViewMixin,
};
