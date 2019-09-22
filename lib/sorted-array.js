const SortedMixin = require('./sorted-collection');

/**
 * Extends Array to handle sorted data.
 *
 * @extends SortedCollection
 */
class SortedArray extends SortedMixin(Array) {
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
      result = this.constructor.getUnion(
        result, arrays[i], this.unique, this.constructor.compare, new this.constructor(),
      );
    }
    return result;
  }

  /**
   * Adds provided elements to the array preserving the sorted order of the array.
   *
   * @private
   * @param {...*} elements the elements to add to the array
   * @returns {number} the new length of the array
   */
  push(...elements) {
    const { compare } = this.constructor;
    const m = this.length;
    if (!m) return super.push(...elements.sort(compare));
    const toAdd = this.unique ? elements.filter((el) => !~this.indexOf(el)) : elements;
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
   * Implements in-place replacement of the array elements.
   *
   * @param {Collection} arr an array of new elements to use
   * @returns {SortedArray}
   * @example
   *
   * //=> SortedArray [ 2, 3, 4, 5, 9 ];
   * sortedArray.set([1, 2, 3]);
   * //=> SortedArray [ 1, 2, 3 ]
   */
  set(arr) {
    this.length = arr.length;
    for (let i = 0; i < arr.length; i++) {
      this[i] = arr[i];
    }
    return this;
  }

  /**
   * Sorts the array with a provided compare function.
   *
   * @private
   * @param {Comparator} compareFunction the function to use for comparison
   * @returns {this}
   */
  sort(compareFunction = this.constructor.compare) {
    return super.sort(compareFunction);
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
    return this.set(this.constructor.getUnique(this, this.constructor.compare,
      new this.constructor()));
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
}

module.exports = SortedArray;
