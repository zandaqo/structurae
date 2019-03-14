const WeightedAdjacencyMatrixMixin = require('../lib/weighted-adjacency-matrix');
const WeightedAdjacencyListMixin = require('../lib/weighted-adjacency-list');

const DirectedMatrix = WeightedAdjacencyMatrixMixin(Int32Array, false);
const UndirectedMatrix = WeightedAdjacencyMatrixMixin(Int32Array, true);
const DirectedList = WeightedAdjacencyListMixin(Int32Array);

describe('WeightedAdjacencyMatrix', () => {
  let graph;
  beforeEach(() => {
    graph = new DirectedMatrix({ vertices: 6 });
    graph.addEdge(0, 1, 3);
    graph.addEdge(0, 2, 2);
    graph.addEdge(0, 3, 1);
    graph.addEdge(2, 4, 8);
    graph.addEdge(2, 5, 6);
  });

  describe('addEdge', () => {
    it('adds an edge to a graph', () => {
      expect(graph.hasEdge(0, 5)).toBe(false);
      graph.addEdge(0, 5, 1);
      expect(graph.hasEdge(0, 5)).toBe(true);
    });

    it('adds an edge to an undirected graph', () => {
      const undirected = new UndirectedMatrix({ vertices: 6, edges: 12 });
      expect(undirected.hasEdge(0, 5)).toBe(false);
      expect(undirected.hasEdge(5, 0)).toBe(false);
      undirected.addEdge(0, 5, 1);
      expect(undirected.hasEdge(0, 5)).toBe(true);
      expect(undirected.hasEdge(5, 0)).toBe(true);
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
      const undirected = new UndirectedMatrix({ vertices: 6, edges: 12 });
      undirected.addEdge(0, 5, 1);
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

  describe('getLength', () => {
    it('returns the length of underlying TypedArray required to hold the graph', () => {
      expect(DirectedMatrix.getLength(60)).toBe(3840);
      expect(UndirectedMatrix.getLength(60)).toBe(1830);
    });
  });

  describe('fromList', () => {
    it('creates an adjacency matrix from a given adjacency list', () => {
      const list = new DirectedList({ vertices: 6, edges: 12 });
      list.addEdge(0, 1, 3);
      list.addEdge(0, 2, 2);
      list.addEdge(0, 3, 1);
      list.addEdge(2, 4, 8);
      list.addEdge(2, 5, 6);
      const graphFromList = DirectedMatrix.fromList(list);
      expect(graphFromList.hasEdge(0, 1)).toBe(true);
      expect(graphFromList.hasEdge(0, 2)).toBe(true);
      expect(graphFromList.hasEdge(0, 3)).toBe(true);
      expect(graphFromList.hasEdge(2, 4)).toBe(true);
      expect(graphFromList.hasEdge(2, 5)).toBe(true);
      expect(graphFromList.hasEdge(1, 0)).toBe(false);
    });
  });
});
