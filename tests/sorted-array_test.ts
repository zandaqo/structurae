import { SortedArray } from "../sorted-array.ts";
import { assertEquals, assertThrows } from "../dev_deps.ts";

const { test } = Deno;
const first = [1, 2, 3, 4, 8];
const second = [2, 4, 6, 7, 9];
const inversedFirst = [8, 4, 3, 2, 1];
const inversedSecond = [9, 7, 6, 4, 2];
const customComparator = <T>(a: T, b: T) => (a > b ? -1 : a < b ? 1 : 0);

test("[SortedArray.compare] compares two values", () => {
  assertEquals(SortedArray.compare(1, 2), -1);
  assertEquals(SortedArray.compare(1, 1), 0);
});

test("[SortedArray.compare] throws if comparison fails", () => {
  assertThrows(
    () => {
      //@ts-ignore TS2345
      SortedArray.compare("a", 1);
    },
    RangeError,
    "Unstable comparison.",
  );
});

test("[SortedArray#includes] checks if an item is in the array", () => {
  const sorted = new SortedArray<number>(...first);
  assertEquals(sorted.includes(3), true);
  assertEquals(sorted.includes(9), false);
});

test("[SortedArray#indexOf] returns the index of a given item", () => {
  const sorted = new SortedArray<number>(...first);
  assertEquals(sorted.indexOf(3), 2);
  assertEquals(sorted.indexOf(9), -1);
});

test("[SortedArray#isSorted] checks if the array is sorted according to a provided comparator", () => {
  const sorted = new SortedArray<number>(...first);
  assertEquals(sorted.isSorted(), true);
  sorted[0] = 100;
  assertEquals(sorted.isSorted(), false);
});

test("[SortedArray#isUnique] checks if the array has duplicating elements", () => {
  const sorted = new SortedArray<number>(...first);
  assertEquals(sorted.isUnique(), true);
  sorted.push(1);
  assertEquals(sorted.isUnique(), false);
});

test("[SortedArray#range] returns range", () => {
  const sorted = new SortedArray<number>(...first);
  assertEquals(sorted.range(2, 4), SortedArray.from([2, 3, 4]));
  assertEquals(sorted.range(2), SortedArray.from([2, 3, 4, 8]));
  assertEquals(sorted.range(undefined, 4), SortedArray.from([1, 2, 3, 4]));
});
test("[SortedArray#rank] returns the rank of an element in a sorted array", () => {
  const sorted = new SortedArray<number>(...first);
  assertEquals(sorted.rank(5), 4);
});

test("[SortedArray.from] creates a sorted array from an array-like object", () => {
  assertEquals(
    SortedArray.from([2, 1, 5, 3, 80, 9]),
    new SortedArray(1, 2, 3, 5, 9, 80),
  );
});

test("[SortedArray.getDifference] returns the difference of two sorted arrays", () => {
  assertEquals(SortedArray.getDifference(first, second), [1, 3, 8]);
});

test("[SortedArray.getDifference] returns the symmetric difference if `symmetric=true`", () => {
  assertEquals(SortedArray.getDifference(first, second, true), [
    1,
    3,
    6,
    7,
    8,
    9,
  ]);
});

test("[SortedArray.getDifference] returns the difference using a custom comparator", () => {
  assertEquals(
    SortedArray.getDifference(
      inversedFirst,
      inversedSecond,
      false,
      customComparator,
    ),
    [8, 3, 1],
  );
});

test("[SortedArray.getDifference] returns the difference in a given container", () => {
  assertEquals(
    SortedArray.getDifference(
      inversedFirst,
      inversedSecond,
      false,
      customComparator,
    ) instanceof SortedArray,
    false,
  );
  assertEquals(
    SortedArray.getDifference(
      inversedFirst,
      inversedSecond,
      false,
      customComparator,
      new SortedArray<number>(),
    ) instanceof SortedArray,
    true,
  );
});

test("[SortedArray.getDifferenceScore] returns the amount of elements in the second array differing from the first", () => {
  assertEquals(SortedArray.getDifferenceScore(first, second), 3);
});

test("[SortedArray.getDifferenceScore] returns the amount of elements not present in either array if `symmetric=true`", () => {
  assertEquals(SortedArray.getDifferenceScore(first, second, true), 6);
});

test("[SortedArray.getDifferenceScore] returns the difference score using a custom comparator", () => {
  assertEquals(
    SortedArray.getDifferenceScore(
      inversedFirst,
      inversedSecond,
      false,
      customComparator,
    ),
    3,
  );
});

test("[SortedArray.getIndex] returns the index of a given item in a sorted array", () => {
  assertEquals(SortedArray.getIndex(first, 4), 3);
});

test("[SortedArray.getIndex] uses custom comparator if provided", () => {
  assertEquals(SortedArray.getIndex(inversedFirst, 2, customComparator), 3);
});

