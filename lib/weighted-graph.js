const BinaryGrid = require('./binary-grid');
const GridMixin = require('./grid');
const SymmetricGridMixin = require('./symmetric-grid');
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
 * Creates a WeightedGraph class extending a given Array-like class.
 *
 * @param {CollectionConstructor} Base
 * @param {boolean} directed
 * @returns {WeightedGraph}
 */
function WeightedGraphMixin(Base, directed) {
  const Grid = directed ? GridMixin(Base) : SymmetricGridMixin(Base);

  /**
   * Implements Adjacency Matrix using Grid or SymmetricGrid to handle weighted graphs.
   *
   * @extends Grid
   */
  class WeightedGraph extends Grid {
    /**
     * @param {Object} [options]
     * @param {number} [options.size=2] the maximum number of vertices
     * @param {boolean} [options.directed] whether the graph is directed
     * @param {*} [options.pad=0] the initial value of all edges
     * @param {...*} [args]
     */
    constructor(options = {}, ...args) {
      const { size = 2, pad = 0 } = options;
      super({ rows: size, columns: size, pad }, ...args);
      const colors = new BinaryGrid({ rows: 2, columns: size });
      Object.defineProperties(this, {
        size: { value: size },
        colors: { value: colors },
        directed: { value: directed },
      });
    }

    /**
     * Adds an edge between two vertices.
     *
     * @param {number} x the starting vertex
     * @param {number} y the ending vertex
     * @param {number} weight
     * @returns {WeightedGraph}
     */
    addEdge(x, y, weight) {
      this.set(x, y, weight);
      return this;
    }

    /**
     * Removes an edge between two vertices.
     *
     * @param {number} x the starting vertex
     * @param {number} y the ending vertex
     * @returns {WeightedGraph}
     */
    removeEdge(x, y) {
      this.set(x, y, this.pad);
      return this;
    }

    /**
     * Checks if there is an edge between two vertices.
     *
     * @param {number} x the starting vertex
     * @param {number} y the ending vertex
     * @returns {boolean}
     */
    hasEdge(x, y) {
      return this.get(x, y) !== this.pad;
    }

    /**
     * Returns a list of all outgoing edges of a vertex.
     *
     * @param {number} x the vertex
     * @returns {Array<number>}
     */
    outEdges(x) {
      const { size } = this;
      const neighbors = [];
      for (let i = 0; i < size; i++) {
        if (this.hasEdge(x, i)) neighbors.push(i);
      }
      return neighbors;
    }

    /**
     * Returns a list of all incoming edges of a vertex.
     *
     * @param {number} x the vertex
     * @returns {Array<number>}
     */
    inEdges(x) {
      const { size } = this;
      const neighbors = [];
      for (let i = 0; i < size; i++) {
        if (this.hasEdge(i, x)) neighbors.push(i);
      }
      return neighbors;
    }

    /**
     * Checks if a vertex is entered during a traversal.
     *
     * @param {number} x the vertex
     * @returns {boolean}
     */
    isGray(x) {
      return !!this.colors.getBit(0, x);
    }

    /**
     * Marks a vertex as entered during a traversal.
     *
     * @param {number} x the vertex
     * @returns {WeightedGraph}
     */
    setGray(x) {
      this.colors.setBit(0, x);
      return this;
    }

    /**
     * Checks if a vertex has been fully processed during a traversal.
     *
     * @param {number} x the vertex
     * @returns {boolean}
     */
    isBlack(x) {
      return !!this.colors.getBit(1, x);
    }

    /**
     * Marks a vertex as fully processed during a traversal.
     *
     * @param {number} x the vertex
     * @returns {WeightedGraph}
     */
    setBlack(x) {
      this.colors.setBit(1, x);
      return this;
    }

    /**
     * Resets all coloring of vertices done during traversals.
     *
     * @returns {WeightedGraph}
     */
    resetColors() {
      this.colors.fill(0);
      return this;
    }

    /**
     * Does a Breadth-First or Depth-First traversal of the graph.
     *
     * @generator
     * @param {boolean} [isDFS] whether to do DFS traversal, does BFS otherwise
     * @param {number} [start=0] the vertex to start at
     * @param {boolean} [gray=true] whether to return vertices upon entering
     * @param {boolean} [white] whether to return edges upon first encountering
     * @param {boolean} [black] whether to return vertices after processing
     * @yields {number} the vertex at each step
     */
    * traverse(isDFS, start = 0, gray = true, white, black) {
      const { size } = this;
      this.resetColors();
      const processing = [start];
      const [push, pull] = isDFS ? ['push', 'pop'] : ['push', 'shift'];
      while (processing.length) {
        const vertex = processing[pull]();
        this.setGray(vertex);
        if (gray) yield vertex;
        for (let i = 0; i < size; i++) {
          if (!this.hasEdge(vertex, i)) continue;
          if (!this.isGray(i)) {
            processing[push](i);
          }
          if (white) yield i;
        }
        this.setBlack(vertex);
        if (black) yield vertex;
      }
    }

    /**
     * Returns a list of vertices along the shortest path between two given vertices.
     *
     * @param {number} start the starting vertex
     * @param {number} end the ending vertex
     * @param {boolean} isAcyclic whether the graph is acyclic
     * @param {boolean} isNonNegative whether all edges are non-negative
     * @returns {Array<number>}
     */
    path(start, end, isAcyclic, isNonNegative) {
      const { size } = this;
      const distances = new Array(size).fill(Infinity);
      const predecessors = new Array(size).fill(-1);
      const isFound = isAcyclic ? this.searchTopological(start, end, distances, predecessors)
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
     * For DAGs only. O(V+E)
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
     * For non-negative edges. O(E + V * LogV)
     *
     * @private
     * @param {number} start
     * @param {number} end
     * @param {Array<number>} distances
     * @param {Array<number>} predecessors
     * @returns {boolean}
     */
    searchDijkstra(start, end, distances, predecessors) {
      const { size } = this;
      this.resetColors();
      const heap = new VertexHeap();
      distances[start] = 0;
      heap.push({ i: start, w: this[start] });
      let isFound = false;
      while (heap.length) {
        const vertex = heap.pop();
        if (this.isGray(vertex.i)) continue;
        this.setGray(vertex.i);
        for (let i = 0; i < size; i++) {
          const weight = this.get(vertex.i, i);
          if (weight === this.pad) continue;
          const distance = distances[vertex.i] + weight;
          if (distance < distances[i]) {
            distances[i] = distance;
            predecessors[i] = vertex.i;
            heap.push({ i, w: distance });
          }
          if (i === end) {
            isFound = true;
          }
        }
      }
      return isFound;
    }

    /**
     * For all. O(V * E)
     *
     * @private
     * @param {number} start
     * @param {number} end
     * @param {Array<number>} distances
     * @param {Array<number>} predecessors
     * @returns {boolean}
     */
    searchBellmanFord(start, end, distances, predecessors) {
      const { size } = this;
      distances[start] = 0;
      let isFound = false;
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          const weight = this.get(i, j);
          if (weight === this.pad) continue;
          const distance = distances[i] + weight;
          if (distances[j] > distance) {
            distances[j] = distance;
            predecessors[j] = i;
            if (j === end) {
              isFound = true;
            }
          }
        }
      }
      return isFound;
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
     * Returns the length of underlying Array required to hold the graph.
     *
     * @param {number} size
     * @returns {number}
     */
    static getLength(size) {
      return super.getLength(size, size);
    }
  }

  return WeightedGraph;
}


module.exports = WeightedGraphMixin;
