import { VectorView } from "../vector-view.ts";
import { StringView } from "../string-view.ts";
import { ContainerView, ViewConstructor } from "../view-types.ts";
import { assertEquals } from "../dev_deps.ts";

const { test } = Deno;
const StringVector: ViewConstructor<
  Array<string | undefined>,
  ContainerView<string | undefined>
> = class extends VectorView<string | undefined> {
  static View = StringView;
  static maxView = new DataView(new ArrayBuffer(1024));
};

const NestedVector: ViewConstructor<
  Array<Array<string | undefined> | undefined>
> = class extends VectorView<Array<string | undefined>> {
  static View = StringVector;
  static maxView = new DataView(new ArrayBuffer(1024));
};

test("[VectorView.from] creates a vector view from a given value", () => {
  const expected = ["a", "b", undefined, "cd"];
  assertEquals(StringVector.from(expected).toJSON(), expected);
});

test("[VectorView.from] supports nested vectors", () => {
  const expected = [
    ["a", "b", undefined, "cd"],
    ["e", "f"],
  ];
  assertEquals(NestedVector.from(expected).toJSON(), expected);
});

test("[VectorView.getLength] returns the byte length required to hold the vector", () => {
  assertEquals(StringVector.getLength([]), 8);
  assertEquals(StringVector.getLength(["abc", "a"]), 20);
  assertEquals(StringVector.getLength(["a", undefined, "abc"]), 24);
});

test("[VectorView#at] returns a value at a given index", () => {
  const expected = ["a", "b", undefined, "cd"];
  assertEquals(StringVector.from(expected).at(0), expected[0]);
  assertEquals(StringVector.from(expected).at(1), expected[1]);
  assertEquals(StringVector.from(expected).at(-1), expected[3]);
  assertEquals(StringVector.from(expected).at(-3), expected[1]);
  assertEquals(StringVector.from(expected).at(-4), expected[0]);
});

test("[VectorView#get] returns a value at a given index", () => {
  const expected = ["a", "b", undefined, "cd"];
  assertEquals(StringVector.from(expected).get(0), expected[0]);
});

test("[VectorView#get] returns undefined for absent index", () => {
  const expected = ["a", "b", undefined, "cd"];
  const vector = StringVector.from(expected);
  assertEquals(vector.get(2), undefined);
  assertEquals(vector.get(10), undefined);
});

test("[VectorView#getView] returns a view at a given index", () => {
  const vector = StringVector.from(["a", "b", undefined, "cd"]);
  const actual = vector.getView(3)! as StringView;
  assertEquals(actual instanceof StringView, true);
  assertEquals(actual.byteOffset, 26);
  assertEquals(actual.byteLength, 2);
});

test("[VectorView#getView] returns undefined for absent index", () => {
  assertEquals(
    StringVector.from(["a", "b", undefined, "cd"]).getView(2),
    undefined,
  );
});

test("[VectorView#set] sets a value at a given index", () => {
  const vector = StringVector.from(["a", "b", undefined, "cd"]);
  const expected = "xy";
  vector.set(3, expected);
  assertEquals(vector.get(3), expected);
});

test("[VectorView#set] trims value if it exceeds the field limit", () => {
  const vector = StringVector.from(["a", "b", undefined, "cd"]);
  vector.set(1, "abcdef");
  assertEquals(vector.toJSON(), ["a", "a", undefined, "cd"]);
});

test("[VectorView#set] handles trimming in nested vectors", () => {
  const vector = NestedVector.from([
    ["a", "b", "c"],
    ["d", "e"],
  ]);
  vector.set(0, ["cde", "f", "g"]);
  assertEquals(vector.getView(0)!.get(1), undefined);
  assertEquals(vector.getView(0)!.get(2), undefined);
  assertEquals(vector.toJSON(), [
    ["cde", undefined, undefined],
    ["d", "e"],
  ]);
});

test("[VectorView#set] does not set nested vector if it's minimal length exceeds the available space", () => {
  const vector = NestedVector.from([
    ["a", "b", "c"],
    ["d", "e"],
  ]);
  vector.set(0, ["cde", "f", "g", "h"]);
  assertEquals(vector.toJSON(), [
    ["a", "b", "c"],
    ["d", "e"],
  ]);
});

test("[VectorView#set] does not set value to absent item", () => {
  const vector = StringVector.from(["a", "b", undefined, "cd"]);
  vector.set(2, "xy");
  assertEquals(vector.get(2), undefined);
});

test("[VectorView#setView] sets a view at a given index", () => {
  const vector = StringVector.from(["a", "b", undefined, "cd"]);
  vector.setView(0, StringView.from("x"));
  assertEquals(vector.get(0), "x");
});
test("[VectorView#setView] does not set view on absent index", () => {
  const vector = StringVector.from(["a", "b", undefined, "cd"]);
  vector.setView(2, StringView.from("x"));
  assertEquals(vector.get(2), undefined);
});

test("[VectorView#size] returns the amount of values in the vector", () => {
  assertEquals(StringVector.from(["a", "b", undefined, "cd"]).size, 4);
});

test("[VectorView#toJSON] returns an array of values in the vector", () => {
  const expected = ["a", "b", undefined, "cd"];
  assertEquals(StringVector.from(expected).toJSON(), expected);
});

test("[VectorView#[Symbol.iterator]] iterates over elements of the vector", () => {
  const vector = StringVector.from(["a", "b", undefined, "cd"]);
  const array = [...vector] as Array<StringView | undefined>;
  assertEquals(array[0] instanceof StringView, true);
  assertEquals(array.length, 4);
});

test("[VectorView#getLength] returns the byte length of a field", () => {
  const vector = StringVector.from(["a", "b", undefined, "cd"]);
  assertEquals(vector.getLength(0), 1);
  assertEquals(vector.getLength(3), 2);
  assertEquals(vector.getLength(2), 0);
});
