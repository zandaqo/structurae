const BitField = require('./bit-field');
const BigBitField = require('./big-bit-field');

/**
 * Creates a BitField or BigBitField class with a given schema.
 *
 * @param {Object<string, number>|Array<string>} schema the schema to use for the class
 * @param {Class<BitField>|Class<BigBitField>} [BitFieldClass] an optional BitField class to extend
 * @returns {Class<BitField>|Class<BigBitField>}
 */
function BitFieldMixin(schema, BitFieldClass) {
  const schemaMap = Array.isArray(schema)
    ? schema.reduce((a, i) => { a[i] = 1; return a; }, {}) : schema;
  const totalSize = Object.keys(schemaMap).reduce((result, field) => (result + schema[field]), 0);
  const isBigInt = totalSize > 31;
  const ExtendClass = BitFieldClass || (isBigInt ? BigBitField : BitField);
  class Base extends ExtendClass {}
  Base.schema = schemaMap;
  Base.initialize();
  return Base;
}

module.exports = BitFieldMixin;
