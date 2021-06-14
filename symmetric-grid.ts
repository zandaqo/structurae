import type { Constructor, TypedArrayConstructors } from "./utility-types.ts";

/**
 * Creates a SymmetricGrid class extending a given Array-like class.
 */
export function SymmetricGridMixin<
  ItemType = number,
  U extends Constructor<Array<ItemType>> | TypedArrayConstructors = Constructor<
    Array<ItemType>
  >,
>(Base: U) {
  /**
   * Implements a grid to handle symmetric or triangular matrices using half the space required for a normal grid.
   */
  return class SymmetricGrid extends Base {
    [key: number]: ItemType

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

    /**
     * Creates a grid of specified dimensions.
     *
     * @param rows the amount of rows
     * @param columns the amount of columns
     * @return a new grid
     */
    static create<T extends typeof SymmetricGrid>(
      this: T,
      columns: number,
    ): InstanceType<T> {
      const length = this.getLength(columns);
      const grid = new this(length);
      grid.size = columns;
      return grid as InstanceType<T>;
    }

    /**
     * Creates a grid from an array of arrays.
     *
     * @param arrays the array of arrays
     * @return a new grid
     */
    static fromArrays<T extends typeof SymmetricGrid>(
      this: T,
      arrays: Array<Array<ItemType>>,
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
     * Returns the length of the underlying Array required to hold the grid of specified dimensions.
     *
     * @param rows the amount of rows
     * @param columns the amount of columns
     * @return the required length
     */
    static getLength(rows: number): number {
      return ((rows + 1) * rows) >> 1;
    }

    getCoordinates(index: number): [row: number, column: number] {
      const row = (Math.sqrt((index << 3) + 1) - 1) >> 1;
      const column = index - ((row * (row + 1)) >> 1);
      return [row, column];
    }

    /**
     * Returns the index of an element at given coordinates.
     *
     * @param rows the row index
     * @param columns the column index
     * @return the element index
     */
    getIndex(row: number, column: number): number {
      const [x, y] = row >= column ? [column, row] : [row, column];
      return x + (((y + 1) * y) >> 1);
    }

    /**
     * Returns the element at given coordinates.
     *
     * @param rows the row index
     * @param columns the column index
     * @return the element
     */
    getValue(row: number, column: number): ItemType {
      return this[this.getIndex(row, column)];
    }

    /**
     * Sets the element at given coordinates.
     *
     * @param rows the row index
     * @param columns the column index
     * @param value the element
     * @return the grid
     */
    setValue(row: number, column: number, value: ItemType): this {
      this[this.getIndex(row, column)] = value;
      return this;
    }

    /**
     * Creates an array of arrays representing rows of the grid.
     *
     * @return an array of arrays
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
  };
}
