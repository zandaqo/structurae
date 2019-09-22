const { ArrayViewMixin } = require('../lib/array-view');
const { ObjectViewMixin } = require('../lib/object-view');
const CollectionView = require('../lib/collection-view');

const Pet = ObjectViewMixin({
  age: { type: 'int8' },
  name: { type: 'string', length: 10 },
});

const Person = ObjectViewMixin({
  age: { type: 'int8' },
  height: { type: 'float32' },
  scores: { type: 'int16', size: 5 },
  weight: { type: 'float32', littleEndian: true },
  name: { type: 'string', length: 10 },
  pets: { type: Pet, size: 2 },
  traits: { type: 'uint8', size: 10 },
});

const Pets = ArrayViewMixin(Pet);
const People = ArrayViewMixin(Person);

class PeopleAndPets extends CollectionView {}
PeopleAndPets.schema = [People, Pets];


describe('CollectionView', () => {
  describe('get', () => {
    it('returns the view at a given index', () => {
      const collection = PeopleAndPets.of([1, 1]);
      expect(collection.get(0) instanceof People).toBe(true);
    });

    it('returns undefined if the view is not set', () => {
      const collection = PeopleAndPets.of([0, 1]);
      expect(collection.get(0)).toBe(undefined);
      expect(collection.get(1) instanceof Pets).toBe(true);
    });

    it('returns undefined if a given index is out of bound', () => {
      const collection = PeopleAndPets.of([1, 1]);
      expect(collection.get(2)).toBe(undefined);
    });
  });

  describe('set', () => {
    it('sets an object at a given index', () => {
      const collection = PeopleAndPets.of([1, 1]);
      collection.set(0, [{ age: 10 }]);
      expect(collection.get(0).get(0).get('age')).toBe(10);
    });

    it('does not set an object for nonexistent index', () => {
      const collection = PeopleAndPets.of([0, 1]);
      collection.set(0, [{ age: 10 }]);
      expect(collection.get(0)).toBe(undefined);
    });
  });

  describe('toObject', () => {
    it('is equivalent to toJSON', () => {
      const people = PeopleAndPets.from([[{ age: 20 }], undefined]);
      expect(people.toObject()).toEqual(people.toJSON());
    });
  });

  describe('toJSON', () => {
    it('returns an array representation of the collection view', () => {
      const expected = [
        [{ age: 20 }, { age: 30 }],
        [{ age: 10 }, { age: 5 }],
      ];
      const collection = PeopleAndPets.from(expected);
      expect(collection.toJSON()).toEqual([[{
        age: 20,
        height: 0,
        name: '',
        pets: [{ age: 0, name: '' }, { age: 0, name: '' }],
        scores: [0, 0, 0, 0, 0],
        traits: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        weight: 0,
      }, {
        age: 30,
        height: 0,
        name: '',
        pets: [{ age: 0, name: '' }, { age: 0, name: '' }],
        scores: [0, 0, 0, 0, 0],
        traits: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        weight: 0,
      }], [{ age: 10, name: '' }, { age: 5, name: '' }]]);
    });
  });

  describe('getLength', () => {
    it('returns the byte length of a collection view to hold a given amount of objects', () => {
      expect(PeopleAndPets.getLength([1, 1])).toBe(1 * 61 + 1 * 11 + 2 * 4);
      expect(PeopleAndPets.getLength([0, 1])).toBe(0 * 61 + 1 * 11 + 2 * 4);
      expect(PeopleAndPets.getLength([0, 0])).toBe(0 * 61 + 0 * 11 + 2 * 4);
      expect(PeopleAndPets.getLength([0, 10])).toBe(0 * 61 + 10 * 11 + 2 * 4);
    });
  });

  describe('of', () => {
    it('creates an empty collection view of specified size', () => {
      const collection = PeopleAndPets.of([2, 3]);
      expect(collection instanceof PeopleAndPets).toBe(true);
      expect(collection.byteLength).toBe(2 * 61 + 3 * 11 + 2 * 4);
      expect(collection.getUint32(0)).toBe(8);
      expect(collection.getUint32(4)).toBe(130);
    });
  });

  describe('from', () => {
    it('creates a collection view from a given collection of objects', () => {
      const expected = [
        [{ age: 20 }, { age: 30 }],
        [{ age: 10 }, { age: 5 }],
      ];
      const collection = PeopleAndPets.from(expected);
      expect(collection instanceof PeopleAndPets).toBe(true);
      expect(collection.byteLength).toBe(2 * 61 + 2 * 11 + 2 * 4);
      expect(collection.get(0).get(0).get('age')).toBe(20);
      expect(collection.get(0).get(1).get('age')).toBe(30);
      expect(collection.get(1).get(0).get('age')).toBe(10);
      expect(collection.get(1).get(1).get('age')).toBe(5);
      expect(collection.get(2)).toBe(undefined);
    });
  });

  describe('iterator', () => {
    it('iterates over elements of the array', () => {
      const collection = PeopleAndPets.of([1, 1]);
      expect([...collection].length).toBe(2);
    });
  });
});
