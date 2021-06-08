import { BitArray } from '../src/bit-array';

describe('BitArray', () => {
  describe('constructor', () => {
    it('creates a bit array of a required size', () => {
      const array = new BitArray(100);
      expect(array instanceof BitArray).toBe(true);
      expect(array instanceof Uint32Array).toBe(true);
      expect(array.length).toBe(4);
    });

    it('creates a bit array from a given buffer', () => {
      const buffer = new ArrayBuffer(32);
      const array = new BitArray(buffer);
      expect(array instanceof BitArray).toBe(true);
      expect(array.buffer).toBe(buffer);
      expect(array.length).toBe(8);
    });
  });

  describe('getBit', () => {
    it('returns individual bits', () => {
      const array = new BitArray([2, 1]);
      expect(array.getBit(0)).toBe(0);
      expect(array.getBit(1)).toBe(1);
      expect(array.getBit(2)).toBe(0);
    });
  });

  describe('setBit', () => {
    it('sets individual bets', () => {
      const array = new BitArray(32);
      expect(array.getBit(0)).toBe(0);
      expect(array.getBit(1)).toBe(0);
      expect(array[0]).toBe(0);
      array.setBit(0);
      expect(array.getBit(0)).toBe(1);
      expect(array[0]).toBe(1);
      array.setBit(0, 0);
      expect(array.getBit(0)).toBe(0);
      expect(array[0]).toBe(0);
      array.setBit(31);
      expect(array.getBit(31)).toBe(1);
    });
  });

  describe('size', () => {
    it('returns the amount of available bits in the array', () => {
      const array = new BitArray(32);
      expect(array.size).toBe(32);
      expect(array.length).toBe(1);
    });
  });

  describe('getLength', () => {
    it('returns the length of underlying TypedArray required to hold the bit array', () => {
      expect(BitArray.getLength(16)).toBe(1);
      expect(BitArray.getLength(32)).toBe(1);
      expect(BitArray.getLength(33)).toBe(2);
      expect(BitArray.getLength(65)).toBe(3);
      expect(BitArray.getLength(160)).toBe(5);
    });
  });

  describe('species', () => {
    it('returns Uint32Array when sliced', () => {
      const grid = new BitArray();
      expect(grid.slice() instanceof Uint32Array).toBe(true);
    });
  });
});
