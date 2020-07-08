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
    const layout = this.getLayout(field);
    if (!layout) return undefined;
    const [View, start, length] = layout;
    return View.toJSON(this, start, length);
  }

  /**
   * Returns a view of a given field.
   *
   * @param {string} field the name of the field
   * @returns {View} view of the field
   */
  getView(field) {
    const layout = this.getLayout(field);
    if (!layout) return undefined;
    const [View, start, length] = layout;
    return new View(this.buffer, start, length);
  }

  /**
   * @private
   * @param {string} field
   * @returns {Array}
   */
  getLayout(field) {
    const definition = this.constructor.layout[field];
    if (!definition) return undefined;
    const { View, start, required, length } = definition;
    if (required) {
      return [View, start, length];
    }
    const startOffset = this.getUint32(start, true);
    const end = this.getUint32(start + 4, true);
    if (startOffset === end) return undefined;
    return [View, startOffset, end - startOffset];
  }

  /**
   * Sets a JavaScript value of a field.
   *
   * @param {string} field the name of the field
   * @param {*} value the value to be set
   * @returns {MapView}
   */
  set(field, value) {
    const layout = this.getLayout(field);
    if (!layout) return undefined;
    const [View, start, length] = layout;
    View.from(value, this, this.byteOffset + start, length);
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
    const layout = this.getLayout(field);
    if (!layout) return undefined;
    new Uint8Array(this.buffer, this.byteOffset, this.byteLength).set(
      new Uint8Array(value.buffer, value.byteOffset, value.byteLength),
      layout[1],
    );
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
   * @param {View} [view] the view to assign fields to
   * @param {number} [start=0]
   * @returns {View}
   */
  static from(value, view, start = 0) {
    const mapView = view || this.bufferView;
    if (this.defaultBuffer) {
      new Uint8Array(mapView.buffer).set(this.defaultBuffer, start);
    }
    const { layout, requiredFields, optionalFields, optionalOffset } = this;
    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      const fieldValue = value[field];
      if (fieldValue != null) {
        const { View, length: maxLength, start: fieldStart } = layout[field];
        View.from(fieldValue, mapView, start + fieldStart, maxLength);
      }
    }
    const optionalFieldCount = optionalFields.length;
    let end = optionalOffset + ((optionalFieldCount + 1) << 2);
    for (let i = 0; i < optionalFieldCount; i++) {
      const field = optionalFields[i];
      const fieldValue = value[field];
      const { View, length: maxLength, start: fieldStart } = layout[field];
      let fieldLength = 0;
      if (fieldValue != null) {
        const valueLength =
          typeof fieldValue === 'string'
            ? StringView.getByteSize(fieldValue)
            : View.getLength(fieldValue.length || 1);
        fieldLength = Math.min(valueLength, maxLength);
        View.from(fieldValue, mapView, start + end, fieldLength);
      }
      mapView.setUint32(start + fieldStart, end, true);
      end += fieldLength;
    }
    mapView.setUint32(start + optionalOffset + (optionalFieldCount << 2), end, true);
    return view || new this(mapView.buffer.slice(0, end));
  }

  /**
   * Returns the byte length of a map view necessary to hold a given object.
   *
   * @param {Object} value
   * @returns {number}
   */
  static getLength(value) {
    const { layout, optionalFields, optionalOffset } = this;
    const fieldCount = optionalFields.length;
    let length = optionalOffset + ((fieldCount + 1) << 2);
    for (let i = 0; i < fieldCount; i++) {
      const field = optionalFields[i];
      const fieldValue = value[field];
      if (fieldValue == null) continue;
      const { View } = layout[field];
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
    const { layout, requiredFields, optionalFields } = this;
    const object = {};
    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      const { View, start: startOffset, length } = layout[field];
      object[field] = View.toJSON(view, start + startOffset, length);
    }
    for (let i = 0; i < optionalFields.length; i++) {
      const field = optionalFields[i];
      const { View, start: startOffset } = layout[field];
      const fieldStart = view.getUint32(start + startOffset, true);
      const end = view.getUint32(start + startOffset + 4, true);
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
    const required = schema.required || [];
    const optional = Object.keys(schema.properties).filter((i) => !required.includes(i));
    const layout = {};
    let offset = 0;
    for (let i = 0; i < required.length; i++) {
      const property = required[i];
      const field = schema.properties[property];
      const fieldLayout = this.getFieldLayout(field, offset, true);
      layout[property] = fieldLayout;
      offset += fieldLayout.length;
    }
    this.optionalOffset = offset;
    for (let i = 0; i < optional.length; i++) {
      const property = optional[i];
      const field = schema.properties[property];
      layout[property] = this.getFieldLayout(field, offset + (i << 2), false);
    }
    this.layout = layout;
    this.requiredFields = required;
    this.optionalFields = optional;
    if (offset) this.setDefaultBuffer();
  }

  /**
   * @private
   * @param {Object} field
   * @param {number} start
   * @param {boolean} required
   * @returns {Array}
   */
  static getFieldLayout(field, start, required) {
    let currentField = field;
    let View;
    let length;
    if (currentField.type !== 'array') {
      View = this.ObjectViewClass.getViewFromSchema(currentField);
      length = currentField.type === 'string' ? currentField.maxLength : View.getLength();
    } else {
      const sizes = [];
      while (currentField && currentField.type === 'array') {
        sizes.push(currentField.maxItems);
        currentField = currentField.items;
      }
      View = ArrayViewMixin(
        this.ObjectViewClass.getViewFromSchema(currentField),
        currentField.maxLength,
      );
      let itemLength = View.getLength(sizes.pop());
      for (let j = sizes.length - 1; j >= 0; j--) {
        View = ArrayViewMixin(View, itemLength);
        itemLength = View.getLength(sizes[j]);
      }
      length = itemLength;
    }
    if (!length) length = Infinity;
    if (required && length === Infinity)
      throw new TypeError('The length of a required field is undefined.');
    const layout = { View, start, length, required };
    if (Reflect.has(field, 'default')) layout.default = field.default;
    return layout;
  }

  /**
   * @private
   * @returns {void}
   */
  static setDefaultBuffer() {
    const { requiredFields, layout, optionalOffset } = this;
    const buffer = new ArrayBuffer(optionalOffset);
    const array = new Uint8Array(buffer);
    const view = new this(buffer);
    for (let i = 0; i < requiredFields.length; i++) {
      const name = requiredFields[i];
      const field = layout[name];
      if (Reflect.has(field, 'default')) {
        view.set(name, field.default);
      } else if (field.View.defaultBuffer) {
        array.set(new Uint8Array(field.View.defaultBuffer), field.start);
      }
    }
    this.defaultBuffer = array;
  }

  /**
   * @type {DataView}
   */
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
MapView.optionalFields = undefined;

/**
 * @type {Array<string>}
 */
MapView.requiredFields = undefined;

/**
 * @type {number}
 */
MapView.optionalOffset = 0;

/**
 * @type {Uint8Array}
 */
MapView.defaultBuffer = undefined;

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
