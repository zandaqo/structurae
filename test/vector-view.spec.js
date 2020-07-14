const { VectorView, ObjectView, MapViewMixin, VectorViewMixin, StringView } = require('../index');

const Plane = MapViewMixin({
  $id: 'plane',
  type: 'object',
  properties: {
    id: { type: 'integer' },
    name: { type: 'string' },
  },
});

const PlanesView = VectorViewMixin(Plane);

describe('VectorViewMixin', () => {
  it('creates a vector class for a given class', () => {
    const Planes = VectorViewMixin(Plane);
    expect(Planes.prototype instanceof VectorView).toBe(true);
    expect(Planes.View).toBe(Plane);
  });

  it('initializes a view class if not initialized', () => {
    class Unintialized extends ObjectView {}
    Unintialized.schema = {
      $id: 'uninitialized',
      type: 'object',
      properties: {
        id: { type: 'integer' },
      },
    };
    expect(Unintialized.layout).toBeUndefined();
    VectorViewMixin(Unintialized);
    expect(Unintialized.layout).toBeDefined();
  });

  it('caches vector view classes', () => {
    expect(VectorViewMixin(Plane)).toBe(VectorViewMixin(Plane));
  });
});

describe('VectorView', () => {
  describe('get', () => {
    it('returns a value at a given index', () => {
      const expected = [{ id: 1, name: 'a' }];
      const planes = PlanesView.from(expected);
      expect(planes.get(0)).toEqual(expected[0]);
    });

    it('returns undefined for absent index', () => {
      const expected = [{ id: 1, name: 'a' }, undefined, { id: 2 }];
      const planes = PlanesView.from(expected);
      expect(planes.get(3)).toBe(undefined);
      expect(planes.get(1)).toBe(undefined);
    });
  });

  describe('getView', () => {
    it('returns a view at a given index', () => {
      const planes = PlanesView.from([{ id: 1, name: 'a' }]);
      const actual = planes.getView(0);
      expect(actual instanceof Plane).toBe(true);
      expect(actual.byteOffset).toBe(12);
      expect(actual.byteLength).toBe(17);
    });

    it('returns undefined for absent index', () => {
      const planes = PlanesView.from([{ id: 1, name: 'a' }]);
      expect(planes.getView(1)).toBe(undefined);
    });
  });

  describe('set', () => {
    it('sets a value at a given index', () => {
      const planes = PlanesView.from([{ id: 1, name: 'a' }]);
      const expected = { id: 3, name: 'b' };
      expect(planes.set(0, expected).get(0)).toEqual(expected);
    });

    it('returns undefined for absent index', () => {
      const planes = PlanesView.from([{ id: 1, name: 'a' }]);
      expect(planes.set(1, 2)).toBe(undefined);
    });
  });

  describe('setView', () => {
    it('sets a view at a given index', () => {
      const expected = { id: 4, name: 'abc' };
      const vector = PlanesView.from([{ id: 3, name: 'def' }]);
      vector.setView(0, Plane.from(expected));
      expect(vector.get(0)).toEqual(expected);
    });
    it('returns undefined for absent index', () => {
      const planes = PlanesView.from([{ id: 1, name: 'a' }]);
      expect(planes.setView(1, {})).toBe(undefined);
    });
  });

  describe('size', () => {
    it('returns the amount of values in the vector', () => {
      const array = PlanesView.from([{}, {}]);
      expect(array.size).toBe(2);
    });
  });

  describe('toJSON', () => {
    it('returns an array of values in the vector', () => {
      const expected = [
        { id: 1, name: 'a' },
        { id: 2, name: 'b' },
        { id: 3, name: 'c' },
      ];
      const planes = PlanesView.from(expected);
      expect(planes.toJSON()).toEqual(expected);
    });
  });

  describe('from', () => {
    it('creates a vector view from a given value', () => {
      const expected = [
        { id: 0, name: '1' },
        { id: 0, name: '2' },
        { id: 0, name: '3' },
      ];
      const planes = PlanesView.from(expected);
      expect(planes.toJSON()).toEqual(expected);
    });

    it('fills an extant view', () => {
      const expected = [
        { id: 1, name: 'a' },
        { id: 2, name: 'b' },
        { id: 3, name: 'c' },
      ];
      const extant = new DataView(new ArrayBuffer(PlanesView.getLength(expected)));
      PlanesView.from(expected, extant);
      expect(PlanesView.toJSON(extant)).toEqual(expected);
    });

    it('supports fixed sized views', () => {
      class SomeObject extends ObjectView {}
      SomeObject.schema = { $id: 'ObjectVector', properties: { a: { type: 'integer' } } };
      const ObjectVector = VectorViewMixin(SomeObject);
      const expected = [{ a: 1 }];
      expect(ObjectVector.from(expected).toJSON()).toEqual(expected);
    });

    it('treats empty strings as undefined', () => {
      const StringVector = VectorViewMixin(StringView);
      const expected = ['cd', '', 'efghi'];
      expect(StringVector.from(expected).toJSON()).toEqual(['cd', undefined, 'efghi']);
    });

    it('supports nested vectors', () => {
      const Nested = VectorViewMixin(VectorViewMixin(Plane));
      const expected = [[{ id: 1, name: 'a' }, { id: 2 }], [{ id: 3, name: 'c' }]];
      expect(Nested.from(expected).toJSON()).toEqual(expected);
    });
  });

  describe('getLength', () => {
    it('returns the byte length required to hold the vector', () => {
      expect(PlanesView.getLength([])).toBe(8);
      expect(PlanesView.getLength([{}])).toBe(24);
      expect(PlanesView.getLength([{}, {}])).toBe(40);
    });
  });

  describe('iterator', () => {
    it('iterates over elements of the vector', () => {
      const people = PlanesView.from([{}, {}]);
      const array = [...people];
      expect(array[0] instanceof Plane).toBe(true);
      expect(array.length).toBe(2);
    });
  });
});
