const SortedArray = require('../lib/sorted-array');

const first = [1, 2, 3, 4, 8];
const second = [2, 4, 6, 7, 9];

describe('SortedArray', () => {
  let sorted;

  beforeEach(() => {
    sorted = new SortedArray(...first);
  });

  describe('concat', () => {
    it('returns a sorted combination of two arrays', () => {
      expect(sorted.concat(second)).toEqual([1, 2, 2, 3, 4, 4, 6, 7, 8, 9]);
    });

    it('returns a sorted set of two sets if `unique=true`', () => {
      sorted.unique = true;
      expect(sorted.concat(second)).toEqual([1, 2, 3, 4, 6, 7, 8, 9]);
    });
  });

  describe('push', () => {
    it('adds an element to an empty array', () => {
      const a = new SortedArray();
      expect(a.push(1)).toBe(1);
      expect(a).toEqual([1]);
    });

    it('adds an item to the array preserving the order', () => {
      expect(sorted.push(5)).toBe(6);
      expect(sorted).toEqual([1, 2, 3, 4, 5, 8]);
    });

    it('does not add duplicating elements if `unique=true`', () => {
      sorted.unique = true;
      expect(sorted.push(5)).toBe(6);
      expect(sorted.push(1)).toBe(6);
      expect(Array.from(sorted)).toEqual([1, 2, 3, 4, 5, 8]);
    });

    it('adds multiple items to the array preserving the order', () => {
      expect(sorted.push(4, 3, 2, 2, 5, 7, 1, 1, 1, 0, 9, 9, 9, 9, 9, 9, 9)).toBe(22);
      expect(sorted).toEqual([0, 1, 1, 1, 1, 2, 2, 2, 3, 3, 4, 4, 5, 7, 8, 9, 9, 9, 9, 9, 9, 9]);
    });

    it('adds multiple elements without duplicating if `unique-true`', () => {
      sorted.unique = true;
      expect(sorted.push(5, 1, 2, 2, 7, 6)).toBe(8);
      expect(Array.from(sorted)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    });
  });

  describe('set', () => {
    it('replaces the elements of the array', () => {
      expect(sorted.set(second)).toEqual(second);
    });
  });

  describe('splice', () => {
    it('removes specified amount of elements starting from a given index', () => {
      expect(sorted.splice(0, 2)).toEqual([1, 2]);
      expect(sorted).toEqual([3, 4, 8]);
    });

    it('adds new elements preserving order', () => {
      expect(sorted.splice(1, 1, 3, 4)).toEqual([2]);
      expect(sorted).toEqual([1, 3, 3, 4, 4, 8]);
    });
  });

  describe('uniquify', () => {
    it('removes duplicates from the array', () => {
      const unique = SortedArray.from([1, 2, 2, 3, 4, 5, 3, 1, 5, 9]);
      unique.uniquify();
      expect(unique).toEqual([1, 2, 3, 4, 5, 9]);
    });
  });

  describe('unshift', () => {
    it('adds elemets to the array preserving order', () => {
      expect(sorted.unshift(5, 0, 9)).toBe(8);
      expect(sorted).toEqual([0, 1, 2, 3, 4, 5, 8, 9]);
    });
  });
});
