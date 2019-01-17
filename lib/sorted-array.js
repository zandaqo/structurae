/**
 * @name Comparator
 * @function
 * @param {*} a
 * @param {*} b
 * @returns {number}
 */

/**
 * Extends built-in Array to efficiently handle sorted data.
 *
 * @extends Array
 */
class SortedArray extends Array {
  /**
   * The default comparator.
   *
   * @param {*} a the first value
   * @param {*} b the second value
   * @returns {number}
   * @example
   *
   * //=> SortedArray [ 2, 3, 4, 5, 9 ];
   * sortedArray.compare = (a, b) => (a > b ? -1 : a < b ? 1 : 0);
   * sortedArray.sort();
   * //=> [ 9, 5, 4, 3, 2 ]
   */
  compare(a, b) {
    if (a > b) return 1;
    if (a < b) return -1;
    if (a === b) return 0;
    throw new RangeError('Unstable comparison.');
  }

  /**
   * Returns a merger of the array with one or more provided sorted arrays.
   *
   * @private
   * @param {...Array} arrays sorted array(s) to merge
   * @returns {SortedArray} a new SortedArray
   */
  concat(...arrays) {
    let result = this;
    for (let i = 0; i < arrays.length; i++) {
      result = this.constructor.getUnion(result, arrays[i], this.unique, this.compare);
    }
    return result;
  }

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
    return this.constructor.getIndex(this, element, this.compare);
  }

  /**
   * Checks if the array is sorted.
   *
   * @returns {boolean} whether the array is sorted
   * @example
   *
   * //=> SortedArray [ 2, 3, 4, 5, 9 ];
   * sortedArray.isSorted();
   * //=> true
   * sortedArray.reverse();
   * sortedArray.isSorted();
   * //=> false;
   */
  isSorted() {
    return this.constructor.isSorted(this, this.compare);
  }

  /**
   * Checks if the array has duplicating elements.
   *
   * @returns {boolean} whether the array has duplicating elements
   * @example
   *
   * //=> SortedArray [ 2, 3, 4, 5, 9 ];
   * sortedArray.isUnique();
   * //=> true
   * sortedArray.push(2);
   * sortedArray.isUnique();
   * //=> false;
   */
  isUnique() {
    return this.constructor.isUnique(this, this.compare);
  }

  /**
   * Adds provided elements to the array preserving the sorted order of the array.
   *
   * @private
   * @param {...*} elements the elements to add to the array
   * @returns {number} the new length of the array
   */
  push(...elements) {
    if (elements.length === 1) {
      const position = this.constructor.getIndex(this, elements[0], this.compare, true);
      if (position === this.length) {
        super.push(elements[0]);
        return this.length;
      }
      if (!this.unique || (this.compare(this[position], elements[0]) !== 0)) {
        super.splice(position, 0, elements[0]);
      }
    } else {
      elements.sort(this.compare);
      const toAdd = this.unique ? this.constructor.getUnique(elements, this.compare) : elements;
      this.reset(this.constructor.getUnion(this, toAdd, this.unique, this.compare));
    }
    return this.length;
  }

  /**
   * Implements in-place replacement of the array elements.
   *
   * @param {Array} arr an array of new elements to use
   * @returns {SortedArray}
   * @example
   *
   * //=> SortedArray [ 2, 3, 4, 5, 9 ];
   * sortedArray.reset([1, 2, 3]);
   * //=> SortedArray [ 1, 2, 3 ]
   */
  reset(arr) {
    this.length = 0;
    for (let i = 0; i < arr.length; i++) {
      this[i] = arr[i];
    }
    return this;
  }

  /**
   * Returns a range of elements of the array that are greater or equal to the provided
   * starting element and less or equal to the provided ending element.
   *
   * @param {*} start the starting element
   * @param {*} end the ending element
   * @returns {SortedArray} the resulting range of elements
   * @example
   *
   * //=> SortedArray [ 2, 3, 4, 5, 9 ];
   * sortedArray.range(3, 5);
   * // => [ 3, 4, 5 ]
   * sortedArray.range(undefined, 4);
   * // => [ 2, 3, 4 ]
   * sortedArray.range(4);
   * // => [ 4, 5, 8 ]
   */
  range(start, end) {
    return this.constructor.getRange(this, start, end, this.compare);
  }

  /**
   * Returns the rank of an element in the array.
   *
   * @param {*} element the element to look for
   * @returns {number} the rank in the array
   * @example
   *
   * //=> SortedArray [ 2, 3, 4, 5, 9 ];
   * sortedArray.rank(1);
   * // => 0
   * sortedArray.rank(6);
   * // => 4
   */
  rank(element) {
    return this.constructor.getIndex(this, element, this.compare, true);
  }

  /**
   * Sorts the array with a provided compare function.
   *
   * @private
   * @param {Comparator} compareFunction the function to use for comparison
   * @returns {void}
   */
  sort(compareFunction = this.compare) {
    super.sort(compareFunction);
  }

  /**
   * Changes the array by removing existing elements and adding new ones.
   *
   * @private
   * @param {number} start the index at which to start changing the array
   * @param {number} deleteCount the amount of old elements to delete
   * @param {...*} elements the elements to add to the array
   * @returns {SortedArray} an array of deleted elements
   */
  splice(start, deleteCount, ...elements) {
    const deletedElements = super.splice(start, deleteCount);
    this.push(...elements);
    return deletedElements;
  }

  /**
   * Removes duplicating elements from the array.
   *
   * @returns {SortedArray}
   * @example
   *
   * //=> SortedArray [ 2, 2, 3, 4, 5, 5, 9 ];
   * sortedArray.uniquify();
   * // => SortedArray [ 2, 3, 4, 5, 9 ]
   */
  uniquify() {
    return this.reset(this.constructor.getUnique(this, this.compare));
  }

  /**
   * Adds provided elements to the array preserving the sorted order of the array.
   *
   * @private
   * @param {...*} elements the elements to add to the array
   * @returns {number} the new length of the array
   */
  unshift(...elements) {
    return this.push(...elements);
  }

  /**
   * Creates a new SortedArray from a given array-like object.
   *
   * @private
   * @param {*} arrayLike an array-like object to convert to a SortedArray
   * @param {Function} mapFn a map function to call on every element of the array
   * @param {Object} thisArg the value to use as `this` when invoking the `mapFn`
   * @returns {SortedArray} a new SortedArray
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
   * @param {Array} a the first array
   * @param {Array} b the second array
   * @param {boolean} [symmetric=false] whether to get symmetric difference.
   * @param {Comparator} [comparator] the comparator static used to sort the arrays
   * @returns {Array} the difference of the arrays
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
  static getDifference(a, b, symmetric, comparator = this.prototype.compare) {
    const difference = new a.constructor();
    let i = 0;
    let j = 0;
    while (i < a.length && j < b.length) {
      const compared = comparator(a[i], b[j]);
      if (compared > 0) {
        if (symmetric) difference[difference.length] = b[j];
        j++;
      } else if (compared < 0) {
        difference[difference.length] = a[i];
        i++;
      } else {
        i++;
        j++;
      }
    }
    while (i < a.length) {
      difference[difference.length] = a[i];
      i++;
    }
    if (symmetric) {
      while (j < b.length) {
        difference[difference.length] = b[j];
        j++;
      }
    }
    return difference;
  }

  /**
   * Returns the amount of differing elements in the first array.
   *
   * @param {Array} a the first array
   * @param {Array} b the second array
   * @param {boolean} [symmetric=false] whether to use symmetric difference
   * @param {Comparator} [comparator] the comparator static used to sort the arrays
   * @returns {number} the amount of differing elements
   * @example
   *
   * SortedArray.getDifferenceScore([1, 2, 3, 4, 8], [2, 4, 6, 7, 9]);
   * //=> 3
   */
  static getDifferenceScore(a, b, symmetric, comparator) {
    const score = this.getIntersectionScore(a, b, comparator);
    return symmetric ? (a.length + b.length) - (2 * score) : a.length - score;
  }

  /**
   * Uses binary search to find the index of an element inside a sorted array.
   *
   * @param {Array} arr the array to search
   * @param {*} target the target value to search for
   * @param {Comparator} [comparator] a custom comparator
   * @param {boolean} [rank] whether to return the element's rank if the element isn't found
   * @param {number} [start] the start position of the search
   * @param {number} [end] the end position of the search
   * @returns {number} the index of the searched element or it's rank
   * @example
   *
   * SortedArray.getIndex([1, 2, 3, 4, 8], 4);
   * //=> 3
   */
  static getIndex(
    arr, target, comparator = this.prototype.compare,
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
   * @param {Array} a the first array
   * @param {Array} b the second array
   * @param {Comparator} [comparator] the comparator static used to sort the arrays
   * @returns {Array} the intersection of the arrays
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
  static getIntersection(a, b, comparator = this.prototype.compare) {
    const intersection = new a.constructor();
    let i = 0;
    let j = 0;
    while (i < a.length && j < b.length) {
      const compared = comparator(a[i], b[j]);
      if (compared > 0) {
        j++;
      } else if (compared < 0) {
        i++;
      } else {
        intersection[intersection.length] = a[i];
        i++;
        j++;
      }
    }
    return intersection;
  }

  /**
   * Returns the amount of common elements in two sorted arrays.
   *
   * @param {Array} a the first array
   * @param {Array} b the second array
   * @param {Comparator} [comparator] the comparator static used to sort the arrays
   * @returns {number} the amount of different elements
   * @example
   *
   * SortedArray.getIntersection([1, 2, 3, 4, 8], [2, 4, 6, 7, 9]);
   * //=> 2
   */
  static getIntersectionScore(a, b, comparator = this.prototype.compare) {
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
   * @param {Array} arr the array
   * @param {number} [start] the starting item
   * @param {number} [end] the ending item
   * @param {Comparator} [comparator] a custom comparator
   * @returns {Array} the range of items
   * @example
   *
   * SortedArray.getRange([1, 2, 3, 4, 8], 2, 4);
   * //=> [ 2, 3, 4 ]
   *
   * const customComparator = (a, b) => (a > b ? -1 : a < b ? 1 : 0);
   * SortedArray.getRange([8, 4, 3, 2, 1], 8, 3, customComparator);
   * //=> [ 8, 4, 3 ]
   */
  static getRange(arr, start, end, comparator) {
    const startIndex = start === undefined ? 0 : this.getIndex(arr, start, comparator, true);
    const endIndex = end === undefined ? arr.length
      : this.getIndex(arr, end, comparator, true, startIndex) + 1;
    return arr.slice(startIndex, endIndex);
  }

  /**
   * Uses binary search to find the rank of an item inside a sorted array.
   *
   * @deprecated use SortedArray.getIndex directly instead
   * @param {Array} arr the array to search
   * @param {*} target the target value to search for
   * @param {Comparator} [comparator] a custom comparator
   * @returns {number} the rank of the searched item
   * @example
   *
   * SortedArray.getRank([1, 2, 3, 4, 8], 5);
   * //=> 4
   *
   * const customComparator = (a, b) => (a > b ? -1 : a < b ? 1 : 0);
   * SortedArray.getRank([8, 4, 3, 2, 1], 5, customComparator);
   * //=> 3
   */
  static getRank(arr, target, comparator) {
    return this.getIndex(arr, target, comparator, true);
  }

  /**
   * Returns the union of two sorted arrays as a sorted array.
   *
   * @param {Array} a the first array
   * @param {Array} b the second array
   * @param {boolean} [unique=false] whether to avoid duplicating items when merging unique arrays
   * @param {Comparator} [comparator] the comparator static used to sort the arrays
   * @returns {Array} the union of the arrays
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
  static getUnion(a, b, unique, comparator = this.prototype.compare) {
    const union = new a.constructor();
    let i = 0;
    let j = 0;
    while (i < a.length && j < b.length) {
      const compared = comparator(a[i], b[j]);
      if (compared > 0) {
        union[union.length] = b[j];
        j++;
      } else if (compared < 0) {
        union[union.length] = a[i];
        i++;
      } else {
        union[union.length] = a[i];
        if (!unique) union[union.length] = b[j];
        i++;
        j++;
      }
    }
    while (i < a.length) {
      union[union.length] = a[i];
      i++;
    }
    while (j < b.length) {
      union[union.length] = b[j];
      j++;
    }
    return union;
  }


  /**
   * Returns an array of unique elements from a sorted array.
   *
   * @param {Array} arr the sorted array
   * @param {Comparator} [comparator] a custom comparator
   * @returns {Array} the sorted array without duplicates
   * @example
   *
   * SortedArray.getUnique([1, 1, 2, 2, 3, 4]);
   * //=> [ 1, 2, 3, 4 ]
   */
  static getUnique(arr, comparator = this.prototype.compare) {
    const unique = new arr.constructor();
    unique[0] = arr[0];
    for (let i = 1; i < arr.length; i++) {
      if (comparator(arr[i - 1], arr[i]) !== 0) {
        unique[unique.length] = arr[i];
      }
    }
    return unique;
  }

  /**
   * Creates a new SortedArray instance with a variable number of arguments,
   * regardless of number or type of the arguments
   *
   * @private
   * @param {...*} elements the elements of which to create the array
   * @returns {SortedArray} the new SortedArray
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
   * SortedArray.isSorted([1, 2, 3, 4, 8]);
   * //=> true
   */
  static isSorted(arr, comparator = this.prototype.compare) {
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
   * SortedArray.isUnique([1, 2, 2, 3, 4]);
   * //=> false
   */
  static isUnique(arr, comparator = this.prototype.compare) {
    for (let i = 1; i < arr.length; i++) {
      if (comparator(arr[i - 1], arr[i]) === 0) return false;
    }
    return true;
  }
}

module.exports = SortedArray;
