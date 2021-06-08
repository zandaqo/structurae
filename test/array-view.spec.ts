import { ArrayView } from "../src/array-view";
import { Uint32View } from "../src/numeric-view";

class Uint32ArrayView extends ArrayView<number> {
  static View = Uint32View;
  static itemLength = Uint32View.viewLength;
}

describe("ArrayView", () => {
  describe("get", () => {
    it("returns an item at a given index", () => {
      const expected = [30, 40];
      const arrayView = Uint32ArrayView.from(expected);
      expect(arrayView.get(0)).toEqual(expected[0]);
    });
  });

  describe("getView", () => {
    it("returns an item view at a given index", () => {
      const arrayView = Uint32ArrayView.from([30, 40, 50]);
      const primitiveView = arrayView.getView(1);
      expect(primitiveView instanceof Uint32View).toBe(true);
      expect(primitiveView.byteOffset).toBe(4);
      expect(primitiveView.byteLength).toBe(4);
      expect(primitiveView.buffer).toBe(arrayView.buffer);
    });
  });

  describe("set", () => {
    it("sets an item at a given index", () => {
      const arrayView = Uint32ArrayView.from([30, 40, 50]);
      const expected = 60;
      arrayView.set(0, expected);
      expect(arrayView.get(0)).toEqual(expected);
    });
  });

  describe("setView", () => {
    it("sets an item view at a given index", () => {
      const arrayView = Uint32ArrayView.from([30, 40, 50]);
      const primitiveView = Uint32View.from(10);
      arrayView.setView(0, primitiveView);
      expect(arrayView.get(0)).toEqual(10);
    });
  });

  describe("size", () => {
    it("returns the amount of items in the array", () => {
      const arrayView = Uint32ArrayView.from([30, 40, 50]);
      expect(arrayView.byteLength).toBe(12);
      expect(arrayView.size).toBe(3);
    });
  });

  describe("toJSON", () => {
    it("returns an array of items in the array", () => {
      const expected = [30, 40, 50];
      const arrayView = Uint32ArrayView.from(expected);
      expect(arrayView.toJSON()).toEqual(expected);
    });
  });

  describe("from", () => {
    it("creates an array view from a given array", () => {
      const expected = [30, 40, 50];
      const arrayView = Uint32ArrayView.from(expected);
      expect(arrayView.toJSON()).toEqual(expected);
    });
  });

  describe("getLength", () => {
    it("returns the byte length required to hold the array", () => {
      expect(Uint32ArrayView.getLength(1)).toBe(4);
      expect(Uint32ArrayView.getLength(5)).toBe(20);
    });
  });

  describe("iterator", () => {
    it("iterates over elements of the array", () => {
      const arrayView = Uint32ArrayView.from([30, 40, 50]);
      const array = [...arrayView];
      expect(array[0] instanceof Uint32View).toBe(true);
      expect(array[0].get()).toBe(30);
      expect(array.length).toBe(3);
    });
  });
});
