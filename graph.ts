import type {
  AdjacencyStructureConstructor,
  TypedArrayConstructors,
} from "./utility-types.ts";
import { BinaryHeap } from "./binary-heap.ts";

export const Colors = {
  WHITE: 0,
  GRAY: 1,
  BLACK: 2,
} as const;

export type Colors = typeof Colors[keyof typeof Colors];

type Vertex = { e: number; w: number };

class VertexHeap extends BinaryHeap<Vertex> {
  static compare(a: Vertex, b: Vertex): boolean {
    return a.w < b.w;
  }
}

/**
 * Creates a Graph class extending a given adjacency structure.
 */
export function GraphMixin<
  T extends TypedArrayConstructors,
  U extends AdjacencyStructureConstructor<T>,
>(Base: U) {
  /**
   * Extends an adjacency list/matrix structure and provides methods for traversal (BFS, DFS),
   * pathfinding (Dijkstra, Bellman-Ford), spanning tree construction (BFS, Prim), etc.
   */
  return class Graph extends Base {
    _colors?: Uint8Array;

    get colors(): Uint8Array {
      return (
        this._colors ||
        ((this._colors = new Uint8Array(this.vertices)), this._colors)
      );
    }

    // todo fix constructor type not extending TypedArray

    // fix for messed up types of mixins
    // todo fix when sanity dawns on ts mixins
    static create(vertices: number, edges?: number) {
      return (super.create(vertices, edges) as unknown) as
        & Graph
        & InstanceType<U>
        & InstanceType<T>;
    }

    hasColor(vertex: number, color: Colors): boolean {
      return this.colors[vertex] === color;
    }

    /**
     * Checks whether the graph is acyclic.
     */
    isAcyclic(): boolean {
      for (const vertex of this.traverse(true, 0, false, true)) {
        if (!this.hasColor(vertex, Colors.WHITE)) return false;
      }
      return true;
    }

    /**
     * Returns a list of vertices along the shortest path between two given vertices.
     *
     * @param start the starting vertex
     * @param end the ending vertex
     * @param isAcyclic whether the graph is acyclic
     * @param isNonNegative whether all edges are non-negative
     */
    path(
      start: number,
      end: number,
      isAcyclic = false,
      isNonNegative = false,
    ): Array<number> {
      const { weighted } = this
        .constructor as AdjacencyStructureConstructor<any>;
      const { vertices } = this;
      const predecessors = new Array(vertices).fill(-1);
      const distances = new Array(vertices).fill(Infinity);
      const isFound = !weighted
        ? this.searchUnweighted(start, end, predecessors)
        : isAcyclic
        ? this.searchTopological(start, end, distances, predecessors)
        : isNonNegative
        ? this.searchDijkstra(start, end, distances, predecessors)
        : this.searchBellmanFord(start, end, distances, predecessors);
      if (!isFound) return [];
      const path = [];
      let last = end;
      while (~last) {
        path.unshift(last);
        last = predecessors[last];
      }
      return path;
    }

    /**
     * Resets all coloring of vertices done during traversals.
     */
    resetColors(): void {
      this.colors.fill(0);
    }

    /**
     * For all.
     *
     * @param start
     * @param end
     * @param distances
     * @param predecessors
     */
    searchBellmanFord(
      start: number,
      end: number,
      distances: Array<number>,
      predecessors: Array<number>,
    ): boolean {
      const { vertices } = this;
      distances[start] = 0;
      let isFound = false;
      for (let i = 0; i < vertices; i++) {
        for (const edge of this.outEdges(i)) {
          const weight = this.getEdge(i, edge);
          const distance = distances[i] + weight;
          if (distances[edge] > distance) {
            distances[edge] = distance;
            predecessors[edge] = i;
            if (edge === end) {
              isFound = true;
            }
          }
        }
      }
      return isFound;
    }

    /**
     * For non-negative edges.
     *
     * @param start
     * @param end
     * @param distances
     * @param predecessors
     */
    searchDijkstra(
      start: number,
      end: number,
      distances: Array<number>,
      predecessors: Array<number>,
    ): boolean {
      this.resetColors();
      const heap = new VertexHeap();
      distances[start] = 0;
      heap.push({ e: start, w: this[start] });
      let isFound = false;
      while (heap.length) {
        const vertex = heap.shift()!;
        if (this.hasColor(vertex.e, Colors.GRAY)) continue;
        this.setColor(vertex.e, Colors.GRAY);
        for (const edge of this.outEdges(vertex.e)) {
          const weight = this.getEdge(vertex.e, edge);
          const distance = distances[vertex.e] + weight;
          if (distance < distances[edge]) {
            distances[edge] = distance;
            predecessors[edge] = vertex.e;
            heap.push({ e: edge, w: distance });
          }
          if (edge === end) {
            isFound = true;
          }
        }
      }
      return isFound;
    }

    /**
     * For DAGs only.
     *
     * @param start
     * @param end
     * @param distances
     * @param predecessors
     */
    searchTopological(
      start: number,
      end: number,
      distances: Array<number>,
      predecessors: Array<number>,
    ): boolean {
      distances[start] = 0;
      let lastPredecessor = start;
      let isFound = false;
      for (const vertex of this.traverse(true, start, true, true)) {
        if (!this.hasColor(vertex, Colors.GRAY)) {
          const weight = this.getEdge(lastPredecessor, vertex);
          if (distances[vertex] > distances[lastPredecessor] + weight) {
            distances[vertex] = distances[lastPredecessor] + weight;
            predecessors[vertex] = lastPredecessor;
          }
        } else if (!this.hasColor(vertex, Colors.BLACK)) {
          lastPredecessor = vertex;
        }
        if (vertex === end) {
          isFound = true;
        }
      }
      return isFound;
    }

    /**
     * For unweighted graphs.
     *
     * @param start the starting vertex
     * @param end the ending vertex
     * @param predecessors
     */
    searchUnweighted(
      start: number,
      end: number | undefined,
      predecessors: Array<number>,
    ): boolean {
      let lastPredecessor = start;
      let isFound = false;
      for (const vertex of this.traverse(false, start, true, true)) {
        if (this.hasColor(vertex, Colors.BLACK)) continue;
        if (this.hasColor(vertex, Colors.WHITE)) {
          predecessors[vertex] = lastPredecessor;
        } else {
          lastPredecessor = vertex;
        }
        if (vertex === end) {
          isFound = true;
          break;
        }
      }
      return isFound;
    }

    setColor(vertex: number, color: Colors): void {
      this.colors[vertex] = color;
    }

    /**
     * Returns a list of vertexes sorted topologically.
     */
    topologicalSort(): Array<number> {
      const result: Array<number> = [];
      for (const vertex of this.traverse(true, 0, false, false, true)) {
        result.unshift(vertex);
      }
      return result;
    }

    /**
     * Does a Breadth-First or Depth-First traversal of the graph.
     *
     * @param isDFS whether to do DFS traversal, does BFS otherwise
     * @param start the vertex to start at
     * @param gray whether to return vertices upon entering
     * @param white whether to return edges upon first encountering
     * @param black whether to return vertices after processing
     * @return the vertex at each step
     */
    *traverse(
      isDFS = false,
      start = 0,
      gray = true,
      white = false,
      black = false,
    ) {
      this.resetColors();
      const processing = [start];
      const [push, pull]: Array<keyof Array<number>> = isDFS
        ? ["push", "pop"]
        : ["push", "shift"];
      while (processing.length) {
        const vertex = processing[pull]()!;
        this.setColor(vertex, Colors.GRAY);
        if (gray) yield vertex;
        for (const edge of this.outEdges(vertex)) {
          if (this.hasColor(edge, Colors.WHITE)) {
            processing[push](edge);
          }
          if (white) yield edge;
        }
        this.setColor(vertex, Colors.BLACK);
        if (black) yield vertex;
      }
    }

    /**
     * Returns a minimal spanning tree of the graph.
     * Uses the Prim's algorithm for weighted graphs and BFS tree for unweighted graphs.
     *
     * @param start
     */
    tree(start = 0) {
      const { weighted } = this
        .constructor as AdjacencyStructureConstructor<any>;
      const { vertices } = this;
      const predecessors = new Array(vertices).fill(-1);
      if (!weighted) {
        this.searchUnweighted(start, undefined, predecessors);
        return predecessors;
      }
      this.resetColors();
      const distances = new Array(vertices).fill(Infinity);
      const heap = new VertexHeap();
      distances[start] = 0;
      heap.push({ e: start, w: this[0] });
      while (heap.length) {
        const vertex = heap.shift()!;
        if (this.hasColor(vertex.e, Colors.GRAY)) continue;
        this.setColor(vertex.e, Colors.GRAY);
        for (const edge of this.outEdges(vertex.e)) {
          const weight = this.getEdge(vertex.e, edge);
          if (this.hasColor(edge, Colors.GRAY) || weight > distances[edge]) {
            continue;
          }
          distances[edge] = weight;
          predecessors[edge] = vertex.e;
          heap.push({ e: edge, w: weight });
        }
      }
      return predecessors;
    }
  };
}
