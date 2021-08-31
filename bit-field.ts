import { getBitSize } from "./utilities.ts";
import type {
  BitFieldConstructor,
  BitFieldStructure,
} from "./bit-field-types.ts";

const SIGN_BIT = 2147483647;
const MAX_BITWISE_SIZE = 31;

class BitField<
  K extends PropertyKey,
> implements BitFieldStructure<K, number> {
  static schema: Record<PropertyKey, number>;
  static fields: Array<PropertyKey>;
  static masks: Record<PropertyKey, number>;
  static offsets: Record<PropertyKey, number>;
  static mask = 2 << 30;
  static size = 31;
  value = 0;

  constructor(
    data: number | BitField<K> | Array<number> | Record<K, number> = 0,
  ) {
    this.value = typeof data === "number"
      ? data
      : data instanceof BitField
      ? data.valueOf()
      : (this.constructor as typeof BitField).encode(data);
  }

  static decode<K extends PropertyKey>(
    data: number,
  ): Record<K, number> {
    const schema = this.schema as Record<K, number>;
    const fields = this.fields as Array<K>;
    const masks = this.masks as Record<K, number>;
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

  static encode<K extends PropertyKey>(
    data: Array<number> | Record<K, number>,
  ): number {
    const schema = this.schema as Record<K, number>;
    const fields = this.fields as Array<K>;
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

  static getMatcher<K extends PropertyKey>(
    matcher: Partial<Record<K, number>>,
  ): [number, number] {
    const masks = this.masks as Record<K, number>;
    const offsets = this.offsets as Record<K, number>;
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

  static getMinSize(number: number): number {
    return getBitSize(number);
  }

  static isValid<T extends Record<K, number>, K extends keyof T>(
    data: T,
  ): boolean {
    const masks = this.masks as T;
    const fields = Object.keys(data) as Array<K>;
    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];
      const value = data[field];
      if ((value & SIGN_BIT) !== value || value > masks[field]) return false;
    }
    return true;
  }

  static match(value: number, matcher: [number, number]): boolean {
    return (value & matcher[1]) === matcher[0];
  }

  *[Symbol.iterator](): Generator<number> {
    const fields = (this.constructor as BitFieldConstructor<K>).fields;
    for (let i = 0; i < fields.length; i++) {
      yield this.get(fields[i]);
    }
  }

  get(field: K): number {
    const { offsets, masks } = this.constructor as BitFieldConstructor<K>;
    return (this.value >> offsets[field]) & masks[field];
  }

  has(...fields: Array<K>): boolean {
    const { offsets } = this.constructor as BitFieldConstructor<K>;
    let mask = 0;
    for (let i = 0; i < fields.length; i++) {
      mask |= 1 << offsets[fields[i]];
    }
    mask |= this.value;
    return this.value === mask;
  }

  match(matcher: Partial<Record<K, number>> | [number, number]): boolean {
    return (this.constructor as BitFieldConstructor<K>).match(
      this.value,
      Array.isArray(matcher)
        ? matcher
        : (this.constructor as BitFieldConstructor<K>).getMatcher(matcher),
    );
  }

  set(field: K, value = 1): this {
    const { offsets, masks } = this.constructor as BitFieldConstructor<K>;
    this.value = (this.value & ~(masks[field] << offsets[field])) |
      (value << offsets[field]);
    return this;
  }

  toJSON() {
    return this.value;
  }

  toObject(): Record<K, number> {
    return (this.constructor as BitFieldConstructor<K>).decode(this.value);
  }

  toString(): string {
    return this.value.toString();
  }

  valueOf(): number {
    return this.value;
  }
}

/**
 * Creates a BitField class from with a given schema. BitField uses numbers as bitfields
 * to store and operate on data using bitwise operations. The size of the field is limited to 31 bits,
 * for a larger bitfields consider using BigBitField class that uses bigints instead.
 *
 * @param schema the schema
 * @returns the BitFieldClass
 *
 * @example
 * const Field = BitFieldMixin({ width: 8, height: 8 });
 * const field = new Field({ width: 100, height: 200 });
 * field.get('width');
 * //=> 100;
 * field.get('height');
 * //=> 200
 * field.set('width', 18);
 * field.get('width');
 * //=> 18
 * field.toObject();
 * //=> { width: 18, height: 200 }
 */
export function BitFieldMixin<
  T extends Record<K, number>,
  K extends keyof T,
>(schema: T): BitFieldConstructor<K> {
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

  return class extends BitField<K> {
    static schema = schema;
    static fields = fields;
    static masks = masks;
    static offsets = offsets;
    size = lastOffset;
    mask = 2 << (lastOffset - 1);
  };
}

const _BitField = BitFieldMixin({
  0: 1,
  1: 1,
  2: 1,
  3: 1,
  4: 1,
  5: 1,
  6: 1,
  7: 1,
  8: 1,
  9: 1,
  10: 1,
  11: 1,
  12: 1,
  13: 1,
  14: 1,
  15: 1,
  16: 1,
  17: 1,
  18: 1,
  19: 1,
  20: 1,
  21: 1,
  22: 1,
  23: 1,
  24: 1,
  25: 1,
  26: 1,
  27: 1,
  28: 1,
  29: 1,
  30: 1,
});

export { _BitField as BitField };
