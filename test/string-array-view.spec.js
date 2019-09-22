const { StringArrayView, StringView } = require('../index');

describe('StringViewArray', () => {
  describe('get', () => {
    it('returns the string view at a given index', () => {
      const array = StringArrayView.from(['abc', 'cbd', 'ab'], 4);
      const view = array.get(1);
      expect(view instanceof StringView).toBe(true);
      expect(view.toString()).toBe('cbd');
      expect(view.length).toBe(4);
    });
  });

  describe('getValue', () => {
    it('returns the string at a given index', () => {
      const array = StringArrayView.from(['abc', 'cbd', 'ab'], 4);
      expect(array.getValue(0)).toBe('abc');
      expect(array.getValue(1)).toBe('cbd');
      expect(array.getValue(2)).toBe('ab');
    });
  });

  describe('set', () => {
    it('sets string at a given index', () => {
      const array = StringArrayView.of(4, 4);
      expect(array.get(0).toString()).toBe('');
      expect(array.set(0, 'abcd').getValue(0)).toBe('abcd');
      expect(array.set(0, 'ab').getValue(0)).toBe('ab');
    });
  });

  describe('setView', () => {
    it('sets a string view at a given index', () => {
      const array = StringArrayView.of(4, 4);
      expect(array.setView(0, StringView.fromString('abcd')).getValue(0)).toBe('abcd');
      expect(array.setView(1, StringView.fromString('ab')).getValue(1)).toBe('ab');
    });
  });

  describe('toObject', () => {
    it('is equivalent to toJSON', () => {
      const strings = StringArrayView.from(['asdf'], 4);
      expect(strings.toObject()).toEqual(strings.toJSON());
    });
  });

  describe('toJSON', () => {
    it('returns an array of strings in the array view', () => {
      const strings = ['abc', 'cbd', 'ab'];
      const array = StringArrayView.from(strings, 4);
      expect(array.toJSON()).toEqual(strings);
    });
  });

  describe('from', () => {
    it('creates a string a string array from an array of strings', () => {
      const array = StringArrayView.from(['abc', 'cbd', 'ab'], 4);
      expect(array instanceof StringArrayView).toBe(true);
      expect(array.bytes.byteLength).toBe(12);
      expect(array.stringLength).toBe(4);
      expect(array.get(0).toString()).toBe('abc');
    });
  });

  describe('getLength', () => {
    it('returns the byte length required to hold the array', () => {
      expect(StringArrayView.getLength(10, 5)).toBe(50);
    });
  });

  describe('of', () => {
    it('creates an empty string array of specified size', () => {
      const array = StringArrayView.of(10, 10);
      expect(array instanceof StringArrayView).toBe(true);
      expect(array.bytes.byteLength).toBe(100);
      expect(array.stringLength).toBe(10);
      expect(array.bytes instanceof Uint8Array).toBe(true);
    });
  });

  describe('iterator', () => {
    it('iterates over strings stored in the array', () => {
      const expected = ['abc', 'cbd', 'ab'];
      const array = StringArrayView.from(expected, 4);
      expect(Array.from(array).map((i) => i.toString())).toEqual(expected);
    });
  });
});
