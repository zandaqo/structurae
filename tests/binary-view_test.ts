import { BinaryView } from "../binary-view.ts";
import { assertEquals } from "../dev_deps.ts";
const { test } = Deno;

test(`[BooleanView.encode] encodes a value into a view at a given index`, () => {
  const view = new DataView(new ArrayBuffer(20));
  const array = new Uint8Array([1, 2, 3, 4, 5]);
  BinaryView.encode(array, view, 15);
  assertEquals(BinaryView.decode(view, 15), array);
});

test(`[BooleanView.encode] encodes larger array into a view at a given index`, () => {
  const view = new DataView(new ArrayBuffer(10));
  const array = new Uint8Array([1, 2, 3, 4, 5]);
  BinaryView.encode(array, view, 8, 2);
  assertEquals(BinaryView.decode(view, 5, 10), new Uint8Array([0, 0, 0, 1, 2]));
});

test(`[BooleanView.encode] encodes smaller array into a view at a given index`, () => {
  const view = new DataView(new ArrayBuffer(10));
  const array = new Uint8Array([1, 2]);
  BinaryView.encode(array, view, 5, 5);
  assertEquals(BinaryView.decode(view, 5, 10), new Uint8Array([1, 2, 0, 0, 0]));
});

test(`[BooleanView.from] creates a view from a boolean`, () => {
  const array = new Uint8Array([1, 2, 3, 4, 5]);
  const view = BinaryView.from(array);
  assertEquals(view.get(), array);
});

test(`[BooleanView.getLength] returns the length of a view`, () => {
  assertEquals(BinaryView.getLength(10), 10);
});

test(`[BooleanView#get] returns the array`, () => {
  const array = new Uint8Array([1, 2, 3, 4, 5]);
  const view = BinaryView.from(array);
  assertEquals(view instanceof BinaryView, true);
  assertEquals(view.get(), array);
});

test(`[BooleanView#set] sets an array`, () => {
  const array = new Uint8Array([1, 2, 3, 4, 5]);
  const view = new BinaryView(new ArrayBuffer(5));
  view.set(array);
  assertEquals(view.get(), array);
});

test(`[BooleanView#toJSON] converts the view into an array`, () => {
  const array = new BinaryView(new ArrayBuffer(3));
  assertEquals(array.toJSON(), new Uint8Array([0, 0, 0]));
});
