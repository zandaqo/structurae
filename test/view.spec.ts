import { View } from "../src/view";
import { Uint8View } from "../src/numeric-view";

describe("View", () => {
  interface Tagged {
    tag: 10;
    name: string;
  }
  describe("create", () => {
    it("creates a view for primitive types", () => {
      const NumberView = View.create<number>({
        type: "number",
        btype: "uint8",
      });
      expect(NumberView).toBe(Uint8View);
    });
    it("handles an array of primitive type", () => {
      const Uint8ArrayView = View.create<Array<number>>({
        type: "array",
        items: {
          type: "number",
          btype: "uint8",
          maxItems: 10,
        },
      });
      expect(Uint8ArrayView.itemLength).toBe(1);
      expect(View.Views.get("ArrayView_uint8")).toBe(Uint8ArrayView);
    });
    it("handles array of arrays", () => {
      const ArraysView = View.create<number[][]>({
        type: "array",
        items: {
          type: "array",
          items: { type: "number" },
          maxItems: 3,
        },
        maxItems: 3,
      });
      expect(ArraysView.itemLength).toBe(12);
      expect(View.Views.has("ArrayView_number")).toBe(true);
      expect(
        ArraysView.from([
          [1, 2, 3],
          [4, 5, 6],
        ]).toJSON()
      ).toEqual([
        [1, 2, 3],
        [4, 5, 6],
      ]);
    });
    it("throws if array item size is not fixed", () => {
      expect(() =>
        View.create<Array<string>>({
          type: "array",
          items: {
            type: "string",
          },
        })
      ).toThrow("ArrayView should have fixed sized items.");
    });
    it("handles objects", () => {
      const PersonView = View.create<{
        name: string;
        age: number;
        scores: Array<number>;
      }>({
        $id: "Person",
        type: "object",
        properties: {
          name: { type: "string", maxLength: 10, default: "Arthur" },
          age: { type: "number", btype: "uint8" },
          scores: {
            type: "array",
            items: { type: "number", btype: "uint8" },
            maxItems: 3,
          },
        },
      });
      expect(PersonView.viewLength).toBe(14);
      expect(View.Views.get("Person")).toBe(PersonView);
      //@ts-ignore
      expect(PersonView.from({}).toJSON()).toEqual({
        name: "Arthur",
        age: 0,
        scores: [0, 0, 0],
      });
    });
    it("handles array of objects", () => {
      const PersonArrayView = View.create<
        Array<{
          name: string;
          age: number;
          scores: Array<number>;
        }>
      >({
        type: "array",
        items: {
          $id: "Person",
          type: "object",
          properties: {
            name: { type: "string", maxLength: 10 },
            age: { type: "number", btype: "uint8" },
            scores: {
              type: "array",
              items: { type: "number", btype: "uint8" },
              maxItems: 3,
            },
          },
        },
        maxItems: 10,
      });
      expect(PersonArrayView.itemLength).toBe(14);
      expect(View.Views.has("Person")).toBe(true);
      expect(View.Views.get("ArrayView_Person")).toBe(PersonArrayView);
    });
    it("handles nested objects", () => {
      const FamilyView = View.create<{
        name: string;
        members: Array<{
          name: string;
          age: number;
          scores: Array<number>;
        }>;
      }>({
        $id: "Family",
        type: "object",
        properties: {
          name: { type: "string", maxLength: 10 },
          members: {
            type: "array",
            items: {
              $id: "Person",
              type: "object",
              properties: {
                name: { type: "string", maxLength: 10 },
                age: { type: "number", btype: "uint8" },
                scores: {
                  type: "array",
                  items: { type: "number", btype: "uint8" },
                  maxItems: 3,
                },
              },
            },
            maxItems: 10,
          },
        },
      });
      expect(FamilyView.viewLength).toBe(150);
      expect(View.Views.has("Person")).toBe(true);
      expect(View.Views.has("ArrayView_Person")).toBe(true);
      expect(View.Views.get("Family")).toBe(FamilyView);
    });
    it("handles maps", () => {
      const HouseView = View.create<{
        name?: string;
        rooms: Array<number | undefined>;
      }>({
        $id: "House",
        type: "object",
        btype: "map",
        properties: {
          name: { type: "string", default: "ABC", maxLength: 10 },
          rooms: {
            type: "array",
            btype: "vector",
            items: { type: "number", btype: "uint8" },
          },
        },
        required: ["name"],
      });
      expect(HouseView.viewLength).toBe(0);
      expect(View.Views.get("House")).toBe(HouseView);
      const house = { rooms: [1, 2, undefined, 3] };
      expect(HouseView.from(house).toJSON()).toEqual({ name: "ABC", ...house });
    });
    it("throws if required field size is not fixed", () => {
      expect(() =>
        View.create<{ map: { a: number } }>({
          type: "object",
          $id: "ObjectWithMap",
          properties: {
            map: {
              type: "object",
              $id: "MapOfObjectWithMap",
              btype: "map",
              properties: {
                a: { type: "number" },
              },
            },
          },
        })
      ).toThrow('The length of a required field "map" is undefined.');
    });
    it("handles tagged objects", () => {
      const TaggedView = View.create<{
        tag: number;
        name: string;
      }>({
        $id: "TaggedView",
        type: "object",
        properties: {
          tag: { type: "number", btype: "uint8", default: 10 },
          name: { type: "string", maxLength: 10, default: "Arthur" },
        },
      });
      expect(TaggedView.viewLength).toBe(11);
      expect(View.Views.get("TaggedView")).toBe(TaggedView);
      expect(View.TaggedViews.get(10)).toBe(TaggedView);
    });
  });
  describe("view", () => {
    it("instantiates a tagged view", () => {
      const TaggedView = View.create<Tagged>({
        $id: "TaggedView",
        type: "object",
        properties: {
          tag: { type: "number", btype: "uint8", default: 10 },
          name: { type: "string", maxLength: 10, default: "Arthur" },
        },
      });
      const data = new DataView(
        TaggedView.from({ tag: 10, name: "Zaphod" }).buffer
      );
      const view = View.view<Tagged>(data)!;
      expect(view instanceof TaggedView).toBe(true);
      expect(view.get("name")).toBe("Zaphod");
      expect(view.get("tag")).toBe(10);
    });
  });
  describe("decode", () => {
    it("returns a value of a tagged view", () => {
      const TaggedView = View.create<Tagged>({
        $id: "TaggedView",
        type: "object",
        properties: {
          tag: { type: "number", btype: "uint8", default: 10 },
          name: { type: "string", maxLength: 10, default: "Arthur" },
        },
      });
      const value = { tag: 10, name: "Zaphod" } as const;
      const data = new DataView(TaggedView.from(value).buffer);
      expect(View.decode<Tagged>(data)!).toEqual(value);
    });
  });
  describe("encode", () => {
    it("encodes value into a tagged view", () => {
      View.create<Tagged>({
        $id: "TaggedView",
        type: "object",
        properties: {
          tag: { type: "number", btype: "uint8", default: 10 },
          name: { type: "string", maxLength: 10, default: "Arthur" },
        },
      });
      const value = { tag: 10, name: "Zaphod" } as const;
      const view = View.encode<Tagged>(value)!;
      expect(view.toJSON()).toEqual(value);
    });
  });
});
