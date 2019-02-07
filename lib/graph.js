const BitGrid = require('./bit-grid');

class Graph extends Array {
  /**
   * @param {Object} [options]
   * @param {number} [options.size=2] the maximum number of vertices
   * @param {Array<*>} [options.vertices] the vertices
   * @param {Collection} [options.edges] the edges as an adjacency matrix
   * @param {boolean} [options.directed] whether the graph is directed or not
   */
  constructor(options = {}) {
    const { size = 2, directed = false, vertices } = options;
    super(size);
    const edges = new BitGrid({ rows: size, columns: size }, options.edges);
    const flags = new BitGrid({ rows: 1, columns: size });
    if (vertices && vertices.length) this.push(...vertices);
    Object.defineProperties(this, {
      size: { value: size, writable: true },
      edges: { value: edges, writable: true },
      flags: { value: flags, writable: true },
      directed: { value: directed, writable: true },
    });
  }

  getVertex(index) {
    return this[index];
  }

  setVertex(index, value) {
    this[index] = value;
  }

  addEdge(x, y) {
    this.edges.setBit(x, y);
    if (!this.directed) this.edges.setBit(y, x);
  }

  removeEdge(x, y) {
    this.edges.setBit(x, y, 0);
    if (!this.directed) this.edges.setBit(y, x, 0);
  }

  adjacent(x, y) {
    return !!this.edges.getBit(x, y);
  }

  neighbors(x) {
    const edges = this.edges.getRow(x);
    const neighbors = [];
    for (let i = 0; i < edges.length; i++) {
      if (edges[i]) neighbors.push(i);
    }
    return neighbors;
  }

  * iterate(isDFS, start) {
    const { edges, flags, size } = this;
    flags.fill(0);
    const processing = [start];
    const [push, pull] = isDFS ? ['push', 'pop'] : ['push', 'shift'];
    while (processing.length) {
      const vertex = processing[pull]();
      flags.setBit(0, vertex);
      yield vertex;
      const neighbors = edges.getRow(vertex);
      for (let i = 0; i < size; i++) {
        if (neighbors[i] && !flags.getBit(0, i)) {
          processing[push](i);
        }
      }
    }
  }

  /**
   * @type {ArrayConstructor}
   */
  static get [Symbol.species]() {
    return Array;
  }
}

module.exports = Graph;
