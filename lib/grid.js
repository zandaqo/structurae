/**
 * @typedef {Object} GridOptions
 * @property {number} rows the number of rows
 * @property {number} columns the number of columns
 * @property {*} pad the initial value of cells
 */

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
 * Float64ArrayConstructor} IndexedCollection
 */

/**
 * Creates a Grid class extending a given Array-like class.
 *
 * @param {IndexedCollection} Base
 * @returns {Grid}
 * @example
 *
 * const ArrayGrid = Grid(Array);
 */
function GridFactory(Base) {
  /**
   * @extends IndexedCollection
   */
  class Grid extends Base {
    /**
     * Passes all arguments to the Base class except if called with a special set of grid options,
     * in that case creates and empty grid of specified parameter.
     *
     * @param {...(*|GridOptions)} args
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
    constructor(...args) {
      let offset = 0;
      let pad = 0;
      if (args.length === 1 && args[0].columns) {
        const { columns, rows } = args[0];
        offset = Grid.getOffset(columns);
        const length = rows << offset;
        super(length);

        if (Reflect.has(args[0], 'pad')) ([{ pad }] = args);
        this.fill(pad);
      } else {
        super(...args);
      }
      Object.defineProperties(this, {
        offset: { value: offset, writable: true },
        pad: { value: pad, writable: true },
      });
    }

    /**
     * Specifies the number of columns of the grid.
     *
     * @param {number} columns
     * @returns {void}
     */
    setColumns(columns) {
      this.offset = Grid.getOffset(columns);
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
      return this[(row << this.offset) + column];
    }

    /**
     * Sets the element at given coordinates.
     *
     * @param {number} row
     * @param {number} column
     * @param {*} value
     * @returns {*}
     * @example
     *
     * const a = ArrayGrid({ rows: 3, columns: 2, pad: 3});
     * a.set(0, 1, 5);
     * a.get(0, 1);
     * //=> 5
     */
    set(row, column, value) {
      return this[(row << this.offset) + column] = value;
    }

    /**
     * Gets coordinates of an element at specified index.
     *
     * @param {number} index
     * @returns {Array<number>} coordinates
     * @example
     * const a = ArrayGrid({ rows: 3, columns: 2, pad: 3});
     * a.getCoordinates(1);
     * //=> [0, 1]
     * a.getCoordinates(2);
     * //=> [1, 0]
     */
    getCoordinates(index) {
      const row = index >> this.offset;
      const column = index - (row << this.offset);
      return [row, column];
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
      const rows = this.length >> this.offset;
      const columns = 1 << this.offset;
      const begin = new Uint32Array(rows).map((b, i) => i << this.offset);
      const result = new Array(rows);

      for (let i = 0; i < rows; i++) {
        const beginning = begin[i];
        if (withPadding) {
          result[i] = Base.from(this.slice(beginning, beginning + columns));
          continue;
        }
        for (let j = beginning + columns - 1; j >= beginning; j--) {
          if (this[j] !== this.pad) {
            result[i] = Base.from(this.slice(beginning, j + 1));
            break;
          }
        }
      }

      return result;
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
     * Creates a grid from an array of arrays.
     *
     * @param {Array<Array<*>>} arrays
     * @param {*} [pad=0] the value to pad the arrays to create equal sized rows
     * @returns {Grid}
     *
     * const a = ArrayGrid([[1, 2], [3], [4, 5, 6]])
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
      const length = rows * columns;

      // create grid of the required length
      const grid = super.from({ length });
      grid.fill(pad);
      grid.offset = offset;
      grid.pad = pad;

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

module.exports = GridFactory;
