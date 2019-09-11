/**
 * @param {Class<ObjectView>} ObjectViewClass
 * @returns {Class<ArrayView>}
 */
function ArrayViewMixin(ObjectViewClass) {
  if (!ObjectViewClass.isInitialized) ObjectViewClass.initialize();

  /**
   * @extends ObjectView
   */
  class ArrayView extends DataView {
    /**
     * Returns an object view at a given index.
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
      ObjectViewClass.from(value, this.get(index));
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
        .set(new Uint8Array(value.buffer, value.byteOffset, value.byteLength));
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
     * Allows iterating over objects stored in the array.
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

  /**
   * @private
   */
  ArrayView.objectLength = ObjectViewClass.objectLength;

  return ArrayView;
}


module.exports = ArrayViewMixin;
