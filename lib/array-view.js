/**
 * @param {Class<ObjectView>} ObjectViewClass
 * @returns {Class<ArrayView>}
 */
function ArrayViewMixin(ObjectViewClass) {
  if (!ObjectViewClass.isInitialized) ObjectViewClass.initialize();

  /**
   * @extends ObjectView
   */
  class ArrayView extends ObjectViewClass {
    /**
     * Returns an object at a given index.
     *
     * @param {number} index
     * @returns {ObjectView}
     */
    get(index) {
      const { objectLength } = this.constructor;
      return new ObjectViewClass(
        this.buffer, this.byteOffset + (index * objectLength), objectLength,
      );
    }

    /**
     * Sets an object at a given index.
     *
     * @param {number} index
     * @param {Object} value
     * @returns {ArrayView}
     */
    set(index, value) {
      this.setObject(index * this.constructor.objectLength, value, this.constructor);
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
      const { objectLength } = this.constructor;
      new Uint8Array(this.buffer, this.byteOffset + (index * objectLength), objectLength)
        .set(new Uint8Array(value.buffer, value.byteOffset, value.length));
      return this;
    }

    /**
     * Returns the amount of available objects in the array.
     *
     * @type {number}
     */
    get size() {
      return this.byteLength / this.constructor.objectLength;
    }


    /**
     * Allows iterating over numbers stored in the instance.
     *
     * @yields {number}
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
    toObject() {
      return this.getArray(0, this.constructor, this.size);
    }

    /**
     * Creates an array view from a given array of objects.
     *
     * @param {ArrayLike<Object>} value
     * @param {ArrayView} [array]
     * @returns {ArrayView}
     */
    static from(value, array) {
      const arrayView = array || this.of(value.length);
      const { size } = arrayView;
      for (let i = 0; i < size; i++) {
        arrayView.set(i, value[i]);
      }
      return arrayView;
    }

    /**
     * Returns the byte length of an array view to hold a given amount of objects.
     *
     * @param {number} size
     * @returns {number}
     */
    static getLength(size) {
      return size * this.objectLength;
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

  return ArrayView;
}


module.exports = ArrayViewMixin;
