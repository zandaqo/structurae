const {
  ObjectView,
  ObjectViewMixin,
  StringView,
  ArrayViewMixin,
  TypeViewMixin,
} = require('../index');

const PersonSchema = {
  $id: 'person',
  type: 'object',
  properties: {
    age: { type: 'integer', btype: 'int8', default: 42 },
    height: { type: 'number' },
    scores: {
      type: 'array',
      items: { type: 'integer' },
      maxItems: 5,
    },
    weight: { type: 'number', btype: 'float32', littleEndian: false },
    name: { type: 'string', maxLength: 20, default: 'Arthur Dent' },
    friends: {
      type: 'array',
      items: {
        type: 'string',
        maxLength: 10,
      },
      maxItems: 3,
    },
    house: { type: 'boolean', default: true },
    car: {
      $id: 'car',
      type: 'object',
      properties: {
        color: { type: 'integer', btype: 'int16' },
        model: { type: 'integer', btype: 'int16' },
      },
    },
    pets: {
      type: 'array',
      maxItems: 3,
      items: {
        type: 'object',
        $id: 'pet',
        properties: {
          age: { type: 'number', btype: 'int8' },
          name: { type: 'string', maxLength: 10 },
        },
      },
    },
  },
};

const HouseSchema = {
  $id: 'house',
  type: 'object',
  properties: {
    owner: { $ref: '#person' },
    mainroom: { $ref: '#room' },
    rooms: {
      type: 'array',
      maxItems: 6,
      items: {
        $id: 'room',
        type: 'object',
        properties: {
          size: { type: 'integer', btype: 'uint8' },
        },
      },
      default: [{ size: 2 }, { size: 3 }, { size: 4 }],
    },
    sizes: {
      type: 'array',
      maxItems: 3,
      items: {
        type: 'array',
        maxItems: 2,
        items: {
          type: 'integer',
        },
      },
      default: [
        [1, 5],
        [3, 2],
        [4, 5],
      ],
    },
  },
};

const InvalidType = {
  $id: 'InvalidType',
  type: 'object',
  properties: {
    a: { type: 'float512' },
  },
};

const IvalidRef = {
  $id: 'InvalidType',
  type: 'object',
  properties: {
    a: { $ref: '#none' },
  },
};

const InvalidRecursive = {
  $id: 'InvalidRecursive',
  type: 'object',
  properties: {
    a: {
      $id: 'a',
      type: 'object',
      properties: {
        b: { $ref: '#b' },
      },
    },
    b: {
      $id: 'b',
      type: 'object',
      properties: {
        a: { $ref: '#a' },
      },
    },
  },
};

describe('ObjectViewMixin', () => {
  it('creates an ObjectView class from a given JSON Schema', () => {
    const Person = ObjectViewMixin(PersonSchema);
    expect(Person.prototype instanceof ObjectView).toBe(true);
    expect(Person.objectLength).toBe(121);
  });

  it('creates an ObjectView with references to existing View classes', () => {
    const House = ObjectViewMixin(HouseSchema);
    expect(House.layout.owner.View).toBe(ObjectView.Views.person);
    expect(House.layout.mainroom.View).toBe(ObjectView.Views.room);
  });

  it('does not initialize the same schema twice', () => {
    const Thing = ObjectViewMixin({
      $id: 'thing',
      type: 'object',
      properties: {
        a: {
          $id: 'person',
          type: 'object',
          properties: {
            a: { type: 'number' },
          },
        },
      },
    });
    expect(Thing.layout.a.View.objectLength).toBe(121);
  });

  it('throws if invalid field type is used', () => {
    expect(() => {
      ObjectViewMixin(InvalidType);
    }).toThrowError('Type "float512" is not supported.');
  });

  it('throws if non existant view is referenced', () => {
    expect(() => {
      ObjectViewMixin(IvalidRef);
    }).toThrowError('View "none" is not found.');
  });

  it('throws if the schema has recursive references', () => {
    expect(() => {
      ObjectViewMixin(InvalidRecursive);
    }).toThrowError('The schema has recursive references.');
  });
});

