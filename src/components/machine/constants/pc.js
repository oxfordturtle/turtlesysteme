const pcodes = require('./pcodes');

const isDefined = pcode =>
  pcode !== undefined;

const mapPCode = (sofar, pcode) => {
  const next = sofar;
  next[pcode.str.toLowerCase()] = pcode.code;
  return next;
};

module.exports = pcodes.filter(isDefined).reduce(mapPCode, {});
