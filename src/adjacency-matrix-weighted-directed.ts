import type {
  AdjacencyStructure,
  AdjacencyStructureConstructor,
  IndexedCollection,
  TypedArrayConstructors,
} from "./utility-types.ts";

/**
 * Creates a WeightedAdjacencyMatrix class extending a given Array-like class.
 */
export function AdjacencyMatrixWeightedDirectedMixin<
  U extends TypedArrayConstructors,
>(Base: U): AdjacencyStructureConstructor<U> {
  interface AdjacencyMatrixWeightedDirected extends IndexedCollection {}
  /**
   * Implements Adjacency Matrix for weighted graphs.
   */
  class AdjacencyMatrixWeightedDirected extends Base
    implements AdjacencyStructure {
    static directed = true;
    static weighted = true;
    empty = 0;

    static get [Symbol.species]() {
      return Base;
    }

    _vertices = 0;

    get vertices() {
      return (
        this._vertices ||
        (this._vertices = (this
          .constructor as typeof AdjacencyMatrixWeightedDirected).getVertices(
            this.length,
          )), this._vertices
      );
    }

    get edges() {
      return this.length;
    }

    /**
    * Create a graph of specified dimensions.
    *
    * @param vertices the numbe of vertices
    * @return a new graph of specified dimentions
    */
    static create(vertices: number) {
      const length = this.getLength(vertices);
      return new this(length) as
        & AdjacencyMatrixWeightedDirected
        & InstanceType<U>;
    }

    /**
     * Returns the length of underlying Array required to hold the graph.
     */
    static getLength(vertices: number): number {
      return vertices * vertices;
    }

    protected static getVertices(length: number): number {
      return Math.sqrt(length);
    }

    /**
     * Adds an edge between two vertices.
     *
     * @param x the starting vertex
     * @param y the ending vertex
     * @param weight
     * @return the graph
     */
    addEdge(x: number, y: number, weight: number): this {
      this[this.getIndex(x, y)] = weight;
      return this;
    }

    getCoordinates(index: number): [x: number, y: number] {
      return [Math.floor(index / this.vertices), index % this.vertices];
    }

    /**
     * Returns the weight of the edge between given vertices if it exists.
     *
     * @param x the starting vertex
     * @param y the ending vertex
     */
    getEdge(x: number, y: number) {
      return this[this.getIndex(x, y)];
    }

    getIndex(x: number, y: number): number {
      return x * this.vertices + y;
    }

    /**
     * Checks if there is an edge between two vertices.
     *
     * @param x the starting vertex
     * @param y the ending vertex
     */
    hasEdge(x: number, y: number) {
      const edge = this.getEdge(x, y);
      return edge !== undefined && edge !== this.empty;
    }

    /**
     * Iterates over incoming edges of a vertex.
     */
    *inEdges(vertex: number) {
      const { vertices } = this;
      for (let i = 0; i < vertices; i++) {
        if (this.hasEdge(i, vertex)) yield i;
      }
    }

    isFull(): boolean {
      return false;
    }

    /**
     * Iterates over outgoing edges of a vertex.
     */
    *outEdges(vertex: number) {
      const { vertices } = this;
      const offset = vertex * vertices;
      for (let i = 0; i < vertices; i++) {
        const edge = this[offset + i];
        if (edge !== undefined && edge !== this.empty) yield i;
      }
    }

    /**
     * Removes an edge between two vertices.
     *
     * @param x the starting vertex
     * @param y the ending vertex
     */
    removeEdge(x: number, y: number): this {
      this[this.getIndex(x, y)] = this.empty;
      return this;
    }
  }

  return AdjacencyMatrixWeightedDirected;
}
