import {
  bench,
  runBenchmarks,
} from "https://deno.land/std@0.95.0/testing/bench.ts";
import { benchmarkReporter, getIndex } from "./helpers.ts";
import { GraphMixin } from "../src/graph.ts";
import { AdjacencyMatrixUnweightedDirected } from "../src/adjacency-matrix-unweighted-directed.ts";
import { AdjacencyMatrixUnweightedUndirected } from "../src/adjacency-matrix-unweighted-undirected.ts";
import { AdjacencyListMixin } from "../src/adjacency-list.ts";
import { AdjacencyMatrixWeightedDirectedMixin } from "../src/adjacency-matrix-weighted-directed.ts";
import { AdjacencyMatrixWeightedUndirectedMixin } from "../src/adjacency-matrix-weighted-undirected.ts";

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

bench({
  name: "[Graph Add/Remove Edge] List Weighted Directed",
  runs: 10000,
  func(b): void {
    b.start();
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
    b.stop();
  },
});

bench({
  name: "[Graph Add/Remove Edge] Matrix Weighted Directed",
  runs: 10000,
  func(b): void {
    b.start();
    for (let i = 0; i < SIZE; i++) {
      matrixWeightedDirected.addEdge(
        getIndex(SIZE),
        getIndex(SIZE),
        getIndex(SIZE),
      );
      matrixWeightedDirected.removeEdge(getIndex(SIZE), getIndex(SIZE));
    }
    b.stop();
  },
});

bench({
  name: "[Graph Add/Remove Edge] Matrix Weighted Undirected",
  runs: 10000,
  func(b): void {
    b.start();
    for (let i = 0; i < SIZE; i++) {
      matrixWeightedUndirected.addEdge(
        getIndex(SIZE),
        getIndex(SIZE),
        getIndex(SIZE),
      );
      matrixWeightedUndirected.removeEdge(getIndex(SIZE), getIndex(SIZE));
    }
    b.stop();
  },
});

bench({
  name: "[Graph Add/Remove Edge] Matrix Unweighted Directed",
  runs: 10000,
  func(b): void {
    b.start();
    for (let i = 0; i < SIZE; i++) {
      matrixUnweightedDirected.addEdge(
        getIndex(SIZE),
        getIndex(SIZE),
        getIndex(SIZE),
      );
      matrixUnweightedDirected.removeEdge(getIndex(SIZE), getIndex(SIZE));
    }
    b.stop();
  },
});

bench({
  name: "[Graph Add/Remove Edge] Matrix Unweighted Undirected",
  runs: 10000,
  func(b): void {
    b.start();
    for (let i = 0; i < SIZE; i++) {
      matrixUnweightedUndirected.addEdge(
        getIndex(SIZE),
        getIndex(SIZE),
        getIndex(SIZE),
      );
      matrixUnweightedUndirected.removeEdge(getIndex(SIZE), getIndex(SIZE));
    }
    b.stop();
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

bench({
  name: "[Graph Traversal] List Weighted Directed",
  runs: 100,
  func(b): void {
    b.start();
    [...listWeightedDirected.traverse(false, getIndex(SIZE))];
    b.stop();
  },
});

bench({
  name: "[Graph Traversal] Matrix Weighted Directed",
  runs: 100,
  func(b): void {
    b.start();
    [...matrixWeightedDirected.traverse(false, getIndex(SIZE))];
    b.stop();
  },
});

bench({
  name: "[Graph Traversal] Matrix Weighted Undirected",
  runs: 100,
  func(b): void {
    b.start();
    [...matrixWeightedUndirected.traverse(false, getIndex(SIZE))];
    b.stop();
  },
});

bench({
  name: "[Graph Traversal] Matrix Unweighted Directed",
  runs: 100,
  func(b): void {
    b.start();
    [...matrixUnweightedDirected.traverse(false, getIndex(SIZE))];
    b.stop();
  },
});

bench({
  name: "[Graph Traversal] Matrix Unweighted Undirected",
  runs: 100,
  func(b): void {
    b.start();
    [...matrixUnweightedUndirected.traverse(false, getIndex(SIZE))];
    b.stop();
  },
});

console.log(`Graph Byte Sizes for 100 vertices:`);
console.log(
  `List Weighted Directed (1000 edges): ${listWeightedDirected.byteLength}`,
);
console.log(
  `List Weighted Directed (10000 edges): ${WeightedList.getLength(100, 10000) *
    4}`,
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

if (import.meta.main) {
  runBenchmarks().then(benchmarkReporter).catch((e) => {
    console.log(e);
  });
}
