const BinaryGrid = require('./binary-grid');
const BinaryHeap = require('./binary-heap');

/**
 * @private
 * @extends BinaryHeap
 */
class VertexHeap extends BinaryHeap {
  static compare(a, b) {
    return a.w < b.w;
  }
}

/**
 * @typedef {UnweightedAdjacencyList | UnweightedAdjacencyMatrix
    | WeightedAdjacencyList | WeightedAdjacencyMatrix} AdjacencyStructure
 */

/**
 * Creates a Graph class extending a given adjacency structure.
 *
 * @param {AdjacencyStructure} Base
 * @param {boolean} [undirected=false]
 * @returns {Graph}
 */
function GraphMixin(Base, undirected = false) {
  /**
   * Extends an adjacency list/matrix structure and provides methods for traversal (BFS, DFS),
   * pathfinding (Dijkstra, Bellman-Ford), spanning tree construction (BFS, Prim), etc.
   *
   * @extends AdjacencyStructure
   */
  class Graph extends Base {
    /**
     * @param {Object} options
     * @param {number} options.vertices
     * @param {number} [options.edges]
     * @param {number} [options.pad]
     * @param {...*} args
     */
    constructor(options, ...args) {
      super(options, ...args);
      const colors = new BinaryGrid({ rows: 2, columns: options.vertices });
      Object.defineProperties(this, {
        colors: { value: colors },
      });
    }

    /**
     * Checks if a vertex is entered during a traversal.
     *
     * @param {number} vertex the vertex
     * @returns {boolean}
     */
    isGray(vertex) {
      return !!this.colors.get(0, vertex);
    }

    /**
     * Marks a vertex as entered during a traversal.
     *
     * @param {number} vertex the vertex
     * @returns {Graph}
     */
    setGray(vertex) {
      this.colors.set(0, vertex);
      return this;
    }

    /**
     * Checks if a vertex has been fully processed during a traversal.
     *
     * @param {number} vertex the vertex
     * @returns {boolean}
     */
    isBlack(vertex) {
      return !!this.colors.get(1, vertex);
    }

    /**
     * Marks a vertex as fully processed during a traversal.
     *
     * @param {number} vertex the vertex
     * @returns {Graph}
     */
    setBlack(vertex) {
      this.colors.set(1, vertex);
      return this;
    }

    /**
     * Resets all coloring of vertices done during traversals.
     *
     * @private
     * @returns {Graph}
     */
    resetColors() {
      this.colors.fill(0);
      return this;
    }

    /**
     * Does a Breadth-First or Depth-First traversal of the graph.
     *
     * @generator
     * @param {boolean} [isDFS=false] whether to do DFS traversal, does BFS otherwise
     * @param {number} [start=0] the vertex to start at
     * @param {boolean} [gray=true] whether to return vertices upon entering
     * @param {boolean} [white=false] whether to return edges upon first encountering
     * @param {boolean} [black=false] whether to return vertices after processing
     * @yields {number} the vertex at each step
     */
    * traverse(isDFS, start = 0, gray = true, white, black) {
      this.resetColors();
      const processing = [start];
      const [push, pull] = isDFS ? ['push', 'pop'] : ['push', 'shift'];
      while (processing.length) {
        const vertex = processing[pull]();
        this.setGray(vertex);
        if (gray) yield vertex;
        for (const edge of this.outEdges(vertex)) {
          if (!this.isGray(edge)) {
            processing[push](edge);
          }
          if (white) yield edge;
        }
        this.setBlack(vertex);
        if (black) yield vertex;
      }
    }

    /**
     * Checks whether the graph is acyclic.
     *
     * @returns {boolean}
     */
    isAcyclic() {
      for (const vertex of this.traverse(true, 0, false, true)) {
        if (this.isGray(vertex)) return false;
      }
      return true;
    }

    /**
     * Returns a list of vertexes sorted topologically.
     *
     * @returns {Array<number>}
     */
    topologicalSort() {
      return [...this.traverse(true, 0, false, false, true)];
    }

    /**
     * Returns a list of vertices along the shortest path between two given vertices.
     *
     * @param {number} start the starting vertex
     * @param {number} end the ending vertex
     * @param {boolean} [isAcyclic=false] whether the graph is acyclic
     * @param {boolean} [isNonNegative=false] whether all edges are non-negative
     * @returns {Array<number>}
     */
    path(start, end, isAcyclic, isNonNegative) {
      const { weighted } = this.constructor;
      const { vertices } = this;
      const predecessors = new Array(vertices).fill(-1);
      const distances = new Array(vertices).fill(Infinity);
      const isFound = !weighted ? this.searchUnweighted(start, end, predecessors)
        : isAcyclic ? this.searchTopological(start, end, distances, predecessors)
          : isNonNegative ? this.searchDijkstra(start, end, distances, predecessors)
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
     * For unweighted graphs.
     *
     * @private
     * @param {number} start the starting vertex
     * @param {number} [end] the ending vertex
     * @param {Array<number>} predecessors
     * @returns {boolean}
     */
    searchUnweighted(start, end, predecessors) {
      let lastPredecessor = start;
      let isFound = false;
      for (const vertex of this.traverse(false, start, true, true)) {
        if (!this.isGray(vertex)) {
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

    /**
     * For DAGs only.
     *
     * @private
     * @param {number} start
     * @param {number} end
     * @param {Array<number>} distances
     * @param {Array<number>} predecessors
     * @returns {boolean}
     */
    searchTopological(start, end, distances, predecessors) {
      distances[start] = 0;
      let lastPredecessor = start;
      let isFound = false;
      for (const vertex of this.traverse(true, start, true, true)) {
        if (!this.isGray(vertex)) {
          const weight = this.get(lastPredecessor, vertex);
          if (distances[vertex] > distances[lastPredecessor] + weight) {
            distances[vertex] = distances[lastPredecessor] + weight;
            predecessors[vertex] = lastPredecessor;
          }
        } else if (!this.isBlack(vertex)) {
          lastPredecessor = vertex;
        }
        if (vertex === end) {
          isFound = true;
        }
      }
      return isFound;
    }

    /**
     * For non-negative edges.
     *
     * @private
     * @param {number} start
     * @param {number} end
     * @param {Array<number>} distances
     * @param {Array<number>} predecessors
     * @returns {boolean}
     */
    searchDijkstra(start, end, distances, predecessors) {
      this.resetColors();
      const heap = new VertexHeap();
      distances[start] = 0;
      heap.push({ e: start, w: this[start] });
      let isFound = false;
      while (heap.length) {
        const vertex = heap.shift();
        if (this.isGray(vertex.e)) continue;
        this.setGray(vertex.e);
        for (const edge of this.outEdges(vertex.e)) {
          const weight = this.get(vertex.e, edge);
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
     * For all.
     *
     * @private
     * @param {number} start
     * @param {number} end
     * @param {Array<number>} distances
     * @param {Array<number>} predecessors
     * @returns {boolean}
     */
    searchBellmanFord(start, end, distances, predecessors) {
      const { vertices } = this;
      distances[start] = 0;
      let isFound = false;
      for (let i = 0; i < vertices; i++) {
        for (const edge of this.outEdges(i)) {
          const weight = this.get(i, edge);
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
     * Returns a minimal spanning tree of the graph.
     * Uses the Prim's algorithm for weighted graphs and BFS tree for unweighted graphs.
     *
     * @param {number} [start=0]
     * @returns {Array<number>}
     */
    tree(start = 0) {
      const { weighted } = this.constructor;
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
        const vertex = heap.shift();
        if (this.isGray(vertex.e)) continue;
        this.setGray(vertex.e);
        for (const edge of this.outEdges(vertex.e)) {
          const weight = this.get(vertex.e, edge);
          if (this.isGray(edge) || weight > distances[edge]) continue;
          distances[edge] = weight;
          predecessors[edge] = vertex.e;
          heap.push({ e: edge, w: weight });
        }
      }
      return predecessors;
    }
  }

  Graph.undirected = undirected;

  return Graph;
}

module.exports = GraphMixin;
