const UnweightedAdjacencyList = require('../lib/unweighted-adjacency-list');
const GridMixin = require('../lib/grid');

describe('UnweightedAdjacencyList', () => {
  let graph;
  beforeEach(() => {
    graph = new UnweightedAdjacencyList({ vertices: 6, edges: 12 });
    graph.addEdge(0, 1);
    graph.addEdge(0, 2);
    graph.addEdge(0, 3);
    graph.addEdge(2, 4);
    graph.addEdge(2, 5);
  });

  describe('constructor', () => {
    it('creates a graph of specified dimensions', () => {
      const emptyGraph = new UnweightedAdjacencyList({ vertices: 6, edges: 6 });
      expect(emptyGraph.vertices).toBe(6);
      expect(emptyGraph.length).toBe(13);
    });

    it('creates a graph of specified dimensions from an existing graph', () => {
      const fromExistingGraph = new UnweightedAdjacencyList({ vertices: 6, edges: 12 }, graph);
      expect(fromExistingGraph.vertices).toBe(6);
      expect(fromExistingGraph.length).toBe(19);
      expect(Array.from(fromExistingGraph)).toEqual(Array.from(graph));
      expect(fromExistingGraph.buffer !== graph.buffer).toBe(true);
    });

    it('creates a graph inferring dimensions from an existing array-like object', () => {
      const noDimensions = new UnweightedAdjacencyList({}, Array.from(graph));
      expect(noDimensions.vertices).toBe(6);
      expect(noDimensions.length).toBe(19);
      expect(Array.from(noDimensions)).toEqual(Array.from(graph));
    });
  });

  describe('addEdge', () => {
    it('adds an edge to a graph', () => {
      expect(graph.hasEdge(0, 5)).toBe(false);
      graph.addEdge(0, 5);
      expect(graph.hasEdge(0, 5)).toBe(true);
    });

    it('adds an edge to an undirected graph', () => {
      class Undirected extends UnweightedAdjacencyList {}
      Undirected.undirected = true;
      const undirected = new Undirected({ vertices: 6, edges: 12 });
      expect(undirected.hasEdge(0, 5)).toBe(false);
      expect(undirected.hasEdge(5, 0)).toBe(false);
      undirected.addEdge(0, 5);
      expect(undirected.hasEdge(0, 5)).toBe(true);
      expect(undirected.hasEdge(5, 0)).toBe(true);
    });

    it('does not add an existing edge', () => {
      graph.setEdge = jest.fn();
      graph.addEdge(0, 1);
      expect(graph.setEdge).not.toHaveBeenCalled();
    });

    it('throws RangeError if the list is full', () => {
      class Undirected extends UnweightedAdjacencyList {}
      Undirected.undirected = true;
      const fullGraph = new Undirected({ vertices: 2, edges: 2 });
      fullGraph.addEdge(0, 1);
      expect(() => fullGraph.addEdge(1, 2)).toThrowError(RangeError);
    });
  });

  describe('removeEdge', () => {
    it('removes an edge from a graph', () => {
      expect(graph.hasEdge(0, 1)).toBe(true);
      graph.removeEdge(0, 1);
      expect(graph.hasEdge(0, 1)).toBe(false);
      graph.removeEdge(0, 1);
      graph.removeEdge(1, 5);
    });

    it('removes an edge from an undirected graph', () => {
      class Undirected extends UnweightedAdjacencyList {}
      Undirected.undirected = true;
      const undirected = new Undirected({ vertices: 6, edges: 12 });
      undirected.addEdge(0, 5);
      expect(undirected.hasEdge(0, 5)).toBe(true);
      expect(undirected.hasEdge(5, 0)).toBe(true);
      undirected.removeEdge(0, 5);
      expect(undirected.hasEdge(0, 5)).toBe(false);
      expect(undirected.hasEdge(5, 0)).toBe(false);
    });
  });

  describe('outEdges', () => {
    it('iterates over outgoing edges of a vertex', () => {
      expect([...graph.outEdges(0)]).toEqual([1, 2, 3]);
      expect([...graph.outEdges(5)]).toEqual([]);
    });
  });

  describe('inEdges', () => {
    it('iterates over incoming edges of a vertex', () => {
      expect([...graph.inEdges(1)]).toEqual([0]);
      expect([...graph.inEdges(4)]).toEqual([2]);
      expect([...graph.inEdges(0)]).toEqual([]);
    });
  });

  describe('hasEdges', () => {
    it('checks whether there is an edge between two given vertices', () => {
      expect(graph.hasEdge(0, 1)).toBe(true);
      expect(graph.hasEdge(0, 5)).toBe(false);
      expect(graph.hasEdge(2, 5)).toBe(true);
    });
  });

  describe('isFull', () => {
    it('checks if the list is full, i.e. all the edges are set', () => {
      expect(graph.isFull()).toBe(false);
      class Undirected extends UnweightedAdjacencyList {}
      Undirected.undirected = true;
      const fullGraph = new Undirected({ vertices: 2, edges: 2 });
      fullGraph.addEdge(0, 1);
      expect(fullGraph.isFull()).toBe(true);
    });
  });

  describe('grow', () => {
    it('creates a large copy for additional edges', () => {
      const bigger = graph.grow(0, 10);
      expect(bigger.length).toBe(29);
      expect(bigger.hasEdge(0, 1)).toBe(true);
      expect(bigger.hasEdge(2, 5)).toBe(true);
    });

    it('creates a large copy for additional vertices and edges', () => {
      const bigger = graph.grow(5, 10);
      expect(bigger.length).toBe(34);
      expect(bigger.hasEdge(0, 1)).toBe(true);
      expect(bigger.hasEdge(2, 5)).toBe(true);
    });
  });

  describe('getLength', () => {
    it('returns the length of underlying TypedArray required to hold the graph', () => {
      expect(UnweightedAdjacencyList.getLength(50, 50)).toBe(101);
    });
  });

  describe('getVertexCount', () => {
    it('derives the vertex count of an adjacency list stored as an array-like object', () => {
      expect(UnweightedAdjacencyList.getVertexCount(graph)).toBe(6);
      expect(
        UnweightedAdjacencyList.getVertexCount(new UnweightedAdjacencyList({ vertices: 4 })),
      ).toBe(4);
      expect(UnweightedAdjacencyList.getVertexCount(new UnweightedAdjacencyList())).toBe(2);
    });
  });

  describe('fromGrid', () => {
    it('creates an adjacency list from a given grid or adjacency matrix', () => {
      const ArrayGrid = GridMixin(Array);
      const grid = new ArrayGrid({ rows: 4, columns: 4 });
      grid.set(0, 1, 1);
      grid.set(0, 2, 1);
      grid.set(2, 0, 1);
      grid.set(3, 0, 1);
      const graphFromGrid = UnweightedAdjacencyList.fromGrid(grid);
      expect(Array.from(graphFromGrid)).toEqual([5, 7, 7, 8, 9, 1, 2, 0, 0]);
    });
  });
});
