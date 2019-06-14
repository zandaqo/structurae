/**
 * @extends DataView
 */
class TypedArrayView extends DataView {
  /**
   * @param {number | ArrayBuffer} [sizeOrBuffer=1] the maximum size of the array
   *                                              or an existing ArrayBuffer to use
   * @param {number} [byteOffset] the byteOffset in an existing ArrayBuffer
   * @param {number} [byteLength] the byteLength in an existing ArrayBuffer
   */
  constructor(sizeOrBuffer = 1, byteOffset, byteLength) {
    const buffer = sizeOrBuffer instanceof ArrayBuffer
      ? sizeOrBuffer : new ArrayBuffer(sizeOrBuffer << new.target.offset);
    super(buffer, byteOffset, byteLength);

    Object.defineProperties(this, {
      byteView: { value: new Uint8Array(this.buffer, this.byteOffset, this.byteLength) },
    });
  }

  /**
   * @param {number} index
   * @returns {number}
   */
  get(index) {
    return this[this.constructor.typeGetter](index << this.constructor.offset);
  }

  /**
   * @param {number} index
   * @param {number} value
   * @returns {TypedArrayView}
   */
  set(index, value) {
    this[this.constructor.typeSetter](index << this.constructor.offset, value);
    return this;
  }

  /**
   * Returns the amount of available bits in the array.
   *
   * @type {number}
   */
  get size() {
    return this.byteLength >> this.constructor.offset;
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
    return [...this];
  }

  static getLength(size) {
    return size << this.offset;
  }

  static from(value, array) {
    const dataArray = array || new this(value.length);
    if (!value.length) return dataArray;
    const { size } = dataArray;
    for (let i = 0; i < size; i++) {
      dataArray.set(i, value[i]);
    }
    return dataArray;
  }
}

/** @type {string} */
TypedArrayView.typeGetter = '';

/** @type {string} */
TypedArrayView.typeSetter = '';

/** @type {number} */
TypedArrayView.offset = 0;

/** @extends TypedArrayView */
class Int8View extends TypedArrayView {}
/** @type {string} */
Int8View.typeGetter = 'getInt8';

/** @type {string} */
Int8View.typeSetter = 'setInt8';

/** @type {number} */
Int8View.offset = 0;

/** @extends TypedArrayView */
class Uint8View extends TypedArrayView {
  /**
   * @param {number} index
   * @returns {number}
   */
  get(index) {
    return this.byteView[index];
  }

  /**
   * @param {number} index
   * @param {number} value
   * @returns {Uint8View}
   */
  set(index, value) {
    this.byteView[index] = value;
    return this;
  }

  /**
   * Returns the amount of available bits in the array.
   *
   * @type {number}
   */
  get size() {
    return this.byteLength;
  }

  static getLength(size) {
    return size;
  }
}

/** @extends TypedArrayView */
class Int16View extends TypedArrayView {}
/** @type {string} */
Int16View.typeGetter = 'getInt16';

/** @type {string} */
Int16View.typeSetter = 'setInt16';

/** @type {number} */
Int16View.offset = 1;

/** @extends TypedArrayView */
class Uint16View extends TypedArrayView {}
/** @type {string} */
Uint16View.typeGetter = 'getUint16';

/** @type {string} */
Uint16View.typeSetter = 'setUint16';

/** @type {number} */
Uint16View.offset = 1;

/** @extends TypedArrayView */
class Int32View extends TypedArrayView {}
/** @type {string} */
Int32View.typeGetter = 'getInt32';

/** @type {string} */
Int32View.typeSetter = 'setInt32';

/** @type {number} */
Int32View.offset = 2;

/** @extends TypedArrayView */
class Uint32View extends TypedArrayView {}
/** @type {string} */
Uint32View.typeGetter = 'getUint32';

/** @type {string} */
Uint32View.typeSetter = 'setUint32';

/** @type {number} */
Uint32View.offset = 2;

/** @extends TypedArrayView */
class Float32View extends TypedArrayView {}
/** @type {string} */
Float32View.typeGetter = 'getFloat32';

/** @type {string} */
Float32View.typeSetter = 'setFloat32';

/** @type {number} */
Float32View.offset = 2;

/** @extends TypedArrayView */
class Float64View extends TypedArrayView {}
/** @type {string} */
Float64View.typeGetter = 'getFloat64';

/** @type {string} */
Float64View.typeSetter = 'setFloat64';

/** @type {number} */
Float64View.offset = 3;

/** @extends TypedArrayView */
class BigInt64View extends TypedArrayView {}
/** @type {string} */
BigInt64View.typeGetter = 'getBigInt64';

/** @type {string} */
BigInt64View.typeSetter = 'setBigInt64';

/** @type {number} */
BigInt64View.offset = 3;

/** @extends TypedArrayView */
class BigUint64View extends TypedArrayView {}
/** @type {string} */
BigUint64View.typeGetter = 'getBigUint64';

/** @type {string} */
BigUint64View.typeSetter = 'setBigUint64';

/** @type {number} */
BigUint64View.offset = 3;

module.exports = {
  TypedArrayView,
  Int8View,
  Uint8View,
  Int16View,
  Uint16View,
  Int32View,
  Uint32View,
  Float32View,
  Float64View,
  BigInt64View,
  BigUint64View,
};
