const Benchmark = require('benchmark');
const SortedArray = require('../lib/sorted-array');
const BinaryHeap = require('../lib/binary-heap');

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

const getIndex = (size) => (Math.random() * size) | 0;

const suits = [
  new Benchmark.Suite('Sorted Push One:', benchmarkOptions)
    .add('Heap', () => {
      const heap = new BinaryHeap();
      for (let i = 0; i < 100; i++) {
        heap.push(getIndex(100));
      }
    })
    .add('SortedArray', () => {
      const array = new SortedArray();
      for (let i = 0; i < 100; i++) {
        array.push(getIndex(100));
      }
    })
    .add('Native', () => {
      const array = [];
      for (let i = 0; i < 100; i++) {
        array.push(getIndex(100));
        array.sort();
      }
    }),
  new Benchmark.Suite('Sorted Push Many:', benchmarkOptions)
    .add('Heap', () => {
      const heap = new BinaryHeap();
      for (let i = 0; i < 100; i++) {
        const random = getIndex(100);
        heap.push(random, random >> 1, random << 1, random - 3, random + 1);
      }
    })
    .add('SortedArray', () => {
      const array = new SortedArray();
      for (let i = 0; i < 100; i++) {
        const random = getIndex(100);
        array.push(random, random >> 1, random << 1, random - 3, random + 1);
      }
    })
    .add('Native', () => {
      const array = [];
      for (let i = 0; i < 100; i++) {
        const random = getIndex(100);
        array.push(random, random >> 1, random << 1, random - 3, random + 1);
        array.sort();
      }
    }),
];

if (require.main === module) {
  suits.forEach((suite) => suite.run());
}

module.exports = {
  suits,
};
