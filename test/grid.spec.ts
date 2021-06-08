import { GridMixin } from "../src/grid";
//import { Constructor } from '../index';

describe("Grid", () => {
  //const ArrayGrid = GridMixin<string, Constructor<Array<string>>>(Array);
  const Int8Grid = GridMixin(Int8Array);
  const Uint32Grid = GridMixin(Uint32Array);

  describe("class factory", () => {
    it("creates a grid class extending given typed array", () => {
      expect(new Int8Grid() instanceof Int8Array).toBe(true);
      expect(new Uint32Grid() instanceof Uint32Array).toBe(true);
    });
  });

  describe("constructor", () => {
    it("creates an instance of grid with data", () => {
      const gridFromData = new Int8Grid([1, 2, 3, 4]);
      expect(gridFromData.columns).toBe(1);
      expect(gridFromData.rows).toBe(4);
      expect(gridFromData.length).toBe(4);
      expect(gridFromData[0]).toBe(1);
    });
  });

  describe("create", () => {
    it("creates an instance of grid with dimensions if dimensions are provided", () => {
      const grid = Int8Grid.create(10, 2);
      expect(grid.size).toBe(1);
      expect(grid.length).toBe(20);
    });
  });

  describe("set columns", () => {
    it("sets dimensions to existing grid", () => {
      const grid = new Uint32Grid();
      grid.columns = 5;
      expect(grid.size).toBe(3);
    });
  });

  describe("getIndex", () => {
    it("returns an array index of an element at given coordinates", () => {
      const grid = new Uint32Grid([1, 2, 3, 4, 5, 6, 7, 8]);
      grid.columns = 4;
      expect(grid.getIndex(0, 0)).toBe(0);
      expect(grid.getIndex(0, 3)).toBe(3);
      expect(grid.getIndex(1, 2)).toBe(6);
    });
  });

  describe("get", () => {
    it("returns an item at given coordinates", () => {
      const grid = new Uint32Grid([1, 2, 3, 4, 5, 6, 7, 8]);
      grid.columns = 4;
      expect(grid.getValue(0, 0)).toBe(1);
      expect(grid.getValue(0, 3)).toBe(4);
      expect(grid.getValue(1, 2)).toBe(7);
      expect(grid.getValue(0, 4)).toBe(grid.getValue(1, 0)); // overflow
      expect(grid.getValue(1, 3)).toBe(8);
      expect(grid.getValue(2, 0)).toBe(undefined);
    });
  });

  describe("set", () => {
    it("sets an item at given coordinates", () => {
      const grid = Uint32Grid.create(4, 4);
      grid.setValue(0, 1, 10);
      grid.setValue(0, 3, 8);
      grid.setValue(0, 5, 9); // overflow, will set 1:0 to 9
      grid.setValue(1, 3, 7);
      expect(grid.getValue(0, 1)).toBe(10);
      expect(grid.getValue(0, 3)).toBe(8);
      expect(grid.getValue(0, 5)).toBe(9);
      expect(grid.getValue(1, 3)).toBe(7);
    });
  });

  describe("getCoordinates", () => {
    it("returns coordinates of a given index", () => {
      const grid = Uint32Grid.create(4, 4);
      expect(grid.getCoordinates(0)).toEqual([0, 0]);
      expect(grid.getCoordinates(6)).toEqual([1, 2]);
      expect(grid.getCoordinates(13)).toEqual([3, 1]);
      expect(grid.getCoordinates(15)).toEqual([3, 3]);
    });
  });

  describe("species", () => {
    it("returns instance of the base class when sliced", () => {
      const grid = Uint32Grid.create(10, 10);
      const slice = grid.slice(0, 10);
      expect(slice instanceof Uint32Grid).toBe(false);
      expect(slice instanceof Uint32Array).toBe(true);
    });
  });

  describe("toArrays", () => {
    it("returns the grid as an array of arrays where each array correspond to a row in the grid", () => {
      const grid = Uint32Grid.create(4, 4);
      const emptyArrays = grid.toArrays();
      expect(emptyArrays.length).toBe(4);
      expect(emptyArrays[0] instanceof Uint32Grid).toBe(false);
      expect(emptyArrays[0] instanceof Array).toBe(true);
      expect(emptyArrays[0].length).toBe(4);
    });
  });

  describe("getLength", () => {
    it("returns the length of underlying Array required to hold the grid", () => {
      expect(Int8Grid.getLength(10, 10)).toBe(160);
      expect(Uint32Grid.getLength(10, 10)).toBe(160);
    });
  });

  describe("fromArrays", () => {
    const arrays = [
      [1, 2, 3],
      [4, 5],
      [6, 7, 8, 9],
    ];
    it("creates a grid from an array of arrays", () => {
      const grid = Uint32Grid.fromArrays(arrays);
      expect(grid.length).toBe(12);
      expect(grid.getValue(0, 1)).toBe(2);
      expect(grid.getValue(2, 3)).toBe(9);
      expect(grid.getValue(0, 3)).toBe(0);
    });

    it("pads created grid with the provided fill value", () => {
      const grid = Uint32Grid.fromArrays(arrays);
      expect(grid.length).toBe(12);
      expect(grid.getValue(0, 1)).toBe(2);
      expect(grid.getValue(0, 3)).toBe(0);
    });
  });
});
