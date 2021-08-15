import type { IndexedCollection } from "./utility-types.ts";

export type Comparator<T> = (a: T, b: T) => -1 | 0 | 1;

/**
 * Extends Array to handle sorted data.
 */
export class SortedArray<ItemType> extends Array<ItemType> {
  unique = false;

  /**
   * The default comparator.
   *
   * @param a the first value
   * @param b the second value
   * @throws RangeError if the comparison is unstable
   *
   */
  static compare<T>(a: T, b: T): -1 | 0 | 1 {
    if (a > b) return 1;
    if (a < b) return -1;
    if (a === b) return 0;
    throw new RangeError("Unstable comparison.");
  }

  /**
   * Creates a new SortedArray from a given array-like object.
   */
  static from<T>(iterable: Iterable<T> | ArrayLike<T>): SortedArray<T>;

  static from<T, U>(
    iterable: Iterable<T> | ArrayLike<T>,
    mapfn?: (v: T, k: number) => U,
    thisArg?: unknown,
  ): SortedArray<U> {
    const result =
      (mapfn !== undefined
        ? super.from(iterable, mapfn, thisArg)
        : super.from(iterable)) as SortedArray<U>;
    result.sort();
    return result;
  }

  /**
   * Returns the difference of two sorted arrays,
   * i.e. elements present in the first array but not in the second array.
   * If `symmetric=true` finds the symmetric difference of two arrays, that is,
   * the elements that are absent in one or another array.
   *
   * @param a the first array
   * @param b the second array
   * @param [symmetric=false] whether to get symmetric difference.
   * @param [comparator] the comparator static used to sort the arrays
   * @param [container] an array-like object to hold the results
   * @return the difference of the arrays
   * @example
   *
   * SortedArray.getDifference([1, 2, 3, 4, 8], [2, 4, 6, 7, 9]);
   * //=> [ 1, 3, 8 ]
   *
   * // symmetric difference of sorted arrays:
   * SortedArray.getDifference(first, second, true);
   * //=> [ 1, 3, 6, 7, 8, 9 ]

   * // difference using a custom comparator:
   * const customComparator = (a, b) => (a > b ? -1 : a < b ? 1 : 0);
   * SortedArray.getDifference([8, 4, 3, 2, 1], [9, 7, 6, 4, 2], false, customComparator);
   * //=> [ 8, 3, 1 ]
   */
  static getDifference<T, U extends IndexedCollection<T>>(
    a: U,
    b: U,
    symmetric = false,
    comparator: Comparator<T> = this.compare,
    container: U = ([] as unknown) as U,
  ): typeof container {
    let i = 0;
    let j = 0;
    while (i < a.length && j < b.length) {
      const compared = comparator(a[i], b[j]);
      if (compared > 0) {
        if (symmetric) container[container.length] = b[j];
        j++;
      } else if (compared < 0) {
        container[container.length] = a[i];
        i++;
      } else {
        i++;
        j++;
      }
    }
    while (i < a.length) {
      container[container.length] = a[i];
      i++;
    }
    if (symmetric) {
      while (j < b.length) {
        container[container.length] = b[j];
        j++;
      }
    }
    return container;
  }

  /**
   * Returns the amount of differing elements in the first array.
   *
   * @param a the first array
   * @param b the second array
   * @param [symmetric=false] whether to use symmetric difference
   * @param [comparator] the comparator static used to sort the arrays
   * @return the amount of differing elements
   * @example
   *
   * SortedArray.getDifferenceScore([1, 2, 3, 4, 8], [2, 4, 6, 7, 9]);
   * //=> 3
   */
  static getDifferenceScore<T, U extends IndexedCollection<T>>(
    a: U,
    b: U,
    symmetric = false,
    comparator = this.compare,
  ): number {
    const score = this.getIntersectionScore(a, b, comparator);
    return symmetric ? a.length + b.length - 2 * score : a.length - score;
  }

  /**
   * Uses binary search to find the index of an element inside a sorted array.
   *
   * @param arr the array to search
   * @param target the target value to search for
   * @param [comparator] a custom comparator
   * @param [rank=false] whether to return the element's rank if the element isn't found
   * @param [start] the start position of the search
   * @param [end] the end position of the search
   * @return the index of the searched element or it's rank
   * @example
   *
   * SortedArray.getIndex([1, 2, 3, 4, 8], 4);
   * //=> 3
   */
  static getIndex<T, U extends IndexedCollection<T>>(
    arr: U,
    target: T,
    comparator: Comparator<T> = this.compare,
    rank = false,
    start = 0,
    end = arr.length - 1,
  ): number {
    let left = start;
    let right = end;
    let m;
    while (left <= right) {
      m = (left + right) >> 1;
      const compared = comparator(arr[m], target);
      if (compared < 0) {
        left = m + 1;
      } else if (compared > 0) {
        right = m - 1;
      } else {
        return m;
      }
    }
    return rank ? left : -1;
  }

