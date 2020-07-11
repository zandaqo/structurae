const { BinaryProtocol, ObjectViewMixin, ObjectView } = require('../index');

const aSchema = {
  age: { type: 'number', btype: 'int8' },
  name: { type: 'string', maxLength: 10 },
};

const bSchema = {
  id: { type: 'number', btype: 'uint32' },
  items: {
    type: 'array',
    items: { type: 'string', maxLength: 10 },
    maxItems: 3,
  },
};

describe('BinaryProtocol', () => {
  describe('constructor', () => {
    it('creates a protocol instance from given schemas', () => {
      const protocol = new BinaryProtocol({
        0: {
          $id: 'protocolA',
          type: 'object',
          properties: { ...aSchema },
        },
        1: {
          $id: 'protocolB',
          type: 'object',
          properties: { ...bSchema },
        },
      });
      expect(protocol instanceof BinaryProtocol).toBe(true);
      expect(protocol.Views[0].viewLength).toBe(12);
      expect(protocol.Views[1].viewLength).toBe(35);
    });

    it('creates a protocol using an existing View class', () => {
      const View = ObjectViewMixin({
        $id: 'protocolD',
        type: 'object',
        properties: {
          tag: { type: 'number', btype: 'uint8', default: 1 },
          ...bSchema,
        },
      });
      const protocol = new BinaryProtocol({
        0: {
          $id: 'protocolC',
          type: 'object',
          properties: { ...aSchema },
        },
        1: 'protocolD',
      });
      expect(protocol.Views[0].viewLength).toBe(12);
      expect(protocol.Views[1]).toBe(View);
    });

    it('creates a protocol with custom tag field', () => {
      const View = ObjectViewMixin({
        $id: 'protocolF',
        type: 'object',
        properties: {
          typeId: { type: 'number', btype: 'uint32', default: 1 },
          ...bSchema,
        },
      });
      const protocol = new BinaryProtocol(
        {
          0: {
            $id: 'protocolE',
            type: 'object',
            properties: { ...aSchema },
          },
          1: 'protocolF',
        },
        'typeId',
        'uint32',
      );
      expect(protocol.Views[0].viewLength).toBe(15);
      expect(protocol.Views[1]).toBe(View);
    });

    it('throws if invalid View class is provided', () => {
      ObjectViewMixin({
        $id: 'protocolH',
        type: 'object',
        properties: { ...bSchema },
      });
      expect(
        () =>
          new BinaryProtocol({
            0: {
              $id: 'protocolG',
              type: 'object',
              properties: { ...aSchema },
            },
            1: 'protocolH',
          }),
      ).toThrow('The tag definition in the View is incorrect.');
    });

    it('throws if non-existent View class is referenced', () => {
      expect(
        () =>
          new BinaryProtocol({
            0: {
              $id: 'protocolI',
              type: 'object',
              properties: { ...aSchema },
            },
            1: 'protocolJ',
          }),
      ).toThrow('View "protocolJ" is not found.');
    });
  });

  describe('view', () => {
    const protocol = new BinaryProtocol({
      0: {
        $id: 'protocolA',
        type: 'object',
        properties: { ...aSchema },
      },
      1: {
        $id: 'protocolB',
        type: 'object',
        properties: { ...bSchema },
      },
    });
    it('returns an appropriate View for a given ArrayBuffer', () => {
      const View = ObjectView.Views.protocolB;
      const data = { id: 10, items: ['a', 'b', 'c'] };
      const view = View.from(data);
      expect(protocol.view(view.buffer).toJSON()).toEqual({ tag: 1, ...data });
    });

    it('throws if the tag is not found in the protocol', () => {
      const View = ObjectView.Views.protocolA;
      const view = View.from({ tag: 2 });
      expect(() => protocol.view(view.buffer)).toThrow('No tag information is found.');
    });
  });

  describe('encode', () => {
    const protocol = new BinaryProtocol({
      0: {
        $id: 'protocolA',
        type: 'object',
        properties: { ...aSchema },
      },
      1: {
        $id: 'protocolB',
        type: 'object',
        properties: { ...bSchema },
      },
    });

    it('encodes a given object into a View according to the tag information', () => {
      const a = { tag: 1, id: 1, items: ['a', 'b', 'c'] };
      const b = { tag: 0, age: 100, name: 'abc' };
      expect(protocol.encode(a).toJSON()).toEqual({ tag: 1, ...a });
      expect(protocol.encode(b).toJSON()).toEqual({ tag: 0, ...b });
    });

    it('throws if incorrect tag information is provided', () => {
      const a = { tag: 2, id: 1, items: ['a', 'b', 'c'] };
      expect(() => protocol.encode(a)).toThrow('No tag information is found.');
    });
  });

  describe('decode', () => {
    it('decodes a given ArrayBuffer into an object according to the tag information', () => {
      const protocol = new BinaryProtocol({
        0: {
          $id: 'protocolA',
          type: 'object',
          properties: { ...aSchema },
        },
        1: {
          $id: 'protocolB',
          type: 'object',
          properties: { ...bSchema },
        },
      });
      const View = ObjectView.Views.protocolB;
      const data = { id: 10, items: ['a', 'b', 'c'] };
      const view = View.from(data);
      expect(protocol.decode(view.buffer)).toEqual({ tag: 1, ...data });
    });
  });
});
