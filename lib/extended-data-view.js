const StringView = require('./string-view');

/** @extends DataView */
class ExtendedDataView extends DataView {
  /**
   * @param {number} position
   * @param {Class<ArrayView>|Class<ObjectView>} ctor
   * @param {number} size
   * @returns {Array<Object>}
   */
  getArray(position, ctor, size) {
    const { schema, objectLength } = ctor;
    const result = new Array(size);
    for (let i = 0; i < size; i++) {
      result[i] = this.getObject(schema, position + (i * objectLength));
    }
    return result;
  }

  /**
   * @param {number} position
   * @param {number} size
   * @param {number} length
   * @param {number} stringLength
   * @returns {Array<string>}
   */
  getStringArray(position, size, length, stringLength) {
    const array = new Array(size);
    for (let i = 0; i < size; i++) {
      const string = new StringView(
        this.buffer, this.byteOffset + position + (i * stringLength), stringLength,
      );
      array[i] = string.toString();
    }
    return array;
  }

  /**
   * @param {number} position
   * @param {Class<TypedArrayView>} ctor
   * @param {number} size
   * @returns {Array<number>}
   */
  getTypedArray(position, ctor, size) {
    const { typeGetter, offset, littleEndian } = ctor;
    const result = new Array(size);
    for (let i = 0; i < size; i++) {
      result[i] = this[typeGetter](position + (i << offset), littleEndian);
    }
    return result;
  }

  /**
   * @param {object} schema
   * @param {number} offset
   * @returns {Object}
   */
  getObject(schema, offset) {
    const fields = Object.keys(schema);
    const result = {};
    for (let i = 0; i < fields.length; i++) {
      const name = fields[i];
      const {
        type, littleEndian, start, ctor: Ctor, length, size, stringLength,
      } = schema[name];
      let value;
      const position = offset + start;
      switch (type) {
        case 'int8': value = this.getInt8(position); break;
        case 'uint8': value = this.getUint8(position); break;
        case 'int16': value = this.getInt16(position, littleEndian); break;
        case 'uint16': value = this.getUint16(position, littleEndian); break;
        case 'int32': value = this.getInt32(position, littleEndian); break;
        case 'uint32': value = this.getUint32(position, littleEndian); break;
        case 'float32': value = this.getFloat32(position, littleEndian); break;
        case 'float64': value = this.getFloat64(position, littleEndian); break;
        case 'bigint64': value = this.getBigInt64(position, littleEndian); break;
        case 'biguint64': value = this.getBigUint64(position, littleEndian); break;
        case 'string': value = new StringView(this.buffer, this.byteOffset + position, length).toString(); break;
        case 'typedarray': value = this.getTypedArray(position, Ctor, size); break;
        case 'stringarray': value = this.getStringArray(position, size, length, stringLength); break;
        case 'array': value = this.getArray(position, Ctor, size); break;
        default: value = this.getObject(Ctor.schema, position);
      }
      result[name] = value;
    }
    return result;
  }

  /**
   * @param {number} position
   * @param {ArrayLike<object>} value
   * @param {Class<ArrayView>|Class<ObjectView>} ctor
   * @param {number} size
   * @returns {void}
   */
  setArray(position, value, ctor, size) {
    const { fields, schema } = ctor;
    const max = (size < value.length ? size : value.length);
    for (let i = 0; i < max; i++) {
      for (let j = 0; j < fields.length; j++) {
        const name = fields[j];
        this.setValue(name, value[i][name], schema, position + (i * ctor.objectLength));
      }
    }
  }

  /**
   * @param {number} position
   * @param {Object} value
   * @param {Class<ObjectView>} ctor
   * @returns {void}
   */
  setObject(position, value, ctor) {
    const { fields, schema } = ctor;
    for (let i = 0; i < fields.length; i++) {
      const name = fields[i];
      if (Reflect.has(value, name)) this.setValue(name, value[name], schema, position);
    }
  }

  /**
   * @param {number} position
   * @param {string} value
   * @param {number} length
   * @returns {void}
   */
  setString(position, value, length) {
    new Uint8Array(this.buffer, this.byteOffset + position, length)
      .fill(0)
      .set(StringView.fromString(value));
  }

  /**
   * @param {number} position
   * @param {string} value
   * @param {number} size
   * @param {number} length
   * @param {number} stringLength
   * @returns {void}
   */
  setStringArray(position, value, size, length, stringLength) {
    const array = new Uint8Array(this.buffer, this.byteOffset + position, length);
    array.fill(0);
    const max = (size < value.length ? size : value.length);
    for (let i = 0; i < max; i++) {
      const string = StringView.fromString(value[i], stringLength);
      array.set(string, i * stringLength);
    }
  }

  /**
   * @param {number} position
   * @param {ArrayLike<number>} value
   * @param {Class<TypedArrayView>} ctor
   * @param {number} size
   * @returns {void}
   */
  setTypedArray(position, value, ctor, size) {
    const { typeSetter, offset, littleEndian } = ctor;
    const max = (size < value.length ? size : value.length);
    for (let i = 0; i < max; i++) {
      this[typeSetter](position + (i << offset), value[i], littleEndian);
    }
  }

  /**
   * @param {string} field
   * @param {*} value
   * @param {*} [schema]
   * @param {number} [offset=0]
   * @returns {ExtendedDataView}
   */
  setValue(field, value, schema = this.constructor.schema, offset = 0) {
    const {
      type, littleEndian, start, ctor, length, size, stringLength,
    } = schema[field];
    const position = offset + start;
    switch (type) {
      case 'int8':
        this.setInt8(position, value);
        break;
      case 'uint8':
        this.setUint8(position, value);
        break;
      case 'int16':
        this.setInt16(position, value, littleEndian);
        break;
      case 'uint16':
        this.setUint16(position, value, littleEndian);
        break;
      case 'int32':
        this.setInt32(position, value, littleEndian);
        break;
      case 'uint32':
        this.setUint32(position, value, littleEndian);
        break;
      case 'float32':
        this.setFloat32(position, value, littleEndian);
        break;
      case 'float64':
        this.setFloat64(position, value, littleEndian);
        break;
      case 'bigint64':
        this.setBigInt64(position, value, littleEndian);
        break;
      case 'biguint64':
        this.setBigUint64(position, value, littleEndian);
        break;
      case 'string':
        this.setString(position, value, length);
        break;
      case 'typedarray':
        this.setTypedArray(position, value, ctor, size);
        break;
      case 'array':
        this.setArray(position, value, ctor, size);
        break;
      case 'stringarray':
        this.setStringArray(position, value, size, length, stringLength);
        break;
      default:
        this.setObject(position, value, ctor);
        break;
    }
    return this;
  }
}

module.exports = ExtendedDataView;
