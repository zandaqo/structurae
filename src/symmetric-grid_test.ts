import { SymmetricGridMixin } from "../src/symmetric-grid.ts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

const { test } = Deno;
const SymmetricGrid = SymmetricGridMixin(Int32Array);

test("[SymmetricGrid.constructor] creates an instance of grid with data", () => {
  const gridFromData = new SymmetricGrid([1, 2, 3]);
  gridFromData.columns = 2;
  assertEquals(gridFromData.length, 3);
  assertEquals(gridFromData[0], 1);
});

test("[SymmetricGrid.create] creates an instance of grid with dimensions if dimentions are provided", () => {
  const grid = SymmetricGrid.create(100);
  assertEquals(grid.length, 5050);
});

test("[SymmetricGrid.create] creates an instance of grid filling it with provided pad value", () => {
  const grid = SymmetricGrid.create(2);
  grid.fill(-1);
  assertEquals(grid.length, 3);
  assertEquals(grid[0], -1);
});

test("[SymmetricGrid#get] returns an item at given coordinates", () => {
  const grid = new SymmetricGrid([1, 2, 3, 4, 5, 6]);
  grid.columns = 3;
  assertEquals(grid.getValue(0, 0), 1);
  assertEquals(grid.getValue(0, 2), 4);
  assertEquals(grid.getValue(1, 2), 5);
  assertEquals(grid.getValue(10, 3), undefined);
  assertEquals(grid.getValue(2, 10), undefined);
});

test("[SymmetricGrid#set] sets an item at given coordinates", () => {
  const grid = SymmetricGrid.create(4);
  grid.setValue(0, 1, 10);
  grid.setValue(0, 3, 8);
  grid.setValue(0, 2, 9); // overflow, will set 1:0 to 9
  grid.setValue(1, 3, 7);
  assertEquals(grid.getValue(0, 1), 10);
  assertEquals(grid.getValue(0, 3), 8);
  assertEquals(grid.getValue(0, 2), 9);
  assertEquals(grid.getValue(1, 3), 7);
});

test("[SymmetricGrid#set] proxies to TypedArray#set if array like parameter is supplied", () => {
  const grid = SymmetricGrid.create(2);
  (grid as any).set([1, 2, 3]);
  assertEquals(Array.from(grid), [1, 2, 3]);
});

test("[SymmetricGrid#getCoordinates] returns coordinates of a given index", () => {
  const grid = SymmetricGrid.create(4);
  assertEquals(grid.getCoordinates(0), [0, 0]);
  assertEquals(grid.getCoordinates(6), [3, 0]);
  assertEquals(grid.getCoordinates(9), [3, 3]);
});

test("[SymmetricGrid.[Symbol.species]] returns instance of the base class when sliced", () => {
  const grid = SymmetricGrid.create(5);
  const slice = grid.slice(0, 10);
  assertEquals(slice instanceof SymmetricGrid, false);
  assertEquals(slice instanceof Int32Array, true);
});

test("[SymmetricGrid#toArrays]", () => {
  const arrays = [
    [1, 2, 4],
    [2, 3, 5],
    [4, 5, 6],
  ];
  const grid = SymmetricGrid.fromArrays(arrays);
  assertEquals(grid.toArrays(), arrays);
});

test("[SymmetricGrid.fromArrays] creates a grid from an array of arrays", () => {
  const grid = SymmetricGrid.fromArrays([
    [1, 2, 4],
    [2, 3, 5],
    [4, 5, 6],
  ]);
  assertEquals(grid instanceof SymmetricGrid, true);
  assertEquals(Array.from(grid), [1, 2, 3, 4, 5, 6]);
});

test("[SymmetricGrid#getIndex]returns an array index of an element at given coordinates", () => {
  const grid = SymmetricGrid.create(4);
  for (let i = 0; i < 4; i++) {
    assertEquals(grid.getIndex(i, 0), grid.getIndex(0, i));
    assertEquals(grid.getIndex(i, 1), grid.getIndex(1, i));
    assertEquals(grid.getIndex(i, 2), grid.getIndex(2, i));
    assertEquals(grid.getIndex(i, 3), grid.getIndex(3, i));
  }
  const indexes = [];
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      indexes.push(grid.getIndex(i, j));
    }
  }
  assertEquals(indexes, [0, 1, 3, 6, 1, 2, 4, 7, 3, 4, 5, 8, 6, 7, 8, 9]);
});

test("[SymmetricGrid.getLength] returns the length of underlying Array required to hold the grid", () => {
  assertEquals(SymmetricGrid.getLength(10), 55);
});
