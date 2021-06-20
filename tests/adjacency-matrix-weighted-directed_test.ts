import { AdjacencyMatrixWeightedDirectedMixin } from "../adjacency-matrix-weighted-directed.ts";
import { assertEquals } from "../dev_deps.ts";

const { test } = Deno;

const DirectedMatrix = AdjacencyMatrixWeightedDirectedMixin(Int32Array);
const exampleGraph = DirectedMatrix.create(6);
exampleGraph.addEdge(0, 1, 3);
exampleGraph.addEdge(0, 2, 2);
exampleGraph.addEdge(0, 3, 1);
exampleGraph.addEdge(2, 4, 8);
exampleGraph.addEdge(2, 5, 6);

test("[AdjacencyMatrixWeightedDirected.constructor] creates a graph from an existing graph", () => {
  const graph = new DirectedMatrix(exampleGraph);
  assertEquals(graph.vertices, 6);
  assertEquals(
    (graph as unknown as Int32Array).buffer !== exampleGraph.buffer,
    true,
  );
});

test("[AdjacencyMatrixWeightedDirected.creates] creates a graph of given amount of vertices", () => {
  const graph = DirectedMatrix.create(10);
  assertEquals(graph.vertices, 10);
});

test("[AdjacencyMatrixWeightedDirected.getLength] returns the length of underlying TypedArray required to hold the graph", () => {
  assertEquals(DirectedMatrix.getLength(60), 3600);
});

test("[AdjacencyMatrixWeightedDirected#addEdge] adds an edge to a graph", () => {
  const graph = new DirectedMatrix(exampleGraph);
  assertEquals(graph.hasEdge(0, 5), false);
  graph.addEdge(0, 5, 1);
  assertEquals(graph.hasEdge(0, 5), true);
});

test("[AdjacencyMatrixWeightedDirected#removeEdge] removes an edge from a graph", () => {
  const graph = new DirectedMatrix(exampleGraph);
  assertEquals(graph.hasEdge(0, 1), true);
  graph.removeEdge(0, 1);
  assertEquals(graph.hasEdge(0, 1), false);
  graph.removeEdge(0, 1);
  graph.removeEdge(1, 5);
});

test("[AdjacencyMatrixWeightedDirected#outEdges] iterates over outgoing edges of a vertex", () => {
  const graph = new DirectedMatrix(exampleGraph);
  assertEquals([...graph.outEdges(0)], [1, 2, 3]);
});

test("[AdjacencyMatrixWeightedDirected#inEdges] iterates over incoming edges of a vertex", () => {
  const graph = new DirectedMatrix(exampleGraph);
  assertEquals([...graph.inEdges(1)], [0]);
  assertEquals([...graph.inEdges(4)], [2]);
  assertEquals([...graph.inEdges(0)], []);
});

test("[AdjacencyMatrixWeightedDirected#hasEdges] checks whether there is an edge between two given vertices", () => {
  const graph = new DirectedMatrix(exampleGraph);
  assertEquals(graph.hasEdge(0, 1), true);
  assertEquals(graph.hasEdge(0, 5), false);
  assertEquals(graph.hasEdge(2, 5), true);
});
