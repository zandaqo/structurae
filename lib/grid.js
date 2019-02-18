/**
 * @typedef {ArrayConstructor|
 * Int8ArrayConstructor|
 * Int8ArrayConstructor|
 * Uint8ArrayConstructor|
 * Uint8ClampedArrayConstructor|
 * Int16ArrayConstructor|
 * Uint16ArrayConstructor|
 * Int32ArrayConstructor|
 * Uint32ArrayConstructor|
 * Float32ArrayConstructor|
 * Float64ArrayConstructor} CollectionConstructor
 */

/**
 * @typedef {Array|
 * Int8Array|
 * Uint8Array|
 * Uint8ClampedArray|
 * Int16Array|
 * Uint16Array|
 * Int32Array|
 * Uint32Array|
 * Float32Array|
 * Float64Array} Collection
 */

/**
 * @typedef {Object} Coordinates
 * @property {number} row row index
 * @property {number} column column index
 */

/**
 * Creates a Grid class extending a given Array-like class.
 *
 * @param {CollectionConstructor} Base
 * @returns {Grid}
 * @example
 *
 * const ArrayGrid = Grid(Array);
 */
function GridMixin(Base) {
  /**
   * Extends built-in indexed collections to handle 2 dimensional data.
   *
   * @extends CollectionConstructor
   */
  class Grid extends Base {
    /**
     * Passes all arguments to the Base class except if called with a special set of grid options,
     * in that case creates and empty grid of specified parameters.
     *
     * @param {Object} [options]
     * @param {number} [options.rows=1] the number of rows
     * @param {number} [options.columns=2] the number of columns
     * @param {*} [options.pad=0] the initial value of cells
     * @param {...*} [args]
     * @example
     *
     * new ArrayGrid('a')
     * //=> ArrayGrid ['a']
     *
     * new ArrayGrid(2)
     * //=> ArrayGrid [undefined, undefined]
     *
     * new ArrayGrid({ rows: 3, columns: 2 })
     * //=> ArrayGrid [0, 0, 0, 0, 0, 0]
     *
     * new ArrayGrid({ rows: 3, columns: 2, pad: 1 })
     * //=> ArrayGrid [1, 1, 1, 1, 1, 1]
     */
    constructor(options = {}, ...args) {
      const { columns = 2, rows = 1, pad = 0 } = options;
      const offset = Grid.getOffset(columns);
      if (args.length) {
        super(...args);
      } else {
        const length = rows << offset;
        super(length);
        this.fill(pad);
      }
      Object.defineProperties(this, {
        offset: { value: offset, writable: true },
        pad: { value: pad, writable: true },
        lastCoordinates: { value: Object.seal({ row: 0, column: 0 }) },
      });
    }

    /**
     * Specifies the number of columns of the grid.
     *
     * @param {number} columns
     * @returns {void}
     */
    set columns(columns) {
      this.offset = Grid.getOffset(columns);
    }

    /**
     * Number of columns in the grid.
     * @type {number}
     */
    get columns() {
      return 1 << this.offset;
    }

    /**
     * Number of rows in the grid.
     * @type {number}
     */
    get rows() {
      return this.length >> this.offset;
    }

    /**
     * Returns an array index of an element at given coordinates.
     *
     * @param {number} row
     * @param {number} column
     * @returns {*}
     * @example
     *
     * const a = ArrayGrid({ rows: 3, columns: 2, pad: 3});
     * a.get(1, 0);
     * //=> 2
     */
    getIndex(row, column) {
      return (row << this.offset) + column;
    }

    /**
     * Returns an element from given coordinates.
     *
     * @param {number} row
     * @param {number} column
     * @returns {*}
     * @example
     *
     * const a = ArrayGrid({ rows: 3, columns: 2, pad: 3});
     * a.get(0, 1);
     * //=> 3
     */
    get(row, column) {
      return this[this.getIndex(row, column)];
    }

    /**
     * Sets the element at given coordinates.
     *
     * @param {number} row
     * @param {number} column
     * @param {*} value
     * @returns {Grid} the instance
     * @example
     *
     * const a = ArrayGrid({ rows: 3, columns: 2, pad: 3});
     * a.set(0, 1, 5);
     * a.get(0, 1);
     * //=> 5
     */
    set(row, column, value) {
      this[this.getIndex(row, column)] = value;
      return this;
    }

    /**
     * Gets coordinates of an element at specified index.
     *
     * @param {number} index
     * @returns {Coordinates} coordinates
     * @example
     * const a = ArrayGrid({ rows: 3, columns: 2, pad: 3});
     * a.getCoordinates(1);
     * //=> [0, 1]
     * a.getCoordinates(2);
     * //=> [1, 0]
     */
    getCoordinates(index) {
      this.lastCoordinates.row = index >> this.offset;
      this.lastCoordinates.column = index - (this.lastCoordinates.row << this.offset);
      return this.lastCoordinates;
    }

    /**
     * Returns an array of arrays where each nested array correspond to a row in the grid.
     *
     * @param {boolean} [withPadding] whether to remove padding from the end of the rows
     * @returns {Array<Array<*>>}
     * @example
     *
     * const a = ArrayGrid({ rows: 3, columns: 2, pad: 3});
     * a.toArrays();
     * //=> [[3, 3], [3, 3], [3, 3]]
     */
    toArrays(withPadding) {
      const { rows, columns } = this;
      const begin = new Uint32Array(rows).map((b, i) => i << this.offset);
      const result = new Array(rows);

      for (let i = 0; i < rows; i++) {
        const beginning = begin[i];
        if (withPadding) {
          result[i] = this.slice(beginning, beginning + columns);
          continue;
        }
        for (let j = beginning + columns - 1; j >= beginning; j--) {
          if (this[j] !== this.pad) {
            result[i] = this.slice(beginning, j + 1);
            break;
          }
        }
      }

      return result;
    }

    /**
     * @type {CollectionConstructor}
     */
    static get [Symbol.species]() {
      return Base;
    }

    /**
     * @private
     * @param {number} columns
     * @returns {number}
     */
    static getOffset(columns) {
      return Math.ceil(Math.log2(columns));
    }

    /**
     * Returns the length of underlying Array required to hold the grid.
     *
     * @param {number} rows
     * @param {number} columns
     * @returns {number}
     */
    static getLength(rows, columns) {
      return rows << this.getOffset(columns);
    }

    /**
     * Creates a grid from an array of arrays.
     *
     * @param {Array<Array<*>>} arrays
     * @param {*} [pad=0] the value to pad the arrays to create equal sized rows
     * @returns {Grid}
     *
     * const a = ArrayGrid.from([[1, 2], [3], [4, 5, 6]])
     * //=> ArrayGrid [1, 2, 0, 0, 3, 0, 0, 0, 4, 5, 6, 0]
     * a.get(1, 0);
     * //=> 3
     * a.get(2, 1);
     * //=> 5
     */
    static fromArrays(arrays, pad = 0) {
      const rows = arrays.length;

      // find longest array to get the column size
      let columns = arrays[0].length; // if !arrays[0].length
      for (let i = 0; i < rows; i++) {
        if (arrays[i].length > columns) columns = arrays[i].length;
      }
      const offset = this.getOffset(columns);
      columns = 1 << offset;

      // create grid of the required length
      const grid = new this({ rows, columns, pad });

      // fill the grid with values from arrays
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < arrays[i].length; j++) {
          grid.set(i, j, arrays[i][j]);
        }
      }

      return grid;
    }
  }

  return Grid;
}

module.exports = GridMixin;
