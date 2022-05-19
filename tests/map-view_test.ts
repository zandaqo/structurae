import { ViewConstructor } from "../view-types.ts";
import { StringView } from "../string-view.ts";
import { Uint8View } from "../numeric-view.ts";
import { VectorView } from "../vector-view.ts";
import { MapView } from "../map-view.ts";
import { assertEquals } from "../dev_deps.ts";
import { Constructor } from "../utility-types.ts";

const { test } = Deno;
const maxView = new DataView(new ArrayBuffer(1024));

interface Person {
  age: number;
  name: string;
}

interface Family {
  name: string;
  members?: Array<Person | undefined>;
}

const PersonView: ViewConstructor<Person> = class extends MapView<Person> {
  static layout = {
    age: { View: Uint8View, start: 0, length: 1, required: true },
    name: { View: StringView, start: 1, length: Infinity, required: false },
  };
  static lengthOffset = 5;
  static optionalOffset = 1;
  static fields = ["age"];
  static optionalFields = ["name"];
  static maxView = maxView;
  static defaultData = new Uint8Array(new ArrayBuffer(1));
  static ObjectConstructor = (function () {
    return { name: "", age: 0 };
  }) as unknown as Constructor<
    Person
  >;
};

const Members: ViewConstructor<
  Array<Person | undefined>
> = class extends VectorView<Person> {
  static View = PersonView;
  static maxView = maxView;
};

const FamilyView: ViewConstructor<Family> = class extends MapView<Family> {
  static layout = {
    name: { View: StringView, start: 0, length: 10, required: true },
    members: { View: Members, start: 10, length: Infinity, required: false },
  };
  static lengthOffset = 14;
  static optionalOffset = 10;
  static fields = ["name"];
  static optionalFields = ["members"];
  static maxView = maxView;
  static defaultData = new Uint8Array(new ArrayBuffer(10));
  static ObjectConstructor = (function () {
    return { name: "", members: null };
  }) as unknown as Constructor<Family>;
};

FamilyView.defaultData!.set([90, 97, 112, 104, 111, 100]); // default name is Zaphod

test("[MapView.from] creates a map view from a given object", () => {
  const expected: Family = {
    name: "Dent",
    members: [
      { name: "Arthur", age: 30 },
      { name: "Trillian", age: 20 },
    ],
  };
  const map = FamilyView.from(expected);
  assertEquals(map.toJSON(), expected);
});

test("[MapView.from] treats undefined and null fields as missing", () => {
  const expected: Family = {
    name: "Dent",
    members: [
      { name: "Arthur", age: 30 },
      undefined,
      { name: "Trillian", age: 20 },
    ],
  };
  const map = FamilyView.from(expected);
  assertEquals(map.toJSON(), expected);
});

test("[MapView.from] truncates strings and arrays longer than set max sizes", () => {
  const expected: Family = {
    name: "Arthur Zaphod Dent",
    members: [],
  };
  const map = FamilyView.from(expected);
  assertEquals(map.toJSON(), {
    name: "Arthur Zap",
    members: [],
  });
});

test("[MapView.from] sets default values for required fields", () => {
  const map = FamilyView.from({
    members: [],
  } as unknown as Family);
  assertEquals(map.toJSON(), {
    name: "Zaphod",
    members: [],
  });
});

test("[MapView.getLength] returns the byte length of a map view to hold a given object", () => {
  assertEquals(PersonView.getLength({ age: 10, name: "a" }), 10);
  assertEquals(PersonView.getLength({ age: 10, name: "abc" }), 12);
  assertEquals(PersonView.getLength({ age: 10, name: undefined }), 9);
  assertEquals(
    FamilyView.getLength({
      name: "Dent",
      members: [
        { name: "Arthur", age: 30 },
        { name: "Trillian", age: 20 },
      ],
    }),
    66,
  );
});

test("[MapView#get] returns the JavaScript value at a given field", () => {
  const map = FamilyView.from({
    name: "Dent",
    members: [{ name: "Arthur", age: 30 }],
  });
  assertEquals(map.get("name"), "Dent");
  assertEquals(map.get("members"), [{ name: "Arthur", age: 30 }]);
});

test("[MapView#get] returns undefined if the value is not set", () => {
  const map = FamilyView.from({ name: "Dent" });
  assertEquals(map.get("members"), undefined);
});

test("[MapView#get] returns undefined if the field is not found", () => {
  const map = FamilyView.from({ name: "Dent" });
  // @ts-ignore TS2345
  assertEquals(map.get("z"), undefined);
});

test("[MapView#getView] returns a view of a given field", () => {
  const map = FamilyView.from({ name: "Dent" });
  assertEquals(map.getView("name") instanceof StringView, true);
});

test("[MapView#getView] returns undefined if the field is not set", () => {
  const map = FamilyView.from({ name: "Dent" });
  assertEquals(map.getView("members"), undefined);
});

test("[MapView#getView] returns undefined if the field is not found", () => {
  const map = FamilyView.from({ name: "Dent" });
  // @ts-ignore TS2345
  assertEquals(map.getView("z"), undefined);
});

test("[MapView#set] sets a JavaScript value of a field", () => {
  const map = FamilyView.from({
    name: "Dent",
    members: [
      { name: "Arthur", age: 30 },
      { name: "Trillian", age: 20 },
    ],
  });
  map.set("name", "Zaphod");
  assertEquals(map.get("name"), "Zaphod");
  map.set("name", "A");
  assertEquals(map.get("name"), "A");
  map.set("members", [{ name: "Arthur", age: 30 }]);
  assertEquals(map.get("members"), [{ name: "Arthur", age: 30 }]);
});

test("[MapView#set] does not set a value for a missing field", () => {
  const map = FamilyView.from({ name: "Dent" });
  map.set("members", []);
  assertEquals(map.get("members"), undefined);
});

test("[MapView#set] does not set a value for an undefined field", () => {
  const map = FamilyView.from({ name: "Dent" });
  // @ts-ignore TS2345
  assertEquals(map.set("z", 10), undefined);
});

test("[MapView#setView] copies a given view into a field", () => {
  const map = FamilyView.from({ name: "Dent" });
  const name = StringView.from("Zaphod");
  map.setView("name", name);
  assertEquals(map.get("name"), "Zaphod");
});

test("[MapView#setView] does not set view if the field is not found", () => {
  const map = FamilyView.from({ name: "Dent" });
  // @ts-ignore TS2345
  assertEquals(map.setView("z", new Uint8Array(10)), undefined);
});

test("[MapView#toJSON] returns an an object corresponding to the view", () => {
  const expected: Family = {
    name: "Dent",
    members: [
      { name: "Arthur", age: 30 },
      { name: "Trillian", age: 20 },
    ],
  };
  const map = FamilyView.from(expected);
  assertEquals(map.toJSON(), expected);
});

test("[MapView#getLength] returns the byte length of a field", () => {
  const person = PersonView.from({ name: "a", age: 10 });
  assertEquals(person.getLength("name"), 1);
});
