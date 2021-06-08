import { ObjectView } from "../src/object-view";
import { ViewConstructor } from "../src/view-types";
import { ArrayView } from "../src/array-view";
import { Uint8View } from "../src/numeric-view";
import { StringView } from "../src/string-view";

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
};

describe("ObjectView", () => {
  describe("get", () => {
    it("returns the JavaScript value of a given field", () => {
      const person = PersonView.from({
        name: "Zaphod",
        age: 30,
        scores: [10],
      });
      expect(person.get("age")).toBe(30);
      expect(person.get("name")).toBe("Zaphod");
      expect(person.get("scores")).toEqual([10, 0, 0]);
    });
  });

  describe("getView", () => {
    it("returns a view of a given field", () => {
      const person = PersonView.from({
        name: "Zaphod",
        age: 30,
        scores: [10],
      });
      expect(person.getView("age") instanceof Uint8View).toBe(true);
      expect(person.getView("age")!.get()).toBe(30);
      expect(person.getView("name") instanceof StringView).toBe(true);
      expect(person.getView("scores") instanceof Scores).toBe(true);
    });
  });

  describe("set", () => {
    it("sets a given JavaScript value to a given field", () => {
      const person = PersonView.from({
        name: "Zaphod",
        age: 30,
        scores: [10],
      });
      person.set("name", "Arthur");
      person.set("age", 42);
      person.set("scores", [1, 2, 3]);
      expect(person.get("name")).toBe("Arthur");
      expect(person.get("age")).toBe(42);
      expect(person.get("scores")).toEqual([1, 2, 3]);
    });

    it("zeros out non-existing elements", () => {
      const person = PersonView.from({
        name: "Zaphod",
        age: 30,
        scores: [10, 20, 30],
      });
      person.set("scores", [3]);
      expect(person.get("scores")).toEqual([3, 0, 0]);
    });
  });

  describe("setView", () => {
    it("copies a given view into a field", () => {
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
      expect(actual).toEqual(value);
      expect(actual.buffer !== value.buffer).toBe(true);
    });
  });

  describe("from", () => {
    it("creates a new object view with the given data", () => {
      const expected = {
        name: "Zaphod",
        age: 30,
        scores: [10, 20, 30],
      };
      const person = PersonView.from(expected);
      expect(person.toJSON()).toEqual(expected);
    });
    it("supports default field values", () => {
      const expected = {
        name: "Zaphod",
        scores: [10, 20, 30],
      };
      //@ts-ignore
      const person = PersonView.from(expected);
      expect(person.toJSON()).toEqual({
        name: "Zaphod",
        age: 100,
        scores: [10, 20, 30],
      });
    });
  });

  describe("getLength", () => {
    it("returns the byte length of an object view", () => {
      expect(PersonView.getLength()).toBe(14);
      expect(FamilyView.getLength()).toBe(52);
    });
  });
});
