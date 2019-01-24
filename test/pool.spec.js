const Pool = require('../lib/pool');

describe('Pool', () => {
  describe('constructor', () => {
    it('creates a Pool', () => {
      const pool = new Pool(10 * 16);
      expect(pool.length).toBe(10);
      expect(pool.nextAvailable).toBe(0);
      expect(pool[0]).toBe(65535);
    });
  });

  describe('acquire', () => {
    it('returns the first available index', () => {
      const pool = new Pool(2 * 16);
      expect(pool.acquire()).toBe(0);
      expect(pool.nextAvailable).toBe(0);
      expect(pool[0]).toBe(0b1111111111111110);
      expect(pool.acquire()).toBe(1);
      expect(pool.nextAvailable).toBe(0);
      expect(pool[0]).toBe(0b1111111111111100);
      for (let i = 2; i < 16; i++) {
        expect(pool.acquire()).toBe(i);
      }
      expect(pool.nextAvailable).toBe(1);
      expect(pool[0]).toBe(0);
      expect(pool[1]).toBe(65535);
      for (let i = 16; i < 32; i++) {
        expect(pool.acquire()).toBe(i);
      }
      expect(pool[1]).toBe(0);
      expect(pool.nextAvailable).toBe(-1);
      expect(pool.acquire()).toBe(-1);
    });
  });

  describe('release', () => {
    it('makes a given index available', () => {
      const pool = new Pool(2 * 16);
      for (let i = 0; i < 16; i++) {
        expect(pool.acquire()).toBe(i);
      }
      expect(pool.nextAvailable).toBe(1);
      expect(pool[0]).toBe(0);
      expect(pool[1]).toBe(65535);
      pool.release(6);
      expect(pool.nextAvailable).toBe(0);
      expect(pool[0]).toBe(64);
      expect(pool.acquire()).toBe(6);
      pool.release(6);
      pool.release(5);
      expect(pool.acquire()).toBe(5);
    });
  });
});
