const { TextEncoder, TextDecoder } = require('util');
const RecordArray = require('../lib/record-array');
const StringView = require('../lib/string-view');

describe('RecordArray', () => {
  const recordSchema = [
    { name: 'a', type: 'Int8' },
    { name: 'b', type: 'Uint8' },
    { name: 'c', type: 'Int16', littleEndian: true },
    { name: 'd', type: 'Uint16' },
    { name: 'e', type: 'Int32', littleEndian: true },
    { name: 'f', type: 'Uint32' },
    { name: 'g', type: 'Float32', littleEndian: true },
    { name: 'h', type: 'Float64' },
    { name: 'i', type: 'BigInt64' },
    { name: 'j', type: 'BigUint64' },
    { name: 'k', type: 'String', size: 22 },
  ];

  const peopleSchema = [
    { name: 'age', type: 'Int8' },
    { name: 'height', type: 'Float32' },
    { name: 'weight', type: 'Float32', littleEndian: true },
    { name: 'score', type: 'Int32' },
  ];

  describe('constructor', () => {
    it('creates an instance of RecordArray', () => {
      const records = new RecordArray(recordSchema, 10);
      expect(records.buffer instanceof ArrayBuffer).toBe(true);
      expect(records.buffer.byteLength).toBe(640);
      expect(records instanceof DataView).toBe(true);
      expect(records.size).toBe(10);
      expect(records.stringView instanceof StringView).toBe(true);
    });

    it('creates an instance using preexisting ArrayBuffer', () => {
      const buffer = new ArrayBuffer(800);
      const records = new RecordArray(peopleSchema, 10, buffer, 160, 640);
      expect(records.buffer).toBe(buffer);
      expect(records.byteLength).toBe(640);
      expect(records.byteOffset).toBe(160);
    });

    it('creates an instance without string fields', () => {
      const people = new RecordArray(peopleSchema, 10);
      expect(people.buffer.byteLength).toBe(160);
      expect(people.stringView instanceof StringView).toBe(false);
    });
  });

  describe('get', () => {
    it('returns the value of a given field', () => {
      const records = new RecordArray(recordSchema, 10);
      expect(records.get(0, 'a')).toBe(0);
      expect(records.get(0, 'b')).toBe(0);
      expect(records.get(0, 'c')).toBe(0);
      expect(records.get(0, 'd')).toBe(0);
      expect(records.get(0, 'e')).toBe(0);
      expect(records.get(0, 'f')).toBe(0);
      expect(records.get(0, 'g')).toBe(0);
      expect(records.get(0, 'h')).toBe(0);
      expect(records.get(0, 'i')).toBe(BigInt(0));
      expect(records.get(0, 'j')).toBe(BigInt(0));
    });

    it('returns a StringView for a string field', () => {
      const records = new RecordArray(recordSchema, 10);
      const actual = records.get(0, 'k');
      expect(actual instanceof StringView).toBe(true);
      expect(actual.buffer === records.buffer).toBe(true);
      expect(actual.length).toBe(22);
    });

    it('returns 0 if the field type is not found', () => {
      const records = new RecordArray([{ name: 'a', type: 'NonExistant' }], 1);
      expect(records.get(0, 'a')).toBe(0);
    });
  });

  describe('set', () => {
    it('sets a given value to a given field', () => {
      const records = new RecordArray(recordSchema, 10);
      expect(records.set(0, 'a', 1)
        .get(0, 'a')).toBe(1);
      expect(records.set(0, 'b', 1)
        .get(0, 'b')).toBe(1);
      expect(records.set(0, 'c', 1)
        .get(0, 'c')).toBe(1);
      expect(records.set(0, 'd', 1)
        .get(0, 'd')).toBe(1);
      expect(records.set(0, 'e', 1)
        .get(0, 'e')).toBe(1);
      expect(records.set(0, 'f', 1)
        .get(0, 'f')).toBe(1);
      expect(records.set(0, 'g', 1)
        .get(0, 'g')).toBe(1);
      expect(records.set(0, 'h', 1)
        .get(0, 'h')).toBe(1);
      expect(records.set(0, 'i', BigInt(1))
        .get(0, 'i')).toBe(BigInt(1));
      expect(records.set(0, 'j', BigInt(1))
        .get(0, 'j')).toBe(BigInt(1));
    });

    it('sets a buffer for a string field', () => {
      const records = new RecordArray(recordSchema, 10);
      const value = new StringView(22);
      value[0] = 35;
      value[21] = 33;
      records.set(0, 'k', value);
      const actual = records.get(0, 'k');
      expect(actual).toEqual(value);
      expect(actual.buffer !== value.buffer).toBe(true);
    });

    it('sets a smaller buffer for a string field', () => {
      const records = new RecordArray(recordSchema, 10);
      const encoder = new TextEncoder();
      const decoder = new TextDecoder();
      const value = encoder.encode('maga');
      records.set(0, 'k', value);
      const encoded = records.get(0, 'k');
      expect(encoded.length).toBe(22);
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
