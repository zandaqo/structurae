/**
 * @typedef {Object} BitCoordinates
 * @property {number} bucket row index
 * @property {number} position column index
 */

/**
 * Implements a grid or 2D matrix of bits.
 *
 * @extends Uint16Array
 */
class BinaryGrid extends Uint16Array {
  /**
   * @param {Object} [options]
   * @param {number} [options.rows=1] the number of rows
   * @param {number} [options.columns=16] the number of columns
   * @param {Collection} [data]
   */
  constructor(options = {}, data) {
    const { columns = 16, rows = 1 } = options;
    const offset = BinaryGrid.getOffset(columns);
    if (data && data.length) {
      super(data);
    } else {
      const length = (rows << offset) >> 4;
      super(length || 1);
    }
    Object.defineProperties(this, {
      offset: { value: offset, writable: true },
      columns: { value: columns, writable: true },
      rows: { value: rows, writable: true },
      lastPosition: { value: Object.seal({ bucket: 0, position: 0 }) },
    });
  }

  /**
   * Returns the value of a bit at given coordinates.
   *
   * @param {number} row
   * @param {number} column
   * @returns {number}
   */
  getBit(row, column) {
    const { bucket, position } = this.getBitPosition(row, column);
    return (this[bucket] >> position) & 1;
  }

  /**
   * Sets the value of a bit at given coordinates.
   *
   * @param {number} row
   * @param {number} column
   * @param {number} value
   * @returns {BinaryGrid}
   */
  setBit(row, column, value = 1) {
    const { bucket, position } = this.getBitPosition(row, column);
    this[bucket] = (this[bucket] & ~(1 << position)) | (value << position);
    return this;
  }

  /**
   * @private
   * @param {number} row
   * @param {number} column
   * @returns {BitCoordinates}
   */
  getBitPosition(row, column) {
    const index = (row << this.offset) + column;
    const bucket = index >> 4;
    this.lastPosition.bucket = bucket;
    this.lastPosition.position = index - (bucket << 4);
    return this.lastPosition;
  }

  /**
   * Returns values of bits on a given row as an array of numbers.
   *
   * @param {number} row
   * @returns {Array<number>}
   */
  getRow(row) {
    const { columns, offset } = this;
    const start = row << offset;
    const end = start + columns;
    const result = [];
    for (let i = start; i < end; i++) {
      const bucket = i >> 4;
      const position = i - (bucket << 4);
      result[i - start] = (this[bucket] >> position) & 1;
    }
    return result;
  }

  /**
   * Returns values of bits on a given column as an array of numbers.
   *
   * @param {number} column
   * @returns {Array<number>}
   */
  getColumn(column) {
    const { rows, offset } = this;
    const result = [];
    for (let i = 0; i < rows; i++) {
      const index = (i << offset) + column;
      const bucket = index >> 4;
      const position = index - (bucket << 4);
      result[i] = (this[bucket] >> position) & 1;
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
   * @type {Uint16ArrayConstructor}
   */
  static get [Symbol.species]() {
    return Uint16Array;
  }
}

module.exports = BinaryGrid;
