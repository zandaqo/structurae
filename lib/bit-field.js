/**
 * @private
 * Use Number if BigInt is not available.
 */
const BigInt = (global || window).BigInt || Number;

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
 * @type {number} The maximum safe size for standard numbers in bits.
 */
const MAX_SIZE = 53;

/**
 * @typedef {number | BigInt} AnyNumber
 */

/**
 * @typedef {number | string} FieldName
 */

/**
 * @typedef {Object<string, number>} UnpackedInt
 */

/**
 * @typedef {Object} Field
 * @property {FieldName} name name of the field
 * @property {number} [size] size in bits
 */

/**
 * @typedef {Array} Matcher
 * @property {AnyNumber} 0 value
 * @property {AnyNumber} 1 mask
 */

/**
 * @typedef {Object<string, AnyNumber>} Masks
 */

class BitField {
  /**
   * @param {AnyNumber|Array<number>} [data=0]
   * @example
   *
   * class Person extends BitField {}
   * Person.fields = [
   *  { name: 'age', size: 7 },
   *  { name: 'gender', size: 1 },
   * ];
   * new Person([20, 1]).value
   * //=> 41
   * new Person(41).value
   * //=> 41
   */
  constructor(data = 0) {
    const { isInitialized } = this.constructor;
    if (!isInitialized) this.constructor.initialize();

    const { isBigInt } = this.constructor;
    const value = Array.isArray(data) ? this.constructor.encode(data) : data;

    /** @type {number|BigInt} */
    this.value = isBigInt ? BigInt(value) : value;
  }

  /**
   * Returns the value of a given field.
   *
   * @param {Field} field name of the field
   * @returns {number} value value of the field
   * @example
   *
   * class Person extends BitField {}
   * Person.fields = [
   *  { name: 'age', size: 7 },
   *  { name: 'gender', size: 1 },
   * ];
   * const person = new Person([20, 1]);
   * person.get('age');
   * //=> 20
   * person.get('gender');
   * //=> 1
   */
  get(field) {
    const { offsets, masks } = this.constructor;
    const value = (this.value >> offsets[field]) & masks[field];
    return Number(value);
  }

  /**
   * Stores a given value in a field.
   *
   * @param {Field} field name of the field
   * @param {number} value value of the field
   * @returns {BitField} the instance
   * @example
   *
   * class Person extends BitField {}
   * Person.fields = [
   *  { name: 'age', size: 7 },
   *  { name: 'gender', size: 1 },
   * ];
   * const person = new Person([20, 1]);
   * person.get('age');
   * //=> 20
   * person.set('age', 30).get('age');
   * //=> 30
   */
  set(field, value = this.constructor.one) {
    const { offsets, masks, isBigInt } = this.constructor;
    if (isBigInt) value = BigInt(value);
    this.value = (this.value & ~(masks[field] << offsets[field])) | (value << offsets[field]);
    return this;
  }

  /**
   * Checks if an instance has all the specified fields set to 1. Useful for bit flags.
   *
   * @param {...Field} fields names of the fields to check
   * @returns {boolean} whether all the specified fields are set in the instance
   * @example
   *
   * const SettingsFlags = BinariusFactory(['notify', 'premium', 'moderator']);
   * const settings = SettingsFlags([1, 0, 1]);
   * settings.has('notify', 'moderator');
   * //=> true
   * settings.has('notify', 'premium');
   * //=> false
   */
  has(...fields) {
    const { offsets, zero, one } = this.constructor;
    let mask = zero;
    for (let i = 0; i < fields.length; i++) {
      mask |= one << offsets[fields[i]];
    }
    mask |= this.value;
    return this.value === mask;
  }

