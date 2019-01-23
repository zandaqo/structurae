const { TextEncoder, TextDecoder } = require('util');
const RecordArray = require('../lib/record-array');

describe('RecordArray', () => {
  const peopleSchema = [
    { name: 'age', type: 'Int8' },
    { name: 'height', type: 'Float32' },
    { name: 'weight', type: 'Float32', littleEndian: true },
    { name: 'score', type: 'Int32' },
  ];

  const peopleWithString = [
    { name: 'age', type: 'Int8' },
    { name: 'name', type: 'String', size: 14 },
  ];

  describe('constructor', () => {
    it('creates an instance of RecordArray', () => {
      const people = new RecordArray(peopleSchema, 10);
      expect(people.buffer instanceof ArrayBuffer).toBe(true);
      expect(people.buffer.byteLength).toBe(160);
      expect(people instanceof DataView).toBe(true);
      expect(people.size).toBe(10);
    });

    it('creates an instance using preexisting ArrayBuffer', () => {
      const buffer = new ArrayBuffer(320);
      const people = new RecordArray(peopleSchema, 10, buffer, 160, 160);
      expect(people.buffer).toBe(buffer);
      expect(people.byteLength).toBe(160);
      expect(people.byteOffset).toBe(160);
    });

    it('creates an instance with string fields', () => {
      const people = new RecordArray(peopleWithString, 10);
      expect(people.buffer.byteLength).toBe(160);
      expect(people.stringView instanceof Uint8Array).toBe(true);
    });
  });

  describe('get', () => {
    it('returns the value of a given field', () => {
      const people = new RecordArray(peopleSchema, 10);
      expect(people.get(0, 'age')).toBe(0);
      expect(people.get(0, 'weight')).toBe(0);
    });

    it('returns a Uint8Array for a string field', () => {
      const people = new RecordArray(peopleWithString, 10);
      const actual = people.get(0, 'name');
      expect(actual instanceof Uint8Array).toBe(true);
      expect(actual.buffer === people.buffer).toBe(true);
      expect(actual.length).toBe(14);
    });
  });

  describe('set', () => {
    it('sets a given value to a given field', () => {
      const people = new RecordArray(peopleSchema, 10);
      expect(people.set(0, 'age', 2).get(0, 'age')).toBe(2);
      expect(people.set(0, 'weight', 2.5).get(0, 'weight')).toBe(2.5);
    });

    it('sets a buffer for a string field', () => {
      const people = new RecordArray(peopleWithString, 10);
      const encoder = new TextEncoder();
      const decoder = new TextDecoder();
      const value = encoder.encode('maga');
      people.set(0, 'name', value);
      const encoded = people.get(0, 'name');
      expect(encoded.length).toBe(14);
      const decoded = decoder.decode(encoded);
      expect(decoded.slice(0, 4)).toEqual('maga');
    });
  });

  describe('toObject', () => {
    it('returns an object representation of a given struct', () => {
      const people = new RecordArray(peopleSchema, 10);
      people.set(0, 'age', 10)
        .set(0, 'height', 50)
        .set(0, 'weight', 60)
        .set(0, 'score', 5);
      expect(people.toObject(0)).toEqual({
        age: 10, height: 50, weight: 60, score: 5,
      });
    });
  });
});
