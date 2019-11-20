const { getBitSize } = require('./utilities');

/**
 * @private
 * Use Number if BigInt is not available.
 */
const BigInt = (global || window).BigInt || Number;

/**
 * @private
 * @type {bigint} 0n.
 */
const ZERO = BigInt(0);

/**
 * @private
 * @type {bigint} 1n.
 */
const ONE = BigInt(1);

/**
 * @private
 * @type {bigint} 2n.
 */
const TWO = BigInt(2);

/**
 * @private
 * @type {number} The largest safe integer for bitwise operations.
 */
const SIGN_BIT = 2147483647;

/**
 * Stores and operates on data in BigInts treating them as bitfields.
 *
 * // a bitfield that holds three integers of 32, 16, and 8 bits
 * class Field extends BigBitField {}
 * Field.schema = {
 *   area: 32,
 *   width: 16,
 *   height: 8,
 * };
 * Field.initialize();
 *
 * // same using BitFieldMixin
 * const Field = BitFieldMixin({ area: 32, width: 16, height: 8 });
 */
class BigBitField {
  /**
   * @param {bigint|Array<number>|Object<string, number>} [data=0]
   * @example
   *
   * const field = new Field({ area: 100, width: 10, height: 10 });
   * //=> Field { value: 2814792716779620n }
   * field.get('width');
   * //=> 10;
   *
   * const copy = new Field(2814792716779620n);
   * copy.get('width');
   * //=> 10
   */
  constructor(data = ZERO) {
    this.value = typeof data === 'object' ? this.constructor.encode(data) : BigInt(data);
  }

  /**
   * Returns the value of a given field.
   *
   * @param {string} field name of the field
   * @returns {number} value value of the field
   * @example
   *
   * const field = new Field({ area: 100, width: 10, height: 10 });
   * //=> Field { value: 2814792716779620n }
   * field.get('width');
   * //=> 10;
   * field.get('area');
   * //=> 100;
   */
  get(field) {
    const { offsets, masks } = this.constructor;
    const value = (this.value >> offsets[field]) & masks[field];
    return Number(value);
  }

  /**
   * Stores a given value in a field.
   *
   * @param {string} field name of the field
   * @param {number} value value of the field
   * @returns {BigBitField} the instance
   * @example
   *
   * const field = new Field({ area: 100, width: 10, height: 10 });
   * //=> Field { value: 2814792716779620n }
   * field.get('width');
   * //=> 10;
   * field.set('width', 100);
   * field.get('width');
   * //=> 100;
   */
  set(field, value = 1) {
    const { offsets, masks } = this.constructor;
    this.value = (this.value & ~(masks[field] << offsets[field]))
      | (BigInt(value) << offsets[field]);
    return this;
  }

  /**
   * Checks if an instance has all the specified fields set to 1. Useful for bit flags.
   *
   * @param {...string|number} fields names of the fields to check
   * @returns {boolean} whether all the specified fields are set in the instance
   * @example
   *
   * const Flags = BitFieldMixin(['a', 'b', 'c']);
   * const settings = new Flags({ 'a': 0, 'b': 1, 'c': 1 });
   * settings.has('b', 'c');
   * //=> true
   * settings.has('a', 'b');
   * //=> false
   */
  has(...fields) {
    const { offsets } = this.constructor;
    let mask = ZERO;
    for (let i = 0; i < fields.length; i++) {
      mask |= ONE << offsets[fields[i]];
    }
    mask |= this.value;
    return this.value === mask;
  }

  /**
   * Checks if the instance contains all the key-value pairs listed in matcher.
   * Use `BigBitField.getMatcher` to get an array of precomputed values
   * that you can use to efficiently compare multiple instances
   * to the same key-value pairs as shown in the examples below.
   *
   * @param {Object<string, number>|Array<bigint>} matcher an object with key-value pairs,
   *                                                or an array of precomputed matcher values
   * @returns {boolean} whether the instance matches with the provided fields
   * @example
   *
   * const field = new Field({ area: 200, width: 10, height: 20 });
   * field.match({ height: 20 });
   * //=> true
   * field.match({ width: 10, height: 20 });
   * //=> true
   * field.match({ area: 10 });
   * //=> false
   * field.match({ width: 10, height: 10 });
   * //=> false
   *
   * // use precomputed matcher
   * const matcher = BitField.getMatcher({ height: 20});
   * new Field({ width: 10, height: 20 }).match(matcher);
   * //=> true
   * new Field({ width: 10, height: 10 }).match(matcher);
   * //=> false
   */
  match(matcher) {
    return this.constructor.match(this.value, Array.isArray(matcher)
      ? matcher : this.constructor.getMatcher(matcher));
  }

  /**
   * Returns the object representation of the instance,
   * with field names as properties with corresponding values.
   * @returns {Object<string, number>} the object representation of the instance
   * @example
   *
   * const field = new Field({ area: 200, width: 10, height: 20 });
   * field.toObject();
   * //=> { area: 200, width: 10, height: 20 }
   */
  toObject() {
    return this.constructor.decode(this.value);
  }

  /**
   * Returns a string representing the value of the instance.
   *
   * @returns {string} a string representing the value of the instance
   */
  toString() {
    return this.value.toString();
  }

  /**
   * Returns the numerical value of an instance.
   *
   * @returns {bigint} the numerical value of the instance
   */
  valueOf() {
    return this.value;
  }

