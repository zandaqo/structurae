import { BitFieldMixin, BitField } from '../src/bit-field';

describe('BitField', () => {
  const Field = BitFieldMixin({ width: 16, height: 15 });
  const PersonFlags = BitFieldMixin({
    human: 1,
    gender: 1,
    tall: 1,
  });

  describe('BitFieldMixin', () => {
    it('throws if the total size of a field exceeds 31 bits', () => {
      expect(() => BitFieldMixin({ a: 1, b: 31 })).toThrowError(TypeError);
    });
  });

  describe('constructor', () => {
    it('creates an instance with a given numerical value', () => {
      expect(new Field().value).toBe(0);
      expect(new Field(2147483647).value).toBe(2147483647);
      expect(new PersonFlags(5).value).toBe(5);
    });

    it('creates an instance from an object', () => {
      expect(new Field({ width: 65535, height: 32767 }).value).toBe(2147483647);
      expect(new Field([65535, 32767]).value).toBe(2147483647);
      expect(new PersonFlags({ human: 1, gender: 0, tall: 1 }).value).toBe(5);
    });

    it('creates an instance from another bitfield', () => {
      expect(new Field(new Field({ width: 65535, height: 32767 })).value).toBe(
        2147483647,
      );
      expect(
        new PersonFlags(new PersonFlags({ human: 1, gender: 0, tall: 1 }))
          .value,
      ).toBe(5);
    });
  });

  describe('get', () => {
    it('returns a value of a given field', () => {
      expect(new Field({ width: 65535, height: 32767 }).get('width')).toBe(
        65535,
      );
      expect(new Field({ width: 65535, height: 32767 }).get('height')).toBe(
        32767,
      );
      expect(
        new PersonFlags({ human: 1, gender: 0, tall: 1 }).get('gender'),
      ).toBe(0);
      expect(new PersonFlags(5).get('tall')).toBe(1);
    });
  });

  describe('set', () => {
    it('sets a given value to a given field', () => {
      expect(
        new Field({ width: 65535, height: 32760 })
          .set('height', 32767)
          .get('height'),
      ).toBe(32767);
      expect(
        new PersonFlags({ human: 1, gender: 0, tall: 1 })
          .set('gender', 1)
          .get('gender'),
      ).toBe(1);
      expect(
        new PersonFlags({ human: 1, gender: 0, tall: 1 })
          .set('gender')
          .get('gender'),
      ).toBe(1);
      expect(
        new PersonFlags({ human: 1, gender: 0, tall: 1 })
          .set('human', 0)
          .get('human'),
      ).toBe(0);
    });
  });

  describe('has', () => {
    it('checks if all specified fields are set in a given bitfield instance', () => {
      expect(
        new PersonFlags({ human: 1, gender: 0, tall: 1 }).has('human', 'tall'),
      ).toBe(true);
      expect(
        new PersonFlags({ human: 1, gender: 1, tall: 1 }).has('human', 'tall'),
      ).toBe(true);
      expect(
        new PersonFlags({ human: 0, gender: 1, tall: 1 }).has('human', 'tall'),
      ).toBe(false);
      expect(
        new PersonFlags({ human: 1, gender: 1, tall: 0 }).has('human', 'tall'),
      ).toBe(false);
      expect(
        new PersonFlags({ human: 0, gender: 1, tall: 0 }).has('human', 'tall'),
      ).toBe(false);
      expect(
        new PersonFlags({ human: 0, gender: 1, tall: 0 }).has('gender'),
      ).toBe(true);
    });
  });

  describe('match', () => {
    it('partially matches instance', () => {
      const field = new Field({ width: 8, height: 9 });
      expect(field.match({ width: 8 })).toBe(true);
      expect(field.match(Field.getMatcher({ width: 8 }))).toBe(true);
      expect(field.match({ width: 7 })).toBe(false);
      expect(field.match({ height: 9 })).toBe(true);
      expect(field.match({ height: 7 })).toBe(false);
      expect(field.match({ width: 8, height: 9 })).toBe(true);
      expect(field.match({ width: 8, height: 7 })).toBe(false);
    });
  });

  describe('toJSON', () => {
    it('returns the value of an instance as a number for JSON', () => {
      expect(
        JSON.parse(JSON.stringify(new Field({ width: 20, height: 1 }))),
      ).toBe(65556);
    });
  });

  describe('toObject', () => {
    it('returns a plain object representation of an instance', () => {
      expect(new Field({ width: 20, height: 1 }).toObject()).toEqual({
        width: 20,
        height: 1,
      });
      expect(
        new PersonFlags({ human: 1, gender: 0, tall: 1 }).toObject(),
      ).toEqual({
        human: 1,
        gender: 0,
        tall: 1,
      });
    });
  });

  describe('toString', () => {
    it('returns a string representing the value of the instance', () => {
      expect(`${new Field({ width: 20, height: 1 })}`).toBe('65556');
    });
  });

  describe('valueOf', () => {
    it('returns the value of an instance as a number', () => {
      expect(+new Field({ width: 20, height: 1 })).toBe(65556);
      expect(+new PersonFlags({ human: 1, gender: 0, tall: 1 })).toBe(5);
    });
  });

  describe('encode', () => {
    it('encodes a given list of numbers into a single number representing the bitfield', () => {
      expect(Field.encode([20, 1])).toBe(65556);
    });
    it('encodes a given map of fields and their values into a single number representing the bitfield', () => {
      expect(Field.encode({ width: 20, height: 1 })).toBe(65556);
    });
  });

  describe('isValid', () => {
    class Person extends BitField {}
    Person.schema = { age: 7, gender: 1 };
    Person.initialize();

    it('checks if a given set of values is valued according to the schema', () => {
      expect(Person.isValid({})).toBe(true);
      expect(Person.isValid({ age: 20, gender: 0 })).toBe(true);
      expect(Person.isValid({ age: 200, gender: -1 })).toBe(false);
      expect(Person.isValid({ age: 20 })).toBe(true);
    });
  });

  describe('getMinSize', () => {
    it('calculates the minimum amount of bits to hold a given number', () => {
      for (let i = 1; i < 53; i++) {
        const number = 2 ** i;
        expect(BitField.getMinSize(number)).toEqual(i + 1);
        expect(BitField.getMinSize(number - 1)).toEqual(i);
      }
      expect(BitField.getMinSize(Number.MAX_SAFE_INTEGER)).toEqual(53);
    });
  });

  describe('getMatcher', () => {
    it('returns matcher to partially match an instance', () => {
      Field.initialize();
      const matcher = Field.getMatcher({ width: 10 });
      expect(matcher).toEqual([10, -2147418113]);
    });
  });

  describe('iterator', () => {
    it('iterates over numbers stored in the instance', () => {
      const field = new Field({ width: 20, height: 1 });
      expect(Array.from(field)).toEqual([20, 1]);
      expect([...field]).toEqual([20, 1]);
      const [width, height] = field;
      expect(width).toBe(20);
      expect(height).toBe(1);
    });
  });
});
