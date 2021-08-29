import {
  BigInt64View,
  BigUint64View,
  Float32View,
  Float64View,
  Int16View,
  Int32View,
  Int8View,
  Uint16View,
  Uint32View,
  Uint8View,
} from "../numeric-view.ts";
import { PrimitiveView, ViewConstructor } from "../view-types.ts";
import { assertEquals } from "../dev_deps.ts";

const { test } = Deno;
const TypeViews: Record<
  string,
  ViewConstructor<number | bigint, PrimitiveView<number | bigint>>
> = {
  int8: Int8View,
  uint8: Uint8View,
  int16: Int16View,
  uint16: Uint16View,
  int32: Int32View,
  uint32: Uint32View,
  float32: Float32View,
  float64: Float64View,
  bigint64: BigInt64View,
  biguint64: BigUint64View,
} as const;

const number = 10;
const bigNumber = BigInt(10);

for (const [type, Ctor] of Object.entries(TypeViews)) {
  const isBigInt = type.startsWith("big");

  test(`[${type}.encode] encodes a value into a view at a given index`, () => {
    const expected = isBigInt ? bigNumber : number;
    const view = new DataView(new ArrayBuffer(20));
    Ctor.encode(expected, view, 8);
    assertEquals(Ctor.decode(view, 8), expected);
  });

  test(`[${type}.from] creates a typed array from an array of numbers`, () => {
    const expected = isBigInt ? bigNumber : number;
    const view = Ctor.from(expected);
    assertEquals(view.get(), expected);
  });

  test(`[${type}.getLength] returns the length of a view`, () => {
    assertEquals(Ctor.getLength(), Ctor.viewLength);
  });

  test(`[${type}#get] returns the number`, () => {
    const expected = isBigInt ? bigNumber : number;
    const view = Ctor.from(expected);
    assertEquals(view instanceof Ctor, true);
    assertEquals(view.get(), expected);
  });

  test(`[${type}#set] sets the number`, () => {
    const expected = isBigInt ? bigNumber : number;
    const zero = isBigInt ? BigInt(0) : 0;
    const view = Ctor.from(zero);
    assertEquals(view instanceof Ctor, true);
    assertEquals(view.get(), zero);
    view.set(expected);
    assertEquals(view.get(), expected);
  });

  test(`[${type}#toJSON] converts a view into an array of numbers`, () => {
    const expected = isBigInt ? bigNumber : number;
    const array = Ctor.from(expected);
    assertEquals(array.toJSON(), expected);
  });
}
