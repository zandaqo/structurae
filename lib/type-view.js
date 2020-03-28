const { typeGetters, typeSetters, typeOffsets } = require('./utilities');

/**
 * @private
 * @type {Map<string, Class<TypeView>>}
 */
const TypeViews = new Map();

/**
 * @param {PrimitiveFieldType} type
 * @param {boolean} [littleEndian]
 * @returns {Class<TypeView>}
 */
function TypeViewMixin(type, littleEndian = true) {
  const classId = type + +!!littleEndian;
  if (TypeViews.has(classId)) return TypeViews.get(classId);

  const getter = typeGetters[type];
  const setter = typeSetters[type];
  const offset = typeOffsets[type];

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
      return this.objectLength;
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
      setter.call(typeView, start, value, this.littleEndian);
      return typeView;
    }

    /**
     * Creates an empty view.
     *
     * @returns {TypeView}
     */
    static of() {
      return new this(new ArrayBuffer(this.objectLength));
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
      return getter.call(view, start, this.littleEndian);
    }
  }

  /**
   * @type {number}
   */
  TypeView.offset = offset;

  /**
   * @type {boolean}
   */
  TypeView.littleEndian = !!littleEndian;

  /**
   * @type {number}
   */
  TypeView.objectLength = 1 << TypeView.offset;

  TypeViews.set(classId, TypeView);
  return TypeView;
}

module.exports = TypeViewMixin;
