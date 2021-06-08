import { AdjacencyMatrixUnweightedUndirected } from '../src/adjacency-matrix-unweighted-undirected';

describe('UnweightedUndirectedAdjacencyMatrix', () => {
  let graph: AdjacencyMatrixUnweightedUndirected;
  beforeEach(() => {
    graph = AdjacencyMatrixUnweightedUndirected.create(6);
    graph.addEdge(0, 1);
    graph.addEdge(0, 2);
    graph.addEdge(0, 3);
    graph.addEdge(2, 4);
    graph.addEdge(2, 5);
  });

  describe('addEdge', () => {
    it('adds an edge to a directed graph', () => {
      expect(graph.hasEdge(0, 5)).toBe(false);
      expect(graph.hasEdge(5, 0)).toBe(false);
      graph.addEdge(0, 5);
      expect(graph.hasEdge(0, 5)).toBe(true);
      expect(graph.hasEdge(5, 0)).toBe(true);
    });
  });

  describe('removeEdge', () => {
    it('removes an edge from a directed graph', () => {
      graph.addEdge(0, 5);
      expect(graph.hasEdge(0, 5)).toBe(true);
      expect(graph.hasEdge(5, 0)).toBe(true);
      graph.removeEdge(0, 5);
      expect(graph.hasEdge(0, 5)).toBe(false);
      expect(graph.hasEdge(5, 0)).toBe(false);
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
      expect([...graph.inEdges(0)]).toEqual([1, 2, 3]);
    });
  });

  describe('getEdge', () => {
    it('returns 1 if edge is set, 0 otherwise', () => {
      expect(graph.getEdge(0, 1)).toBe(1);
      expect(graph.getEdge(1, 0)).toBe(1);
      expect(graph.getEdge(0, 5)).toBe(0);
    });
  });
});
