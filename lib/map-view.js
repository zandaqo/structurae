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
    const { layout, fields } = this.constructor;
    const definition = layout[field];
    if (!definition) throw TypeError(`Field "${field}" is not found.`);
    const { View, start } = definition;
    const fieldStart = this.getUint32(start << 2, true);
    const end = start < fields.length - 1 ? this.getUint32(start + 1 << 2, true)
      : this.byteLength;
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
      new Uint8Array(this.buffer, this.byteOffset, this.byteLength)
        .set(
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
    const [length, offsets] = this.getLength(value, true);
    const view = new this(new ArrayBuffer(length));
    for (let i = 0; i < fieldCount; i++) {
      view.setUint32(i << 2, offsets[i], true);
      const start = offsets[i];
      const end = i < fieldCount - 1 ? offsets[i + 1] : length;
      if (start === end) continue;
      const field = fields[i];
      const { View } = layout[field];
      View.from(value[field], view, view.byteOffset + start, end - start);
    }
    return view;
  }

  /**
   * Returns the byte length of a map view necessary to hold a given object.
   *
   * @param {Object} value
   * @param {boolean} [getOffsets]
   * @returns {number}
   */
  static getLength(value, getOffsets) {
    const { layout, fields } = this;
    const fieldCount = fields.length;
    let length = fieldCount << 2;
    const offsets = new Array(fieldCount).fill(0);
    for (let i = 0; i < fieldCount; i++) {
      const field = fields[i];
      offsets[i] = length;
      if (value[field] == null) continue;
      const { View } = layout[field];
      const fieldValue = value[field];
      length += typeof fieldValue === 'string' ? StringView.getByteSize(fieldValue)
        : View.getLength(fieldValue.length || 1);
    }
    return !getOffsets ? length : [length, offsets];
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
    const lastFieldId = fields.length - 1;
    const object = {};
    for (let i = 0; i <= lastFieldId; i++) {
      const field = fields[i];
      const { View } = layout[field];
      const fieldStart = view.getUint32(i << 2, true);
      const end = i < lastFieldId ? view.getUint32(i + 1 << 2, true)
        : view.byteLength;
      if (fieldStart === end) continue;
      object[field] = View.toJSON(view, view.byteOffset + start + fieldStart, end - fieldStart);
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
      if (field.type !== 'array') {
        View = ObjectViewClass.getViewFromSchema(field);
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
      }
      layout[property] = { View, start: i };
    }
    this.layout = layout;
    this.fields = properties;
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
