/*
 * compilation errors
 */

const messages = {
  // lexer errors
  'unterminated-comment': 'Unterminated comment.',
  'unterminated-string': 'Unterminated string.',
  'bad-binary-BASIC': 'Binary numbers in Turtle BASIC begin with \'%\'.',
  'bad-binary-Pascal': 'Binary numbers in Turtle Pascal begin with \'%\'.',
  'bad-binary-Python': 'Binary numbers in Turtle Python begin with \'0b\'.',
  'bad-octal-BASIC': 'Turtle BASIC does not support octal numbers.',
  'bad-octal-Pascal': 'Octal numbers in Turtle Pascal begin with \'&\'',
  'bad-octal-Python': 'Octal numbers in Turtle Pascal begin with \'0o\'',
  'bad-hexadecimal-BASIC': 'Hexadecimal numbers in Turtle BASIC begin with \'&\'',
  'bad-hexadecimal-Pascal': 'Hexadecimal numbers in Turtle BASIC begin with \'$\'',
  'bad-hexadecimal-Python': 'Hexadecimal numbers in Turtle BASIC begin with \'0x\'',
  'bad-decimal': 'The Turtle System does not support real numbers.',
  'illegal': 'Illegal character in this context.',
};

const error = (type, id, messageId, text, line) =>
  ({
    type,
    message: messages[messageId],
    line,
    text,
  });

module.exports = error;
