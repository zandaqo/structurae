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
function TypeViewMixin(type, littleEndian) {
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
      return this.constructor.get(0, this);
    }

    /**
     * Sets the numerical value of the view.
     *
     * @param {number} value
     * @returns {number}
     */
    set(value) {
      this.constructor.set(0, value, this);
      return this;
    }

    /**
     * Returns the numerical value of the view.
     *
     * @returns {number}
     */
    toJSON() {
      return this.get();
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
     * @param {TypeView} view
     * @returns {TypeView}
     */
    static from(value, view) {
      const typeView = view || this.of();
      typeView.set(value);
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
     * @param {number} position
     * @param {TypeView} view
     * @returns {number}
     */
    static get(position, view) {
      return view[getter](position, this.littleEndian);
    }

    /**
     * Sets the numerical value to a given view.
     *
     * @param {number} position
     * @param {number} value
     * @param {TypeView} view
     * @returns {void}
     */
    static set(position, value, view) {
      view[setter](position, value, this.littleEndian);
    }
  }

  /**
   * @type {boolean}
   */
  TypeView.isPrimitive = true;

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
