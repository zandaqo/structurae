import {
  bench,
  runBenchmarks,
} from "https://deno.land/std@0.95.0/testing/bench.ts";
import { BitFieldMixin } from "../src/bit-field.ts";
import { benchmarkReporter, getIndex } from "./helpers.ts";

const Person = BitFieldMixin({
  1: 4,
  2: 4,
  3: 4,
  4: 4,
  5: 4,
  6: 4,
  7: 4,
  8: 3,
});

const createPersonArray = () => [
  getIndex(16),
  getIndex(16),
  getIndex(16),
  getIndex(16),
  getIndex(16),
  getIndex(16),
  getIndex(16),
  getIndex(8),
];
const createPersonMatcher = () => (Person.getMatcher({
  1: getIndex(16),
  2: getIndex(16),
  3: getIndex(16),
  4: getIndex(16),
  5: getIndex(16),
  6: getIndex(16),
  7: getIndex(16),
  8: getIndex(8),
}));

const matchArrays = (a: number[], matcher: number[]) => {
  for (let i = 0; i < matcher.length; i++) {
    if (matcher[i] && (matcher[i] !== a[i])) return false;
  }
  return true;
};

const peopleArray = new Array(10000).fill(0).map(() => createPersonArray());
const packedPeopleArray = peopleArray.map((i) => new Person(i).value);

bench({
  name: "[BitField Match] Native Match",
  runs: 10000,
  func(b): void {
    b.start();
    const matcher = createPersonArray();
    peopleArray.findIndex((i) => matchArrays(i, matcher));
    b.stop();
  },
});

bench({
  name: "[BitField Match] BitField Match",
  runs: 10000,
  func(b): void {
    b.start();
    const matcher = createPersonMatcher();
    packedPeopleArray.findIndex((i) => Person.match(i, matcher));
    b.stop();
  },
});

if (import.meta.main) {
  runBenchmarks().then(benchmarkReporter).catch((e) => {
    console.log(e);
  });
}
