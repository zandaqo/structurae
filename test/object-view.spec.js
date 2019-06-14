const ObjectView = require('../lib/object-view');
const StringView = require('../lib/string-view');
const { Int16View } = require('../lib/typed-array-view');

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
  pet: { type: Pet },
};

class Primitives extends ObjectView {}
Primitives.schema = {
  a: { type: 'int8' },
  b: { type: 'uint8' },
  c: { type: 'int16', littleEndian: true },
  d: { type: 'uint16' },
  e: { type: 'int32', littleEndian: true },
  f: { type: 'uint32' },
  g: { type: 'float32', littleEndian: true },
  h: { type: 'float64' },
  i: { type: 'bigint64' },
  j: { type: 'biguint64' },
};

class Invalid extends ObjectView {}
Invalid.schema = {
  a: { type: 'Int128' },
};

describe('ObjectView', () => {
  describe('constructor', () => {
    it('creates an instance of ObjectView', () => {
      const person = new Person();
      expect(person.buffer instanceof ArrayBuffer).toBe(true);
      expect(person.buffer.byteLength).toBe(40);
      expect(person instanceof DataView).toBe(true);
      expect(person.byteView instanceof Uint8Array).toBe(true);
    });

    it('creates an instance using preexisting ArrayBuffer', () => {
      const buffer = new ArrayBuffer(60);
      const person = new Person(buffer, 9, 40);
      expect(person.buffer).toBe(buffer);
      expect(person.byteLength).toBe(40);
      expect(person.byteOffset).toBe(9);
      expect(person.byteView.length).toBe(40);
      expect(person.byteView.byteOffset).toBe(9);
    });

    it('throws if invalid field type is used', () => {
      expect(() => { new Invalid(); })
        .toThrowError('Type "Int128" is not a valid type.');
    });
  });

  describe('get', () => {
    it('returns the value of a given field', () => {
      const person = new Primitives();
      expect(person.get('a')).toBe(0);
      expect(person.get('b')).toBe(0);
      expect(person.get('c')).toBe(0);
      expect(person.get('d')).toBe(0);
      expect(person.get('e')).toBe(0);
      expect(person.get('f')).toBe(0);
      expect(person.get('g')).toBe(0);
      expect(person.get('h')).toBe(0);
      expect(person.get('i')).toBe(BigInt(0));
      expect(person.get('j')).toBe(BigInt(0));
    });

    it('returns a StringView for a string field', () => {
      const person = new Person();
      const actual = person.get('name');
      expect(actual instanceof StringView).toBe(true);
      expect(actual.buffer === person.buffer).toBe(true);
      expect(actual.length).toBe(10);
    });

    it('returns a TypedArrayView from an array field', () => {
      const person = new Person();
      const actual = person.get('scores');
      expect(actual instanceof DataView).toBe(true);
      expect(actual.buffer === person.buffer).toBe(true);
      expect(actual.size).toBe(5);
      expect(actual.byteLength).toBe(10);
    });

    it('returns an ObjectView for an object field', () => {
      const person = new Person();
      const actual = person.get('pet');
      expect(actual instanceof Pet).toBe(true);
      expect(actual.buffer === person.buffer).toBe(true);
      expect(actual.byteOffset).toBe(29);
      expect(actual.byteLength).toBe(11);
    });
  });

  describe('set', () => {
    it('sets a given value to a given field', () => {
      const primitives = new Primitives();
      expect(primitives.set('a', 1)
        .get('a')).toBe(1);
      expect(primitives.set('b', 1)
        .get('b')).toBe(1);
      expect(primitives.set('c', 1)
        .get('c')).toBe(1);
      expect(primitives.set('d', 1)
        .get('d')).toBe(1);
      expect(primitives.set('e', 1)
        .get('e')).toBe(1);
      expect(primitives.set('f', 1)
        .get('f')).toBe(1);
      expect(primitives.set('g', 1)
        .get('g')).toBe(1);
      expect(primitives.set('h', 1)
        .get('h')).toBe(1);
      expect(primitives.set('i', BigInt(1))
        .get('i')).toBe(BigInt(1));
      expect(primitives.set('j', BigInt(1))
        .get('j')).toBe(BigInt(1));
    });

    it('sets a buffer for a string field', () => {
      const person = new Person();
      const value = new StringView(10);
      value[0] = 35;
      value[9] = 33;
      person.set('name', value);
      const actual = person.get('name');
      expect(actual).toEqual(value);
      expect(actual.buffer !== value.buffer).toBe(true);
    });

    it('sets a string for a string field', () => {
      const person = new Person();
      person.set('name', 'maga');
      expect(person.get('name').toString()).toBe('maga');
    });

    it('sets a TypedArrayView for an array field', () => {
      const person = new Person();
      const scores = Int16View.from([10, 0, 0, 0, -10]);
      person.set('scores', scores);
      expect(Array.from(person.get('scores'))).toEqual([10, 0, 0, 0, -10]);
    });

    it('sets an array for an array field', () => {
      const buffer = new ArrayBuffer(1512);
      const person = new Person(buffer, 1000);
      const array = person.get('scores');
      expect(Array.from(array)).toEqual([0, 0, 0, 0, 0]);
      person.set('scores', [1, 2, 3]);
      expect(Array.from(array)).toEqual([1, 2, 3, 0, 0]);
      expect(Array.from(person.get('scores'))).toEqual([1, 2, 3, 0, 0]);
    });

    it('sets an ObjectView for an object field', () => {
      const person = new Person();
      const pet = new Pet();
      pet.set('age', 10).set('name', 'tuzik');
      person.set('pet', pet);
      expect(person.get('pet').toObject()).toEqual({ age: 10, name: 'tuzik' });
    });

    it('sets an object for an object field', () => {
      const person = new Person();
      const pet = { age: 10, name: 'tuzik' };
      person.set('pet', pet);
      expect(person.get('pet').toObject()).toEqual({ age: 10, name: 'tuzik' });
    });
  });

  describe('toObject', () => {
    it('returns an Object corresponding to the object view', () => {
      const person = new Person();
      person.set('age', 10)
        .set('height', 50)
        .set('weight', 60)
        .set('scores', [1, 2, 3])
        .set('pet', { age: 1, name: 'tuzik' })
        .set('name', 'maga');
      const result = person.toObject();
      expect(result).toEqual({
        age: 10,
        height: 50,
        scores: [1, 2, 3, 0, 0],
        weight: 60,
        name: 'maga',
        pet: {
          age: 1,
          name: 'tuzik',
        },
      });
    });
  });

  describe('from', () => {
    it('creates a new object view from an object', () => {
      const object = {
        age: 10,
        height: 50,
        scores: [1, 2, 3, 0, 0],
        weight: 60,
        name: 'maga',
        pet: {
          age: 1,
          name: 'tuzik',
        },
      };
      const person = Person.from(object);
      expect(person.toObject()).toEqual(object);
    });

    it('fills an existing object view with properties of a given object', () => {
      const object = {
        age: 10,
        height: 50,
        scores: [1, 2, 3, 0, 0],
        weight: 60,
        name: 'maga',
        pet: {
          age: 1,
          name: 'tuzik',
        },
      };
      const person = new Person();
      Person.from(object, person);
      expect(person.toObject()).toEqual(object);
    });
  });

  describe('getLength', () => {
    it('returns the the byte length of an object view', () => {
      expect(Person.getLength()).toBe(40);
      expect(Pet.getLength()).toBe(11);
      expect(Primitives.getLength()).toBe(42);
    });
  });
});
