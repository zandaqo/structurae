import { bench, runBenchmarks } from "../dev_deps.ts";
import { benchmarkReporter, getIndex } from "./helpers.ts";
import { StringView } from "../string-view.ts";

function getString(size: number) {
  const text = new Array(size);
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789йцукенгшщзхъфывапролджэячсмитьбю."
      .split("");
  possible.push("😀", "←");
  for (let i = 0; i < size; i++) {
    text[i] = possible[getIndex(possible.length)];
  }
  return text.join("");
}

const Encoder = new TextEncoder();

const matchLength = 3;
const stringLength = 100;
const arrayLength = 100;

const strings = new Array(arrayLength).fill(0).map(() =>
  getString(stringLength)
);
const matches = new Array(arrayLength).fill(0).map(() =>
  getString(matchLength)
);
const views = strings.map((s) => StringView.from(s));
const viewMatches = matches.map((s) =>
  new Uint8Array(StringView.from(s).buffer)
);

bench({
  name: "[String Search] Native",
  runs: 10000,
  func(b): void {
    b.start();
    const string = strings[getIndex(arrayLength)];
    const match = matches[getIndex(arrayLength)];
    string.indexOf(match);
    b.stop();
  },
});
bench({
  name: "[String Search] StringView",
  runs: 10000,
  func(b): void {
    b.start();
    const view = views[getIndex(arrayLength)];
    const match = viewMatches[getIndex(arrayLength)];
    view.indexOf(match);
    b.stop();
  },
});
bench({
  name: "[String Replace] Native",
  runs: 10000,
  func(b): void {
    b.start();
    let string = strings[getIndex(arrayLength)];
    const replacement = matches[getIndex(arrayLength)];
    for (let i = 0; i < 10; i++) {
      const match = matches[getIndex(arrayLength)];
      string = string.replace(new RegExp(match), replacement);
    }
    b.stop();
  },
});
bench({
  name: "[String Replace] StringView",
  runs: 10000,
  func(b): void {
    b.start();
    const view = views[getIndex(arrayLength)];
    const replacement = viewMatches[getIndex(arrayLength)];
    for (let i = 0; i < 10; i++) {
      const match = viewMatches[getIndex(arrayLength)];
      view.replace(match, replacement);
    }
    b.stop();
  },
});
bench({
  name: "[String Reverse] Native",
  runs: 10000,
  func(b): void {
    b.start();
    const string = strings[getIndex(arrayLength)];
    string.split("").reverse().join("");
    b.stop();
  },
});
bench({
  name: "[String Reverse] StringView",
  runs: 10000,
  func(b): void {
    b.start();
    const view = views[getIndex(arrayLength)];
    view.reverse();
    b.stop();
  },
});
bench({
  name: "[String Reverse] StringView to String",
  runs: 10000,
  func(b): void {
    b.start();
    const string = strings[getIndex(arrayLength)];
    StringView.from(string).toString();
    b.stop();
  },
});

bench({
  name: "[Get String Size] TextEncoder",
  runs: 10000,
  func(b): void {
    b.start();
    const string = strings[getIndex(arrayLength)];
    Encoder.encode(string).length;
    b.stop();
  },
});
bench({
  name: "[Get String Size] StringView",
  runs: 10000,
  func(b): void {
    b.start();
    const string = strings[getIndex(arrayLength)];
    StringView.getLength(string);
    b.stop();
  },
});
bench({
  name: "[String Serialization] Serialize",
  runs: 10000,
  func(b): void {
    b.start();
    const string = strings[getIndex(arrayLength)];
    StringView.from(string);
    b.stop();
  },
});
bench({
  name: "[String Serialization] Deserialize",
  runs: 10000,
  func(b): void {
    b.start();
    const view = views[getIndex(arrayLength)];
    view.toString();
    b.stop();
  },
});

if (import.meta.main) {
  runBenchmarks().then(benchmarkReporter).catch((e) => {
    console.log(e);
  });
}
