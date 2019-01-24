/* eslint no-unused-vars: 0 */
/* eslint import/no-extraneous-dependencies: 0 */
/* eslint no-console: 0 */

const Benchmark = require('benchmark');
const GridMixin = require('./lib/grid');
const BitField = require('./lib/bit-field');
const RecordArray = require('./lib/record-array');
const Pool = require('./lib/pool');

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

{
  const rows = 1500;
  const columns = 32;
  const nestedArrays = new Array(rows).fill(0).map(
    () => new Float64Array(columns).map(() => Math.random()),
  );

  const FloatGrid = GridMixin(Float64Array);
  const grid = new FloatGrid({ rows, columns },
    new Float64Array(rows * columns).map(() => Math.random()));

  new Benchmark.Suite('Grid Get/Set:', benchmarkOptions)
    .add('Nested arrays', () => {
      const x = (Math.random() * rows) | 0;
      const y = (Math.random() * columns) | 0;
      nestedArrays[x][y] = nestedArrays[y >> 1][x >> 1];
    })
    .add('Grid', () => {
      const x = (Math.random() * rows) | 0;
      const y = (Math.random() * columns) | 0;
      grid.set(x, y, grid.get(y >> 1, x >> 1));
    })
    .run();

  new Benchmark.Suite('Grid Iterate:', benchmarkOptions)
    .add('Nested arrays', () => {
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
          nestedArrays[i][j] += 1;
        }
      }
    })
    .add('Grid', () => {
      for (let i = 0; i < (rows * columns); i++) {
        grid[i] += 1;
      }
    })
    .run();
}

{
  class Person extends BitField {}
  Person.fields = [
    { name: 1, size: 4 },
    { name: 2, size: 4 },
    { name: 3, size: 4 },
    { name: 4, size: 4 },
    { name: 5, size: 4 },
    { name: 6, size: 4 },
    { name: 7, size: 4 },
    { name: 8, size: 3 },
  ];
  Person.initialize();
  const getRandomInt = size => (Math.random() * size) | 0;
  const createPersonArray = () => [
    getRandomInt(16), getRandomInt(16), getRandomInt(16), getRandomInt(16),
    getRandomInt(16), getRandomInt(16), getRandomInt(16), getRandomInt(8),
  ];

  const matchArrays = (a, matcher) => {
    for (let i = 0; i < matcher.length; i++) {
      if (matcher[i] && (matcher[i] !== a[i])) return false;
    }
    return true;
  };
  const matcher = [0, 2, 3, 4, 5, 6];
  const packedMatcher = Person.getMatcher({
    2: 2, 3: 3, 5: 5, 6: 6,
  });

  const peopleArray = new Array(1000).fill(0).map(() => createPersonArray());
  const packedPeopleArray = peopleArray.map(i => new Person(i).value);

  new Benchmark.Suite('BitField Match:', benchmarkOptions)
    .add('Native', () => {
      peopleArray.filter(i => matchArrays(i, matcher));
    })
    .add('BitField', () => {
      packedPeopleArray.filter(i => Person.match(i, packedMatcher));
    })
    .run();
}

{
  const SIZE = 100;
  const structs = new RecordArray([
    { name: 0, type: 'Float64' },
    { name: 1, type: 'Float64' },
    { name: 2, type: 'Int32' },
    { name: 3, type: 'Float64' },
    { name: 4, type: 'Int8' },
    { name: 5, type: 'Float64' },
    { name: 6, type: 'Float64' },
    { name: 7, type: 'Float64' },
  ], SIZE);

  const getObject = () => ({
    1: Math.random(),
    2: Math.random(),
    3: Math.random(),
    4: Math.random(),
    5: Math.random(),
    6: Math.random(),
    7: Math.random(),
    8: Math.random(),
  });

  const getIndex = size => (Math.random() * size) | 0;
  const objects = new Array(SIZE).fill(1).map(() => getObject());
  for (let i = 0; i < SIZE; i++) {
    structs.set(i, 0, objects[i][1]);
    structs.set(i, 1, objects[i][2]);
    structs.set(i, 2, objects[i][3]);
    structs.set(i, 3, objects[i][4]);
    structs.set(i, 4, objects[i][5]);
    structs.set(i, 5, objects[i][6]);
    structs.set(i, 6, objects[i][7]);
    structs.set(i, 7, objects[i][8]);
  }

  new Benchmark.Suite('RecordArray Get/Set:', benchmarkOptions)
    .add('Objects', () => {
      objects[getIndex(SIZE)][getIndex(8)] = objects[getIndex(SIZE)][getIndex(8)];
    })
    .add('RecordArray', () => {
      structs.set(
        getIndex(SIZE),
        getIndex(8),
        structs.get(getIndex(SIZE), getIndex(8)),
      );
    })
    .run();
}

{
  const SIZE = 1000 * 16;
  class NaivePool {
    constructor(size) {
      this.register = new Uint8Array(size).fill(0);
      this.nextAvailable = 0;
    }

    acquire() {
      const { nextAvailable, register } = this;
      if (!~nextAvailable) return -1;
      const empty = register[nextAvailable];
      register[nextAvailable] = 1;
      this.nextAvailable = register.indexOf(0);
      return empty;
    }

    release(index) {
      this.register[index] = 0;
      this.nextAvailable = index;
    }
  }
  const getIndex = size => (Math.random() * size) | 0;

  const naivePool = new NaivePool(SIZE);
  const pool = new Pool(SIZE);

  naivePool.register.fill(1);
  pool.fill(0);

  const SAMPLES = 800;
  new Benchmark.Suite('Pool:', benchmarkOptions)
    .add('Naive', () => {
      for (let i = 0; i < SAMPLES; i++) {
        naivePool.release(getIndex(SIZE));
      }
      for (let i = 0; i < SAMPLES; i++) {
        naivePool.acquire();
      }
    })
    .add('Pool', () => {
      for (let i = 0; i < SAMPLES; i++) {
        pool.release(getIndex(SIZE));
      }
      for (let i = 0; i < SAMPLES; i++) {
        pool.acquire();
      }
    })
    .run();
}
