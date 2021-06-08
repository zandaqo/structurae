import { AdjacencyListMixin } from "../src/adjacency-list";

const DirectedList = AdjacencyListMixin(Uint32Array);

describe("AdjacencyList", () => {
  let graph: ReturnType<typeof DirectedList.create>;

  beforeEach(() => {
    graph = DirectedList.create(6, 12);
    graph.addEdge(0, 1, 3);
    graph.addEdge(0, 2, 2);
    graph.addEdge(0, 3, 1);
    graph.addEdge(2, 4, 8);
    graph.addEdge(2, 5, 6);
  });

  describe("constructor", () => {
    it("creates a graph of specified dimensions", () => {
      const emptyGraph = DirectedList.create(6, 6);
      expect(emptyGraph.vertices).toBe(6);
      expect(emptyGraph.length).toBe(19);
    });

    it("creates a graph of specified dimensions from an existing graph", () => {
      const fromExistingGraph = new DirectedList(graph);
      expect(fromExistingGraph.vertices).toBe(6);
      expect(fromExistingGraph.length).toBe(31);
      expect(Array.from(fromExistingGraph)).toEqual(Array.from(graph));
      expect((fromExistingGraph as any).buffer !== graph.buffer).toBe(true);
    });

    it("creates a graph inferring dimensions from an existing array-like object", () => {
      const noDimensions = new DirectedList(Array.from(graph));
      expect(noDimensions.vertices).toBe(6);
      expect(noDimensions.length).toBe(31);
      expect(Array.from(noDimensions)).toEqual(Array.from(graph));
    });
  });

  describe("addEdge", () => {
    it("adds an edge to a graph", () => {
      expect(graph.hasEdge(0, 5)).toBe(false);
      graph.addEdge(0, 5, 1);
      expect(graph.hasEdge(0, 5)).toBe(true);
    });

    it("throws RangeError if the list is full", () => {
      const fullGraph = DirectedList.create(2, 2);
      fullGraph.addEdge(0, 1, 1);
      fullGraph.addEdge(1, 0, 1);
      expect(() => fullGraph.addEdge(1, 2, 1)).toThrowError(RangeError);
    });
  });

  describe("removeEdge", () => {
    it("removes an edge from a graph", () => {
      expect(graph.hasEdge(0, 1)).toBe(true);
      graph.removeEdge(0, 1);
      expect(graph.hasEdge(0, 1)).toBe(false);
      graph.removeEdge(0, 1);
      graph.removeEdge(1, 5);
    });
  });

  describe("outEdges", () => {
    it("iterates over outgoing edges of a vertex", () => {
      expect([...graph.outEdges(0)]).toEqual([1, 2, 3]);
      expect([...graph.outEdges(5)]).toEqual([]);
    });
  });

  describe("inEdges", () => {
    it("iterates over incoming edges of a vertex", () => {
      expect([...graph.inEdges(1)]).toEqual([0]);
      expect([...graph.inEdges(4)]).toEqual([2]);
      expect([...graph.inEdges(0)]).toEqual([]);
    });
  });

  describe("hasEdges", () => {
    it("checks whether there is an edge between two given vertices", () => {
      expect(graph.hasEdge(0, 1)).toBe(true);
      expect(graph.hasEdge(0, 5)).toBe(false);
      expect(graph.hasEdge(2, 5)).toBe(true);
    });
  });

  describe("isFull", () => {
    it("checks if the list is full, i.e. all the edges are set", () => {
      expect(graph.isFull()).toBe(false);
      const fullGraph = DirectedList.create(2, 2);
      fullGraph.addEdge(0, 1, 1);
      fullGraph.addEdge(1, 0, 1);
      expect(fullGraph.isFull()).toBe(true);
    });
  });

  describe("getLength", () => {
    it("returns the length of underlying TypedArray required to hold the graph", () => {
      expect(DirectedList.getLength(50, 50)).toBe(151);
    });
  });
});
