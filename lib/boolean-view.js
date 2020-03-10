const TypeViewMixin = require('./type-view');

class BooleanView extends TypeViewMixin('uint8') {
  /**
   * Creates a view with a given value.
   *
   * @param {number|boolean} value
   * @param {View} view
   * @param {number} [start=0]
   * @returns {View}
   */
  static from(value, view, start) {
    return super.from(+value, view, start);
  }

  /**
   * Returns the boolean value of a given view.
   *
   * @param {View} view
   * @param {number} [start=0]
   * @returns {boolean}
   *
   */
  static toJSON(view, start) {
    return !!super.toJSON(view, start);
  }
}

module.exports = BooleanView;
