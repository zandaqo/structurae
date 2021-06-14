// deno-lint-ignore no-explicit-any
export type Constructor<T = unknown> = new (...args: any[]) => T;

export type Bit = 0 | 1;

export interface IndexedCollection<T = number> {
  length: number;
  [n: number]: T;
}

export type TypedArrayConstructors =
  | Constructor<Int8Array>
  | Constructor<Uint8Array>
  | Constructor<Uint8ClampedArray>
  | Constructor<Int16Array>
  | Constructor<Uint16Array>
  | Constructor<Int32Array>
  | Constructor<Uint32Array>
  | Constructor<Float32Array>
  | Constructor<Float64Array>;

export interface AdjacencyStructure extends IndexedCollection {
  empty: unknown;
  vertices: number;
  edges: number;
  addEdge(x: number, y: number, weight: number): this;
  getEdge(x: number, y: number): number;
  hasEdge(x: number, y: number): boolean;
  inEdges(x: number): IterableIterator<number>;
  isFull(): boolean;
  outEdges(x: number): IterableIterator<number>;
  removeEdge(x: number, y: number): this;
}

export interface AdjacencyStructureConstructor<
  U extends TypedArrayConstructors,
> {
  directed: boolean;
  weighted: boolean;
  // deno-lint-ignore no-explicit-any
  new (...args: any[]): AdjacencyStructure;
  create(
    vertices: number,
    edges?: number,
  ): AdjacencyStructure & InstanceType<U>;
  getLength(vertices: number, edges?: number): number;
}
