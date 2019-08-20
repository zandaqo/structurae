/**
 * Creates a WeightedAdjacencyList class extending a given TypedArray class.
 *
 * @param {CollectionConstructor} Base
 * @returns {WeightedAdjacencyList}
 */
function WeightedAdjacencyListMixin(Base) {
  /**
   * Implements Adjacency List data structure for weighted graphs.
   *
   * @extends CollectionConstructor
   */
  class WeightedAdjacencyList extends Base {
    /**
     * @param {Object} [options]
     * @param {number} [options.vertices=2] the maximum amount of vertices in the graph
     * @param {number} [options.edges=2] the maximum amount of edges in the graph
     * @param {...*} args
     */
    constructor(options = {}, ...args) {
      let { vertices, edges } = options;
      if (args.length) {
        if (!vertices && args[0].length) {
          vertices = WeightedAdjacencyList.getVertexCount(args[0]);
          edges = args[0].length - vertices - 1;
        }
        super(...args);
      } else {
        vertices = vertices || 2;
        edges = edges || 4;
        super((vertices + (edges << 1)) + 1);
      }
      Object.defineProperties(this, {
        vertices: { value: vertices },
        edges: { value: edges },
      });

      if (!args.length) this.setOffsets();
    }

    /**
     * Adds an edge between two vertices.
     *
     * @param {number} x the starting vertex
     * @param {number} y the ending vertex
     * @param {number} weight the weight
     * @throws {RangeError} if the list is full
     * @returns {WeightedAdjacencyList}
     */
    addEdge(x, y, weight) {
      const { undirected } = this.constructor;
      if (this.hasEdge(x, y)) return this;
      // the list is full
      if (this.isFull()) throw new RangeError('The list is full.');
      this.setEdge(x, y, weight);
      if (undirected) this.setEdge(y, x, weight);
      return this;
    }

    /**
     * Removes an edge between two vertices.
     *
     * @param {number} x the starting vertex
     * @param {number} y the ending vertex
     * @returns {WeightedAdjacencyList}
     */
    removeEdge(x, y) {
      const { undirected } = this.constructor;
      this.unsetEdge(x, y);
      if (undirected) this.unsetEdge(y, x);
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
      return !Number.isNaN(this.getEdge(x, y));
    }


    /**
     * Returns the weight of the edge between given vertices
     * or NaN if the edge doesn't exist.
     *
     * @param {number} x the starting vertex
     * @param {number} y the ending vertex
     * @returns {number}
     */
    getEdge(x, y) {
      const offset = this[x];
      const nextOffset = this[x + 1];
      // no out edges from x
      if (offset === nextOffset) return NaN;
      for (let i = offset; i < nextOffset; i += 2) {
        if (this[i] === y) return this[i + 1];
      }
      return NaN;
    }

    /**
     * @private
     * @param {number} x the starting vertex
     * @param {number} y the ending vertex
     * @param {number} weight the weight
     * @returns {WeightedAdjacencyList}
     */
    setEdge(x, y, weight) {
      const { vertices } = this;

      // shift values
      for (let i = this[vertices]; i > this[x]; i -= 2) {
        [this[i], this[i + 1], this[i - 1], this[i - 2]] = [this[i - 2], this[i - 1], this[i], this[i + 1]];
      }
      // set edge
      this[this[x]] = y;
      this[this[x] + 1] = weight;

      // update offsets
      for (let i = x + 1; i <= vertices; i++) {
        this[i] += 2;
      }
      return this;
    }

    /**
     * @private
     * @param {number} x the starting vertex
     * @param {number} y the ending vertex
     * @returns {WeightedAdjacencyList}
     */
    unsetEdge(x, y) {
      const offset = this[x];
      const nextOffset = this[x + 1];
      // no out edges from x
      if (offset === nextOffset) return this;
      let edgeIndex = 0;
      for (let i = offset; i < nextOffset; i += 2) {
        if (this[i] === y) {
          edgeIndex = i;
          break;
        }
      }
      // there is no such edge
      if (!edgeIndex) return this;
      // shift value
      for (let i = edgeIndex; i < this[this.vertices]; i += 2) {
        this[i] = this[i + 2];
        this[i + 1] = this[i + 3];
      }

      // update offsets
      for (let i = x + 1; i <= this.vertices; i++) {
        this[i] -= 2;
      }

      return this;
    }

    /**
     * Iterates over outgoing edges of a vertex.
     *
     * @generator
     * @param {number} vertex the vertex
     * @returns {Iterable<number>}
     */
    * outEdges(vertex) {
      const offset = this[vertex];
      const nextOffset = this[vertex + 1];
      if (offset !== nextOffset) {
        for (let i = nextOffset - 2; i >= offset; i -= 2) {
          yield this[i];
        }
      }
    }

    /**
     * Iterates over incoming edges of a vertex.
     *
     * @generator
     * @param {number} vertex the vertex
     * @returns {Iterable<number>}
     */
    * inEdges(vertex) {
      const { vertices } = this;
      let edge = 0;
      let nextVertex = 1;
      for (let i = vertices + 1; i < this[vertices]; i += 2) {
        while (i >= this[nextVertex]) {
          edge++;
          nextVertex++;
        }
        if (this[i] === vertex) yield edge;
      }
    }

    /**
     * @private
     * @returns {void}
     */
    setOffsets() {
      const lastElement = this.vertices + 1;
      for (let i = 0; i < lastElement; i++) {
        this[i] = lastElement;
      }
    }

    /**
     * Checks whether the list is full--all available edges are set.
     *
     * @returns {boolean}
     */
    isFull() {
      return this[this.vertices] >= this.length;
    }

    /**
     * Creates a larger copy of the graph with a space
     * for a specified amount of additional vertices and edges.
     *
     * @param {number} [vertices=0] the amount of additional vertices
     * @param {number} [edges=1] the amount of additional edges
     * @returns {WeightedAdjacencyList}
     */
    grow(vertices = 0, edges = 1) {
      const copy = new this.constructor({
        vertices: this.vertices + vertices,
        edges: this.edges + edges,
      });

      if (!vertices) {
        copy.set(this);
      } else {
        const offset = this[this.vertices];
        const newSize = this.vertices + vertices;
        const newOffset = offset + vertices;
        for (let i = 0; i <= newSize; i++) {
          copy[i] = i < this.vertices ? this[i] + vertices : newOffset;
        }
        copy.set(this.subarray(this.vertices + 1), newSize + 1);
      }
      return copy;
    }

    /**
     * Returns the length of underlying TypedArray required to hold the graph.
     *
     * @param {number} vertices
     * @param {number} edges
     * @returns {number}
     */
    static getLength(vertices, edges) {
      return vertices + (edges << 1) + 1;
    }

    /**
     * Derives the vertex count of an adjacency list stored as an array-like object.
     *
     * @param {Collection} array
     * @returns {number}
     */
    static getVertexCount(array) {
      let vertices = 0;
      while (array[vertices] <= array[vertices + 1]) {
        vertices++;
      }
      return vertices;
    }

    /**
     * @type {CollectionConstructor}
     */
    static get [Symbol.species]() {
      return Base;
    }

    /**
     * Creates an adjacency list from a given grid or adjacency matrix.
     *
     * @param {Grid|BinaryGrid|SymmetricGrid} grid
     * @returns {WeightedAdjacencyList}
     */
    static fromGrid(grid) {
      const vertices = grid.rows;
      const offset = vertices + 1;
      const empty = grid.pad || 0;
      const array = new Array(offset).fill(offset);
      let edges = 0;
      for (let i = 0; i < vertices; i++) {
        array[i + 1] = i === 0 ? offset : array[i];
        for (let j = 0; j < vertices; j++) {
          const weight = grid.get(i, j);
          if (weight !== empty) {
            array.push(j, weight);
            array[i + 1] += 2;
            edges++;
          }
        }
      }
      const graph = new this({ vertices, edges });
      graph.set(array);
      return graph;
    }
  }

  /**
   * Whether the graph is undirected.
   * @type {boolean}
   */
  WeightedAdjacencyList.undirected = false;

  /**
   * Whether the graph is weighted.
   * @type {boolean}
   */
  WeightedAdjacencyList.weighted = true;

  return WeightedAdjacencyList;
}


module.exports = WeightedAdjacencyListMixin;
