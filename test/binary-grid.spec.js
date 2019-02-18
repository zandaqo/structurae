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

  describe('getBit', () => {
    it('returns individual bits', () => {
      const grid = new BinaryGrid({}, [1]);
      expect(grid.getBit(0, 0)).toBe(1);
      expect(grid.getBit(0, 1)).toBe(0);
    });
  });

  describe('setBit', () => {
    it('sets individual bets', () => {
      const grid = new BinaryGrid({ columns: 10, rows: 10 });
      expect(grid.getBit(0, 0)).toBe(0);
      expect(grid.getBit(0, 1)).toBe(0);
      expect(grid.getBit(1, 0)).toBe(0);
      expect(grid.getBit(1, 1)).toBe(0);
      grid.setBit(0, 0);
      grid.setBit(1, 1);
      expect(grid.getBit(0, 0)).toBe(1);
      expect(grid.getBit(0, 1)).toBe(0);
      expect(grid.getBit(1, 0)).toBe(0);
      expect(grid.getBit(1, 1)).toBe(1);
    });
  });

  describe('getRow', () => {
    it('gets all bits from a given row', () => {
      const grid = new BinaryGrid({ columns: 10, rows: 10 });
      grid.setBit(0, 1).setBit(0, 5).setBit(0, 9);
      expect(grid.getRow(0)).toEqual([0, 1, 0, 0, 0, 1, 0, 0, 0, 1]);
    });
  });

  describe('getColumn', () => {
    it('gets all bits from a given column', () => {
      const grid = new BinaryGrid({ columns: 10, rows: 10 });
      grid.setBit(1, 0).setBit(5, 0).setBit(9, 0);
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
