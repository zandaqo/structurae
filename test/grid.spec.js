const Grid = require('../lib/grid');

describe('Grid', () => {
  const Int8Grid = Grid(Int8Array);
  const Uint32Grid = Grid(Uint32Array);

  describe('class factory', () => {
    it('creates a grid class extending given typed array', () => {
      expect(new Int8Grid() instanceof Int8Array).toBe(true);
      expect(new Uint32Grid() instanceof Uint32Array).toBe(true);
    });
  });


  describe('constructor', () => {
    it('creates an instance of grid with dimensions if dimentions are provided', () => {
      const grid = new Int8Grid({ rows: 2, columns: 10 });
      expect(grid.offset).toBe(4);
      expect(grid.length).toBe(32);
    });

    it('creates an instance of grid filling it with provided pad value', () => {
      const grid = new Int8Grid({ rows: 2, columns: 10, pad: -1 });
      expect(grid.offset).toBe(4);
      expect(grid.length).toBe(32);
      expect(grid[0]).toBe(-1);
    });

    it('creates an instance of grid without dimensions', () => {
      const emptyGrid = new Int8Grid();
      expect(emptyGrid.offset).toBe(0);
      expect(emptyGrid.length).toBe(0);
      const gridFromData = new Int8Grid([1, 2, 4, 6]);
      expect(gridFromData.offset).toBe(0);
      expect(gridFromData.length).toBe(4);
      const gridFromLength = new Int8Grid(10);
      expect(gridFromLength.offset).toBe(0);
      expect(gridFromLength.length).toBe(10);
    });
  });

  describe('setColumns', () => {
    it('sets dimensions to existing grid', () => {
      const grid = new Uint32Grid(10);
      grid.setColumns(5);
      expect(grid.offset).toBe(3);
    });
  });

  describe('get', () => {
    it('returns an item at given coordinates', () => {
      const grid = new Uint32Grid([1, 2, 3, 4, 5, 6, 7, 8]);
      grid.setColumns(4);
      expect(grid.get(0, 0)).toBe(1);
      expect(grid.get(0, 3)).toBe(4);
      expect(grid.get(1, 2)).toBe(7);
      expect(grid.get(0, 4)).toBe(grid.get(1, 0)); // overflow
      expect(grid.get(1, 3)).toBe(8);
      expect(grid.get(2, 0)).toBe(undefined);
    });
  });

  describe('set', () => {
    it('sets an item at given coordinates', () => {
      const grid = new Uint32Grid({ rows: 4, columns: 4 });
      grid.set(0, 1, 10);
      grid.set(0, 3, 8);
      grid.set(0, 5, 9); // overflow, will set 1:0 to 9
      grid.set(1, 3, 7);
      expect(grid.get(0, 1)).toBe(10);
      expect(grid.get(0, 3)).toBe(8);
      expect(grid.get(0, 5)).toBe(9);
      expect(grid.get(1, 3)).toBe(7);
    });
  });

  describe('getCoordinates', () => {
    it('returns coordinates of a given index', () => {
      const grid = new Uint32Grid({ rows: 4, columns: 4 });
      expect(grid.getCoordinates(0)).toEqual([0, 0]);
      expect(grid.getCoordinates(6)).toEqual([1, 2]);
      expect(grid.getCoordinates(13)).toEqual([3, 1]);
      expect(grid.getCoordinates(15)).toEqual([3, 3]);
    });
  });

  describe('toArrays', () => {
    it('returns the grid as an array of arrays where each array correspond to a row in the grid', () => {
      const grid = new Uint32Grid({ rows: 4, columns: 4 });
      const emptyArrays = grid.toArrays(true);
      expect(emptyArrays.length).toBe(4);
      expect(emptyArrays[0] instanceof Uint32Grid).toBe(false);
      expect(emptyArrays[0] instanceof Uint32Array).toBe(true);
      expect(emptyArrays[0].length).toBe(4);
    });

    it('', () => {
      const arrays = [[1, 2, 3], [4, 5], [6, 7, 8, 9]];
      const grid = Uint32Grid.fromArrays(arrays);
      const arraysFromGrid = grid.toArrays();
      expect(arraysFromGrid.length).toBe(3);
      expect(arraysFromGrid[0].length).toBe(3);
      expect(arraysFromGrid[1].length).toBe(2);
      expect(arraysFromGrid[2].length).toBe(4);
    });
  });


  describe('fromArrays', () => {
    const arrays = [[1, 2, 3], [4, 5], [6, 7, 8, 9]];
    it('creates a grid from an array of arrays', () => {
      const grid = Uint32Grid.fromArrays(arrays);
      expect(grid.length).toBe(12);
      expect(grid.get(0, 1)).toBe(2);
      expect(grid.get(2, 3)).toBe(9);
      expect(grid.get(0, 3)).toBe(0);
    });

    it('pads created grid with the provided fill value', () => {
      const grid = Uint32Grid.fromArrays(arrays, 10);
      expect(grid.length).toBe(12);
      expect(grid.pad).toBe(10);
      expect(grid.get(0, 1)).toBe(2);
      expect(grid.get(0, 3)).toBe(10);
      expect(grid.get(1, 2)).toBe(10);
    });
  });
});
