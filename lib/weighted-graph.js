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
  /**
   * @extends Grid
   */
  class WeightedGraph extends (directed ? GridMixin(Base) : SymmetricGridMixin(Base)) {
    /**
     * @param {Object} [options]
     * @param {number} [options.size=2] the maximum number of vertices
     * @param {*} [options.pad=0] the initial value of cells
     * @param {Collection} [data]
     */
    constructor(options = {}, data) {
      const { size = 2, pad = 0 } = options;
      super({ rows: size, columns: size, pad }, data);
      const colors = new BinaryGrid({ rows: 2, columns: size });
      Object.defineProperties(this, {
        size: { value: size, writable: true },
        colors: { value: colors, writable: true },
      });
    }

    /**
     * @param {number} x
     * @param {number} y
     * @param {number} weight
     * @returns {WeightedGraph}
     */
    addEdge(x, y, weight) {
      this.set(x, y, weight);
      return this;
    }

    /**
     * @param {number} x
     * @param {number} y
     * @returns {WeightedGraph}
     */
    removeEdge(x, y) {
      this.set(x, y, this.pad);
      return this;
    }

    /**
     * @param {number} x
     * @param {number} y
     * @returns {boolean}
     */
    hasEdge(x, y) {
      return this.get(x, y) !== this.pad;
    }

    /**
     * @param {number} x
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
     * @param {number} x
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
     * @param {number} x
     * @returns {boolean}
     */
    isGray(x) {
      return !!this.colors.getBit(0, x);
    }

    /**
     * @param {number} x
     * @returns {UnweightedGraph}
     */
    setGray(x) {
      this.colors.setBit(0, x);
      return this;
    }

    /**
     * @param {number} x
     * @returns {boolean}
     */
    isBlack(x) {
      return !!this.colors.getBit(1, x);
    }

    /**
     * @param {number} x
     * @returns {UnweightedGraph}
     */
    setBlack(x) {
      this.colors.setBit(1, x);
      return this;
    }

    /**
     * @returns {UnweightedGraph}
     */
    resetColors() {
      this.colors.fill(0);
      return this;
    }

    /**
     * @param {boolean} [isDFS]
     * @param {number} [start=0]
     * @param {boolean} [gray=true]
     * @param {boolean} [white]
     * @param {boolean} [black]
     * @yields {number}
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
     * @param {number} start
     * @param {number} end
     * @param {boolean} isAcyclic
     * @param {boolean} isPositive
     * @returns {Array<number>}
     */
    path(start, end, isAcyclic, isPositive) {
      const { size } = this;
      const distances = new Array(size).fill(Infinity);
      const predecessors = new Array(size).fill(-1);
      const isFound = isAcyclic ? this.searchTopological(start, end, distances, predecessors)
        : isPositive ? this.searchDijkstra(start, end, distances, predecessors)
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
     * @returns {boolean}
     */
    isAcyclic() {
      for (const vertex of this.traverse(true, 0, false, true)) {
        if (this.isGray(vertex)) return false;
      }
      return true;
    }
  }

  return WeightedGraph;
}


module.exports = WeightedGraphMixin;
