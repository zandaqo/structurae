const { typeGetters, typeSetters, typeOffsets } = require('./utilities');

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
 * @type {string}
 */
TypedArrayView.typeGetter = '';

/**
 * @type {string}
 */
TypedArrayView.typeSetter = '';

/**
 * @type {number}
 */
TypedArrayView.offset = 0;

/**
 * @type {boolean}
 */
TypedArrayView.littleEndian = false;

/**
 * @param {string} type
 * @param {boolean} [littleEndian]
 * @returns {Class<Base>}
 */
function TypedArrayViewMixin(type, littleEndian) {
  class Base extends TypedArrayView {}
  Base.typeGetter = typeGetters[type];
  Base.typeSetter = typeSetters[type];
  Base.offset = typeOffsets[type];
  Base.littleEndian = !!littleEndian;
  return Base;
}

module.exports = TypedArrayViewMixin;
