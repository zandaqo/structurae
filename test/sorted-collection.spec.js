const SortedCollection = require('../lib/sorted-collection');

const first = [1, 2, 3, 4, 8];
const second = [2, 4, 6, 7, 9];
const inversedFirst = [8, 4, 3, 2, 1];
const inversedSecond = [9, 7, 6, 4, 2];
const customComparator = (a, b) => (a > b ? -1 : a < b ? 1 : 0);

describe('Sorted', () => {
  const SortedArray = SortedCollection(Uint8Array);
  let sorted;

  beforeEach(() => {
    sorted = new SortedArray(first);
  });

  describe('compare', () => {
    it('compares two values', () => {
      expect(sorted.compare(1, 2)).toBe(-1);
      expect(sorted.compare(1, 1)).toBe(0);
    });

    it('throws if comparison fails', () => {
      expect(() => { sorted.compare('a', 1); }).toThrowError('Unstable comparison.');
    });
  });

  describe('includes', () => {
    it('checks if an item is in the array', () => {
      expect(sorted.includes(3)).toBe(true);
      expect(sorted.includes(9)).toBe(false);
    });
  });

  describe('indexOf', () => {
    it('returns the index of a given item', () => {
      expect(sorted.indexOf(3)).toBe(2);
      expect(sorted.indexOf(9)).toBe(-1);
    });
  });

  describe('isSorted', () => {
    it('checks if the array is sorted according to a provided comparator', () => {
      jest.spyOn(SortedArray, 'isSorted');
      expect(sorted.isSorted()).toBe(true);
      expect(SortedArray.isSorted.mock.calls.length).toBe(1);
      expect(SortedArray.isSorted.mock.calls[0]).toEqual([sorted, sorted.compare]);
      SortedArray.isSorted.mockRestore();
    });
  });

  describe('isUnique', () => {
    it('checks if the array has duplicating elements', () => {
      jest.spyOn(SortedArray, 'isUnique');
      expect(sorted.isUnique()).toBe(true);
      expect(SortedArray.isUnique.mock.calls.length).toBe(1);
      expect(SortedArray.isUnique.mock.calls[0]).toEqual([sorted, sorted.compare]);
      SortedArray.isUnique.mockRestore();
    });
  });

  describe('range', () => {
    it('returns range', () => {
      expect(sorted.range(2, 4)).toEqual(new SortedArray([2, 3, 4]));
      expect(sorted.range(2)).toEqual(new SortedArray([2, 3, 4, 8]));
      expect(sorted.range(undefined, 4)).toEqual(new SortedArray([1, 2, 3, 4]));
    });
  });

  describe('rank', () => {
    it('returns the rank of an element in a sorted array', () => {
      expect(sorted.rank(5)).toBe(4);
    });
  });

  describe('from', () => {
    it('creates a sorted array from an array-like object', () => {
      expect(SortedArray.from([2, 1, 5, 3, 80, 9])).toEqual(new SortedArray([1, 2, 3, 5, 9, 80]));
    });
  });

  describe('getDifference', () => {
    it('returns the difference of two sorted arrays', () => {
      expect(SortedArray.getDifference(first, second)).toEqual([1, 3, 8]);
    });

    it('returns the symmetric difference if `symmetric=true`', () => {
      expect(SortedArray.getDifference(first, second, true)).toEqual([1, 3, 6, 7, 8, 9]);
    });

    it('returns the difference using a custom comparator', () => {
      expect(SortedArray.getDifference(inversedFirst, inversedSecond, false, customComparator))
        .toEqual([8, 3, 1]);
    });

    it('returns the difference in a given container', () => {
      expect(SortedArray.getDifference(
        inversedFirst, inversedSecond, false, customComparator,
      ) instanceof SortedArray).toBe(false);
      expect(SortedArray.getDifference(
        inversedFirst, inversedSecond, false, customComparator, new SortedArray(),
      ) instanceof SortedArray).toBe(true);
    });
  });

  describe('getDifferenceScore', () => {
    it('returns the amount of elements in the second array differing from the first', () => {
      expect(SortedArray.getDifferenceScore(first, second)).toBe(3);
    });

    it('returns the amount of elements not present in either array if `symmetric=true`', () => {
      expect(SortedArray.getDifferenceScore(first, second, true)).toBe(6);
    });

    it('returns the difference score using a custom comparator', () => {
      expect(SortedArray.getDifferenceScore(inversedFirst, inversedSecond, false, customComparator))
        .toEqual(3);
    });
  });

  describe('getIndex', () => {
    it('returns the index of a given item in a sorted array', () => {
      expect(SortedArray.getIndex(first, 4)).toBe(3);
    });

    it('uses custom comparator if provided', () => {
      expect(SortedArray.getIndex(inversedFirst, 2, customComparator)).toBe(3);
    });

    it('returns the rank of an item if `rank=true`', () => {
      expect(SortedArray.getIndex(first, 7, undefined, true)).toBe(4);
    });
  });

  describe('getIntersection', () => {
    it('returns the intersection of two sorted arrays', () => {
      expect(SortedArray.getIntersection(first, second)).toEqual([2, 4]);
    });

    it('returns the intersection using a custom comparator', () => {
      expect(SortedArray.getIntersection(inversedFirst, inversedSecond, customComparator))
        .toEqual([4, 2]);
    });
    it('returns the intersection in a given container', () => {
      expect(SortedArray.getIntersection(
        inversedFirst, inversedSecond, customComparator,
      ) instanceof SortedArray).toBe(false);
      expect(SortedArray.getIntersection(
        inversedFirst, inversedSecond, customComparator, new SortedArray(),
      ) instanceof SortedArray).toBe(true);
    });
  });

  describe('getIntersectionScore', () => {
    it('returns the amount of common elements in two sorted arrays', () => {
      expect(SortedArray.getIntersectionScore(first, second)).toBe(2);
    });

    it('returns the intersection score using a custom comparator', () => {
      expect(SortedArray.getIntersectionScore(inversedFirst, inversedSecond, customComparator))
        .toEqual(2);
    });
  });

  describe('getRange', () => {
    it('returns range', () => {
      expect(SortedArray.getRange(first, 2, 4)).toEqual([2, 3, 4]);
      expect(SortedArray.getRange(first, 2)).toEqual([2, 3, 4, 8]);
      expect(SortedArray.getRange(first, undefined, 4)).toEqual([1, 2, 3, 4]);
    });

    it('uses custom comparator if provided', () => {
      expect(SortedArray.getRange(inversedFirst, 8, 3, customComparator)).toEqual([8, 4, 3]);
      expect(SortedArray.getRange(inversedFirst, 4, undefined, customComparator))
        .toEqual([4, 3, 2, 1]);
      expect(SortedArray.getRange(inversedFirst, undefined, 2, customComparator))
        .toEqual([8, 4, 3, 2]);
    });

    it('returns a range as a subarray if `subarray` true', () => {
      const typedArray = Uint32Array.from(first);
      const range = SortedArray.getRange(typedArray, 2, 4, undefined, true);
      expect(range instanceof Uint32Array).toBe(true);
      expect(Array.from(range)).toEqual([2, 3, 4]);
      expect(range.buffer === typedArray.buffer).toBe(true);
    });
  });

  describe('getUnion', () => {
    it('returns the union of two sorted arrays', () => {
      expect(SortedArray.getUnion(first, second)).toEqual([1, 2, 2, 3, 4, 4, 6, 7, 8, 9]);
    });

    it('returns the union of two arrays without duplicates if `unique=true`', () => {
      expect(SortedArray.getUnion(first, second, true)).toEqual([1, 2, 3, 4, 6, 7, 8, 9]);
    });

    it('returns the union using a custom comparator', () => {
      expect(SortedArray.getUnion(inversedFirst, inversedSecond, true, customComparator))
        .toEqual([9, 8, 7, 6, 4, 3, 2, 1]);
    });

    it('returns the union in a given container', () => {
      expect(SortedArray.getUnion(
        inversedFirst, inversedSecond, true, customComparator,
      ) instanceof SortedArray).toBe(false);
      expect(SortedArray.getUnion(
        inversedFirst, inversedSecond, true, customComparator, new SortedArray(),
      ) instanceof SortedArray).toBe(true);
    });
  });

  describe('getUnique', () => {
    it('returns an array of unique elements from a sorted array', () => {
      expect(SortedArray.getUnique([1, 1, 2, 3, 3, 4])).toEqual([1, 2, 3, 4]);
    });

    it('uses a custom comparator if provided', () => {
      expect(SortedArray.getUnique([9, 9, 8, 7, 6, 6], customComparator)).toEqual([9, 8, 7, 6]);
    });

    it('returns the unique values in a given container', () => {
      expect(SortedArray.getUnique([1, 1, 2, 3, 3, 4]) instanceof SortedArray).toBe(false);
      expect(SortedArray.getUnique([1, 1, 2, 3, 3, 4], undefined, [])).toEqual([1, 2, 3, 4]);
      expect(SortedArray.getUnique(
        [1, 1, 2, 3, 3, 4], undefined, new SortedArray(),
      ) instanceof SortedArray).toBe(true);
    });
  });

  describe('of', () => {
    it('creates a sorted array from provided arguments', () => {
      expect(SortedArray.of(2, 1, 5, 3, 80, 9)).toEqual(new SortedArray([1, 2, 3, 5, 9, 80]));
      expect(SortedArray.of(2)).toEqual(new SortedArray([2]));
    });
  });

  describe('isSorted', () => {
    it('checks if the array is sorted according to a provided comparator', () => {
      expect(SortedArray.isSorted(first)).toBe(true);
      expect(SortedArray.isSorted(inversedFirst)).toBe(false);
      expect(SortedArray.isSorted(inversedFirst, customComparator)).toBe(true);
      expect(SortedArray.isSorted([])).toBe(true);
      expect(SortedArray.isSorted([0])).toBe(true);
    });
  });

  describe('isUnique', () => {
    it('checks if an array has duplicating elements', () => {
      expect(SortedArray.isUnique([1, 2, 3])).toBe(true);
      expect(SortedArray.isUnique([1, 1, 2, 3, 4])).toBe(false);
      expect(SortedArray.isUnique([1, 2, 3, 3, 4, 5])).toBe(false);
    });
  });
});
