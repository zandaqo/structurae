const { TypeViewMixin } = require('../index');

const BigInt = globalThis.BigInt || Number;

const TypeViews = {
  int8: TypeViewMixin('int8'),
  uint8: TypeViewMixin('uint8'),
  int16: TypeViewMixin('int16'),
  uint16: TypeViewMixin('uint16'),
  int32: TypeViewMixin('int32'),
  uint32: TypeViewMixin('uint32'),
  float32: TypeViewMixin('float32'),
  float64: TypeViewMixin('float64'),
  bigint64: TypeViewMixin('bigint64'),
  biguint64: TypeViewMixin('biguint64'),
  int16_le: TypeViewMixin('int16', true),
  uint16_le: TypeViewMixin('uint16', true),
  int32_le: TypeViewMixin('int32', true),
  uint32_le: TypeViewMixin('uint32', true),
  float32_le: TypeViewMixin('float32', true),
  float64_le: TypeViewMixin('float64', true),
  bigint64_le: TypeViewMixin('bigint64', true),
  biguint64_le: TypeViewMixin('biguint64', true),
};

const number = 10;
const bigNumber = BigInt(10);

describe('TypeView', () => {
  for (const [type, Ctor] of Object.entries(TypeViews)) {
    describe(type, () => {
      const isBigInt = type.startsWith('big');

      describe('get', () => {
        it('returns the number', () => {
          const expected = isBigInt ? bigNumber : number;
          const view = Ctor.from(expected);
          expect(view instanceof Ctor).toBe(true);
          expect(view.get()).toBe(expected);
        });
      });

      describe('set', () => {
        it('sets a number at a given index', () => {
          const expected = isBigInt ? bigNumber : number;
          const zero = isBigInt ? BigInt(0) : 0;
          const view = Ctor.of();
          expect(view instanceof Ctor).toBe(true);
          expect(view.get()).toBe(zero);
          expect(view.set(expected).get()).toBe(expected);
        });
      });

      describe('from', () => {
        it('creates a typed array from an array of numbers', () => {
          const expected = isBigInt ? bigNumber : number;
          const view = Ctor.from(expected);
          expect(view.get(0)).toBe(expected);
        });
      });

      describe('toJSON', () => {
        it('converts a view into an array of numbers', () => {
          const expected = isBigInt ? bigNumber : number;
          const array = Ctor.from(expected);
          expect(array.toJSON()).toEqual(expected);
        });
      });
    });
  }
});
