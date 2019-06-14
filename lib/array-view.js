/**
 * @param {Class<ObjectView>} ViewClass
 * @returns {Class<ArrayView>}
 */
function ArrayViewMixin(ViewClass) {
  /**
   * @extends DataView
   */
  class ArrayView extends DataView {
    /**
     * @param {number | ArrayBuffer} [sizeOrBuffer=1] the maximum size of the array
     *                                              or an existing ArrayBuffer to use
     * @param {number} [byteOffset] the byteOffset in an existing ArrayBuffer
     * @param {number} [byteLength] the byteLength in an existing ArrayBuffer
     */
    constructor(sizeOrBuffer = 1, byteOffset, byteLength) {
      const buffer = sizeOrBuffer instanceof ArrayBuffer
        ? sizeOrBuffer : new ArrayBuffer(new.target.getLength(sizeOrBuffer));
      super(buffer, byteOffset, byteLength);

      Object.defineProperties(this, {
        byteView: { value: new Uint8Array(this.buffer, this.byteOffset, this.byteLength) },
      });
    }

    /**
     * @param {number} index
     * @returns {ObjectView}
     */
    get(index) {
      const { ViewClass: Ctor, viewLength } = this.constructor;
      return new Ctor(this.buffer, this.byteOffset + (index * viewLength), viewLength);
    }

    /**
     * @param {number} index
     * @param {ObjectView|Object} value
     * @returns {ArrayView}
     */
    set(index, value) {
      const objectView = this.get(index);
      objectView.setObject(0, value);
      return this;
    }

    /**
     * Returns the amount of available bits in the array.
     *
     * @type {number}
     */
    get size() {
      return this.byteLength / this.constructor.viewLength;
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

    toObject() {
      return [...this].map(item => item.toObject());
    }

    static from(value, array) {
      const arrayView = array || new this(value.length);
      const { length } = value;
      if (!length) return arrayView;
      const { size } = arrayView;
      const max = size < length ? size : length;
      for (let i = 0; i < max; i++) {
        arrayView.set(i, value[i]);
      }
      return arrayView;
    }

    static getLength(size) {
      return size * this.viewLength;
    }
  }

  /** @type {Class<ObjectView>} */
  ArrayView.ViewClass = ViewClass;

  /** @type {number} */
  ArrayView.viewLength = ViewClass.getLength();

  return ArrayView;
}


module.exports = ArrayViewMixin;
