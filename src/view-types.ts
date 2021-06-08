export interface PrimitiveView<T> extends DataView {
  get(): T;
  set(value: T): void;
  toJSON(): T;
}

export interface ContainerView<T> extends DataView {
  size: number;
  [Symbol.iterator](): Iterator<ViewInstance<T> | undefined>;
  get(index: number): T | undefined;
  getLength(index: number): number;
  getView(index: number): ViewInstance<T> | undefined;
  set(index: number, value: T): void;
  setView(index: number, view: DataView): void;
  toJSON(): Array<T | undefined>;
}

export interface ComplexView<T> extends DataView {
  get<P extends keyof T>(field: P): T[P] | undefined;
  getLength<P extends keyof T>(field: P): number;
  getView<P extends keyof T>(field: P): ViewInstance<T[P]> | undefined;
  set<P extends keyof T>(field: P, value: T[P]): void;
  setView<P extends keyof T>(field: P, view: DataView): void;
  toJSON(): T;
}

export type ViewInstance<T> = [T] extends [boolean | number | string | bigint]
  ? PrimitiveView<T>
  : T extends Array<infer U>
  ? ContainerView<U>
  : T extends object
  ? ComplexView<T>
  : never;

export interface ViewConstructor<T, Instance = ViewInstance<T>> {
  viewLength: number;
  itemLength?: number;
  layout?: ViewLayout<T>;
  defaultData?: Uint8Array;
  new (...args: any[]): Instance;
  decode(view: DataView, start?: number, length?: number): T;
  encode(value: T, view: DataView, start?: number, length?: number): number;
  from(value: T): Instance;
  getLength(size?: number | unknown): number;
}

export type ViewFieldLayout<T> = {
  View: ViewConstructor<T>;
  start: number;
  length: number;
  default?: T;
  required?: boolean;
};

export type ViewLayout<T> = {
  [key in keyof T]: ViewFieldLayout<T[key]>;
};

export type SchemaTypeName =
  | "string"
  | "number"
  | "integer"
  | "boolean"
  | "object"
  | "array";

export type SchemaType =
  | string
  | number
  | boolean
  | SchemaObject
  | SchemaArray
  | undefined;

export type SchemaBinaryType =
  | "map"
  | "vector"
  | "int8"
  | "uint8"
  | "int16"
  | "uint16"
  | "int32"
  | "uint32"
  | "float32"
  | "float64"
  | "bigint64"
  | "biguint64";

export interface Schema {
  $id?: string;
  $ref?: string;

  /**
   * Must be a non-negative integer.
   * A string instance is valid against this keyword if its length is less than, or equal to, the value of this keyword.
   * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.6
   */
  maxLength?: number;

  /**
   * Must be a non-negative integer.
   * A string instance is valid against this keyword if its length is greater than, or equal to, the value of this keyword.
   * Omitting this keyword has the same behavior as a value of 0.
   * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.7
   */
  minLength?: number;

  /**
   * This keyword determines how child instances validate for arrays, and does not directly validate the immediate instance itself.
   * Omitting this keyword has the same behavior as an empty schema.
   * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.9
   */
  items?: Schema;

  /**
   * Must be a non-negative integer.
   * An array instance is valid against "maxItems" if its size is less than, or equal to, the value of this keyword.
   * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.11
   */
  maxItems?: number;

  /**
   * Must be a non-negative integer.
   * An array instance is valid against "maxItems" if its size is greater than, or equal to, the value of this keyword.
   * Omitting this keyword has the same behavior as a value of 0.
   * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.12
   */
  minItems?: number;

  /**
   * Elements of this array must be unique.
   * An object instance is valid against this keyword if every item in the array is the name of a property in the instance.
   * Omitting this keyword has the same behavior as an empty array.
   *
   * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.17
   */
  required?: string[];

  /**
   * This keyword determines how child instances validate for objects, and does not directly validate the immediate instance itself.
   * Validation succeeds if, for each name that appears in both the instance and as a name within this keyword's value,
   * the child instance for that name successfully validates against the corresponding schema.
   * Omitting this keyword has the same behavior as an empty object.
   * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.18
   */
  properties?: {
    [k: string]: Schema;
  };

  /**
   * A single type, or a union of simple types
   * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.25
   */
  type: SchemaTypeName;

  btype?: SchemaBinaryType;

  /**
   * This keyword can be used to supply a default JSON value associated with a particular schema.
   * It is RECOMMENDED that a default value be valid against the associated schema.
   * @see https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-7.3
   */
  default?: SchemaType;
}

// Workaround for infinite type recursion
export interface SchemaObject {
  [key: string]: SchemaType;
}

// Workaround for infinite type recursion
// https://github.com/Microsoft/TypeScript/issues/3496#issuecomment-128553540
export interface SchemaArray extends Array<SchemaType> {}
