import { BitFieldMixin } from "../bit-field.ts";
import { getIndex } from "./helpers.ts";

const Person = BitFieldMixin({
  1: 3,
  2: 3,
  3: 3,
  4: 3,
  5: 3,
  6: 3,
  7: 3,
  8: 3,
  9: 3,
  10: 3,
});

const createPersonArray = () => [
  getIndex(8),
  getIndex(8),
  getIndex(8),
  getIndex(8),
  getIndex(8),
  getIndex(8),
  getIndex(8),
  getIndex(8),
  getIndex(8),
  getIndex(8),
];

const matchArrays = (a: number[], matcher: number[]) => {
  for (let i = 0; i < matcher.length; i++) {
    if (matcher[i] && (matcher[i] !== a[i])) return false;
  }
  return true;
};

const peopleArray = new Array(10000).fill(0).map(() => createPersonArray());
const packedPeopleArray = peopleArray.map((i) => new Person(i).value);
const matchers = peopleArray.map((i) =>
  Person.getMatcher({
    1: i[0],
    2: i[1],
    3: i[2],
    4: i[3],
    5: i[4],
    6: i[5],
    7: i[6],
    8: i[7],
    9: i[8],
    10: i[9],
  })
);

Deno.bench("[BitField Match] Native", { group: "BitField Match" }, () => {
  const index = getIndex(9999);
  const matcher = peopleArray[index];
  peopleArray.findIndex((i) => matchArrays(i, matcher));
});

Deno.bench(
  "[BitField Match] BitField",
  { group: "BitField Match", baseline: true },
  () => {
    const index = getIndex(9999);
    const matcher = matchers[index];
    packedPeopleArray.findIndex((i) => Person.match(i, matcher));
  },
);
