import { AdjacencyMatrixWeightedDirectedMixin } from '../src/adjacency-matrix-weighted-directed';

const DirectedMatrix = AdjacencyMatrixWeightedDirectedMixin(Int32Array);

describe('WeightedDirectedAdjacencyMatrix', () => {
  let graph: InstanceType<typeof DirectedMatrix>;
  beforeEach(() => {
    graph = DirectedMatrix.create(6);
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
  });

  describe('removeEdge', () => {
    it('removes an edge from a graph', () => {
      expect(graph.hasEdge(0, 1)).toBe(true);
      graph.removeEdge(0, 1);
      expect(graph.hasEdge(0, 1)).toBe(false);
      graph.removeEdge(0, 1);
      graph.removeEdge(1, 5);
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
      expect(DirectedMatrix.getLength(60)).toBe(3600);
    });
  });
});
