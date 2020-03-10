const StringView = require('./string-view');
const { ArrayViewMixin, TypedArrayViewMixin } = require('./array-view-mixin');
const TypeViewMixin = require('./type-view');
const BooleanView = require('./boolean-view');

/**
 * @typedef {Class<ArrayView>|Class<ObjectView>|Class<TypedArrayView>
 *   |Class<StringView>|Class<TypeView>} ViewType
 */

/**
 * @typedef {ArrayView|ObjectView|TypedArrayView|StringView|TypeView} View
 */

/**
 * @typedef {'int8'|'uint8'|'int16'|'uint16'|'int32'
 * |'uint32'|'float32'|'float64'|'bigint64'|'biguint64'} PrimitiveFieldType
 */

/**
 * @typedef {(PrimitiveFieldType|string|ViewType)} ObjectViewFieldType
 */

/**
 * @typedef {Object} ObjectViewField
 * @property {ObjectViewFieldType} type
 * @property {number} [size] the maximum size in bytes for a string type
 * @property {boolean} [littleEndian]
 * @property {number} [length]
 * @property {number} [start]
 * @property {ViewType} [View]
 * @property {*} [default]
 */

/**
 * @typedef {Object<string, ObjectViewField>} ObjectViewSchema
 */

/**
 * @typedef {Object<string, Function>} ObjectViewTypeDefs
 */

/**
 * A DataView based C-like struct to store JavaScript objects in ArrayBuffer.
 *
 * @extends DataView
 */
class ObjectView extends DataView {
  /**
   * Returns a number for primitive fields or a view for all other fields.
   *
   * @param {string} field the name of the field
   * @returns {*} value of the field
   */
  get(field) {
    const { start, View, length } = this.constructor.schema[field];
    return View.isPrimitive ? View.toJSON(this, start)
      : new View(this.buffer, this.byteOffset + start, length);
  }

  /**
   * Returns the JavaScript value of a given field.
   *
   * @param {string} field the name of the field
   * @returns {*} value of the field
   */
  getValue(field) {
    const { start, View, length } = this.constructor.schema[field];
    return View.toJSON(this, start, length);
  }

  /**
   * Returns a view of a given field.
   *
   * @param {string} field the name of the field
   * @returns {*} view of the field
   */
  getView(field) {
    const { View, start, length } = this.constructor.schema[field];
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
    const { start, View, length } = this.constructor.schema[field];
    View.from(value, this, start, length);
    return this;
  }

  /**
   * Sets an View to a field.
   *
   * @param {string} field the name of the field
   * @param {View} value the view to set
   * @returns {ObjectView}
   */
  setView(field, value) {
    const { start } = this.constructor.schema[field];
    new Uint8Array(this.buffer, this.byteOffset, this.byteLength)
      .set(
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
    const { fields, schema } = this;
    for (let i = 0; i < fields.length; i++) {
      const name = fields[i];
      if (Reflect.has(object, name)) {
        const { View, start: fieldStart, length: fieldLength } = schema[name];
        View.from(object[name], objectView, start + fieldStart, fieldLength);
      }
    }
    return objectView;
  }

  /**
   * Returns an Object corresponding to a given view.
   *
   * @param {View} view
   * @param {number} [start=0]
   * @returns {Object}
   */
  static toJSON(view, start = 0) {
    const { fields, schema } = this;
    const result = {};
    for (let i = 0; i < fields.length; i++) {
      const name = fields[i];
      const { View, start: fieldStart, length: fieldLength } = schema[name];
      result[name] = View.toJSON(view, start + fieldStart, fieldLength);
    }
    return result;
  }

  /**
   * @private
   * @returns {void}
   */
  static setDefaultBuffer() {
    const { objectLength, fields, schema } = this;
    const buffer = new ArrayBuffer(objectLength);
    const view = new this(buffer);
    for (let i = 0; i < fields.length; i++) {
      const name = fields[i];
      const field = schema[name];
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
   * @returns {void}
   */
  static initialize() {
    const { schema } = this;
    const fields = Object.keys(schema);
    let lastOffset = 0;
    for (let i = 0; i < fields.length; i++) {
      const name = fields[i];
      const field = schema[name];
      field.start = lastOffset;
      const type = typeof field.type !== 'string' ? 'object' : field.type;
      if (!Reflect.has(this.types, type)) throw TypeError(`Type "${field.type}" is not a valid type.`);
      const definition = typeof this.types[type] === 'string' ? this.types[this.types[type]] : this.types[type];
      if (definition) definition(field);
      lastOffset += field.length;
    }
    this.objectLength = lastOffset;
    this.fields = fields;
    this.isInitialized = true;
    this.setDefaultBuffer();
  }
}

/**
 * @type {ObjectViewTypeDefs}
 */
ObjectView.types = {
  int8: 'number',
  uint8: 'number',
  int16: 'number',
  uint16: 'number',
  int32: 'number',
  uint32: 'number',
  float32: 'number',
  float64: 'number',
  bigint64: 'number',
  biguint64: 'number',

  /**
   * @param {ObjectViewField} field
   * @returns {void}
   */
  boolean(field) {
    const { size } = field;
    field.View = size ? ArrayViewMixin(BooleanView) : BooleanView;
    field.length = field.View.getLength(size || 1);
  },

  /**
   * @param {ObjectViewField} field
   * @returns {void}
   */
  number(field) {
    const { type, littleEndian, size } = field;
    field.View = size ? TypedArrayViewMixin(type, littleEndian) : TypeViewMixin(type, littleEndian);
    field.length = field.View.getLength(size || 1);
  },

  /**
   * @param {ObjectViewField} field
   * @returns {void}
   */
  string(field) {
    const { size, length } = field;
    field.View = size ? ArrayViewMixin(StringView, length) : StringView;
    field.length = size ? field.View.getLength(size) : field.length;
  },

  /**
   * @param {ObjectViewField} field
   * @returns {void}
   */
  object(field) {
    const { type, size } = field;
    field.View = size ? ArrayViewMixin(type) : type;
    field.length = field.View.getLength(size);
  },
};

/**
 * @type {ObjectViewSchema}
 */
ObjectView.schema = undefined;

/** @type {boolean} */
ObjectView.isInitialized = false;

/** @type {boolean} */
ObjectView.isPrimitive = false;

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
 * Creates an ObjectView class with a given schema.
 *
 * @param {object} schema the schema to use for the class
 * @param {Class<ObjectView>} [ObjectViewClass] an optional ObjectView class to extend
 * @returns {Class<ObjectView>}
 */
function ObjectViewMixin(schema, ObjectViewClass = ObjectView) {
  class Base extends ObjectViewClass {}
  Base.schema = schema;
  Base.initialize();
  return Base;
}

module.exports = {
  ObjectView,
  ObjectViewMixin,
};
