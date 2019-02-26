const BinaryGrid = require('./binary-grid');

/**
 * Implements Adjacency List data structure for unweighted graphs.
 *
 * @extends Uint32Array
 */
class UnweightedAdjacencyList extends Uint32Array {
  /**
   * @param {Object} [options]
   * @param {number} [options.vertices=2] the maximum amount of vertices in the graph
   * @param {number} [options.edges=2] the maximum amount of edges in the graph
   * @param {boolean} [options.directed=true] whether the graph is directed
   * @param {...*} args
   */
  constructor(options = {}, ...args) {
    const { directed = true } = options;
    let { vertices, edges } = options;
    if (args.length) {
      if (!vertices && args[0].length) {
        vertices = UnweightedAdjacencyList.getVertexCount(args[0]);
        edges = args[0].length - vertices - 1;
      }
      super(...args);
    } else {
      vertices = vertices || 2;
      edges = edges || 2;
      super((vertices + edges) + 1);
    }
    const colors = new BinaryGrid({ rows: 2, columns: vertices });
    Object.defineProperties(this, {
      vertices: { value: vertices },
      edges: { value: edges },
      colors: { value: colors },
      directed: { value: directed },
    });

    if (!args.length) this.setOffsets();
  }

  /**
   * Adds an edge between two vertices.
   *
   * @param {number} x the starting vertex
   * @param {number} y the ending vertex
   * @throws {RangeError} if the list is full
   * @returns {UnweightedAdjacencyList}
   */
  addEdge(x, y) {
    if (this.hasEdge(x, y)) return this;
    // the list is full
    if (this.isFull()) throw new RangeError('The list is full.');
    this.setEdge(x, y);
    if (!this.directed) this.setEdge(y, x);
    return this;
  }

  /**
   * Removes an edge between two vertices.
   *
   * @param {number} x the starting vertex
   * @param {number} y the ending vertex
   * @returns {UnweightedAdjacencyList}
   */
  removeEdge(x, y) {
    this.unsetEdge(x, y);
    if (!this.directed) this.unsetEdge(y, x);
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
    const offset = this[x];
    const nextOffset = this[x + 1];
    // no out edges from x
    if (offset === nextOffset) return false;
    for (let i = offset; i < nextOffset; i++) {
      if (this[i] === y) return true;
    }
    return false;
  }

  /**
   * @private
   * @param {number} x the starting vertex
   * @param {number} y the ending vertex
   * @returns {UnweightedAdjacencyList}
   */
  setEdge(x, y) {
    const vertecies = this.vertices;

    // shift values
    for (let i = this[vertecies]; i > this[x]; i--) {
      [this[i], this[i - 1]] = [this[i - 1], this[i]];
    }
    // set edge
    this[this[x]] = y;

    // update offsets
    for (let i = x + 1; i <= vertecies; i++) {
      this[i] += 1;
    }
    return this;
  }

  /**
   * @private
   * @param {number} x the starting vertex
   * @param {number} y the ending vertex
   * @returns {UnweightedAdjacencyList}
   */
  unsetEdge(x, y) {
    const offset = this[x];
    const nextOffset = this[x + 1];
    // no out edges from x
    if (offset === nextOffset) return this;
    let edgeIndex = 0;
    for (let i = offset; i < nextOffset; i++) {
      if (this[i] === y) {
        edgeIndex = i;
        break;
      }
    }
    // there is no such edge
    if (!edgeIndex) return this;
    // shift value
    for (let i = edgeIndex; i < this[this.vertices]; i++) {
      this[i] = this[i + 1];
    }

    // update offsets
    for (let i = x + 1; i <= this.vertices; i++) {
      this[i] -= 1;
    }

    return this;
  }

  /**
   * Returns a list of all outgoing edges of a vertex.
   *
   * @param {number} x the vertex
   * @returns {Array<number>}
   */
  outEdges(x) {
    const offset = this[x];
    const nextOffset = this[x + 1];
    const result = [];
    if (offset === nextOffset) return result;
    for (let i = nextOffset - 1; i >= offset; i--) {
      result.push(this[i]);
    }
    return result;
  }

  /**
   * Returns a list of all incoming edges of a vertex.
   *
   * @param {number} x the vertex
   * @returns {Array<number>}
   */
  inEdges(x) {
    const { vertices } = this;
    const result = [];
    let vertex = 0;
    let nextVertex = 1;
    for (let i = vertices + 1; i < this[vertices]; i++) {
      while (i >= this[nextVertex]) {
        vertex++;
        nextVertex++;
      }
      if (this[i] === x) result.push(vertex);
    }
    return result;
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
   * @returns {UnweightedAdjacencyList}
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
   * Checks if a vertex is entered during a traversal.
   *
   * @param {number} x the vertex
   * @returns {boolean}
   */
  isGray(x) {
    return !!this.colors.get(0, x);
  }

  /**
   * Marks a vertex as entered during a traversal.
   *
   * @param {number} x the vertex
   * @returns {UnweightedAdjacencyList}
   */
  setGray(x) {
    this.colors.set(0, x);
    return this;
  }

  /**
   * Checks if a vertex has been fully processed during a traversal.
   *
   * @param {number} x the vertex
   * @returns {boolean}
   */
  isBlack(x) {
    return !!this.colors.get(1, x);
  }

  /**
   * Marks a vertex as fully processed during a traversal.
   *
   * @param {number} x the vertex
   * @returns {UnweightedAdjacencyList}
   */
  setBlack(x) {
    this.colors.set(1, x);
    return this;
  }

  /**
   * Resets all coloring of vertices done during traversals.
   *
   * @returns {UnweightedAdjacencyList}
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
    this.resetColors();
    const processing = [start];
    const [push, pull] = isDFS ? ['push', 'pop'] : ['push', 'shift'];
    while (processing.length) {
      const vertex = processing[pull]();
      this.setGray(vertex);
      if (gray) yield vertex;
      const offset = this[vertex];
      const nextOffset = this[vertex + 1];
      for (let i = nextOffset - 1; i >= offset; i--) {
        const edge = this[i];
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
   * Returns a list of vertices along the shortest path between two given vertices.
   *
   * @param {number} start the starting vertex
   * @param {number} [end] the ending vertex
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
    // if no end return the tree
    if (end === undefined) return predecessors;

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
   * Returns a spanning tree of the graph.
   * Uses BFS to construct the tree.
   *
   * @param {number} [start=0]
   * @returns {Array<number>}
   */
  tree(start = 0) {
    return this.path(start);
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
   * Returns the length of underlying TypedArray required to hold the graph.
   *
   * @param {number} vertices
   * @param {number} edges
   * @returns {number}
   */
  static getLength(vertices, edges) {
    return vertices + edges + 1;
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
    return Uint32Array;
  }

  /**
   * Creates an adjacency list from a given grid or adjacency matrix.
   *
   * @param {Grid|BinaryGrid|SymmetricGrid} grid
   * @returns {UnweightedAdjacencyList}
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
        if (grid.get(i, j) !== empty) {
          array.push(j);
          array[i + 1] += 1;
          edges++;
        }
      }
    }
    const graph = new this({ vertices, edges });
    graph.set(array);
    return graph;
  }
}

module.exports = UnweightedAdjacencyList;
