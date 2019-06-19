const Benchmark = require('benchmark');
const jsf = require('json-schema-faker');
const ObjectView = require('../lib/object-view');
const ArrayViewMixin = require('../lib/array-view');

const benchmarkOptions = {
  onStart(event) {
    console.log(event.currentTarget.name);
  },
  onCycle(event) {
    console.log(`   ${String(event.target)}`);
  },
  onComplete(event) {
    console.log(` Fastest is ${event.currentTarget.filter('fastest').map('name')}`);
    console.log('');
  },
};

class Toy extends ObjectView {}
Toy.schema = {
  id: { type: 'uint32' },
  name: { type: 'string', length: 10 },
};

class Pet extends ObjectView {}
Pet.schema = {
  type: { type: 'uint8' },
  id: { type: 'uint32' },
  name: { type: 'string', length: 20 },
  toys: { type: Toy, size: 10 },
};

class House extends ObjectView {}
House.schema = {
  type: { type: 'uint8' },
  id: { type: 'uint32' },
  size: { type: 'float64' },
};

class Person extends ObjectView {}
Person.schema = {
  type: { type: 'uint8' },
  id: { type: 'uint32' },
  name: { type: 'string', length: 50 },
  weight: { type: 'float64' },
  height: { type: 'float64' },
  pets: { type: Pet, size: 3 },
  scores: { type: 'uint8', size: 50 },
  house: { type: House },
};

const People = ArrayViewMixin(Person);

const JSONSchema = {
  type: 'object',
  properties: {
    type: { type: 'integer', minimum: 0, maximum: 255 },
    id: { type: 'integer', minimum: 0 },
    name: { type: 'string', minLength: 3, maxLength: 50 },
    weight: { type: 'number', minimum: 0 },
    height: { type: 'number' },
    scores: {
      type: 'array',
      items: {
        type: 'integer',
        minimum: 0,
        maximum: 255,
      },
      minItems: 50,
      maxItems: 50,
    },
    pets: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          type: { type: 'integer', minimum: 0, maximum: 255 },
          id: { type: 'integer', minimum: 0 },
          name: { type: 'string', minLength: 3, maxLength: 20 },
          toys: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'integer', minimum: 0 },
                name: { type: 'string', minLength: 3, maxLength: 10 },
              },
              required: ['id', 'name'],
            },
            minItems: 10,
            maxItems: 10,
          },
        },
        required: ['type', 'id', 'name', 'toys'],
      },
      minItems: 3,
      maxItems: 3,
    },
    house: {
      type: 'object',
      properties: {
        type: { type: 'integer', minimum: 0, maximum: 255 },
        id: { type: 'integer', minimum: 0 },
        size: { type: 'number', minimum: 0 },
      },
      required: ['type', 'id', 'size'],
    },
  },
  required: ['type', 'id', 'name', 'weight', 'height', 'scores', 'pets', 'house'],
};

const objects = [];

for (let i = 0; i < 100; i++) {
  objects.push(jsf.generate(JSONSchema));
}

new Benchmark.Suite('Serialize/Deserialize:', benchmarkOptions)
  .add('ObjectView', () => {
    const result = People.from(objects).toObject();
  })
  .add('JSON', () => {
    const result = JSON.parse(JSON.stringify(objects));
  })
  .run();
