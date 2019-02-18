/**
 * @name Comparator
 * @function
 * @param {*} a
 * @param {*} b
 * @returns {number}
 */

/**
 * Creates a SortedCollection class extending a given Array-like class.
 *
 * @param {CollectionConstructor} Base
 * @returns {SortedCollection}
 * @example
 *
 * const SortedCollection = Grid(Uint32Array);
 */
function SortedMixin(Base) {
  /**
   * Extends TypedArrays  to handle sorted data.
   *
   * @extends CollectionConstructor
   */
  class SortedCollection extends Base {
    /**
     * Uses binary search to quickly check if the element is the array.
     *
     * @private
     * @param {*} element the element to check
     * @returns {boolean} whether the element is in the array
     */
    includes(element) {
      return !!~this.indexOf(element);
    }

    /**
     * Looks for the index of a given element in the array or -1
     *
     * @private
     * @param {*} element the element to look for
     * @returns {number} the element's index in the array or -1
     */
    indexOf(element) {
      return this.constructor.getIndex(this, element);
    }

    /**
     * Checks if the array is sorted.
     *
     * @returns {boolean} whether the array is sorted
     * @example
     *
     * //=> SortedCollection [ 2, 3, 4, 5, 9 ];
     * sortedCollection.isSorted();
     * //=> true
     * sortedCollection.reverse();
     * sortedCollection.isSorted();
     * //=> false;
     */
    isSorted() {
      return this.constructor.isSorted(this);
    }

    /**
     * Checks if the array has duplicating elements.
     *
     * @returns {boolean} whether the array has duplicating elements
     * @example
     *
     * //=> SortedCollection [ 2, 3, 3, 4, 5, 9 ];
     * sortedCollection.isUnique();
     * //=> false;
     */
    isUnique() {
      return this.constructor.isUnique(this);
    }

    /**
     * Returns a range of elements of the array that are greater or equal to the provided
     * starting element and less or equal to the provided ending element.
     *
     * @param {*} start the starting element
     * @param {*} end the ending element
     * @param {boolean} [subarray] return a subarray instead of copying resulting value with slice
     * @returns {SortedCollection} the resulting range of elements
     * @example
     *
     * //=> SortedCollection [ 2, 3, 4, 5, 9 ];
     * sortedCollection.range(3, 5);
     * // => [ 3, 4, 5 ]
     * sortedCollection.range(undefined, 4);
     * // => [ 2, 3, 4 ]
     * sortedCollection.range(4);
     * // => [ 4, 5, 8 ]
     */
    range(start, end, subarray) {
      return this.constructor.getRange(this, start, end, this.constructor.compare, subarray);
    }

    /**
     * Returns the rank of an element in the array.
     *
     * @param {*} element the element to look for
     * @returns {number} the rank in the array
     * @example
     *
     * //=> SortedCollection [ 2, 3, 4, 5, 9 ];
     * sortedCollection.rank(1);
     * // => 0
     * sortedCollection.rank(6);
     * // => 4
     */
    rank(element) {
      return this.constructor.getIndex(this, element, this.constructor.compare, true);
    }

    /**
     * The default comparator.
     *
     * @param {*} a the first value
     * @param {*} b the second value
     * @returns {number}
     */
    static compare(a, b) {
      if (a > b) return 1;
      if (a < b) return -1;
      if (a === b) return 0;
      throw new RangeError('Unstable comparison.');
    }

    /**
     * Creates a new SortedCollection from a given array-like object.
     *
     * @private
     * @param {*} arrayLike an array-like object to convert to a SortedCollection
     * @param {Function} mapFn a map function to call on every element of the array
     * @param {Object} thisArg the value to use as `this` when invoking the `mapFn`
     * @returns {SortedCollection} a new SortedCollection
     */
    static from(arrayLike, mapFn, thisArg) {
      const result = super.from(arrayLike, mapFn, thisArg);
      result.sort();
      return result;
    }

    /**
     * Returns the difference of two sorted arrays, i.e. elements present in the first array but not
     * in the second array. If `symmetric=true` finds the symmetric difference of two arrays, that is,
     * the elements that are absent in one or another array.
     *
     * @param {Collection} a the first array
     * @param {Collection} b the second array
     * @param {boolean} [symmetric=false] whether to get symmetric difference.
     * @param {Comparator} [comparator] the comparator static used to sort the arrays
     * @param {Collection} [container] an array-like object to hold the results
     * @returns {Array} the difference of the arrays
     * @example
     *
     * SortedCollection.getDifference([1, 2, 3, 4, 8], [2, 4, 6, 7, 9]);
     * //=> [ 1, 3, 8 ]
     *
     * // symmetric difference of sorted arrays:
     * SortedCollection.getDifference(first, second, true);
     * //=> [ 1, 3, 6, 7, 8, 9 ]

     * // difference using a custom comparator:
     * const customComparator = (a, b) => (a > b ? -1 : a < b ? 1 : 0);
     * SortedCollection.getDifference([8, 4, 3, 2, 1], [9, 7, 6, 4, 2], false, customComparator);
     * //=> [ 8, 3, 1 ]
     */
    static getDifference(a, b, symmetric, comparator = this.compare, container = []) {
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
     * @param {Collection} a the first array
     * @param {Collection} b the second array
     * @param {boolean} [symmetric=false] whether to use symmetric difference
     * @param {Comparator} [comparator] the comparator static used to sort the arrays
     * @returns {number} the amount of differing elements
     * @example
     *
     * SortedCollection.getDifferenceScore([1, 2, 3, 4, 8], [2, 4, 6, 7, 9]);
     * //=> 3
     */
    static getDifferenceScore(a, b, symmetric, comparator) {
      const score = this.getIntersectionScore(a, b, comparator);
      return symmetric ? (a.length + b.length) - (2 * score) : a.length - score;
    }

    /**
     * Uses binary search to find the index of an element inside a sorted array.
     *
     * @param {Collection} arr the array to search
     * @param {*} target the target value to search for
     * @param {Comparator} [comparator] a custom comparator
     * @param {boolean} [rank] whether to return the element's rank if the element isn't found
     * @param {number} [start] the start position of the search
     * @param {number} [end] the end position of the search
     * @returns {number} the index of the searched element or it's rank
     * @example
     *
     * SortedCollection.getIndex([1, 2, 3, 4, 8], 4);
     * //=> 3
     */
    static getIndex(
      arr, target, comparator = this.compare,
      rank = false, start = 0, end = arr.length - 1,
    ) {
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
     * @param {Collection} a the first array
     * @param {Collection} b the second array
     * @param {Comparator} [comparator] the comparator static used to sort the arrays
     * @param {Collection} [container] an array-like object to hold the results
     * @returns {Array} the intersection of the arrays
     * @example
     *
     * SortedCollection.getIntersection([1, 2, 3, 4, 8], [2, 4, 6, 7, 9]);
     * //=> [ 2, 4 ]
     *
     * // intersection using a custom comparator:
     * const customComparator = (a, b) => (a > b ? -1 : a < b ? 1 : 0);
     * SortedCollection.getIntersection([8, 4, 3, 2, 1], [9, 7, 6, 4, 2], customComparator);
     * //=> [ 4, 2 ]
     */
    static getIntersection(a, b, comparator = this.compare, container = []) {
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
     * @param {Collection} a the first array
     * @param {Collection} b the second array
     * @param {Comparator} [comparator] the comparator static used to sort the arrays
     * @returns {number} the amount of different elements
     * @example
     *
     * SortedCollection.getIntersection([1, 2, 3, 4, 8], [2, 4, 6, 7, 9]);
     * //=> 2
     */
    static getIntersectionScore(a, b, comparator = this.compare) {
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
     * @param {Collection} arr the array
     * @param {number} [start] the starting item
     * @param {number} [end] the ending item
     * @param {Comparator} [comparator] a custom comparator
     * @param {boolean} [subarray] return a subarray instead of copying resulting value with slice
     * @returns {Collection} the range of items
     * @example
     *
     * SortedCollection.getRange([1, 2, 3, 4, 8], 2, 4);
     * //=> [ 2, 3, 4 ]
     *
     * const customComparator = (a, b) => (a > b ? -1 : a < b ? 1 : 0);
     * SortedCollection.getRange([8, 4, 3, 2, 1], 8, 3, customComparator);
     * //=> [ 8, 4, 3 ]
     */
    static getRange(arr, start, end, comparator, subarray) {
      const startIndex = start === undefined ? 0 : this.getIndex(arr, start, comparator, true);
      const endIndex = end === undefined ? arr.length
        : this.getIndex(arr, end, comparator, true, startIndex) + 1;
      const method = subarray ? 'subarray' : 'slice';
      return arr[method](startIndex, endIndex);
    }

    /**
     * Returns the union of two sorted arrays as a sorted array.
     *
     * @param {Collection} a the first array
     * @param {Collection} b the second array
     * @param {boolean} [unique=false] whether to avoid duplicating items when merging unique arrays
     * @param {Comparator} [comparator] the comparator static used to sort the arrays
     * @param {Collection} [container] an array-like object to hold the results
     * @returns {Array} the union of the arrays
     * @example
     *
     * SortedCollection.getUnion([1, 2, 3, 4, 8], [2, 4, 6, 7, 9]);
     * //=> [ 1, 2, 2, 3, 4, 4, 6, 7, 8, 9 ]
     *
     * // union of sorted arrays without duplicates:
     * SortedCollection.getUnion([1, 2, 3, 4, 8], [2, 4, 6, 7, 9], true);
     * //=> [ 1, 2, 3, 4, 6, 7, 8, 9 ]
     *
     * //union using a custom comparator:
     * SortedCollection.getUnion([8, 4, 3, 2, 1], [9, 7, 6, 4, 2], true, customComparator);
     * //=> [ 9, 8, 7, 6, 4, 3, 2, 1 ]
     */
    static getUnion(a, b, unique, comparator = this.compare, container = []) {
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
     * @param {Collection} arr the sorted array
     * @param {Comparator} [comparator] a custom comparator
     * @param {Collection} [container] an array-like object to hold the results
     * @returns {Array} the sorted array without duplicates
     * @example
     *
     * SortedCollection.getUnique([1, 1, 2, 2, 3, 4]);
     * //=> [ 1, 2, 3, 4 ]
     */
    static getUnique(arr, comparator = this.compare, container = []) {
      container[0] = arr[0];
      for (let i = 1; i < arr.length; i++) {
        if (comparator(arr[i - 1], arr[i]) !== 0) {
          container[container.length] = arr[i];
        }
      }
      return container;
    }

    /**
     * Creates a new SortedCollection instance with a variable number of arguments,
     * regardless of number or type of the arguments
     *
     * @private
     * @param {...*} elements the elements of which to create the array
     * @returns {SortedCollection} the new SortedCollection
     */
    static of(...elements) {
      const result = super.of(...elements);
      result.sort();
      return result;
    }

    /**
     * Checks whether an array is sorted according to a provided comparator.
     *
     * @param {Array} arr the array to check
     * @param {Comparator} [comparator] a custom comparator
     * @returns {boolean} whether the array is sorted
     *
     * @example
     *
     * SortedCollection.isSorted([1, 2, 3, 4, 8]);
     * //=> true
     */
    static isSorted(arr, comparator = this.compare) {
      for (let i = 1; i < arr.length; i++) {
        if (comparator(arr[i - 1], arr[i]) > 0) return false;
      }
      return true;
    }

    /**
     * Checks whether an array has any duplicating elements.
     *
     * @param {Array} arr the array to check
     * @param {Comparator} [comparator] a custom comparator
     * @returns {boolean} whether the array has duplicating elements
     * @example
     *
     * SortedCollection.isUnique([1, 2, 2, 3, 4]);
     * //=> false
     */
    static isUnique(arr, comparator = this.compare) {
      for (let i = 1; i < arr.length; i++) {
        if (comparator(arr[i - 1], arr[i]) === 0) return false;
      }
      return true;
    }
  }

  return SortedCollection;
}

module.exports = SortedMixin;
