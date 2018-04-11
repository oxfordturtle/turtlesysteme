/**
 * tokenizer for Turtle Pascal - splits code into lexemes and whitespace
 * used by the code highlighting module and by the lexer
 * (the lexer removes the whitespace and comment tokens and adds line numbers and offsets)
 */
const linebreak = (code) => {
  const test = (code[0] === '\n');
  return test ? { type: 'linebreak', content: '\n' } : false;
};

const spaces = (code) => {
  const test = code.match(/^( +)/);
  return test ? { type: 'spaces', content: test[0] } : false;
};

const comment = (code) => {
  const start = code.match(/^REM\b/);
  if (start) return { type: 'comment', content: code.split('\n')[0] };
  return false;
};

const string = (code) => {
  const start1 = code[0] === '\'';
  const start2 = code[0] === '"';
  const end1 = code.match(/[^\\](')/);
  const end2 = code.match(/[^\\](")/);
  if (start1 && end1) return { type: 'string', content: code.slice(0, end1.index + 2) };
  if (start1) return { type: 'unterminated-string', content: code.split('\n')[0] };
  if (start2 && end2) return { type: 'string', content: code.slice(0, end2.index + 2) };
  if (start2) return { type: 'unterminated-string', content: code.split('\n')[0] };
  return false;
};

const operator = (code) => {
  const test = code.match(/^(\+|-|\*|\/|DIV\b|MOD\b|=|<>|<=|>=|<|>|NOT\b|AND\b|OR\b|EOR\b)/);
  return test ? { type: 'operator', content: test[0] } : false;
};

const punctuation = (code) => {
  const test = code.match(/^(\(|\)|,)/);
  return test ? { type: 'punctuation', content: test[0] } : false;
};

const binary = (code) => {
  const good = code.match(/^(%[01]+)\b/);
  const bad = code.match(/^(0b[01]+)\b/);
  if (good) return { type: 'binary', content: good[0] };
  if (bad) return { type: 'bad-binary', content: bad[0] };
  return false;
};

const hexadecimal = (code) => {
  const bad = code.match(/^((\$|#|(0x))[A-Fa-f0-9]+)\b/);
  const good = code.match(/^(&[A-Fa-f0-9]+)\b/);
  if (bad) return { type: 'bad-hexadecimal', content: bad[0] };
  if (good) return { type: 'hexadecimal', content: good[0] };
  return false;
};

const decimal = (code) => {
  const bad = code.match(/^(\d+\.\d+)/);
  const good = code.match(/^(\d+)\b/);
  if (bad) return { type: 'bad-decimal', content: bad[0] };
  if (good) return { type: 'decimal', content: good[0] };
  return false;
};

const keyword = (code) => {
  const test = code.match(/^(DEF|DIM|ELSE|END|ENDIF|ENDPROC|ENDWHILE|FOR|IF|LOCAL|NEXT|PRIVATE|REPEAT|RETURN|STEP|THEN|TO|UNTIL|WHILE)\b/);
  return test ? { type: 'keyword', content: test[0] } : false;
};

const command = (code) => {
  const test = code.match(/^(ABS\b|ACS\b|ANGLES\b|ANTILOG\b|ASC\b|ASN\b|ATN\b|BACK\b|BLANK\b|BLOT\b|BOOLINT\b|BOX\b|CANVAS\b|CHR\$|CIRCLE\b|COLOU?R\b|CONSOLE\b|COS\b|CURSOR\b|DEC\b|DEL\$|DETECT\b|DIRECTION\b|DIVMULT\b|DRAWXY\b|DUMP\b|ELLBLOT\b|ELLIPSE\b|EXP\b|FILL\b|FORGET\b|FORWARD\b|GET\$|GETLINE\$|HEAPRESET|HEX\$|HOME\b|HYPOT\b|INC\b|INPUT\$|KEYBUFFER\b|KEYECHO\b|KEYSTATUS\b|LCASE\$|LEFT\$|LEFT\b|LEN\b|LN\b|LOG10\b|MAX\b|MAXINT\b|MID\$|MIN\b|MIXCOLS\b|MOVEXY\b|NEWTURTLE\b|NOUPDATE\b|OLDTURTLE\b|OUTPUT\b|PAUSE\b|PENDOWN\b|PENUP\b|PI\b|PIXCOL\b|PIXSET\b|POLYGON\b|POLYLINE\b|POWER\b|PRINT\b|QSTR\$|QVAL\b|RECOLOUR\b|REMEMBER\b|RESET\b|RESOLUTION\b|RGB\b|RIGHT\$|RIGHT\b|RND\b|RNDCOL\b|ROOT\b|SETX\b|SETXY\b|SETY\b|SIGN\b|SIN\b|SQR\b|STR\$|TAN\b|THICKNESS\b|TIME\b|TIMESET\b|TRACE\b|TURNXY\b|UPDATE\b|UCASE\$|VAL\b|VALDEF\b|WATCH\b|WRITE\b|WRITELN\b)/);
  return test ? { type: 'command', content: test[0] } : false;
};

const custom = (code) => {
  const test = code.match(/^((PROC|FN)[_a-zA-Z]+)\b/);
  return test ? { type: 'custom', content: test[0] } : false;
};

const turtle = (code) => {
  const test = code.match(/^(TURT[XYDTC]%)\b/);
  return test ? { type: 'turtle', content: test[0] } : false;
};

const constant = (code) => {
  const test = code.match(/^(TRUE|FALSE|GREEN|DARKGREEN|LIGHTGREEN|SEAGREEN|GREENGREY|GREENGRAY|RED|DARKRED|LIGHTRED|MAROON|REDGREY|REDGRAY|BLUE|DARKBLUE|LIGHTBLUE|ROYAL|BLUEGREY|YELLOW|OCHRE|CREAM|GOLD|YELLOWGREY|YELLOWGRAY|VIOLET|INDIGO|LILAC|PURPLE|DARKGREY|DARKGRAY|LIME|OLIVE|YELLOWGREEN|EMERALD|MIDGREY|MIDGRAY|ORANGE|ORANGERED|PEACH|SALMON|LIGHTGREY|LIGHTGRAY|SKYBLUE|TEAL|CYAN|TURQUOISE|SILVER|BROWN|DARKBROWN|LIGHTBROWN|COFFEE|WHITE|PINK|MAGENTA|LIGHTPINK|ROSE|BLACK)\b/);
  return test ? { type: 'constant', content: test[0] } : false;
};

const variable = (code) => {
  const test = code.match(/^([_a-zA-Z0-9]+[$|%])/);
  return test ? { type: 'variable', content: test[0] } : false;
};

const keycode = (code) => {
  const test = code.match(/^(\\[#a-z0-9]+)/i);
  return test ? { type: 'keycode', content: test[0] } : false;
};

const query = (code) => {
  const test = code.match(/^(\?[A-Z]+)\b/);
  return test ? { type: 'query', content: test[0] } : false;
};

const error = (code) => {
  const test1 = code.match(/^\d+/);
  const test2 = code[0] === '#';
  if (test1) return { type: 'unterminated-integer', content: code };
  if (test2) return { type: 'bad-hexadecimal', content: code };
  return { type: 'illegal', content: code.split(/\b/)[0] };
};

const tokenize = (code) => {
  var token;
  var tokens = [];
  while (code.length > 0) {
    token = linebreak(code)
      || spaces(code)
      || comment(code)
      || string(code)
      || operator(code)
      || punctuation(code)
      || binary(code)
      || hexadecimal(code)
      || decimal(code)
      || keyword(code)
      || command(code)
      || custom(code)
      || turtle(code)
      || constant(code)
      || variable(code)
      || keycode(code)
      || query(code)
      || error(code);
    tokens.push(token);
    code = code.slice(token.content.length);
  }
  return tokens;
};

module.exports = tokenize;
