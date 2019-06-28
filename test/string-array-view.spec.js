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

  describe('set', () => {
    it('sets string at a given index', () => {
      const array = StringArrayView.of(4, 4);
      expect(array.get(0).toString()).toBe('');
      expect(array.set(0, 'abcd').get(0).toString()).toBe('abcd');
      expect(array.set(0, 'ab').get(0).toString()).toBe('ab');
    });
  });

  describe('toObject', () => {
    it('returns an array of strings in the array view', () => {
      const strings = ['abc', 'cbd', 'ab'];
      const array = StringArrayView.from(strings, 4);
      expect(array.toObject()).toEqual(strings);
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
      expect(Array.from(array).map(i => i.toString())).toEqual(expected);
    });
  });
});
