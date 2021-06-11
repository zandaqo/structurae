import { View } from "../src/view.ts";
import { Uint8View } from "../src/numeric-view.ts";
import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std/testing/asserts.ts";

const { test } = Deno;
interface Tagged {
  tag: 10;
  name: string;
}
test("[View.create] creates a view for primitive types", () => {
  const NumberView = View.create<number>({
    type: "number",
    btype: "uint8",
  });
  assertEquals(NumberView, Uint8View);
});

test("[View.create] handles an array of primitive type", () => {
  const Uint8ArrayView = View.create<Array<number>>({
    type: "array",
    items: {
      type: "number",
      btype: "uint8",
      maxItems: 10,
    },
  });
  assertEquals(Uint8ArrayView.itemLength, 1);
  assertEquals(View.Views.get("ArrayView_uint8"), Uint8ArrayView);
});

test("[View.create] handles array of arrays", () => {
  const ArraysView = View.create<number[][]>({
    type: "array",
    items: {
      type: "array",
      items: { type: "number" },
      maxItems: 3,
    },
    maxItems: 3,
  });
  assertEquals(ArraysView.itemLength, 12);
  assertEquals(View.Views.has("ArrayView_number"), true);
  assertEquals(
    ArraysView.from([
      [1, 2, 3],
      [4, 5, 6],
    ]).toJSON(),
    [
      [1, 2, 3],
      [4, 5, 6],
    ],
  );
});

test("[View.create] throws if array item size is not fixed", () => {
  assertThrows(
    () =>
      View.create<Array<string>>({
        type: "array",
        items: {
          type: "string",
        },
      }),
    TypeError,
    "ArrayView should have fixed sized items.",
  );
});

test("[View.create] handles objects", () => {
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
  assertEquals(PersonView.viewLength, 14);
  assertEquals(View.Views.get("Person"), PersonView);
  //@ts-ignore
  assertEquals(PersonView.from({}).toJSON(), {
    name: "Arthur",
    age: 0,
    scores: [0, 0, 0],
  });
});

test("[View.create] handles array of objects", () => {
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
  assertEquals(PersonArrayView.itemLength, 14);
  assertEquals(View.Views.has("Person"), true);
  assertEquals(View.Views.get("ArrayView_Person"), PersonArrayView);
});

test("[View.create] handles nested objects", () => {
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
  assertEquals(FamilyView.viewLength, 150);
  assertEquals(View.Views.has("Person"), true);
  assertEquals(View.Views.has("ArrayView_Person"), true);
  assertEquals(View.Views.get("Family"), FamilyView);
});

test("[View.create] handles maps", () => {
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
  assertEquals(HouseView.viewLength, 0);
  assertEquals(View.Views.get("House"), HouseView);
  const house = { rooms: [1, 2, undefined, 3] };
  assertEquals(HouseView.from(house).toJSON(), { name: "ABC", ...house });
});

test("[View.create] throws if required field size is not fixed", () => {
  assertThrows(
    () =>
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
      }),
    TypeError,
    'The length of a required field "map" is undefined.',
  );
});

test("[View.create] handles tagged objects", () => {
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
  assertEquals(TaggedView.viewLength, 11);
  assertEquals(View.Views.get("TaggedView"), TaggedView);
  assertEquals(View.TaggedViews.get(10), TaggedView);
});

test("[View.view] instantiates a tagged view", () => {
  const TaggedView = View.create<Tagged>({
    $id: "TaggedView",
    type: "object",
    properties: {
      tag: { type: "number", btype: "uint8", default: 10 },
      name: { type: "string", maxLength: 10, default: "Arthur" },
    },
  });
  const data = new DataView(
    TaggedView.from({ tag: 10, name: "Zaphod" }).buffer,
  );
  const view = View.view<Tagged>(data)!;
  assertEquals(view instanceof TaggedView, true);
  assertEquals(view.get("name"), "Zaphod");
  assertEquals(view.get("tag"), 10);
});

test("[View.decode] returns a value of a tagged view", () => {
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
  assertEquals(View.decode<Tagged>(data)!, value);
});

test("[View.encode] encodes value into a tagged view", () => {
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
  assertEquals(view.toJSON(), value);
});
