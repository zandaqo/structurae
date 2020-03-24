const ArrayView = require('./array-view');
const TypedArrayView = require('./typed-array-view');
const TypeViewMixin = require('./type-view');

/**
 * @private
 * @type {WeakMap<Class<View>, Class<ArrayView>>}
 */
const ArrayViews = new WeakMap();

/**
 * Creates an ArrayView class for a given ObjectView class.
 *
 * @param {Class<View>|PrimitiveFieldType} ObjectViewClass
 * @param {number|boolean} [itemLength]
 * @returns {Class<ArrayView>}
 */
function ArrayViewMixin(ObjectViewClass, itemLength) {
  let ViewClass = ObjectViewClass;
  if (typeof ObjectViewClass === 'string') {
    const littleEndian = itemLength === undefined ? true : !!itemLength;
    ViewClass = TypeViewMixin(ObjectViewClass, littleEndian);
    if (ArrayViews.has(ViewClass)) return ArrayViews.get(ViewClass);
  } else {
    if (!itemLength && ArrayViews.has(ViewClass)) return ArrayViews.get(ViewClass);
    if (ViewClass.initialize && !ViewClass.layout) ViewClass.initialize();
  }
  const ArrayViewClass = Reflect.has(ViewClass, 'offset') ? TypedArrayView : ArrayView;
  const View = class extends ArrayViewClass {};
  View.View = ViewClass;
  View.itemLength = ViewClass.objectLength || itemLength;
  ArrayViews.set(ViewClass, View);
  return View;
}

module.exports = ArrayViewMixin;