describe('ObjectView', () => {
  const Person = ObjectViewMixin(PersonSchema);
  const House = ObjectViewMixin(HouseSchema);
  const defaultPersonData = {
    age: 42,
    height: 0,
    weight: 0,
    name: 'Arthur Dent',
    scores: [0, 0, 0, 0, 0],
    friends: ['', '', ''],
    house: true,
    car: { color: 0, model: 0 },
    pets: [
      { age: 0, name: '' },
      { age: 0, name: '' },
      { age: 0, name: '' },
    ],
  };

  describe('get', () => {
    it('returns the JavaScript value of a given field', () => {
      const person = Person.from({});
      expect(person.get('age')).toBe(42);
      expect(person.get('name')).toBe('Arthur Dent');
      expect(person.get('scores')).toEqual([0, 0, 0, 0, 0]);
      expect(person.get('car')).toEqual({ color: 0, model: 0 });
      expect(person.get('house')).toBe(true);
      expect(House.from({}).get('sizes')).toEqual([
        [1, 5],
        [3, 2],
        [4, 5],
      ]);
    });
  });

  describe('getView', () => {
    it('returns a view of a given field', () => {
      const person = Person.from({});
      expect(person.getView('age') instanceof TypeViewMixin('int8', true)).toBe(true);
      expect(person.getView('weight') instanceof TypeViewMixin('float32', false)).toBe(true);
      expect(person.getView('name') instanceof StringView).toBe(true);
      expect(person.getView('scores') instanceof ArrayViewMixin('int32', true)).toBe(true);
      expect(person.getView('car') instanceof ObjectView).toBe(true);
    });
  });

  describe('set', () => {
    it('sets a given JavaScript value to a given field', () => {
      const person = Person.from({});
      expect(person.set('age', 30).get('age')).toBe(30);
      expect(person.set('name', 'Zaphod').get('name')).toBe('Zaphod');
      expect(person.set('house', false).get('house')).toBe(false);
      expect(person.set('friends', ['a', 'b', 'c']).get('friends')).toEqual(['a', 'b', 'c']);
      expect(person.set('scores', [5, 3, 4, 5, 7]).get('scores')).toEqual([5, 3, 4, 5, 7]);
      expect(person.set('car', { color: 1 }).get('car')).toEqual({ color: 1, model: 0 });
      expect(
        person
          .set('pets', [
            { age: 1, name: 'a' },
            { age: 2, name: 'b' },
          ])
          .get('pets'),
      ).toEqual([
        { age: 1, name: 'a' },
        { age: 2, name: 'b' },
        { age: 0, name: '' },
      ]);
    });

    it('zeros out non-existing elements', () => {
      const person = Person.from({ scores: [1, 2, 3, 4, 5] });
      expect(person.set('scores', [1, 2]).get('scores')).toEqual([1, 2, 0, 0, 0]);
    });

    it('zeros out non-existing fields', () => {
      const person = Person.from({ car: { color: 10, model: 20 } });
      expect(person.set('car', { model: 5 }).get('car')).toEqual({ color: 0, model: 5 });
    });
  });

  describe('setView', () => {
    it('copies a given view into a field', () => {
      const person = Person.from({});
      const value = new StringView(20);
      value[0] = 35;
      value[9] = 33;
      person.setView('name', value);
      const actual = person.getView('name');
      expect(actual).toEqual(value);
      expect(actual.buffer !== value.buffer).toBe(true);
    });
  });

  describe('toJSON', () => {
    it('returns an Object corresponding to the view', () => {
      const expected = {
        age: 40,
        height: 180,
        weight: 80,
        name: 'Arthur Dent',
        scores: [5, 4, 9, 3, 1],
        friends: ['Ford', 'Zaphod', 'Marvin'],
        house: false,
        car: { color: 0, model: 0 },
        pets: [
          { age: 1, name: 'a' },
          { age: 3, name: 'b' },
          { age: 6, name: 'c' },
        ],
      };
      const person = Person.from(expected);
      expect(person.toJSON()).toEqual(expected);
    });
  });

  describe('from', () => {
    it('creates a new object view with default values', () => {
      const person = Person.from({});
      expect(person.toJSON()).toEqual(defaultPersonData);
    });

    it('creates a new object view with the given data', () => {
      const expected = {
        ...defaultPersonData,
        name: 'Zaphod',
        age: 30,
      };
      const person = Person.from(expected);
      expect(person.toJSON()).toEqual(expected);
    });

    it('fills an existing object view with properties of a given object', () => {
      const person = Person.from({});
      Person.from({ age: 100 }, person);
      expect(person.toJSON()).toEqual({
        age: 100,
        height: 0,
        weight: 0,
        name: '',
        scores: [0, 0, 0, 0, 0],
        friends: ['', '', ''],
        house: false,
        car: { color: 0, model: 0 },
        pets: [
          { age: 0, name: '' },
          { age: 0, name: '' },
          { age: 0, name: '' },
        ],
      });
    });
  });

  describe('getLength', () => {
    it('returns the byte length of an object view', () => {
      expect(Person.getLength()).toBe(121);
      expect(House.getLength()).toBe(152);
    });
  });
});
