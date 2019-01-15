const PackedInt = require('../lib/packed-int');

describe('PackedInt', () => {
  class Field extends PackedInt {}
  Field.fields = [{ name: 'width', size: 16 }, { name: 'height', size: 15 }];
  class PersonFlags extends PackedInt {}
  PersonFlags.fields = ['human', 'gender', 'tall'];
  class LargePerson extends PackedInt {}
  LargePerson.fields = [
    { name: 'age', size: 7 },
    { name: 'gender', size: 1 },
    { name: 'weight', size: 31 },
    { name: 'height', size: 15 },
  ];

  describe('constructor', () => {
    it('initializes class on first invocation', () => {
      jest.spyOn(Field, 'initialize');
      new Field(0);
      new Field(0);
      expect(Field.initialize).toHaveBeenCalled();
      expect(Field.initialize.mock.calls.length).toBe(1);
      expect(Field.isInitialized).toBe(true);
      expect(Field.size).toBe(31);
      expect(Field.zero).toBe(0);
      expect(Field.one).toBe(1);
      expect(Field.two).toBe(2);
      expect(Field.masks).toBeDefined();
      expect(Field.offsets).toBeDefined();
      expect(Field.isBigInt).toBe(false);
      Field.initialize.mockRestore();
    });

    it('initializes class tailored for bit flags', () => {
      const person = new PersonFlags(0);
      expect(person.value).toBe(0);
      expect(PersonFlags.isInitialized).toBe(true);
      expect(PersonFlags.fields).toEqual([
        { name: 'human', size: 1 },
        { name: 'gender', size: 1 },
        { name: 'tall', size: 1 },
      ]);
      expect(PersonFlags.size).toBe(3);
    });

    it('initializes class that uses BigInts if the total size is above 31 bits', () => {
      const person = new LargePerson(0);
      expect(person.value).toBe(BigInt(0));
      expect(LargePerson.size).toBe(54);
      expect(LargePerson.zero).toBe(BigInt(0));
      expect(LargePerson.one).toBe(BigInt(1));
      expect(LargePerson.two).toBe(BigInt(2));
      expect(LargePerson.isBigInt).toBe(true);
    });

    it('creates an instance with a given numerical value', () => {
      expect(new Field(2147483647).value).toBe(2147483647);
      expect(new LargePerson(BigInt(1375759717)).value).toBe(BigInt(1375759717));
      expect(new PersonFlags(5).value).toBe(5);
    });

    it('creates an instance from a list of values', () => {
      expect(new Field([65535, 32767]).value).toBe(2147483647);
      expect(new LargePerson([20, 1, 3500, 5]).value).toBe(BigInt('2748779965588'));
      expect(new PersonFlags([1, 0, 1]).value).toBe(5);
    });
  });

  describe('get', () => {
    it('returns a value of a given field', () => {
      expect(new Field([65535, 32767]).get('width')).toBe(65535);
      expect(new Field([65535, 32767]).get('height')).toBe(32767);
      expect(new LargePerson([20, 1, 3500, 5]).get('weight')).toBe(3500);
      expect(new LargePerson(BigInt('2748779965588')).get('weight')).toBe(3500);
      expect(new PersonFlags([1, 0, 1]).get('gender')).toBe(0);
      expect(new PersonFlags(5).get('tall')).toBe(1);
    });
  });

  describe('set', () => {
    it('sets a given value to a given field', () => {
      expect(new Field([65535, 32760]).set('height', 32767).get('height')).toBe(32767);
      expect(new LargePerson([20, 1, 3500, 5]).set('weight', 3000).get('weight')).toBe(3000);
      expect(new LargePerson(BigInt(1375759717)).set('age', 21).get('age')).toBe(21);
      expect(new PersonFlags([1, 0, 1]).set('gender', 1).get('gender')).toBe(1);
      expect(new PersonFlags([1, 0, 1]).set('gender').get('gender')).toBe(1);
      expect(new PersonFlags([1, 0, 1]).set('human', 0).get('human')).toBe(0);
    });
  });

  describe('has', () => {
    it('checks if all specified fields are set in a given bitfield instance', () => {
      expect(new PersonFlags([1, 0, 1]).has('human', 'tall')).toBe(true);
      expect(new PersonFlags([1, 1, 1]).has('human', 'tall')).toBe(true);
      expect(new PersonFlags([0, 1, 1]).has('human', 'tall')).toBe(false);
      expect(new PersonFlags([1, 1, 0]).has('human', 'tall')).toBe(false);
      expect(new PersonFlags([0, 1, 0]).has('human', 'tall')).toBe(false);
      expect(new PersonFlags([0, 1, 0]).has('gender')).toBe(true);
    });
  });

  describe('match', () => {
    it('partially matches instance', () => {
      const field = new Field([8, 9]);
      expect(field.match({ width: 8 })).toBe(true);
      expect(field.match({ width: 7 })).toBe(false);
      expect(field.match({ height: 9 })).toBe(true);
      expect(field.match({ height: 7 })).toBe(false);
      expect(field.match({ width: 8, height: 9 })).toBe(true);
      expect(field.match({ width: 8, height: 7 })).toBe(false);
      const person = new LargePerson([20, 1, 3500, 5]);
      expect(person.match({ weight: 3500 })).toBe(true);
      expect(person.match({ weight: 3400 })).toBe(false);
      expect(person.match({ age: 20, height: 5 })).toBe(true);
      expect(person.match({ age: 20, height: 7 })).toBe(false);
      expect(person.match({ age: 20, height: 5, gender: 1 })).toBe(true);
    });
  });

  describe('toValue', () => {
    it('returns value of an instance', () => {
      expect(new Field([20, 1]).toValue()).toBe(65556);
      expect(new LargePerson([20, 1, 3500, 5]).toValue()).toBe(BigInt('2748779965588'));
      expect(new PersonFlags([1, 0, 1]).toValue()).toBe(5);
    });

    it('returns number for bigint values less than 53 bits', () => {
      class MediumField extends PackedInt {}
      MediumField.fields = [{ name: 'width', size: 26 }, { name: 'height', size: 27 }];
      MediumField.initialize();
      expect(MediumField.size).toBe(53);
      expect(MediumField.isBigInt).toBe(true);
      expect(MediumField.isSafe).toBe(true);
      expect(new MediumField([100, 100]).toValue()).toBe(6710886500);
    });
  });

  describe('toObject', () => {
    it('returns a plain object representation of an instance', () => {
      expect(new Field([20, 1]).toObject()).toEqual({ width: 20, height: 1 });
      expect(new LargePerson([20, 1, 3500, 5]).toObject()).toEqual({
        age: 20,
        gender: 1,
        weight: 3500,
        height: 5,
      });
      expect(new PersonFlags([1, 0, 1]).toObject()).toEqual({ human: 1, gender: 0, tall: 1 });
    });
  });

  describe('isValid', () => {
    class Person extends PackedInt {}
    Person.fields = [{ name: 'age', size: 7 }, { name: 'gender', size: 1 }];
    Person.initialize();

    it('checks if a given set of values is valued according to the schema', () => {
      expect(Person.isValid([])).toBe(false);
      expect(Person.isValid([20, 0])).toBe(true);
      expect(Person.isValid([200, 1])).toBe(false);
      expect(Person.isValid([20])).toBe(false);
      expect(Person.isValid(['', ''])).toBe(false);
    });
    it('checks if given pairs of Person name and value are valid according to the schema', () => {
      expect(Person.isValid({ age: 21 })).toBe(true);
      expect(Person.isValid({ age: 200 })).toBe(false);
      expect(Person.isValid({ age: -200 })).toBe(false);
      expect(Person.isValid({ age: 'asdf' })).toBe(false);
      expect(Person.isValid({ age: 21, gender: 1 })).toBe(true);
      expect(Person.isValid({ age: 21, gender: 4 })).toBe(false);
    });
  });

  describe('getMinSize', () => {
    it('calculates the minimum amount of bits to hold a given number', () => {
      expect(PackedInt.getMinSize(100)).toBe(7);
      expect(PackedInt.getMinSize(127)).toBe(7);
      expect(PackedInt.getMinSize(2000)).toBe(11);
      expect(PackedInt.getMinSize(8000)).toBe(13);
      expect(PackedInt.getMinSize(2147483647)).toBe(31);
      expect(PackedInt.getMinSize(7147483647)).toBe(33);
      expect(PackedInt.getMinSize(Number.MAX_SAFE_INTEGER)).toBe(53);
    });
  });

  describe('getMatcher', () => {
    it('returns matcher to partially match an instance', () => {
      new Field(0);
      const matcher = Field.getMatcher({ width: 10 });
      expect(matcher).toEqual([10, 1073807359]);
      new LargePerson(0);
      const bigMatcher = LargePerson.getMatcher({ age: 2, weight: 12 });
      expect(bigMatcher[0]).toBe(BigInt(3074));
      expect(bigMatcher[1]).toBe(BigInt('9007749010554751'));
    });
  });

  describe('iterator', () => {
    it('iterates over numbers stored in the instance', () => {
      const data = [20, 1, 3500, 5];
      const person = new LargePerson(data);
      expect(Array.from(person)).toEqual(data);
      expect([...data]).toEqual(data);
      const [age, gender] = person;
      expect(age).toBe(20);
      expect(gender).toBe(1);
    });
  });
});