  /**
   * Checks if the instance contains all the key-value pairs listed in matcher.
   * Use `ParseInt.getMatcher` to get an array of precomputed values
   * that you can use to efficiently compare multiple instances
   * to the same key-value pairs as shown in the examples below.
   *
   * @param {UnpackedInt|Matcher} matcher an object with key-value pairs,
   *                                                or an array of precomputed matcher values
   * @returns {boolean} whether the instance matches with the provided fields
   * @example
   * class Person extends BitField {}
   * Person.fields = [
   *  { name: 'age', size: 7 },
   *  { name: 'gender', size: 1 },
   * ];
   * const person = new Person([20, 1]);
   * person.match({ age: 20 });
   * //=> true
   * person.match({ gender: 1 });
   * //=> true
   * person.match({ gender: 1, age: 20 });
   * //=> true
   * person.match({ gender: 1, age: 19 });
   * //=> false
   *
   * // use precomputed matcher
   * const matcher = Person.getMatcher({ age: 20});
   * new Person([20, 0]).match(matcher);
   * //=> true
   * new Person([19, 0]).match(matcher);
   * //=> false
   */
  match(matcher) {
    return this.constructor.match(this.value, Array.isArray(matcher)
      ? matcher : this.constructor.getMatcher(matcher));
  }

  /**
   * Returns the object representation of the instance,
   * with field names as properties with corresponding values.
   * @returns {UnpackedInt} the object representation of the instance
   * @example
   *
   * class Person extends BitField {}
   * Person.fields = [
   *  { name: 'age', size: 7 },
   *  { name: 'gender', size: 1 },
   * ];
   * const person = new Person([20, 1]);
   * person.toObject();
   * //=> { age: 20, gender: 1 }
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
   * Returns a BigInt if the total size exceeds 53 bits.
   *
   * @returns {AnyNumber} the numerical value of the instance
   */
  valueOf() {
    const { isBigInt, isSafe } = this.constructor;
    return (isBigInt && isSafe) ? Number(this.value) : this.value;
  }

  /**
   * Encodes a given list of numbers into a single number according to the schema.
   *
   * @param {Array<AnyNumber>} data the list of numbers to encode
   * @returns {AnyNumber} encoded number
   * @example
   *
   * class Person extends BitField {}
   * Person.fields = [
   *  { name: 'age', size: 7 },
   *  { name: 'gender', size: 1 },
   * ];
   * Person.encode([20, 1])
   * //=> 41
   */
  static encode(data) {
    const { zero, fields, isBigInt } = this;
    let result = zero;
    for (let i = data.length - 1; i >= 0; i--) {
      const current = data[i];
      result <<= fields[i].size;
      result |= (isBigInt ? BigInt(current) : current);
    }
    return result;
  }

  /**
   * Decodes an encoded number into it's object representation according to the schema.
   *
   * @param {AnyNumber} data encoded number
   * @returns {UnpackedInt} object representation
   * @example
   *
   * class Person extends BitField {}
   * Person.fields = [
   *  { name: 'age', size: 7 },
   *  { name: 'gender', size: 1 },
   * ];
   * Person.decode(41);
   * //=> { age: 20, gender: 1 }
   */
  static decode(data) {
    const { fields, masks } = this;
    const result = {};
    let value = data;
    for (let i = 0; i < fields.length; i++) {
      const { name, size } = fields[i];
      result[name] = Number(value & masks[name]);
      value >>= size;
    }
    return result;
  }

