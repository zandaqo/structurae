import { Constructor } from "./utility-types.ts";

export interface PrimitiveView<T> extends DataView {
  /**
   * Returns the JavaScript value of the view.
   */
  get(): T;

  /**
   * Sets the JavaScript value of the view.
   */
  set(value: T): void;

  /**
   * Returns the JavaScript value of the view.
   */
  toJSON(): T;
}

export interface ContainerView<T> extends DataView {
  /**
   * The amount of items in the view.
   */
  size: number;
  [Symbol.iterator](): Iterator<ViewInstance<T> | undefined>;

  /**
   * Get the JavaScript value of an item.
   *
   * @param index the index of the item
   * @return the item
   */
  get(index: number): T | undefined;

  /**
   * Returns the byte length of an item at a given index.
   *
   * @param index the index of the item
   * @return the byte length
   */
  getLength(index: number): number;

  /**
   * Returns the view of an item at a given index
   *
   * @param index the index of the item
   * @return a view of the item
   */
  getView(index: number): ViewInstance<T> | undefined;

  /**
   * Sets a given JavaScript value to an item at a given index.
   *
   * @param index the index of the item
   * @param value the JavaScript value to set
   */
  set(index: number, value: T): void;

  /**
   * Sets a given view to an item at a given index.
   *
   * @param index the index of the item
   * @param view the view to set
   */
  setView(index: number, view: DataView): void;

  /**
   * Returns the JavaScript value of the view.
   *
   * @return the javascript value
   */
  toJSON(): Array<T | undefined>;
}

export interface ComplexView<T> extends DataView {
  /**
   * Returns the JavaScript value of a given field.
   *
   * @param field the field name
   * @return the JavaScript value
   */
  get<P extends keyof T>(field: P): T[P] | undefined;

  /**
   * Returns the byte length of a given field.
   *
   * @param field the field name
   * @return the byte length
   */
  getLength<P extends keyof T>(field: P): number;

  /**
   * Returns the view of a field.
   *
   * @param field the field name
   * @return the view
   */
  getView<P extends keyof T>(field: P): ViewInstance<T[P]> | undefined;

  /**
   * Set a JavaScript value to a field.
   *
   * @param field the field name
   * @param value the JavaScript value
   */
  set<P extends keyof T>(field: P, value: T[P]): void;

  /**
   * Set a view to a given field.
   *
   * @param field the field name
   * @param view the view
   */
  setView<P extends keyof T>(field: P, view: DataView): void;

  /**
   * Returns the JavaScript value of the view.
   *
   * @return the javascript value
   */
  toJSON(): T;
}

export type ViewInstance<T> = [T] extends [boolean | number | string | bigint]
  ? PrimitiveView<T>
  : T extends Array<infer U> ? ContainerView<U>
  : T extends object ? ComplexView<T>
  : never;

export interface ViewConstructor<T, Instance = ViewInstance<T>> {
  /**
   * The byte length of the view.
   */
  viewLength: number;
  /**
   * The byte length of an item inside the container view.
   */
  itemLength?: number;
  layout?: ViewLayout<T>;
  defaultData?: Uint8Array;
  ObjectConstructor?: Constructor<T>;

  // deno-lint-ignore no-explicit-any
  new (...args: any[]): Instance;
  /**
   * Decodes a given view into corresponding JavaScript value.
   *
   * @param view the view to decode
   * @param start the starting offset
   * @param length the byte length to decode
   * @return the JavaScript value
   */
  decode(view: DataView, start?: number, length?: number): T;
  /**
   * Encodes a JavaScript value into a given view.
   *
   * @param value the value encode
   * @param view the view to encode into
   * @param start the offset to start encoding
   * @param length the byte length to encode
   * @return the amount of written bytes
   */
  encode(value: T, view: DataView, start?: number, length?: number): number;
  /**
   * Creates a view from a given JavaScript value.
   *
   * @param value the JavaScript value
   */
  from(value: T): Instance;
  /**
   * Returns the length of the view.
   *
   * @param size the amount of items for ArrayView or the value for MapView and VectorView
   */
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

export type ViewSchemaType =
  | "string"
  | "number"
  | "integer"
  | "boolean"
  | "object"
  | "array";

export type ViewSchemaNumberType =
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

export interface ViewSchema<T> {
  $id?: string;
  $ref?: `#${string}`;
  maxLength?: number;
  minLength?: number;
  minimum?: number;
  maximum?: number;
  items?: T extends Array<infer U> ? ViewSchema<U> : never;
  maxItems?: number;
  minItems?: number;
  required?: Array<keyof T>;
  properties?: {
    [P in keyof T]: ViewSchema<T[P]>;
  };
  type: ViewSchemaType;
  btype?: T extends number ? ViewSchemaNumberType
    : T extends Array<unknown> ? "vector"
    : T extends object ? "map"
    : never;
  default?: T;
}