  /**
   * Encodes a given list of numbers into a single number according to the schema.
   *
   * @param {Array<number>|Object<string, number>} data the list of numbers to encode
   * @returns {bigint} encoded number
   * @example
   *
   * new Field({ area: 100, width: 10, height: 10 });
   * //=> 2814792716779620n
   */
  static encode(data) {
    const { fields, schema } = this;
    const array = Array.isArray(data) ? data : fields.map((name) => (data[name] || 0));
    let result = ZERO;
    for (let i = fields.length - 1; i >= 0; i--) {
      const field = fields[i];
      const current = array[i];
      result <<= schema[field];
      result |= BigInt(current);
    }
    return result;
  }

  /**
   * Decodes an encoded number into its object representation according to the schema.
   *
   * @param {bigint} data encoded number
   * @returns {Object<string, number>} object representation
   * @example
   *
   * new Field({ area: 100, width: 10, height: 10 });
   * //=> 2814792716779620n
   * Field.decode(2814792716779620n);
   * //=> { area: 100, width: 10, height: 10 }
   */
  static decode(data) {
    const { fields, masks, schema } = this;
    const result = {};
    let value = data;
    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];
      const size = schema[field];
      result[field] = Number(value & masks[field]);
      value >>= size;
    }
    return result;
  }

  /**
   * Checks if a given set of values or all given pairs of field name and value
   * are valid according to the schema.
   *
   * @param {Object<string, number>} data pairs of field name and value to check
   * @returns {boolean} whether all pairs are valid
   * @example
   *
   * Field.isValid({ area: 100000, width: 20 })
   * //=> true
   * Field.isValid({ width: 10, height: 20 })
   * //=> true
   * Field.isValid({ width: -10, height: 20 })
   * //=> false
   * Field.isValid({ width: 1000000, height: 20 });
   * //=> false
   */
  static isValid(data) {
    const { masks } = this;
    const fields = Object.keys(data);
    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];
      const value = data[field];
      if (((value & SIGN_BIT) !== value) || value > masks[field]) return false;
    }
    return true;
  }

  /**
   * Returns the minimum amount of bits necessary to hold a given number.
   *
   * @param {number} number
   * @returns {number} the amount of bits
   * @example
   *
   * BigBitField.getMinSize(100)
   * //=> 7
   *
   * BigBitField.getMinSize(2000)
   * //=> 11
   *
   * BigBitField.getMinSize(Number.MAX_SAFE_INTEGER)
   * //=> 53
   */
  static getMinSize(number) {
    return getBitSize(number);
  }

  /**
   * Prepares the class to handle data according to its schema provided in `BigBitField.schema`.
   *
   * @returns {void}
   */
  static initialize() {
    const { schema } = this;
    const fields = Object.keys(schema);

    const masks = {};
    const offsets = {};
    let lastOffset = ZERO;
    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];
      const size = BigInt(schema[field]);
      schema[field] = size;
      masks[field] = (TWO << size - ONE) - ONE;
      offsets[field] = lastOffset;
      lastOffset += size;
    }

    this.schema = schema;
    this.fields = fields;
    this.size = lastOffset;
    this.mask = TWO << BigInt(lastOffset) - ONE;
    this.masks = masks;
    this.offsets = offsets;
    this.isInitialized = true;
  }

  /**
   * Creates an array of values to be used as a matcher
   * to efficiently match against multiple instances.
   *
   * @param {Object<string, number>} matcher an object containing field names and their values
   * @returns {Array<bigint>} an array of precomputed values
   * @example
   *
   * Field.getMatcher({ area: 100 });
   * //=> [ 100n, 72057598332895231n ]
   */
  static getMatcher(matcher) {
    const { masks, offsets } = this;
    const fields = Object.keys(matcher);
    let mask = ZERO;
    let value = ZERO;
    for (let i = 0; i < fields.length; i++) {
      const fieldName = fields[i];
      const fieldMask = masks[fieldName] << offsets[fieldName];
      const fieldValue = BigInt(matcher[fieldName]);
      value = (value & ~fieldMask) | (fieldValue << offsets[fieldName]);
      mask |= fieldMask;
    }
    return [value, this.mask ^ mask];
  }

  /**
   * The static version of `BigBitField#match`, matches a given value against a precomputed matcher.
   *
   * @param {bigint} value a value to check
   * @param {Array<bigint>} matcher a precomputed set of values
   * @returns {boolean}
   * @example
   *
   * Field.match(new Field({ area: 100 }), Field.getMatcher({ area: 100}));
   * //=> true
   * Field.match(new Field({ area: 1000 }), Field.getMatcher({ area: 100}));
   * //=> false
   */
  static match(value, matcher) {
    return (value & matcher[1]) === matcher[0];
  }

  /**
   * Allows iterating over numbers stored in the instance.
   *
   * @returns {Iterable<number>}
   */
  * [Symbol.iterator]() {
    const { fields } = this.constructor;
    for (let i = 0; i < fields.length; i++) {
      yield this.get(fields[i]);
    }
  }
}

/**
 * @private
 * @type {Array<string>}
 */
BigBitField.fields = undefined;

/**
 * @private
 * @type {bigint}
 */
BigBitField.size = ZERO;

/**
 * @private
 * @type {Object<string, bigint>}
 */
BigBitField.masks = undefined;

/**
 * @private
 * @type {bigint}
 */
BigBitField.mask = ZERO;

/**
 * @private
 * @type {Object<string, bigint>}
 */
BigBitField.offsets = undefined;

/**
 * @private
 * @type {boolean}
 */
BigBitField.isInitialized = false;

module.exports = BigBitField;
