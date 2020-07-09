const { ArrayViewMixin, TypeViewMixin, MapViewMixin, MapView, ObjectView } = require('../index');

const Int32ArrayView = ArrayViewMixin('int32');
const Float64View = TypeViewMixin('float64');

const nestedSchema = {
  $id: 'WithNestedMap',
  type: 'object',
  properties: {
    a: {
      $id: 'NestedMap',
      type: 'object',
      btype: 'map',
      properties: {
        b: { type: 'number' },
        z: {
          $id: 'DeeplyNestedMap',
          btype: 'map',
          type: 'object',
          properties: {
            x: { type: 'number' },
          },
        },
      },
      required: ['b'],
    },
    b: { type: 'number' },
  },
  required: ['b'],
};

const MapA = MapViewMixin({
  $id: 'MapViewA',
  type: 'object',
  properties: {
    a: { type: 'number' },
    b: {
      type: 'array',
      items: { type: 'integer' },
    },
    c: {
      type: 'array',
      items: {
        $id: 'MapAObject',
        type: 'object',
        properties: {
          id: { type: 'integer' },
          name: { type: 'string', maxLength: 10 },
        },
      },
    },
    d: { type: 'string' },
    e: {
      type: 'array',
      items: {
        type: 'array',
        maxItems: 2,
        items: { type: 'number' },
      },
    },
  },
});

describe('MapViewMixin', () => {
  const PersonSchema = {
    $id: 'PersonMap',
    type: 'object',
    properties: {
      a: { type: 'number' },
      b: { type: 'string' },
      c: { type: 'number' },
      d: { type: 'string' },
    },
    required: ['a', 'c'],
  };

  it('creates a MapView class from a given JSON Schema', () => {
    const Person = MapViewMixin(PersonSchema);
    expect(Person.prototype instanceof MapView).toBe(true);
  });

  it('returns cached class if the same schema is reused', () => {
    MapViewMixin(PersonSchema);
    const Person = MapView.Views.PersonMap;
    expect(MapViewMixin(PersonSchema)).toBe(Person);
  });

  it('uses custom ObjectView class to initialize nested objects', () => {
    class CustomObjectView extends ObjectView {}
    const Person = MapViewMixin(
      {
        $id: 'CustomMap',
        type: 'object',
        properties: {
          a: {
            $id: 'CustomNestedObject',
            type: 'object',
            properties: {
              b: { type: 'number' },
            },
          },
        },
      },
      undefined,
      CustomObjectView,
    );
    expect(Person.layout.a.View.prototype instanceof CustomObjectView).toBe(true);
  });

  it('supports nested maps', () => {
    const Person = MapViewMixin(nestedSchema);
    expect(Person.layout.a.View.prototype instanceof MapView).toBe(true);
    expect(Person.layout.a.View.layout.z.View.prototype instanceof MapView).toBe(true);
  });

  it('throws a TypeError if a required field has undefined length', () => {
    expect(() => {
      MapViewMixin({
        $id: 'InvalidMap',
        properties: { a: { type: 'string' } },
        required: ['a'],
      });
    }).toThrow('The length of a required field is undefined.');
  });
});

