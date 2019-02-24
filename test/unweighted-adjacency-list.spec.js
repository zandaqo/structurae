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

    it('creates a graph of specified dimensions', () => {
      const fromExistingGraph = new UnweightedAdjacencyList({ vertices: 6, edges: 12 }, graph);
      expect(fromExistingGraph.vertices).toBe(6);
      expect(fromExistingGraph.length).toBe(19);
      expect(Array.from(fromExistingGraph)).toEqual(Array.from(graph));
      expect(fromExistingGraph.buffer !== graph.buffer).toBe(true);
    });
  });

  describe('addEdge', () => {
    it('adds an edge to a graph', () => {
      expect(graph.hasEdge(0, 5)).toBe(false);
      graph.addEdge(0, 5);
      expect(graph.hasEdge(0, 5)).toBe(true);
    });

    it('adds an edge to an undirected graph', () => {
      const directedGraph = new UnweightedAdjacencyList({
        vertices: 6, edges: 12, directed: false,
      });
      expect(directedGraph.hasEdge(0, 5)).toBe(false);
      expect(directedGraph.hasEdge(5, 0)).toBe(false);
      directedGraph.addEdge(0, 5);
      expect(directedGraph.hasEdge(0, 5)).toBe(true);
      expect(directedGraph.hasEdge(5, 0)).toBe(true);
    });

    it('does not add an existing edge', () => {
      graph.setEdge = jest.fn();
      graph.addEdge(0, 1);
      expect(graph.setEdge).not.toHaveBeenCalled();
    });

    it('does not add an edge when the list is full', () => {
      const fullGraph = new UnweightedAdjacencyList({ vertices: 2, edges: 2, directed: false });
      fullGraph.addEdge(0, 1);
      fullGraph.setEdge = jest.fn();
      fullGraph.addEdge(1, 2);
      expect(fullGraph.setEdge).not.toHaveBeenCalled();
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
      const directedGraph = new UnweightedAdjacencyList({
        vertices: 6, edges: 12, directed: false,
      });
      directedGraph.addEdge(0, 5);
      expect(directedGraph.hasEdge(0, 5)).toBe(true);
      expect(directedGraph.hasEdge(5, 0)).toBe(true);
      directedGraph.removeEdge(0, 5);
      expect(directedGraph.hasEdge(0, 5)).toBe(false);
      expect(directedGraph.hasEdge(5, 0)).toBe(false);
    });
  });

  describe('outEdges', () => {
    it('returns a list of all outgoing edges of a given vertex', () => {
      expect(graph.outEdges(0)).toEqual([1, 2, 3]);
      expect(graph.outEdges(5)).toEqual([]);
    });
  });

  describe('inEdges', () => {
    it('returns a list of all incoming edges of a given vertex', () => {
      expect(graph.inEdges(1)).toEqual([0]);
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
      const fullGraph = new UnweightedAdjacencyList({ vertices: 2, edges: 2, directed: false });
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

  describe('traverse', () => {
    it('does a Breadth First Search on the graph', () => {
      const bfs = [...graph.traverse()];
      expect(bfs).toEqual([0, 1, 2, 3, 4, 5]);
    });

    it('does a Depth First Search on the graph if `isDFS=true`', () => {
      const dfs = [...graph.traverse(true)];
      expect(dfs).toEqual([0, 3, 2, 5, 4, 1]);
    });

    it('yields edging vertices if `white=true`', () => {
      const bfs = [...graph.traverse(false, 0, false, true)];
      expect(bfs).toEqual([1, 2, 3, 4, 5]);
    });

    it('yields fully processed vertices if `black=true`', () => {
      const bfs = [...graph.traverse(false, 0, false, false, true)];
      expect(bfs).toEqual([0, 1, 2, 3, 4, 5]);
    });
  });

  describe('path', () => {
    it('finds the shortest path between two vertices', () => {
      const path = graph.path(0, 5);
      expect(path).toEqual([0, 2, 5]);
    });

    it('returns an empty array if no path is found', () => {
      const path = graph.path(3, 5);
      expect(path).toEqual([]);
    });
  });

  describe('tree', () => {
    it('returns a spanning tree of the graph', () => {
      expect(graph.tree()).toEqual([-1, 0, 0, 0, 2, 2]);
      graph.addEdge(0, 5);
      expect(graph.tree()).toEqual([-1, 0, 0, 0, 2, 2]);
      graph.addEdge(3, 4);
      expect(graph.tree()).toEqual([-1, 0, 0, 0, 3, 2]);
    });
  });

  describe('resetColors', () => {
    it('resets all coloring of vertices done during traversals', () => {
      expect(graph.isBlack(0)).toBe(false);
      expect(graph.isBlack(5)).toBe(false);
      const bfs = [...graph.traverse()];
      expect(graph.isBlack(0)).toBe(true);
      expect(graph.isBlack(5)).toBe(true);
      graph.resetColors();
      expect(graph.isBlack(0)).toBe(false);
      expect(graph.isBlack(5)).toBe(false);
    });
  });

  describe('isAcyclic', () => {
    it('checks whether the graph is acyclic', () => {
      expect(graph.isAcyclic()).toBe(true);
      graph.addEdge(1, 0);
      expect(graph.isAcyclic()).toBe(false);
      graph.removeEdge(1, 0);
      expect(graph.isAcyclic()).toBe(true);
      graph.addEdge(5, 0);
      expect(graph.isAcyclic()).toBe(false);
      graph.removeEdge(5, 0);
      expect(graph.isAcyclic()).toBe(true);
      graph.addEdge(5, 3).addEdge(3, 2);
      expect(graph.isAcyclic()).toBe(false);
    });
  });

  describe('topologicalSort', () => {
    it('returns a list of vertices sorted topologically', () => {
      expect(graph.topologicalSort()).toEqual([0, 3, 2, 5, 4, 1]);
    });
  });

  describe('getLength', () => {
    it('returns the length of underlying TypedArray required to hold the graph', () => {
      expect(UnweightedAdjacencyList.getLength(50, 50)).toBe(101);
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
