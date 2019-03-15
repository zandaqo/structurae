const BinaryGrid = require('./binary-grid');

/**
 * Implements Adjacency Matrix for unweighted graphs.
 *
 * @extends BinaryGrid
 */
class UnweightedAdjacencyMatrix extends BinaryGrid {
  /**
   * @param {Object} [options]
   * @param {number} [options.vertices=2] the maximum number of vertices
   * @param {...*} [args]
   */
  constructor(options = {}, ...args) {
    const { vertices = 2 } = options;
    super({ rows: vertices, columns: vertices }, ...args);
    Object.defineProperties(this, {
      vertices: { value: vertices },
    });
  }

  /**
   * Adds an edge between two vertices.
   *
   * @param {number} x the starting vertex
   * @param {number} y the ending vertex
   * @returns {UnweightedAdjacencyMatrix}
   */
  addEdge(x, y) {
    const { undirected } = this.constructor;
    this.set(x, y);
    if (undirected) this.set(y, x);
    return this;
  }

  /**
   * Removes an edge between two vertices.
   *
   * @param {number} x the starting vertex
   * @param {number} y the ending vertex
   * @returns {UnweightedAdjacencyMatrix}
   */
  removeEdge(x, y) {
    const { undirected } = this.constructor;
    this.set(x, y, 0);
    if (undirected) this.set(y, x, 0);
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
    return !!this.get(x, y);
  }

  /**
   * Iterates over outgoing edges of a vertex.
   *
   * @generator
   * @param {number} vertex the vertex
   * @yields {number}
   */
  * outEdges(vertex) {
    const { columns, offset } = this;
    const start = vertex << offset;
    const end = start + columns;
    for (let i = start; i < end; i++) {
      const bucket = i >> 4;
      const position = i - (bucket << 4);
      const value = (this[bucket] >> position) & 1;
      if (value) yield i - start;
    }
  }

  /**
   * Iterates over incoming edges of a vertex.
   *
   * @generator
   * @param {number} vertex the vertex
   * @yields {number}
   */
  * inEdges(vertex) {
    const { rows, offset } = this;
    for (let i = 0; i < rows; i++) {
      const index = (i << offset) + vertex;
      const bucket = index >> 4;
      const position = index - (bucket << 4);
      const value = (this[bucket] >> position) & 1;
      if (value) yield i;
    }
  }

  /**
   * Returns the length of underlying TypedArray required to hold the graph.
   *
   * @param {number} vertices
   * @returns {number}
   */
  static getLength(vertices) {
    return super.getLength(vertices, vertices);
  }

  /**
   * Creates an adjacency matrix from a given adjacency list.
   *
   * @param {UnweightedAdjacencyList} list
   * @returns {UnweightedAdjacencyMatrix}
   */
  static fromList(list) {
    const { vertices } = list;
    const graph = new this({ vertices });
    for (let i = 0; i < vertices; i++) {
      const offset = list[i];
      const nextOffset = list[i + 1];
      if (offset === nextOffset) continue;
      for (let j = nextOffset - 1; j >= offset; j--) {
        graph.addEdge(i, list[j]);
      }
    }
    return graph;
  }
}

/**
 * Whether the graph is undirected.
 * @type {boolean}
 */
UnweightedAdjacencyMatrix.undirected = false;

/**
 * Whether the graph is weighted.
 * @type {boolean}
 */
UnweightedAdjacencyMatrix.weighted = false;

module.exports = UnweightedAdjacencyMatrix;
