import { BooleanView } from "../boolean-view.ts";
import { assertEquals } from "./test_deps.ts";
const { test } = Deno;

test(`[BooleanView.encode] encodes a value into a view at a given index`, () => {
  const view = new DataView(new ArrayBuffer(20));
  BooleanView.encode(true, view, 8);
  assertEquals(BooleanView.decode(view, 8), true);
});

test(`[BooleanView.from] creates a view from a boolean`, () => {
  const view = BooleanView.from(true);
  assertEquals(view.get(), true);
});

test(`[BooleanView.getLength] returns the length of a view`, () => {
  assertEquals(BooleanView.getLength(), 1);
});

test(`[BooleanView#get] returns the boolean`, () => {
  const view = BooleanView.from(true);
  assertEquals(view instanceof BooleanView, true);
  assertEquals(view.get(), true);
});

test(`[BooleanView#set] sets a boolean`, () => {
  const view = BooleanView.from(true);
  assertEquals(view instanceof BooleanView, true);
  assertEquals(view.get(), true);
  view.set(false);
  assertEquals(view.get(), false);
});

test(`[BooleanView#toJSON] converts the view into a boolean`, () => {
  const array = BooleanView.from(true);
  assertEquals(array.toJSON(), true);
});
