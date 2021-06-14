import { BinaryHeap } from "../binary-heap.ts";
import { assertEquals } from "https://deno.land/std@0.98.0/testing/asserts.ts";

const { test } = Deno;

test("[BinaryHeap.constructor] creates a new binary heap with given data", () => {
  const heap = new BinaryHeap(10, 1, 20, 3, 9, 8);
  assertEquals(heap, [1, 3, 8, 10, 9, 20]);
});

test("[BinaryHeap#heapify] restores the binary heap", () => {
  const heap = new BinaryHeap(10, 1, 20, 3, 9, 8);
  heap[0] = 100;
  heap[1] = -2;
  assertEquals(heap, [100, -2, 8, 10, 9, 20]);
  heap.heapify();
  assertEquals(heap, [-2, 9, 8, 10, 100, 20]);
});

test("[BinaryHeap#isHeap] checks whether the array is a valid binary heap", () => {
  const heap = new BinaryHeap(10, 1, 20, 3, 9, 8);
  assertEquals(heap.isHeap(), true);
  heap[0] = 100;
  assertEquals(heap.isHeap(), false);
});

test("[BinaryHeap#left] returns the left child of a element at the given index", () => {
  const heap = new BinaryHeap(10, 1, 20, 3, 9, 8);
  assertEquals(heap.left(1), 10);
});

test("[BinaryHeap#parent] returns the parent of an element at a given index", () => {
  const heap = new BinaryHeap(10, 1, 20, 3, 9, 8);
  assertEquals(heap.parent(1), 1);
});

test("[BinaryHeap#push] adds items to the heap", () => {
  const heap = new BinaryHeap();
  heap.push(10, 1, 20, 3, 9, 8);
  assertEquals(heap, [1, 3, 8, 10, 9, 20]);
});

test("[BinaryHeap#replace] returns the first (min/max) element of the heap and replaces it with a given element", () => {
  const heap = new BinaryHeap(10, 1, 20, 3, 9, 8);
  const head = heap.replace(0);
  assertEquals(head, 1);
  assertEquals(heap, [0, 3, 8, 10, 9, 20]);
});

test("[BinaryHeap#right] returns the right child of an element at a given index", () => {
  const heap = new BinaryHeap(10, 1, 20, 3, 9, 8);
  assertEquals(heap.right(1), 9);
});

test("[BinaryHeap#shift] extracts the first element of the heap", () => {
  const heap = new BinaryHeap();
  heap.push(10, 1, 20, 3, 9, 8);
  const min = heap.shift();
  assertEquals(min, 1);
  assertEquals(heap, [3, 9, 8, 10, 20]);
});

test("[BinaryHeap#shift] extracts the only element of the heap", () => {
  const heap = new BinaryHeap();
  heap.push(1);
  const min = heap.shift();
  assertEquals(min, 1);
  assertEquals(heap.length, 0);
});

test("[BinaryHeap#splice] changes elements of the heap", () => {
  const heap = new BinaryHeap<number>();
  heap.push(10, 1, 20, 3, 9, 8);
  heap.splice(0, 1);
  assertEquals(heap, [3, 9, 8, 10, 20]);
  heap.splice(0, 0, 1);
  assertEquals(heap, [1, 3, 9, 8, 10, 20]);
  heap.splice(4);
  assertEquals(heap, [1, 3, 9, 8]);
  heap.push(4, 2, 7);
  assertEquals(heap, [1, 3, 2, 8, 4, 9, 7]);
  const deleted = heap.splice(3, 2, 0, 6);
  assertEquals(heap, [0, 1, 2, 3, 6, 9, 7]);
  assertEquals(deleted, [8, 4]);
});

test("[BinaryHeap#unshift] adds elements to the heap", () => {
  const heap = new BinaryHeap(10, 1, 20, 3, 9, 8);
  heap.unshift(0, 12);
  assertEquals(heap, [0, 3, 1, 10, 9, 20, 8, 12]);
});

test("[BinaryHeap#update] updates the position of an element inside the heap", () => {
  const heap = new BinaryHeap(10, 1, 20, 3, 9, 8);
  heap[1] = 21;
  heap.update(1);
  assertEquals(heap, [1, 9, 8, 10, 21, 20]);
  heap[5] = -1;
  heap.update(5);
  assertEquals(heap, [-1, 9, 1, 10, 21, 8]);
});

test("[BinaryHeap.from] creates a binary heap from a given array-like object", () => {
  const heap = BinaryHeap.from([10, 9, 8, 0, 3, 8, 9, 5, 6, 4]);
  assertEquals(heap, [0, 3, 8, 5, 4, 8, 9, 9, 6, 10]);
});

test("[BinaryHeap.of] creates a binary heap from a given arguments", () => {
  const heap = BinaryHeap.of(10, 9, 8, 0, 3, 8, 9, 5, 6, 4);
  assertEquals(heap, [0, 3, 8, 5, 4, 8, 9, 9, 6, 10]);
});
