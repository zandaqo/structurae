/* eslint no-unused-vars: 0 */
/* eslint import/no-extraneous-dependencies: 0 */
/* eslint no-console: 0 */

const Benchmark = require('benchmark');
const Grid = require('./lib/grid');

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
