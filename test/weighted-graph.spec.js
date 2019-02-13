const WeightedGraphMixin = require('../lib/weighted-graph');

describe('WeightedGraph', () => {
  const WeightedGraph = WeightedGraphMixin(Int32Array, true);
  const UndirectedGraph = WeightedGraphMixin(Int32Array, false);

  let graph;
  let undirected;
  beforeEach(() => {
    graph = new WeightedGraph({ size: 6 });
    graph.addEdge(0, 1, 3);
    graph.addEdge(0, 2, 2);
    graph.addEdge(0, 3, 1);
    graph.addEdge(2, 4, 8);
    graph.addEdge(2, 5, 6);

    undirected = new UndirectedGraph({ size: 6 });
    undirected.addEdge(0, 1, 3);
    undirected.addEdge(0, 2, 2);
    undirected.addEdge(0, 3, 1);
    undirected.addEdge(2, 4, 8);
    undirected.addEdge(2, 5, 6);
  });

  describe('addEdge', () => {
    it('', () => {
      expect(graph.hasEdge(0, 5)).toBe(false);
      graph.addEdge(0, 5, 10);
      expect(graph.hasEdge(0, 5)).toBe(true);
      expect(graph.get(0, 5)).toBe(10);
    });
  });

  describe('removeEdge', () => {
    it('', () => {
      expect(graph.hasEdge(0, 1)).toBe(true);
      graph.removeEdge(0, 1);
      expect(graph.hasEdge(0, 1)).toBe(false);
    });
  });

  describe('outEdges', () => {
    it('', () => {
      expect(graph.outEdges(0)).toEqual([1, 2, 3]);
    });
  });

  describe('inEdges', () => {
    it('', () => {
      expect(graph.inEdges(1)).toEqual([0]);
    });
  });

  describe('hasEdges', () => {
    it('', () => {
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

    it('yields vertexes along traversing path if `path=true`', () => {
      expect([...graph.traverse(false, 0, true)])
        .toEqual([0, 1, 2, 3, 1, 2, 4, 5, 3, 4, 5]);
      expect([...undirected.traverse(false, 0, true)])
        .toEqual([0, 1, 2, 3, 1, 2, 4, 5, 3, 4, 5]);
    });
  });

  describe('path', () => {
    it('finds the shortest path between two vertexes for DAGs', () => {
      graph.addEdge(3, 5, -1);
      expect(graph.path(0, 5, true)).toEqual([0, 3, 5]);
      expect(graph.path(0, 4, true)).toEqual([0, 2, 4]);
      expect(graph.path(1, 4, true)).toEqual([]);
      expect(undirected.path(0, 4, true)).toEqual([0, 2, 4]);
      expect(undirected.path(1, 4, true)).toEqual([1, 0, 2, 4]);
    });
    it('finds the shortest path between two vertexes with non-negative edges', () => {
      graph.addEdge(4, 0, 8);
      expect(graph.path(0, 5, false, true)).toEqual([0, 2, 5]);
      graph.addEdge(1, 5, 1);
      expect(graph.path(0, 5, false, true)).toEqual([0, 1, 5]);
      expect(graph.path(3, 5, false, true)).toEqual([]);
      expect(undirected.path(0, 5, false, true)).toEqual([0, 2, 5]);
    });
    it('finds the shortest path between two vertexes for any graph', () => {
      graph.addEdge(4, 0, 8);
      graph.addEdge(3, 5, -1);
      expect(graph.path(0, 5)).toEqual([0, 3, 5]);
      expect(graph.path(2, 5)).toEqual([2, 5]);
      expect(graph.path(1, 5)).toEqual([]);
      expect(undirected.path(0, 5)).toEqual([0, 2, 5]);
    });
  });
});
