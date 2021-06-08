import { ViewConstructor } from "../src/view-types";
import { StringView } from "../src/string-view";
import { Uint8View } from "../src/numeric-view";
import { VectorView } from "../src/vector-view";
import { MapView } from "../src/map-view";

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
};

FamilyView.defaultData!.set([90, 97, 112, 104, 111, 100]); // default name is Zaphod

describe("MapView", () => {
  describe("get", () => {
    it("returns the JavaScript value at a given field", () => {
      const map = FamilyView.from({
        name: "Dent",
        members: [{ name: "Arthur", age: 30 }],
      });
      expect(map.get("name")).toBe("Dent");
      expect(map.get("members")).toEqual([{ name: "Arthur", age: 30 }]);
    });

    it("returns undefined if the value is not set", () => {
      const map = FamilyView.from({ name: "Dent" });
      expect(map.get("members")).toBe(undefined);
    });

    it("returns undefined if the field is not found", () => {
      const map = FamilyView.from({ name: "Dent" });
      //@ts-ignore
      expect(map.get("z")).toBe(undefined);
    });
  });

  describe("getView", () => {
    it("returns a view of a given field", () => {
      const map = FamilyView.from({ name: "Dent" });
      expect(map.getView("name") instanceof StringView).toBe(true);
    });

    it("returns undefined if the field is not set", () => {
      const map = FamilyView.from({ name: "Dent" });
      expect(map.getView("members")).toBe(undefined);
    });

    it("returns undefined if the field is not found", () => {
      const map = FamilyView.from({ name: "Dent" });
      //@ts-ignore
      expect(map.getView("z")).toBe(undefined);
    });
  });

  describe("set", () => {
    it("sets a JavaScript value of a field", () => {
      const map = FamilyView.from({
        name: "Dent",
        members: [
          { name: "Arthur", age: 30 },
          { name: "Trillian", age: 20 },
        ],
      });
      map.set("name", "Zaphod");
      expect(map.get("name")).toBe("Zaphod");
      map.set("name", "A");
      expect(map.get("name")).toBe("A");
      map.set("members", [{ name: "Arthur", age: 30 }]);
      expect(map.get("members")).toEqual([{ name: "Arthur", age: 30 }]);
    });

    it("does not set a value for a missing field", () => {
      const map = FamilyView.from({ name: "Dent" });
      map.set("members", []);
      expect(map.get("members")).toBe(undefined);
    });

    it("does not set a value for an undefined field", () => {
      const map = FamilyView.from({ name: "Dent" });
      //@ts-ignore
      expect(map.set("z", 10)).toBe(undefined);
    });
  });

  describe("setView", () => {
    it("copies a given view into a field", () => {
      const map = FamilyView.from({ name: "Dent" });
      const name = StringView.from("Zaphod");
      map.setView("name", name);
      expect(map.get("name")).toBe("Zaphod");
    });

    it("does not set view if the field is not found", () => {
      const map = FamilyView.from({ name: "Dent" });
      //@ts-ignore
      expect(map.setView("z", new Uint8Array(10))).toBe(undefined);
    });
  });

  describe("toJSON", () => {
    it("returns an an object corresponding to the view", () => {
      const expected: Family = {
        name: "Dent",
        members: [
          { name: "Arthur", age: 30 },
          { name: "Trillian", age: 20 },
        ],
      };
      const map = FamilyView.from(expected);
      expect(map.toJSON()).toEqual(expected);
    });
  });

  describe("getLength", () => {
    it("returns the byte length of a map view to hold a given object", () => {
      expect(PersonView.getLength({ age: 10, name: "a" })).toBe(10);
      expect(PersonView.getLength({ age: 10, name: "abc" })).toBe(12);
      expect(
        FamilyView.getLength({
          name: "Dent",
          members: [
            { name: "Arthur", age: 30 },
            { name: "Trillian", age: 20 },
          ],
        })
      ).toBe(66);
    });
  });

  describe("from", () => {
    it("creates a map view from a given object", () => {
      const expected: Family = {
        name: "Dent",
        members: [
          { name: "Arthur", age: 30 },
          { name: "Trillian", age: 20 },
        ],
      };
      const map = FamilyView.from(expected);
      expect(map.toJSON()).toEqual(expected);
    });

    it("treats undefined and null fields as missing", () => {
      const expected: Family = {
        name: "Dent",
        members: [
          { name: "Arthur", age: 30 },
          undefined,
          { name: "Trillian", age: 20 },
        ],
      };
      const map = FamilyView.from(expected);
      expect(map.toJSON()).toEqual(expected);
    });

    it("truncates strings and arrays longer than set max sizes", () => {
      const expected: Family = {
        name: "Arthur Zaphod Dent",
        members: [],
      };
      const map = FamilyView.from(expected);
      expect(map.toJSON()).toEqual({
        name: "Arthur Zap",
        members: [],
      });
    });

    it("sets default values for required fields", () => {
      // todo allow optional fields for Views
      //@ts-ignore
      const map = FamilyView.from({
        members: [],
      });
      expect(map.toJSON()).toEqual({
        name: "Zaphod",
        members: [],
      });
    });
  });
});
