const StringView = require('./string-view');
const ArrayView = require('./array-view');
const ArrayViewMixin = require('./array-view-mixin');
const { TypeViewMixin } = require('./type-view');
const BooleanView = require('./boolean-view');

/**
 * @typedef {ArrayView|ObjectView|StringView|TypeView} View
 */

/**
 * @typedef {'int8'|'uint8'|'int16'|'uint16'|'int32'
 * |'uint32'|'float32'|'float64'|'bigint64'|'biguint64'} PrimitiveFieldType
 */

/**
 * @typedef {Object} ViewLayoutField
 * @property {Class<View>} View
 * @property {number} [start]
 * @property {number} [length]
 * @property {*} [default]
 */

/**
 * A DataView based C-like struct to store JavaScript objects in ArrayBuffer.
 *
 * @extends DataView
 */
class ObjectView extends DataView {
  /**
   * Returns the JavaScript value of a given field.
   *
   * @param {string} field the name of the field
   * @returns {*} value of the field
   */
  get(field) {
    const { start, View, length } = this.constructor.layout[field];
    return View.toJSON(this, start, length);
  }

  /**
   * Returns a view of a given field.
   *
   * @param {string} field the name of the field
   * @returns {View} view of the field
   */
  getView(field) {
    const { View, start, length } = this.constructor.layout[field];
    return new View(this.buffer, this.byteOffset + start, length);
  }

  /**
   * Sets a JavaScript value to a field.
   *
   * @param {string} field the name of the field
   * @param {*} value the value to be set
   * @returns {ObjectView}
   */
  set(field, value) {
    const { start, View, length } = this.constructor.layout[field];
    View.from(value, this, start, length);
    return this;
  }

  /**
   * Copies a given view into a field.
   *
   * @param {string} field the name of the field
   * @param {View} value the view to set
   * @returns {ObjectView}
   */
  setView(field, value) {
    const { start } = this.constructor.layout[field];
    new Uint8Array(this.buffer, this.byteOffset, this.byteLength).set(
      new Uint8Array(value.buffer, value.byteOffset, value.byteLength),
      start,
    );
    return this;
  }

  /**
   * Returns an Object corresponding to the view.
   *
   * @returns {Object}
   */
  toJSON() {
    return this.constructor.toJSON(this, 0);
  }

  /**
   * Assigns fields of a given object to the provided view or a new object view.
   *
   * @param {Object} object the object to take data from
   * @param {View} [view] the object view to assign fields to
   * @param {number} [start=0]
   * @param {number} [length]
   * @returns {View}
   */
  static from(object, view, start = 0, length = this.objectLength) {
    const objectView = view || new this(this.defaultBuffer.slice());
    if (view) new Uint8Array(view.buffer, view.byteOffset + start, length).fill(0);
    const { fields, layout } = this;
    for (let i = 0; i < fields.length; i++) {
      const name = fields[i];
      if (Reflect.has(object, name)) {
        const { View, start: fieldStart, length: fieldLength } = layout[name];
        View.from(object[name], objectView, start + fieldStart, fieldLength);
      }
    }
    return objectView;
  }

  /**
   * Returns an Object corresponding to a given view.
   *
   * @param {View} view a given view
   * @param {number} [start=0] starting offset
   * @returns {Object}
   */
  static toJSON(view, start = 0) {
    const { fields, layout } = this;
    const result = {};
    for (let i = 0; i < fields.length; i++) {
      const name = fields[i];
      const { View, start: fieldStart, length: fieldLength } = layout[name];
      result[name] = View.toJSON(view, start + fieldStart, fieldLength);
    }
    return result;
  }

  /**
   * @private
   * @returns {void}
   */
  static setDefaultBuffer() {
    const { objectLength, fields, layout } = this;
    const buffer = new ArrayBuffer(objectLength);
    const view = new this(buffer);
    for (let i = 0; i < fields.length; i++) {
      const name = fields[i];
      const field = layout[name];
      if (Reflect.has(field, 'default')) {
        view.set(name, field.default);
      } else if (field.View.defaultBuffer) {
        new Uint8Array(buffer).set(new Uint8Array(field.View.defaultBuffer), field.start);
      }
    }
    this.defaultBuffer = buffer;
  }

  /**
   * Returns the byte length of an object view.
   *
   * @returns {number}
   */
  static getLength() {
    return this.objectLength;
  }

  /**
   * Initializes the object view class.
   *
   * @param {Class<ObjectView>} ParentViewClass
   * @returns {void}
   */
  static initialize(ParentViewClass = ObjectView) {
    const { schema } = this;
    const schemas = this.getSchemaOrdering(schema);
    for (let i = schemas.length - 1; i >= 0; i--) {
      const objectSchema = schemas[i];
      const id = objectSchema.$id;
      if (Reflect.has(ObjectView.Views, id)) continue;
      const View = i === 0 ? this : class extends ParentViewClass {};
      [View.layout, View.objectLength, View.fields] = this.getLayoutFromSchema(objectSchema);
      ObjectView.Views[id] = View;
      View.setDefaultBuffer();
    }
  }

