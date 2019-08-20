/**
 * @extends DataView
 */
class CollectionView extends DataView {
  /**
   * Returns a view at a given index.
   *
   * @param {number} index
   * @returns {View}
   */
  get(index) {
    const { schema } = this.constructor;
    const View = schema[index];
    if (!View) return undefined;
    const start = this.getInt32(index << 2);
    const end = index < schema.length - 1 ? this.getInt32(index + 1 << 2) : this.byteLength;
    if (end === start) return undefined;
    return new View(this.buffer, this.byteOffset + start, end - start);
  }

  /**
   * Sets .
   *
   * @param {number} index
   * @param {Object} value
   * @returns {CollectionView}
   */
  set(index, value) {
    const { schema } = this.constructor;
    const View = schema[index];
    const view = this.get(index);
    if (view) View.from(value, view);
    return this;
  }

  /**
   * Allows iterating over objects stored in the collection.
   *
   * @returns {Iterable<number>}
   */
  * [Symbol.iterator]() {
    const { length } = this.constructor.schema;
    for (let i = 0; i < length; i++) {
      yield this.get(i);
    }
  }

  /**
   * Returns an array representation of the collection view.
   *
   * @returns {Array<Object>}
   */
  toObject() {
    const { schema } = this.constructor;
    const array = new Array(schema.length);
    for (let i = 0; i < schema.length; i++) {
      const view = this.get(i);
      array[i] = view ? view.toObject() : undefined;
    }
    return array;
  }

  /**
   * Creates a collection view from a given collection of objects.
   *
   * @param {Array<Object>} value
   * @param {CollectionView} [array]
   * @returns {CollectionView}
   */
  static from(value, array) {
    const { schema } = this;
    const fields = schema.length;
    let view = array;
    if (!view) {
      const sizes = new Array(fields).fill(0)
        .map((ctor, i) => (value[i] ? value[i].length || 1 : 0));
      view = this.of(sizes);
    }
    for (let i = 0; i < fields; i++) {
      if (value[i]) view.set(i, value[i]);
    }
    return view;
  }

  /**
   * Returns the byte length of a collection view to hold a given amount of objects.
   *
   * @param {Array<number>} sizes
   * @returns {number}
   */
  static getLength(sizes) {
    const { schema } = this;
    let length = schema.length << 2;
    for (let i = 0; i < schema.length; i++) {
      const size = sizes[i];
      if (size) length += schema[i].getLength(sizes[i]);
    }
    return length;
  }

  /**
   * Creates an empty collection view of specified size.
   *
   * @param {Array<number>} sizes
   * @returns {CollectionView}
   */
  static of(sizes) {
    const { schema } = this;
    const fields = schema.length;
    const offsets = new Array(fields);
    let lastOffset = fields << 2;
    for (let i = 0; i < fields; i++) {
      const size = sizes[i];
      offsets[i] = lastOffset;
      if (size) {
        const viewSize = schema[i].getLength(sizes[i]);
        lastOffset += viewSize;
      }
    }
    const length = lastOffset;
    const view = new this(new ArrayBuffer(length));
    for (let i = 0; i < fields; i++) {
      view.setUint32(i << 2, offsets[i]);
    }
    return view;
  }
}

CollectionView.schema = [];

module.exports = CollectionView;
