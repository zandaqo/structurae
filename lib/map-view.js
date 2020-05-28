const { ObjectView, ObjectViewMixin } = require('./object-view');
const StringView = require('./string-view');
const ArrayViewMixin = require('./array-view-mixin');

/**
 * @extends DataView
 */
class MapView extends DataView {
  /**
   * Returns the JavaScript value at a given field.
   *
   * @param {string} field the name of the field
   * @returns {*} value of the field
   */
  get(field) {
    const [View, start, end] = this.getLayout(field);
    if (start === end) return undefined;
    return View.toJSON(this, this.byteOffset + start, end - start);
  }

  /**
   * Returns a view of a given field.
   *
   * @param {string} field the name of the field
   * @returns {View} view of the field
   */
  getView(field) {
    const [View, start, end] = this.getLayout(field);
    if (start === end) return undefined;
    return new View(this.buffer, this.byteOffset + start, end - start);
  }

  /**
   * @private
   * @param {string} field
   * @returns {Array}
   */
  getLayout(field) {
    const { layout } = this.constructor;
    const definition = layout[field];
    if (!definition) throw TypeError(`Field "${field}" is not found.`);
    const { View, start } = definition;
    const startOffset = start << 2;
    const fieldStart = this.getUint32(startOffset, true);
    const end = this.getUint32(startOffset + 4, true);
    return [View, fieldStart, end];
  }

  /**
   * Sets a JavaScript value of a field.
   *
   * @param {string} field the name of the field
   * @param {*} value the value to be set
   * @returns {MapView}
   */
  set(field, value) {
    const [View, start, end] = this.getLayout(field);
    if (start !== end) View.from(value, this, this.byteOffset + start, end - start);
    return this;
  }

  /**
   * Copies a given view into a field.
   *
   * @param {string} field the name of the field
   * @param {View} value the view to set
   * @returns {MapView}
   */
  setView(field, value) {
    const [, start, end] = this.getLayout(field);
    if (start !== end) {
      new Uint8Array(this.buffer, this.byteOffset, this.byteLength).set(
        new Uint8Array(value.buffer, value.byteOffset, value.byteLength),
        start,
      );
    }
    return this;
  }

  /**
   * Returns an object corresponding to the view.
   *
   * @returns {Object}
   */
  toJSON() {
    return this.constructor.toJSON(this);
  }

  /**
   * Creates a map view from a given object.
   *
   * @param {Object} value the object to take data from
   * @returns {MapView}
   */
  static from(value) {
    const { layout, fields } = this;
    const fieldCount = fields.length;
    let offset = (fieldCount + 1) << 2;
    const view = this.bufferView;
    view.setUint32(0, offset, true);
    for (let i = 0; i < fieldCount; i++) {
      const field = fields[i];
      const fieldValue = value[field];
      if (fieldValue != null) {
        const { View, length } = layout[field];
        const start = offset;
        const valueLength =
          typeof fieldValue === 'string'
            ? StringView.getByteSize(fieldValue)
            : View.getLength(fieldValue.length || 1);
        offset += Math.min(valueLength, length);
        View.from(fieldValue, view, start, offset - start);
      }
      view.setUint32((i + 1) << 2, offset, true);
    }
    return new this(view.buffer.slice(0, offset));
  }

  /**
   * Returns the byte length of a map view necessary to hold a given object.
   *
   * @param {Object} value
   * @returns {number}
   */
  static getLength(value) {
    const { layout, fields } = this;
    const fieldCount = fields.length;
    let length = (fieldCount + 1) << 2;
    for (let i = 0; i < fieldCount; i++) {
      const field = fields[i];
      if (value[field] == null) continue;
      const { View } = layout[field];
      const fieldValue = value[field];
      length +=
        typeof fieldValue === 'string'
          ? StringView.getByteSize(fieldValue)
          : View.getLength(fieldValue.length || 1);
    }
    return length;
  }

  /**
   * Returns an Object corresponding to a given map view.
   *
   * @param {View} view a given view
   * @param {number} [start=0] starting offset
   * @returns {Object}
   */
  static toJSON(view, start = 0) {
    const { layout, fields } = this;
    const object = {};
    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];
      const { View } = layout[field];
      const startOffset = start + (i << 2);
      const fieldStart = view.getUint32(startOffset, true);
      const end = view.getUint32(startOffset + 4, true);
      if (fieldStart === end) continue;
      object[field] = View.toJSON(view, start + fieldStart, end - fieldStart);
    }
    return object;
  }

  /**
   * Initializes the map view class.
   *
   * @returns {void}
   */
  static initialize() {
    const { schema, ObjectViewClass } = this;
    const objects = ObjectViewClass.getSchemaOrdering(schema);
    if (objects.length > 1) {
      for (let i = objects.length - 1; i > 0; i--) {
        ObjectViewMixin(objects[i], ObjectViewClass);
      }
    }
    const properties = Object.keys(schema.properties);
    const layout = {};
    for (let i = 0; i < properties.length; i++) {
      const property = properties[i];
      let field = schema.properties[property];
      let View;
      let length = Infinity;
      if (field.type !== 'array') {
        View = ObjectViewClass.getViewFromSchema(field);
        length = field.type === 'string' ? field.maxLength : View.getLength();
      } else {
        const sizes = [];
        while (field && field.type === 'array') {
          sizes.push(field.maxItems);
          field = field.items;
        }
        View = ArrayViewMixin(ObjectViewClass.getViewFromSchema(field), field.maxLength);
        let itemLength = View.getLength(sizes.pop());
        for (let j = sizes.length - 1; j >= 0; j--) {
          View = ArrayViewMixin(View, itemLength);
          itemLength = View.getLength(sizes[j]);
        }
        length = itemLength;
      }
      layout[property] = { View, start: i, length: length || Infinity };
    }
    this.layout = layout;
    this.fields = properties;
  }

  static get bufferView() {
    if (!this.maxView) this.maxView = new DataView(new ArrayBuffer(this.maxLength));
    return this.maxView;
  }
}

/**
 * @type {Object}
 */
MapView.schema = undefined;

/**
 * @type {Object<string, Object>}
 */
MapView.layout = undefined;

/**
 * @type {Array<string>}
 */
MapView.fields = undefined;

/**
 * @type {Class<ObjectView>}
 */
MapView.ObjectViewClass = undefined;

/**
 * @type {Object<string, Class<MapView>>}
 */
MapView.Views = {};

/**
 * @type {number} Maximum possible size of a map.
 */
MapView.maxLength = 8192;

/**
 * @protected
 * @type {DataView}
 */
MapView.maxView = undefined;

/**
 * Creates a MapView class with a given schema.
 *
 * @param {object} schema the schema to use for the class
 * @param {Class<MapView>} [MapViewClass] an optional MapView class to extend
 * @param {Class<ObjectView>} [ObjectViewClass] an optional ObjectView class
 *                                              to use for nested objects
 * @returns {Class<MapView>}
 */
function MapViewMixin(schema, MapViewClass = MapView, ObjectViewClass = ObjectView) {
  const id = schema.$id;
  if (MapView.Views[id]) return MapView.Views[id];
  class Base extends MapViewClass {}
  Base.schema = schema;
  Base.ObjectViewClass = ObjectViewClass;
  Base.initialize();
  MapView.Views[id] = Base;
  return Base;
}

module.exports = {
  MapView,
  MapViewMixin,
};
