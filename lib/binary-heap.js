/**
 * Extends Array to implement the Binary Heap data structure.
 *
 * @extends Array
 */
class BinaryHeap extends Array {
  /**
   * @param {...*} args
   */
  constructor(...args) {
    super(...args);
    this.heapify();
  }

  /**
   * Restores the binary heap.
   *
   * @returns {BinaryHeap}
   */
  heapify() {
    for (let i = this.length >> 1; i >= 0; i--) {
      this.siftDown(i);
    }
    return this;
  }

  /**
   * Checks whether the array is a valid binary heap.
   *
   * @returns {boolean} whether the array is a valid binary heap
   */
  isHeap() {
    return this.constructor.isHeap(this);
  }

  /**
   * Returns the left child of an element at a given index.
   *
   * @param {number} index
   * @returns {*}
   */
  left(index) {
    return this[this.constructor.getLeftIndex(index)];
  }

  /**
   * Returns the parent of an element at a given index.
   *
   * @param {number} index
   * @returns {*}
   */
  parent(index) {
    return this[this.constructor.getParentIndex(index)];
  }

  /**
   * Adds items to the heap.
   *
   * @param {...*} elements
   * @returns {number}
   */
  push(...elements) {
    for (let i = 0; i < elements.length; i++) {
      super.push(elements[i]);
      this.siftUp(this.length - 1);
    }
    return this.length;
  }

  /**
   * Returns the first (min/max) element of the heap and replaces it with a given element.
   *
   * @param {*} element
   * @returns {*}
   */
  replace(element) {
    const first = this[0];
    this[0] = element;
    this.siftDown(0);
    return first;
  }

  /**
   * Returns the right child of an element at a given index.
   *
   * @param {number} index
   * @returns {*}
   */
  right(index) {
    return this[this.constructor.getRightIndex(index)];
  }

  /**
   * Extracts the first element of the heap.
   *
   * @returns {*}
   */
  shift() { // extract min/max
    const item = this[0];
    this[0] = this.pop();
    this.siftDown(0);
    return item;
  }

  /**
   * Changes elements of the heap.
   *
   * @param {...*} args
   * @returns {Array<*>}
   */
  splice(...args) {
    const deletedItems = super.splice(...args);
    const isSingle = deletedItems.length < 2 && args.length < 4;
    if (isSingle) {
      const index = args[0];
      const isReplacement = args.length === 3;
      if (isReplacement) {
        this.update(index);
      } else {
        const last = this.pop();
        super.splice(index, 0, last);
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
   * @param {...*} items
   * @returns {number}
   */
  unshift(...items) {
    return this.push(...items);
  }

  /**
   * Updates the position of an element inside the heap.
   *
   * @param {number} index
   * @returns {void}
   */
  update(index) {
    const { compare, getLeftIndex } = this.constructor;
    const parent = this.parent(index);
    const leftIndex = getLeftIndex(index);
    if (this.has(leftIndex) && (parent === undefined || compare(parent, this[index]))) {
      this.siftDown(index);
    } else {
      this.siftUp(index);
    }
  }

  /**
   * @private
   * @param {number} index
   * @returns {boolean}
   */
  has(index) {
    return index >= 0 && index < this.length;
  }

  /**
   * @private
   * @param {number} start
   * @returns {void}
   */
  siftDown(start) {
    const { getRightIndex, getLeftIndex, compare } = this.constructor;
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

  /**
   * @private
   * @param {number} start
   * @returns {void}
   */
  siftUp(start) {
    const { getParentIndex, compare } = this.constructor;
    let index = start;
    let parentIndex = getParentIndex(index);
    while (this.has(parentIndex) && !compare(this[parentIndex], this[index])) {
      [this[index], this[parentIndex]] = [this[parentIndex], this[index]];
      index = parentIndex;
      parentIndex = getParentIndex(index);
    }
  }

  /**
   * @private
   */
  static get [Symbol.species]() {
    return Array;
  }

  /**
   * The comparator function used by the heap.
   *
   * @param {*} a
   * @param {*} b
   * @returns {boolean}
   */
  static compare(a, b) {
    return a < b;
  }

  /**
   * Creates a new BinaryHeap from a given array-like object.
   *
   * @param {*} arrayLike an array-like object to convert to a heap
   * @param {Function} mapFn a map function to call on every element of the array
   * @param {Object} thisArg the value to use as `this` when invoking the `mapFn`
   * @returns {SortedCollection} a new BinaryHeap
   */
  static from(arrayLike, mapFn, thisArg) {
    return super.from(arrayLike, mapFn, thisArg).heapify();
  }

  /**
   * @private
   * @param {number} index
   * @returns {number}
   */
  static getLeftIndex(index) {
    return (index << 1) + 1;
  }

  /**
   * @private
   * @param {number} index
   * @returns {number}
   */
  static getParentIndex(index) {
    return (index - 1) >> 1;
  }

  /**
   * @private
   * @param {number} index
   * @returns {number}
   */
  static getRightIndex(index) {
    return (index << 1) + 2;
  }

  /**
   * Checks if a given collection is a valid binary heap.
   *
   * @param {Collection} heap
   * @returns {boolean}
   */
  static isHeap(heap) {
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
   * @param {...*} elements the elements of which to create the heap
   * @returns {SortedCollection} the new BinaryHeap
   */
  static of(...elements) {
    return super.of(...elements).heapify();
  }
}

module.exports = BinaryHeap;
