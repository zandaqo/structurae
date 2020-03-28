const {
  ArrayViewMixin, TypeViewMixin, CollectionViewMixin, CollectionView,
} = require('../index');

const Int32ArrayView = ArrayViewMixin('int32');
const Float64View = TypeViewMixin('float64');

const CollectionA = CollectionViewMixin({
  $id: 'CollectionViewA',
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
        $id: 'CollectionAObject',
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

describe('CollectionViewMixin', () => {
  const PersonSchema = {
    $id: 'PersonCollection',
    type: 'object',
    properties: {
      a: { type: 'number' },
    },
  };

  it('creates a CollectionView class from a given JSON Schema', () => {
    const Person = CollectionViewMixin(PersonSchema);
    expect(Person.prototype instanceof CollectionView).toBe(true);
  });

  it('returns cached class if the same schema is reused', () => {
    CollectionViewMixin(PersonSchema);
    const Person = CollectionView.Views.PersonCollection;
    expect(CollectionViewMixin(PersonSchema)).toBe(Person);
  });
});

describe('CollectionView', () => {
  describe('get', () => {
    it('returns the JavaScript value at a given field', () => {
      const collection = CollectionA.from({ a: 42 });
      expect(collection.get('a')).toBe(42);
    });

    it('returns undefined if the value is not set', () => {
      const collection = CollectionA.from({ b: [1] });
      expect(collection.get('a')).toBe(undefined);
      expect(collection.get('b')).toEqual([1]);
    });

    it('throws if the view does not have the field', () => {
      const collection = CollectionA.from({});
      expect(() => { collection.get('abc'); })
        .toThrow('Field "abc" is not found.');
    });
  });

  describe('getView', () => {
    it('returns a view of a given field', () => {
      const collection = CollectionA.from({ a: 42 });
      expect(collection.getView('a') instanceof Float64View).toBe(true);
    });

    it('returns undefined if the field is not set', () => {
      const collection = CollectionA.from({ b: [1] });
      expect(collection.getView('a')).toBe(undefined);
      expect(collection.getView('b') instanceof Int32ArrayView).toBe(true);
    });

    it('throws if the view does not have the field', () => {
      const collection = CollectionA.from({});
      expect(() => { collection.getView('abc'); })
        .toThrow('Field "abc" is not found.');
    });
  });

  describe('set', () => {
    it('sets a JavaScript value of a field', () => {
      const collection = CollectionA.from({ a: 5 });
      collection.set('a', 42);
      expect(collection.get('a')).toBe(42);
    });

    it('does not set a value for a missing field', () => {
      const collection = CollectionA.from({ b: [1] });
      collection.set('a', 10);
      expect(collection.get('a')).toBe(undefined);
    });

    it('throws if the view does not have the field', () => {
      const collection = CollectionA.from({});
      expect(() => { collection.set('abc', 1); })
        .toThrow('Field "abc" is not found.');
    });
  });

  describe('setView', () => {
    it('copies a given view into a field', () => {
      const collection = CollectionA.from({ a: 1 });
      const number = Float64View.from(42);
      collection.setView('a', number);
      expect(collection.get('a')).toBe(42);
    });

    it('throws if the view does not have the field', () => {
      const collection = CollectionA.from({});
      expect(() => { collection.setView('abc', 1); })
        .toThrow('Field "abc" is not found.');
    });
  });

  describe('toJSON', () => {
    it('returns an an object corresponding to the view', () => {
      const expected = {
        a: 42,
        b: [20, 30, 10],
        c: [{ id: 10, name: 'abc' }, { id: 5, name: 'def' }],
      };
      const collection = CollectionA.from(expected);
      expect(collection.toJSON()).toEqual(expected);
    });
  });

  describe('getLength', () => {
    it('returns the byte length of a collection view to hold a given object', () => {
      expect(CollectionA.getLength({ a: 42, b: [1], c: [1, 2] }))
        .toBe(1 * 8 + 1 * 4 + 2 * 14 + 5 * 4);
      expect(CollectionA.getLength({ b: [1] })).toBe(0 * 8 + 1 * 4 + 5 * 4);
      expect(CollectionA.getLength({})).toBe(0 * 0 + 0 * 0 + 5 * 4);
      expect(CollectionA.getLength({ b: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1] }))
        .toBe(0 * 0 + 10 * 4 + 5 * 4);
    });
  });

  describe('from', () => {
    it('creates a collection view from a given object', () => {
      const expected = {
        a: 42,
        b: [20, 30, 10],
        c: [{ id: 10, name: 'abc' }, { id: 5, name: 'def' }],
        d: 'abc',
        e: [[3, 4], [5, 7], [6, 8]],
      };
      const collection = CollectionA.from(expected);
      expect(collection.toJSON()).toEqual(expected);
    });
  });
});
