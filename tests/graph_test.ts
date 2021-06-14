import { GraphMixin } from "../graph.ts";
import { AdjacencyMatrixUnweightedDirected } from "../adjacency-matrix-unweighted-directed.ts";
import { AdjacencyMatrixUnweightedUndirected } from "../adjacency-matrix-unweighted-undirected.ts";
import { AdjacencyListMixin } from "../adjacency-list.ts";
import { AdjacencyMatrixWeightedDirectedMixin } from "../adjacency-matrix-weighted-directed.ts";
import { AdjacencyMatrixWeightedUndirectedMixin } from "../adjacency-matrix-weighted-undirected.ts";
import { assertEquals } from "https://deno.land/std@0.98.0/testing/asserts.ts";

const { test } = Deno;
const Graphs = [
  ["WeightedList", GraphMixin(AdjacencyListMixin(Int32Array))],
  [
    "WeightedDirectedMatrix",
    GraphMixin(AdjacencyMatrixWeightedDirectedMixin(Int32Array)),
  ],
  [
    "WeightedUndirectedMatrix",
    GraphMixin(AdjacencyMatrixWeightedUndirectedMixin(Int32Array)),
  ],
  ["UnweightedDirectedMatrix", GraphMixin(AdjacencyMatrixUnweightedDirected)],
  [
    "UnweightedUndirectedMatrix",
    GraphMixin(AdjacencyMatrixUnweightedUndirected),
  ],
] as const;

for (const [GraphType, GraphClass] of Graphs) {
  const exampleGraph = GraphClass.create(6, 12);
  exampleGraph.addEdge(0, 1, 3);
  exampleGraph.addEdge(0, 2, 2);
  exampleGraph.addEdge(0, 3, 1);
  exampleGraph.addEdge(2, 4, 8);
  exampleGraph.addEdge(2, 5, 6);

  test(`[${GraphType}#traverse] does a Breadth First Search on the graph`, () => {
    const bfs = [...exampleGraph.traverse()];
    assertEquals(bfs, [0, 1, 2, 3, 4, 5]);
  });

  test(`[${GraphType}#traverse] does a Depth First Search on the graph if \`isDFS=true\``, () => {
    const dfs = [...exampleGraph.traverse(true)];
    assertEquals(dfs, [0, 3, 2, 5, 4, 1]);
  });

  test(`[${GraphType}#traverse] yields edging vertices if \`white=true\``, () => {
    const bfs = [...exampleGraph.traverse(false, 0, false, true)];
    assertEquals(
      bfs,
      !GraphClass.directed ? [1, 2, 3, 0, 0, 4, 5, 0, 2, 2] : [1, 2, 3, 4, 5],
    );
  });

  test(`[${GraphType}#traverse] yields fully processed vertices if \`black=true\``, () => {
    const bfs = [...exampleGraph.traverse(false, 0, false, false, true)];
    assertEquals(bfs, [0, 1, 2, 3, 4, 5]);
  });

  test(`[${GraphType}#path] finds the shortest path between two vertices`, () => {
    const path = exampleGraph.path(0, 5);
    assertEquals(path, [0, 2, 5]);
  });

  test(`[${GraphType}#path] returns an empty array if no path is found`, () => {
    const graph = new GraphClass(exampleGraph);
    if (!GraphClass.directed) graph.removeEdge(0, 3);
    const path = graph.path(3, 5);
    assertEquals(path, []);
  });

  if (GraphClass.weighted && GraphClass.directed) {
    test(`[${GraphType}#path] finds the shortest path between two vertices for DAGs`, () => {
      const graph = new GraphClass(exampleGraph);
      graph.addEdge(3, 5, -1);
      assertEquals(graph.path(0, 5, true), [0, 3, 5]);
      assertEquals(graph.path(0, 4, true), [0, 2, 4]);
      assertEquals(graph.path(1, 4, true), []);
    });

    test(`[${GraphType}#path] finds the shortest path between two vertices with non-negative edges`, () => {
      const graph = new GraphClass(exampleGraph);
      graph.addEdge(4, 0, 8);
      assertEquals(graph.path(0, 5, false, true), [0, 2, 5]);
      graph.addEdge(1, 5, 1);
      assertEquals(graph.path(0, 5, false, true), [0, 1, 5]);
      assertEquals(graph.path(3, 5, false, true), []);
    });

    test(`[${GraphType}#path] finds the shortest path between two vertices for any graph`, () => {
      const graph = new GraphClass(exampleGraph);
      graph.addEdge(4, 0, 8);
      graph.addEdge(3, 5, -1);
      assertEquals(graph.path(0, 5), [0, 3, 5]);
      assertEquals(graph.path(2, 5), [2, 5]);
      assertEquals(graph.path(1, 5), []);
    });
  }

  if (GraphClass.directed) {
    test(`[${GraphType}#isAcyclic] checks whether the graph is acyclic`, () => {
      const graph = new GraphClass(exampleGraph);
      assertEquals(graph.isAcyclic(), true);
      graph.addEdge(1, 0, 1);
      assertEquals(graph.isAcyclic(), false);
      graph.removeEdge(1, 0);
      assertEquals(graph.isAcyclic(), true);
      graph.addEdge(5, 0, 1);
      assertEquals(graph.isAcyclic(), false);
      graph.removeEdge(5, 0);
      assertEquals(graph.isAcyclic(), true);
      graph.addEdge(5, 3, 1).addEdge(3, 2, 1);
      assertEquals(graph.isAcyclic(), false);
    });
  }

  test(`[${GraphType}#topologicalSort] returns a list of vertices sorted topologically`, () => {
    const graph = new GraphClass(exampleGraph);
    assertEquals(graph.topologicalSort(), [1, 4, 5, 2, 3, 0]);
  });

  test(`[${GraphType}#tree]returns a spanning tree of the graph`, () => {
    const graph = new GraphClass(exampleGraph);
    assertEquals(graph.tree(), [-1, 0, 0, 0, 2, 2]);
    graph.addEdge(0, 5, 1);
    assertEquals(
      graph.tree(),
      GraphClass.weighted ? [-1, 0, 0, 0, 2, 0] : [-1, 0, 0, 0, 2, 2],
    );
    graph.addEdge(3, 4, 1);
    assertEquals(
      graph.tree(),
      GraphClass.weighted ? [-1, 0, 0, 0, 3, 0] : [-1, 0, 0, 0, 3, 2],
    );
    graph.addEdge(5, 2, 2);
    assertEquals(
      graph.tree(),
      GraphClass.weighted ? [-1, 0, 5, 0, 3, 0] : [-1, 0, 0, 0, 3, 2],
    );
  });
}
