import {
  Constructor,
  IndexedCollection,
  TypedArrayConstructors,
} from "./types";

/**
 * Creates a SymmetricGrid class extending a given Array-like class.
 */
export function SymmetricGridMixin<
  ItemType = number,
  U extends Constructor<Array<ItemType>> | TypedArrayConstructors = Constructor<
    Array<ItemType>
  >
>(Base: U) {
  interface SymmetricGrid extends IndexedCollection<ItemType> {}
  /**
   * A grid to handle symmetric or triangular matrices
   * using half the space required for a normal grid.
   */
  class SymmetricGrid extends Base {
    size = 0;

    static get [Symbol.species]() {
      return Base;
    }

    /**
     * Number of columns in the grid.
     */
    get columns() {
      return this.size;
    }

    /**
     * Specifies the number of columns of the grid.
     */
    set columns(columns) {
      this.size = columns;
    }

    /**
     * Number of rows in the grid.
     */
    get rows() {
      return this.size;
    }

    static create<T extends typeof SymmetricGrid>(
      this: T,
      columns: number
    ): InstanceType<T> {
      const length = this.getLength(columns);
      const grid = new this(length);
      grid.size = columns;
      return grid as InstanceType<T>;
    }

    /**
     * Creates a grid from an array of arrays.
     *
     * @example
     * const a = SymmetricGrid.from([[1, 2, 4], [2, 3, 5], [4, 5, 6]])
     * //=> SymmetricGrid [1, 2, 3, 4, 5, 6]
     * a.get(1, 0);
     * //=> 2
     * a.get(2, 1);
     * //=> 4
     */
    static fromArrays<T extends typeof SymmetricGrid>(
      this: T,
      arrays: Array<Array<ItemType>>
    ): InstanceType<T> {
      const rows = arrays.length;
      const grid = this.create(rows);
      let k = 0;
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j <= i; j++) {
          grid[k] = arrays[i][j];
          k++;
        }
      }
      return grid;
    }

    /**
     * Returns the length of underlying Array required to hold the grid.
     */
    static getLength(rows: number): number {
      return ((rows + 1) * rows) >> 1;
    }

    /**
     * Gets coordinates of an element at specified index.
     *
     * @example
     * const a = SymmetricGrid({ rows: 3, pad: 3});
     * a.getCoordinates(1);
     * //=> [0, 1]
     * a.getCoordinates(2);
     * //=> [1, 1]
     */
    getCoordinates(index: number): [row: number, column: number] {
      const row = (Math.sqrt((index << 3) + 1) - 1) >> 1;
      const column = index - ((row * (row + 1)) >> 1);
      return [row, column];
    }

    /**
     * Returns an array index of an element at given coordinates.
     * @example
     *
     * const a = ArrayGrid({ rows: 3, columns: 2, pad: 3});
     * a.get(1, 0);
     * //=> 2
     */
    getIndex(row: number, column: number): number {
      const [x, y] = row >= column ? [column, row] : [row, column];
      return x + (((y + 1) * y) >> 1);
    }

    /**
     * Returns an element from given coordinates.
     *
     * @example
     *
     * const a = SymmetricGrid({ rows: 3, pad: 3});
     * a.get(0, 1);
     * //=> 3
     */
    getValue(row: number, column: number): ItemType {
      return this[this.getIndex(row, column)];
    }

    /**
     * Sets the element at given coordinates.
     * Proxies to TypedArray#set if the first parameter is Array-like
     * and the grid is based on a TypedArray.
     *
     * @example
     *
     * const a = SymmetricGrid({ rows: 3, pad: 3});
     * a.set(0, 1, 5);
     * a.get(0, 1);
     * //=> 5
     */
    setValue(row: number, column: number, value: ItemType): this {
      this[this.getIndex(row, column)] = value;
      return this;
    }

    /**
     * Returns an array of arrays where each nested array correspond to a row in the grid.
     *
     * @example
     *
     * const a = SymmetricGrid.from([[1, 2, 4], [2, 3, 5], [4, 5, 6]])
     * //=> SymmetricGrid [1, 2, 3, 4, 5, 6]
     * a.toArrays();
     * //=> Array [[1, 2, 4], [2, 3, 5], [4, 5, 6]]
     */
    toArrays(): Array<Array<ItemType>> {
      const { rows } = this;
      const arrays: Array<Array<ItemType>> = new Array(rows)
        .fill(0)
        .map(() => []);
      let k = 0;
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j <= i; j++) {
          arrays[i][j] = this[k];
          arrays[j][i] = this[k];
          k++;
        }
      }
      return arrays;
    }
  }

  return SymmetricGrid;
}
