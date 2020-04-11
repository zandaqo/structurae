const { ObjectView, ObjectViewMixin } = require('./object-view');
const { typeGetters } = require('./utilities');

/**
 * A helper class that simplifies defining and operating on multiple tagged ObjectViews.
 * The protocol instance tags each of its views with a numerical value
 * (by default Uint8) as the first field
 * and uses it to convert data from objects to views and back.
 * @example
 * const protocol = new BinaryProtocol({
 *   0: {
 *     age: { type: 'int8' },
 *     name: { type: 'string', length: 10 },
 *   },
 *   1: {
 *     id: { type: 'uint32' },
 *     items: { type: 'string', size: 3, length: 10 },
 *   },
 * });
 * const person = protocol.encode({ tag: 0, age: 100, name: 'abc' });
 * //=> ObjectView (12)
 * protocol.decode(person.buffer)
 * //=> { tag: 0, age: 100, name: 'abc' }
 * const item = protocol.encode({ tag: 1, id: 10, items: ['a', 'b', 'c'] });
 * //=> ObjectView (35)
 * protocol.decode(item.buffer)
 * //=> { tag: 1, id: 10, items: ['a', 'b', 'c'] }
 */
class BinaryProtocol {
  /**
   * @param {Object<number, object|string>} views a hash of tag values
   *                                            and corresponding views or schemas
   * @param {string} [tagName=tag] a custom name for the tag field
   * @param {string} [tagType=uint8] a custom type for the tag field
   */
  constructor(views, tagName = 'tag', tagType = 'uint8') {
    const tags = Object.keys(views);
    this.Views = {};
    for (let i = 0; i < tags.length; i++) {
      const tag = +tags[i];
      const schema = views[tag];
      if (typeof schema === 'string') {
        const View = ObjectView.Views[schema];
        if (!View) throw TypeError(`View "${schema}" is not found.`);
        const defaultTag = View.layout[tagName];
        if (!defaultTag || defaultTag.default !== tag) {
          throw TypeError('The tag definition in the View is incorrect.');
        }
        this.Views[tag] = View;
        continue;
      }
      schema.properties = {
        [tagName]: { type: 'number', btype: tagType, default: tag },
        ...schema.properties,
      };
      this.Views[tag] = ObjectViewMixin(schema);
    }

    /**
     * @private
     * @type {string}
     */
    this.tagName = tagName;

    /**
     * @private
     * @type {string}
     */
    this.tagGetter = typeGetters[tagType];
  }

  /**
   * Creates a View instance corresponding from a given ArrayBuffer
   * according to its tag field information.
   *
   * @param {ArrayBuffer} buffer
   * @param {number} [offset=0]
   * @returns {ObjectView}
   */
  view(buffer, offset = 0) {
    const data = new DataView(buffer, offset);
    const tag = this.tagGetter.call(data, 0);
    const View = this.Views[tag];
    if (!View) throw TypeError('No tag information is found.');
    return new View(buffer, offset, View.objectLength);
  }

  /**
   * Encodes a given object into a View according to the tag information.
   *
   * @param {Object} object
   * @param {ArrayBuffer} [arrayBuffer]
   * @param {number} [offset=0]
   * @returns {ObjectView}
   */
  encode(object, arrayBuffer, offset = 0) {
    const View = this.Views[object[this.tagName]];
    if (!View) throw TypeError('No tag information is found.');
    const buffer = arrayBuffer || new ArrayBuffer(View.objectLength);
    const view = new View(buffer, offset, View.objectLength);
    View.from(object, view);
    return view;
  }

  /**
   * Decodes a given ArrayBuffer into an object according to the tag information.
   * @param {ArrayBuffer} buffer
   * @param {number} [offset=0]
   * @returns {Object}
   */
  decode(buffer, offset = 0) {
    const view = this.view(buffer, offset);
    return view.toJSON();
  }
}

module.exports = BinaryProtocol;
