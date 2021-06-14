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
  : T extends Array<infer U> ? ContainerView<U>
  : T extends object ? ComplexView<T>
  : never;

export interface ViewConstructor<T, Instance = ViewInstance<T>> {
  viewLength: number;
  itemLength?: number;
  layout?: ViewLayout<T>;
  defaultData?: Uint8Array;
  // deno-lint-ignore no-explicit-any
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
  maxLength?: number;
  minLength?: number;
  minimum?: number;
  maximum?: number;
  items?: Schema;
  maxItems?: number;
  minItems?: number;
  required?: string[];
  properties?: {
    [k: string]: Schema;
  };
  type: SchemaTypeName;
  btype?: SchemaBinaryType;
  default?: SchemaType;
}

// Workaround for infinite type recursion
export interface SchemaObject {
  [key: string]: SchemaType;
}

// Workaround for infinite type recursion
// https://github.com/Microsoft/TypeScript/issues/3496#issuecomment-128553540
// deno-lint-ignore no-empty-interface
export interface SchemaArray extends Array<SchemaType> {}