describe('MapView', () => {
  describe('get', () => {
    it('returns the JavaScript value at a given field', () => {
      const map = MapA.from({ a: 42, d: 'abc' });
      expect(map.get('a')).toBe(42);
      expect(map.get('d')).toBe('abc');
    });

    it('returns undefined if the value is not set', () => {
      const map = MapA.from({ b: [1] });
      expect(map.get('a')).toBe(undefined);
      expect(map.get('b')).toEqual([1]);
    });

    it('returns undefined if the field is not found', () => {
      const map = MapA.from({ b: [1] });
      expect(map.get('z')).toBe(undefined);
    });
  });

  describe('getView', () => {
    it('returns a view of a given field', () => {
      const map = MapA.from({ a: 42 });
      expect(map.getView('a') instanceof Float64View).toBe(true);
    });

    it('returns undefined if the field is not set', () => {
      const map = MapA.from({ b: [1] });
      expect(map.getView('a')).toBe(undefined);
      expect(map.getView('b') instanceof Int32ArrayView).toBe(true);
    });

    it('returns undefined if the field is not found', () => {
      const map = MapA.from({ b: [1] });
      expect(map.getView('z')).toBe(undefined);
    });
  });

  describe('set', () => {
    it('sets a JavaScript value of a field', () => {
      const map = MapA.from({ a: 5 });
      map.set('a', 42);
      expect(map.get('a')).toBe(42);
    });

    it('does not set a value for a missing field', () => {
      const map = MapA.from({ b: [1] });
      map.set('a', 10);
      expect(map.get('a')).toBe(undefined);
    });

    it('does not set a value for an undefined field', () => {
      const map = MapA.from({ b: [1] });
      expect(map.set('z', 10)).toBe(undefined);
    });
  });

  describe('setView', () => {
    it('copies a given view into a field', () => {
      const map = MapA.from({ a: 1 });
      const number = Float64View.from(42);
      map.setView('a', number);
      expect(map.get('a')).toBe(42);
    });

    it('does not set view if the field is not found', () => {
      const map = MapA.from({ a: 1 });
      expect(map.setView('z', new Uint8Array(10))).toBe(undefined);
    });
  });

  describe('toJSON', () => {
    it('returns an an object corresponding to the view', () => {
      const expected = {
        a: 42,
        b: [20, 30, 10],
        c: [
          { id: 10, name: 'abc' },
          { id: 5, name: 'def' },
        ],
      };
      const map = MapA.from(expected);
      expect(map.toJSON()).toEqual(expected);
    });

    it('handles map views within larger buffers', () => {
      const expected = {
        a: 42,
        b: [20, 30, 10],
        c: [
          { id: 10, name: 'abc' },
          { id: 5, name: 'def' },
        ],
      };
      const buffer = new ArrayBuffer(1000);
      const temp = MapA.from(expected);
      const view = new DataView(buffer);
      new Uint8Array(view.buffer, view.byteOffset, view.byteLength).set(
        new Uint8Array(temp.buffer, temp.byteOffset, temp.byteLength),
        100,
      );
      expect(MapA.toJSON(view, 100)).toEqual(expected);
    });
  });

  describe('getLength', () => {
    it('returns the byte length of a map view to hold a given object', () => {
      expect(MapA.getLength({ a: 42, b: [1], c: [1, 2] })).toBe(1 * 8 + 1 * 4 + 2 * 14 + 6 * 4);
      expect(MapA.getLength({ b: [1] })).toBe(0 * 8 + 1 * 4 + 6 * 4);
      expect(MapA.getLength({ d: 'abc' })).toBe(0 * 0 + 1 * 3 + 6 * 4);
      expect(MapA.getLength({ b: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1] })).toBe(0 * 0 + 10 * 4 + 6 * 4);
      expect(MapViewMixin(nestedSchema).getLength({ b: 10, a: { z: {}, b: 10 } })).toBe(40);
    });
  });

  describe('from', () => {
    it('creates a map view from a given object', () => {
      const expected = {
        a: 42,
        b: [20, 30, 10],
        c: [
          { id: 10, name: 'abc' },
          { id: 5, name: 'def' },
        ],
        d: 'abc',
        e: [
          [3, 4],
          [5, 7],
          [6, 8],
        ],
      };
      const map = MapA.from(expected);
      expect(map.toJSON()).toEqual(expected);
    });

    it('treats undefined and null fields as missing', () => {
      const object = {
        a: undefined,
        b: null,
        c: [
          { id: 10, name: 'abc' },
          { id: 5, name: 'def' },
        ],
        d: 'abc',
        e: [
          [3, 4],
          [5, 7],
          [6, 8],
        ],
      };
      const { a, b, ...expected } = object;
      const map = MapA.from(object);
      expect(map.toJSON()).toEqual(expected);
    });

    it('truncates strings and arrays longer than set max sizes', () => {
      const MaxMap = MapViewMixin({
        $id: 'MaxMap',
        type: 'object',
        properties: {
          a: { type: 'number' },
          b: { type: 'string', maxLength: 2 },
          c: { type: 'array', items: { type: 'integer' }, maxItems: 3 },
        },
      });
      const object = {
        b: 'abcd',
        c: [6, 7, 8, 9, 10],
      };
      const map = MaxMap.from(object);
      expect(map.toJSON()).toEqual({
        b: 'ab',
        c: [6, 7, 8],
      });
    });

    it('supports required fields', () => {
      const RequiredMap = MapViewMixin({
        $id: 'RequiredMap',
        type: 'object',
        properties: {
          a: { type: 'number' },
          b: { type: 'string', maxLength: 2 },
          c: { type: 'array', items: { type: 'integer' }, maxItems: 3 },
        },
        required: ['a', 'b', 'c'],
      });
      const object = {
        b: 'abcd',
        c: [6, 7, 8, 9, 10],
      };
      const map = RequiredMap.from(object);
      expect(map.toJSON()).toEqual({
        a: 0,
        b: 'ab',
        c: [6, 7, 8],
      });
    });

    it('sets default values for required fields', () => {
      const DefaultMap = MapViewMixin({
        $id: 'DefaultMap',
        type: 'object',
        properties: {
          a: { type: 'number', default: 10 },
          b: { type: 'string', maxLength: 2 },
          c: { type: 'array', items: { type: 'integer' }, maxItems: 3 },
          d: {
            $id: 'RequiredObjectMap',
            type: 'object',
            properties: { a: { type: 'number', default: 10 } },
          },
        },
        required: ['a', 'd'],
      });
      const object = {
        b: 'abcd',
        c: [6, 7, 8, 9, 10],
      };
      const map = DefaultMap.from(object);
      expect(map.toJSON()).toEqual({
        a: 10,
        b: 'ab',
        c: [6, 7, 8],
        d: { a: 10 },
      });
    });

    it('writes a map view within a larger view', () => {
      const expected = {
        a: 42,
        b: [20, 30, 10],
        c: [
          { id: 10, name: 'abc' },
          { id: 5, name: 'def' },
        ],
      };
      const buffer = new ArrayBuffer(1000);
      const view = new DataView(buffer);
      MapA.from(expected, view, 100);
      const map = new MapA(view.buffer, view.byteOffset + 100);
      expect(map.toJSON()).toEqual(expected);
      expect(map.get('a')).toEqual(42);
    });

    it('supports nested maps', () => {
      const Nested = MapViewMixin(nestedSchema);
      const data = { a: { b: 10, z: {} }, b: 10 };
      expect(Nested.from(data).toJSON()).toEqual(data);
    });
  });
});
