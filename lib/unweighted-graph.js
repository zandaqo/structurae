const BitGrid = require('./bit-grid');

/**
 * @extends BitGrid
 */
class UnweightedGraph extends BitGrid {
  /**
   * @param {Object} [options]
   * @param {number} [options.size=2] the maximum number of vertices
   * @param {boolean} [options.directed]
   * @param {*} [options.pad=0] the initial value of cells
   * @param {Collection} [data]
   */
  constructor(options = {}, data) {
    const { size = 2, directed = false } = options;
    super({ rows: size, columns: size }, data);
    const flags = new BitGrid({ rows: 1, columns: size });
    Object.defineProperties(this, {
      size: { value: size, writable: true },
      flags: { value: flags, writable: true },
      directed: { value: directed, writable: true },
    });
  }

  /**
   * @param {number} x
   * @param {number} y
   * @returns {UnweightedGraph}
   */
  addEdge(x, y) {
    this.setBit(x, y);
    if (!this.directed) this.setBit(y, x);
    return this;
  }

  /**
   * @param {number} x
   * @param {number} y
   * @returns {UnweightedGraph}
   */
  removeEdge(x, y) {
    this.setBit(x, y, 0);
    if (!this.directed) this.setBit(y, x, 0);
    return this;
  }

  /**
   * @param {number} x
   * @param {number} y
   * @returns {boolean}
   */
  hasEdge(x, y) {
    return !!this.getBit(x, y);
  }

  /**
   * @param {number} x
   * @returns {Array<number>}
   */
  outEdges(x) {
    const edges = this.getRow(x);
    const neighbors = [];
    for (let i = 0; i < edges.length; i++) {
      if (edges[i]) neighbors.push(i);
    }
    return neighbors;
  }

  /**
   * @param {number} x
   * @returns {Array<number>}
   */
  inEdges(x) {
    const edges = this.getColumn(x);
    const neighbors = [];
    for (let i = 0; i < edges.length; i++) {
      if (edges[i]) neighbors.push(i);
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
      const neighbors = this.getRow(vertex);
      for (let i = 0; i < size; i++) {
        if (neighbors[i] && !flags.getBit(0, i)) {
          processing[push](i);
          if (path) yield i;
        }
      }
    }
  }

  /**
   * @param {number} start
   * @param {number} end
   * @returns {Array<number>}
   */
  path(start, end) {
    const { flags, size } = this;
    const predecessors = new Array(size).fill(-1);
    let lastPredecessor = start;
    let isFound = false;
    for (const vertex of this.traverse(false, start, true)) {
      if (!flags.getBit(0, vertex)) {
        predecessors[vertex] = lastPredecessor;
      } else {
        lastPredecessor = vertex;
      }
      if (vertex === end) {
        isFound = true;
        break;
      }
    }
    const path = [];
    if (!isFound) return path;
    let last = end;
    while (~last) {
      path.unshift(last);
      last = predecessors[last];
    }
    return path;
  }
}

module.exports = UnweightedGraph;
