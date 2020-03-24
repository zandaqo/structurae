const {
  ArrayViewMixin, ObjectViewMixin, CollectionView, TypeViewMixin,
} = require('../index');

const Train = ObjectViewMixin({
  $id: 'train',
  type: 'object',
  properties: {
    id: { type: 'integer' },
    name: { type: 'string', maxLength: 10 },
  },
});

const Trains = ArrayViewMixin(Train);
const Int32ArrayView = ArrayViewMixin('int32');
const Float64View = TypeViewMixin('float64');

class TrainCollection extends CollectionView {}
TrainCollection.schema = [Float64View, Int32ArrayView, Trains];


describe('CollectionView', () => {
  describe('get', () => {
    it('returns the view at a given index', () => {
      const collection = TrainCollection.of([1, 1]);
      expect(collection.get(0) instanceof Float64View).toBe(true);
    });

    it('returns undefined if the view is not set', () => {
      const collection = TrainCollection.of([0, 1]);
      expect(collection.get(0)).toBe(undefined);
      expect(collection.get(1) instanceof Int32ArrayView).toBe(true);
    });

    it('returns undefined if a given index is out of bound', () => {
      const collection = TrainCollection.of([1, 1]);
      expect(collection.get(2)).toBe(undefined);
    });
  });

  describe('set', () => {
    it('sets a value at a given index', () => {
      const collection = TrainCollection.of([1, 1]);
      collection.set(0, 42);
      expect(collection.get(0).get()).toBe(42);
    });

    it('does not set a value for nonexistent index', () => {
      const collection = TrainCollection.of([0, 1]);
      collection.set(0, 10);
      expect(collection.get(0)).toBe(undefined);
    });
  });

  describe('toJSON', () => {
    it('returns an array representation of the collection view', () => {
      const expected = [
        42,
        [20, 30, 10],
        [{ id: 10, name: 'abc' }, { id: 5, name: 'def' }],
      ];
      const collection = TrainCollection.from(expected);
      expect(collection.toJSON()).toEqual(expected);
    });
  });

  describe('getLength', () => {
    it('returns the byte length of a collection view to hold a given amount of objects', () => {
      expect(TrainCollection.getLength([1, 1, 2])).toBe(1 * 8 + 1 * 4 + 2 * 14 + 3 * 4);
      expect(TrainCollection.getLength([0, 1])).toBe(0 * 8 + 1 * 4 + 3 * 4);
      expect(TrainCollection.getLength([0, 0])).toBe(0 * 0 + 0 * 0 + 3 * 4);
      expect(TrainCollection.getLength([0, 10])).toBe(0 * 0 + 10 * 4 + 3 * 4);
    });
  });

  describe('of', () => {
    it('creates an empty collection view of specified size', () => {
      const collection = TrainCollection.of([1, 3, 1]);
      expect(collection instanceof TrainCollection).toBe(true);
      expect(collection.byteLength).toBe(1 * 8 + 3 * 4 + 1 * 14 + 3 * 4);
      expect(collection.getUint32(0)).toBe(12);
      expect(collection.getUint32(4)).toBe(20);
    });
  });

  describe('from', () => {
    it('creates a collection view from a given collection of objects', () => {
      const expected = [
        42,
        [20, 30, 10],
        [{ id: 10, name: 'abc' }, { id: 5, name: 'def' }],
      ];
      const collection = TrainCollection.from(expected);
      expect(collection.toJSON()).toEqual(expected);
    });
  });

  describe('iterator', () => {
    it('iterates over elements of the array', () => {
      const collection = TrainCollection.of([1, 1]);
      expect([...collection].length).toBe(3);
    });
  });
});