test("[SortedArray.getIndex] returns the rank of an item if `rank=true`", () => {
  assertEquals(SortedArray.getIndex(first, 7, undefined, true), 4);
});

test("[SortedArray.getIntersection] returns the intersection of two sorted arrays", () => {
  assertEquals(SortedArray.getIntersection(first, second), [2, 4]);
});

test("[SortedArray.getIntersection] returns the intersection using a custom comparator", () => {
  assertEquals(
    SortedArray.getIntersection(
      inversedFirst,
      inversedSecond,
      customComparator,
    ),
    [4, 2],
  );
});

test("[SortedArray.getIntersection] returns the intersection in a given container", () => {
  assertEquals(
    SortedArray.getIntersection(
      inversedFirst,
      inversedSecond,
      customComparator,
    ) instanceof SortedArray,
    false,
  );
  assertEquals(
    SortedArray.getIntersection(
      inversedFirst,
      inversedSecond,
      customComparator,
      new SortedArray<number>(),
    ) instanceof SortedArray,
    true,
  );
});

test("[SortedArray.getIntersectionScore] returns the amount of common elements in two sorted arrays", () => {
  assertEquals(SortedArray.getIntersectionScore(first, second), 2);
});

test("[SortedArray.getIntersectionScore] returns the intersection score using a custom comparator", () => {
  assertEquals(
    SortedArray.getIntersectionScore(
      inversedFirst,
      inversedSecond,
      customComparator,
    ),
    2,
  );
});

test("[SortedArray.getRange] returns range", () => {
  assertEquals(SortedArray.getRange(first, 2, 4), [2, 3, 4]);
  assertEquals(SortedArray.getRange(first, 2), [2, 3, 4, 8]);
  assertEquals(SortedArray.getRange(first, undefined, 4), [1, 2, 3, 4]);
});

test("[SortedArray.getRange] uses custom comparator if provided", () => {
  assertEquals(SortedArray.getRange(inversedFirst, 8, 3, customComparator), [
    8,
    4,
    3,
  ]);
  assertEquals(
    SortedArray.getRange(inversedFirst, 4, undefined, customComparator),
    [4, 3, 2, 1],
  );
  assertEquals(
    SortedArray.getRange(inversedFirst, undefined, 2, customComparator),
    [8, 4, 3, 2],
  );
});

test("[SortedArray.getRange] returns a range as a subarray if `subarray` true", () => {
  const typedArray = Uint32Array.from(first);
  const range = SortedArray.getRange(typedArray, 2, 4, undefined, true);
  assertEquals(range instanceof Uint32Array, true);
  assertEquals(Array.from(range), [2, 3, 4]);
  assertEquals(range.buffer === typedArray.buffer, true);
});

test("[SortedArray.getUnion] returns the union of two sorted arrays", () => {
  assertEquals(SortedArray.getUnion(first, second), [
    1,
    2,
    2,
    3,
    4,
    4,
    6,
    7,
    8,
    9,
  ]);
});

test("[SortedArray.getUnion] returns the union of two arrays without duplicates if `unique=true`", () => {
  assertEquals(SortedArray.getUnion(first, second, true), [
    1,
    2,
    3,
    4,
    6,
    7,
    8,
    9,
  ]);
});

test("[SortedArray.getUnion] returns the union using a custom comparator", () => {
  assertEquals(
    SortedArray.getUnion(
      inversedFirst,
      inversedSecond,
      true,
      customComparator,
    ),
    [9, 8, 7, 6, 4, 3, 2, 1],
  );
});

test("[SortedArray.getUnion] returns the union in a given container", () => {
  assertEquals(
    SortedArray.getUnion(
      inversedFirst,
      inversedSecond,
      true,
      customComparator,
    ) instanceof SortedArray,
    false,
  );
  assertEquals(
    SortedArray.getUnion(
      inversedFirst,
      inversedSecond,
      true,
      customComparator,
      new SortedArray<number>(),
    ) instanceof SortedArray,
    true,
  );
});

test("[SortedArray.getUnique] returns an array of unique elements from a sorted array", () => {
  assertEquals(SortedArray.getUnique([1, 1, 2, 3, 3, 4]), [1, 2, 3, 4]);
});

test("[SortedArray.getUnique] uses a custom comparator if provided", () => {
  assertEquals(
    SortedArray.getUnique([9, 9, 8, 7, 6, 6], customComparator),
    [9, 8, 7, 6],
  );
});

test("[SortedArray.getUnique] returns the unique values in a given container", () => {
  assertEquals(
    SortedArray.getUnique([1, 1, 2, 3, 3, 4]) instanceof SortedArray,
    false,
  );
  assertEquals(SortedArray.getUnique([1, 1, 2, 3, 3, 4], undefined, []), [
    1,
    2,
    3,
    4,
  ]);
  assertEquals(
    SortedArray.getUnique(
      [1, 1, 2, 3, 3, 4],
      undefined,
      new SortedArray<number>(),
    ) instanceof SortedArray,
    true,
  );
});

