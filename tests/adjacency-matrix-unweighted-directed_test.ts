import { assertEquals } from "../dev_deps.ts";
import { AdjacencyMatrixUnweightedDirected } from "../adjacency-matrix-unweighted-directed.ts";

const { test } = Deno;

const exampleGraph = AdjacencyMatrixUnweightedDirected.create(6);
exampleGraph.addEdge(0, 1);
exampleGraph.addEdge(0, 2);
exampleGraph.addEdge(0, 3);
exampleGraph.addEdge(2, 4);
exampleGraph.addEdge(2, 5);

test("[AdjacencyMatrixUnweightedDirected.constructor] creates a graph from an existing graph", () => {
  const graph = new AdjacencyMatrixUnweightedDirected(exampleGraph);
  assertEquals(graph.vertices, 6);
  assertEquals(graph.buffer !== exampleGraph.buffer, true);
});

test("[AdjacencyMatrixUnweightedDirected.creates] creates a graph of given amount of vertices", () => {
  const graph = AdjacencyMatrixUnweightedDirected.create(10);
  assertEquals(graph.vertices, 10);
});

test("[AdjacencyMatrixUnweightedDirected.getLength] returns the length of underlying TypedArray required to hold the graph", () => {
  assertEquals(AdjacencyMatrixUnweightedDirected.getLength(50), 102);
});

test("[AdjacencyMatrixUnweightedDirected#addEdge] adds an edge to a graph", () => {
  const graph = new AdjacencyMatrixUnweightedDirected(exampleGraph);
  assertEquals(graph.hasEdge(0, 5), false);
  graph.addEdge(0, 5);
  assertEquals(graph.hasEdge(0, 5), true);
  graph.addEdge(5, 0);
  assertEquals(graph.hasEdge(5, 0), true);
});
test("[AdjacencyMatrixUnweightedDirected#removeEdge] removes an edge from a graph", () => {
  const graph = new AdjacencyMatrixUnweightedDirected(exampleGraph);
  assertEquals(graph.hasEdge(0, 1), true);
  graph.removeEdge(0, 1);
  assertEquals(graph.hasEdge(0, 1), false);
});

test("[AdjacencyMatrixUnweightedDirected#outEdges] iterates over outgoing edges of a vertex", () => {
  const graph = new AdjacencyMatrixUnweightedDirected(exampleGraph);
  assertEquals([...graph.outEdges(0)], [1, 2, 3]);
});
test("[AdjacencyMatrixUnweightedDirected#inEdges] iterates over incoming edges of a vertex", () => {
  const graph = new AdjacencyMatrixUnweightedDirected(exampleGraph);
  assertEquals([...graph.inEdges(1)], [0]);
  assertEquals([...graph.inEdges(4)], [2]);
  assertEquals([...graph.inEdges(0)], []);
});

test("[AdjacencyMatrixUnweightedDirected#hasEdges] checks whether there is an edge between two given vertices", () => {
  const graph = new AdjacencyMatrixUnweightedDirected(exampleGraph);
  assertEquals(graph.hasEdge(0, 1), true);
  assertEquals(graph.hasEdge(0, 5), false);
  assertEquals(graph.hasEdge(2, 5), true);
});

test("[AdjacencyMatrixUnweightedDirected#getEdge] returns 1 if edge is set, 0 otherwise", () => {
  const graph = new AdjacencyMatrixUnweightedDirected(exampleGraph);
  assertEquals(graph.getEdge(0, 1), 1);
  assertEquals(graph.getEdge(0, 5), 0);
});
