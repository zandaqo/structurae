const StringView = require('./string-view');

/** @extends DataView */
class ExtendedDataView extends DataView {
  /**
   * @protected
   * @param {number} position
   * @param {ObjectViewField} field
   * @returns {Array<Object>}
   */
  getArray(position, field) {
    const { view, size } = field;
    const { objectLength } = view;
    const result = new Array(size);
    for (let i = 0; i < size; i++) {
      result[i] = this.getObject(position + (i * objectLength), { view });
    }
    return result;
  }

  /**
   * @protected
   * @param {number} position
   * @param {ObjectViewField} field
   * @returns {Array<string>}
   */
  getStringArray(position, field) {
    const { size, itemLength } = field;
    const array = new Array(size);
    for (let i = 0; i < size; i++) {
      const string = new StringView(
        this.buffer, this.byteOffset + position + (i * itemLength), itemLength,
      );
      array[i] = string.toString();
    }
    return array;
  }

  /**
   * @protected
   * @param {number} position
   * @param {ObjectViewField} field
   * @returns {Array<number>}
   */
  getTypedArray(position, field) {
    const { view, size } = field;
    const { typeGetter, offset, littleEndian } = view;
    const result = new Array(size);
    for (let i = 0; i < size; i++) {
      result[i] = this[typeGetter](position + (i << offset), littleEndian);
    }
    return result;
  }

  /**
   * @protected
   * @param {number} position
   * @param {ObjectViewField} field
   * @returns {Object}
   */
  getObject(position, field) {
    const { schema } = field.view;
    const fields = Object.keys(schema);
    const result = {};
    for (let i = 0; i < fields.length; i++) {
      const name = fields[i];
      const currentField = schema[name];
      const { start, getter, kind } = currentField;
      const offset = position + start;
      const arg = kind === 'number' ? currentField.littleEndian : currentField;
      result[name] = this[getter](offset, arg);
    }
    return result;
  }

  /**
   * @protected
   * @param {number} position
   * @param {ObjectViewField} field
   * @returns {string}
   */
  getString(position, field) {
    return new StringView(this.buffer, this.byteOffset + position, field.length).toString();
  }

  /**
   * @protected
   * @param {number} position
   * @param {ArrayLike<object>} value
   * @param {ObjectViewField} field
   * @returns {void}
   */
  setArray(position, value, field) {
    const { view, size } = field;
    const { fields, schema } = view;
    const max = (size < value.length ? size : value.length);
    for (let i = 0; i < max; i++) {
      for (let j = 0; j < fields.length; j++) {
        const name = fields[j];
        this.setValue(name, value[i][name], schema, position + (i * view.objectLength));
      }
    }
  }

  /**
   * @protected
   * @param {number} position
   * @param {Object} value
   * @param {ObjectViewField} field
   * @returns {void}
   */
  setObject(position, value, field) {
    const { fields, schema } = field.view;
    for (let i = 0; i < fields.length; i++) {
      const name = fields[i];
      if (Reflect.has(value, name)) this.setValue(name, value[name], schema, position);
    }
  }

  /**
   * @protected
   * @param {number} position
   * @param {string} value
   * @param {ObjectViewField} field
   * @returns {void}
   */
  setString(position, value, field) {
    new Uint8Array(this.buffer, this.byteOffset + position, field.length)
      .fill(0)
      .set(StringView.fromString(value));
  }

  /**
   * @protected
   * @param {number} position
   * @param {string} value
   * @param {ObjectViewField} field
   * @returns {void}
   */
  setStringArray(position, value, field) {
    const { length, size, itemLength } = field;
    const array = new Uint8Array(this.buffer, this.byteOffset + position, length);
    array.fill(0);
    const max = (size < value.length ? size : value.length);
    for (let i = 0; i < max; i++) {
      const string = StringView.fromString(value[i], itemLength);
      array.set(string, i * itemLength);
    }
  }

  /**
   * @protected
   * @param {number} position
   * @param {ArrayLike<number>} value
   * @param {ObjectViewField} field
   * @returns {void}
   */
  setTypedArray(position, value, field) {
    const { view, size } = field;
    const { typeSetter, offset, littleEndian } = view;
    const max = (size < value.length ? size : value.length);
    for (let i = 0; i < max; i++) {
      this[typeSetter](position + (i << offset), value[i], littleEndian);
    }
  }

  /**
   * @protected
   * @param {string} name
   * @param {*} value
   * @param {*} [schema]
   * @param {number} [offset=0]
   * @returns {ExtendedDataView}
   */
  setValue(name, value, schema = this.constructor.schema, offset = 0) {
    const field = schema[name];
    const {
      kind, start, setter, littleEndian,
    } = field;
    const position = offset + start;
    const arg = kind === 'number' ? littleEndian : field;
    this[setter](position, value, arg);
    return this;
  }
}

module.exports = ExtendedDataView;