  /**
   * Returns the intersection of two sorted arrays.
   *
   * @param a the first array
   * @param b the second array
   * @param [comparator] the comparator static used to sort the arrays
   * @param [container] an array-like object to hold the results
   * @return the intersection of the arrays
   * @example
   *
   * SortedArray.getIntersection([1, 2, 3, 4, 8], [2, 4, 6, 7, 9]);
   * //=> [ 2, 4 ]
   *
   * // intersection using a custom comparator:
   * const customComparator = (a, b) => (a > b ? -1 : a < b ? 1 : 0);
   * SortedArray.getIntersection([8, 4, 3, 2, 1], [9, 7, 6, 4, 2], customComparator);
   * //=> [ 4, 2 ]
   */
  static getIntersection<T, U extends IndexedCollection<T>>(
    a: U,
    b: U,
    comparator: Comparator<T> = this.compare,
    container: U = ([] as unknown) as U,
  ): U {
    let i = 0;
    let j = 0;
    while (i < a.length && j < b.length) {
      const compared = comparator(a[i], b[j]);
      if (compared > 0) {
        j++;
      } else if (compared < 0) {
        i++;
      } else {
        container[container.length] = a[i];
        i++;
        j++;
      }
    }
    return container;
  }

  /**
   * Returns the amount of common elements in two sorted arrays.
   *
   * @param a the first array
   * @param b the second array
   * @param [comparator] the comparator static used to sort the arrays
   * @return the amount of different elements
   * @example
   *
   * SortedArray.getIntersection([1, 2, 3, 4, 8], [2, 4, 6, 7, 9]);
   * //=> 2
   */
  static getIntersectionScore<T, U extends IndexedCollection<T>>(
    a: U,
    b: U,
    comparator: Comparator<T> = this.compare,
  ): number {
    let score = 0;
    let i = 0;
    let j = 0;
    while (i < a.length && j < b.length) {
      const compared = comparator(a[i], b[j]);
      if (compared > 0) {
        j++;
      } else if (compared < 0) {
        i++;
      } else {
        score++;
        i++;
        j++;
      }
    }
    return score;
  }

  /**
   * Returns a range of elements of a sorted array from the start through the end inclusively.
   *
   * @param arr the array
   * @param [start] the starting item
   * @param [end] the ending item
   * @param [comparator] a custom comparator
   * @param [subarray] return a subarray instead of copying resulting value with slice
   * @return the range of items
   * @example
   *
   * SortedArray.getRange([1, 2, 3, 4, 8], 2, 4);
   * //=> [ 2, 3, 4 ]
   *
   * const customComparator = (a, b) => (a > b ? -1 : a < b ? 1 : 0);
   * SortedArray.getRange([8, 4, 3, 2, 1], 8, 3, customComparator);
   * //=> [ 8, 4, 3 ]
   */
  static getRange<T, U extends IndexedCollection<T>>(
    arr: U,
    start?: T,
    end?: T,
    comparator?: Comparator<T>,
    subarray?: boolean,
  ): U {
    const startIndex = start === undefined
      ? 0
      : this.getIndex<T, U>(arr, start, comparator, true);
    const endIndex = end === undefined
      ? arr.length
      : this.getIndex(arr, end, comparator, true, startIndex) + 1;
    return subarray
      ? (arr as unknown as Int32Array).subarray(startIndex, endIndex)
      : (arr as any).slice(startIndex, endIndex);
  }

  /**
   * Returns the union of two sorted arrays as a sorted array.
   *
   * @param a the first array
   * @param b the second array
   * @param [unique=false] whether to avoid duplicating items when merging unique arrays
   * @param [comparator] the comparator static used to sort the arrays
   * @param [container] an array-like object to hold the results
   * @return the union of the arrays
   * @example
   *
   * SortedArray.getUnion([1, 2, 3, 4, 8], [2, 4, 6, 7, 9]);
   * //=> [ 1, 2, 2, 3, 4, 4, 6, 7, 8, 9 ]
   *
   * // union of sorted arrays without duplicates:
   * SortedArray.getUnion([1, 2, 3, 4, 8], [2, 4, 6, 7, 9], true);
   * //=> [ 1, 2, 3, 4, 6, 7, 8, 9 ]
   *
   * //union using a custom comparator:
   * SortedArray.getUnion([8, 4, 3, 2, 1], [9, 7, 6, 4, 2], true, customComparator);
   * //=> [ 9, 8, 7, 6, 4, 3, 2, 1 ]
   */
  static getUnion<T, U extends IndexedCollection<T>>(
    a: IndexedCollection<T>,
    b: IndexedCollection<T>,
    unique = false,
    comparator: Comparator<T> = this.compare,
    container: U = ([] as unknown) as U,
  ): U {
    let i = 0;
    let j = 0;
    while (i < a.length && j < b.length) {
      const compared = comparator(a[i], b[j]);
      if (compared > 0) {
        container[container.length] = b[j];
        j++;
      } else if (compared < 0) {
        container[container.length] = a[i];
        i++;
      } else {
        container[container.length] = a[i];
        if (!unique) container[container.length] = b[j];
        i++;
        j++;
      }
    }
    while (i < a.length) {
      container[container.length] = a[i];
      i++;
    }
    while (j < b.length) {
      container[container.length] = b[j];
      j++;
    }
    return container;
  }

