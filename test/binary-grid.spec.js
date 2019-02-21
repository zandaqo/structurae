const BinaryGrid = require('../lib/binary-grid');

describe('BinaryGrid', () => {
  describe('constructor', () => {
    it('creates a BinaryGrid instance', () => {
      const grid = new BinaryGrid();
      expect(grid instanceof Uint16Array).toBe(true);
      expect(grid.offset).toBe(4);
      expect(grid.length).toBe(1);
    });

    it('creates a BinaryGrid from existing data', () => {
      const grid = new BinaryGrid({ columns: 6 }, [10]);
      expect(grid[0]).toBe(10);
      expect(grid.length).toBe(1);
      expect(grid.offset).toBe(3);
    });
  });

  describe('get', () => {
    it('returns individual bits', () => {
      const grid = new BinaryGrid({}, [1]);
      expect(grid.get(0, 0)).toBe(1);
      expect(grid.get(0, 1)).toBe(0);
    });
  });

  describe('set', () => {
    it('sets individual bets', () => {
      const grid = new BinaryGrid({ columns: 10, rows: 10 });
      expect(grid.get(0, 0)).toBe(0);
      expect(grid.get(0, 1)).toBe(0);
      expect(grid.get(1, 0)).toBe(0);
      expect(grid.get(1, 1)).toBe(0);
      grid.set(0, 0);
      grid.set(1, 1);
      expect(grid.get(0, 0)).toBe(1);
      expect(grid.get(0, 1)).toBe(0);
      expect(grid.get(1, 0)).toBe(0);
      expect(grid.get(1, 1)).toBe(1);
    });
  });

  describe('setArray', () => {
    it('stores multiple values in the underlying typed array, reading input values from a specified array', () => {
      const grid = new BinaryGrid({ columns: 16, rows: 3 });
      grid.setArray([0, 1, 3]);
      expect(Array.from(grid)).toEqual([0, 1, 3]);
    });
  });

  describe('getRow', () => {
    it('gets all bits from a given row', () => {
      const grid = new BinaryGrid({ columns: 10, rows: 10 });
      grid.set(0, 1).set(0, 5).set(0, 9);
      expect(grid.getRow(0)).toEqual([0, 1, 0, 0, 0, 1, 0, 0, 0, 1]);
    });
  });

  describe('getColumn', () => {
    it('gets all bits from a given column', () => {
      const grid = new BinaryGrid({ columns: 10, rows: 10 });
      grid.set(1, 0).set(5, 0).set(9, 0);
      expect(grid.getColumn(0)).toEqual([0, 1, 0, 0, 0, 1, 0, 0, 0, 1]);
    });
  });

  describe('getLength', () => {
    it('returns the length of underlying TypedArray required to hold the grid', () => {
      expect(BinaryGrid.getLength(10, 10)).toBe(10);
    });
  });


  describe('species', () => {
    it('returns Uint16Array when sliced', () => {
      const grid = new BinaryGrid();
      expect(grid.slice() instanceof Uint16Array).toBe(true);
    });
  });
});
