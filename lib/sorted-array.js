const SortedMixin = require('./sorted-collection');

/**
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
        result, arrays[i], this.unique, this.compare, new this.constructor(),
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
      this.set(this.constructor.getUnion(
        this, toAdd, this.unique, this.compare, new this.constructor(),
      ));
    }
    return this.length;
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
    return this.set(this.constructor.getUnique(this, this.compare, new this.constructor()));
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