  /**
   * Returns an array of unique elements from a sorted array.
   *
   * @param arr the sorted array
   * @param [comparator] a custom comparator
   * @param [container] an array-like object to hold the results
   * @return the sorted array without duplicates
   * @example
   *
   * SortedArray.getUnique([1, 1, 2, 2, 3, 4]);
   * //=> [ 1, 2, 3, 4 ]
   */
  static getUnique<T, U extends IndexedCollection<T>>(
    arr: IndexedCollection<T>,
    comparator: Comparator<T> = this.compare,
    container: U = ([] as unknown) as U,
  ): typeof container {
    container[0] = arr[0];
    for (let i = 1; i < arr.length; i++) {
      if (comparator(arr[i - 1], arr[i]) !== 0) {
        container[container.length] = arr[i];
      }
    }
    return container;
  }

  /**
   * Checks whether an array is sorted according to a provided comparator.
   *
   * @param arr the array to check
   * @param [comparator] a custom comparator
   * @return whether the array is sorted
   *
   * @example
   *
   * SortedArray.isSorted([1, 2, 3, 4, 8]);
   * //=> true
   */
  static isSorted<T, U extends IndexedCollection<T>>(
    arr: U,
    comparator: Comparator<T> = this.compare,
  ): boolean {
    for (let i = 1; i < arr.length; i++) {
      if (comparator(arr[i - 1], arr[i]) > 0) return false;
    }
    return true;
  }

  /**
   * Checks whether an array has any duplicating elements.
   *
   * @param arr the array to check
   * @param [comparator] a custom comparator
   * @return whether the array has duplicating elements
   * @example
   *
   * SortedArray.isUnique([1, 2, 2, 3, 4]);
   * //=> false
   */
  static isUnique<T, U extends IndexedCollection<T>>(
    arr: U,
    comparator: Comparator<T> = this.compare,
  ) {
    for (let i = 1; i < arr.length; i++) {
      if (comparator(arr[i - 1], arr[i]) === 0) return false;
    }
    return true;
  }

  /**
   * Creates a new SortedArray instance with a variable number of arguments,
   * regardless of number or type of the arguments
   *
   * @param elements the elements of which to create the array
   * @return the new SortedArray
   */
  static of<U>(...elements: Array<U>): SortedArray<U> {
    const result = (super.of(...elements) as unknown) as SortedArray<U>;
    result.sort();
    return result;
  }

  /**
   * Returns a merger of the array with one or more provided sorted arrays.
   *
   * @param arrays sorted array(s) to merge
   * @return a new SortedArray
   */
  concat(...arrays: Array<Array<ItemType>>): SortedArray<ItemType> {
    const constructor = this.constructor as typeof SortedArray;
    let result = this.slice(0) as SortedArray<ItemType>;
    // TODO rewrite
    for (let i = 0; i < arrays.length; i++) {
      result = constructor.getUnion(
        result,
        arrays[i],
        this.unique,
        constructor.compare,
        new constructor<ItemType>() as this,
      );
    }
    return result;
  }

  /**
   * Uses binary search to quickly check if the element is the array.
   * @param element the element to check
   * @return whether the element is in the array
   */
  includes(element: ItemType): boolean {
    return !!~this.indexOf(element);
  }

  /**
   * Looks for the index of a given element in the array or -1
   *
   * @param element the element to look for
   * @return the element's index in the array or -1
   */
  indexOf(element: ItemType): number {
    return (this.constructor as typeof SortedArray).getIndex(this, element);
  }

  /**
   * Checks if the array is sorted.
   *
   * @return whether the array is sorted
   * @example
   *
   * //=> SortedArray [ 2, 3, 4, 5, 9 ];
   * SortedArray.isSorted();
   * //=> true
   * SortedArray.reverse();
   * SortedArray.isSorted();
   * //=> false;
   */
  isSorted(): boolean {
    return (this.constructor as typeof SortedArray).isSorted(this);
  }

