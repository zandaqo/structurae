import type { Constructor, TypedArrayConstructors } from "./utility-types.ts";
import { getLog2 } from "./utilities.ts";

/**
 * Creates a Grid class extending a given Array-like class.
 */
export function GridMixin<
  ItemType = number,
  U extends Constructor<Array<ItemType>> | TypedArrayConstructors = Constructor<
    Array<ItemType>
  >,
>(Base: U) {
  /**
   * Extends built-in indexed collections to handle 2 dimensional data.
   */
  return class Grid extends Base {
    [key: number]: ItemType

    size = 0;

    static get [Symbol.species]() {
      return Base;
    }

    /**
     * Number of columns in the grid.
     */
    get columns() {
      return 1 << this.size;
    }

    /**
     * Specifies the number of columns of the grid.
     */
    set columns(columns) {
      this.size = getLog2(columns);
    }

    /**
     * Number of rows in the grid.
     */
    get rows() {
      //@ts-ignore 2339
      return this.length >> this.size;
    }

    static create<T extends typeof Grid>(
      this: T,
      rows: number,
      columns = 1,
    ): InstanceType<T> {
      const offset = getLog2(columns);
      const length = rows << offset;
      const grid = new this(length);
      grid.size = offset;
      return grid as InstanceType<T>;
    }

    /**
     * Creates a grid from an array of arrays.
     *
     * @example
     * const a = ArrayGrid.from([[1, 2], [3], [4, 5, 6]])
     * //=> ArrayGrid [1, 2, 0, 0, 3, 0, 0, 0, 4, 5, 6, 0]
     * a.get(1, 0);
     * //=> 3
     * a.get(2, 1);
     * //=> 5
     */
    static fromArrays<T extends typeof Grid>(
      this: T,
      arrays: Array<Array<ItemType>>,
    ): InstanceType<T> {
      const rows = arrays.length;

      // find longest array to get the column size
      let columns = arrays[0].length; // if !arrays[0].length
      for (let i = 0; i < rows; i++) {
        if (arrays[i].length > columns) columns = arrays[i].length;
      }
      const offset = getLog2(columns);
      columns = 1 << offset;

      // create grid of the required length
      const grid = this.create(rows, columns);

      // fill the grid with values from arrays
      for (let i = 0; i < rows; i++) {
        const rowId = i << offset;
        for (let j = 0; j < arrays[i].length; j++) {
          grid[rowId + j] = arrays[i][j];
        }
      }

      return grid;
    }

    /**
     * Returns the length of underlying Array required to hold the grid.
     */
    static getLength(rows: number, columns = 1): number {
      return rows << getLog2(columns);
    }

    /**
     * Gets coordinates of an element at specified index.
     * @example
     * const a = ArrayGrid({ rows: 3, columns: 2, pad: 3});
     * a.getCoordinates(1);
     * //=> [0, 1]
     * a.getCoordinates(2);
     * //=> [1, 0]
     */
    getCoordinates(index: number): [row: number, column: number] {
      return [index >> this.size, index & ((1 << this.size) - 1)];
    }

    /**
     * Returns an array index of an element at given coordinates.
     * @example
     *
     * const a = ArrayGrid({ rows: 3, columns: 2, pad: 3});
     * a.get(1, 0);
     * //=> 2
     */
    getIndex(row: number, column = 1): number {
      return (row << this.size) + column;
    }

    /**
     * Returns an element from given coordinates.
     * @example
     *
     * const a = ArrayGrid({ rows: 3, columns: 2, pad: 3});
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
     * @example
     *
     * const a = ArrayGrid({ rows: 3, columns: 2, pad: 3});
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
     * @example
     *
     * const a = ArrayGrid({ rows: 3, columns: 2, pad: 3});
     * a.toArrays();
     * //=> [[3, 3], [3, 3], [3, 3]]
     */
    toArrays(): Array<Array<ItemType>> {
      const { rows, columns, size } = this;
      const result: Array<Array<ItemType>> = [];
      for (let i = 0; i < rows; i++) {
        const rowOffset = i << size;
        result[i] = [];
        for (let j = 0; j < columns; j++) {
          result[i][j] = this[rowOffset + j];
        }
      }
      return result;
    }
  };
}
