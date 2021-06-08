import { Pool } from '../src/pool';

describe('Pool', () => {
  describe('constructor', () => {
    it('creates a Pool', () => {
      const pool = new Pool(10 * 16);
      expect(pool.length).toBe(5);
      expect(pool.nextAvailable).toBe(0);
      expect(pool[0]).toBe(4294967295);
    });
  });

  describe('get', () => {
    it('gets the next available index', () => {
      const pool = new Pool(2 * 32);
      expect(pool.get()).toBe(0);
      expect(pool.nextAvailable).toBe(0);
      expect(pool[0]).toBe(0b11111111111111111111111111111110);
      expect(pool.get()).toBe(1);
      expect(pool.nextAvailable).toBe(0);
      expect(pool[0]).toBe(0b11111111111111111111111111111100);
      for (let i = 2; i < 32; i++) {
        expect(pool.get()).toBe(i);
      }
      expect(pool.nextAvailable).toBe(1);
      expect(pool[0]).toBe(0);
      expect(pool[1]).toBe(4294967295);
      for (let i = 32; i < 64; i++) {
        expect(pool.get()).toBe(i);
      }
      expect(pool[1]).toBe(0);
      expect(pool.nextAvailable).toBe(-1);
      expect(pool.get()).toBe(-1);
    });
  });

  describe('free', () => {
    it('makes a given index available', () => {
      const pool = new Pool(2 * 32);
      for (let i = 0; i < 32; i++) {
        expect(pool.get()).toBe(i);
      }
      expect(pool.nextAvailable).toBe(1);
      expect(pool[0]).toBe(0);
      expect(pool[1]).toBe(4294967295);
      pool.free(6);
      expect(pool.nextAvailable).toBe(0);
      expect(pool[0]).toBe(64);
      expect(pool.get()).toBe(6);
      pool.free(6);
      pool.free(5);
      expect(pool.get()).toBe(5);
    });
  });

  describe('getLength', () => {
    it('calculates the required length of Uint16Array to hold the pool', () => {
      expect(Pool.getLength(10)).toBe(1);
      expect(Pool.getLength(16)).toBe(1);
      expect(Pool.getLength(33)).toBe(2);
      expect(Pool.getLength(64)).toBe(2);
    });
  });
});
