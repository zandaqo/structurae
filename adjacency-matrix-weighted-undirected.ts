import type {
  AdjacencyStructure,
  AdjacencyStructureConstructor,
  TypedArrayConstructors,
} from "./utility-types.ts";
import { AdjacencyMatrixWeightedDirectedMixin } from "./adjacency-matrix-weighted-directed.ts";

/**
 * Creates an Adjacency Matrix class extending a given TypedArray class.
 *
 * @param Base a TypedArray class to extend
 */
export function AdjacencyMatrixWeightedUndirectedMixin<
  U extends TypedArrayConstructors,
>(Base: U): AdjacencyStructureConstructor<U> {
  /**
   * Implements the Adjacency Matrix for weighted undirected graphs.
   */
  class AdjacencyMatrixWeightedUndirected
    extends AdjacencyMatrixWeightedDirectedMixin(Base) {
    static directed = false;

    static getLength(vertices: number, _?: number): number {
      return ((vertices + 1) * vertices) >> 1;
    }

    protected static getVertices(length: number): number {
      return (Math.sqrt((length << 3) + 1) - 1) >> 1;
    }

    getIndex(x: number, y: number): number {
      return x >= y ? y + (((x + 1) * x) >> 1) : x + (((y + 1) * y) >> 1);
    }

    outEdges(vertex: number) {
      // TODO: fix type casting
      return (this as unknown as AdjacencyStructure).inEdges(vertex);
    }
  }

  // TODO: fix type casting
  return AdjacencyMatrixWeightedUndirected as unknown as AdjacencyStructureConstructor<
    U
  >;
}
