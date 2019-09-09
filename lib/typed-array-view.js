const { typeGetters, typeSetters, typeOffsets } = require('./utilities');

/**
 * @param {string} type
 * @param {boolean} [littleEndian]
 * @returns {Class<TypedArrayView>}
 */
function TypedArrayViewMixin(type, littleEndian) {
  /**
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
      const { typeGetter, offset, littleEndian: le } = this.constructor;
      return this[typeGetter](index << offset, le);
    }

    /**
     * Sets a number at a given index.
     *
     * @param {number} index
     * @param {number} value
     * @returns {TypedArrayView}
     */
    set(index, value) {
      const { typeSetter, offset, littleEndian: le } = this.constructor;
      this[typeSetter](index << offset, value, le);
      return this;
    }

    /**
     * Returns the amount of available numbers in the array.
     *
     * @type {number}
     */
    get size() {
      return this.byteLength >> this.constructor.offset;
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
     * @deprecated use `TypedArrayView#toJSON()` instead
     * Returns an array representation of the array view.
     *
     * @returns {Array<number>}
     */
    toObject() {
      return this.toJSON();
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
      return size << this.offset;
    }

    /**
     * Creates an array view from a given array of numbers.
     *
     * @param {ArrayLike<number>} value
     * @param {TypedArrayView} [array]
     * @returns {TypedArrayView}
     */
    static from(value, array) {
      const dataArray = array || this.of(value.length);
      const { size } = dataArray;
      for (let i = 0; i < size; i++) {
        dataArray.set(i, value[i]);
      }
      return dataArray;
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
   * @private
   * @type {string}
   */
  TypedArrayView.typeGetter = typeGetters[type];

  /**
   * @private
   * @type {string}
   */
  TypedArrayView.typeSetter = typeSetters[type];

  /**
   * @private
   * @type {number}
   */
  TypedArrayView.offset = typeOffsets[type];

  /**
   * @private
   * @type {boolean}
   */
  TypedArrayView.littleEndian = !!littleEndian;

  return TypedArrayView;
}

module.exports = TypedArrayViewMixin;
