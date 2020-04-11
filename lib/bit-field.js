const { getBitSize } = require('./utilities');

/**
 * @private
 * @type {number} The largest safe integer for bitwise operations.
 */
const SIGN_BIT = 2147483647;

/**
 * @private
 * @type {number} The maximum safe size for bitwise operations on standard numbers.
 */
const BITWISE_SIZE = 31;

/**
 * @private
 * @type {number} 2 ** 31
 */
const TWO_TO_31 = 2147483648;

/**
 * Stores and operates on data in Numbers treating them as bitfields.
 *
 * @example
 *
 * // a bitfield that holds two integers of 8 bits each
 * class Field extends BitField {}
 * Field.schema = {
 *   width: 8,
 *   height: 8,
 * };
 * Field.initialize();
 *
 * // same using BitFieldMixin
 * const Field = BitFieldMixin({ width: 8, height: 8 });
 */
class BitField {
  /**
   * @param {number|BitField|Array<number>
   *   |Object<string, number>} [data=0] a single number value of the field
   *                                        or a map of field names with their respective values
   * @example
   *
   * const field = new Field({ width: 100, height: 100 });
   * //=> Field { value: 25700 }
   * field.get('width');
   * //=> 100;
   *
   * const copy = new Field(25700);
   * copy.get('width');
   * //=> 100
   */
  constructor(data = 0) {
    this.value =
      typeof data === 'number'
        ? data
        : data instanceof BitField
        ? data.valueOf()
        : this.constructor.encode(data);
  }

  /**
   * Returns the value of a given field.
   *
   * @param {string|number} field name of the field
   * @returns {number} value value of the field
   * @example
   *
   * const field = new Field({ width: 100, height: 200 });
   * //=> Field { value: 51300 }
   * field.get('width');
   * //=> 100;
   * field.get('height');
   * //=> 200;
   */
  get(field) {
    const { offsets, masks } = this.constructor;
    return (this.value >> offsets[field]) & masks[field];
  }

  /**
   * Stores a given value in a field.
   *
   * @param {string|number} field name of the field
   * @param {number} value value of the field
   * @returns {BitField} the instance
   * @example
   *
   * const field = new Field({ width: 100, height: 200 });
   * //=> Field { value: 51300 }
   * field.get('width');
   * //=> 100;
   * field.set('width', 50);
   * //=> Field { value: 51250 }
   * field.get('width');
   * //=> 50
   */
  set(field, value = 1) {
    const { offsets, masks } = this.constructor;
    this.value = (this.value & ~(masks[field] << offsets[field])) | (value << offsets[field]);
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
    let mask = 0;
    for (let i = 0; i < fields.length; i++) {
      mask |= 1 << offsets[fields[i]];
    }
    mask |= this.value;
    return this.value === mask;
  }

  /**
   * Checks if the instance contains all the key-value pairs listed in matcher.
   * Use `BitField.getMatcher` to get an array of precomputed values
   * that you can use to efficiently compare multiple instances
   * to the same key-value pairs as shown in the examples below.
   *
   * @param {Object<string, number>|Matcher} matcher an object with key-value pairs,
   *                                                or an array of precomputed matcher values
   * @returns {boolean} whether the instance matches with the provided fields
   * @example
   *
   * const field = new Field({ width: 10, height: 20 });
   * field.match({ height: 20 });
   * //=> true
   * field.match({ width: 10, height: 20 });
   * //=> true
   * field.match({ width: 10 });
   * //=> true
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
    return this.constructor.match(
      this.value,
      Array.isArray(matcher) ? matcher : this.constructor.getMatcher(matcher),
    );
  }

  /**
   * Returns the numerical value of an instance.
   *
   * @returns {number}
   */
  toJSON() {
    return this.value;
  }

  /**
   * Returns the object representation of the instance,
   * with field names as properties with corresponding values.
   * @returns {Object<string, number>} the object representation of the instance
   * @example
   *
   * const field = new Field({ width: 10, height: 20 });
   * field.toObject();
   * //=> { width: 10, height: 20 }
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
   * @returns {number} the numerical value of the instance
   */
  valueOf() {
    return this.value;
  }

