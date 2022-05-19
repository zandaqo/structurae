import { BigBitFieldMixin } from "../big-bit-field.ts";
import { assertEquals } from "../dev_deps.ts";

const { test } = Deno;

const LargeField = BigBitFieldMixin({
  location: 7,
  open: 1,
  width: 31,
  height: 15,
});

test("[BigBitField.constructor] creates an instance with a given numerical value", () => {
  assertEquals(new LargeField().value, BigInt(0));
  assertEquals(new LargeField(BigInt(1375759717)).value, BigInt(1375759717));
});

test("[BigBitField.constructor] creates an instance from a list of values", () => {
  assertEquals(
    new LargeField({
      location: 20,
      open: 1,
      width: 3500,
      height: 5,
    }).value,
    BigInt("2748779965588"),
  );
  assertEquals(new LargeField([20, 1, 3500, 5]).value, BigInt("2748779965588"));
});

test("[BigBitField.constructor] creates an instance from another BigBitField", () => {
  assertEquals(new LargeField(new LargeField()).value, BigInt(0));
  assertEquals(
    new LargeField(new LargeField(BigInt(1375759717))).value,
    BigInt(1375759717),
  );
});

test("[BigBitField.gitMinSize] creates an instance from another BigBitField", () => {
  assertEquals(LargeField.getMinSize(4375759717), 33);
});

test("[BigBitField#get] returns a value of a given field", () => {
  assertEquals(
    new LargeField({
      location: 20,
      open: 1,
      width: 3500,
      height: 5,
    }).get("width"),
    3500,
  );
  assertEquals(new LargeField(BigInt("2748779965588")).get("width"), 3500);
});

test("[BigBitField#set] sets a given value to a given field", () => {
  assertEquals(
    new LargeField({
      location: 20,
      open: 1,
      width: 3500,
      height: 5,
    })
      .set("width", 3000)
      .get("width"),
    3000,
  );
  assertEquals(
    new LargeField(BigInt(1375759717)).set("location", 21).get("location"),
    21,
  );
});

test("[BigBitField#has] checks if all specified fields are set in a given bitfield instance", () => {
  const largeField = new LargeField({
    location: 20,
    open: 0,
    width: 3500,
    height: 0,
  });
  assertEquals(largeField.has("open"), false);
  assertEquals(largeField.set("open").has("open"), true);
});

test("[BigBitField#match] partially matches instance", () => {
  const largeField = new LargeField({
    location: 20,
    open: 1,
    width: 3500,
    height: 5,
  });
  assertEquals(largeField.match({ width: 3500 }), true);
  assertEquals(largeField.match({ width: 3400 }), false);
  assertEquals(largeField.match({ location: 20, height: 5 }), true);
  assertEquals(largeField.match({ location: 20, height: 7 }), false);
  assertEquals(largeField.match({ location: 20, height: 5, open: 1 }), true);
  assertEquals(largeField.match(LargeField.getMatcher({ width: 3500 })), true);
});

test("[BigBitField#toJSON] returns the value of an instance as a number for JSON", () => {
  assertEquals(
    new LargeField([20, 1, 3500, 5]).toJSON(),
    BigInt("2748779965588"),
  );
});

test("[BigBitField#toObject] returns a plain object representation of an instance", () => {
  assertEquals(
    new LargeField({
      location: 20,
      open: 1,
      width: 3500,
      height: 5,
    }).toObject(),
    {
      location: 20,
      open: 1,
      width: 3500,
      height: 5,
    },
  );
});

test("[BigBitField#toString] returns a string representing the value of the instance", () => {
  assertEquals(
    `${new LargeField({
      location: 20,
      open: 1,
      width: 3500,
      height: 5,
    })}`,
    "2748779965588",
  );
});

test("[BigBitField#valueOf] returns the value of an instance as a number", () => {
  assertEquals(
    BigInt(1) +
      new LargeField({
        location: 20,
        open: 1,
        width: 3500,
        height: 5,
      }).valueOf(),
    BigInt("2748779965589"),
  );
});

test("[BigBitField.isValid] checks if given pairs of Person name and value are valid according to the schema", () => {
  assertEquals(LargeField.isValid({ location: 21 }), true);
  assertEquals(LargeField.isValid({ location: 200 }), false);
  assertEquals(LargeField.isValid({ location: -200 }), false);
  assertEquals(LargeField.isValid({ location: 21, open: 1 }), true);
  assertEquals(LargeField.isValid({ location: 21, open: 4 }), false);
});

test("[BigBitField.getMatcher] returns matcher to partially match an instance", () => {
  const bigMatcher = LargeField.getMatcher({ location: 2, width: 12 });
  assertEquals(bigMatcher[0], BigInt(3074));
  assertEquals(bigMatcher[1], BigInt("18014948265295743"));
});

test("[BigBitField#[Symbol.iterator]] iterates over numbers stored in the instance", () => {
  const data = {
    location: 20,
    open: 1,
    width: 3500,
    height: 5,
  };
  const largeField = new LargeField(data);
  assertEquals(Array.from(largeField), [20, 1, 3500, 5]);
  assertEquals([...largeField], [20, 1, 3500, 5]);
  const [location, open] = largeField;
  assertEquals(location, 20);
  assertEquals(open, 1);
});
