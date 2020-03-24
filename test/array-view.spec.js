const {
  ObjectView, ObjectViewMixin, ArrayViewMixin, ArrayView,
} = require('../index');

const Plane = ObjectViewMixin({
  $id: 'plane',
  type: 'object',
  properties: {
    id: { type: 'integer' },
    name: { type: 'string', maxLength: 10 },
  },
});

describe('ArrayViewMixin', () => {
  it('creates an array class for a given object class', () => {
    const Planes = ArrayViewMixin(Plane);
    expect(Planes.getLength(10)).toBe(140);
  });

  it('initializes object view if not initialized', () => {
    class Unintialized extends ObjectView {}
    Unintialized.schema = {
      $id: 'uninitialized',
      type: 'object',
      properties: {
        id: { type: 'integer' },
      },
    };
    expect(Unintialized.layout).toBeUndefined();
    ArrayViewMixin(Unintialized);
    expect(Unintialized.layout).toBeDefined();
  });

  it('creates a TypedArrayView', () => {
    const Int8ArrayView = ArrayViewMixin('int32');
    expect(Int8ArrayView.prototype instanceof ArrayView).toBe(true);
    expect(Int8ArrayView.View.offset).toBe(2);
    expect(Int8ArrayView.View.littleEndian).toBe(true);
  });
});

describe('ArrayView', () => {
  const Planes = ArrayViewMixin(Plane);

  describe('get', () => {
    it('returns an object at a given index', () => {
      const expected = [{ id: 1, name: 'a' }];
      const planes = Planes.from(expected);
      expect(planes.get(0)).toEqual(expected[0]);
    });
  });

  describe('getView', () => {
    it('returns an object view at a given index', () => {
      const expected = Planes.of(10);
      const actual = expected.getView(2);
      expect(actual instanceof Plane).toBe(true);
      expect(actual.byteOffset).toBe(28);
      expect(actual.byteLength).toBe(14);
      expect(actual.buffer).toBe(expected.buffer);
    });
  });

  describe('set', () => {
    it('sets an object at a given index', () => {
      const planes = Planes.of(2);
      const expected = { id: 3, name: 'abc' };
      expect(planes.set(0, expected).get(0)).toEqual(expected);
    });
  });

  describe('setView', () => {
    it('sets an object view at a given index', () => {
      const array = Planes.of(5);
      const object = { id: 4, name: 'abc' };
      const objectView = Plane.from(object);
      array.setView(3, objectView);
      expect(array.get(3)).toEqual(object);
    });
  });

  describe('size', () => {
    it('returns the amount of objects in the array', () => {
      const array = Planes.of(5);
      expect(array.byteLength).toBe(70);
      expect(array.size).toBe(5);
    });
  });

  describe('toJSON', () => {
    it('returns an array of objects in the array', () => {
      const expected = [{ id: 1, name: 'a' }, { id: 2, name: 'b' }, { id: 3, name: 'c' }];
      const planes = Planes.from(expected);
      expect(planes.toJSON()).toEqual(expected);
    });
  });

  describe('of', () => {
    it('creates an empty ArrayView of specified size', () => {
      const planes = Planes.of(10);
      expect(planes instanceof Planes).toBe(true);
      expect(planes.size).toBe(10);
    });

    it('creates an empty view of size 1 if no size is provided', () => {
      const planes = Planes.of();
      expect(planes instanceof Planes).toBe(true);
      expect(planes.size).toBe(1);
    });
  });

  describe('from', () => {
    it('creates an empty array view', () => {
      const expected = [{ id: 0, name: '' }, { id: 0, name: '' }, { id: 0, name: '' }];
      const planes = Planes.from(expected);
      expect(planes.toJSON()).toEqual(expected);
    });

    it('fills a given array view with objects', () => {
      const expected = [{ id: 1, name: 'a' }, { id: 2, name: 'b' }, { id: 3, name: 'c' }];
      const planes = Planes.from(expected, Planes.of(3));
      expect(planes.size).toBe(3);
      expect(planes.toJSON()).toEqual(expected);
    });
  });

  describe('getLength', () => {
    it('returns the byte length required to hold the array', () => {
      expect(Planes.getLength(1)).toBe(14);
      expect(Planes.getLength(5)).toBe(70);
    });
  });

  describe('iterator', () => {
    it('iterates over elements of the array', () => {
      const people = Planes.of(10);
      const array = [...people];
      expect(array[0] instanceof Plane).toBe(true);
      expect(array.length).toBe(10);
    });
  });
});
