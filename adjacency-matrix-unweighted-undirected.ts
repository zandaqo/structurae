import { AdjacencyMatrixUnweightedDirected } from "./adjacency-matrix-unweighted-directed.ts";

export class AdjacencyMatrixUnweightedUndirected
  extends AdjacencyMatrixUnweightedDirected {
  static directed = false;
  static getLength(vertices: number): number {
    return (((vertices + 1) * vertices) >> 6) + 2;
  }
  getIndex(x: number, y: number): number {
    return x >= y ? y + (((x + 1) * x) >> 1) : x + (((y + 1) * y) >> 1);
  }
}
