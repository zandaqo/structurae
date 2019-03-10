const WeightedAdjacencyMatrixMixin = require('../lib/weighted-adjacency-matrix');

describe('WeightedAdjacencyMatrix', () => {
  const WeightedAdjacencyMatrix = WeightedAdjacencyMatrixMixin(Int32Array, true);
  const UndirectedGraph = WeightedAdjacencyMatrixMixin(Int32Array, false);

  let graph;
  let undirected;
  beforeEach(() => {
    graph = new WeightedAdjacencyMatrix({ vertices: 6 });
    graph.addEdge(0, 1, 3);
    graph.addEdge(0, 2, 2);
    graph.addEdge(0, 3, 1);
    graph.addEdge(2, 4, 8);
    graph.addEdge(2, 5, 6);

    undirected = new UndirectedGraph({ vertices: 6 });
    undirected.addEdge(0, 1, 3);
    undirected.addEdge(0, 2, 2);
    undirected.addEdge(0, 3, 1);
    undirected.addEdge(2, 4, 8);
    undirected.addEdge(2, 5, 6);
  });

  describe('addEdge', () => {
    it('adds an edge to a graph', () => {
      expect(graph.hasEdge(0, 5)).toBe(false);
      graph.addEdge(0, 5, 10);
      expect(graph.hasEdge(0, 5)).toBe(true);
      expect(graph.get(0, 5)).toBe(10);
    });
  });

  describe('removeEdge', () => {
    it('removes an edge from a graph', () => {
      expect(graph.hasEdge(0, 1)).toBe(true);
      graph.removeEdge(0, 1);
      expect(graph.hasEdge(0, 1)).toBe(false);
    });
  });

  describe('outEdges', () => {
    it('returns a list of all outgoing edges of a given vertex', () => {
      expect(graph.outEdges(0)).toEqual([1, 2, 3]);
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

  describe('traverse', () => {
    it('does a Breadth First Search on the graph', () => {
      expect([...graph.traverse()]).toEqual([0, 1, 2, 3, 4, 5]);
      expect([...undirected.traverse()]).toEqual([0, 1, 2, 3, 4, 5]);
    });

    it('does a Depth First Search on the graph if `isDFS=true`', () => {
      expect([...graph.traverse(true)]).toEqual([0, 3, 2, 5, 4, 1]);
      expect([...undirected.traverse(true)]).toEqual([0, 3, 2, 5, 4, 1]);
    });

    it('yields edging vertices if `white=true`', () => {
      expect([...graph.traverse(false, 0, false, true)])
        .toEqual([1, 2, 3, 4, 5]);
      expect([...undirected.traverse(false, 0, false, true)])
        .toEqual([1, 2, 3, 0, 0, 4, 5, 0, 2, 2]);
    });

    it('yields fully processed vertices if `black=true`', () => {
      expect([...graph.traverse(false, 0, false, false, true)])
        .toEqual([0, 1, 2, 3, 4, 5]);
      expect([...undirected.traverse(false, 0, false, false, true)])
        .toEqual([0, 1, 2, 3, 4, 5]);
    });
  });

  describe('path', () => {
    it('finds the shortest path between two vertices for DAGs', () => {
      graph.addEdge(3, 5, -1);
      expect(graph.path(0, 5, true)).toEqual([0, 3, 5]);
      expect(graph.path(0, 4, true)).toEqual([0, 2, 4]);
      expect(graph.path(1, 4, true)).toEqual([]);
      expect(undirected.path(0, 4, true)).toEqual([0, 2, 4]);
      expect(undirected.path(1, 4, true)).toEqual([1, 0, 2, 4]);
    });
    it('finds the shortest path between two vertices with non-negative edges', () => {
      graph.addEdge(4, 0, 8);
      expect(graph.path(0, 5, false, true)).toEqual([0, 2, 5]);
      graph.addEdge(1, 5, 1);
      expect(graph.path(0, 5, false, true)).toEqual([0, 1, 5]);
      expect(graph.path(3, 5, false, true)).toEqual([]);
      expect(undirected.path(0, 5, false, true)).toEqual([0, 2, 5]);
    });
    it('finds the shortest path between two vertices for any graph', () => {
      graph.addEdge(4, 0, 8);
      graph.addEdge(3, 5, -1);
      expect(graph.path(0, 5)).toEqual([0, 3, 5]);
      expect(graph.path(2, 5)).toEqual([2, 5]);
      expect(graph.path(1, 5)).toEqual([]);
      expect(undirected.path(0, 5)).toEqual([0, 2, 5]);
    });
  });

  describe('tree', () => {
    it('returns a minimal spanning tree of the graph', () => {
      expect(graph.tree()).toEqual([-1, 0, 0, 0, 2, 2]);
      graph.addEdge(0, 5, 1);
      expect(graph.tree()).toEqual([-1, 0, 0, 0, 2, 0]);
      graph.addEdge(3, 4, 2);
      expect(graph.tree()).toEqual([-1, 0, 0, 0, 3, 0]);
      graph.addEdge(5, 2, 2);
      expect(graph.tree()).toEqual([-1, 0, 5, 0, 3, 0]);
    });
  });

  describe('isAcyclic', () => {
    it('checks whether the graph is acyclic', () => {
      expect(graph.isAcyclic()).toBe(true);
      graph.addEdge(1, 0, 1);
      expect(graph.isAcyclic()).toBe(false);
      graph.removeEdge(1, 0);
      expect(graph.isAcyclic()).toBe(true);
      graph.addEdge(5, 0, 1);
      expect(graph.isAcyclic()).toBe(false);
      graph.removeEdge(5, 0);
      expect(graph.isAcyclic()).toBe(true);
      graph.addEdge(5, 3, 1).addEdge(3, 2, 1);
      expect(graph.isAcyclic()).toBe(false);
    });
  });

  describe('topologicalSort', () => {
    it('returns a list of vertices sorted topologically', () => {
      expect(graph.topologicalSort()).toEqual([0, 3, 2, 5, 4, 1]);
      expect(undirected.topologicalSort()).toEqual([0, 3, 2, 5, 4, 1]);
    });
  });

  describe('getLength', () => {
    it('returns the length of underlying TypedArray required to hold the graph', () => {
      expect(WeightedAdjacencyMatrix.getLength(60)).toBe(3840);
      expect(UndirectedGraph.getLength(60)).toBe(1830);
    });
  });
});
