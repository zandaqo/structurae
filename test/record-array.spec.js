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

  const arraySchema = [
    { name: 'a', type: 'Int8Array', size: 1 },
    { name: 'b', type: 'Uint8Array', size: 2 },
    { name: 'c', type: 'Int16Array', size: 4 },
    { name: 'd', type: 'Uint16Array', size: 4 },
    { name: 'e', type: 'Int32Array', size: 4 },
    { name: 'f', type: 'Uint32Array', size: 4 },
    { name: 'g', type: 'Float32Array', size: 4 },
    { name: 'h', type: 'Float64Array', size: 8 },
    { name: 'i', type: 'BigInt64Array', size: 8 },
    { name: 'j', type: 'BigUint64Array', size: 16 },
    { name: 'k', type: 'String', size: 2 },
    { name: 'l', type: 'Int8' },
  ];

  describe('constructor', () => {
    it('creates an instance of RecordArray', () => {
      const records = new RecordArray(recordSchema, 10);
      expect(records.buffer instanceof ArrayBuffer).toBe(true);
      expect(records.buffer.byteLength).toBe(640);
      expect(records instanceof DataView).toBe(true);
      expect(records.size).toBe(10);
      expect(records.byteView instanceof StringView).toBe(true);
    });

    it('creates an instance using preexisting ArrayBuffer', () => {
      const buffer = new ArrayBuffer(800);
      const records = new RecordArray(peopleSchema, 10, buffer, 160, 640);
      expect(records.buffer).toBe(buffer);
      expect(records.byteLength).toBe(640);
      expect(records.byteOffset).toBe(160);
      expect(records.byteView.length).toBe(640);
      expect(records.byteView.byteOffset).toBe(160);
    });

    it('supports typed arrays', () => {
      const records = new RecordArray(arraySchema, 10);
      expect(records.buffer.byteLength).toBe(5120);
    });

    it('throws if invalid field type is provided', () => {
      expect(() => { new RecordArray([{ name: 'abc', type: 'Int128' }], 10); })
        .toThrowError('Type "Int128" is not a valid type.');
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

    it('returns a typed array from an array field', () => {
      const records = new RecordArray(arraySchema, 1);
      const actual = records.get(0, 'c');
      expect(actual instanceof Int16Array).toBe(true);
      expect(actual.buffer === records.buffer).toBe(true);
      expect(actual.length).toBe(4);
      expect(actual.byteLength).toBe(8);
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

    it('sets an array for typed array field', () => {
      const buffer = new ArrayBuffer(1512);
      const records = new RecordArray(arraySchema, undefined, buffer, 1000);
      const array = records.get(0, 'c');
      expect(Array.from(array)).toEqual([0, 0, 0, 0]);
      records.set(0, 'c', [1, 2, 3, 4]);
      expect(Array.from(array)).toEqual([1, 2, 3, 4]);
      expect(Array.from(records.get(0, 'c'))).toEqual([1, 2, 3, 4]);
    });

    it('sets a smaller array for typed array field', () => {
      const records = new RecordArray(arraySchema, 5);
      const array = records.get(0, 'c');
      expect(Array.from(array)).toEqual([0, 0, 0, 0]);
      records.set(0, 'c', [1, 2, 3, 4]);
      expect(Array.from(array)).toEqual([1, 2, 3, 4]);
      records.set(0, 'c', [1, 2]);
      expect(Array.from(array)).toEqual([1, 2, 0, 0]);
    });
  });

  describe('toObject', () => {
    it('returns an object representation of a given record', () => {
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

  describe('fromObject', () => {
    it('stores a given object as a record at a given index', () => {
      const people = new RecordArray(peopleSchema, 10);
      people.fromObject(0, {
        age: 10, height: 50, weight: 60, score: 5,
      });
      expect(people.toObject(0)).toEqual({
        age: 10, height: 50, weight: 60, score: 5,
      });
    });

    it('skips missing fields', () => {
      const people = new RecordArray(peopleSchema, 10);
      people.fromObject(0, {
        age: 10, weight: 60, score: 5,
      });
      expect(people.toObject(0)).toEqual({
        age: 10, height: 0, weight: 60, score: 5,
      });
    });
  });

  describe('getLength', () => {
    it('returns the length of underlying ArrayBuffer required to hold the given amount of records', () => {
      expect(RecordArray.getLength(peopleSchema, 10)).toBe(160);
      expect(RecordArray.getLength(recordSchema, 10)).toBe(640);
      expect(RecordArray.getLength([
        { name: 'a', type: 'Int8' },
        { name: 'b', type: 'Uint32Array', size: 2 },
      ], 10)).toBe(160);
    });
  });
});
