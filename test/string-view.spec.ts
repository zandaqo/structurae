import { StringView } from "../src/string-view";

// @ts-ignore
const Encoder = new TextEncoder();
const randomString = "qwertyasфы←😀ячсм";

describe("StringView", () => {
  describe("decode", () => {
    it("decodes encoded string", () => {
      const view = new StringView(Encoder.encode(randomString).buffer);
      expect(StringView.decode(view)).toBe(randomString);
      expect(StringView.decode(view, 1, 3)).toBe("wer");
      expect(StringView.decode(view, 2, 6)).toBe("ertyas");
      expect(StringView.decode(view, 6, 21)).toBe("asфы←😀ячсм");
    });
    it("decodes long encoded strings with TextDecoder", () => {
      const string = randomString.repeat(15);
      const view = new StringView(Encoder.encode(string).buffer);
      expect(StringView.decode(view)).toBe(string);
      expect(StringView.decode(view, 6, 399)).toBe(string.slice(6));
    });
  });
  describe("encode", () => {
    it("encodes a string", () => {
      const view = new StringView(new ArrayBuffer(30));
      const written = StringView.encode(randomString, view);
      expect(StringView.decode(view, 0, written)).toBe(randomString);
    });
    it("encodes a string into a limited size buffer", () => {
      const view = new StringView(new ArrayBuffer(30));
      const written = StringView.encode(randomString, view, 0, 8);
      expect(StringView.decode(view, 0, written)).toBe("qwertyas");
    });
    it("encodes long strings with TextEncoder", () => {
      const string = randomString.repeat(15);
      const view = new StringView(new ArrayBuffer(405));
      const written = StringView.encode(string, view);
      expect(StringView.decode(view, 0, written)).toBe(string);
    });
    it("encodes a long string into smaller buffer using TextEncoder", () => {
      const string = randomString.repeat(15);
      const view = new StringView(new ArrayBuffer(216));
      const written = StringView.encode(string, view, 0, 216);
      expect(StringView.decode(view, 0, written)).toBe(randomString.repeat(8));
    });
  });

  describe("characters", () => {
    it("iterates over the characters in the StringView", () => {
      const stringView = StringView.from("asфы←😀");
      const chars = [];
      for (const character of stringView.characters()) {
        chars.push(character);
      }
      expect(chars).toEqual(["a", "s", "ф", "ы", "←", "😀"]);
    });
  });

  describe("charAt", () => {
    it("returns a new string consisting of the single UTF character", () => {
      const stringView = StringView.from("asфы←😀");
      const chars = [];
      for (let i = 0; i < stringView.size; i++) {
        chars[i] = stringView.charAt(i);
      }
      expect(chars).toEqual(["a", "s", "ф", "ы", "←", "😀"]);
    });

    it("returns an empty string if the character is not found", () => {
      const invalidString = StringView.from("");
      expect(invalidString.charAt()).toBe("");
      expect(invalidString.charAt(1)).toBe("");
      expect(invalidString.charAt(10)).toBe("");
    });
  });

  describe("replace", () => {
    it("replaces a pattern with a replacement", () => {
      const stringView = StringView.from("Vimessaid");
      stringView
        .replace(Encoder.encode("s"), Encoder.encode("x"))
        .replace(Encoder.encode("d"), Encoder.encode("y"));
      expect(stringView.toString()).toBe("Vimexxaiy");
    });
  });

  describe("reverse", () => {
    it("reverses the characters of the StringView in-place", () => {
      const stringView = StringView.from("fooа😀←");
      expect(stringView.reverse().toString()).toBe("←😀аoof");
    });
  });

  describe("search", () => {
    it("returns the index of the first occurrence of the specified value", () => {
      const stringView = StringView.from("Vimesi");
      expect(stringView.search(Encoder.encode("im"))).toBe(1);
      expect(stringView.search(Encoder.encode("Vi"))).toBe(0);
      expect(stringView.search(Encoder.encode("Vimes"))).toBe(0);
      expect(stringView.search(Encoder.encode("x"))).toBe(-1);
      expect(stringView.search(Encoder.encode("Vix"))).toBe(-1);
      expect(stringView.search(Encoder.encode("s"))).toBe(4);
      expect(stringView.search(Encoder.encode("i"))).toBe(1);
      expect(stringView.search(Encoder.encode("i"), 2)).toBe(5);

      const array = new Uint8Array(
        new Array(300).fill(0).map(() => (Math.random() * 128) | 0)
      );
      const longString = new StringView(array.buffer);
      longString.setUint8(0, 97);
      expect(longString.byteLength).toBe(300);
      expect(longString.search(Encoder.encode("ё"))).toBe(-1);
      expect(longString.search(Encoder.encode("a"))).toBe(0);
    });
  });

  describe("size", () => {
    it("", () => {
      expect(StringView.from("asdf").size).toBe(4);
      expect(StringView.from("фыва").size).toBe(4);
      expect(StringView.from("😀😀fooа😀←").size).toBe(8);
    });
  });

  describe("substring", () => {
    it("returns a new string containing the specified part of the given string", () => {
      const stringView = StringView.from(randomString);
      expect(stringView.substring(0, 6)).toBe("qwerty");
      expect(stringView.substring(6, 11)).toBe("asфы←");
      expect(stringView.substring(6, 10)).toBe("asфы");
      expect(stringView.substring(6, 13)).toBe("asфы←😀я");
      expect(stringView.substring(10, 12)).toBe("←😀");
    });

    it("returns an empty string if characters are not found", () => {
      const invalidString = new StringView(
        new Uint8Array([128, 155, 134]).buffer
      );
      expect(invalidString.substring()).toBe("");
    });
  });

  describe("toString", () => {
    it("returns a string representation of the StringView", () => {
      const stringView = StringView.from("foo");
      expect(stringView.toString()).toBe("foo");
    });
  });

  describe("toJSON", () => {
    it("returns a string representation of the StringView", () => {
      const stringView = StringView.from("foo");
      expect(JSON.stringify(stringView)).toBe('"foo"');
    });
  });

  describe("trim", () => {
    it("returns a StringView without trailing zeros", () => {
      const stringView = StringView.from("foo");
      expect(stringView.trim().byteLength).toBe(3);
    });
  });

  describe("from", () => {
    it("creates a StringView from a string", () => {
      const stringView = StringView.from("foo");
      expect(stringView instanceof StringView).toBe(true);
      expect(stringView.byteLength).toBe(3);
      expect(stringView.toString()).toBe("foo");
    });
  });

  describe("getLength", () => {
    it("returns the size in bytes of a given string", () => {
      expect(StringView.getLength("asdf")).toBe(4);
      expect(StringView.getLength("фыва")).toBe(8);
      expect(StringView.getLength("😀😀fooа😀←")).toBe(20);
    });
  });
});
