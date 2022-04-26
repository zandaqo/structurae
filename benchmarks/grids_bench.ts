import { GridMixin } from "../grid.ts";
import { getIndex } from "./helpers.ts";

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

Deno.bench({
  name: "[Grid Get/Set] Nested Arrays",
  group: "Grid Get/Set",
  fn() {
    const x = getIndex(rows);
    const y = getIndex(columns);
    nestedArrays[x][y] = nestedArrays[y >> 1][x >> 1];
  },
});

Deno.bench({
  name: "[Grid Get/Set] Grid",
  group: "Grid Get/Set",
  baseline: true,
  fn() {
    const x = getIndex(rows);
    const y = getIndex(columns);
    grid.setValue(x, y, grid.getValue(y >> 1, x >> 1));
  },
});

Deno.bench({
  name: "[Grid Iterate] Nested Arrays",
  group: "Grid Iterate",
  fn() {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        nestedArrays[i][j] += 1;
      }
    }
  },
});

Deno.bench({
  name: "[Grid Iterate] Grid",
  group: "Grid Iterate",
  baseline: true,
  fn() {
    for (let i = 0; i < (rows * columns); i++) {
      grid[i] += 1;
    }
  },
});
