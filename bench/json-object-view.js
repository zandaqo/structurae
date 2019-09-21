const zlib = require('zlib');
const Benchmark = require('benchmark');
const jsf = require('json-schema-faker');
const { ObjectViewMixin, ArrayViewMixin, StringView } = require('../index');

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

const getIndex = (size) => (Math.random() * size) | 0;

const Toy = ObjectViewMixin({
  id: { type: 'uint32' },
  name: { type: 'string', length: 10 },
});

const Pet = ObjectViewMixin({
  type: { type: 'uint8' },
  id: { type: 'uint32' },
  name: { type: 'string', length: 20 },
  toys: { type: Toy, size: 10 },
});

const House = ObjectViewMixin({
  type: { type: 'uint8' },
  id: { type: 'uint32' },
  size: { type: 'float64' },
});

const Person = ObjectViewMixin({
  type: { type: 'uint8' },
  id: { type: 'uint32' },
  name: { type: 'string', length: 50 },
  weight: { type: 'float64' },
  height: { type: 'float64' },
  pets: { type: Pet, size: 3 },
  scores: { type: 'uint8', size: 50 },
  house: { type: House },
  parents: { type: 'string', size: 2, length: 10 },
});

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
    parents: {
      type: 'array',
      items: [
        { type: 'string', minLength: 5, maxLength: 10 },
        { type: 'string', minLength: 5, maxLength: 10 },
      ],
    },
  },
  required: ['type', 'id', 'name', 'weight', 'height', 'scores', 'pets', 'house', 'parents'],
};

const objects = [];

for (let i = 0; i < 100; i++) {
  objects.push(jsf.generate(JSONSchema));
}

const people = People.from(objects);
const views = [...people];
const strings = objects.map((i) => JSON.stringify(i));

const binarySize = people.byteLength;
const binaryCompressedSize = zlib.deflateSync(people, { level: 1 }).byteLength;
const stringSize = StringView.getByteSize(JSON.stringify(objects));
const stringCompressedSize = zlib.deflateSync(JSON.stringify(objects), { level: 1 }).byteLength;
console.log(`Sizes:
 Binary: ${binarySize}
 String: ${stringSize} (${Math.round((stringSize / binarySize) * 100)}%)
 Binary Compressed: ${binaryCompressedSize}
 String Compressed: ${stringCompressedSize} (${Math.round((stringCompressedSize / binaryCompressedSize) * 100)}%)`);

const suits = [
  new Benchmark.Suite('Get Value:', benchmarkOptions)
    .add('ObjectView', () => {
      const view = views[getIndex(100)];
      return view.getValue('type') + view.getValue('weight') + view.getValue('height');
    })
    .add('JSON', () => {
      const string = strings[getIndex(100)];
      const object = JSON.parse(string);
      return object.house + object.weight + object.height;
    }),
  new Benchmark.Suite('Set Value:', benchmarkOptions)
    .add('ObjectView', () => {
      const view = views[getIndex(100)];
      view.set('type', 20);
      view.set('weight', 20);
      view.set('height', 20);
    })
    .add('JSON', () => {
      const string = strings[getIndex(100)];
      const object = JSON.parse(string);
      object.type = 20;
      object.weight = 20;
      object.height = 20;
    }),
  new Benchmark.Suite('Serialize:', benchmarkOptions)
    .add('ObjectView', () => {
      const object = objects[getIndex(100)];
      Person.from(object);
    })
    .add('JSON', () => {
      const object = objects[getIndex(100)];
      JSON.stringify(object);
    }),
  new Benchmark.Suite('Deserialize:', benchmarkOptions)
    .add('ObjectView', () => {
      const view = views[getIndex(100)];
      view.toJSON();
    })
    .add('JSON', () => {
      const string = strings[getIndex(100)];
      JSON.parse(string);
    }),
];

if (require.main === module) {
  suits.forEach((suite) => suite.run());
}

module.exports = {
  suits,
};
