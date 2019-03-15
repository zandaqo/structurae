const GridMixin = require('./grid');
const SymmetricGridMixin = require('./symmetric-grid');

/**
 * Creates a WeightedAdjacencyMatrix class extending a given Array-like class.
 *
 * @param {CollectionConstructor} Base
 * @param {boolean} [undirected=false]
 * @returns {WeightedAdjacencyMatrix}
 */
function WeightedAdjacencyMatrixMixin(Base, undirected = false) {
  const Grid = undirected ? SymmetricGridMixin(Base) : GridMixin(Base);

  /**
   * Implements Adjacency Matrix for weighted graphs.
   *
   * @extends Grid
   */
  class WeightedAdjacencyMatrix extends Grid {
    /**
     * @param {Object} [options]
     * @param {number} [options.vertices=2] the maximum number of vertices
     * @param {*} [options.pad=0] the initial value of all edges
     * @param {...*} [args]
     */
    constructor(options = {}, ...args) {
      const { vertices = 2, pad = 0 } = options;
      super({ rows: vertices, columns: vertices, pad }, ...args);
      Object.defineProperties(this, {
        vertices: { value: vertices },
      });
    }

    /**
     * Adds an edge between two vertices.
     *
     * @param {number} x the starting vertex
     * @param {number} y the ending vertex
     * @param {number} weight
     * @returns {WeightedAdjacencyMatrix}
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
     * @returns {WeightedAdjacencyMatrix}
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
     * Iterates over outgoing edges of a vertex.
     *
     * @generator
     * @param {number} vertex the vertex
     * @yields {number}
     */
    * outEdges(vertex) {
      const { vertices } = this;
      for (let i = 0; i < vertices; i++) {
        if (this.hasEdge(vertex, i)) yield i;
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
      const { vertices } = this;
      for (let i = 0; i < vertices; i++) {
        if (this.hasEdge(i, vertex)) yield i;
      }
    }

    /**
     * Returns the length of underlying Array required to hold the graph.
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
     * @param {WeightedAdjacencyList} list
     * @param {number} [pad=0]
     * @returns {WeightedAdjacencyMatrix}
     */
    static fromList(list, pad = 0) {
      const { vertices } = list;
      const graph = new this({ vertices, pad });
      for (let i = 0; i < vertices; i++) {
        const offset = list[i];
        const nextOffset = list[i + 1];
        if (offset === nextOffset) continue;
        for (let j = nextOffset - 2; j >= offset; j -= 2) {
          graph.addEdge(i, list[j], list[j + 1]);
        }
      }
      return graph;
    }
  }

  /**
   * Whether the graph is undirected.
   * @type {boolean}
   */
  WeightedAdjacencyMatrix.undirected = undirected;

  /**
   * Whether the graph is weighted.
   * @type {boolean}
   */
  WeightedAdjacencyMatrix.weighted = true;

  return WeightedAdjacencyMatrix;
}


module.exports = WeightedAdjacencyMatrixMixin;
