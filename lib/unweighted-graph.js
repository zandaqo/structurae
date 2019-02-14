const BinaryGrid = require('./binary-grid');

/**
 * @extends BinaryGrid
 */
class UnweightedGraph extends BinaryGrid {
  /**
   * @param {Object} [options]
   * @param {number} [options.size=2] the maximum number of vertices
   * @param {boolean} [options.directed]
   * @param {*} [options.pad=0] the initial value of cells
   * @param {Collection} [data]
   */
  constructor(options = {}, data) {
    const { size = 2, directed = false } = options;
    super({ rows: size + 2, columns: size }, data);
    Object.defineProperties(this, {
      size: { value: size, writable: true },
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
   * @param {number} x
   * @returns {boolean}
   */
  isGray(x) {
    return !!this.getBit(this.size - 1, x);
  }

  /**
   * @param {number} x
   * @returns {UnweightedGraph}
   */
  setGray(x) {
    this.setBit(this.size - 1, x);
    return this;
  }

  /**
   * @param {number} x
   * @returns {boolean}
   */
  isBlack(x) {
    return !!this.getBit(this.size, x);
  }

  /**
   * @param {number} x
   * @returns {UnweightedGraph}
   */
  setBlack(x) {
    this.setBit(this.size, x);
    return this;
  }

  /**
   * @returns {UnweightedGraph}
   */
  resetColors() {
    const { size, offset } = this;
    const start = (size - 1) << offset;
    const end = (start + (size << 1)) >> 4;
    for (let i = start >> 4; i < end; i++) {
      this[i] = 0;
    }
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
      const neighbors = this.getRow(vertex);
      for (let i = 0; i < size; i++) {
        if (!neighbors[i]) continue;
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
   * @returns {Array<number>}
   */
  path(start, end) {
    const { size } = this;
    const predecessors = new Array(size).fill(-1);
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
    const path = [];
    if (!isFound) return path;
    let last = end;
    while (~last) {
      path.unshift(last);
      last = predecessors[last];
    }
    return path;
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

module.exports = UnweightedGraph;
