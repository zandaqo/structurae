import { getIndex } from "./helpers.ts";
import { SortedArray } from "../sorted-array.ts";
import { BinaryHeap } from "../binary-heap.ts";

Deno.bench({
  name: "[Sorted Push One] Heap",
  group: "Sorted Push One",
  baseline: true,
  fn() {
    const heap = new BinaryHeap();
    for (let i = 0; i < 100; i++) {
      heap.push(getIndex(100));
    }
  },
});

Deno.bench({
  name: "[Sorted Push One] SortedArray",
  group: "Sorted Push One",
  fn() {
    const array = new SortedArray();
    for (let i = 0; i < 100; i++) {
      array.push(getIndex(100));
    }
  },
});

Deno.bench({
  name: "[Sorted Push One] Native",
  group: "Sorted Push One",
  fn() {
    const array = [];
    for (let i = 0; i < 100; i++) {
      array.push(getIndex(100));
      array.sort();
    }
  },
});

Deno.bench({
  name: "[Sorted Push Many] Heap",
  group: "Sorted Push Many",
  baseline: true,
  fn() {
    const heap = new BinaryHeap();
    for (let i = 0; i < 100; i++) {
      const random = getIndex(100);
      heap.push(random, random >> 1, random << 1, random - 3, random + 1);
    }
  },
});

Deno.bench({
  name: "[Sorted Push Many] SortedArray",
  group: "Sorted Push Many",
  fn() {
    const array = new SortedArray();
    for (let i = 0; i < 100; i++) {
      const random = getIndex(100);
      array.push(random, random >> 1, random << 1, random - 3, random + 1);
    }
  },
});

Deno.bench({
  name: "[Sorted Push Many] Native",
  group: "Sorted Push Many",
  fn() {
    const array = [];
    for (let i = 0; i < 100; i++) {
      const random = getIndex(100);
      array.push(random, random >> 1, random << 1, random - 3, random + 1);
      array.sort();
    }
  },
});
