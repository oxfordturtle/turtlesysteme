/**
 * analyse a code string into an array of lexemes
 */
const BASIC = require('./tokenizer/basic');
const Pascal = require('./tokenizer/pascal');
const Python = require('./tokenizer/python');
const pc = require('../components/machine/constants/pc');
const error = require('../state/error');

const tokenizer = { BASIC, Pascal, Python };

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

const lexeme = (ttype, content, line, offset,) =>
  ({
    type: ltype(ttype),
    value: value(ttype, content),
    pcode: pcode(content),
    ttype,
    content,
    line,
    offset,
  });

const lexer = (code, language) => {
  var index = 0;
  var offset = -1;
  var line = 1;
  var tokens = tokenizer[language](code);
  var lexemes = [];
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
        throw error('Compiler', 'lex01', 'unterminated-comment', tokens[index].content, line);
      case 'unterminated-string':
        throw error('Compiler', 'lex02', 'unterminated-string', tokens[index].content, line);
      case 'bad-binary':
        throw error('Compiler', 'lex03', `bad-binary-${language}`, tokens[index].content, line);
      case 'bad-octal':
        throw error('Compiler', 'lex04', `bad-octal-${language}`, tokens[index].content, line);
      case 'bad-hexadecimal':
        throw error('Compiler', 'lex05', `bad-hexadecimal-${language}`, tokens[index].content, line);
      case 'bad-decimal':
        throw error('Compiler', 'lex06', 'bad-decimal', tokens[index].content, line);
      case 'illegal':
        throw error('Compiler', 'lex07', 'illegal-character', tokens[index].content, line);
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