  /**
   * Encodes a given list of numbers or map of fields and their respective values
   * into a single number according to the schema.
   *
   * @param {Array<number>|Object<string, number>} data the list of numbers to encode
   * @returns {number} encoded number
   * @example
   *
   * Field.encode({ width: 10, height: 20 })
   * //=> 5130
   */
  static encode(data) {
    const { fields, schema } = this;
    const array = Array.isArray(data) ? data : fields.map((name) => data[name] || 0);
    let result = 0;
    for (let i = fields.length - 1; i >= 0; i--) {
      const field = fields[i];
      const current = array[i];
      result <<= schema[field];
      result |= current;
    }
    return result;
  }

  /**
   * Decodes an encoded number into its object representation according to the schema.
   *
   * @param {number} data encoded number
   * @returns {Object<string, number>} object representation
   * @example
   *
   * const data = Field.encode({ width: 10, height: 20 })
   * //=> 5130
   * Field.decode(5130);
   * //=> { width: 10, height: 20 }
   */
  static decode(data) {
    const { fields, masks, schema } = this;
    const result = {};
    let value = data;
    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];
      const size = schema[field];
      result[field] = value & masks[field];
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
   * Field.isValid({ width: 20 })
   * //=> true
   * Field.isValid({ width: 10, height: 20 })
   * //=> true
   * Field.isValid({ width: -10, height: 20 })
   * //=> false
   * Field.isValid({ width: 1000, height: 20 });
   * //=> false
   */
  static isValid(data) {
    const { masks } = this;
    const fields = Object.keys(data);
    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];
      const value = data[field];
      if ((value & SIGN_BIT) !== value || value > masks[field]) return false;
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
   * BitField.getMinSize(100)
   * //=> 7
   *
   * BitField.getMinSize(2000)
   * //=> 11
   *
   * BitField.getMinSize(Number.MAX_SAFE_INTEGER)
   * //=> 53
   */
  static getMinSize(number) {
    return getBitSize(number);
  }

  /**
   * Prepares the class to handle data according to its schema provided in `BitField.schema`.
   *
   * @returns {void}
   */
  static initialize() {
    const { schema } = this;
    const fields = Object.keys(schema);

    const masks = {};
    const offsets = {};
    let lastOffset = 0;
    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];
      const size = schema[field];
      masks[field] = (2 << (size - 1)) - 1;
      offsets[field] = lastOffset;
      lastOffset += size;
    }

    if (lastOffset > BITWISE_SIZE) {
      throw TypeError('The total size of the bitfield exceeds 31 bits.');
    }

    this.schema = schema;
    this.fields = fields;
    this.size = lastOffset;
    this.mask = 2 << (lastOffset - 1);
    this.masks = masks;
    this.offsets = offsets;
    this.isInitialized = true;
  }

  /**
   * Creates an array of values to be used as a matcher
   * to efficiently match against multiple instances.
   *
   * @param {Object<string, number>} matcher an object containing field names and their values
   * @returns {Array<number>} an array of precomputed values
   */
  static getMatcher(matcher) {
    const { masks, offsets } = this;
    const fields = Object.keys(matcher);
    let mask = 0;
    let value = 0;
    for (let i = 0; i < fields.length; i++) {
      const fieldName = fields[i];
      const fieldMask = masks[fieldName] << offsets[fieldName];
      const fieldValue = matcher[fieldName];
      value = (value & ~fieldMask) | (fieldValue << offsets[fieldName]);
      mask |= fieldMask;
    }
    return [value, this.mask ^ mask];
  }

  /**
   * The static version of `BitField#match`, matches a given value against a precomputed matcher.
   *
   * @param {number} value a value to check
   * @param {Matcher} matcher a precomputed set of values
   * @returns {boolean}
   * @example
   *
   * Field.match(new Field({ width: 10 }), Field.getMatcher({ width: 10 }));
   * //=> true
   * Field.match(new Field({ width: 100 }), Field.getMatcher({ width: 10}));
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
  *[Symbol.iterator]() {
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
BitField.fields = Array.from({ length: BITWISE_SIZE }, (e, i) => i.toString());

/**
 * @type {Object<string, number>}
 */
BitField.schema = BitField.fields.reduce((a, i) => {
  a[i] = 1;
  return a;
}, {});

/**
 * @type {number}
 */
BitField.size = BITWISE_SIZE;

/**
 * @private
 * @type {Object<string, number>}
 */
BitField.masks = undefined;

/**
 * @private
 * @type {number}
 */
BitField.mask = TWO_TO_31;

/**
 * @private
 * @type {Object<string, number>}
 */
BitField.offsets = undefined;

/**
 * @type {boolean}
 */
BitField.isInitialized = false;

BitField.initialize();

module.exports = BitField;
