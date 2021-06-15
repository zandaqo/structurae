import { getBitSize } from "./utilities.ts";

const SIGN_BIT = BigInt(2147483647);
const ZERO = BigInt(0);
const ONE = BigInt(1);
const TWO = BigInt(2);

/**
 * Creates a BigBitField class with a given schema. BigBitField uses bigints as bitfields
 * to store and operate on data using bitwise operations.
 *
 * @param schema the schema
 * @returns the BigBitFieldClass
 *
 * @example
 * const LargeField = BitFieldMixin({ width: 20, height: 20 });
 * const largeField = new LargeField({ width: 1048576, height: 1048576 });
 * largeField.value
 * //=> 1099512676352n
 * largeField.set('width', 1000).get('width')
 * //=> 1000
 * largeField.toObject()
 * //=> { width: 1000, height: 1048576 }
 */
export function BigBitFieldMixin<
  T extends Record<string, number>,
  K extends keyof T,
>(schema: T) {
  const Class = class BigBitFieldClass {
    static schema: Record<K, bigint>;
    static fields: Array<K>;
    static masks: Record<K, bigint>;
    static offsets: Record<K, bigint>;
    static mask: bigint;
    static size: bigint;
    value = ZERO;

    /**
     * @param data a single number value of the field,
     * a bit field, or a map of field names with their respective values
     */
    constructor(data: bigint | BigBitFieldClass | Array<number> | T = ZERO) {
      this.value = data instanceof BigBitFieldClass
        ? data.valueOf()
        : typeof data === "object"
        ? (this.constructor as typeof BigBitFieldClass).encode(data)
        : BigInt(data);
    }

    /**
     * Decodes an encoded number into its object representation according to the schema.
     *
     * @param data encoded number
     * @return object representation
     */
    static decode(data: bigint): Record<K, number> {
      const { fields, masks, schema } = this;
      const result = {} as Record<K, number>;
      let value = data;
      for (let i = 0; i < fields.length; i++) {
        const field = fields[i];
        result[field] = Number(value & masks[field]);
        value >>= schema[field];
      }
      return result;
    }

    /**
     * Encodes a given list of numbers or map of fields and their respective values
     * into a single number according to the schema.
     *
     * @param data the list of numbers to encode
     * @return encoded number
     */
    static encode(data: Array<number> | T): bigint {
      const { fields, schema } = this;
      const array = Array.isArray(data)
        ? data
        : fields.map((name) => data[name] || 0);
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
     * Creates an array of values to be used as a matcher
     * to efficiently match against multiple instances.
     *
     * @param matcher an object containing field names and their values
     * @return an array of precomputed values
     */
    static getMatcher(matcher: Partial<T>): [bigint, bigint] {
      const { masks, offsets } = this;
      const fields = Object.keys(matcher) as Array<K>;
      let mask = ZERO;
      let value = ZERO;
      for (let i = 0; i < fields.length; i++) {
        const fieldName = fields[i];
        const offset: bigint = offsets[fieldName];
        const fieldMask = masks[fieldName] << offset;
        const fieldValue = BigInt(matcher[fieldName]!);
        value = (value & ~fieldMask) | (fieldValue << offsets[fieldName]);
        mask |= fieldMask;
      }
      return [value, this.mask ^ mask];
    }

    /**
     * Returns the minimum amount of bits necessary to hold a given number.
     *
     * @param number the number
     * @return the amount of bits
     */
    static getMinSize(number: number): number {
      return getBitSize(number);
    }

    /**
     * Prepares the class to handle data according to its schema provided in `BigBitField.schema`.
     */
    static initialize(schema: Record<K, number>): void {
      const fields = Object.keys(schema) as Array<K>;

      const _schema = {} as Record<K, bigint>;
      const masks = {} as Record<K, bigint>;
      const offsets = {} as Record<K, bigint>;
      let lastOffset = ZERO;
      for (let i = 0; i < fields.length; i++) {
        const field = fields[i];
        const size = BigInt(schema[field]);
        _schema[field] = size;
        masks[field] = (TWO << (size - ONE)) - ONE;
        offsets[field] = lastOffset;
        lastOffset += size;
      }

      this.schema = _schema;
      this.fields = fields;
      this.size = lastOffset;
      this.mask = TWO << (BigInt(lastOffset) - ONE);
      this.masks = masks;
      this.offsets = offsets;
    }

    /**
     * Checks if a given set of values or all given pairs of field name and value
     * are valid according to the schema.
     *
     * @param data pairs of field name and value to check
     * @return whether all pairs are valid
     */
    static isValid(data: Partial<T>): boolean {
      const { masks } = this;
      const fields = Object.keys(data) as Array<K>;
      for (let i = 0; i < fields.length; i++) {
        const field = fields[i];
        const value = BigInt(data[field]!);
        if ((value & SIGN_BIT) !== value || value > masks[field]) return false;
      }
      return true;
    }

    /**
     * The static version of `BigBitField#match`, matches a given value against a precomputed matcher.
     *
     * @param value a value to check
     * @param matcher a precomputed set of values
     */
    static match(value: bigint, matcher: [bigint, bigint]) {
      return (value & matcher[1]) === matcher[0];
    }

    /**
     * Iterates over numbers stored in the instance.
     */
    *[Symbol.iterator]() {
      const { fields } = this.constructor as typeof BigBitFieldClass;
      for (let i = 0; i < fields.length; i++) {
        yield this.get(fields[i]);
      }
    }

    /**
     * Returns the value of a given field.
     *
     * @param field name of the field
     * @return value of the field
     */
    get(field: K) {
      const { offsets, masks } = this.constructor as typeof BigBitFieldClass;
      const value = (this.value >> offsets[field]) & masks[field];
      return Number(value);
    }

    /**
     * Checks whether an instance has all the specified fields set to 1. Useful for bit flags.
     *
     * @param fields names of the fields to check
     * @return whether all the specified fields are set in the instance
     */
    has(...fields: Array<K>): boolean {
      const { offsets } = this.constructor as typeof BigBitFieldClass;
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
     * @param matcher an object with key-value pairs, or an array of precomputed matcher values
     * @return whether the instance matches with the provided fields
     */
    match(matcher: Partial<T> | [bigint, bigint]): boolean {
      return (this.constructor as typeof BigBitFieldClass).match(
        this.value,
        Array.isArray(matcher)
          ? matcher
          : (this.constructor as typeof BigBitFieldClass).getMatcher(matcher),
      );
    }

    /**
     * Stores a given value in a field.
     *
     * @param field name of the field
     * @param value value of the field
     * @return the instance
     */
    set(field: K, value = 1) {
      const { offsets, masks } = this.constructor as typeof BigBitFieldClass;
      const offset: bigint = offsets[field];
      this.value = (this.value & ~(masks[field] << offset)) |
        (BigInt(value) << offsets[field]);
      return this;
    }

    /**
     * Returns the bigint value of an instance.
     */
    toJSON() {
      return this.value;
    }

    /**
     * Returns the object representation of the instance,
     * with field names as properties with corresponding values.
     */
    toObject(): Record<K, number> {
      return (this.constructor as typeof BigBitFieldClass).decode(this.value);
    }

    /**
     * Returns a string representing the value of the instance.
     */
    toString(): string {
      return this.value.toString();
    }

    /**
     * Returns the bigint value of an instance.
     */
    valueOf(): bigint {
      return this.value;
    }
  };
  Class.initialize(schema);
  return Class;
}
