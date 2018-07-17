/* lexer/lexer
----------------------------------------------------------------------------------------------------
lexical analysis; program code (a string) goes in, an array of lexemes comes out
the lexer first uses the tokenizer to generate an array of tokens; then it checks for lexical
errors, strips whitespace and comments, and enriches the tokens with more information

lexemes (enriched tokens) look like this: { type, content, value, line, offset }

the types are the same as for token types, except that there are no whitespace or illegal
lexemes, and the "binary", "octal", "hexadecimal", and "decimal" token types are all just
"integer" lexical types

the line and offset properties are generated using (and then discarding) the whitespace tokens

the VALUE property stores the result of evaluating literal value expressions, looking up the
corresponding integer for predefined colours, keycodes, and input queries, or the pcode
associated with an operator; it is null for all other lexical types
----------------------------------------------------------------------------------------------------
*/
const { colours, inputs, pc } = require('data');
const tokenizer = require('./tokenizer');

// record of error messages
const messages = {
  'unterminated-comment': 'Unterminated comment.',
  'unterminated-string': 'Unterminated string.',
  'bad-binary-BASIC': 'Binary numbers in Turtle BASIC begin with \'%\'.',
  'bad-binary-Pascal': 'Binary numbers in Turtle Pascal begin with \'%\'.',
  'bad-binary-Python': 'Binary numbers in Turtle Python begin with \'0b\'.',
  'bad-octal-BASIC': 'Turtle BASIC does not support octal numbers.',
  'bad-octal-Pascal': 'Octal numbers in Turtle Pascal begin with \'&\'',
  'bad-octal-Python': 'Octal numbers in Turtle Python begin with \'0o\'',
  'bad-hexadecimal-BASIC': 'Hexadecimal numbers in Turtle BASIC begin with \'&\'',
  'bad-hexadecimal-Pascal': 'Hexadecimal numbers in Turtle Pascal begin with \'$\'',
  'bad-hexadecimal-Python': 'Hexadecimal numbers in Turtle Python begin with \'0x\'',
  'bad-decimal': 'The Turtle System does not support real numbers.',
  'illegal': 'Illegal character in this context.',
};

// create an error object
const error = (id, messageId, lexeme) =>
  ({
    type: 'Compiler',
    id: `lex${id}`,
    message: messages[messageId],
    lexeme,
  });

// type of a lexeme
const type = (type, content) => {
  switch (type) {
    case 'binary': // fallthrough
    case 'octal': // fallthrough
    case 'hexadecimal': // fallthrough
    case 'decimal': // falthrough
      return 'integer';
    default:
      return type;
  }
};

// value of a lexeme
const value = (type, content) => {
  switch (type) {
    case 'operator':
      switch (content.toLowerCase()) {
        case '+':
          return 'plus';
        case '-':
          return 'subt';
        case '*':
          return 'mult';
        case '/':
          return 'divr';
        case 'div': // fallthrough
        case '//':
          return 'div';
        case 'mod': // fallthrough
        case '%':
          return 'mod';
        case '=': // fallthrough (in BASIC, this could also be variable assignment)
        case '==':
          return 'eqal';
        case '<>': // fallthrough
        case '!=':
          return 'noeq';
        case '<=':
          return 'lseq';
        case '>=':
          return 'mreq';
        case '<':
          return 'less';
        case '>':
          return 'more';
        case 'not':
          return 'not';
        case 'and':
          return 'and';
        case 'or':
          return 'or';
        case 'xor': // fallthrough
        case 'eor':
          return 'xor';
        default:
          return null;
      }
      break;
    case 'string':
      return content.slice(1, -1).replace(/''/g, '\'').replace(/\\('|")/g, '$1');
    case 'boolean':
      // N.B. case sensitivity is already handled by the tokenizer
      return (content.toLowerCase() === 'true') ? -1 : 0;
    case 'binary':
      return parseInt(content.slice(1), 2);
    case 'octal':
      return parseInt(content.slice(1), 8);
    case 'hexadecimal':
      return parseInt(content.slice(1), 16);
    case 'decimal':
      return parseInt(content);
    case 'colour':
      // N.B. case sensitivity is already handled by the tokenizer
      predefined = colours.find((x) => x.names.pascal === content.toLowerCase());
      // this should never return null, since the tokenizer only matches predefined colours
      return predefined ? predefined.value : null;
      break;
    case 'keycode': // fallthrough
    case 'query':
      // N.B. case sensitivity is already handled by the tokenizer
      predefined = inputs.find((x) => x.names.pascal === content.toLowerCase());
      // this may return null, since the tokenizer lets incorrect input codes through
      return predefined ? predefined.value : null;
    case 'turtle':
      return ['x', 'y', 'd', 't', 'c'].indexOf(content[4].toLowerCase()) + 1;
    default:
      return null;
  }
};

// create a lexeme object
const lexeme = (token, line, offset, language) =>
  ({
    type: type(token.type, token.content),
    // Pascal is case-insensitive, so make everything lowercase for that language
    content: (language === 'Pascal') ? token.content.toLowerCase() : token.content,
    value: value(token.type, token.content),
    line,
    offset,
  });

// the lexical analysis function; calls the tokenizer first, then loops through the tokens adding
// additional information (or throwing an error)
const lexer = (code, language) => {
  const tokens = tokenizer(code, language);
  const lexemes = [];
  let index = 0;
  let line = 1;
  let startofline = true;
  let offset = 0;
  while (index < tokens.length) {
    switch (tokens[index].type) {
      case 'linebreak':
        line += 1;
        startofline = true;
        offset = 0;
        break;
      case 'spaces':
        if (startofline) {
          offset = tokens[index].content.length;
        }
        startofline = false;
        break;
      case 'comment':
        startofline = false;
        break;
      case 'unterminated-comment':
        throw error('01', 'unterminated-comment', lexeme(tokens[index], line, offset, language));
      case 'unterminated-string':
        throw error('02', 'unterminated-string', lexeme(tokens[index], line, offset, language));
      case 'bad-binary':
        throw error('03', `bad-binary-${language}`, lexeme(tokens[index], line, offset, language));
      case 'bad-octal':
        throw error('04', `bad-octal-${language}`, lexeme(tokens[index], line, offset, language));
      case 'bad-hexadecimal':
        throw error('05', `bad-hexadecimal-${language}`, lexeme(tokens[index], line, offset, language));
      case 'bad-decimal':
        throw error('06', 'bad-decimal', lexeme(tokens[index], line, offset, language));
      case 'illegal':
        throw error('07', 'illegal-character', lexeme(tokens[index], line, offset, language));
      default:
        startofline = false;
        lexemes.push(lexeme(tokens[index], line, offset, language));
        break;
    }
    index += 1;
  }
  return lexemes;
};

// export the lexical analysis function
module.exports = lexer;
