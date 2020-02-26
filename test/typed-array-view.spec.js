const { TypedArrayViewMixin } = require('../index');

const TypedArrays = {
  int8: TypedArrayViewMixin('int8'),
  uint8: TypedArrayViewMixin('uint8'),
  int16: TypedArrayViewMixin('int16'),
  uint16: TypedArrayViewMixin('uint16'),
  int32: TypedArrayViewMixin('int32'),
  uint32: TypedArrayViewMixin('uint32'),
  float32: TypedArrayViewMixin('float32'),
  float64: TypedArrayViewMixin('float64'),
  bigint64: TypedArrayViewMixin('bigint64'),
  biguint64: TypedArrayViewMixin('biguint64'),
  int16_le: TypedArrayViewMixin('int16', true),
  uint16_le: TypedArrayViewMixin('uint16', true),
  int32_le: TypedArrayViewMixin('int32', true),
  uint32_le: TypedArrayViewMixin('uint32', true),
  float32_le: TypedArrayViewMixin('float32', true),
  float64_le: TypedArrayViewMixin('float64', true),
  bigint64_le: TypedArrayViewMixin('bigint64', true),
  biguint64_le: TypedArrayViewMixin('biguint64', true),
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
    });
  }
});
