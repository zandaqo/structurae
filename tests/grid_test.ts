import { GridMixin } from "../grid.ts";
import { assertEquals } from "../dev_deps.ts";

const { test } = Deno;

const Int8Grid = GridMixin(Int8Array);
const Uint32Grid = GridMixin(Uint32Array);

test("[Grid.constructor] creates an instance of grid with data", () => {
  const gridFromData = new Int8Grid([1, 2, 3, 4]);
  assertEquals(gridFromData.columns, 1);
  assertEquals(gridFromData.rows, 4);
  assertEquals(gridFromData.length, 4);
  assertEquals(gridFromData[0], 1);
});

test("[Grid.create] creates an instance of grid with dimensions if dimensions are provided", () => {
  const grid = Int8Grid.create(10, 2);
  assertEquals(grid.size, 1);
  assertEquals(grid.length, 20);
});

test("[Grid.fromArrays] creates a grid from an array of arrays", () => {
  const arrays = [
    [1, 2, 3],
    [4, 5],
    [6, 7, 8, 9],
  ];
  const grid = Uint32Grid.fromArrays(arrays);
  assertEquals(grid.length, 12);
  assertEquals(grid.getValue(0, 1), 2);
  assertEquals(grid.getValue(2, 3), 9);
  assertEquals(grid.getValue(0, 3), 0);
});

test("[Grid.getLength] returns the length of underlying Array required to hold the grid", () => {
  assertEquals(Int8Grid.getLength(10, 10), 160);
  assertEquals(Uint32Grid.getLength(10, 10), 160);
});

test("[Grid#columns] sets dimensions to existing grid", () => {
  const grid = new Uint32Grid();
  grid.columns = 5;
  assertEquals(grid.size, 3);
});

test("[Grid#getIndex] returns an array index of an element at given coordinates", () => {
  const grid = new Uint32Grid([1, 2, 3, 4, 5, 6, 7, 8]);
  grid.columns = 4;
  assertEquals(grid.getIndex(0, 0), 0);
  assertEquals(grid.getIndex(0, 3), 3);
  assertEquals(grid.getIndex(1, 2), 6);
});

test("[Grid#get] returns an item at given coordinates", () => {
  const grid = new Uint32Grid([1, 2, 3, 4, 5, 6, 7, 8]);
  grid.columns = 4;
  assertEquals(grid.getValue(0, 0), 1);
  assertEquals(grid.getValue(0, 3), 4);
  assertEquals(grid.getValue(1, 2), 7);
  assertEquals(grid.getValue(0, 4), grid.getValue(1, 0)); // overflow
  assertEquals(grid.getValue(1, 3), 8);
  assertEquals(grid.getValue(2, 0), undefined);
});

test("[Grid#set] sets an item at given coordinates", () => {
  const grid = Uint32Grid.create(4, 4);
  grid.setValue(0, 1, 10);
  grid.setValue(0, 3, 8);
  grid.setValue(0, 5, 9); // overflow, will set 1:0 to 9
  grid.setValue(1, 3, 7);
  assertEquals(grid.getValue(0, 1), 10);
  assertEquals(grid.getValue(0, 3), 8);
  assertEquals(grid.getValue(0, 5), 9);
  assertEquals(grid.getValue(1, 3), 7);
});

test("[Grid#getCoordinates] returns coordinates of a given index", () => {
  const grid = Uint32Grid.create(4, 4);
  assertEquals(grid.getCoordinates(0), [0, 0]);
  assertEquals(grid.getCoordinates(6), [1, 2]);
  assertEquals(grid.getCoordinates(13), [3, 1]);
  assertEquals(grid.getCoordinates(15), [3, 3]);
});

test("[Grid.[Symbol.species]] returns instance of the base class when sliced", () => {
  const grid = Uint32Grid.create(10, 10);
  const slice = grid.slice(0, 10);
  assertEquals(slice instanceof Uint32Grid, false);
  assertEquals(slice instanceof Uint32Array, true);
});

test("[Grid#toArrays] returns the grid as an array of arrays where each array correspond to a row in the grid", () => {
  const grid = Uint32Grid.create(4, 4);
  const emptyArrays = grid.toArrays();
  assertEquals(emptyArrays.length, 4);
  assertEquals(emptyArrays[0] instanceof Uint32Grid, false);
  assertEquals(emptyArrays[0] instanceof Array, true);
  assertEquals(emptyArrays[0].length, 4);
});
