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
} from "../src/numeric-view";
import { PrimitiveView, ViewConstructor } from "../src/view-types";

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

describe("TypeView", () => {
  for (const [type, Ctor] of Object.entries(TypeViews)) {
    describe(type, () => {
      const isBigInt = type.startsWith("big");

      describe("get", () => {
        it("returns the number", () => {
          const expected = isBigInt ? bigNumber : number;
          const view = Ctor.from(expected);
          expect(view instanceof Ctor).toBe(true);
          expect(view.get()).toBe(expected);
        });
      });

      describe("set", () => {
        it("sets the number", () => {
          const expected = isBigInt ? bigNumber : number;
          const zero = isBigInt ? BigInt(0) : 0;
          const view = Ctor.from(zero);
          expect(view instanceof Ctor).toBe(true);
          expect(view.get()).toBe(zero);
          view.set(expected);
          expect(view.get()).toBe(expected);
        });
      });

      describe("from", () => {
        it("creates a typed array from an array of numbers", () => {
          const expected = isBigInt ? bigNumber : number;
          const view = Ctor.from(expected);
          expect(view.get()).toBe(expected);
        });
      });

      describe("toJSON", () => {
        it("converts a view into an array of numbers", () => {
          const expected = isBigInt ? bigNumber : number;
          const array = Ctor.from(expected);
          expect(array.toJSON()).toEqual(expected);
        });
      });
    });
  }
});
