const SymmetricGridMixin = require('../lib/symmetric-grid');

const SymmetricGrid = SymmetricGridMixin(Int32Array);

describe('SymmetricGrid', () => {
  describe('constructor', () => {
    it('creates an instance of grid with default dimensions if no options or data are provided', () => {
      const grid = new SymmetricGrid();
      expect(grid.length).toBe(3);
      expect(grid[0]).toBe(0);
    });

    it('creates an instance of grid with dimensions if dimentions are provided', () => {
      const grid = new SymmetricGrid({ rows: 100 });
      expect(grid.length).toBe(5050);
    });

    it('creates an instance of grid filling it with provided pad value', () => {
      const grid = new SymmetricGrid({ rows: 2, pad: -1 });
      expect(grid.length).toBe(3);
      expect(grid[0]).toBe(-1);
    });

    it('creates an instance of grid with data', () => {
      const gridFromData = new SymmetricGrid({ rows: 2 }, [1, 2, 3]);
      expect(gridFromData.length).toBe(3);
      expect(gridFromData[0]).toBe(1);
    });
  });

  describe('get', () => {
    it('returns an item at given coordinates', () => {
      const grid = new SymmetricGrid({ rows: 3 }, [1, 2, 3, 4, 5, 6]);
      expect(grid.get(0, 0)).toBe(1);
      expect(grid.get(0, 2)).toBe(4);
      expect(grid.get(1, 2)).toBe(5);
      expect(grid.get(10, 3)).toBe(undefined);
      expect(grid.get(2, 10)).toBe(undefined);
    });
  });

  describe('set', () => {
    it('sets an item at given coordinates', () => {
      const grid = new SymmetricGrid({ rows: 4 });
      grid.set(0, 1, 10);
      grid.set(0, 3, 8);
      grid.set(0, 2, 9); // overflow, will set 1:0 to 9
      grid.set(1, 3, 7);
      expect(grid.get(0, 1)).toBe(10);
      expect(grid.get(0, 3)).toBe(8);
      expect(grid.get(0, 2)).toBe(9);
      expect(grid.get(1, 3)).toBe(7);
    });
  });

  describe('getCoordinates', () => {
    it('returns coordinates of a given index', () => {
      const grid = new SymmetricGrid({ rows: 4 });
      expect(grid.getCoordinates(0)).toBe(grid.lastCoordinates);
      expect(grid.getCoordinates(0)).toEqual({ row: 0, column: 0 });
      expect(grid.getCoordinates(6)).toEqual({ row: 3, column: 0 });
      expect(grid.getCoordinates(9)).toEqual({ row: 3, column: 3 });
    });
  });

  describe('species', () => {
    it('returns instance of the base class when sliced', () => {
      const grid = new SymmetricGrid({ rows: 5 });
      const slice = grid.slice(0, 10);
      expect(slice instanceof SymmetricGrid).toBe(false);
      expect(slice instanceof Int32Array).toBe(true);
    });
  });

  describe('toArrays', () => {
    it('', () => {
      const arrays = [[1, 2, 4], [2, 3, 5], [4, 5, 6]];
      const grid = SymmetricGrid.fromArrays(arrays);
      expect(grid.toArrays()).toEqual(arrays);
    });
  });


  describe('fromArrays', () => {
    it('creates a grid from an array of arrays', () => {
      const grid = SymmetricGrid.fromArrays([[1, 2, 4], [2, 3, 5], [4, 5, 6]]);
      expect(grid instanceof SymmetricGrid).toBe(true);
      expect(Array.from(grid)).toEqual([1, 2, 3, 4, 5, 6]);
    });
  });


  describe('getIndex', () => {
    it('returns an array index of an element at given coordinates', () => {
      for (let i = 0; i < 4; i++) {
        expect(SymmetricGrid.getIndex(i, 0)).toEqual(SymmetricGrid.getIndex(0, i));
        expect(SymmetricGrid.getIndex(i, 1)).toEqual(SymmetricGrid.getIndex(1, i));
        expect(SymmetricGrid.getIndex(i, 2)).toEqual(SymmetricGrid.getIndex(2, i));
        expect(SymmetricGrid.getIndex(i, 3)).toEqual(SymmetricGrid.getIndex(3, i));
      }
      const indexes = [];
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          indexes.push(SymmetricGrid.getIndex(i, j));
        }
      }
      expect(indexes).toEqual([0, 1, 3, 6, 1, 2, 4, 7, 3, 4, 5, 8, 6, 7, 8, 9]);
    });
  });

  describe('getLength', () => {
    it('returns the length of underlying Array required to hold the grid', () => {
      expect(SymmetricGrid.getLength(10, 10)).toBe(55);
    });
  });
});
