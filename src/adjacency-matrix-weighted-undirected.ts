import type {
  AdjacencyStructureConstructor,
  IndexedCollection,
  TypedArrayConstructors,
} from "./utility-types.ts";
import { AdjacencyMatrixWeightedDirectedMixin } from "./adjacency-matrix-weighted-directed.ts";

/**
 * Creates a WeightedAdjacencyMatrix class extending a given Array-like class.
 */
export function AdjacencyMatrixWeightedUndirectedMixin<
  U extends TypedArrayConstructors,
>(Base: U): AdjacencyStructureConstructor<U> {
  interface AdjacencyMatrixWeightedUndirected extends IndexedCollection {}
  /**
   * Implements Adjacency Matrix for weighted graphs.
   */
  class AdjacencyMatrixWeightedUndirected
    extends AdjacencyMatrixWeightedDirectedMixin(
      Base,
    ) {
    static directed = false;
    /**
     * Returns the length of underlying Array required to hold the graph.
     */
    static getLength(vertices: number): number {
      return ((vertices + 1) * vertices) >> 1;
    }

    protected static getVertices(length: number): number {
      return (Math.sqrt((length << 3) + 1) - 1) >> 1;
    }

    getCoordinates(index: number): [x: number, y: number] {
      const x = AdjacencyMatrixWeightedUndirected.getVertices(index);
      const y = index - AdjacencyMatrixWeightedUndirected.getLength(x);
      return [x, y];
    }

    getIndex(x: number, y: number): number {
      return x >= y ? y + (((x + 1) * x) >> 1) : x + (((y + 1) * y) >> 1);
    }

    /**
     * Iterates over outgoing edges of a vertex.
     */
    *outEdges(vertex: number) {
      const { vertices } = this;
      for (let i = 0; i < vertices; i++) {
        if (this.hasEdge(vertex, i)) yield i;
      }
    }
  }

  return AdjacencyMatrixWeightedUndirected;
}
