export interface BitFieldStructure<
  K extends PropertyKey,
  N extends number | bigint = number,
> {
  value: N;
  /**
   * Iterates over numbers stored in the instance.
   */
  [Symbol.iterator](): Generator<number>;
  /**
   * Returns the value of a given field.
   *
   * @param field the name of the field
   * @return value of the field
   */
  get(field: K): number;
  /**
   * Checks whether the instance has all the specified fields set to 1. Useful for bit flags.
   *
   * @param fields names of the fields to check
   * @return whether all the specified fields are set in the instance
   */
  has(...fields: Array<K>): boolean;
  /**
   * Checks if the instance contains all the key-value pairs listed in matcher.
   * Use `BigBitField.getMatcher` to get an array of precomputed values
   * that you can use to efficiently compare multiple instances
   * to the same key-value pairs as shown in the examples below.
   *
   * @param matcher an object with key-value pairs, or an array of precomputed matcher values
   * @return whether the instance matches with the provided fields
   */
  match(matcher: Partial<Record<K, number>> | [N, N]): boolean;
  /**
   * Stores a given value in a field.
   *
   * @param field name of the field
   * @param value value of the field
   * @return the instance
   */
  set(field: K, value?: number): this;
  /**
   * Returns the bigint value of an instance.
   */
  toJSON(): N;
  /**
   * Returns the object representation of the instance,
   * with field names as properties with corresponding values.
   */
  toObject(): Record<K, number>;
  /**
   * Returns a string representing the value of the instance.
   */
  toString(): string;
  /**
   * Returns the bigint value of an instance.
   */
  valueOf(): N;
}

export interface BitFieldConstructor<
  K extends PropertyKey,
  N extends number | bigint = number,
> {
  schema: Record<K, N>;
  fields: Array<K>;
  masks: Record<K, N>;
  offsets: Record<K, N>;
  mask: N;
  size: N;
  /**
   * @param data a single numerical value of the bitfield,
   * a bitfield, or a map of field names with their respective values
   */
  new (
    data?: N | BitFieldStructure<K, N> | Array<number> | Record<K, number>,
  ): BitFieldStructure<K, N>;
  /**
   * Decodes a numeric value into its object representation according to the schema.
   *
   * @param data a numeric value
   * @return object representation
   */
  decode(data: N): Record<K, number>;
  /**
   * Encodes a given list of numbers or map of fields and their respective values
   * into a single numeric value according to the schema.
   *
   * @param data a list of numbers or an object to encode
   * @return encoded numeric value
   */
  encode(data: Array<number> | Record<K, number>): N;
  /**
   * Creates a tuple of values to be used as a matcher
   * to efficiently match against multiple instances.
   *
   * @param matcher an object containing field names and their values
   * @return a tuple of precomputed values
   */
  getMatcher(matcher: Partial<Record<K, number>>): [N, N];
  /**
   * Returns the minimum amount of bits necessary to hold a given number.
   *
   * @param number
   * @return the amount of bits
   */
  getMinSize(value: number): number;
  /**
   * Checks if a given set of values are valid according to the schema.
   *
   * @param data a map of field names and their values to check
   * @return whether all pairs are valid
   */
  isValid(data: Partial<Record<K, number>>): boolean;
  /**
   * The static version of `BitField#match`, matches a given value against a precomputed matcher.
   *
   * @param value a value to check
   * @param matcher a precomputed set of values
   */
  match(value: N, matcher: [N, N]): boolean;
}
