const BinaryGrid = require('./binary-grid');

/**
 * @extends BinaryGrid
 */
class UnweightedGraph extends BinaryGrid {
  /**
   * @param {Object} [options]
   * @param {number} [options.size=2] the maximum number of vertices
   * @param {boolean} [options.directed] whether the graph is directed
   * @param {Collection} [data]
   */
  constructor(options = {}, data) {
    const { size = 2, directed = false } = options;
    super({ rows: size, columns: size }, data);
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
   * @returns {UnweightedGraph}
   */
  addEdge(x, y) {
    this.setBit(x, y);
    if (!this.directed) this.setBit(y, x);
    return this;
  }

  /**
   * Removes an edge between two vertices.
   *
   * @param {number} x the starting vertex
   * @param {number} y the ending vertex
   * @returns {UnweightedGraph}
   */
  removeEdge(x, y) {
    this.setBit(x, y, 0);
    if (!this.directed) this.setBit(y, x, 0);
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
    return !!this.getBit(x, y);
  }

  /**
   * Returns a list of all outgoing edges of a vertex.
   *
   * @param {number} x the vertex
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
   * Returns a list of all incoming edges of a vertex.
   *
   * @param {number} x the vertex
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
   * @returns {UnweightedGraph}
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
   * @returns {UnweightedGraph}
   */
  setBlack(x) {
    this.colors.setBit(1, x);
    return this;
  }

  /**
   * Resets all coloring of vertices done during traversals.
   *
   * @returns {UnweightedGraph}
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
    const { size, offset } = this;
    this.resetColors();
    const processing = [start];
    const [push, pull] = isDFS ? ['push', 'pop'] : ['push', 'shift'];
    while (processing.length) {
      const vertex = processing[pull]();
      this.setGray(vertex);
      if (gray) yield vertex;
      const index = vertex << offset;
      const end = index + size;
      for (let i = index; i < end; i++) {
        const bucket = i >> 4;
        const position = i - (bucket << 4);
        const hasEdge = (this[bucket] >> position) & 1;
        if (!hasEdge) continue;
        const neighbor = i - index;
        if (!this.isGray(neighbor)) {
          processing[push](neighbor);
        }
        if (white) yield neighbor;
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
}

module.exports = UnweightedGraph;
