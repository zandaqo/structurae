/**
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
   * @returns {BinaryHeap}
   */
  heapify() {
    for (let i = this.length >> 1; i >= 0; i--) {
      this.siftDown(i);
    }
    return this;
  }

  /**
   * @param {number} index
   * @returns {*}
   */
  left(index) {
    return this[this.constructor.getLeftIndex(index)];
  }

  /**
   * @param {number} index
   * @returns {*}
   */
  parent(index) {
    return this[this.constructor.getParentIndex(index)];
  }

  /**
   * @param {...*} items
   * @returns {number}
   */
  push(...items) {
    for (let i = 0; i < items.length; i++) {
      super.push(items[i]);
      this.siftUp(this.length - 1);
    }
    return this.length;
  }

  /**
   * @param {*} item
   * @returns {*}
   */
  replace(item) {
    const first = this[0];
    this[0] = item;
    this.siftDown(0);
    return first;
  }

  /**
   * @param {number} index
   * @returns {*}
   */
  right(index) {
    return this[this.constructor.getRightIndex(index)];
  }

  /**
   * @returns {*}
   */
  shift() { // extract min/max
    const item = this[0];
    this[0] = this.pop();
    this.siftDown(0);
    return item;
  }

  /**
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
   * @param {...*} items
   * @returns {number}
   */
  unshift(...items) {
    return this.push(...items);
  }

  /**
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
   * @param {*} a
   * @param {*} b
   * @returns {boolean}
   */
  static compare(a, b) {
    return a < b;
  }

  /**
   * @param {number} index
   * @returns {number}
   */
  static getLeftIndex(index) {
    return (index << 1) + 1;
  }

  /**
   * @param {number} index
   * @returns {number}
   */
  static getParentIndex(index) {
    return (index - 1) >> 1;
  }

  /**
   * @param {number} index
   * @returns {number}
   */
  static getRightIndex(index) {
    return (index << 1) + 2;
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
