import { BinaryGrid } from "../binary-grid.ts";
import { assertEquals } from "./test_deps.ts";

const { test } = Deno;
test("[BinaryGrid.constructor] creates a BinaryGrid from existing data with default dimensions", () => {
  const grid = new BinaryGrid([10]);
  grid.columns = 32;
  assertEquals(grid.length, 1);
  assertEquals(grid.columns, 32);
  assertEquals(grid.rows, 1);
});

test("[BinaryGrid.create] creates a BinaryGrid instance with provided dimensions", () => {
  const grid = BinaryGrid.create(1, 64);
  assertEquals(grid instanceof Uint32Array, true);
  assertEquals(grid.columns, 64);
  assertEquals(grid.length, 2);
  assertEquals(grid.rows, 1);
});

test("[BinaryGrid.create] creates a BinaryGrid instance fitting into a single integer", () => {
  const grid = BinaryGrid.create(1, 6);
  assertEquals(grid.columns, 8);
  assertEquals(grid.length, 1);
});

test("[BinaryGrid.fromArrays] creates a BinaryGrid from an array of arrays", () => {
  const grid = BinaryGrid.fromArrays([[1, 0], [0, 1, 1]]);
  assertEquals(grid.columns, 4);
  assertEquals(grid.rows, 8);
  assertEquals(grid.getValue(0, 0), 1);
  assertEquals(grid.getValue(0, 1), 0);
  assertEquals(grid.getValue(1, 1), 1);
});

test("[BinaryGrid#columns] changes dimensions of an existing BinaryGrid by setting the minum column size", () => {
  const grid = new BinaryGrid([1, 0, 1]);
  grid.columns = 32;
  assertEquals(grid.columns, 32);
  assertEquals(grid.rows, 3);
  grid.columns = 40;
  assertEquals(grid.columns, 64);
  assertEquals(grid.rows, 1);
});

test("[BinaryGrid#get] returns individual bits", () => {
  const grid = new BinaryGrid([1]);
  assertEquals(grid.getValue(0, 0), 1);
  assertEquals(grid.getValue(0, 1), 0);
});

test("[BinaryGrid#getIndex] returns the index of an item holding the bit at given coordinates", () => {
  const grid = BinaryGrid.create(8, 8);
  assertEquals(grid.length, 2);
  assertEquals(grid.getIndex(0, 0), 0);
  assertEquals(grid.getIndex(1, 8), 0);
  assertEquals(grid.getIndex(4, 4), 1);
});

test("[BinaryGrid#set] sets individual bets", () => {
  const grid = BinaryGrid.create(10, 10);
  assertEquals(grid.getValue(0, 0), 0);
  assertEquals(grid.getValue(0, 1), 0);
  assertEquals(grid.getValue(1, 0), 0);
  assertEquals(grid.getValue(1, 1), 0);
  grid.setValue(0, 0);
  grid.setValue(1, 1);
  assertEquals(grid.getValue(0, 0), 1);
  assertEquals(grid.getValue(0, 1), 0);
  assertEquals(grid.getValue(1, 0), 0);
  assertEquals(grid.getValue(1, 1), 1);
});

test("[BinaryGrid#set] handles setting last bit of a bucket", () => {
  const grid = BinaryGrid.create(1, 32);
  assertEquals(grid.getValue(0, 31), 0);
  grid.setValue(0, 31, 1);
  assertEquals(grid.getValue(0, 31), 1);
});

test("[BinaryGrid#toArrays] returns the grid as an array of arrays where each array correspond to a row in the grid", () => {
  const grid = BinaryGrid.create(16, 16);
  const emptyArrays = grid.toArrays();
  assertEquals(emptyArrays.length, 16);
  assertEquals(emptyArrays[0] instanceof BinaryGrid, false);
  assertEquals(emptyArrays[0] instanceof Array, true);
  assertEquals(emptyArrays[0].length, 16);
});

test("[BinaryGrid.getLength] returns the length of underlying TypedArray required to hold the grid", () => {
  assertEquals(BinaryGrid.getLength(10, 10), 5);
});

test("[BinaryGrid.$species] returns Uint32Array when sliced", () => {
  const grid = new BinaryGrid();
  assertEquals(grid.slice() instanceof Uint32Array, true);
  assertEquals(BinaryGrid[Symbol.species], Uint32Array);
});
