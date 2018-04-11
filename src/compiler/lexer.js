/* languages/lexer
--------------------------------------------------------------------------------
program code (a string) goes in, an array of lexemes comes out
--------------------------------------------------------------------------------
*/
const tokenizer = require('./tokenizer');
const { pc } = require('data');

const messages = {
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

const error = (id, messageId, text, line) =>
  ({
    type: 'Compiler',
    id,
    message: messages[messageId],
    text,
    line,
  });

const ltype = (ttype) => {
  switch (ttype) {
    case 'binary': // fallthrough
    case 'octal': // fallthrough
    case 'decimal': // fallthrough
    case 'hexadecimal':
      return 'integer';
    case 'identifier': // fallthrough
    case 'custom': // fallthrough
    case 'variable': // fallthrough
    case 'command': // fallthrough
    case 'constant': // fallthrough
    case 'turtle': // fallthrough
    case 'keycode': // fallthrough
    case 'query':
      return 'identifier';
    default:
      return ttype;
  }
};

const value = (ttype, content) => {
  switch (ttype) {
    case 'string':
      return content.slice(1, -1).replace(/''/g, '\'').replace(/\\('|")/g, '$1');
    case 'binary':
      return parseInt(content.slice(1), 2);
    case 'octal':
      return parseInt(content.slice(1), 8);
    case 'hexadecimal':
      return parseInt(content.slice(1), 16);
    case 'decimal':
      return parseInt(content);
    case 'turtle':
      return ['x', 'y', 'd', 't', 'c'].indexOf(content[4].toLowerCase()) + 1;
    default:
      return null;
  }
};

const pcode = (content) => {
  switch (content.toLowerCase()) {
    case '+':
      return pc.plus;
    case '-':
      return pc.subt;
    case '*':
      return pc.mult;
    case '/':
      return pc.divr;
    case 'div': // fallthrough
    case '//':
      return pc.div;
    case 'mod': // fallthrough
    case '%':
      return pc.mod;
    case '=': // fallthrough (in BASIC, this could also be variable assignment)
    case '==':
      return pc.eqal;
    case '<>': // fallthrough
    case '!=':
      return pc.noeq;
    case '<=':
      return pc.lseq;
    case '>=':
      return pc.mreq;
    case '<':
      return pc.less;
    case '>':
      return pc.more;
    case 'not':
      return pc.not;
    case 'and':
      return pc.and;
    case 'or':
      return pc.or;
    case 'xor': // fallthrough
    case 'eor':
      return pc.xor;
    default:
      return null;
  }
};

const lexeme = (ttype, content, line, offset, language) =>
  ({
    type: ltype(ttype),
    value: value(ttype, content),
    pcode: pcode(content),
    ttype,
    content: (language === 'Pascal') ? content.toLowerCase() : content,
    line,
    offset,
  });

const lexer = (code, language) => {
  const tokens = tokenizer[language](code);
  const lexemes = [];
  let index = 0;
  let offset = -1;
  let line = 1;
  while (index < tokens.length) {
    switch (tokens[index].type) {
      case 'linebreak':
        line += 1;
        offset = -1;
        break;
      case 'spaces':
        offset = (offset === -1) ? tokens[index].content.length : offset;
        break;
      case 'comment':
        break;
      case 'unterminated-comment':
        throw error('01', 'unterminated-comment', tokens[index].content, line);
      case 'unterminated-string':
        throw error('02', 'unterminated-string', tokens[index].content, line);
      case 'bad-binary':
        throw error('03', `bad-binary-${language}`, tokens[index].content, line);
      case 'bad-octal':
        throw error('04', `bad-octal-${language}`, tokens[index].content, line);
      case 'bad-hexadecimal':
        throw error('05', `bad-hexadecimal-${language}`, tokens[index].content, line);
      case 'bad-decimal':
        throw error('06', 'bad-decimal', tokens[index].content, line);
      case 'illegal':
        throw error('07', 'illegal-character', tokens[index].content, line);
      default:
        offset = (offset === -1) ? 0 : offset;
        lexemes.push(lexeme(tokens[index].type, tokens[index].content, line, offset, language));
        break;
    }
    index += 1;
  }
  return lexemes;
};

module.exports = lexer;
