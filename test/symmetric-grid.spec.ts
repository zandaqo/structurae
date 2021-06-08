import { SymmetricGridMixin } from '../src/symmetric-grid';

const SymmetricGrid = SymmetricGridMixin(Int32Array);

describe('SymmetricGrid', () => {
  describe('constructor', () => {
    it('creates an instance of grid with data', () => {
      const gridFromData = new SymmetricGrid([1, 2, 3]);
      gridFromData.columns = 2;
      expect(gridFromData.length).toBe(3);
      expect(gridFromData[0]).toBe(1);
    });
  });

  describe('create', () => {
    it('creates an instance of grid with dimensions if dimentions are provided', () => {
      const grid = SymmetricGrid.create(100);
      expect(grid.length).toBe(5050);
    });

    it('creates an instance of grid filling it with provided pad value', () => {
      const grid = SymmetricGrid.create(2);
      grid.fill(-1);
      expect(grid.length).toBe(3);
      expect(grid[0]).toBe(-1);
    });
  });

  describe('get', () => {
    it('returns an item at given coordinates', () => {
      const grid = new SymmetricGrid([1, 2, 3, 4, 5, 6]);
      grid.columns = 3;
      expect(grid.getValue(0, 0)).toBe(1);
      expect(grid.getValue(0, 2)).toBe(4);
      expect(grid.getValue(1, 2)).toBe(5);
      expect(grid.getValue(10, 3)).toBe(undefined);
      expect(grid.getValue(2, 10)).toBe(undefined);
    });
  });

  describe('set', () => {
    it('sets an item at given coordinates', () => {
      const grid = SymmetricGrid.create(4);
      grid.setValue(0, 1, 10);
      grid.setValue(0, 3, 8);
      grid.setValue(0, 2, 9); // overflow, will set 1:0 to 9
      grid.setValue(1, 3, 7);
      expect(grid.getValue(0, 1)).toBe(10);
      expect(grid.getValue(0, 3)).toBe(8);
      expect(grid.getValue(0, 2)).toBe(9);
      expect(grid.getValue(1, 3)).toBe(7);
    });

    it('proxies to TypedArray#set if array like parameter is supplied', () => {
      const grid = SymmetricGrid.create(2);
      (grid as any).set([1, 2, 3]);
      expect(Array.from(grid)).toEqual([1, 2, 3]);
    });
  });

  describe('getCoordinates', () => {
    it('returns coordinates of a given index', () => {
      const grid = SymmetricGrid.create(4);
      expect(grid.getCoordinates(0)).toEqual([0, 0]);
      expect(grid.getCoordinates(6)).toEqual([3, 0]);
      expect(grid.getCoordinates(9)).toEqual([3, 3]);
    });
  });

  describe('species', () => {
    it('returns instance of the base class when sliced', () => {
      const grid = SymmetricGrid.create(5);
      const slice = grid.slice(0, 10);
      expect(slice instanceof SymmetricGrid).toBe(false);
      expect(slice instanceof Int32Array).toBe(true);
    });
  });

  describe('toArrays', () => {
    it('', () => {
      const arrays = [
        [1, 2, 4],
        [2, 3, 5],
        [4, 5, 6],
      ];
      const grid = SymmetricGrid.fromArrays(arrays);
      expect(grid.toArrays()).toEqual(arrays);
    });
  });

  describe('fromArrays', () => {
    it('creates a grid from an array of arrays', () => {
      const grid = SymmetricGrid.fromArrays([
        [1, 2, 4],
        [2, 3, 5],
        [4, 5, 6],
      ]);
      expect(grid instanceof SymmetricGrid).toBe(true);
      expect(Array.from(grid)).toEqual([1, 2, 3, 4, 5, 6]);
    });
  });

  describe('getIndex', () => {
    it('returns an array index of an element at given coordinates', () => {
      const grid = SymmetricGrid.create(4);
      for (let i = 0; i < 4; i++) {
        expect(grid.getIndex(i, 0)).toEqual(grid.getIndex(0, i));
        expect(grid.getIndex(i, 1)).toEqual(grid.getIndex(1, i));
        expect(grid.getIndex(i, 2)).toEqual(grid.getIndex(2, i));
        expect(grid.getIndex(i, 3)).toEqual(grid.getIndex(3, i));
      }
      const indexes = [];
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          indexes.push(grid.getIndex(i, j));
        }
      }
      expect(indexes).toEqual([0, 1, 3, 6, 1, 2, 4, 7, 3, 4, 5, 8, 6, 7, 8, 9]);
    });
  });

  describe('getLength', () => {
    it('returns the length of underlying Array required to hold the grid', () => {
      expect(SymmetricGrid.getLength(10)).toBe(55);
    });
  });
});
