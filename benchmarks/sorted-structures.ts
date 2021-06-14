import {
  bench,
  runBenchmarks,
} from "https://deno.land/std@0.95.0/testing/bench.ts";
import { benchmarkReporter, getIndex } from "./helpers.ts";
import { SortedArray } from "../sorted-array.ts";
import { BinaryHeap } from "../binary-heap.ts";

bench({
  name: "[Sorted Push One] Heap",
  runs: 1000,
  func(b): void {
    b.start();
    const heap = new BinaryHeap();
    for (let i = 0; i < 100; i++) {
      heap.push(getIndex(100));
    }
    b.stop();
  },
});

bench({
  name: "[Sorted Push One] SortedArray",
  runs: 1000,
  func(b): void {
    b.start();
    const array = new SortedArray();
    for (let i = 0; i < 100; i++) {
      array.push(getIndex(100));
    }
    b.stop();
  },
});

bench({
  name: "[Sorted Push One] Native",
  runs: 1000,
  func(b): void {
    b.start();
    const array = [];
    for (let i = 0; i < 100; i++) {
      array.push(getIndex(100));
      array.sort();
    }
    b.stop();
  },
});

bench({
  name: "[Sorted Push Many] Heap",
  runs: 1000,
  func(b): void {
    b.start();
    const heap = new BinaryHeap();
    for (let i = 0; i < 100; i++) {
      const random = getIndex(100);
      heap.push(random, random >> 1, random << 1, random - 3, random + 1);
    }
    b.stop();
  },
});

bench({
  name: "[Sorted Push Many] SortedArray",
  runs: 1000,
  func(b): void {
    b.start();
    const array = new SortedArray();
    for (let i = 0; i < 100; i++) {
      const random = getIndex(100);
      array.push(random, random >> 1, random << 1, random - 3, random + 1);
    }
    b.stop();
  },
});

bench({
  name: "[Sorted Push Many] Native",
  runs: 1000,
  func(b): void {
    b.start();
    const array = [];
    for (let i = 0; i < 100; i++) {
      const random = getIndex(100);
      array.push(random, random >> 1, random << 1, random - 3, random + 1);
      array.sort();
    }
    b.stop();
  },
});

if (import.meta.main) {
  runBenchmarks().then(benchmarkReporter).catch((e) => {
    console.log(e);
  });
}
