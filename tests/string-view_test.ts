import { StringView } from "../string-view.ts";
import { assertEquals } from "../dev_deps.ts";

const { test } = Deno;
const Encoder = new TextEncoder();
const randomString = "qwertyasфы←😀ячсм";

test("[StringView.decode] decodes encoded string", () => {
  const view = new StringView(Encoder.encode(randomString).buffer);
  assertEquals(StringView.decode(view), randomString);
  assertEquals(StringView.decode(view, 1, 3), "wer");
  assertEquals(StringView.decode(view, 2, 6), "ertyas");
  assertEquals(StringView.decode(view, 6, 21), "asфы←😀ячсм");
});

test("[StringView.decode] decodes long encoded strings with TextDecoder", () => {
  const string = randomString.repeat(15);
  const view = new StringView(Encoder.encode(string).buffer);
  assertEquals(StringView.decode(view), string);
  assertEquals(StringView.decode(view, 6, 399), string.slice(6));
});

test("[StringView.encode] encodes a string", () => {
  const view = new StringView(new ArrayBuffer(30));
  const written = StringView.encode(randomString, view);
  assertEquals(StringView.decode(view, 0, written), randomString);
});

test("[StringView#size] returns the amount UTF characters in the view", () => {
  assertEquals(StringView.from("asdf").size, 4);
  assertEquals(StringView.from("фыва").size, 4);
  assertEquals(StringView.from("😀😀fooа😀←").size, 8);
});

test("[StringView.from] creates a StringView from a string", () => {
  const stringView = StringView.from("foo");
  assertEquals(stringView instanceof StringView, true);
  assertEquals(stringView.byteLength, 3);
  assertEquals(stringView.toString(), "foo");
});

test("[StringView.getLength] returns the size in bytes of a given string", () => {
  assertEquals(StringView.getLength("asdf"), 4);
  assertEquals(StringView.getLength("фыва"), 8);
  assertEquals(StringView.getLength("😀😀fooа😀←"), 20);
});

test("[StringView.encode] encodes a string into a limited size buffer", () => {
  const view = new StringView(new ArrayBuffer(30));
  const written = StringView.encode(randomString, view, 0, 8);
  assertEquals(StringView.decode(view, 0, written), "qwertyas");
});

test("[StringView.encode] encodes long strings with TextEncoder", () => {
  const string = randomString.repeat(15);
  const view = new StringView(new ArrayBuffer(405));
  const written = StringView.encode(string, view);
  assertEquals(StringView.decode(view, 0, written), string);
});

test("[StringView.encode] encodes a long string into smaller buffer using TextEncoder", () => {
  const string = randomString.repeat(15);
  const view = new StringView(new ArrayBuffer(216));
  const written = StringView.encode(string, view, 0, 216);
  assertEquals(StringView.decode(view, 0, written), randomString.repeat(8));
});

test("[StringView#character] iterates over the characters in the StringView", () => {
  const stringView = StringView.from("asфы←😀");
  const chars = [];
  for (const character of stringView.characters()) {
    chars.push(character);
  }
  assertEquals(chars, ["a", "s", "ф", "ы", "←", "😀"]);
});

test("[StringView#charAt] returns a new string consisting of the single UTF character", () => {
  const stringView = StringView.from("asфы←😀");
  const chars = [];
  for (let i = 0; i < stringView.size; i++) {
    chars[i] = stringView.charAt(i);
  }
  assertEquals(chars, ["a", "s", "ф", "ы", "←", "😀"]);
});

test("[StringView#charAt] returns an empty string if the character is not found", () => {
  const invalidString = StringView.from("");
  assertEquals(invalidString.charAt(), "");
  assertEquals(invalidString.charAt(1), "");
  assertEquals(invalidString.charAt(10), "");
});

test("[StringView#replace] replaces a pattern with a replacement", () => {
  const stringView = StringView.from("Vimessaid");
  stringView
    .replace(Encoder.encode("s"), Encoder.encode("x"))
    .replace(Encoder.encode("d"), Encoder.encode("y"));
  assertEquals(stringView.toString(), "Vimexxaiy");
});

test("[StringView#reverse] reverses the characters of the StringView in-place", () => {
  const stringView = StringView.from("fooа😀←");
  assertEquals(stringView.reverse().toString(), "←😀аoof");
});

test("[StringView#search] returns the index of the first occurrence of the specified value", () => {
  const stringView = StringView.from("Vimesi");
  assertEquals(stringView.search(Encoder.encode("im")), 1);
  assertEquals(stringView.search(Encoder.encode("Vi")), 0);
  assertEquals(stringView.search(Encoder.encode("Vimes")), 0);
  assertEquals(stringView.search(Encoder.encode("x")), -1);
  assertEquals(stringView.search(Encoder.encode("Vix")), -1);
  assertEquals(stringView.search(Encoder.encode("s")), 4);
  assertEquals(stringView.search(Encoder.encode("i")), 1);
  assertEquals(stringView.search(Encoder.encode("i"), 2), 5);

  const array = new Uint8Array(
    new Array(300).fill(0).map(() => (Math.random() * 128) | 0),
  );
  const longString = new StringView(array.buffer);
  longString.setUint8(0, 97);
  assertEquals(longString.byteLength, 300);
  assertEquals(longString.search(Encoder.encode("ё")), -1);
  assertEquals(longString.search(Encoder.encode("a")), 0);
});

test("[StringView#substring] returns a new string containing the specified part of the given string", () => {
  const stringView = StringView.from(randomString);
  assertEquals(stringView.substring(0, 6), "qwerty");
  assertEquals(stringView.substring(6, 11), "asфы←");
  assertEquals(stringView.substring(6, 10), "asфы");
  assertEquals(stringView.substring(6, 13), "asфы←😀я");
  assertEquals(stringView.substring(10, 12), "←😀");
});

test("[StringView#substring] returns an empty string if characters are not found", () => {
  const invalidString = new StringView(
    new Uint8Array([128, 155, 134]).buffer,
  );
  assertEquals(invalidString.substring(), "");
});

test("[StringView#toString] returns a string representation of the StringView", () => {
  const stringView = StringView.from("foo");
  assertEquals(stringView.toString(), "foo");
});

test("[StringView#toJSON] returns a string representation of the StringView", () => {
  const stringView = StringView.from("foo");
  assertEquals(JSON.stringify(stringView), '"foo"');
});

test("[StringView#trim] returns a StringView without trailing zeros", () => {
  const stringView = StringView.from("foo");
  assertEquals(stringView.trim().byteLength, 3);
});
