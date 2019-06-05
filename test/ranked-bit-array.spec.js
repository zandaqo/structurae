const RankedBitArray = require('../lib/ranked-bit-array');

describe('RankedBitArray', () => {
  describe('constructor', () => {
    it('creates a bit array of a required size', () => {
      const array = new RankedBitArray({ size: 100 });
      expect(array instanceof RankedBitArray).toBe(true);
      expect(array instanceof Uint16Array).toBe(true);
      expect(array.length).toBe(14);
    });

    it('creates a bit array from a given buffer', () => {
      const buffer = new ArrayBuffer(28);
      const array = new RankedBitArray(undefined, buffer);
      expect(array instanceof RankedBitArray).toBe(true);
      expect(array.buffer).toBe(buffer);
      expect(array.length).toBe(14);
    });
  });

  describe('get', () => {
    it('returns individual bits', () => {
      const array = new RankedBitArray(undefined, [2, 1]);
      expect(array.get(0)).toBe(0);
      expect(array.get(1)).toBe(1);
      expect(array.get(2)).toBe(0);
    });
  });

  describe('set', () => {
    it('sets individual bets', () => {
      const array = new RankedBitArray({ size: 16 });
      expect(array.get(0)).toBe(0);
      expect(array.get(1)).toBe(0);
      expect(array[1]).toBe(0);
      array.set(0);
      expect(array.get(0)).toBe(1);
      expect(array[1]).toBe(1);
      array.set(0, 0);
      expect(array.get(0)).toBe(0);
      expect(array[1]).toBe(0);
    });

    it('proxies to TypedArray#set if array like parameter is supplied', () => {
      const array = new RankedBitArray({ size: 16 });
      array.set([1, 2], 0);
      expect(Array.from(array)).toEqual([1, 2]);
    });
  });

  describe('size', () => {
    it('returns the amount of available bits in the array', () => {
      const array = new RankedBitArray({ size: 16 });
      expect(array.size).toBe(16);
      expect(array.length).toBe(2);
    });
  });

  describe('rank', () => {
    it('returns the rank of a bit at a given index', () => {
      const array = new RankedBitArray({ size: 32 });
      array.set(20);
      array.set(16);
      array.set(9);
      array.set(5);
      expect(array.rank(25)).toBe(4);
      expect(array.rank(20)).toBe(4);
      expect(array.rank(16)).toBe(3);
      expect(array.rank(15)).toBe(2);
      expect(array.rank(4)).toBe(0);
    });
  });

  describe('select', () => {
    it('the select of a bit at a given index', () => {
      const array = new RankedBitArray({ size: 320 });
      array.set(300);
      array.set(20);
      array.set(16);
      array.set(9);
      array.set(5);
      expect(array.select(4)).toBe(20);
      expect(array.select(3)).toBe(16);
      expect(array.select(2)).toBe(9);
      expect(array.select(1)).toBe(5);
      expect(array.select(5)).toBe(300);
    });
  });

  describe('getLength', () => {
    it('returns the length of underlying TypedArray required to hold the bit array', () => {
      expect(RankedBitArray.getLength(16)).toBe(2);
      expect(RankedBitArray.getLength(17)).toBe(4);
      expect(RankedBitArray.getLength(32)).toBe(4);
      expect(RankedBitArray.getLength(65)).toBe(10);
      expect(RankedBitArray.getLength(160)).toBe(20);
    });
  });
});
