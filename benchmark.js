/* eslint no-unused-vars: 0 */
/* eslint import/no-extraneous-dependencies: 0 */
/* eslint no-console: 0 */

const Benchmark = require('benchmark');
const Grid = require('./lib/grid');
const PackedInt = require('./lib/packed-int');

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

  const FloatGrid = Grid(Float64Array);
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
      for (let i = 0; i < grid.length; i++) {
        grid[i] += 1;
      }
    })
    .run();
}

{
  class Person extends PackedInt {}
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
      if (matcher[i]) {
        if (matcher[i] !== a[i]) return false;
      }
    }
    return true;
  };
  const matcher = [0, 2, 3];
  const packedMatcher = Person.getMatcher({ 1: 0, 2: 2, 3: 3 });

  const peopleArray = new Array(1000).fill(0).map(() => createPersonArray());
  const packedPeopleArray = peopleArray.map(i => new Person(i).value);

  new Benchmark.Suite('PackedInt Match:', benchmarkOptions)
    .add('Native', () => {
      peopleArray.filter(i => matchArrays(i, matcher));
    })
    .add('PackedInt', () => {
      packedPeopleArray.filter(i => Person.match(i, packedMatcher));
    })
    .run();
}
