import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std@0.98.0/testing/asserts.ts";
import { AdjacencyListMixin } from "../adjacency-list.ts";

const { test } = Deno;

const DirectedList = AdjacencyListMixin(Uint32Array);
const exampleGraph = DirectedList.create(6, 12);
exampleGraph.addEdge(0, 1, 3);
exampleGraph.addEdge(0, 2, 2);
exampleGraph.addEdge(0, 3, 1);
exampleGraph.addEdge(2, 4, 8);
exampleGraph.addEdge(2, 5, 6);

test("[AdjacencyList.constructor] creates a graph of specified dimensions from an existing graph", () => {
  const fromExistingGraph = new DirectedList(exampleGraph);
  assertEquals(fromExistingGraph.vertices, 6);
  assertEquals(fromExistingGraph.length, 31);
  assertEquals(Array.from(fromExistingGraph), Array.from(exampleGraph));
  assertEquals(
    (fromExistingGraph as unknown as Uint32Array).buffer !==
      exampleGraph.buffer,
    true,
  );
});

test("[AdjacencyList.constructor] creates a graph inferring dimensions from an existing array-like object", () => {
  const noDimensions = new DirectedList(Array.from(exampleGraph));
  assertEquals(noDimensions.vertices, 6);
  assertEquals(noDimensions.length, 31);
  assertEquals(Array.from(noDimensions), Array.from(exampleGraph));
});

test("[AdjacencyList.create] creates a graph of specified dimensions", () => {
  const emptyGraph = DirectedList.create(6, 6);
  assertEquals(emptyGraph.vertices, 6);
  assertEquals(emptyGraph.edges, 6);
  assertEquals(emptyGraph.length, 19);
});

test("[AdjacencyList.getLength] returns the length of underlying TypedArray required to hold the graph", () => {
  assertEquals(DirectedList.getLength(50, 50), 151);
});

test("[AdjacencyList#addEdge] adds an edge to a graph", () => {
  const graph = new DirectedList(exampleGraph);
  assertEquals(graph.hasEdge(0, 5), false);
  graph.addEdge(0, 5, 1);
  assertEquals(graph.hasEdge(0, 5), true);
});

test("[AdjacencyList#addEdge] throws RangeError if the list is full", () => {
  const fullGraph = DirectedList.create(2, 2);
  fullGraph.addEdge(0, 1, 1);
  fullGraph.addEdge(1, 0, 1);
  assertThrows(() => fullGraph.addEdge(1, 2, 1), RangeError);
});

test("[AdjacencyList#removeEdge] removes an edge from a graph", () => {
  const graph = new DirectedList(exampleGraph);
  assertEquals(graph.hasEdge(0, 1), true);
  graph.removeEdge(0, 1);
  assertEquals(graph.hasEdge(0, 1), false);
  graph.removeEdge(0, 1);
  graph.removeEdge(1, 5);
});

test("[AdjacencyList#outEdges] iterates over outgoing edges of a vertex", () => {
  const graph = new DirectedList(exampleGraph);
  assertEquals([...graph.outEdges(0)], [1, 2, 3]);
  assertEquals([...graph.outEdges(5)], []);
});

test("[AdjacencyList#inEdges] iterates over incoming edges of a vertex", () => {
  const graph = new DirectedList(exampleGraph);
  assertEquals([...graph.inEdges(1)], [0]);
  assertEquals([...graph.inEdges(4)], [2]);
  assertEquals([...graph.inEdges(0)], []);
});

test("[AdjacencyList#hasEdges] checks whether there is an edge between two given vertices", () => {
  const graph = new DirectedList(exampleGraph);
  assertEquals(graph.hasEdge(0, 1), true);
  assertEquals(graph.hasEdge(0, 5), false);
  assertEquals(graph.hasEdge(2, 5), true);
});

test("[AdjacencyList#isFull] checks if the list is full, i.e. all the edges are set", () => {
  const graph = new DirectedList(exampleGraph);
  assertEquals(graph.isFull(), false);
  const fullGraph = DirectedList.create(2, 2);
  fullGraph.addEdge(0, 1, 1);
  fullGraph.addEdge(1, 0, 1);
  assertEquals(fullGraph.isFull(), true);
});
