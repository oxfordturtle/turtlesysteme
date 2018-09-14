/*
map of machine pcodes (for looking up the value by code)
*/

const pcodes = require('./pcodes')

const mapPCode = (sofar, pcode) => {
  const next = sofar
  next[pcode.str.toLowerCase()] = pcode.code
  return next
}

module.exports = pcodes.filter(x => x !== undefined).reduce(mapPCode, {})
