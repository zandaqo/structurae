import { getBitSize } from "./utilities.ts";
import type {
  BitFieldConstructor,
  BitFieldStructure,
} from "./bit-field-types.ts";

const SIGN_BIT = BigInt(2147483647);
const ZERO = BigInt(0);
const ONE = BigInt(1);
const TWO = BigInt(2);

class BigBitField<K extends PropertyKey>
  implements BitFieldStructure<K, bigint> {
  static schema: Record<PropertyKey, bigint>;
  static fields: Array<PropertyKey>;
  static masks: Record<PropertyKey, bigint>;
  static offsets: Record<PropertyKey, bigint>;
  static mask: bigint;
  static size: bigint;
  value = ZERO;

  constructor(
    data: bigint | BigBitField<K> | Array<number> | Record<K, number> = ZERO,
  ) {
    this.value = data instanceof BigBitField
      ? data.valueOf()
      : typeof data === "object"
      ? (this.constructor as typeof BigBitField).encode(data)
      : BigInt(data);
  }

  static decode<K extends PropertyKey>(data: bigint): Record<K, number> {
    const schema = this.schema as Record<K, bigint>;
    const fields = this.fields as Array<K>;
    const masks = this.masks as Record<K, bigint>;
    const result = {} as Record<K, number>;
    let value = data;
    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];
      result[field] = Number(value & masks[field]);
      value >>= schema[field];
    }
    return result;
  }

  static encode<K extends PropertyKey>(
    data: Array<number> | Record<K, number>,
  ): bigint {
    const schema = this.schema as Record<K, bigint>;
    const fields = this.fields as Array<K>;
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

  static getMatcher<K extends PropertyKey>(
    matcher: Partial<Record<K, number>>,
  ): [bigint, bigint] {
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

  static getMinSize(number: number): number {
    return getBitSize(number);
  }

  static isValid<K extends PropertyKey>(
    data: Partial<Record<K, number>>,
  ): boolean {
    const { masks } = this;
    const fields = Object.keys(data) as Array<K>;
    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];
      const value = BigInt(data[field]!);
      if ((value & SIGN_BIT) !== value || value > masks[field]) return false;
    }
    return true;
  }

  static match(value: bigint, matcher: [bigint, bigint]) {
    return (value & matcher[1]) === matcher[0];
  }

  *[Symbol.iterator]() {
    const { fields } = this.constructor as BitFieldConstructor<K, bigint>;
    for (let i = 0; i < fields.length; i++) {
      yield this.get(fields[i]);
    }
  }

  get(field: K): number {
    const { offsets, masks } = this.constructor as BitFieldConstructor<
      K,
      bigint
    >;
    const value = (this.value >> offsets[field]) & masks[field];
    return Number(value);
  }

  has(...fields: Array<K>): boolean {
    const { offsets } = this.constructor as BitFieldConstructor<K, bigint>;
    let mask = ZERO;
    for (let i = 0; i < fields.length; i++) {
      mask |= ONE << offsets[fields[i]];
    }
    mask |= this.value;
    return this.value === mask;
  }

  match(matcher: Partial<Record<K, number>> | [bigint, bigint]): boolean {
    return (this.constructor as BitFieldConstructor<K, bigint>).match(
      this.value,
      Array.isArray(matcher)
        ? matcher
        : (this.constructor as BitFieldConstructor<K, bigint>).getMatcher(
          matcher,
        ),
    );
  }

  set(field: K, value = 1) {
    const { offsets, masks } = this.constructor as BitFieldConstructor<
      K,
      bigint
    >;
    const offset: bigint = offsets[field];
    this.value = (this.value & ~(masks[field] << offset)) |
      (BigInt(value) << offsets[field]);
    return this;
  }

  toJSON() {
    return this.value;
  }

  toObject(): Record<K, number> {
    return (this.constructor as BitFieldConstructor<K, bigint>).decode(
      this.value,
    );
  }

  toString(): string {
    return this.value.toString();
  }

  valueOf(): bigint {
    return this.value;
  }
}

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
  T extends Record<K, number>,
  K extends keyof T,
>(schema: T): BitFieldConstructor<K, bigint> {
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

  return class extends BigBitField<K> {
    static schema = _schema;
    static fields = fields;
    static masks = masks;
    static offsets = offsets;
    static size = lastOffset;
    static mask = TWO << (BigInt(lastOffset) - ONE);
  };
}
