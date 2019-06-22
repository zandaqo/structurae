const Benchmark = require('benchmark');
const GridMixin = require('../lib/grid');

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

const rows = 1500;
const columns = 32;
const nestedArrays = new Array(rows).fill(0).map(
  () => new Float64Array(columns).map(() => Math.random()),
);

const FloatGrid = GridMixin(Float64Array);
const grid = new FloatGrid({ rows, columns },
  new Float64Array(rows * columns).map(() => Math.random()));

const suits = [
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
    }),

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
    }),
];


if (require.main === module) {
  suits.forEach(suite => suite.run());
}

module.exports = {
  suits,
};
