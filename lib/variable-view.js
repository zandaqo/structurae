/**
 * @extends {DataView}
 */
class VariableView extends DataView {
  /**
   * @type {DataView}
   */
  static get bufferView() {
    if (!this.maxView) this.maxView = new DataView(new ArrayBuffer(this.maxLength));
    return this.maxView;
  }
}

/**
 * @type {number} Maximum possible size of a map.
 */
VariableView.maxLength = 8192;

/**
 * @type {DataView}
 */
VariableView.maxView = undefined;

module.exports = VariableView;
