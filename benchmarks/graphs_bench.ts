import { getIndex } from "./helpers.ts";
import { GraphMixin } from "../graph.ts";
import { AdjacencyMatrixUnweightedDirected } from "../adjacency-matrix-unweighted-directed.ts";
import { AdjacencyMatrixUnweightedUndirected } from "../adjacency-matrix-unweighted-undirected.ts";
import { AdjacencyListMixin } from "../adjacency-list.ts";
import { AdjacencyMatrixWeightedDirectedMixin } from "../adjacency-matrix-weighted-directed.ts";
import { AdjacencyMatrixWeightedUndirectedMixin } from "../adjacency-matrix-weighted-undirected.ts";

const WeightedList = GraphMixin(AdjacencyListMixin(Int32Array));
const WeightedDirectedMatrix = GraphMixin(
  AdjacencyMatrixWeightedDirectedMixin(Int32Array),
);
const WeightedUndirectedMatrix = GraphMixin(
  AdjacencyMatrixWeightedUndirectedMixin(Int32Array),
);
const UnweightedDirectedMatrix = GraphMixin(AdjacencyMatrixUnweightedDirected);
const UnweightedUndirectedMatrix = GraphMixin(
  AdjacencyMatrixUnweightedUndirected,
);

const SIZE = 100;
let listWeightedDirected = WeightedList.create(SIZE, SIZE * 10);
let matrixWeightedDirected = WeightedDirectedMatrix.create(SIZE);
let matrixWeightedUndirected = WeightedUndirectedMatrix.create(SIZE);
let matrixUnweightedDirected = UnweightedDirectedMatrix.create(SIZE);
let matrixUnweightedUndirected = UnweightedUndirectedMatrix.create(SIZE);

Deno.bench({
  name: "List Weighted Directed",
  group: "Graph Add/Remove Edge",
  fn() {
    for (let i = 0; i < SIZE; i++) {
      if (!listWeightedDirected.isFull()) {
        listWeightedDirected.addEdge(
          getIndex(SIZE),
          getIndex(SIZE),
          getIndex(SIZE),
        );
      }
      listWeightedDirected.removeEdge(getIndex(SIZE), getIndex(SIZE));
    }
  },
});

Deno.bench({
  name: "[Graph Add/Remove Edge] Matrix Weighted Directed",
  group: "Graph Add/Remove Edge",
  baseline: true,
  fn() {
    for (let i = 0; i < SIZE; i++) {
      matrixWeightedDirected.addEdge(
        getIndex(SIZE),
        getIndex(SIZE),
        getIndex(SIZE),
      );
      matrixWeightedDirected.removeEdge(getIndex(SIZE), getIndex(SIZE));
    }
  },
});

Deno.bench({
  name: "Matrix Weighted Undirected",
  group: "Graph Add/Remove Edge",
  fn() {
    for (let i = 0; i < SIZE; i++) {
      matrixWeightedUndirected.addEdge(
        getIndex(SIZE),
        getIndex(SIZE),
        getIndex(SIZE),
      );
      matrixWeightedUndirected.removeEdge(getIndex(SIZE), getIndex(SIZE));
    }
  },
});

Deno.bench({
  name: "Matrix Unweighted Directed",
  group: "Graph Add/Remove Edge",
  fn() {
    for (let i = 0; i < SIZE; i++) {
      matrixUnweightedDirected.addEdge(
        getIndex(SIZE),
        getIndex(SIZE),
        getIndex(SIZE),
      );
      matrixUnweightedDirected.removeEdge(getIndex(SIZE), getIndex(SIZE));
    }
  },
});

Deno.bench({
  name: "Matrix Unweighted Undirected",
  group: "Graph Add/Remove Edge",
  fn() {
    for (let i = 0; i < SIZE; i++) {
      matrixUnweightedUndirected.addEdge(
        getIndex(SIZE),
        getIndex(SIZE),
        getIndex(SIZE),
      );
      matrixUnweightedUndirected.removeEdge(getIndex(SIZE), getIndex(SIZE));
    }
  },
});

listWeightedDirected = WeightedList.create(SIZE, SIZE * 10);
matrixWeightedDirected = WeightedDirectedMatrix.create(SIZE);
matrixWeightedUndirected = WeightedUndirectedMatrix.create(SIZE);
matrixUnweightedDirected = UnweightedDirectedMatrix.create(SIZE);
matrixUnweightedUndirected = UnweightedUndirectedMatrix.create(SIZE);

for (let i = 0; i < 1000; i++) {
  const [x, y, w] = [getIndex(SIZE), getIndex(SIZE), getIndex(SIZE)];
  if (!listWeightedDirected.isFull()) {
    listWeightedDirected.addEdge(x, y, w);
    matrixWeightedDirected.addEdge(x, y, w);
    matrixWeightedUndirected.addEdge(x, y, w);
    matrixUnweightedDirected.addEdge(x, y);
    matrixUnweightedUndirected.addEdge(x, y);
  }
}

Deno.bench({
  name: "List Weighted Directed",
  group: "Graph Traversal",
  fn() {
    [...listWeightedDirected.traverse(false, getIndex(SIZE))];
  },
});

Deno.bench({
  name: "[Graph Traversal] Matrix Weighted Directed",
  group: "Graph Traversal",
  baseline: true,
  fn() {
    [...matrixWeightedDirected.traverse(false, getIndex(SIZE))];
  },
});

Deno.bench({
  name: "Matrix Weighted Undirected",
  group: "Graph Traversal",
  fn() {
    [...matrixWeightedUndirected.traverse(false, getIndex(SIZE))];
  },
});

Deno.bench({
  name: "Matrix Unweighted Directed",
  group: "Graph Traversal",
  fn() {
    [...matrixUnweightedDirected.traverse(false, getIndex(SIZE))];
  },
});

Deno.bench({
  name: "Matrix Unweighted Undirected",
  group: "Graph Traversal",
  fn() {
    [...matrixUnweightedUndirected.traverse(false, getIndex(SIZE))];
  },
});

console.log(`Graph Byte Sizes for 100 vertices:`);
console.log(
  `List Weighted Directed (1000 edges): ${listWeightedDirected.byteLength}`,
);
console.log(
  `List Weighted Directed (10000 edges): ${
    WeightedList.getLength(100, 10000) *
    4
  }`,
);
console.log(
  `Matrix Weighted Directed: ${matrixWeightedDirected.byteLength}`,
);
console.log(
  `Matrix Weighted Undirected: ${matrixWeightedUndirected.byteLength}`,
);
console.log(
  `Matrix Unweighted Directed: ${matrixUnweightedDirected.byteLength}`,
);
console.log(
  `Matrix Unweighted Undirected: ${matrixUnweightedUndirected.byteLength}`,
);
