const { ObjectView, ObjectViewMixin } = require('./object-view');
const StringView = require('./string-view');
const ArrayViewMixin = require('./array-view-mixin');

/**
 * @extends DataView
 */
class CollectionView extends DataView {
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
    const { View, offset } = definition;
    const start = this.getUint32(offset << 2, true);
    const end = offset < fields.length - 1 ? this.getUint32(offset + 1 << 2, true)
      : this.byteLength;
    return [View, start, end];
  }

  /**
   * Sets a JavaScript value of a field.
   *
   * @param {string} field the name of the field
   * @param {*} value the value to be set
   * @returns {CollectionView}
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
   * @returns {CollectionView}
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
   * Allows iterating over objects stored in the collection.
   *
   * @returns {Iterable<View>}
   */
  * [Symbol.iterator]() {
    const { fields } = this.constructor;
    for (const field of fields) {
      yield this.getView(field);
    }
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
   * Creates a collection view from a given object.
   *
   * @param {Object} value the object to take data from
   * @returns {CollectionView}
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
   * Returns the byte length of a collection view necessary to hold a given object.
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
      if (!Reflect.has(value, field)) continue;
      const { View } = layout[field];
      const fieldValue = value[field];
      length += typeof fieldValue === 'string' ? StringView.getByteSize(fieldValue)
        : View.getLength(fieldValue.length || 1);
    }
    return !getOffsets ? length : [length, offsets];
  }

  /**
   * Returns an Object corresponding to a given collection view.
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
   * Initializes the collection view class.
   *
   * @returns {void}
   */
  static initialize() {
    const { schema } = this;
    const objects = ObjectView.getSchemaOrdering(schema);
    if (objects.length > 1) {
      for (let i = objects.length - 1; i > 0; i--) {
        ObjectViewMixin(objects[i]);
      }
    }
    const properties = Object.keys(schema.properties);
    const layout = {};
    for (let i = 0; i < properties.length; i++) {
      const property = properties[i];
      let field = schema.properties[property];
      let View;
      if (field.type !== 'array') {
        View = ObjectView.getViewFromSchema(field);
      } else {
        const sizes = [];
        while (field && field.type === 'array') {
          sizes.push(field.maxItems);
          field = field.items;
        }
        View = ArrayViewMixin(ObjectView.getViewFromSchema(field), field.maxLength);
        let itemLength = View.getLength(sizes.pop());
        for (let j = sizes.length - 1; j >= 0; j--) {
          View = ArrayViewMixin(View, itemLength);
          itemLength = View.getLength(sizes[j]);
        }
      }
      layout[property] = { View, offset: i };
    }
    this.layout = layout;
    this.fields = properties;
  }
}

/**
 * @type {Object}
 */
CollectionView.schema = undefined;

/**
 * @type {Object<string, Object>}
 */
CollectionView.layout = undefined;

/**
 * @type {Array<string>}
 */
CollectionView.fields = undefined;

/**
 * @type {Object<string, Class<CollectionView>>}
 */
CollectionView.Views = {};

/**
 * Creates a CollectionView class with a given schema.
 *
 * @param {object} schema the schema to use for the class
 * @param {Class<CollectionView>} [CollectionViewClass] an optional ObjectView class to extend
 * @returns {Class<CollectionView>}
 */
function CollectionViewMixin(schema, CollectionViewClass = CollectionView) {
  const id = schema.$id;
  if (CollectionView.Views[id]) return CollectionView.Views[id];
  class Base extends CollectionViewClass {}
  Base.schema = schema;
  Base.initialize();
  CollectionView.Views[id] = Base;
  return Base;
}

module.exports = {
  CollectionView,
  CollectionViewMixin,
};
