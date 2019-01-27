const StringView = require('../lib/string-view');

const Encoder = new TextEncoder();

describe('StringView', () => {
  describe('search', () => {
    it('returns the index of the first occurrence of the specified value', () => {
      const stringView = StringView.fromString('Vimesi');
      expect(stringView.search(Encoder.encode('im'))).toBe(1);
      expect(stringView.search(Encoder.encode('Vi'))).toBe(0);
      expect(stringView.search(Encoder.encode('Vimes'))).toBe(0);
      expect(stringView.search(Encoder.encode('x'))).toBe(-1);
      expect(stringView.search(Encoder.encode('Vix'))).toBe(-1);
      expect(stringView.search(Encoder.encode('s'))).toBe(4);
      expect(stringView.search(Encoder.encode('i'))).toBe(1);
      expect(stringView.search(Encoder.encode('i'), 2)).toBe(5);

      const longString = StringView.from(new Array(300).fill(0)
        .map(() => (Math.random() * 128) | 0));
      longString[0] = 97;
      expect(longString.length).toBe(300);
      expect(longString.search(Encoder.encode('ё'))).toBe(-1);
      expect(longString.search(Encoder.encode('a'))).toBe(0);
    });
  });

  describe('replace', () => {
    it('replaces a pattern with a replacement', () => {
      const stringView = StringView.fromString('Vimessaid');
      stringView.replace(Encoder.encode('s'), Encoder.encode('x'))
        .replace(Encoder.encode('d'), Encoder.encode('y'));
      expect(stringView.toString()).toBe('Vimexxaiy');
    });
  });

  describe('reverse', () => {
    it('reverses the characters of the StringView in-place', () => {
      const stringView = StringView.fromString('fooа😀←');
      expect(stringView.reverse().toString()).toBe('←😀аoof');
    });
  });

  describe('trim', () => {
    it('returns a StringView without trailing zeros', () => {
      const stringView = StringView.fromString('foo', 10);
      expect(stringView.length).toBe(10);
      expect(stringView.trim().length).toBe(3);
    });
  });

  describe('toString', () => {
    it('returns a string representation of the StringView', () => {
      const stringView = StringView.fromString('foo', 10);
      expect(stringView.toString()).toBe('foo');
    });
  });

  describe('fromString', () => {
    it('creates a StringView from a string', () => {
      const stringView = StringView.fromString('foo');
      expect(stringView.length).toBe(3);
      const stringViewSized = StringView.fromString('foo', 10);
      expect(stringViewSized.length).toBe(10);
      expect(stringView.subarray(0, 3)).toEqual(stringViewSized.subarray(0, 3));
    });
  });
});
