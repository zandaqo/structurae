/**
 * Extends Array to implement the Binary Heap data structure.
 * // TODO (docs) document priority queue operations
 * // todo add heapsort?
 */
export class BinaryHeap<T> extends Array<T> {
  // deno-lint-ignore no-explicit-any
  constructor(...args: any[]) {
    super(...args);
    this.heapify();
  }

  static get [Symbol.species](): ArrayConstructor {
    return Array;
  }

  /**
   * The comparator function used by the heap.
   *
   * @param a first value to compare
   * @param b second value to compare
   * @return whether first value is less than the second
   */
  static compare(a: unknown, b: unknown): boolean {
    return <number> a < <number> b;
  }

  /**
   * Creates a new BinaryHeap from a given array-like object.
   */
  static from<T>(iterable: Iterable<T> | ArrayLike<T>): BinaryHeap<T>;
  static from<T, U>(
    iterable: Iterable<T> | ArrayLike<T>,
    mapfn?: (v: T, k: number) => U,
    thisArg?: unknown,
  ): BinaryHeap<U> {
    return ((mapfn !== undefined
      ? super.from(iterable, mapfn, thisArg)
      : super.from(iterable)) as BinaryHeap<U>).heapify();
  }

  /**
   * Get left child index from parent index.
   *
   * @param index the parent index
   * @return the index of the left child
   */
  static getLeftIndex(index: number): number {
    return (index << 1) + 1;
  }

  /**
   * Get left child index from parent index.
   *
   * @param index the child index
   * @return the index of the parent
   */
  static getParentIndex(index: number): number {
    return (index - 1) >> 1;
  }

  /**
   * Get right child index from parent index.
   *
   * @param index the parent index
   * @return the index of the right child
   */
  static getRightIndex(index: number): number {
    return (index << 1) + 2;
  }

  /**
   * Checks if a given collection is a valid binary heap.
   */
  static isHeap<T>(heap: ArrayLike<T>): boolean {
    for (let i = heap.length - 1; i > -1; i--) {
      const parentIndex = this.getParentIndex(i);
      if (parentIndex < 0) break;
      if (!this.compare(heap[parentIndex], heap[i])) return false;
    }
    return true;
  }

  /**
   * Creates a new BinaryHeap with a variable number of arguments,
   * regardless of number or type of the arguments.
   *
   * @param elements the elements of which to create the heap
   * @return the new BinaryHeap
   */
  static of<T>(...elements: Array<T>): BinaryHeap<T> {
    return (super.of(...elements) as BinaryHeap<T>).heapify();
  }

  /**
   * Check whether the index is whithin the heap.
   */
  has(index: number): boolean {
    return index >= 0 && index < this.length;
  }

  /**
   * Restores the binary heap.
   */
  heapify(): this {
    for (let i = this.length >> 1; i >= 0; i--) {
      this.siftDown(i);
    }
    return this;
  }

  /**
   * Checks whether the array is a valid binary heap.
   */
  isHeap(): boolean {
    return (this.constructor as typeof BinaryHeap).isHeap(this);
  }

  /**
   * Returns the left child of an element at a given index.
   */
  left(index: number): T {
    return this[(this.constructor as typeof BinaryHeap).getLeftIndex(index)];
  }

  /**
   * Returns the parent of an element at a given index.
   */
  parent(index: number): T {
    return this[(this.constructor as typeof BinaryHeap).getParentIndex(index)];
  }

  /**
   * Adds items to the heap.
   *
   * @param elements items to add
   * @return new length of the heap
   */
  push(...elements: Array<T>): number {
    for (let i = 0; i < elements.length; i++) {
      super.push(elements[i]);
      this.siftUp(this.length - 1);
    }
    return this.length;
  }

  /**
   * Returns the first (min/max) element of the heap and replaces it with a given element.
   *
   * @param element the element to replace the first element of the heap
   * @return the first element of the heap
   */
  replace(element: T): T {
    const first = this[0];
    this[0] = element;
    this.siftDown(0);
    return first;
  }

  /**
   * Returns the right child of an element at a given index.
   */
  right(index: number): T {
    return this[(this.constructor as typeof BinaryHeap).getRightIndex(index)];
  }

  /**
   * Extracts the first element of the heap.
   */
  shift(): T | undefined {
    // extract min/max
    if (this.length < 2) return this.pop();
    const item = this[0];
    this[0] = this.pop() as T;
    this.siftDown(0);
    return item;
  }

  siftDown(start: number): void {
    const { getRightIndex, getLeftIndex, compare } = this
      .constructor as typeof BinaryHeap;
    let index = start;
    let leftIndex = getLeftIndex(index);
    let rightIndex = getRightIndex(index);
    let nextIndex;
    while (this.has(leftIndex)) {
      if (this.has(rightIndex) && compare(this[rightIndex], this[leftIndex])) {
        nextIndex = rightIndex;
      } else {
        nextIndex = leftIndex;
      }

      if (compare(this[index], this[nextIndex])) break;
      [this[index], this[nextIndex]] = [this[nextIndex], this[index]];
      index = nextIndex;
      leftIndex = getLeftIndex(index);
      rightIndex = getRightIndex(index);
    }
  }

  siftUp(start: number): void {
    const { getParentIndex, compare } = this.constructor as typeof BinaryHeap;
    let index = start;
    let parentIndex = getParentIndex(index);
    while (this.has(parentIndex) && !compare(this[parentIndex], this[index])) {
      [this[index], this[parentIndex]] = [this[parentIndex], this[index]];
      index = parentIndex;
      parentIndex = getParentIndex(index);
    }
  }

  /**
   * Changes elements of the heap.
   *
   * @param start starting index
   * @param deleteCount the amount of elements to delete
   * @param items elements to add
   * @return the deleted elements
   */
  splice(start: number, deleteCount?: number, ...items: Array<T>): Array<T> {
    const deletedItems = deleteCount === undefined
      ? super.splice(start)
      : super.splice(start, deleteCount, ...items);
    const isSingle = deletedItems.length < 2 && items.length < 2;
    if (isSingle) {
      const index = start;
      const isReplacement = items.length === 1;
      if (isReplacement) {
        this.update(index);
      } else {
        const last = this.pop();
        super.splice(index, 0, last as T);
        this.siftDown(index);
      }
    } else {
      this.heapify();
    }
    return deletedItems;
  }

  /**
   * Adds elements to the heap.
   *
   * @param items elements to add
   * @return the new length of the heap
   */
  unshift(...items: Array<T>): number {
    return this.push(...items);
  }

  /**
   * Updates the position of an element inside the heap.
   *
   * @param index the index of the element to update
   */
  update(index: number): void {
    const { compare, getLeftIndex } = this.constructor as typeof BinaryHeap;
    const parent = this.parent(index);
    const leftIndex = getLeftIndex(index);
    if (
      this.has(leftIndex) &&
      (parent === undefined || compare(parent, this[index]))
    ) {
      this.siftDown(index);
    } else {
      this.siftUp(index);
    }
  }
}
