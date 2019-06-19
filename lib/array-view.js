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
     * @param {number} index
     * @param {Object} value
     * @returns {ArrayView}
     */
    set(index, value) {
      this.setObject(index * this.constructor.objectLength, value, this.constructor);
      return this;
    }

    /**
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
     * Returns the amount of available bits in the array.
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
     * @returns {Array<Object>}
     */
    toObject() {
      return this.getArray(0, this.constructor, this.size);
    }

    /**
     * @param {ArrayLike<Object>} value
     * @param {ArrayView} [array]
     * @returns {ArrayView}
     */
    static from(value, array) {
      const arrayView = array || this.of(value.length);
      const { length } = value;
      if (!length) return arrayView;
      const { size } = arrayView;
      const max = size < length ? size : length;
      for (let i = 0; i < max; i++) {
        arrayView.set(i, value[i]);
      }
      return arrayView;
    }

    /**
     * @param {number} size
     * @returns {number}
     */
    static getLength(size) {
      return size * this.objectLength;
    }

    /**
     * @param {number} size
     * @returns {ArrayView}
     */
    static of(size) {
      const buffer = new ArrayBuffer(this.getLength(size));
      return new this(buffer);
    }
  }

  return ArrayView;
}


module.exports = ArrayViewMixin;