  /**
   * Checks if the array has duplicating elements.
   *
   * @return whether the array has duplicating elements
   * @example
   *
   * //=> SortedArray [ 2, 3, 3, 4, 5, 9 ];
   * SortedArray.isUnique();
   * //=> false;
   */
  isUnique(): boolean {
    return (this.constructor as typeof SortedArray).isUnique(this);
  }

  /**
   * Adds provided elements to the array preserving the sorted order of the array.
   *
   * @param elements the elements to add to the array
   * @return the new length of the array
   */
  push(...elements: Array<ItemType>): number {
    const { compare } = this.constructor as typeof SortedArray;
    const m = this.length;
    if (!m) return super.push(...elements.sort(compare));
    const toAdd = this.unique
      ? elements.filter((el) => !~this.indexOf(el))
      : elements;
    const n = toAdd.length;
    if (!n) return m;
    toAdd.sort(compare);
    for (let i = n - 1; i >= 0; i--) {
      let j;
      const last = this[m - 1];
      for (j = m - 2; j >= 0 && compare(this[j], toAdd[i]) === 1; j--) {
        this[j + 1] = this[j];
      }
      if (j !== m - 2 || compare(last, toAdd[i]) === 1) {
        this[j + 1] = toAdd[i];
        toAdd[i] = last;
      }
    }
    return super.push(...toAdd);
  }

  /**
   * Returns a range of elements of the array that are greater or equal to the provided
   * starting element and less or equal to the provided ending element.
   *
   * @param start the starting element
   * @param end the ending element
   * @return the resulting range of elements
   * @example
   *
   * //=> SortedArray [ 2, 3, 4, 5, 9 ];
   * SortedArray.range(3, 5);
   * // => [ 3, 4, 5 ]
   * SortedArray.range(undefined, 4);
   * // => [ 2, 3, 4 ]
   * SortedArray.range(4);
   * // => [ 4, 5, 8 ]
   */
  range(start?: ItemType, end?: ItemType): SortedArray<ItemType> {
    const constructor = this.constructor as typeof SortedArray;
    return constructor.getRange(this, start, end, constructor.compare, false);
  }

  /**
   * Returns the rank of an element in the array.
   *
   * @param element the element to look for
   * @return the rank in the array
   * @example
   *
   * //=> SortedArray [ 2, 3, 4, 5, 9 ];
   * SortedArray.rank(1);
   * // => 0
   * SortedArray.rank(6);
   * // => 4
   */
  rank(element: ItemType): number {
    const constructor = this.constructor as typeof SortedArray;
    return constructor.getIndex(this, element, constructor.compare, true);
  }

  /**
   * Implements in-place replacement of the array elements.
   *
   * @param arr an array of new elements to use
   *
   * @example
   *
   * //=> SortedArray [ 2, 3, 4, 5, 9 ];
   * sortedArray.set([1, 2, 3]);
   * //=> SortedArray [ 1, 2, 3 ]
   */
  set(arr: Array<ItemType>): this {
    this.length = arr.length;
    for (let i = 0; i < arr.length; i++) {
      this[i] = arr[i];
    }
    return this;
  }

  /**
   * Sorts the array with a provided compare function.
   *
   * @param compareFunction the function to use for comparison
   *
   */
  sort(
    compareFunction: Comparator<ItemType> = (this
      .constructor as typeof SortedArray).compare,
  ): this {
    return super.sort(compareFunction);
  }

  /**
   * Changes the array by removing existing elements and adding new ones.
   *
   * @param start the index at which to start changing the array
   * @param deleteCount the amount of old elements to delete
   * @param elements the elements to add to the array
   * @return an array of deleted elements
   */
  splice(
    start: number,
    deleteCount: number,
    ...elements: Array<ItemType>
  ): SortedArray<ItemType> {
    const deletedElements = super.splice(
      start,
      deleteCount,
    ) as SortedArray<ItemType>;
    this.push(...elements);
    return deletedElements;
  }

  /**
   * Removes duplicating elements from the array.
   *
   *
   * @example
   *
   * //=> SortedArray [ 2, 2, 3, 4, 5, 5, 9 ];
   * sortedArray.uniquify();
   * // => SortedArray [ 2, 3, 4, 5, 9 ]
   */
  uniquify() {
    const constructor = this.constructor as typeof SortedArray;
    return this.set(
      constructor.getUnique(this, constructor.compare, new constructor()),
    );
  }

  /**
   * Adds provided elements to the array preserving the sorted order of the array.
   *
   * @param elements the elements to add to the array
   * @return the new length of the array
   */
  unshift(...elements: Array<ItemType>) {
    return this.push(...elements);
  }
}
