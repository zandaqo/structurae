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

    it('proxies to TypedArray#set if array like parameter is supplied', () => {
      const grid = new BinaryGrid({ columns: 48, rows: 1 });
      grid.set([1, 2, 3]);
      expect(Array.from(grid)).toEqual([1, 2, 3, 0]);
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
