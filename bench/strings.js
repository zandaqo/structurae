const Benchmark = require('benchmark');
const { StringView } = require('../index');

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

function getString(size) {
  const text = new Array(size);
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789йцукенгшщзхъфывапролджэячсмитьбю.'.split('');
  possible.push('😀', '←');
  for (let i = 0; i < size; i++) {
    text[i] = possible[getIndex(possible.length)];
  }
  return text.join('');
}

const Encoder = new TextEncoder();

const matchLength = 3;
const stringLength = 100;
const arrayLength = 100;

const strings = new Array(arrayLength).fill(0).map(() => getString(stringLength));
const matches = new Array(arrayLength).fill(0).map(() => getString(matchLength));
const views = strings.map((s) => StringView.from(s));
const viewMatches = matches.map((s) => StringView.from(s));

const suits = [
  new Benchmark.Suite('StringView Search:', benchmarkOptions)
    .add('Native', () => {
      const string = strings[getIndex(arrayLength)];
      const match = matches[getIndex(arrayLength)];
      return string.indexOf(match);
    })
    .add('StringView', () => {
      const view = views[getIndex(arrayLength)];
      const match = viewMatches[getIndex(arrayLength)];
      return view.search(match);
    }),
  new Benchmark.Suite('StringView Replace:', benchmarkOptions)
    .add('Native', () => {
      let string = strings[getIndex(arrayLength)];
      const replacement = matches[getIndex(arrayLength)];
      for (let i = 0; i < 10; i++) {
        const match = matches[getIndex(arrayLength)];
        string = string.replace(new RegExp(match), replacement);
      }
    })
    .add('StringView', () => {
      const view = views[getIndex(arrayLength)];
      const replacement = viewMatches[getIndex(arrayLength)];
      for (let i = 0; i < 10; i++) {
        const match = viewMatches[getIndex(arrayLength)];
        view.replace(match, replacement);
      }
    }),
  new Benchmark.Suite('StringView Reverse:', benchmarkOptions)
    .add('Native', () => {
      const string = strings[getIndex(arrayLength)];
      return string.split('').reverse().join('');
    })
    .add('StringView', () => {
      const view = views[getIndex(arrayLength)];
      view.reverse();
    })
    .add('StringView String', () => {
      const string = strings[getIndex(arrayLength)];
      return StringView.from(string).toString();
    }),
  new Benchmark.Suite('StringView Size:', benchmarkOptions)
    .add('TextEncoder', () => {
      const string = strings[getIndex(arrayLength)];
      return Encoder.encode(string).length;
    })
    .add('StringView', () => {
      const string = strings[getIndex(arrayLength)];
      return StringView.getByteSize(string);
    }),
];


if (require.main === module) {
  suits.forEach((suite) => suite.run());
}

module.exports = {
  suits,
};
