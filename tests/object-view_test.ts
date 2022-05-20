import { ObjectView } from "../object-view.ts";
import { ViewConstructor } from "../view-types.ts";
import { ArrayView } from "../array-view.ts";
import { Uint8View } from "../numeric-view.ts";
import { StringView } from "../string-view.ts";
import { assertEquals } from "./test_deps.ts";
import { Constructor } from "../utility-types.ts";

const { test } = Deno;
interface Person {
  name: string;
  age: number;
  scores: Array<number>;
}

interface Family {
  name: string;
  members: Array<Person>;
}

const Scores: ViewConstructor<Array<number>> = class extends ArrayView<number> {
  static View = Uint8View;
  static itemLength = 1;
};

const PersonView: ViewConstructor<Person> = class extends ObjectView<Person> {
  static viewLength = 14;
  static layout = {
    name: { View: StringView, start: 0, length: 10 },
    age: { View: Uint8View, start: 10, length: 1, default: 100 },
    scores: { View: Scores, start: 11, length: 3 },
  };
  static fields = ["name", "age", "scores"];
  static defaultData = new Uint8Array(new ArrayBuffer(14));
  static ObjectConstructor = (function () {
    return { name: "", age: 0, scores: null };
  }) as unknown as Constructor<
    Person
  >;
};

PersonView.defaultData![10] = 100;

const Members: ViewConstructor<
  Array<Person>
> = class extends ArrayView<Person> {
  static View = PersonView;
  static itemLength = 14;
};

const FamilyView: ViewConstructor<Family> = class extends ObjectView<Family> {
  static viewLength = 52;
  static layout = {
    name: { View: StringView, start: 0, length: 10 },
    members: { View: Members, start: 10, length: 42 },
  };
  static fields = ["name", "members"];
  static defaultData = new Uint8Array(new ArrayBuffer(52));
  static ObjectConstructor = (function () {
    return { name: "", members: null };
  }) as unknown as Constructor<Family>;
};

test("[ObjectView.encode] encodes a JavaScript value into a given view", () => {
  const expected = {
    name: "Zaphod",
    age: 30,
    scores: [10, 20, 30],
  };
  const person = new PersonView(new ArrayBuffer(PersonView.viewLength));
  PersonView.encode(expected, person);
  assertEquals(person.toJSON(), expected);
});

test("[ObjectView.from] creates a new object view with the given data", () => {
  const expected = {
    name: "Zaphod",
    age: 30,
    scores: [10, 20, 30],
  };
  const person = PersonView.from(expected);
  assertEquals(person.toJSON(), expected);
});

test("[ObjectView.from] supports default field values", () => {
  const expected = {
    name: "Zaphod",
    scores: [10, 20, 30],
  };
  const person = PersonView.from(expected as Person);
  assertEquals(person.toJSON(), {
    name: "Zaphod",
    age: 100,
    scores: [10, 20, 30],
  });
});

test("[ObjectView.getLength] returns the byte length of an object view", () => {
  assertEquals(PersonView.getLength(), 14);
  assertEquals(FamilyView.getLength(), 52);
});

test("[ObjectView#get] returns the JavaScript value of a given field", () => {
  const person = PersonView.from({
    name: "Zaphod",
    age: 30,
    scores: [10],
  });
  assertEquals(person.get("age"), 30);
  assertEquals(person.get("name"), "Zaphod");
  assertEquals(person.get("scores"), [10, 0, 0]);
});

test("[ObjectView#getView] returns a view of a given field", () => {
  const person = PersonView.from({
    name: "Zaphod",
    age: 30,
    scores: [10],
  });
  assertEquals(person.getView("age") instanceof Uint8View, true);
  assertEquals(person.getView("age")!.get(), 30);
  assertEquals(person.getView("name") instanceof StringView, true);
  assertEquals(person.getView("scores") instanceof Scores, true);
});

test("[ObjectView#set] sets a given JavaScript value to a given field", () => {
  const person = PersonView.from({
    name: "Zaphod",
    age: 30,
    scores: [10],
  });
  person.set("name", "Arthur");
  person.set("age", 42);
  person.set("scores", [1, 2, 3]);
  assertEquals(person.get("name"), "Arthur");
  assertEquals(person.get("age"), 42);
  assertEquals(person.get("scores"), [1, 2, 3]);
});

test("[ObjectView#set] zeros out non-existing elements", () => {
  const person = PersonView.from({
    name: "Zaphod",
    age: 30,
    scores: [10, 20, 30],
  });
  person.set("scores", [3]);
  assertEquals(person.get("scores"), [3, 0, 0]);
});

test("[ObjectView#setView] copies a given view into a field", () => {
  const person = PersonView.from({
    name: "Zaphod",
    age: 30,
    scores: [10, 20, 30],
  });
  const value = new StringView(new ArrayBuffer(10));
  value.setUint8(0, 35);
  value.setUint8(9, 39);
  person.setView("name", value);
  const actual = person.getView("name")!;
  assertEquals(actual, value);
  assertEquals(actual.buffer !== value.buffer, true);
});

test("[ObjectView#getLength] returns the byte length of a field", () => {
  const person = PersonView.from({ name: "a", age: 10, scores: [] });
  assertEquals(person.getLength("name"), 10);
});
