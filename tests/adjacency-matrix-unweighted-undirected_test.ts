import { AdjacencyMatrixUnweightedUndirected } from "../adjacency-matrix-unweighted-undirected.ts";
import { assertEquals } from "../dev_deps.ts";

const { test } = Deno;
const exampleGraph = AdjacencyMatrixUnweightedUndirected.create(6);
exampleGraph.addEdge(0, 1);
exampleGraph.addEdge(0, 2);
exampleGraph.addEdge(0, 3);
exampleGraph.addEdge(2, 4);
exampleGraph.addEdge(2, 5);

test("[AdjacencyMatrixUnweightedUndirected.constructor] creates a graph from an existing graph", () => {
  const graph = new AdjacencyMatrixUnweightedUndirected(exampleGraph);
  assertEquals(graph.vertices, 6);
  assertEquals(graph.edges, 36);
  assertEquals(graph.isFull(), false);
  assertEquals(graph.buffer !== exampleGraph.buffer, true);
});

test("[AdjacencyMatrixUnweightedUndirected.creates] creates a graph of given amount of vertices", () => {
  const graph = AdjacencyMatrixUnweightedUndirected.create(10);
  assertEquals(graph.vertices, 10);
});

test("[AdjacencyMatrixUnweightedUndirected.getLength] returns the length of underlying TypedArray required to hold the graph", () => {
  assertEquals(AdjacencyMatrixUnweightedUndirected.getLength(50), 41);
});

test("[AdjacencyMatrixUnweightedUndirected#addEdge] adds an edge to a directed graph", () => {
  const graph = new AdjacencyMatrixUnweightedUndirected(exampleGraph);
  assertEquals(graph.hasEdge(0, 5), false);
  assertEquals(graph.hasEdge(5, 0), false);
  graph.addEdge(0, 5);
  assertEquals(graph.hasEdge(0, 5), true);
  assertEquals(graph.hasEdge(5, 0), true);
});

test("[AdjacencyMatrixUnweightedUndirected#removeEdge] removes an edge from a directed graph", () => {
  const graph = new AdjacencyMatrixUnweightedUndirected(exampleGraph);
  graph.addEdge(0, 5);
  assertEquals(graph.hasEdge(0, 5), true);
  assertEquals(graph.hasEdge(5, 0), true);
  graph.removeEdge(0, 5);
  assertEquals(graph.hasEdge(0, 5), false);
  assertEquals(graph.hasEdge(5, 0), false);
});

test("[AdjacencyMatrixUnweightedUndirected#outEdge] iterates over outgoing edges of a vertex", () => {
  const graph = new AdjacencyMatrixUnweightedUndirected(exampleGraph);
  assertEquals([...graph.outEdges(0)], [1, 2, 3]);
});

test("[AdjacencyMatrixUnweightedUndirected#inEdge] iterates over incoming edges of a vertex", () => {
  const graph = new AdjacencyMatrixUnweightedUndirected(exampleGraph);
  assertEquals([...graph.inEdges(1)], [0]);
  assertEquals([...graph.inEdges(4)], [2]);
  assertEquals([...graph.inEdges(0)], [1, 2, 3]);
});

test("[AdjacencyMatrixUnweightedUndirected#getEdge] returns 1 if edge is set, 0 otherwise", () => {
  const graph = new AdjacencyMatrixUnweightedUndirected(exampleGraph);
  assertEquals(graph.getEdge(0, 1), 1);
  assertEquals(graph.getEdge(1, 0), 1);
  assertEquals(graph.getEdge(0, 5), 0);
});

test("[AdjacencyMatrixUnweightedUndirected.$species] returns underlying TypedArray when sliced", () => {
  assertEquals(
    AdjacencyMatrixUnweightedUndirected[Symbol.species],
    Uint32Array,
  );
});
