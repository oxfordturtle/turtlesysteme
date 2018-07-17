/**
 * machine tools
 * -------------------------------------------------------------------------------------------------
 * a handful of functions used during program execution
 * -------------------------------------------------------------------------------------------------
 */

const error = (id, messageId) => {
  const messages = {
    stackOverflow: 'Memory stack has overflowed into memory heap. Probable cause is unterminated recursion.',
    pcodeBadLine: 'The program has tried to jump to a line that does not exist. This is either a bug in our compiler, or in your assembled code.',
  };
  return { id, messageId, message: messages[messageId] };
};

const angle = (x, y) => {
  let result;
  if (Math.abs(y) >= Math.abs(x)) {
    result = Math.atan(-x / y);
    if (y > 0) {
      result += Math.PI;
    } else if (x < 0) {
      result += 2;
      result *= Math.PI;
    }
    return result;
  }
  result = Math.atan(y / x);
  if (x > 0) {
    result += Math.PI;
  } else {
    result += 3;
    result *= Math.PI;
  }
  return result / 2;
};

const boolint = value =>
  (value ? -1 : 0);

const mixColours = (col1, col2, prop1, prop2) => {
  const mixBytes = (byte1, byte2) =>
    Math.round(((byte1 * prop1) + (byte2 * prop2)) / (prop1 + prop2));
  const extractRed = colour =>
    Math.floor(colour / 0x10000);
  const extractGreen = colour =>
    Math.floor((colour & 0xFF00) / 0x100);
  const extractBlue = colour =>
    colour & 0xFF;
  const redByte = mixBytes(extractRed(col1), extractRed(col2));
  const greenByte = mixBytes(extractGreen(col1), extractGreen(col2));
  const blueByte = mixBytes(extractBlue(col1), extractBlue(col2));
  return ((redByte * 0x10000) + (greenByte * 0x100) + blueByte);
};

// exports
module.exports = {
  error,
  angle,
  boolint,
  mixColours,
};
