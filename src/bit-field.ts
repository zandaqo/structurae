import { getBitSize } from "./utilities";

/**
 * The largest safe integer for bitwise operations.
 */
const SIGN_BIT = 2147483647;

/**
 * The maximum safe size for bitwise operations on standard numbers.
 */
const MAX_BITWISE_SIZE = 31;

export function BitFieldMixin<
  K extends PropertyKey,
  T extends Record<K, number>
>(schema: T) {
  type PartialField = Partial<T>;
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
  const Class = class BitFieldClass {
    static schema = schema;
    static fields: Array<K>;
    static masks: Record<K, number>;
    static offsets: Record<K, number>;
    static mask: number;
    static size: number;
    value = 0;

    /**
     * @param [data=0] a single number value of the field
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
    constructor(data: number | BitFieldClass | Array<number> | T = 0) {
      this.value =
        typeof data === "number"
          ? data
          : data instanceof BitFieldClass
          ? data.valueOf()
          : (this.constructor as typeof BitFieldClass).encode(data);
    }

    /**
     * Decodes an encoded number into its object representation according to the schema.
     *
     * @param data encoded number
     * @return object representation
     * @example
     *
     * const data = Field.encode({ width: 10, height: 20 })
     * //=> 5130
     * Field.decode(5130);
     * //=> { width: 10, height: 20 }
     */
    static decode(data: number): Record<K, number> {
      const { fields, masks, schema } = this;
      const result = {} as Record<K, number>;
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
     * Encodes a given list of numbers or map of fields and their respective values
     * into a single number according to the schema.
     *
     * @param data the list of numbers to encode
     * @return encoded number
     * @example
     *
     * Field.encode({ width: 10, height: 20 })
     * //=> 5130
     */
    static encode(data: Array<number> | T): number {
      const { fields, schema } = this;
      const array = Array.isArray(data)
        ? data
        : fields.map((name) => data[name] || 0);
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
     * Creates an array of values to be used as a matcher
     * to efficiently match against multiple instances.
     *
     * @param matcher an object containing field names and their values
     * @return an array of precomputed values
     */
    static getMatcher(matcher: PartialField): [number, number] {
      const { masks, offsets } = this;
      const fields = Object.keys(matcher) as Array<K>;
      let mask = 0;
      let value = 0;
      for (let i = 0; i < fields.length; i++) {
        const fieldName = fields[i];
        const fieldMask = masks[fieldName] << offsets[fieldName];
        const fieldValue = matcher[fieldName]!;
        value = (value & ~fieldMask) | (fieldValue << offsets[fieldName]);
        mask |= fieldMask;
      }
      return [value, this.mask ^ mask];
    }

    /**
     * Returns the minimum amount of bits necessary to hold a given number.
     *
     * @param number
     * @return the amount of bits
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
    static getMinSize(number: number): number {
      return getBitSize(number);
    }

    /**
     * Prepares the class to handle data according to its schema provided in `BitField.schema`.
     *
     *
     */
    static initialize(): void {
      const { schema } = this;
      const fields = Object.keys(schema) as Array<K>;

      const masks = {} as Record<K, number>;
      const offsets = {} as Record<K, number>;
      let lastOffset = 0;
      for (let i = 0; i < fields.length; i++) {
        const field = fields[i];
        const size = schema[field];
        masks[field] = (2 << (size - 1)) - 1;
        offsets[field] = lastOffset;
        lastOffset += size;
      }

      if (lastOffset > MAX_BITWISE_SIZE) {
        throw TypeError("The total size of the bitfield exceeds 31 bits.");
      }

      this.schema = schema;
      this.fields = fields;
      this.size = lastOffset;
      this.mask = 2 << (lastOffset - 1);
      this.masks = masks;
      this.offsets = offsets;
    }

    /**
     * Checks if a given set of values or all given pairs of field name and value
     * are valid according to the schema.
     *
     * @param data pairs of field name and value to check
     * @return whether all pairs are valid
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
    static isValid(data: T): boolean {
      const { masks } = this;
      const fields = Object.keys(data) as Array<K>;
      for (let i = 0; i < fields.length; i++) {
        const field = fields[i];
        const value = data[field];
        if ((value & SIGN_BIT) !== value || value > masks[field]) return false;
      }
      return true;
    }

    /**
     * The static version of `BitField#match`, matches a given value against a precomputed matcher.
     *
     * @param value a value to check
     * @param matcher a precomputed set of values
     *
     * @example
     *
     * Field.match(new Field({ width: 10 }), Field.getMatcher({ width: 10 }));
     * //=> true
     * Field.match(new Field({ width: 100 }), Field.getMatcher({ width: 10}));
     * //=> false
     */
    static match(value: number, matcher: [number, number]): boolean {
      return (value & matcher[1]) === matcher[0];
    }

    /**
     * Allows iterating over numbers stored in the instance.
     *
     *
     */
    *[Symbol.iterator]() {
      const { fields } = this.constructor as typeof BitFieldClass;
      for (let i = 0; i < fields.length; i++) {
        yield this.get(fields[i]);
      }
    }

    /**
     * Returns the value of a given field.
     *
     * @param field name of the field
     * @return value value of the field
     * @example
     *
     * const field = new Field({ width: 100, height: 200 });
     * //=> Field { value: 51300 }
     * field.get('width');
     * //=> 100;
     * field.get('height');
     * //=> 200;
     */
    get(field: K): number {
      const { offsets, masks } = this.constructor as typeof BitFieldClass;
      return (this.value >> offsets[field]) & masks[field];
    }

    /**
     * Checks if an instance has all the specified fields set to 1. Useful for bit flags.
     *
     * @param fields names of the fields to check
     * @return whether all the specified fields are set in the instance
     * @example
     *
     * const Flags = BitFieldMixin(['a', 'b', 'c']);
     * const settings = new Flags({ 'a': 0, 'b': 1, 'c': 1 });
     * settings.has('b', 'c');
     * //=> true
     * settings.has('a', 'b');
     * //=> false
     */
    has(...fields: Array<K>): boolean {
      const { offsets } = this.constructor as typeof BitFieldClass;
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
     * @param matcher an object with key-value pairs,
     *                                                or an array of precomputed matcher values
     * @return whether the instance matches with the provided fields
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
    match(matcher: PartialField | [number, number]): boolean {
      return (this.constructor as typeof BitFieldClass).match(
        this.value,
        Array.isArray(matcher)
          ? matcher
          : (this.constructor as typeof BitFieldClass).getMatcher(matcher)
      );
    }

    /**
     * Stores a given value in a field.
     *
     * @param field name of the field
     * @param value value of the field
     * @return the instance
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
    set(field: K, value = 1): this {
      const { offsets, masks } = this.constructor as typeof BitFieldClass;
      this.value =
        (this.value & ~(masks[field] << offsets[field])) |
        (value << offsets[field]);
      return this;
    }

    /**
     * Returns the numerical value of an instance.
     *
     *
     */
    toJSON() {
      return this.value;
    }

    /**
     * Returns the object representation of the instance,
     * with field names as properties with corresponding values.
     * @return the object representation of the instance
     * @example
     *
     * const field = new Field({ width: 10, height: 20 });
     * field.toObject();
     * //=> { width: 10, height: 20 }
     */
    toObject(): Record<K, number> {
      return (this.constructor as typeof BitFieldClass).decode(this.value);
    }

    /**
     * Returns a string representing the value of the instance.
     *
     * @return a string representing the value of the instance
     */
    toString(): string {
      return this.value.toString();
    }

    /**
     * Returns the numerical value of an instance.
     *
     * @return the numerical value of the instance
     */
    valueOf(): number {
      return this.value;
    }
  };
  Class.initialize();
  return Class;
}

export const BitField = BitFieldMixin(
  Array.from({ length: MAX_BITWISE_SIZE }, (_, i) => i).reduce((a, i) => {
    a[i] = 1;
    return a;
  }, {} as Record<string, number>)
);
