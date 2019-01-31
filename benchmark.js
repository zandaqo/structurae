/* eslint no-unused-vars: 0 */
/* eslint import/no-extraneous-dependencies: 0 */
/* eslint no-console: 0 */

const Benchmark = require('benchmark');
const GridMixin = require('./lib/grid');
const BitField = require('./lib/bit-field');
const RecordArray = require('./lib/record-array');
const Pool = require('./lib/pool');
const StringView = require('./lib/string-view');

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

const getIndex = size => (Math.random() * size) | 0;

function getString(size) {
  const text = new Array(size);
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789йцукенгшщзхъфывапролджэячсмитьбю.'.split('');
  possible.push('😀', '←');
  for (let i = 0; i < size; i++) {
    text[i] = possible[getIndex(possible.length)];
  }
  return text.join('');
}

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
      const x = getIndex(rows);
      const y = getIndex(columns);
      nestedArrays[x][y] = nestedArrays[y >> 1][x >> 1];
    })
    .add('Grid', () => {
      const x = getIndex(rows);
      const y = getIndex(columns);
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
  const createPersonArray = () => [
    getIndex(16), getIndex(16), getIndex(16), getIndex(16),
    getIndex(16), getIndex(16), getIndex(16), getIndex(8),
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
        pool.free(getIndex(SIZE));
      }
      for (let i = 0; i < SAMPLES; i++) {
        pool.get();
      }
    })
    .run();
}

{
  const Encoder = new TextEncoder();

  const matchLength = 3;
  const stringLength = 100;
  const arrayLength = 100;

  const strings = new Array(arrayLength).fill(0).map(() => getString(stringLength));
  const matches = new Array(arrayLength).fill(0).map(() => getString(matchLength));
  const views = strings.map(s => StringView.fromString(s));
  const viewMatches = matches.map(s => StringView.fromString(s));

  new Benchmark.Suite('StringView Search:', benchmarkOptions)
    .add('Native', () => {
      const string = strings[getIndex(arrayLength)];
      const match = matches[getIndex(arrayLength)];
      const index = string.indexOf(match);
    })
    .add('StringView Array', () => {
      const view = views[getIndex(arrayLength)];
      const match = viewMatches[getIndex(arrayLength)];
      const index = view.search(match);
    })
    .run();

  new Benchmark.Suite('StringView Replace:', benchmarkOptions)
    .add('Native', () => {
      let string = strings[getIndex(arrayLength)];
      const replacement = strings[getIndex(arrayLength)].slice(0, matchLength);
      for (let i = 0; i < 10; i++) {
        const match = matches[getIndex(arrayLength)];
        string = string.replace(new RegExp(match), replacement);
      }
    })
    .add('StringView', () => {
      const view = views[getIndex(arrayLength)];
      const replacement = views[getIndex(arrayLength)].subarray(0, matchLength);
      for (let i = 0; i < 10; i++) {
        const match = viewMatches[getIndex(arrayLength)];
        view.replace(match, replacement);
      }
    })
    .run();

  new Benchmark.Suite('StringView Reverse:', benchmarkOptions)
    .add('Native', () => {
      const string = strings[getIndex(arrayLength)];
      const reversed = string.split('').reverse().join('');
    })
    .add('StringView', () => {
      const view = views[getIndex(arrayLength)];
      view.reverse();
    })
    .add('StringView String', () => {
      const string = strings[getIndex(arrayLength)];
      const reversed = StringView.fromString(string).toString();
    })
    .run();

  new Benchmark.Suite('StringView Size:', benchmarkOptions)
    .add('TextEncoder', () => {
      const string = strings[getIndex(arrayLength)];
      const size = Encoder.encode(string).length;
    })
    .add('StringView', () => {
      const string = strings[getIndex(arrayLength)];
      const size = StringView.getByteSize(string);
    })
    .run();
}
