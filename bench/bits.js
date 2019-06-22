const Benchmark = require('benchmark');
const BitField = require('../lib/bit-field');
const Pool = require('../lib/pool');

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

const suits = [
  new Benchmark.Suite('BitField Match:', benchmarkOptions)
    .add('Native', () => {
      peopleArray.filter(i => matchArrays(i, matcher));
    })
    .add('BitField', () => {
      packedPeopleArray.filter(i => Person.match(i, packedMatcher));
    }),
  new Benchmark.Suite('Pool Get/Set:', benchmarkOptions)
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
    }),
];

if (require.main === module) {
  suits.forEach(suite => suite.run());
}

module.exports = {
  suits,
};
