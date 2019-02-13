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
      const flags = new BinaryGrid({ rows: 1, columns: size });
      Object.defineProperties(this, {
        size: { value: size, writable: true },
        flags: { value: flags, writable: true },
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
     * @param {boolean} [isDFS]
     * @param {number} [start=0]
     * @param {boolean} [path]
     * @yields {number}
     */
    * traverse(isDFS, start = 0, path) {
      const { flags, size } = this;
      flags.fill(0);
      const processing = [start];
      const [push, pull] = isDFS ? ['push', 'pop'] : ['push', 'shift'];
      while (processing.length) {
        const vertex = processing[pull]();
        flags.setBit(0, vertex);
        yield vertex;
        for (let i = 0; i < size; i++) {
          if (this.hasEdge(vertex, i) && !flags.getBit(0, i)) {
            processing[push](i);
            if (path) yield i;
          }
        }
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
      const { flags } = this;
      distances[start] = 0;
      let lastPredecessor = start;
      let isFound = false;
      for (const vertex of this.traverse(true, start, true)) {
        if (!flags.getBit(0, vertex)) {
          const weight = this.get(lastPredecessor, vertex);
          if (distances[vertex] > distances[lastPredecessor] + weight) {
            distances[vertex] = distances[lastPredecessor] + weight;
            predecessors[vertex] = lastPredecessor;
          }
        } else {
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
      const { flags, size } = this;
      flags.fill(0);
      const heap = new VertexHeap();
      distances[start] = 0;
      heap.push({ i: start, w: this[start] });
      let isFound = false;
      while (heap.length) {
        const vertex = heap.pop();
        if (flags.getBit(0, vertex.i)) continue;
        flags.setBit(0, vertex.i);
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
  }

  return WeightedGraph;
}


module.exports = WeightedGraphMixin;
