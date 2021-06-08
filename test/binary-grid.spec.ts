import { BinaryGrid } from "../src/binary-grid";

describe("BinaryGrid", () => {
  describe("constructor", () => {
    it("creates a BinaryGrid from existing data with default dimensions", () => {
      const grid = new BinaryGrid([10]);
      grid.columns = 32;
      expect(grid.length).toBe(1);
      expect(grid.columns).toBe(32);
      expect(grid.rows).toBe(1);
    });
  });

  describe("create", () => {
    it("creates a BinaryGrid instance with provided dimensions", () => {
      const grid = BinaryGrid.create(1, 64);
      expect(grid instanceof Uint32Array).toBe(true);
      expect(grid.columns).toBe(64);
      expect(grid.length).toBe(2);
      expect(grid.rows).toBe(1);
    });

    it("creates a BinaryGrid instance fitting into a single integer", () => {
      const grid = BinaryGrid.create(1, 6);
      expect(grid.columns).toBe(8);
      expect(grid.length).toBe(1);
    });
  });

  describe("columns", () => {
    it("changes dimensions of an existing BinaryGrid by setting the minum column size", () => {
      const grid = new BinaryGrid([1, 2, 3]);
      grid.columns = 32;
      expect(grid.columns).toBe(32);
      expect(grid.rows).toBe(3);
      grid.columns = 40;
      expect(grid.columns).toBe(64);
      expect(grid.rows).toBe(1);
    });
  });

  describe("get", () => {
    it("returns individual bits", () => {
      const grid = new BinaryGrid([1]);
      expect(grid.getValue(0, 0)).toBe(1);
      expect(grid.getValue(0, 1)).toBe(0);
    });
  });

  describe("set", () => {
    it("sets individual bets", () => {
      const grid = BinaryGrid.create(10, 10);
      expect(grid.getValue(0, 0)).toBe(0);
      expect(grid.getValue(0, 1)).toBe(0);
      expect(grid.getValue(1, 0)).toBe(0);
      expect(grid.getValue(1, 1)).toBe(0);
      grid.setValue(0, 0);
      grid.setValue(1, 1);
      expect(grid.getValue(0, 0)).toBe(1);
      expect(grid.getValue(0, 1)).toBe(0);
      expect(grid.getValue(1, 0)).toBe(0);
      expect(grid.getValue(1, 1)).toBe(1);
    });

    it("handles setting last bit of a bucket", () => {
      const grid = BinaryGrid.create(1, 32);
      expect(grid.getValue(0, 31)).toBe(0);
      grid.setValue(0, 31, 1);
      expect(grid.getValue(0, 31)).toBe(1);
    });
  });

  describe("toArrays", () => {
    it("returns the grid as an array of arrays where each array correspond to a row in the grid", () => {
      const grid = BinaryGrid.create(16, 16);
      const emptyArrays = grid.toArrays();
      expect(emptyArrays.length).toBe(16);
      expect(emptyArrays[0] instanceof BinaryGrid).toBe(false);
      expect(emptyArrays[0] instanceof Array).toBe(true);
      expect(emptyArrays[0].length).toBe(16);
    });
  });

  describe("getLength", () => {
    it("returns the length of underlying TypedArray required to hold the grid", () => {
      expect(BinaryGrid.getLength(10, 10)).toBe(5);
    });
  });

  describe("species", () => {
    it("returns Uint32Array when sliced", () => {
      const grid = new BinaryGrid();
      grid.setValue(0, 1, 1);
      expect(grid.slice() instanceof Uint32Array).toBe(true);
    });
  });
});
