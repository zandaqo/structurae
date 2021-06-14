import {
  bench,
  runBenchmarks,
} from "https://deno.land/std@0.95.0/testing/bench.ts";
import { GridMixin } from "../grid.ts";
import { benchmarkReporter, getIndex } from "./helpers.ts";

const rows = 1500;
const columns = 32;
const nestedArrays = new Array(rows).fill(0).map(
  () => new Float64Array(columns).map(() => Math.random()),
);

const FloatGrid = GridMixin(Float64Array);
const grid = new FloatGrid(
  new Float64Array(rows * columns).map(() => Math.random()),
);
grid.columns = columns;

bench({
  name: "[Grid Get/Set] Nested Arrays",
  runs: 10000,
  func(b): void {
    b.start();
    const x = getIndex(rows);
    const y = getIndex(columns);
    nestedArrays[x][y] = nestedArrays[y >> 1][x >> 1];
    b.stop();
  },
});

bench({
  name: "[Grid Get/Set] Grid",
  runs: 10000,
  func(b): void {
    b.start();
    const x = getIndex(rows);
    const y = getIndex(columns);
    grid.setValue(x, y, grid.getValue(y >> 1, x >> 1));
    b.stop();
  },
});

bench({
  name: "[Grid Iterate] Nested Arrays",
  runs: 10000,
  func(b): void {
    b.start();
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        nestedArrays[i][j] += 1;
      }
    }
    b.stop();
  },
});

bench({
  name: "[Grid Iterate] Grid",
  runs: 10000,
  func(b): void {
    b.start();
    for (let i = 0; i < (rows * columns); i++) {
      grid[i] += 1;
    }
    b.stop();
  },
});

if (import.meta.main) {
  runBenchmarks().then(benchmarkReporter).catch((e) => {
    console.log(e);
  });
}
