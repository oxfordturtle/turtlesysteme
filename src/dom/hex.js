/**
 * convert a number to css colour #000000 format
 */

// pad a string with leading zeros so it is six characters long
const pad = string =>
  ((string.length < 6) ? pad(`0${string}`) : string);

// direct export of the function
module.exports = colour =>
  `#${pad(colour.toString(16))}`;
