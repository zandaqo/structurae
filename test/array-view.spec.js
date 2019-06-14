const ArrayViewMixin = require('../lib/array-view');
const ObjectView = require('../lib/object-view');

class Pet extends ObjectView {}
Pet.schema = {
  age: { type: 'int8' },
  name: { type: 'string', length: 10 },
};

class Person extends ObjectView {}
Person.schema = {
  age: { type: 'int8' },
  height: { type: 'float32' },
  scores: { type: 'int16', size: 5 },
  weight: { type: 'float32', littleEndian: true },
  name: { type: 'string', length: 10 },
  pets: { type: Pet, size: 2 },
  traits: { type: 'uint8', size: 10 },
};

const PeopleView = ArrayViewMixin(Person);


describe('ArrayView', () => {
  describe('ArrayViewMixin', () => {
    it('creates an array class for a given object class', () => {
      const PetsView = ArrayViewMixin(Pet);
      expect(PetsView.ViewClass).toBe(Pet);
      expect(PetsView.viewLength).toBe(11);
    });
  });

  describe('constructor', () => {
    it('creates an array of a given size', () => {
      const array = new PeopleView(10);
      expect(array.size).toBe(10);
      expect(array.byteOffset).toBe(0);
      expect(array.byteLength).toBe(610);
      expect(array.byteView instanceof Uint8Array).toBe(true);
      expect(array.byteView.buffer).toBe(array.buffer);
    });

    it('creates an array with a given buffer', () => {
      const buffer = new ArrayBuffer(1100);
      const array = new PeopleView(buffer, 400, 610);
      expect(array.size).toBe(10);
      expect(array.byteOffset).toBe(400);
      expect(array.byteLength).toBe(610);
    });
  });

  describe('get', () => {
    it('returns an object at a given index', () => {
      const array = new PeopleView(10);
      const actual = array.get(1);
      expect(actual instanceof Person).toBe(true);
      expect(actual.byteOffset).toBe(61);
      expect(actual.byteLength).toBe(61);
      expect(actual.buffer).toBe(array.buffer);
    });
  });

  describe('set', () => {
    it('sets an object view at a given index', () => {
      const buffer = new ArrayBuffer(1100);
      const array = new PeopleView(buffer, 400, 610);
      const object = {
        age: 10,
        height: 50,
        scores: [1, 2, 3, 0, 0],
        weight: 60,
        name: 'arthur',
        pets: [
          {
            age: 1,
            name: 'dog',
          },
          {
            age: 2,
            name: 'cat',
          },
        ],
        traits: [1, 2, 3, 4, 0, 0, 0, 0, 0, 0],
      };
      const objectView = Person.from(object);
      array.set(3, objectView);
      expect(array.get(3).toObject()).toEqual(object);
    });

    it('sets an object at a given index', () => {
      const array = new PeopleView(10);
      const object = {
        age: 10,
        height: 50,
        scores: [1, 2, 3, 0, 0],
        weight: 60,
        name: 'arthur',
        pets: [
          {
            age: 1,
            name: 'dog',
          },
          {
            age: 2,
            name: 'cat',
          },
        ],
        traits: [1, 2, 3, 4, 0, 0, 0, 0, 0, 0],
      };
      array.set(1, object);
      expect(array.get(1).toObject()).toEqual(object);
    });
  });

  describe('size', () => {
    it('returns the amount of objects in the array', () => {
      const array = new PeopleView(9);
      expect(array.byteLength).toBe(549);
      expect(array.size).toBe(9);
    });
  });

  describe('toObject', () => {
    it('returns an array of objects in the array', () => {
      const PetArray = ArrayViewMixin(Pet);
      const expected = [{ age: 1, name: 'a' }, { age: 2, name: 'b' }, { age: 3, name: 'c' }];
      const pets = new PetArray(3);
      pets.set(0, expected[0])
        .set(1, expected[1])
        .set(2, expected[2]);
      expect(pets.toObject()).toEqual(expected);
    });
  });

  describe('from', () => {
    it('creates an array view from an array of objects', () => {
      const PetArray = ArrayViewMixin(Pet);
      const expected = [{ age: 1, name: 'a' }, { age: 2, name: 'b' }, { age: 3, name: 'c' }];
      const pets = PetArray.from(expected);
      expect(pets.size).toBe(3);
      expect(pets.toObject()).toEqual(expected);
    });
  });

  describe('getLength', () => {
    it('returns the byte length required to hold the array', () => {
      expect(PeopleView.getLength(1)).toBe(61);
      expect(PeopleView.getLength(5)).toBe(305);
    });
  });
});
