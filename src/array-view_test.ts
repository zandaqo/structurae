import { ArrayView } from "../src/array-view.ts";
import { Uint32View } from "../src/numeric-view.ts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

const { test } = Deno;
class Uint32ArrayView extends ArrayView<number> {
  static View = Uint32View;
  static itemLength = Uint32View.viewLength;
}

test("[ArrayView.from] creates an array view from a given array", () => {
  const expected = [30, 40, 50];
  const arrayView = Uint32ArrayView.from(expected);
  assertEquals(arrayView.toJSON(), expected);
});

test("[ArrayView.getLength] returns the byte length required to hold the array", () => {
  assertEquals(Uint32ArrayView.getLength(1), 4);
  assertEquals(Uint32ArrayView.getLength(5), 20);
});

test("[ArrayView#get] returns an item at a given index", () => {
  const expected = [30, 40];
  const arrayView = Uint32ArrayView.from(expected);
  assertEquals(arrayView.get(0), expected[0]);
});

test("[ArrayView#getView] returns an item view at a given index", () => {
  const arrayView = Uint32ArrayView.from([30, 40, 50]);
  const primitiveView = arrayView.getView(1);
  assertEquals(primitiveView instanceof Uint32View, true);
  assertEquals(primitiveView.byteOffset, 4);
  assertEquals(primitiveView.byteLength, 4);
  assertEquals(primitiveView.buffer, arrayView.buffer);
});

test("[ArrayView#set] sets an item at a given index", () => {
  const arrayView = Uint32ArrayView.from([30, 40, 50]);
  const expected = 60;
  arrayView.set(0, expected);
  assertEquals(arrayView.get(0), expected);
});

test("[ArrayView#setView] sets an item view at a given index", () => {
  const arrayView = Uint32ArrayView.from([30, 40, 50]);
  const primitiveView = Uint32View.from(10);
  arrayView.setView(0, primitiveView);
  assertEquals(arrayView.get(0), 10);
});

test("[ArrayView.size] returns the amount of items in the array", () => {
  const arrayView = Uint32ArrayView.from([30, 40, 50]);
  assertEquals(arrayView.byteLength, 12);
  assertEquals(arrayView.size, 3);
});

test("[ArrayView#toJSON] returns an array of items in the array", () => {
  const expected = [30, 40, 50];
  const arrayView = Uint32ArrayView.from(expected);
  assertEquals(arrayView.toJSON(), expected);
});

test("[ArrayView[Symbol.iterator]] iterates over elements of the array", () => {
  const arrayView = Uint32ArrayView.from([30, 40, 50]);
  const array = [...arrayView];
  assertEquals(array[0] instanceof Uint32View, true);
  assertEquals(array[0].get(), 30);
  assertEquals(array.length, 3);
});
