import type {
  AdjacencyStructure,
  AdjacencyStructureConstructor,
  IndexedCollection,
  TypedArrayConstructors,
} from "./utility-types.ts";

export function AdjacencyListMixin<U extends TypedArrayConstructors>(
  Base: U,
): AdjacencyStructureConstructor<U> {
  // deno-lint-ignore no-empty-interface
  interface AdjacencyList extends IndexedCollection {}

  /**
   * Implements Adjacency List data structure for weighted graphs.
   */
  class AdjacencyList extends Base implements AdjacencyStructure {
    static directed = true;
    static weighted = true;
    vertices = 2;
    edges = 4;
    empty = undefined;

    // deno-lint-ignore no-explicit-any
    constructor(...args: any[]) {
      super(...args);
      [this.vertices, this.edges] = AdjacencyList.getDimensions(this);
    }

    static get [Symbol.species]() {
      return Base;
    }

    /**
    * Create a graph of specified dimensions.
    *
    * @param vertices the numbe of vertices
    * @param edges the maximum amount of edges
    * @return a new graph of specified dimentions
    */
    static create(vertices: number, edges: number) {
      const length = this.getLength(vertices, edges);
      const list = new this(length);
      list.vertices = vertices;
      list.edges = edges;
      list.setOffsets();
      return list as AdjacencyList & InstanceType<U>;
    }

    /*
    * Returns the dimensions, vertices and maximum edge count, of an existing AdjacencyList
    */
    static getDimensions(
      list: IndexedCollection,
    ): [vertices: number, edges: number] {
      let vertices = 0;
      while (list[vertices] <= list[vertices + 1]) {
        vertices++;
      }
      const edges = (list.length - vertices - 1) >> 1;
      return [vertices, edges];
    }

    /**
     * Returns the length of underlying TypedArray required to hold the graph.
     */
    static getLength(vertices: number, edges: number): number {
      return vertices + (edges << 1) + 1;
    }

    /**
     * Adds an edge between two vertices.
     *
     * @param x the starting vertex
     * @param y the ending vertex
     * @param weight the weight
     * @throws RangeError if the list is full
     * @return the graph
     */
    addEdge(x: number, y: number, weight: number): this {
      if (this.hasEdge(x, y)) return this;
      // the list is full
      if (this.isFull()) throw new RangeError("The list is full.");
      const { vertices } = this;

      // shift values
      for (let i = this[vertices]; i > this[x]; i -= 2) {
        [this[i], this[i + 1], this[i - 1], this[i - 2]] = [
          this[i - 2],
          this[i - 1],
          this[i],
          this[i + 1],
        ];
      }
      // set edge
      this[this[x]] = y;
      this[this[x] + 1] = weight;

      // update offsets
      for (let i = x + 1; i <= vertices; i++) {
        this[i] += 2;
      }
      return this;
    }

    /**
     * Returns the weight of the edge between given vertices
     * or NaN if the edge doesn't exist.
     *
     * @param x the starting vertex
     * @param y the ending vertex
     */
    getEdge(x: number, y: number): number {
      const offset = this[x];
      const nextOffset = this[x + 1];
      // no out edges from x
      if (offset === nextOffset) return NaN;
      for (let i = offset; i < nextOffset; i += 2) {
        if (this[i] === y) return this[i + 1];
      }
      return NaN;
    }

    /**
     * Checks if there is an edge between two vertices.
     *
     * @param x the starting vertex
     * @param y the ending vertex
     */
    hasEdge(x: number, y: number): boolean {
      return !Number.isNaN(this.getEdge(x, y));
    }

    /**
     * Iterates over incoming edges of a vertex.
     *
     * @param vertex the vertex
     */
    *inEdges(vertex: number) {
      const { vertices } = this;
      let edge = 0;
      let nextVertex = 1;
      for (let i = vertices + 1; i < this[vertices]; i += 2) {
        while (i >= this[nextVertex]) {
          edge++;
          nextVertex++;
        }
        if (this[i] === vertex) yield edge;
      }
    }

    /**
     * Checks whether the list is full--all available edges are set.
     */
    isFull(): boolean {
      return this[this.vertices] >= this.length;
    }

    /**
     * Iterates over outgoing edges of a vertex.
     *
     * @param vertex the vertex
     */
    *outEdges(vertex: number) {
      const offset = this[vertex];
      const nextOffset = this[vertex + 1];
      if (offset !== nextOffset) {
        for (let i = nextOffset - 2; i >= offset; i -= 2) {
          yield this[i];
        }
      }
    }

    /**
     * Removes an edge between two vertices.
     *
     * @param x the starting vertex
     * @param y the ending vertex
     */
    removeEdge(x: number, y: number): this {
      const offset = this[x];
      const nextOffset = this[x + 1];
      // no out edges from x
      if (offset === nextOffset) return this;
      let edgeIndex = 0;
      for (let i = offset; i < nextOffset; i += 2) {
        if (this[i] === y) {
          edgeIndex = i;
          break;
        }
      }
      // there is no such edge
      if (!edgeIndex) return this;
      // shift value
      for (let i = edgeIndex; i < this[this.vertices]; i += 2) {
        this[i] = this[i + 2];
        this[i + 1] = this[i + 3];
      }

      // update offsets
      for (let i = x + 1; i <= this.vertices; i++) {
        this[i] -= 2;
      }

      return this;
    }

    setOffsets(): void {
      const lastElement = this.vertices + 1;
      for (let i = 0; i < lastElement; i++) {
        this[i] = lastElement;
      }
    }
  }

  return AdjacencyList;
}