  /**
   * Checks if a given set of values or all given pairs of field name and value
   * are valid according to the schema.
   *
   * @param {AnyNumber|UnpackedInt} data pairs of field name and value to check
   * @returns {boolean} whether all pairs are valid
   * @example
   *
   * class Person extends BitField {}
   * Person.fields = [
   *  { name: 'age', size: 7 },
   *  { name: 'gender', size: 1 },
   * ];
   * Person.isValid({age: 100})
   * //=> true
   * Person.isValid({age: 100, gender: 3})
   * //=> false
   * Person.isValid([100, 1])
   * //=> true
   * Person.isValid([100, 3])
   * //=> false
   */
  static isValid(data) {
    const { masks, fields } = this;
    const selectedFields = Array.isArray(data)
      ? fields.map((field, i) => [field.name, data[i]])
      : Object.entries(data);
    for (let i = 0; i < selectedFields.length; i++) {
      const [field, value] = selectedFields[i];
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
    const n = BigInt(number);
    const [zero, one, two] = [BigInt(0), BigInt(1), BigInt(2)];
    let high = BigInt(53);
    let low = zero;

    while (high - low > one) {
      const mid = (high + low) / two;
      const maskHigh = (one << high) - (one << mid);
      if ((maskHigh & n) > zero) {
        low = mid;
      } else {
        high = mid;
      }
    }
    return Number(low + one);
  }

  /**
   * Prepares the class to handle data according to it's schema provided in `BitField.fields`.
   * The method is called automatically the first time the constructor is used.
   *
   * @returns {void}
   */
  static initialize() {
    // determine total size and if BigInts are required
    const totalSize = this.fields.reduce((result, field) => result += (field.size || 1), 0);
    const isBigInt = totalSize > BITWISE_SIZE;
    const [zero, one, two] = isBigInt ? [BigInt(0), BigInt(1), BigInt(2)] : [0, 1, 2];

    // normalize fields, set masks and offsets
    const fields = [];
    const masks = {};
    const offsets = {};
    let lastOffset = zero;
    for (let i = 0; i < this.fields.length; i++) {
      const field = this.fields[i];
      const name = field.name || field;
      const size = isBigInt ? BigInt(field.size || 1) : field.size || 1;
      masks[name] = (two << size - one) - one;
      offsets[name] = lastOffset;
      lastOffset += size;
      fields.push({ name, size });
    }

    this.fields = fields;
    this.size = totalSize;
    this.mask = two << ((isBigInt ? BigInt(totalSize) : totalSize) - one);
    this.isBigInt = isBigInt;
    this.isSafe = totalSize <= MAX_SIZE;
    this.zero = zero;
    this.one = one;
    this.two = two;
    this.masks = masks;
    this.offsets = offsets;
    this.isInitialized = true;
  }

  /**
   * Creates an array of values to be used as a matcher
   * to efficiently match against multiple instances.
   *
   * @param {UnpackedInt} matcher an object containing field names and their values
   * @returns {Matcher} an array of precomputed values
   */
  static getMatcher(matcher) {
    const {
      masks, offsets, zero, isBigInt,
    } = this;
    const fields = Object.keys(matcher);
    let mask = zero;
    let value = zero;
    for (let i = 0; i < fields.length; i++) {
      const fieldName = fields[i];
      const fieldMask = masks[fieldName] << offsets[fieldName];
      const fieldValue = isBigInt ? BigInt(matcher[fieldName]) : matcher[fieldName];
      value = (value & ~fieldMask) | (fieldValue << offsets[fieldName]);
      mask |= fieldMask;
    }
    return [value, this.mask ^ mask];
  }

  /**
   * The static version of `BitField#match`, matches a given value against a precomputed matcher.
   *
   * @param {AnyNumber} value a value to check
   * @param {Matcher} matcher a precomputed set of values
   * @returns {boolean}
   *
   */
  static match(value, matcher) {
    return (value & matcher[1]) === matcher[0];
  }

  /**
   * Allows iterating over numbers stored in the instance.
   *
   * @yields {number}
   */
  * [Symbol.iterator]() {
    const { fields } = this.constructor;
    for (let i = 0; i < fields.length; i++) {
      yield this.get(fields[i].name);
    }
  }
}

/** @type {Array<FieldName>|Array<Field>} */
BitField.fields = Array.from({ length: BITWISE_SIZE }, (e, i) => i);

/** @type {number} */
BitField.size = BITWISE_SIZE;

/** @type {AnyNumber} */
BitField.zero = 0;

/** @type {AnyNumber} */
BitField.one = 1;

/** @type {AnyNumber} */
BitField.two = 2;

/** @type {Masks} */
BitField.masks = undefined;

/** @type {AnyNumber} */
BitField.mask = 2147483648;

/** @type {Masks} */
BitField.offsets = undefined;

/** @type {boolean} */
BitField.isBigInt = false;

/** @type {boolean} */
BitField.isSafe = false;

/** @type {boolean} */
BitField.isInitialized = false;

module.exports = BitField;
