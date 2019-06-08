const RankedBitArray = require('../lib/ranked-bit-array');

describe('RankedBitArray', () => {
  describe('constructor', () => {
    it('creates a bit array of a required size', () => {
      const array = new RankedBitArray(100);
      expect(array instanceof RankedBitArray).toBe(true);
      expect(array instanceof Uint32Array).toBe(true);
      expect(array.length).toBe(8);
    });

    it('creates a bit array from a given buffer', () => {
      const buffer = new ArrayBuffer(32);
      const array = new RankedBitArray(buffer);
      expect(array instanceof RankedBitArray).toBe(true);
      expect(array.buffer).toBe(buffer);
      expect(array.length).toBe(8);
    });
  });

  describe('setBit', () => {
    it('sets individual bits and updates ranks', () => {
      const array = new RankedBitArray(16);
      expect(array.getBit(0)).toBe(0);
      expect(array.getBit(1)).toBe(0);
      expect(array[1]).toBe(0);
      array.setBit(0);
      expect(array.getBit(0)).toBe(1);
      expect(array[1]).toBe(1);
      array.setBit(0, 0);
      expect(array.getBit(0)).toBe(0);
      expect(array[1]).toBe(0);
    });
  });

  describe('size', () => {
    it('returns the amount of available bits in the array', () => {
      const array = new RankedBitArray(32);
      expect(array.size).toBe(32);
      expect(array.length).toBe(2);
    });
  });

  describe('rank', () => {
    it('returns the rank of a bit at a given index', () => {
      const array = new RankedBitArray(64);
      array.setBit(33)
        .setBit(16)
        .setBit(9)
        .setBit(5);
      expect(array.rank(36)).toBe(4);
      expect(array.rank(33)).toBe(3);
      expect(array.rank(16)).toBe(2);
      expect(array.rank(15)).toBe(2);
      expect(array.rank(4)).toBe(0);
    });
  });

  describe('select', () => {
    it('the select of a bit at a given index', () => {
      const array = new RankedBitArray(320);
      array.setBit(300)
        .setBit(20)
        .setBit(16)
        .setBit(9)
        .setBit(5);
      expect(array.select(4)).toBe(20);
      expect(array.select(3)).toBe(16);
      expect(array.select(2)).toBe(9);
      expect(array.select(1)).toBe(5);
      expect(array.select(5)).toBe(300);
      expect(array.select(6)).toBe(-1);
    });
  });

  describe('getLength', () => {
    it('returns the length of underlying TypedArray required to hold the bit array', () => {
      expect(RankedBitArray.getLength(16)).toBe(2);
      expect(RankedBitArray.getLength(32)).toBe(2);
      expect(RankedBitArray.getLength(33)).toBe(4);
      expect(RankedBitArray.getLength(65)).toBe(6);
      expect(RankedBitArray.getLength(160)).toBe(10);
    });
  });
});
