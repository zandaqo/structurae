const ArrayView = require('./array-view');
const { TypeViewMixin } = require('./type-view');

/**
 * Creates an ArrayView class for a given ObjectView class.
 *
 * @param {Class<View>|PrimitiveFieldType} ObjectViewClass
 * @param {number|boolean} [itemLength]
 * @returns {Class<ArrayView>}
 */
function ArrayViewMixin(ObjectViewClass, itemLength) {
  const ArrayViews = ArrayView.Views;
  let ViewClass = ObjectViewClass;
  if (typeof ObjectViewClass === 'string') {
    const littleEndian = itemLength === undefined ? true : !!itemLength;
    ViewClass = TypeViewMixin(ObjectViewClass, littleEndian);
    if (ArrayViews.has(ViewClass)) return ArrayViews.get(ViewClass);
  } else {
    if (!itemLength && ArrayViews.has(ViewClass)) return ArrayViews.get(ViewClass);
    if (ViewClass.initialize && !ViewClass.layout) ViewClass.initialize();
  }
  const View = class extends ViewClass.Array {};
  View.View = ViewClass;
  View.itemLength = ViewClass.objectLength || itemLength;
  if (typeof itemLength !== 'number') ArrayViews.set(ViewClass, View);
  return View;
}

module.exports = ArrayViewMixin;
