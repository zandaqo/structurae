const { ArrayViewMixin } = require('../index');

const BigInt = globalThis.BigInt || Number;

const TypedArrays = {
  int8: ArrayViewMixin('int8'),
  uint8: ArrayViewMixin('uint8'),
  int16: ArrayViewMixin('int16'),
  uint16: ArrayViewMixin('uint16'),
  int32: ArrayViewMixin('int32'),
  uint32: ArrayViewMixin('uint32'),
  float32: ArrayViewMixin('float32'),
  float64: ArrayViewMixin('float64'),
  bigint64: ArrayViewMixin('bigint64'),
  biguint64: ArrayViewMixin('biguint64'),
  int16_le: ArrayViewMixin('int16', true),
  uint16_le: ArrayViewMixin('uint16', true),
  int32_le: ArrayViewMixin('int32', true),
  uint32_le: ArrayViewMixin('uint32', true),
  float32_le: ArrayViewMixin('float32', true),
  float64_le: ArrayViewMixin('float64', true),
  bigint64_le: ArrayViewMixin('bigint64', true),
  biguint64_le: ArrayViewMixin('biguint64', true),
};

const sampleArray = [0, 1, 3, 120];
const sampleBigIntArray = [BigInt(0), BigInt(1), BigInt(3), BigInt(120)];

describe('TypedArrayView', () => {
  for (const [type, Ctor] of Object.entries(TypedArrays)) {
    describe(type, () => {
      const isBigInt = type.startsWith('big');

      describe('get', () => {
        it('returns a number at a given index', () => {
          const expected = isBigInt ? sampleBigIntArray : sampleArray;
          const array = Ctor.from(expected);
          expect(array.get(0)).toBe(expected[0]);
          expect(array.get(1)).toBe(expected[1]);
          expect(array.get(2)).toBe(expected[2]);
          expect(array.get(3)).toBe(expected[3]);
        });
      });

      describe('set', () => {
        it('sets a number at a given index', () => {
          const expected = isBigInt ? sampleBigIntArray : sampleArray;
          const array = Ctor.of(5);
          expect(array.set(0, expected[0]).get(0)).toBe(expected[0]);
          expect(array.set(1, expected[1]).get(1)).toBe(expected[1]);
          expect(array.set(2, expected[2]).get(2)).toBe(expected[2]);
          expect(array.set(3, expected[3]).get(3)).toBe(expected[3]);
        });
      });

      describe('from', () => {
        it('creates a typed array from an array of numbers', () => {
          const expected = isBigInt ? sampleBigIntArray : sampleArray;
          const array = Ctor.from(expected);
          expect(array.size).toBe(4);
          expect(array.get(0)).toBe(expected[0]);
          expect(array.get(1)).toBe(expected[1]);
          expect(array.get(2)).toBe(expected[2]);
          expect(array.get(3)).toBe(expected[3]);
        });

        it('fills an existing typed array with an array of numbers', () => {
          const expected = isBigInt ? sampleBigIntArray : sampleArray;
          const array = Ctor.from(expected, Ctor.of(4));
          expect(array.get(0)).toBe(expected[0]);
          expect(array.get(1)).toBe(expected[1]);
          expect(array.get(2)).toBe(expected[2]);
          expect(array.get(3)).toBe(expected[3]);
        });
      });

      describe('toJSON', () => {
        it('converts a view into an array of numbers', () => {
          const expected = isBigInt ? sampleBigIntArray : sampleArray;
          const array = Ctor.from(expected);
          expect(array.toJSON()).toEqual(expected);
        });
      });

      describe('iterator', () => {
        it('iterates over elements of the array', () => {
          const expected = isBigInt ? sampleBigIntArray : sampleArray;
          const array = Ctor.from(expected);
          expect([...array]).toEqual(expected);
        });
      });
    });
  }
});
