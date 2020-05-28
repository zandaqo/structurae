const zlib = require('zlib');
const Benchmark = require('benchmark');
const jsf = require('json-schema-faker');
const { ObjectViewMixin, ArrayViewMixin, StringView, MapViewMixin } = require('../index');

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

const JSONSchema = {
  type: 'object',
  $id: 'Person',
  properties: {
    type: {
      type: 'integer',
      btype: 'uint8',
      minimum: 0,
      maximum: 255,
    },
    id: { type: 'integer', btype: 'uint32', minimum: 0 },
    name: { type: 'string', minLength: 3, maxLength: 50 },
    weight: { type: 'number', minimum: 0 },
    height: { type: 'number' },
    scores: {
      type: 'array',
      items: {
        type: 'integer',
        btype: 'uint8',
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
        $id: 'Pet',
        properties: {
          type: {
            type: 'integer',
            btype: 'uint8',
            minimum: 0,
            maximum: 255,
          },
          id: { type: 'integer', btype: 'uint32', minimum: 0 },
          name: { type: 'string', minLength: 3, maxLength: 20 },
          toys: {
            type: 'array',
            items: {
              type: 'object',
              $id: 'Toy',
              properties: {
                id: { type: 'integer', btype: 'uint32', minimum: 0 },
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
      $id: 'House',
      properties: {
        type: {
          type: 'integer',
          btype: 'uint8',
          minimum: 0,
          maximum: 255,
        },
        id: { type: 'integer', btype: 'uint32', minimum: 0 },
        size: { type: 'number', minimum: 0 },
      },
      required: ['type', 'id', 'size'],
    },
    parents: {
      type: 'array',
      items: { type: 'string', minLength: 5, maxLength: 10 },
      maxItems: 2,
      minItems: 2,
    },
  },
  required: ['type', 'id', 'name', 'weight', 'height', 'scores', 'pets', 'house', 'parents'],
};

const Person = ObjectViewMixin(JSONSchema);
const PersonMap = MapViewMixin(JSONSchema);
const People = ArrayViewMixin(Person);

const objects = [];

for (let i = 0; i < 100; i++) {
  objects.push(jsf.generate(JSONSchema));
}

const people = People.from(objects);
const views = [...people];
const maps = objects.map((i) => PersonMap.from(i));
const strings = objects.map((i) => JSON.stringify(i));

const binarySize = people.byteLength;
const binaryCompressedSize = zlib.deflateSync(people, { level: 1 }).byteLength;
const stringSize = StringView.getByteSize(JSON.stringify(objects));
const stringCompressedSize = zlib.deflateSync(JSON.stringify(objects), { level: 1 }).byteLength;

console.log(`Encoded Sizes:
 ObjectView: ${binarySize}
 JSON String: ${stringSize} (${Math.round((stringSize / binarySize) * 100)}%)
 ObjectView Compressed: ${binaryCompressedSize} (${Math.round(
  (binaryCompressedSize / binarySize) * 100,
)}%)
 JSON Compressed: ${stringCompressedSize} (${Math.round(
  (stringCompressedSize / binarySize) * 100,
)}%)`);

const suits = [
  new Benchmark.Suite('Get Value:', benchmarkOptions)
    .add('ObjectView', () => {
      const view = views[getIndex(100)];
      return view.get('type') + view.get('weight') + view.get('height');
    })
    .add('MapView', () => {
      const view = maps[getIndex(100)];
      return view.get('type') + view.get('weight') + view.get('height');
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
    .add('MapView', () => {
      const view = maps[getIndex(100)];
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
    .add('MapView', () => {
      const object = objects[getIndex(100)];
      PersonMap.from(object);
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
    .add('MapView', () => {
      const view = maps[getIndex(100)];
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
