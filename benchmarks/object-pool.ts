import {
  bench,
  runBenchmarks,
} from "https://deno.land/std@0.95.0/testing/bench.ts";
import { Pool } from "../src/pool.ts";
import { benchmarkReporter, getIndex } from "./helpers.ts";

const SIZE = 1000 * 16;
class NaivePool {
  register: Uint8Array;
  nextAvailable: number;

  constructor(size: number) {
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

  release(index: number) {
    this.register[index] = 0;
    this.nextAvailable = index;
  }
}
const naivePool = new NaivePool(SIZE);
const pool = new Pool(SIZE);
naivePool.register.fill(1);
pool.fill(0);
const SAMPLES = 800;

bench({
  name: "[Object Pool] Native Pool",
  runs: 1000,
  func(b): void {
    b.start();
    for (let i = 0; i < SAMPLES; i++) {
      naivePool.release(getIndex(SIZE));
    }
    for (let i = 0; i < SAMPLES; i++) {
      naivePool.acquire();
    }
    b.stop();
  },
});

bench({
  name: "[Object Pool] Pool",
  runs: 1000,
  func(b): void {
    b.start();
    for (let i = 0; i < SAMPLES; i++) {
      pool.free(getIndex(SIZE));
    }
    for (let i = 0; i < SAMPLES; i++) {
      pool.get();
    }
    b.stop();
  },
});

if (import.meta.main) {
  runBenchmarks().then(benchmarkReporter).catch((e) => {
    console.log(e);
  });
}
