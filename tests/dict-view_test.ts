import type { ViewConstructor } from "../view-types.ts";
import { ArrayView } from "../array-view.ts";
import { VectorView } from "../vector-view.ts";
import { Uint32View } from "../numeric-view.ts";
import { StringView } from "../string-view.ts";
import { DictView } from "../dict-view.ts";
import { assertEquals } from "../dev_deps.ts";

const { test } = Deno;

const maxView = new DataView(new ArrayBuffer(1024));

class Uint32ArrayView extends ArrayView<number> {
  static View = Uint32View;
  static itemLength = Uint32View.viewLength;
}

class StringVector extends VectorView<string | undefined> {
  static View = StringView;
  static maxView = maxView;
}

const IntegerDict: ViewConstructor<Record<number, string | undefined>> = class
  extends DictView<Record<number, string | undefined>> {
  static maxView = maxView;
  static KeysView = Uint32ArrayView as typeof ArrayView;
  static ValuesView = StringVector as typeof VectorView;
};

test("[DictView.from] creates a dictionary view from a given object", () => {
  const expected = { 30: "a", 40: "b", 50: "c" };
  const dictView = IntegerDict.from(expected);
  assertEquals(dictView.toJSON(), expected);
});

test("[DictView.getLength] returns the byte length required to hold the dictionary", () => {
  assertEquals(IntegerDict.getLength({ 30: "a", 40: "b", 50: "c" }), 39);
  assertEquals(IntegerDict.getLength({ 30: "a", 40: "b", 50: undefined }), 38);
});

test("[DictView#get] returns the value of a given key", () => {
  const expected = { 30: "a", 40: "b", 50: "c" };
  const dictView = IntegerDict.from(expected);
  assertEquals(dictView.get(30), expected[30]);
});

test("[DictView#getLength] returns the byte length of the value of a given key", () => {
  const dictView = IntegerDict.from({ 30: "abcd", 40: "ab", 50: undefined });
  assertEquals(dictView.getLength(30), 4);
  assertEquals(dictView.getLength(40), 2);
  assertEquals(dictView.getLength(50), 0);
});

test("[DictView#getView] returns a view of the key's value", () => {
  const dictView = IntegerDict.from({ 30: "a", 40: "b", 50: "c" });
  const primitiveView = dictView.getView(30)! as StringView;
  assertEquals(primitiveView instanceof StringView, true);
  assertEquals(primitiveView.byteOffset, 20);
  assertEquals(primitiveView.byteLength, 1);
  assertEquals(primitiveView.buffer, dictView.buffer);
});

test("[DictView#set] sets a value for a given key", () => {
  const dictView = IntegerDict.from({ 30: "a", 40: "b", 50: "c" });
  const expected = "z";
  dictView.set(30, expected);
  assertEquals(dictView.get(30), expected);
});

test("[DictView#setView] sets a value view for a given key", () => {
  const dictView = IntegerDict.from({ 30: "a", 40: "b", 50: "c" });
  const primitiveView = StringView.from("d");
  dictView.setView(30, primitiveView);
  assertEquals(dictView.get(30), "d");
});

test("[DictView#toJSON] returns an object representation of the view", () => {
  const expected = { 30: "a", 40: "b", 50: "c" };
  const dictView = IntegerDict.from({ 30: "a", 40: "b", 50: "c" });
  assertEquals(dictView.toJSON(), expected);
});

test("[DictView#[Symbol.iterator]] iterates over elements of the array", () => {
  const dictView = Uint32ArrayView.from([30, 40, 50]);
  const array = [...dictView];
  assertEquals(array[0] instanceof Uint32View, true);
  assertEquals(array[0].get(), 30);
  assertEquals(array.length, 3);
});
