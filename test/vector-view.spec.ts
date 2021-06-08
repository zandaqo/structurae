import { VectorView } from "../src/vector-view";
import { StringView } from "../src/string-view";
import { ContainerView, ViewConstructor } from "../src/view-types";

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

describe("VectorView", () => {
  describe("get", () => {
    it("returns a value at a given index", () => {
      const expected = ["a", "b", undefined, "cd"];
      expect(StringVector.from(expected).get(0)).toEqual(expected[0]);
    });

    it("returns undefined for absent index", () => {
      const expected = ["a", "b", undefined, "cd"];
      const vector = StringVector.from(expected);
      expect(vector.get(2)).toBe(undefined);
      expect(vector.get(10)).toBe(undefined);
    });
  });

  describe("getView", () => {
    it("returns a view at a given index", () => {
      const vector = StringVector.from(["a", "b", undefined, "cd"]);
      const actual = vector.getView(3)! as StringView;
      expect(actual instanceof StringView).toBe(true);
      expect(actual.byteOffset).toBe(26);
      expect(actual.byteLength).toBe(2);
    });

    it("returns undefined for absent index", () => {
      expect(StringVector.from(["a", "b", undefined, "cd"]).getView(2)).toBe(
        undefined
      );
    });
  });

  describe("set", () => {
    it("sets a value at a given index", () => {
      const vector = StringVector.from(["a", "b", undefined, "cd"]);
      const expected = "xy";
      vector.set(3, expected);
      expect(vector.get(3)).toEqual(expected);
    });

    it("trims value if it exceeds the field limit", () => {
      const vector = StringVector.from(["a", "b", undefined, "cd"]);
      vector.set(1, "abcdef");
      expect(vector.toJSON()).toEqual(["a", "a", undefined, "cd"]);
    });

    it("handles trimming in nested vectors", () => {
      const vector = NestedVector.from([
        ["a", "b", "c"],
        ["d", "e"],
      ]);
      vector.set(0, ["cde", "f", "g"]);
      expect(vector.getView(0)!.get(1)).toBe(undefined);
      expect(vector.getView(0)!.get(2)).toBe(undefined);
      expect(vector.toJSON()).toEqual([
        ["cde", undefined, undefined],
        ["d", "e"],
      ]);
    });

    it("does not set nested vector if it's minimal length exceeds the available space", () => {
      const vector = NestedVector.from([
        ["a", "b", "c"],
        ["d", "e"],
      ]);
      vector.set(0, ["cde", "f", "g", "h"]);
      expect(vector.toJSON()).toEqual([
        ["a", "b", "c"],
        ["d", "e"],
      ]);
    });

    it("does not set value to absent item", () => {
      const vector = StringVector.from(["a", "b", undefined, "cd"]);
      vector.set(2, "xy");
      expect(vector.get(2)).toBe(undefined);
    });
  });

  describe("setView", () => {
    it("sets a view at a given index", () => {
      const vector = StringVector.from(["a", "b", undefined, "cd"]);
      vector.setView(0, StringView.from("x"));
      expect(vector.get(0)).toEqual("x");
    });
    it("does not set view on absent index", () => {
      const vector = StringVector.from(["a", "b", undefined, "cd"]);
      vector.setView(2, StringView.from("x"));
      expect(vector.get(2)).toBe(undefined);
    });
  });

  describe("size", () => {
    it("returns the amount of values in the vector", () => {
      expect(StringVector.from(["a", "b", undefined, "cd"]).size).toBe(4);
    });
  });

  describe("toJSON", () => {
    it("returns an array of values in the vector", () => {
      const expected = ["a", "b", undefined, "cd"];
      expect(StringVector.from(expected).toJSON()).toEqual(expected);
    });
  });

  describe("from", () => {
    it("creates a vector view from a given value", () => {
      const expected = ["a", "b", undefined, "cd"];
      expect(StringVector.from(expected).toJSON()).toEqual(expected);
    });

    it("supports nested vectors", () => {
      const expected = [
        ["a", "b", undefined, "cd"],
        ["e", "f"],
      ];
      expect(NestedVector.from(expected).toJSON()).toEqual(expected);
    });
  });

  describe("getLength", () => {
    it("returns the byte length required to hold the vector", () => {
      expect(StringVector.getLength([])).toBe(8);
      expect(StringVector.getLength(["abc", "a"])).toBe(20);
      expect(StringVector.getLength(["a", undefined, "abc"])).toBe(24);
    });
  });

  describe("iterator", () => {
    it("iterates over elements of the vector", () => {
      const vector = StringVector.from(["a", "b", undefined, "cd"]);
      const array = [...vector] as Array<StringView | undefined>;
      expect(array[0] instanceof StringView).toBe(true);
      expect(array.length).toBe(4);
    });
  });
});