test("[SortedArray.of] creates a sorted array from provided arguments", () => {
  assertEquals(
    SortedArray.of(2, 1, 5, 3, 80, 9),
    new SortedArray(1, 2, 3, 5, 9, 80),
  );
  assertEquals(SortedArray.of(2), SortedArray.from([2]));
});

test("[SortedArray.isSorted] checks if the array is sorted according to a provided comparator", () => {
  assertEquals(SortedArray.isSorted(first), true);
  assertEquals(SortedArray.isSorted(inversedFirst), false);
  assertEquals(SortedArray.isSorted(inversedFirst, customComparator), true);
  assertEquals(SortedArray.isSorted([]), true);
  assertEquals(SortedArray.isSorted([0]), true);
});

test("[SortedArray.isUnique] checks if an array has duplicating elements", () => {
  assertEquals(SortedArray.isUnique([1, 2, 3]), true);
  assertEquals(SortedArray.isUnique([1, 1, 2, 3, 4]), false);
  assertEquals(SortedArray.isUnique([1, 2, 3, 3, 4, 5]), false);
});

test("[SortedArray.concat] returns a sorted combination of two arrays", () => {
  assertEquals(Array.from(new SortedArray(...first).concat(second)), [
    1,
    2,
    2,
    3,
    4,
    4,
    6,
    7,
    8,
    9,
  ]);
});

test("[SortedArray.concat] returns a sorted set of two sets if `unique=true`", () => {
  const sorted = new SortedArray<number>(...first);
  sorted.unique = true;
  assertEquals(Array.from(sorted.concat(second)), [
    1,
    2,
    3,
    4,
    6,
    7,
    8,
    9,
  ]);
});

test("[SortedArray.push] adds an element to an empty array", () => {
  const a = new SortedArray<number>();
  assertEquals(a.push(1), 1);
  assertEquals(Array.from(a), [1]);
});

test("[SortedArray.push] adds an item to the array preserving the order", () => {
  const sorted = new SortedArray<number>(...first);
  assertEquals(sorted.push(5), 6);
  assertEquals(Array.from(sorted), [1, 2, 3, 4, 5, 8]);
});

test("[SortedArray.push] does not add duplicating elements if `unique=true`", () => {
  const sorted = new SortedArray<number>(...first);
  sorted.unique = true;
  assertEquals(sorted.push(5), 6);
  assertEquals(sorted.push(1), 6);
  assertEquals(Array.from(sorted), [1, 2, 3, 4, 5, 8]);
});

test("[SortedArray.push] adds multiple items to the array preserving the order", () => {
  const sorted = new SortedArray<number>(...first);
  assertEquals(
    sorted.push(4, 3, 2, 2, 5, 7, 1, 1, 1, 0, 9, 9, 9, 9, 9, 9, 9),
    22,
  );
  assertEquals(Array.from(sorted), [
    0,
    1,
    1,
    1,
    1,
    2,
    2,
    2,
    3,
    3,
    4,
    4,
    5,
    7,
    8,
    9,
    9,
    9,
    9,
    9,
    9,
    9,
  ]);
});

test("[SortedArray.push] adds multiple elements without duplicating if `unique-true`", () => {
  const sorted = new SortedArray<number>(...first);
  sorted.unique = true;
  assertEquals(sorted.push(5, 1, 2, 2, 7, 6), 8);
  assertEquals(Array.from(sorted), [1, 2, 3, 4, 5, 6, 7, 8]);
});

test("[SortedArray.set] replaces the elements of the array", () => {
  const sorted = new SortedArray<number>(...first);
  assertEquals(Array.from(sorted.set(second)), second);
});

test("[SortedArray.splice] removes specified amount of elements starting from a given index", () => {
  const sorted = new SortedArray<number>(...first);
  assertEquals(Array.from(sorted.splice(0, 2)), [1, 2]);
  assertEquals(Array.from(sorted), [3, 4, 8]);
});

test("[SortedArray.splice] adds new elements preserving order", () => {
  const sorted = new SortedArray<number>(...first);
  assertEquals(Array.from(sorted.splice(1, 1, 3, 4)), [2]);
  assertEquals(Array.from(sorted), [1, 3, 3, 4, 4, 8]);
});

test("[SortedArray.uniquify] removes duplicates from the array", () => {
  const unique = SortedArray.from([1, 2, 2, 3, 4, 5, 3, 1, 5, 9]);
  unique.uniquify();
  assertEquals(Array.from(unique), [1, 2, 3, 4, 5, 9]);
});

test("[SortedArray.unshift] adds elemets to the array preserving order", () => {
  const sorted = new SortedArray<number>(...first);
  assertEquals(sorted.unshift(5, 0, 9), 8);
  assertEquals(Array.from(sorted), [0, 1, 2, 3, 4, 5, 8, 9]);
});
