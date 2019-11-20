const BitField = require('../lib/bit-field');
const BigBitField = require('../lib/big-bit-field');
const BitFieldMixin = require('../lib/bit-field-mixin');

describe('BitFieldMixin', () => {
  it('creates a BitField class with a given schema', () => {
    const A = BitFieldMixin({ a: 1, b: 3, c: 10 });
    expect(A.prototype instanceof BitField).toBe(true);
    expect(A.size).toBe(14);
  });

  it('creates a BigBitField class if the combined size of fields exceeds 31 bits', () => {
    const A = BitFieldMixin({ a: 1, b: 30, c: 1 });
    expect(A.prototype instanceof BigBitField).toBe(true);
    expect(A.size).toEqual(BigInt(32));
  });

  it('creates a BitField class extending a given class', () => {
    const A = BitFieldMixin({ b: 10 });
    const B = BitFieldMixin({ a: 1 }, A);
    expect(B.prototype instanceof A).toBe(true);
    expect(B.size).toBe(1);
  });

  it('creates a BitField of flags from a schema defines in an array', () => {
    const A = BitFieldMixin(['a', 'b', 'c']);
    expect(A.size).toBe(3);
    expect(A.schema).toEqual({ a: 1, b: 1, c: 1 });
  });
});
