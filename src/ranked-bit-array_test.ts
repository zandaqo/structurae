import { RankedBitArray } from "../src/ranked-bit-array.ts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

const { test } = Deno;

test("[RankedBitArray.constuctor] creates a bit array of a required size", () => {
  const array = new RankedBitArray(100);
  assertEquals(array instanceof RankedBitArray, true);
  assertEquals(array instanceof Uint32Array, true);
  assertEquals(array.length, 8);
});

test("[RankedBitArray.constuctor] creates a bit array from a given buffer", () => {
  const buffer = new ArrayBuffer(32);
  const array = new RankedBitArray(buffer);
  assertEquals(array instanceof RankedBitArray, true);
  assertEquals(array.buffer, buffer);
  assertEquals(array.length, 8);
});

test("[RankedBitArray#setBit] sets individual bits and updates ranks", () => {
  const array = new RankedBitArray(16);
  assertEquals(array.getBit(0), 0);
  assertEquals(array.getBit(1), 0);
  assertEquals(array[1], 0);
  array.setBit(0);
  assertEquals(array.getBit(0), 1);
  assertEquals(array[1], 1);
  array.setBit(0, 0);
  assertEquals(array.getBit(0), 0);
  assertEquals(array[1], 0);
});

test("[RankedBitArray#size] returns the amount of available bits in the array", () => {
  const array = new RankedBitArray(32);
  assertEquals(array.size, 32);
  assertEquals(array.length, 2);
});

test("[RankedBitArray#rank] returns the rank of a bit at a given index", () => {
  const array = new RankedBitArray(64);
  array.setBit(33).setBit(16).setBit(9).setBit(5);
  assertEquals(array.rank(36), 4);
  assertEquals(array.rank(33), 3);
  assertEquals(array.rank(16), 2);
  assertEquals(array.rank(15), 2);
  assertEquals(array.rank(4), 0);
});

test("[RankedBitArray#select] the select of a bit at a given index", () => {
  const array = new RankedBitArray(320);
  array.setBit(300).setBit(20).setBit(16).setBit(9).setBit(5);
  assertEquals(array.select(4), 20);
  assertEquals(array.select(3), 16);
  assertEquals(array.select(2), 9);
  assertEquals(array.select(1), 5);
  assertEquals(array.select(5), 300);
  assertEquals(array.select(6), -1);
  assertEquals(array.select(0), -1);
});

test("[RankedBitArray.getLength] returns the length of underlying TypedArray required to hold the bit array", () => {
  assertEquals(RankedBitArray.getLength(16), 2);
  assertEquals(RankedBitArray.getLength(32), 2);
  assertEquals(RankedBitArray.getLength(33), 4);
  assertEquals(RankedBitArray.getLength(65), 6);
  assertEquals(RankedBitArray.getLength(160), 10);
});
