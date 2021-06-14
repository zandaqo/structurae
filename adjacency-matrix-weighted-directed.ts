import type {
  AdjacencyStructure,
  AdjacencyStructureConstructor,
  IndexedCollection,
  TypedArrayConstructors,
} from "./utility-types.ts";

/**
 * Creates an Adjacency Matrix class extending a given TypedArray class.
 *
 * @param Base a TypedArray class to extend
 */
export function AdjacencyMatrixWeightedDirectedMixin<
  U extends TypedArrayConstructors,
>(Base: U): AdjacencyStructureConstructor<U> {
  // deno-lint-ignore no-empty-interface
  interface AdjacencyMatrixWeightedDirected extends IndexedCollection {}
  /**
   * Implements Adjacency Matrix for weighted directed graphs.
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

    static create(vertices: number) {
      const length = this.getLength(vertices);
      return new this(length) as
        & AdjacencyMatrixWeightedDirected
        & InstanceType<U>;
    }

    static getLength(vertices: number): number {
      return vertices * vertices;
    }

    protected static getVertices(length: number): number {
      return Math.sqrt(length);
    }

    addEdge(x: number, y: number, weight: number): this {
      this[this.getIndex(x, y)] = weight;
      return this;
    }

    getCoordinates(index: number): [x: number, y: number] {
      return [Math.floor(index / this.vertices), index % this.vertices];
    }

    getEdge(x: number, y: number) {
      return this[this.getIndex(x, y)];
    }

    getIndex(x: number, y: number): number {
      return x * this.vertices + y;
    }

    hasEdge(x: number, y: number) {
      const edge = this.getEdge(x, y);
      return edge !== undefined && edge !== this.empty;
    }

    *inEdges(vertex: number) {
      const { vertices } = this;
      for (let i = 0; i < vertices; i++) {
        if (this.hasEdge(i, vertex)) yield i;
      }
    }

    isFull(): boolean {
      return false;
    }

    *outEdges(vertex: number) {
      const { vertices } = this;
      const offset = vertex * vertices;
      for (let i = 0; i < vertices; i++) {
        const edge = this[offset + i];
        if (edge !== undefined && edge !== this.empty) yield i;
      }
    }

    removeEdge(x: number, y: number): this {
      this[this.getIndex(x, y)] = this.empty;
      return this;
    }
  }

  return AdjacencyMatrixWeightedDirected;
}
