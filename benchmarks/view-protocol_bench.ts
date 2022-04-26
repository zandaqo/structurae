import { getIndex } from "./helpers.ts";
import jsf from "https://jspm.dev/json-schema-faker";
import { deflateRaw } from "https://deno.land/x/compress@v0.3.8/mod.ts";
import { View } from "../view.ts";
import { StringView } from "../string-view.ts";
import { ViewSchema } from "../view-types.ts";

interface House {
  type: number;
  id: number;
  size: number;
}

interface Toy {
  id: number;
  name: string;
}

interface Pet {
  type: number;
  id: number;
  name: string;
  toys: Array<Toy>;
}

interface Person {
  type: number;
  id: number;
  name: string;
  weight: number;
  height: number;
  scores: Array<number>;
  pets: Array<Pet>;
  house: House;
  parents: Array<string>;
}

const JSONSchema: ViewSchema<Person> = {
  type: "object",
  $id: "Person",
  properties: {
    type: {
      type: "integer",
      btype: "uint8",
      minimum: 0,
      maximum: 255,
    },
    id: { type: "integer", btype: "uint32", minimum: 0 },
    name: { type: "string", minLength: 3, maxLength: 50 },
    weight: { type: "number", minimum: 0 },
    height: { type: "number" },
    scores: {
      type: "array",
      items: {
        type: "integer",
        btype: "uint8",
        minimum: 0,
        maximum: 255,
      },
      minItems: 50,
      maxItems: 50,
    },
    pets: {
      type: "array",
      items: {
        type: "object",
        $id: "Pet",
        properties: {
          type: {
            type: "integer",
            btype: "uint8",
            minimum: 0,
            maximum: 255,
          },
          id: { type: "integer", btype: "uint32", minimum: 0 },
          name: { type: "string", minLength: 3, maxLength: 20 },
          toys: {
            type: "array",
            items: {
              type: "object",
              $id: "Toy",
              properties: {
                id: { type: "integer", btype: "uint32", minimum: 0 },
                name: { type: "string", minLength: 3, maxLength: 10 },
              },
              required: ["id", "name"],
            },
            minItems: 10,
            maxItems: 10,
          },
        },
        required: ["type", "id", "name", "toys"],
      },
      minItems: 3,
      maxItems: 3,
    },
    house: {
      type: "object",
      $id: "House",
      properties: {
        type: {
          type: "integer",
          btype: "uint8",
          minimum: 0,
          maximum: 255,
        },
        id: { type: "integer", btype: "uint32", minimum: 0 },
        size: { type: "number", minimum: 0 },
      },
      required: ["type", "id", "size"],
    },
    parents: {
      type: "array",
      items: { type: "string", minLength: 5, maxLength: 10 },
      maxItems: 2,
      minItems: 2,
    },
  },
  required: [
    "type",
    "id",
    "name",
    "weight",
    "height",
    "scores",
    "pets",
    "house",
    "parents",
  ],
};

const Person = View.create<Person>(JSONSchema);
const People = View.create<Array<Person>>({
  type: "array",
  items: { type: "object", $ref: "#Person" },
});

const objects: Person[] = [];

for (let i = 0; i < 100; i++) {
  // deno-lint-ignore no-explicit-any
  objects.push((jsf as any).generate(JSONSchema));
}
const Encoder = new TextEncoder();
const Decoder = new TextDecoder();
const emptyPerson = Person.from({} as Person);
const people = People.from(objects);
const views = [...people];
const strings = objects.map((i) => JSON.stringify(i));
const encodedStrings = strings.map((i) => Encoder.encode(i));

const binarySize = people.byteLength;
const binaryCompressedSize =
  deflateRaw(new Uint8Array(people.buffer)).byteLength;
const stringSize = StringView.getLength(JSON.stringify(objects));
const stringCompressedSize =
  deflateRaw(Encoder.encode(JSON.stringify(objects))).byteLength;

console.log(`Encoded Sizes:
 View: ${binarySize}
 JSON String: ${stringSize} (${Math.round((stringSize / binarySize) * 100)}%)
 View Compressed: ${binaryCompressedSize} (${
  Math.round(
    (binaryCompressedSize / binarySize) * 100,
  )
}%)
 JSON Compressed: ${stringCompressedSize} (${
  Math.round(
    (stringCompressedSize / binarySize) * 100,
  )
}%)`);

Deno.bench({
  name: "[View Protocol Get Value] View",
  group: "[View Protocol Get Value]",
  baseline: true,
  fn() {
    const view = views[getIndex(100)]!;
    view.get("type")! + view.get("weight")! + view.get("height")!;
  },
});
Deno.bench({
  name: "JSON",
  group: "[View Protocol Get Value]",
  fn() {
    const string = strings[getIndex(100)];
    const object = JSON.parse(string);
    object.house + object.weight + object.height;
  },
});
Deno.bench({
  name: "[View Protocol Set Value] View",
  group: "[View Protocol Set Value]",
  baseline: true,
  fn() {
    const view = views[getIndex(100)]!;
    view.set("type", 20);
    view.set("weight", 20);
    view.set("height", 20);
  },
});
Deno.bench({
  name: "JSON",
  group: "[View Protocol Set Value]",
  fn() {
    const string = strings[getIndex(100)];
    const object = JSON.parse(string);
    object.type = 20;
    object.weight = 20;
    object.height = 20;
  },
});
Deno.bench({
  name: "[View Protocol Serialize] View",
  group: "View Protocol Serialize",
  fn() {
    const object = objects[getIndex(100)];
    Person.from(object);
  },
});
Deno.bench({
  name: "[View Protocol Serialize] View (into buffer)",
  group: "View Protocol Serialize",
  baseline: true,
  fn() {
    const object = objects[getIndex(100)];
    Person.encode(object, emptyPerson);
  },
});
Deno.bench({
  name: "[View Protocol Serialize] JSON",
  group: "View Protocol Serialize",
  fn() {
    const object = objects[getIndex(100)];
    JSON.stringify(object);
  },
});
Deno.bench({
  name: "[View Protocol Serialize] JSON into Binary",
  group: "View Protocol Serialize",
  fn() {
    const object = objects[getIndex(100)];
    Encoder.encode(JSON.stringify(object));
  },
});
Deno.bench({
  name: "[View Protocol Deserialize] View",
  group: "View Protocol Deserialize",
  baseline: true,
  fn() {
    const view = views[getIndex(100)]!;
    view.toJSON();
  },
});

Deno.bench({
  name: "[View Protocol Deserialize] JSON from Binary",
  group: "View Protocol Deserialize",
  fn() {
    const string = encodedStrings[getIndex(100)];
    JSON.parse(Decoder.decode(string));
  },
});
Deno.bench({
  name: "[View Protocol Deserialize] JSON",
  group: "View Protocol Deserialize",
  fn() {
    const string = strings[getIndex(100)];
    JSON.parse(string);
  },
});
