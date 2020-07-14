const VariableView = require('./variable-view');

/**
 * @extends {VariableView}
 */
class VectorView extends VariableView {
  /**
   * Returns an object at a given index.
   *
   * @param {number} index
   * @returns {*}
   */
  get(index) {
    const { View } = this.constructor;
    const layout = this.getLayout(index);
    if (!layout) return undefined;
    return View.toJSON(this, layout[0], layout[1]);
  }

  /**
   * @private
   * @param {number} index
   * @returns {Array<number>}
   */
  getLayout(index) {
    const length = this.getUint32(0, true);
    if (index >= length) return undefined;
    const startOffset = (index + 1) << 2;
    const start = this.getUint32(startOffset, true);
    const end = this.getUint32(startOffset + 4, true);
    if (start === end) return undefined;
    return [start, end - start];
  }

  /**
   * Returns a view at a given index.
   *
   * @param {number} index
   * @returns {View|VariableView}
   */
  getView(index) {
    const { View } = this.constructor;
    const layout = this.getLayout(index);
    if (!layout) return undefined;
    return new View(this.buffer, this.byteOffset + layout[0], layout[1]);
  }

  /**
   * Sets a value at a given index.
   *
   * @param {number} index
   * @param {*} value
   * @returns {VectorView}
   */
  set(index, value) {
    const { View } = this.constructor;
    const layout = this.getLayout(index);
    if (!layout) return undefined;
    View.from(value, this, this.byteOffset + layout[0], layout[1]);
    return this;
  }

  /**
   * Sets a view at a given index.
   *
   * @param {number} index
   * @param {View|VariableView} value
   * @returns {VectorView}
   */
  setView(index, value) {
    const layout = this.getLayout(index);
    if (!layout) return undefined;
    new Uint8Array(this.buffer, this.byteOffset + layout[0], layout[1]).set(
      new Uint8Array(value.buffer, value.byteOffset, value.byteLength),
    );
    return this;
  }

  /**
   * Returns the amount of available values in the vector.
   *
   * @type {number}
   */
  get size() {
    return this.constructor.getSize(this);
  }

  /**
   * Allows iterating over views stored in the vector.
   *
   * @returns {Iterable<ObjectView>}
   */
  *[Symbol.iterator]() {
    const { size } = this;
    for (let i = 0; i < size; i++) {
      yield this.getView(i);
    }
  }

  /**
   * Returns an array representation of the vector view.
   *
   * @returns {Array<Object>}
   */
  toJSON() {
    return this.constructor.toJSON(this, 0, this.byteLength);
  }

  /**
   * Encodes a given value into a view.
   *
   * @param {Array<*>} value
   * @param {View|VariableView} view
   * @param {number} [start=0]
   * @returns {number}
   */
  static encode(value, view, start = 0) {
    const { View } = this;
    const items = value.length;
    view.setUint32(start, items, true);
    const lastOffset = (items + 1) << 2;
    let end = lastOffset + 4;
    for (let i = 0; i < items; i++) {
      const item = value[i];
      const itemOffset = (i + 1) << 2;
      let itemLength = 0;
      if (item != null) {
        const caret = start + end;
        if (View.viewLength || View.itemLength) {
          itemLength = View.getLength(value.length || 1);
          View.from(item, view, caret, itemLength);
        } else {
          itemLength = View.encode(item, view, caret);
        }
      }
      view.setUint32(start + itemOffset, end, true);
      end += itemLength;
    }
    view.setUint32(start + lastOffset, end, true);
    return end;
  }

  /**
   * Creates a vector view from a given array of values.
   *
   * @param {ArrayLike<Object>} value
   * @param {View} [view]
   * @param {number} [start=0]
   * @returns {VectorView}
   */
  static from(value, view, start = 0) {
    const vectorView = view || this.bufferView;
    const end = this.encode(value, vectorView, start);
    return view || new this(vectorView.buffer.slice(0, end));
  }

  /**
   * Returns an array representation of a given vector view.
   *
   * @param {View} view
   * @param {number} [start=0]
   * @returns {Object}
   */
  static toJSON(view, start = 0) {
    const { View } = this;
    const size = this.getSize(view, start);
    const array = new Array(size);
    for (let i = 0; i < size; i++) {
      const offset = (i + 1) << 2;
      const startOffset = view.getUint32(start + offset, true);
      const end = view.getUint32(start + offset + 4, true);
      array[i] =
        startOffset !== end ? View.toJSON(view, start + startOffset, end - startOffset) : undefined;
    }
    return array;
  }

  /**
   * Returns the byte length of a view necessary to hold given values.
   *
   * @param {Array<*>} value
   * @returns {number}
   */
  static getLength(value) {
    const items = value.length;
    let length = (items + 2) << 2;
    for (let i = 0; i < value.length; i++) {
      length += this.View.getLength(value[i]);
    }
    return length;
  }

  /**
   * Returns the amount of values in a given view.
   *
   * @param {View|VariableView} view
   * @param {number} [start=0]
   * @returns {number}
   */
  static getSize(view, start = 0) {
    return view.getUint32(start, true);
  }
}

/**
 * @type {View}
 */
VectorView.View = undefined;

/**
 * @type {WeakMap}
 */
VectorView.Views = new WeakMap();

/**
 * @param {Class<View>} ViewClass
 * @param {Class<VectorView>} [VectorViewClass=VectorView]
 * @returns {Class<VectorView>}
 */
function VectorViewMixin(ViewClass, VectorViewClass = VectorView) {
  const { Views } = VectorViewClass;
  if (Views.has(ViewClass)) return Views.get(ViewClass);
  if (ViewClass.initialize && !ViewClass.layout) ViewClass.initialize();
  const VectorClass = class extends VectorViewClass {};
  VectorClass.View = ViewClass;
  Views.set(ViewClass, VectorClass);
  return VectorClass;
}

module.exports = {
  VectorView,
  VectorViewMixin,
};
