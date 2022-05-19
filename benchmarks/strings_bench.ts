import { getIndex } from "./helpers.ts";
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

Deno.bench({
  name: "[String Search] Native",
  group: "String Search",
  fn() {
    const string = strings[getIndex(arrayLength)];
    const match = matches[getIndex(arrayLength)];
    string.indexOf(match);
  },
});

Deno.bench({
  name: "[String Search] StringView",
  group: "String Search",
  baseline: true,
  fn() {
    const view = views[getIndex(arrayLength)];
    const match = viewMatches[getIndex(arrayLength)];
    view.indexOf(match);
  },
});

Deno.bench({
  name: "[String Replace] Native",
  group: "String Replace",
  fn() {
    let string = strings[getIndex(arrayLength)];
    const replacement = matches[getIndex(arrayLength)];
    for (let i = 0; i < 10; i++) {
      const match = matches[getIndex(arrayLength)];
      string = string.replace(new RegExp(match), replacement);
    }
  },
});

Deno.bench({
  name: "[String Replace] StringView",
  group: "String Replace",
  baseline: true,
  fn() {
    const view = views[getIndex(arrayLength)];
    const replacement = viewMatches[getIndex(arrayLength)];
    for (let i = 0; i < 10; i++) {
      const match = viewMatches[getIndex(arrayLength)];
      view.replace(match, replacement);
    }
  },
});

Deno.bench({
  name: "[String Reverse] Native",
  group: "String Reverse",
  fn() {
    const string = strings[getIndex(arrayLength)];
    string.split("").reverse().join("");
  },
});

Deno.bench({
  name: "[String Reverse] StringView",
  group: "String Reverse",
  baseline: true,
  fn() {
    const view = views[getIndex(arrayLength)];
    view.reverse();
  },
});

Deno.bench({
  name: "[String Reverse] StringView to String",
  group: "String Reverse",
  fn() {
    const string = strings[getIndex(arrayLength)];
    StringView.from(string).toString();
  },
});

Deno.bench({
  name: "[Get String Size] TextEncoder",
  group: "Get String Size",
  fn() {
    const string = strings[getIndex(arrayLength)];
    StringView.encoder.encode(string).length;
  },
});

Deno.bench({
  name: "[Get String Size] StringView",
  group: "Get String Size",
  baseline: true,
  fn() {
    const string = strings[getIndex(arrayLength)];
    StringView.getLength(string);
  },
});

Deno.bench({
  name: "[String Encode] StringView",
  group: "String Encode",
  baseline: true,
  fn() {
    const string = strings[getIndex(arrayLength)];
    StringView.from(string);
  },
});

Deno.bench({
  name: "[String Encode] TextEncoder",
  group: "String Encode",
  baseline: true,
  fn() {
    const string = strings[getIndex(arrayLength)];
    StringView.encoder.encode(string);
  },
});

Deno.bench({
  name: "[String Decode] StringView",
  group: "String Decode",
  fn() {
    const view = views[getIndex(arrayLength)];
    view.toString();
  },
});

Deno.bench({
  name: "[String Decode] TextDecoder",
  group: "String Decode",
  fn() {
    const view = views[getIndex(arrayLength)];
    StringView.decoder.decode(view);
  },
});
