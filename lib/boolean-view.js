const TypeViewMixin = require('./type-view');

class BooleanView extends TypeViewMixin('uint8') {
  static get(position, view) {
    return !!super.get(position, view);
  }

  static set(position, value, view) {
    super.set(position, +value, view);
  }
}

module.exports = BooleanView;
