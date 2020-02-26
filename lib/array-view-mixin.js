const ArrayView = require('./array-view');
const TypedArrayView = require('./typed-array-view');
const TypeViewMixin = require('./type-view');

/**
 * @private
 * @type {WeakMap<ViewType, (Class<ArrayView>|Class<TypedArrayView>)>}
 */
const ArrayViews = new WeakMap();

/**
 * Creates an ArrayView class for a given ObjectView class.
 *
 * @param {ViewType} ObjectViewClass
 * @param {number} [itemLength]
 * @returns {Class<ArrayView>}
 */
function ArrayViewMixin(ObjectViewClass, itemLength) {
  if (!itemLength && ArrayViews.has(ObjectViewClass)) return ArrayViews.get(ObjectViewClass);
  if (ObjectViewClass.initialize && !ObjectViewClass.isInitialized) {
    ObjectViewClass.initialize();
  }
  const ArrayViewClass = ObjectViewClass.isPrimitive ? TypedArrayView : ArrayView;
  const View = class extends ArrayViewClass {};
  View.View = ObjectViewClass;
  View.itemLength = ObjectViewClass.objectLength || itemLength;
  ArrayViews.set(ObjectViewClass, View);
  return View;
}

/**
 * Creates a TypedArrayView class for a given TypeView class.
 *
 * @param {PrimitiveFieldType} type
 * @param {boolean} [littleEndian]
 * @returns {Class<TypedArrayView>}
 */
function TypedArrayViewMixin(type, littleEndian) {
  const TypeViewClass = TypeViewMixin(type, !!littleEndian);
  if (ArrayViews.has(TypeViewClass)) return ArrayViews.get(TypeViewClass);
  const View = class extends TypedArrayView {};
  View.View = TypeViewClass;
  View.itemLength = TypeViewClass.objectLength;
  ArrayViews.set(TypeViewClass, View);
  return View;
}

module.exports = {
  TypedArrayViewMixin,
  ArrayViewMixin,
};