  /**
   * @param {Object} schema
   * @returns {Array<Object>}
   */
  static getSchemaOrdering(schema) {
    // create graph
    let object = schema;
    let id = object.$id;
    const objects = { [id]: object };
    const adjacency = { [id]: [] };
    const indegrees = { [id]: 0 };
    const processing = [id];
    while (processing.length) {
      id = processing.pop();
      object = objects[id];
      const properties = Object.keys(object.properties);
      for (const property of properties) {
        let field = object.properties[property];
        if (field.type === 'array') {
          while (field.type === 'array') field = field.items;
        }
        const { $id, $ref } = field;
        if ($id) {
          objects[$id] = field;
          adjacency[id].push($id);
          adjacency[$id] = [];
          indegrees[$id] = indegrees[$id] ? indegrees[$id] + 1 : 1;
          processing.push($id);
        } else if ($ref) {
          const refId = $ref.slice(1);
          indegrees[refId] = indegrees[refId] ? indegrees[refId] + 1 : 1;
          adjacency[id].push(refId);
        }
      }
    }

    // topologically sort the graph
    let visited = 0;
    const order = [];
    processing.push(schema.$id);
    while (processing.length) {
      id = processing.shift();
      const children = adjacency[id];
      if (!children) continue; // $ref no external links
      order.push(objects[id]);
      for (const child of children) {
        indegrees[child] -= 1;
        if (indegrees[child] === 0) processing.push(child);
      }
      visited++;
    }
    // check for recursive links
    if (visited !== Object.keys(objects).length) {
      throw TypeError('The schema has recursive references.');
    }
    return order;
  }

  /**
   * @private
   * @param {Object} schema
   * @returns {Array<*>}
   */
  static getLayoutFromSchema(schema) {
    const properties = Object.keys(schema.properties);
    const layout = {};
    let lastOffset = 0;
    for (const property of properties) {
      let field = schema.properties[property];
      const start = lastOffset;
      let View;
      let length = 0;
      let defaultValue;
      if (field.type !== 'array') {
        View = this.getViewFromSchema(field);
        length = field.maxLength || View.getLength();
        defaultValue = field.default;
      } else {
        const sizes = [];
        defaultValue = field.default;
        while (field && field.type === 'array') {
          sizes.push(field.maxItems);
          field = field.items;
        }
        View = ArrayViewMixin(this.getViewFromSchema(field), field.maxLength);
        let itemLength = View.getLength(sizes.pop());
        for (let i = sizes.length - 1; i >= 0; i--) {
          View = ArrayViewMixin(View, itemLength);
          itemLength = View.getLength(sizes[i]);
        }
        length = itemLength;
      }
      lastOffset += length;
      layout[property] = { start, View, length };
      if (defaultValue !== undefined) layout[property].default = defaultValue;
    }
    return [layout, lastOffset, properties];
  }

  /**
   * @param {Object} schema
   * @returns {Class<View>}
   */
  static getViewFromSchema(schema) {
    const { $ref, type } = schema;
    let { $id } = schema;
    if ($ref) $id = $ref.slice(1);
    if ($id) {
      if (!Reflect.has(ObjectView.Views, $id)) throw Error(`View "${$id}" is not found.`);
      return ObjectView.Views[$id];
    }
    if (Reflect.has(this.types, type)) {
      return this.types[type](schema);
    }
    throw TypeError(`Type "${type}" is not supported.`);
  }
}

/**
 * @type {Object<string, Function>}
 */
ObjectView.types = {
  /**
   * @returns {Class<BooleanView>}
   */
  boolean() {
    return BooleanView;
  },

  /**
   * @param {object} field
   * @returns {Class<TypeViewMixin>}
   */
  number(field) {
    const { btype = 'float64', littleEndian = true } = field;
    return TypeViewMixin(btype, littleEndian);
  },

  /**
   * @param {object} field
   * @returns {Class<TypeViewMixin>}
   */
  integer(field) {
    const { btype = 'int32', littleEndian = true } = field;
    return TypeViewMixin(btype, littleEndian);
  },

  /**
   * @returns {Class<StringView>}
   */
  string() {
    return StringView;
  },
};

/**
 * @private
 * @type {Object<string, ViewLayoutField>}
 */
ObjectView.layout = undefined;

/** @type {object} */
ObjectView.schema = undefined;

/**
 * @private
 * @type {Array<string>}
 */
ObjectView.fields = undefined;

/**
 * @private
 * @type {number}
 */
ObjectView.objectLength = 0;

/**
 * @private
 * @type {ArrayBuffer}
 */
ObjectView.defaultBuffer = undefined;

/**
 * @type {Object<string, Class<View>>}
 */
ObjectView.Views = {};

/**
 * @type {Class<ArrayView>}
 */
ObjectView.ArrayClass = ArrayView;

/**
 * Creates an ObjectView class with a given schema.
 *
 * @param {object} schema the schema to use for the class
 * @param {Class<ObjectView>} [ObjectViewClass] an optional ObjectView class to extend
 * @returns {Class<ObjectView>}
 */
function ObjectViewMixin(schema, ObjectViewClass = ObjectView) {
  const id = schema.$id;
  if (ObjectView.Views[id]) return ObjectView.Views[id];
  class Base extends ObjectViewClass {}
  Base.schema = schema;
  Base.initialize();
  return Base;
}

module.exports = {
  ObjectView,
  ObjectViewMixin,
};
