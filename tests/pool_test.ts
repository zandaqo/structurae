import { Pool } from "../pool.ts";
import { assertEquals } from "https://deno.land/std@0.98.0/testing/asserts.ts";

const { test } = Deno;

test("[Pool.constructor] creates a Pool", () => {
  const pool = new Pool(10 * 16);
  assertEquals(pool.length, 5);
  assertEquals(pool.nextAvailable, 0);
  assertEquals(pool[0], 4294967295);
});

test("[Pool#get] gets the next available index", () => {
  const pool = new Pool(2 * 32);
  assertEquals(pool.get(), 0);
  assertEquals(pool.nextAvailable, 0);
  assertEquals(pool[0], 0b11111111111111111111111111111110);
  assertEquals(pool.get(), 1);
  assertEquals(pool.nextAvailable, 0);
  assertEquals(pool[0], 0b11111111111111111111111111111100);
  for (let i = 2; i < 32; i++) {
    assertEquals(pool.get(), i);
  }
  assertEquals(pool.nextAvailable, 1);
  assertEquals(pool[0], 0);
  assertEquals(pool[1], 4294967295);
  for (let i = 32; i < 64; i++) {
    assertEquals(pool.get(), i);
  }
  assertEquals(pool[1], 0);
  assertEquals(pool.nextAvailable, -1);
  assertEquals(pool.get(), -1);
});

test("[Pool#free] makes a given index available", () => {
  const pool = new Pool(2 * 32);
  for (let i = 0; i < 32; i++) {
    assertEquals(pool.get(), i);
  }
  assertEquals(pool.nextAvailable, 1);
  assertEquals(pool[0], 0);
  assertEquals(pool[1], 4294967295);
  pool.free(6);
  assertEquals(pool.nextAvailable, 0);
  assertEquals(pool[0], 64);
  assertEquals(pool.get(), 6);
  pool.free(6);
  pool.free(5);
  assertEquals(pool.get(), 5);
});

test("[Pool.getLength] calculates the required length of Uint16Array to hold the pool", () => {
  assertEquals(Pool.getLength(10), 1);
  assertEquals(Pool.getLength(16), 1);
  assertEquals(Pool.getLength(33), 2);
  assertEquals(Pool.getLength(64), 2);
});
