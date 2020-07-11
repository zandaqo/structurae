const { typeGetters, typeSetters, typeOffsets } = require('./utilities');
const TypedArrayView = require('./typed-array-view');

/**
 * @extends {DataView}
 */
class TypeView extends DataView {
  /**
   * Returns the numerical value of the view.
   *
   * @returns {number}
   */
  get() {
    return this.constructor.toJSON(this);
  }

  /**
   * Sets the numerical value of the view.
   *
   * @param {number} value
   * @returns {TypeView}
   */
  set(value) {
    this.constructor.from(value, this);
    return this;
  }

  /**
   * Returns the numerical value of the view.
   *
   * @returns {number}
   */
  toJSON() {
    return this.constructor.toJSON(this);
  }

  /**
   * Returns the length of a view.
   *
   * @returns {number}
   */
  static getLength() {
    return this.viewLength;
  }

  /**
   * Creates a view with a given value.
   *
   * @param {number} value
   * @param {View} [view]
   * @param {number} [start=0]
   * @returns {View}
   */
  static from(value, view, start = 0) {
    const typeView = view || this.of();
    this.setter.call(typeView, start, value, this.littleEndian);
    return typeView;
  }

  /**
   * Creates an empty view.
   *
   * @returns {TypeView}
   */
  static of() {
    return new this(new ArrayBuffer(this.viewLength));
  }

  /**
   * Returns the numerical value of a given view.
   *
   * @param {View} view
   * @param {number} [start=0]
   * @returns {number}
   *
   */
  static toJSON(view, start = 0) {
    return this.getter.call(view, start, this.littleEndian);
  }
}

TypeView.getter = DataView.prototype.getUint8;
TypeView.setter = DataView.prototype.setUint8;

/**
 * @type {number}
 */
TypeView.offset = 0;

/**
 * @type {boolean}
 */
TypeView.littleEndian = true;

/**
 * @type {number}
 */
TypeView.viewLength = 1;

/**
 * @type {Map<string, Class<TypeView>>}
 */
TypeView.Views = new Map();

/**
 * @type {Class<ArrayView>}
 */
TypeView.ArrayClass = TypedArrayView;

/**
 * @param {PrimitiveFieldType} type
 * @param {boolean} [littleEndian]
 * @param {Class<TypeView>} [TypeViewClass]
 * @returns {Class<TypeView>}
 */
function TypeViewMixin(type, littleEndian = true, TypeViewClass = TypeView) {
  const classId = type + +!!littleEndian;
  const TypeViews = TypeViewClass.Views;
  if (TypeViews.has(classId)) return TypeViews.get(classId);
  const View = class extends TypeViewClass {};
  View.getter = typeGetters[type];
  View.setter = typeSetters[type];
  View.offset = typeOffsets[type];
  View.littleEndian = !!littleEndian;
  View.viewLength = 1 << View.offset;
  TypeViews.set(classId, View);
  return View;
}

module.exports = {
  TypeView,
  TypeViewMixin,
};
