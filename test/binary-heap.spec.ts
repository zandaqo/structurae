import { BinaryHeap } from '../src/binary-heap';

describe('Heap', () => {
  describe('constructor', () => {
    it('creates a new binary heap with given data', () => {
      const heap = new BinaryHeap(10, 1, 20, 3, 9, 8);
      expect(heap).toEqual([1, 3, 8, 10, 9, 20]);
    });
  });

  describe('heapify', () => {
    it('restores the binary heap', () => {
      const heap = new BinaryHeap(10, 1, 20, 3, 9, 8);
      heap[0] = 100;
      heap[1] = -2;
      expect(heap).toEqual([100, -2, 8, 10, 9, 20]);
      heap.heapify();
      expect(heap).toEqual([-2, 9, 8, 10, 100, 20]);
    });
  });

  describe('isHeap', () => {
    it('checks whether the array is a valid binary heap', () => {
      const heap = new BinaryHeap(10, 1, 20, 3, 9, 8);
      expect(heap.isHeap()).toBe(true);
      heap[0] = 100;
      expect(heap.isHeap()).toBe(false);
    });
  });

  describe('left', () => {
    it('returns the left child of a element at the given index', () => {
      const heap = new BinaryHeap(10, 1, 20, 3, 9, 8);
      expect(heap.left(1)).toBe(10);
    });
  });

  describe('parent', () => {
    it('returns the parent of an element at a given index', () => {
      const heap = new BinaryHeap(10, 1, 20, 3, 9, 8);
      expect(heap.parent(1)).toBe(1);
    });
  });

  describe('push', () => {
    it('adds items to the heap', () => {
      const heap = new BinaryHeap();
      heap.push(10, 1, 20, 3, 9, 8);
      expect(heap).toEqual([1, 3, 8, 10, 9, 20]);
    });
  });

  describe('replace', () => {
    it('returns the first (min/max) element of the heap and replaces it with a given element', () => {
      const heap = new BinaryHeap(10, 1, 20, 3, 9, 8);
      const head = heap.replace(0);
      expect(head).toBe(1);
      expect(heap).toEqual([0, 3, 8, 10, 9, 20]);
    });
  });

  describe('right', () => {
    it('returns the right child of an element at a given index', () => {
      const heap = new BinaryHeap(10, 1, 20, 3, 9, 8);
      expect(heap.right(1)).toBe(9);
    });
  });

  describe('shift', () => {
    it('extracts the first element of the heap', () => {
      const heap = new BinaryHeap();
      heap.push(10, 1, 20, 3, 9, 8);
      const min = heap.shift();
      expect(min).toBe(1);
      expect(heap).toEqual([3, 9, 8, 10, 20]);
    });

    it('extracts the only element of the heap', () => {
      const heap = new BinaryHeap();
      heap.push(1);
      const min = heap.shift();
      expect(min).toBe(1);
      expect(heap.length).toBe(0);
    });
  });

  describe('splice', () => {
    it('changes elements of the heap', () => {
      const heap = new BinaryHeap<number>();
      heap.push(10, 1, 20, 3, 9, 8);
      heap.splice(0, 1);
      expect(heap).toEqual([3, 9, 8, 10, 20]);
      heap.splice(0, 0, 1);
      expect(heap).toEqual([1, 3, 9, 8, 10, 20]);
      heap.splice(4);
      expect(heap).toEqual([1, 3, 9, 8]);
      heap.push(4, 2, 7);
      expect(heap).toEqual([1, 3, 2, 8, 4, 9, 7]);
      const deleted = heap.splice(3, 2, 0, 6);
      expect(heap).toEqual([0, 1, 2, 3, 6, 9, 7]);
      expect(deleted).toEqual([8, 4]);
    });
  });

  describe('unshift', () => {
    it('adds elements to the heap', () => {
      const heap = new BinaryHeap(10, 1, 20, 3, 9, 8);
      heap.unshift(0, 12);
      expect(heap).toEqual([0, 3, 1, 10, 9, 20, 8, 12]);
    });
  });

  describe('update', () => {
    it('updates the position of an element inside the heap', () => {
      const heap = new BinaryHeap(10, 1, 20, 3, 9, 8);
      heap[1] = 21;
      heap.update(1);
      expect(heap).toEqual([1, 9, 8, 10, 21, 20]);
      heap[5] = -1;
      heap.update(5);
      expect(heap).toEqual([-1, 9, 1, 10, 21, 8]);
    });
  });

  describe('from', () => {
    it('creates a binary heap from a given array-like object', () => {
      const heap = BinaryHeap.from([10, 9, 8, 0, 3, 8, 9, 5, 6, 4]);
      expect(heap).toEqual([0, 3, 8, 5, 4, 8, 9, 9, 6, 10]);
    });
  });

  describe('of', () => {
    it('creates a binary heap from a given arguments', () => {
      const heap = BinaryHeap.of(10, 9, 8, 0, 3, 8, 9, 5, 6, 4);
      expect(heap).toEqual([0, 3, 8, 5, 4, 8, 9, 9, 6, 10]);
    });
  });
});
