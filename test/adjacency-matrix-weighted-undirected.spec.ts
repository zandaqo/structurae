import { AdjacencyMatrixWeightedUndirectedMixin } from '../src/adjacency-matrix-weighted-undirected';

const UndirectedMatrix = AdjacencyMatrixWeightedUndirectedMixin(Int32Array);

describe('WeightedUndirectedAdjacencyMatrix', () => {
  let graph: InstanceType<typeof UndirectedMatrix>;
  beforeEach(() => {
    graph = UndirectedMatrix.create(6);
    graph.addEdge(0, 1, 3);
    graph.addEdge(0, 2, 2);
    graph.addEdge(0, 3, 1);
    graph.addEdge(2, 4, 8);
    graph.addEdge(2, 5, 6);
  });

  describe('addEdge', () => {
    it('adds an edge to a graph', () => {
      expect(graph.hasEdge(0, 5)).toBe(false);
      expect(graph.hasEdge(5, 0)).toBe(false);
      graph.addEdge(0, 5, 1);
      expect(graph.hasEdge(0, 5)).toBe(true);
      expect(graph.hasEdge(5, 0)).toBe(true);
    });
  });

  describe('removeEdge', () => {
    it('removes an edge from an undirected graph', () => {
      expect(graph.hasEdge(0, 1)).toBe(true);
      expect(graph.hasEdge(1, 0)).toBe(true);
      graph.removeEdge(1, 0);
      expect(graph.hasEdge(0, 1)).toBe(false);
      expect(graph.hasEdge(1, 0)).toBe(false);
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

  describe('hasEdges', () => {
    it('checks whether there is an edge between two given vertices', () => {
      expect(graph.hasEdge(0, 1)).toBe(true);
      expect(graph.hasEdge(0, 5)).toBe(false);
      expect(graph.hasEdge(2, 5)).toBe(true);
    });
  });

  describe('getLength', () => {
    it('returns the length of underlying TypedArray required to hold the graph', () => {
      expect(UndirectedMatrix.getLength(60)).toBe(1830);
    });
  });
});
