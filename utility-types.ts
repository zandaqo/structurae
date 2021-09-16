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
  /**
   * The number of vertices.
   */
  vertices: number;
  /**
   * The maximum number of edges.
   */
  edges: number;
  /**
   * Adds an edge between two vertices.
   *
   * @param x the starting vertex
   * @param y the ending vertex
   * @param weight the weight
   * @return the structure
   */
  addEdge(x: number, y: number, weight?: number): this;
  /**
   * Returns the weight of the edge between given vertices
   * or NaN if the edge doesn't exist.
   *
   * @param x the starting vertex
   * @param y the ending vertex
   * @returns the edge
   */
  getEdge(x: number, y: number): number;
  /**
   * Checks if there is an edge between two vertices.
   *
   * @param x the starting vertex
   * @param y the ending vertex
   */
  hasEdge(x: number, y: number): boolean;
  /**
   * Iterates over incoming edges of a vertex.
   *
   * @param vertex the vertex
   */
  inEdges(x: number): Generator<number, void, unknown>;
  /**
   * Check if all available edges are set.
   */
  isFull(): boolean;
  /**
   * Iterates over outgoing edges of a vertex.
   *
   * @param vertex the vertex
   */
  outEdges(x: number): Generator<number, void, unknown>;
  /**
   * Removes an edge between two vertices.
   *
   * @param x the starting vertex
   * @param y the ending vertex
   * @return the structure
   */
  removeEdge(x: number, y: number): this;
}

export type AdjacencyStructureConstructor<
  U extends TypedArrayConstructors,
> = {
  directed: boolean;
  weighted: boolean;
  get [Symbol.species](): U;
  // deno-lint-ignore no-explicit-any
  new (...args: any[]): AdjacencyStructure;
  /**
   * Create an adjacency structure of specified dimensions.
   *
   * @param vertices the number of vertices
   * @param edges the maximum amount of edges
   * @return a new adjacency structure of specified dimentions
   */
  create<T extends AdjacencyStructureConstructor<U>>(
    this: T,
    vertices: number,
    edges?: number,
  ): InstanceType<T>;
  /**
   * Returns the length of underlying TypedArray required to hold a structure
   * of the specified dimensions.
   *
   * @param vertices the number of vertices
   * @param edges the maximum amount of edges
   * @return the length
   */
  getLength(vertices: number, edges?: number): number;
} & U;
