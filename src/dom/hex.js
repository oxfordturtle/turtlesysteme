/**
 * convert a number to css colour #000000 format
 */

// padded string with leading zeros so it is six characters long
const padded = string =>
  ((string.length < 6) ? padded(`0${string}`) : string);

// hexadecimal number string
const hex = colour =>
  `#${padded(colour.toString(16))}`;

// export the hex function
module.exports = hex;
