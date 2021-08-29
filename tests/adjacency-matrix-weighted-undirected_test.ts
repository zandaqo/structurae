import { AdjacencyMatrixWeightedUndirectedMixin } from "../adjacency-matrix-weighted-undirected.ts";
import { assertEquals } from "../dev_deps.ts";

const { test } = Deno;

const UndirectedMatrix = AdjacencyMatrixWeightedUndirectedMixin(Int32Array);
const exampleGraph = UndirectedMatrix.create(6);
exampleGraph.addEdge(0, 1, 3);
exampleGraph.addEdge(0, 2, 2);
exampleGraph.addEdge(0, 3, 1);
exampleGraph.addEdge(2, 4, 8);
exampleGraph.addEdge(2, 5, 6);

test("[AdjacencyMatrixWeightedUndirected.constructor] creates a graph from an existing graph", () => {
  const graph = new UndirectedMatrix(exampleGraph);
  assertEquals(graph.vertices, 6);
  assertEquals(graph.edges, 36);
  assertEquals(graph.isFull(), false);
  assertEquals(
    (graph as unknown as Int32Array).buffer !== exampleGraph.buffer,
    true,
  );
});

test("[AdjacencyMatrixWeightedUndirected.creates] creates a graph of given amount of vertices", () => {
  const graph = UndirectedMatrix.create(10);
  assertEquals(graph.vertices, 10);
});

test("[AdjacencyMatrixWeightedUndirected.getLength] returns the length of underlying TypedArray required to hold the graph", () => {
  assertEquals(UndirectedMatrix.getLength(60), 1830);
});

test("[AdjacencyMatrixWeightedUndirected#addEdge] adds an edge to a graph", () => {
  const graph = new UndirectedMatrix(exampleGraph);
  assertEquals(graph.hasEdge(0, 5), false);
  assertEquals(graph.hasEdge(5, 0), false);
  graph.addEdge(0, 5, 1);
  assertEquals(graph.hasEdge(0, 5), true);
  assertEquals(graph.hasEdge(5, 0), true);
});

test("[AdjacencyMatrixWeightedUndirected#removeEdge] removes an edge from an undirected graph", () => {
  const graph = new UndirectedMatrix(exampleGraph);
  assertEquals(graph.hasEdge(0, 1), true);
  assertEquals(graph.hasEdge(1, 0), true);
  graph.removeEdge(1, 0);
  assertEquals(graph.hasEdge(0, 1), false);
  assertEquals(graph.hasEdge(1, 0), false);
});

test("[AdjacencyMatrixWeightedUndirected#outEdge] iterates over outgoing edges of a vertex", () => {
  const graph = new UndirectedMatrix(exampleGraph);
  assertEquals([...graph.outEdges(0)], [1, 2, 3]);
});

test("[AdjacencyMatrixWeightedUndirected#idEdge] iterates over incoming edges of a vertex", () => {
  const graph = new UndirectedMatrix(exampleGraph);
  assertEquals([...graph.inEdges(1)], [0]);
  assertEquals([...graph.inEdges(4)], [2]);
  assertEquals([...graph.inEdges(0)], [1, 2, 3]);
});

test("[AdjacencyMatrixWeightedUndirected#hasEdge] checks whether there is an edge between two given vertices", () => {
  const graph = new UndirectedMatrix(exampleGraph);
  assertEquals(graph.hasEdge(0, 1), true);
  assertEquals(graph.hasEdge(0, 5), false);
  assertEquals(graph.hasEdge(2, 5), true);
});

test("[DirectedMatrix.$species] returns underlying TypedArray when sliced", () => {
  assertEquals(UndirectedMatrix[Symbol.species], Int32Array);
});
