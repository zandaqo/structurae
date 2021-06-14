import type { Bit } from "./utility-types.ts";
import { getLog2 } from "./utilities.ts";

/**
 * Implements a grid or 2D matrix of bits.
 */
export class BinaryGrid extends Uint32Array {
  size = 0;

  static get [Symbol.species]() {
    return Uint32Array;
  }

  /**
   * Number of columns in the grid.
   */
  get columns(): number {
    return 1 << this.size;
  }

  /**
   * Specifies the number of columns of the grid.
   */
  set columns(columns: number) {
    this.size = getLog2(columns);
  }

  /**
   * Number of rows in the grid.
   */
  get rows(): number {
    return (this.length << 5) >> this.size;
  }

  /**
   * Creates a binary grid of specified dimensions.
   *
   * @param rows the amount of rows
   * @param columns the amount of columns
   * @return a new binary grid
   */
  static create(rows: number, columns = 1): BinaryGrid {
    const offset = getLog2(columns);
    const length = (rows << offset) >> 5;
    const grid = new this(length || 1);
    grid.size = offset;
    return grid;
  }

  /**
   * Creates a new binary grid from an array of arrays representing rows and item value of the grid.
   *
   * @param arrays the array of arrays
   * @return a new binary grid
   */
  static fromArrays(arrays: Array<Array<Bit>>): BinaryGrid {
    const rows = arrays.length;

    // find longest array to get the column size
    let columns = arrays[0].length; // if !arrays[0].length
    for (let i = 0; i < rows; i++) {
      if (arrays[i].length > columns) columns = arrays[i].length;
    }
    // create grid of the required length
    const grid = this.create(rows, columns);
    grid.size = getLog2(columns);

    // fill the grid with values from arrays
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < arrays[i].length; j++) {
        grid.setValue(i, j, arrays[i][j]);
      }
    }

    return grid;
  }

  /**
   * Returns the length of the underlying TypedArray required to hold a grid of specified dimensions.
   *
   * @param rows the amount of rows
   * @param columns the amount of columns
   * @return the required length
   */
  static getLength(rows: number, columns = 1): number {
    return (rows << getLog2(columns)) >> 5;
  }

  getCoordinates(row: number, column = 1): [bucket: number, position: number] {
    const index = (row << this.size) + column;
    const bucket = index >> 5;
    return [bucket, index - (bucket << 5)];
  }

  /**
   * Returns the index of an item holding the bit at given coordinates.
   *
   * @param rows the row index
   * @param columns the column index
   * @return the item index
   */
  getIndex(row: number, column = 1): number {
    const index = (row << this.size) + column;
    return index >> 5;
  }

  /**
   * Returns the bit at given coordinates.
   *
   * @param rows the row index
   * @param columns the column index
   * @return the bit
   */
  getValue(row: number, column: number): Bit {
    const [bucket, position] = this.getCoordinates(row, column);
    return ((this[bucket] >> position) & 1) as Bit;
  }

  /**
   * Sets the bit at given coordinates.
   *
   * @param rows the row index
   * @param columns the column index
   * @param value the bit
   * @return the grid
   */
  setValue(row: number, column: number, value: Bit = 1): this {
    const [bucket, position] = this.getCoordinates(row, column || 0);
    this[bucket] = (this[bucket] & ~(1 << position)) | (value << position);
    return this;
  }

  /**
   * Creates an array of arrays representing rows of the grid.
   *
   * @return an array of arrays
   */
  toArrays(): Array<Array<Bit>> {
    const { rows, columns } = this;
    const result: Array<Array<Bit>> = new Array(rows);
    for (let i = 0; i < rows; i++) {
      result[i] = new Array(columns);
      for (let j = 0; j < columns; j++) {
        result[i][j] = this.getValue(i, j);
      }
    }
    return result;
  }
}
