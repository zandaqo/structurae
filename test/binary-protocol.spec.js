const { ObjectViewMixin } = require('../lib/object-view');
const BinaryProtocol = require('../lib/binary-protocol');

describe('BinaryProtocol', () => {
  describe('constructor', () => {
    it('creates a protocol instance from given schemas', () => {
      const protocol = new BinaryProtocol({
        0: {
          age: { type: 'int8' },
          name: { type: 'string', length: 10 },
        },
        1: {
          id: { type: 'uint32' },
          items: { type: 'string', size: 3, length: 10 },
        },
      });
      expect(protocol instanceof BinaryProtocol).toBe(true);
      expect(protocol.Views[0].objectLength).toBe(12);
      expect(protocol.Views[1].objectLength).toBe(35);
    });

    it('creates a protocol using an existing View class', () => {
      const View = ObjectViewMixin({
        tag: { type: 'uint8', default: 1 },
        id: { type: 'uint32' },
        items: { type: 'string', size: 3, length: 10 },
      });
      const protocol = new BinaryProtocol({
        0: {
          age: { type: 'int8' },
          name: { type: 'string', length: 10 },
        },
        1: View,
      });
      expect(protocol.Views[0].objectLength).toBe(12);
      expect(protocol.Views[1].objectLength).toBe(35);
    });

    it('creates a protocol with custom tag field', () => {
      const View = ObjectViewMixin({
        typeId: { type: 'uint32', default: 1 },
        id: { type: 'uint32' },
        items: { type: 'string', size: 3, length: 10 },
      });
      const protocol = new BinaryProtocol({
        0: {
          age: { type: 'int8' },
          name: { type: 'string', length: 10 },
        },
        1: View,
      }, 'typeId', 'uint32');
      expect(protocol.Views[0].objectLength).toBe(15);
      expect(protocol.Views[1].objectLength).toBe(38);
    });

    it('throws if invalid View class is provided', () => {
      const View = ObjectViewMixin({
        id: { type: 'uint32' },
        items: { type: 'string', size: 3, length: 10 },
      });
      expect(() => new BinaryProtocol({
        0: {
          age: { type: 'int8' },
          name: { type: 'string', length: 10 },
        },
        1: View,
      })).toThrow('The tag definition in the View is incorrect.');
    });
  });

  describe('view', () => {
    it('returns an appropriate View for a given ArrayBuffer', () => {
      const View = ObjectViewMixin({
        tag: { type: 'uint8', default: 1 },
        id: { type: 'uint32' },
        items: { type: 'string', size: 3, length: 10 },
      });
      const protocol = new BinaryProtocol({
        0: {
          age: { type: 'int8' },
          name: { type: 'string', length: 10 },
        },
        1: View,
      });
      const data = { id: 10, items: ['a', 'b', 'c'] };
      const view = View.from(data);
      expect(protocol.view(view.buffer).toJSON()).toEqual({ tag: 1, ...data });
    });

    it('throws if the tag is not found in the protocol', () => {
      const View = ObjectViewMixin({
        tag: { type: 'uint8', default: 1 },
        age: { type: 'int8' },
        name: { type: 'string', length: 10 },
      });
      const protocol = new BinaryProtocol({
        0: {
          age: { type: 'int8' },
          name: { type: 'string', length: 10 },
        },
      });
      const view = View.from({});
      expect(() => protocol.view(view.buffer)).toThrow('No tag information is found.');
    });
  });

  describe('encode', () => {
    it('encodes a given object into a View according to the tag information', () => {
      const View = ObjectViewMixin({
        tag: { type: 'uint8', default: 1 },
        id: { type: 'uint32' },
        items: { type: 'string', size: 3, length: 10 },
      });
      const protocol = new BinaryProtocol({
        0: {
          age: { type: 'int8' },
          name: { type: 'string', length: 10 },
        },
        1: View,
      });

      const a = { tag: 1, id: 1, items: ['a', 'b', 'c'] };
      const b = { tag: 0, age: 100, name: 'abc' };
      expect(protocol.encode(a).toJSON()).toEqual({ tag: 1, ...a });
      expect(protocol.encode(b).toJSON()).toEqual({ tag: 0, ...b });
    });

    it('throws if incorrect tag information is provided', () => {
      const protocol = new BinaryProtocol({
        0: {
          age: { type: 'int8' },
          name: { type: 'string', length: 10 },
        },
      });

      const a = { tag: 1, id: 1, items: ['a', 'b', 'c'] };
      expect(() => protocol.encode(a)).toThrow('No tag information is found.');
    });
  });

  describe('decode', () => {
    it('decodes a given ArrayBuffer into an object according to the tag information', () => {
      const View = ObjectViewMixin({
        tag: { type: 'uint8', default: 1 },
        id: { type: 'uint32' },
        items: { type: 'string', size: 3, length: 10 },
      });
      const protocol = new BinaryProtocol({
        1: View,
      });
      const data = { id: 10, items: ['a', 'b', 'c'] };
      const view = View.from(data);
      expect(protocol.decode(view.buffer)).toEqual({ tag: 1, ...data });
    });
  });
});
