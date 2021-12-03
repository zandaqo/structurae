import { View } from "../view.ts";
import { Uint8View } from "../numeric-view.ts";
import { assertEquals, assertThrows } from "../dev_deps.ts";

const { test } = Deno;
interface Tagged {
  tag: 10;
  name: string;
}

interface Person {
  name: string;
  age: number;
  scores: Array<number>;
}

interface Photo {
  name: string;
  data: Uint8Array;
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
  assertEquals(ArraysView.itemLength, 24);
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
  const PersonView = View.create<Person>({
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
  assertEquals(PersonView.from({} as unknown as Person).toJSON(), {
    name: "Arthur",
    age: 0,
    scores: [0, 0, 0],
  });
});

test("[View.create] handles objects with binary data", () => {
  const PhotoView = View.create<Photo>({
    $id: "Photo",
    type: "object",
    properties: {
      name: { type: "string", maxLength: 10, default: "Arthur" },
      data: {
        type: "string",
        maxLength: 5,
        btype: "binary",
        default: new Uint8Array([1, 2, 3]),
      },
    },
  });
  assertEquals(PhotoView.viewLength, 15);
  assertEquals(View.Views.get("Photo"), PhotoView);
  assertEquals(PhotoView.from({} as unknown as Photo).toJSON(), {
    name: "Arthur",
    data: new Uint8Array([1, 2, 3, 0, 0]),
  });
  assertEquals(
    PhotoView.from({
      name: "Carrot",
      data: new Uint8Array([5, 4, 3, 2, 1, 0, 10]),
    }).toJSON(),
    {
      name: "Carrot",
      data: new Uint8Array([5, 4, 3, 2, 1]),
    },
  );
});

test("[View.create] handles objects with constructors", () => {
  class ABC {
    a = 1;
    b = 2;
  }

  const AView = View.create({
    $id: "ABC",
    type: "object",
    properties: {
      a: { type: "number", btype: "uint8", default: 5 },
      b: { type: "number", btype: "uint8", default: 6 },
    },
  }, ABC);
  assertEquals(AView.viewLength, 2);
  assertEquals(View.Views.get("ABC"), AView);
  assertEquals(AView.from({} as unknown as ABC).toJSON(), {
    a: 5,
    b: 6,
  });
});

test("[View.create] handles array of objects", () => {
  const PersonArrayView = View.create<
    Array<Person>
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

test("[View.create] handles references", () => {
  const Person = View.create<Person>({
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
  });
  const PersonArray = View.create<Array<Person>>({
    type: "array",
    items: { type: "object", $ref: "#Person" },
  });
  // deno-lint-ignore no-explicit-any
  assertEquals((PersonArray as any).View === Person, true);
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

test("[View.create] creates a dict view", () => {
  const NumberDict = View.create<Record<number, string | undefined>>({
    $id: "NumberDict",
    type: "object",
    btype: "dict",
    propertyNames: { type: "number", btype: "uint8" },
    additionalProperties: { type: "string" },
  });
  const dict: Record<number, string | undefined> = {
    1: "a",
    2: "b",
    3: "c",
    5: undefined,
  };
  const encoded = NumberDict.from(dict);
  const decoded = encoded.toJSON();
  assertEquals(dict, decoded);
});

test("[View.create] creates a nested dict view", () => {
  View.create<Record<number, string | undefined>>({
    $id: "NumberDict",
    type: "object",
    btype: "dict",
    propertyNames: { type: "number", btype: "uint8" },
    additionalProperties: { type: "string" },
  });
  type NestedDict = {
    n: Record<string, Record<number, string | undefined> | undefined>;
  };
  const NestedDict = View.create<NestedDict>({
    $id: "NestedDict",
    type: "object",
    btype: "map",
    properties: {
      n: {
        $id: "StringDict",
        type: "object",
        btype: "dict",
        propertyNames: { type: "string", maxLength: 5 },
        additionalProperties: { type: "object", $ref: "#NumberDict" },
      },
    },
  });
  const dict: NestedDict = {
    n: {
      "a": { 1: "z" },
      "b": { 2: "y" },
      "c": { 3: "x" },
      "d": undefined,
    },
  };
  const encoded = NestedDict.from(dict);
  const decoded = encoded.toJSON();
  assertEquals(dict, decoded);
});

test("[View.create] creates a dict view with an array", () => {
  const ArrayDict = View.create<Record<number, Array<number>>>({
    $id: "ArrayDict",
    type: "object",
    btype: "dict",
    propertyNames: { type: "number", btype: "uint8" },
    additionalProperties: {
      type: "array",
      maxItems: 2,
      items: { type: "integer" },
    },
  });
  const dict: Record<number, Array<number>> = {
    1: [1, 2],
    2: [3, 4],
  };
  const encoded = ArrayDict.from(dict);
  const decoded = encoded.toJSON();
  assertEquals(dict, decoded);
});

test("[View.create] creates a dict view with a vector", () => {
  const VectorDict = View.create<Record<number, Array<string>>>({
    $id: "VectorDict",
    type: "object",
    btype: "dict",
    propertyNames: { type: "number", btype: "uint8" },
    additionalProperties: {
      type: "array",
      btype: "vector",
      items: { type: "string" },
    },
  });
  const dict: Record<number, Array<string>> = {
    1: ["a", "abc"],
    2: ["asdfasdfasdf", "abcde", "a"],
  };
  const encoded = VectorDict.from(dict);
  const decoded = encoded.toJSON();
  assertEquals(dict, decoded);
});

test("[View.create] throws if keys are not of fixed size", () => {
  assertThrows(
    () => {
      View.create<Record<number, string | undefined>>({
        $id: "NonFixedDict",
        type: "object",
        btype: "dict",
        propertyNames: { type: "string" },
        additionalProperties: { type: "string" },
      });
    },
    TypeError,
    "ArrayView should have fixed sized items.",
  );
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
