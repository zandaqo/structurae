import { BigBitFieldMixin } from '../src/big-bit-field';

describe('BigBitField', () => {
  const LargeField = BigBitFieldMixin({
    location: 7,
    open: 1,
    width: 31,
    height: 15,
  });

  describe('constructor', () => {
    it('creates an instance with a given numerical value', () => {
      expect(new LargeField().value).toBe(BigInt(0));
      expect(new LargeField(BigInt(1375759717)).value).toBe(BigInt(1375759717));
    });

    it('creates an instance from a list of values', () => {
      expect(
        new LargeField({
          location: 20,
          open: 1,
          width: 3500,
          height: 5,
        }).value,
      ).toBe(BigInt('2748779965588'));
      expect(new LargeField([20, 1, 3500, 5]).value).toBe(
        BigInt('2748779965588'),
      );
    });

    it('creates an instance from another BigBitField', () => {
      expect(new LargeField(new LargeField()).value).toBe(BigInt(0));
      expect(new LargeField(new LargeField(BigInt(1375759717))).value).toBe(
        BigInt(1375759717),
      );
    });
  });

  describe('get', () => {
    it('returns a value of a given field', () => {
      expect(
        new LargeField({
          location: 20,
          open: 1,
          width: 3500,
          height: 5,
        }).get('width'),
      ).toBe(3500);
      expect(new LargeField(BigInt('2748779965588')).get('width')).toBe(3500);
    });
  });

  describe('set', () => {
    it('sets a given value to a given field', () => {
      expect(
        new LargeField({
          location: 20,
          open: 1,
          width: 3500,
          height: 5,
        })
          .set('width', 3000)
          .get('width'),
      ).toBe(3000);
      expect(
        new LargeField(BigInt(1375759717)).set('location', 21).get('location'),
      ).toBe(21);
    });
  });

  describe('has', () => {
    it('checks if all specified fields are set in a given bitfield instance', () => {
      const largeField = new LargeField({
        location: 20,
        open: 0,
        width: 3500,
        height: 0,
      });
      expect(largeField.has('open')).toBe(false);
      expect(largeField.set('open').has('open')).toBe(true);
    });
  });

  describe('match', () => {
    it('partially matches instance', () => {
      const largeField = new LargeField({
        location: 20,
        open: 1,
        width: 3500,
        height: 5,
      });
      expect(largeField.match({ width: 3500 })).toBe(true);
      expect(largeField.match({ width: 3400 })).toBe(false);
      expect(largeField.match({ location: 20, height: 5 })).toBe(true);
      expect(largeField.match({ location: 20, height: 7 })).toBe(false);
      expect(largeField.match({ location: 20, height: 5, open: 1 })).toBe(true);
      expect(largeField.match(LargeField.getMatcher({ width: 3500 }))).toBe(
        true,
      );
    });
  });

  describe('toJSON', () => {
    it('returns the value of an instance as a number for JSON', () => {
      expect(new LargeField([20, 1, 3500, 5]).toJSON()).toBe(
        BigInt('2748779965588'),
      );
    });
  });

  describe('toObject', () => {
    it('returns a plain object representation of an instance', () => {
      expect(
        new LargeField({
          location: 20,
          open: 1,
          width: 3500,
          height: 5,
        }).toObject(),
      ).toEqual({
        location: 20,
        open: 1,
        width: 3500,
        height: 5,
      });
    });
  });

  describe('toString', () => {
    it('returns a string representing the value of the instance', () => {
      expect(
        `${new LargeField({
          location: 20,
          open: 1,
          width: 3500,
          height: 5,
        })}`,
      ).toBe('2748779965588');
    });
  });

  describe('valueOf', () => {
    it('returns the value of an instance as a number', () => {
      expect(
        BigInt(1) +
          new LargeField({
            location: 20,
            open: 1,
            width: 3500,
            height: 5,
          }).valueOf(),
      ).toBe(BigInt('2748779965589'));
    });
  });

  describe('isValid', () => {
    it('checks if given pairs of Person name and value are valid according to the schema', () => {
      expect(LargeField.isValid({ location: 21 })).toBe(true);
      expect(LargeField.isValid({ location: 200 })).toBe(false);
      expect(LargeField.isValid({ location: -200 })).toBe(false);
      expect(LargeField.isValid({ location: 21, open: 1 })).toBe(true);
      expect(LargeField.isValid({ location: 21, open: 4 })).toBe(false);
    });
  });

  describe('getMatcher', () => {
    it('returns matcher to partially match an instance', () => {
      const bigMatcher = LargeField.getMatcher({ location: 2, width: 12 });
      expect(bigMatcher[0]).toBe(BigInt(3074));
      expect(bigMatcher[1]).toBe(BigInt('18014948265295743'));
    });
  });

  describe('iterator', () => {
    it('iterates over numbers stored in the instance', () => {
      const data = {
        location: 20,
        open: 1,
        width: 3500,
        height: 5,
      };
      const largeField = new LargeField(data);
      expect(Array.from(largeField)).toEqual([20, 1, 3500, 5]);
      expect([...largeField]).toEqual([20, 1, 3500, 5]);
      const [location, open] = largeField;
      expect(location).toBe(20);
      expect(open).toBe(1);
    });
  });
});
