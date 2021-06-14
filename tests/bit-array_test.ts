import { BitArray } from "../bit-array.ts";
import { assertEquals } from "https://deno.land/std@0.98.0/testing/asserts.ts";

const { test } = Deno;

test("[BitArray.constructor] creates a bit array of a required size", () => {
  const array = new BitArray(100);
  assertEquals(array instanceof BitArray, true);
  assertEquals(array instanceof Uint32Array, true);
  assertEquals(array.length, 4);
});

test("[BitArray.constructor] creates a bit array from a given buffer", () => {
  const buffer = new ArrayBuffer(32);
  const array = new BitArray(buffer);
  assertEquals(array instanceof BitArray, true);
  assertEquals(array.buffer, buffer);
  assertEquals(array.length, 8);
});

test("[BitArray#getBit] returns individual bits", () => {
  const array = new BitArray([2, 1]);
  assertEquals(array.getBit(0), 0);
  assertEquals(array.getBit(1), 1);
  assertEquals(array.getBit(2), 0);
});

test("[BitArray#setBit] sets individual bets", () => {
  const array = new BitArray(32);
  assertEquals(array.getBit(0), 0);
  assertEquals(array.getBit(1), 0);
  assertEquals(array[0], 0);
  array.setBit(0);
  assertEquals(array.getBit(0), 1);
  assertEquals(array[0], 1);
  array.setBit(0, 0);
  assertEquals(array.getBit(0), 0);
  assertEquals(array[0], 0);
  array.setBit(31);
  assertEquals(array.getBit(31), 1);
});

test("[BitArray#size] returns the amount of available bits in the array", () => {
  const array = new BitArray(32);
  assertEquals(array.size, 32);
  assertEquals(array.length, 1);
});

test("[BitArray.getLength] returns the length of underlying TypedArray required to hold the bit array", () => {
  assertEquals(BitArray.getLength(16), 1);
  assertEquals(BitArray.getLength(32), 1);
  assertEquals(BitArray.getLength(33), 2);
  assertEquals(BitArray.getLength(65), 3);
  assertEquals(BitArray.getLength(160), 5);
});

test("[BitArray.[Symbol.species]] returns Uint32Array when sliced", () => {
  const grid = new BitArray();
  assertEquals(grid.slice() instanceof Uint32Array, true);
});
