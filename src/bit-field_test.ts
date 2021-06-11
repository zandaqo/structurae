import { BitField, BitFieldMixin } from "../src/bit-field.ts";
import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std/testing/asserts.ts";

const { test } = Deno;

const Field = BitFieldMixin({ width: 16, height: 15 });
const PersonFlags = BitFieldMixin({
  human: 1,
  gender: 1,
  tall: 1,
});

test("[BitFieldMixin] throws if the total size of a field exceeds 31 bits", () => {
  assertThrows(() => BitFieldMixin({ a: 1, b: 31 }), TypeError);
});

test("[BitField.constructor] creates an instance with a given numerical value", () => {
  assertEquals(new Field().value, 0);
  assertEquals(new Field(2147483647).value, 2147483647);
  assertEquals(new PersonFlags(5).value, 5);
});

test("[BitField.constructor] creates an instance from an object", () => {
  assertEquals(new Field({ width: 65535, height: 32767 }).value, 2147483647);
  assertEquals(new Field([65535, 32767]).value, 2147483647);
  assertEquals(new PersonFlags({ human: 1, gender: 0, tall: 1 }).value, 5);
});

test("[BitField.constructor] creates an instance from another bitfield", () => {
  assertEquals(
    new Field(new Field({ width: 65535, height: 32767 })).value,
    2147483647,
  );
  assertEquals(
    new PersonFlags(new PersonFlags({ human: 1, gender: 0, tall: 1 })).value,
    5,
  );
});

test("[BitField#get] returns a value of a given field", () => {
  assertEquals(new Field({ width: 65535, height: 32767 }).get("width"), 65535);
  assertEquals(new Field({ width: 65535, height: 32767 }).get("height"), 32767);
  assertEquals(
    new PersonFlags({ human: 1, gender: 0, tall: 1 }).get("gender"),
    0,
  );
  assertEquals(new PersonFlags(5).get("tall"), 1);
});

test("[BitField#set] sets a given value to a given field", () => {
  assertEquals(
    new Field({ width: 65535, height: 32760 })
      .set("height", 32767)
      .get("height"),
    32767,
  );
  assertEquals(
    new PersonFlags({ human: 1, gender: 0, tall: 1 })
      .set("gender", 1)
      .get("gender"),
    1,
  );
  assertEquals(
    new PersonFlags({ human: 1, gender: 0, tall: 1 })
      .set("gender")
      .get("gender"),
    1,
  );
  assertEquals(
    new PersonFlags({ human: 1, gender: 0, tall: 1 })
      .set("human", 0)
      .get("human"),
    0,
  );
});

test("[BitField#has] checks if all specified fields are set in a given bitfield instance", () => {
  assertEquals(
    new PersonFlags({ human: 1, gender: 0, tall: 1 }).has("human", "tall"),
    true,
  );
  assertEquals(
    new PersonFlags({ human: 1, gender: 1, tall: 1 }).has("human", "tall"),
    true,
  );
  assertEquals(
    new PersonFlags({ human: 0, gender: 1, tall: 1 }).has("human", "tall"),
    false,
  );
  assertEquals(
    new PersonFlags({ human: 1, gender: 1, tall: 0 }).has("human", "tall"),
    false,
  );
  assertEquals(
    new PersonFlags({ human: 0, gender: 1, tall: 0 }).has("human", "tall"),
    false,
  );
  assertEquals(
    new PersonFlags({ human: 0, gender: 1, tall: 0 }).has("gender"),
    true,
  );
});

test("[BitField#match] partially matches instance", () => {
  const field = new Field({ width: 8, height: 9 });
  assertEquals(field.match({ width: 8 }), true);
  assertEquals(field.match(Field.getMatcher({ width: 8 })), true);
  assertEquals(field.match({ width: 7 }), false);
  assertEquals(field.match({ height: 9 }), true);
  assertEquals(field.match({ height: 7 }), false);
  assertEquals(field.match({ width: 8, height: 9 }), true);
  assertEquals(field.match({ width: 8, height: 7 }), false);
});

test("[BitField#toJSON] returns the value of an instance as a number for JSON", () => {
  assertEquals(
    JSON.parse(JSON.stringify(new Field({ width: 20, height: 1 }))),
    65556,
  );
});

test("[BitField#toObject] returns a plain object representation of an instance", () => {
  assertEquals(new Field({ width: 20, height: 1 }).toObject(), {
    width: 20,
    height: 1,
  });
  assertEquals(
    new PersonFlags({ human: 1, gender: 0, tall: 1 }).toObject(),
    {
      human: 1,
      gender: 0,
      tall: 1,
    },
  );
});

test("[BitField#toString] returns a string representing the value of the instance", () => {
  assertEquals(`${new Field({ width: 20, height: 1 })}`, "65556");
});

test("[BitField#valueOf] returns the value of an instance as a number", () => {
  assertEquals(+new Field({ width: 20, height: 1 }), 65556);
  assertEquals(+new PersonFlags({ human: 1, gender: 0, tall: 1 }), 5);
});

test("[BitField.encode] encodes a given list of numbers into a single number representing the bitfield", () => {
  assertEquals(Field.encode([20, 1]), 65556);
});

test("[BitField.encode] encodes a given map of fields and their values into a single number representing the bitfield", () => {
  assertEquals(Field.encode({ width: 20, height: 1 }), 65556);
});

test("[BitField.isValid] checks if a given set of values is valued according to the schema", () => {
  class Person extends BitField {}
  Person.schema = { age: 7, gender: 1 };
  Person.initialize();
  assertEquals(Person.isValid({}), true);
  assertEquals(Person.isValid({ age: 20, gender: 0 }), true);
  assertEquals(Person.isValid({ age: 200, gender: -1 }), false);
  assertEquals(Person.isValid({ age: 20 }), true);
});

test("[BitField.getMinSize] calculates the minimum amount of bits to hold a given number", () => {
  for (let i = 1; i < 53; i++) {
    const number = 2 ** i;
    assertEquals(BitField.getMinSize(number), i + 1);
    assertEquals(BitField.getMinSize(number - 1), i);
  }
  assertEquals(BitField.getMinSize(Number.MAX_SAFE_INTEGER), 53);
});

test("[BitField.getMatcher] returns matcher to partially match an instance", () => {
  Field.initialize();
  const matcher = Field.getMatcher({ width: 10 });
  assertEquals(matcher, [10, -2147418113]);
});

test("[BitField#[Symbol.iterator]] iterates over numbers stored in the instance", () => {
  const field = new Field({ width: 20, height: 1 });
  assertEquals(Array.from(field), [20, 1]);
  assertEquals([...field], [20, 1]);
  const [width, height] = field;
  assertEquals(width, 20);
  assertEquals(height, 1);
});
