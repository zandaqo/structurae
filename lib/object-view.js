const StringView = require('./string-view');
const StringArrayView = require('./string-array-view');
const ArrayViewMixin = require('./array-view');
const TypedArrayViewMixin = require('./typed-array-view');
const ExtendedDataView = require('./extended-data-view');

/**
 * @typedef {('int8' | 'uint8' | 'int16' | 'uint16'
 * | 'int32' | 'uint32' | 'float32' | 'float64'
 * | 'bigint64' | 'biguint64' | 'string' | 'array' | 'object' | 'typedarray'
 * | Class<ArrayView>|Class<ObjectView>|Class<TypedArrayView>)} ObjectViewFieldType
 */

/**
 * @typedef {Object} ObjectViewField
 * @property {ObjectViewFieldType} type
 * @property {number} [size] the maximum size in bytes for a string type
 * @property {boolean} [littleEndian]
 * @property {number} [start]
 * @property {number} [length]
 * @property {Class<ArrayView>|Class<ObjectView>|Class<TypedArrayView>} [ctor]
 */

/**
 * @private
 */
const fieldSizes = {
  int8: 1,
  uint8: 1,
  int16: 2,
  uint16: 2,
  int32: 4,
  uint32: 4,
  float32: 4,
  float64: 8,
  bigint64: 8,
  biguint64: 8,
};

/**
 * @extends DataView
 */
class ObjectView extends ExtendedDataView {
  /**
   * Returns the value of a given field.
   *
   * @param {string} field the name of the field
   * @returns {*} value of the field
   */
  get(field) {
    const {
      type, littleEndian, start, ctor, length, stringLength,
    } = this.constructor.schema[field];
    switch (type) {
      case 'int8': return this.getInt8(start);
      case 'uint8': return this.getUint8(start);
      case 'int16': return this.getInt16(start, littleEndian);
      case 'uint16': return this.getUint16(start, littleEndian);
      case 'int32': return this.getInt32(start, littleEndian);
      case 'uint32': return this.getUint32(start, littleEndian);
      case 'float32': return this.getFloat32(start, littleEndian);
      case 'float64': return this.getFloat64(start, littleEndian);
      case 'bigint64': return this.getBigInt64(start, littleEndian);
      case 'biguint64': return this.getBigUint64(start, littleEndian);
      case 'stringarray': return new StringArrayView(this.buffer, this.byteOffset + start, length, stringLength);
      default: return this.getView(start, length, ctor);
    }
  }

  /**
   * @private
   * @param {number} position
   * @param {number} length
   * @param {Class<ArrayView>|Class<TypedArrayView>
   *   |Class<ObjectView>|Class<StringView>} [Ctor=StringView]
   * @returns {ArrayView|TypedArrayView|ObjectView|StringView}
   */
  getView(position, length, Ctor = StringView) {
    return new Ctor(this.buffer, this.byteOffset + position, length);
  }

  /**
   * Sets a value to a field.
   *
   * @param {string} field the name of the field
   * @param {*} value the value to be set
   * @returns {ObjectView}
   */
  set(field, value) {
    return this.setValue(field, value);
  }

  /**
   * Sets an ObjectView value to a field.
   *
   * @param {string} field the name of the field
   * @param {ObjectView|ArrayView|TypedArrayView|StringView} value the view to set
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
   * Returns an Object corresponding to the object view.
   *
   * @returns {Object}
   */
  toObject() {
    return this.getObject(this.constructor.schema, 0);
  }

  /**
   * Assigns fields of a given object to the provided object view
   * or a new object view.
   *
   * @param {Object} object the object to take data from
   * @param {ObjectView} [view] the object view to assign fields to
   * @returns {ObjectView}
   */
  static from(object, view) {
    const objectView = view || new this(new ArrayBuffer(this.getLength()));
    objectView.setObject(0, object, objectView.constructor);
    return objectView;
  }

  /**
   * Returns the byte length of an object view.
   *
   * @returns {number}
   */
  static getLength() {
    if (!this.isInitialized) this.initialize();
    return this.objectLength;
  }

  /**
   * @private
   * @returns {void}
   */
  static initialize() {
    const { schema } = this;
    const fields = Object.keys(schema);
    let lastOffset = 0;
    for (let i = 0; i < fields.length; i++) {
      const name = fields[i];
      const field = schema[name];
      const {
        type, size, littleEndian, length,
      } = field;
      field.start = lastOffset;
      switch (type) {
        case 'int8':
        case 'uint8':
        case 'int16':
        case 'uint16':
        case 'int32':
        case 'uint32':
        case 'float32':
        case 'float64':
        case 'bigint64':
        case 'biguint64':
          if (size) {
            field.ctor = TypedArrayViewMixin(type, littleEndian);
            field.type = 'typedarray';
            field.length = field.ctor.getLength(size);
          } else {
            field.length = fieldSizes[type];
          }
          break;
        case 'string':
          if (size) {
            field.type = 'stringarray';
            field.stringLength = length;
            field.length = StringArrayView.getLength(size, length);
          }
          break;
        default:
          if (typeof type === 'string') throw TypeError(`Type "${type}" is not a valid type.`);
          if (size) {
            field.type = 'array';
            field.ctor = ArrayViewMixin(type);
            field.length = field.ctor.getLength(size);
          } else {
            field.type = 'object';
            field.ctor = type;
            field.length = type.getLength();
          }
      }
      lastOffset += field.length;
    }
    this.objectLength = lastOffset;
    this.fields = fields;
    this.isInitialized = true;
  }
}
/**
 * @private
 * @type {Array<ObjectViewField>}
 */
ObjectView.fields = undefined;

/**
 * @private
 */
ObjectView.schema = undefined;

/**
 * @private
 */
ObjectView.objectLength = 0;

/** @type {boolean} */
ObjectView.isInitialized = false;

module.exports = ObjectView;
