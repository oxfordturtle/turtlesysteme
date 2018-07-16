/* compiler/parser2/python
--------------------------------------------------------------------------------
called by parser2; lexemes making up the atoms of a routine go in, inner
pcode for that routine comes out
--------------------------------------------------------------------------------
*/

const atoms = require('./atoms');
const find = require('./find');
const pcoder = require('./pcoder');

// pseudo-constructor for errors
// ----------
const newError = (errorId, messageId, lexeme) => {
  const messages = {};
  return {
    id: 'py2' + errorId,
    messageId,
    message: messages[messageId],
    lexeme,
  };
};

// check lexeme is on the same line as previous
// ----------
const isSameLine = (lexemes, lex) =>
  (lexemes[lex].line === lexemes[lex - 1].line);

// check lexeme has a certain type and is on the same line as previous
// ----------
const isSameLineType = (lexemes, lex, type) =>
  isSameLine(lexemes, lex) && (lexemes[lex].type === type);

const isIndented = (lexemes, lex) =>
  (lexemes[lex].indent > lexemes[lex - 1].indent);

// generate the pcode for a block (i.e. a sequence of commands/structures)
// ----------
const block = (routine, lex, startLine, indent) => {
  const lexemes = routine.lexemes;
  const pcode = [];
  var result;
  var end = false;
  // expecting something
  if (!lexemes[lex]) {
    throw newError('block01', 'blockNothing', lexemes[lex - 1]);
  }
  // loop through until the end of the block (or we run out of lexemes)
  while (!end && (lex < lexemes.length)) {
    end = (lexemes[lex].indent < indent);
    if (!end) {
      // compile the structure
      result = parser2(routine, lex, startLine + pcode.length);
      lex = result.lex;
      pcode = pcode.concat(result.pcode);
    }
  }
  return { lex, pcode };
};

// generate the pcode for an IF structure
// ----------
const compileIf = (routine, lex, startLine) => {
  const lexemes = routine.lexemes;
  var test;
  var ifCode;
  var elseCode = []; // empty by default, in case there is no ELSE
  var result;
  // if we're here, the previous lexeme was IF
  // so now we're expecting a boolean expression on the same line
  if (!lexemes[lex]) throw newError('if01');
  if (!isSameLine(lexemes, lex)) throw newError('if02');
  // evaluate the boolean expression
  result = atoms.expression(routine, lex, 'null', 'bool', 'Python');
  lex = result.lex;
  test = result.pcode[0];
  // now we're expecting a colon on the same line
  if (!lexemes[lex]) throw newError('if03');
  if (!isSameLineType(lexemes, lex, 'colon')) throw newError('if04');
  lex += 1;
  // now we're expecting some commands indented on a new line
  if (!lexemes[lex]) throw newError('if05');
  if (isSameLine(lexemes, lex)) throw newError('if06');
  if (!isIndented(lexemes, lex)) throw newError('if07');
  result = block(routine, lex, startLine + 1, lexemes[lex].indent);
  lex = result.lex;
  ifCode = result.pcode;
  // ? ... ELSE ... ?
  if (lexemes[lex] && (lexemes[lex].type === 'else')) {
    // check we're on a new line
    if (isSameLine(lexemes, lex)) throw newError('if08');
    lex += 1;
    // now expecting a colon on the same line
    if (!lexemes[lex]) throw newError('if09');
    if (!isSameLineType(lexemes, lex, 'colon')) throw newError('if10');
    lex += 1;
    // now expecting a block of code indented on a new line
    if (!lexemes[lex]) throw newError('if11');
    if (isSameLine(lexemes, lex)) throw newError('if12');
    if (!isIndented(lexemes, lex)) throw newError('if13');
    result = block(routine, lex, startLine + ifCode.length + 2, lexemes[lex].indent);
    lex = result.lex;
    elseCode = result.pcode;
  }
  return { lex, pcode: pcoder.conditional(startLine, test, ifCode, elseCode) };
};

// generate the pcode for a FOR structure
// ----------
const compileFor = (routine, lex, startLine) => {
  const lexemes = routine.lexemes;
  var result;
  var variable;
  var compare;
  var change;
  var initial;
  var final;
  var innerCode;
  // expecting an integer variable
  if (!lexemes[lex]) throw newError('for01');
  // turtle globals are not allowed
  if (lexemes[lex].type === 'turtle') throw newError('for02');
  // must be an identifier on the same line
  if (!isSameLineType(lexemes, lex, 'identifier')) throw newError('for03');
  // must be a variable in scope
  variable = find.variable(routine, lexemes[lex].string, 'Python');
  if (!variable) throw newError('for04');
  // must be an integer variable
  if ((variable.type !== 'int') && (variable.type !== 'boolint')) throw newError('for05');
  // otherwise ok, on we go...
  lex += 1;
  // now expecting 'in range(initial, final, increment):'
  // 'in' first...
  if (!lexemes[lex]) throw newError('for06');
  if (!isSameLineType(lexemes, lex, 'in')) throw newError('for07');
  lex += 1;
  // now 'range' please...
  if (!lexemes[lex]) throw newError('for08');
  if (!isSameLineType(lexemes, lex, 'range')) throw newError('for09');
  lex += 1;
  // now left bracket...
  if (!lexemes[lex]) throw newError('for10');
  if (!isSameLineType(lexemes, lex, 'lbkt')) throw newError('for11');
  lex += 1;
  // now expecting an integer expression (for the initial value)
  if (!lexemes[lex]) throw newError('for12');
  if (!isSameLine(lexemes, lex)) throw newError('for13');
  result = atoms.expression(routine, lex, 'null', 'int', 'Python');
  lex = result.lex;
  initial = result.pcode[0];
  // now expecting a comma
  if (!lexemes[lex]) throw newError('for14');
  if (!isSameLineType(lexemes, lex, 'comma')) throw newError('for15');
  lex += 1;
  // now expecting an integer expression (for the final value)
  if (!lexemes[lex]) throw newError('for16');
  if (!isSameLine(lexemes, lex)) throw newError('for17');
  result = atoms.expression(routine, lex, 'null', 'int', 'Python');
  lex = result.lex;
  final = result.pcode[0];
  // now expecting another comma
  if (!lexemes[lex]) throw newError('for18');
  if (!isSameLineType(lexemes, lex, 'comma')) throw newError('for19');
  lex += 1;
  // now expecting either '1' or '-1'
  if (!lexemes[lex]) throw newError('for20');
  if (!isSameLine(lexemes, lex)) throw newError('for21');
  switch (lexemes[lex].type) {
    case 'int':
      // only 1 is allowed
      if (lexemes[lex].value !== 1) throw newError('for22');
      // otherwise ok
      compare = 'more';
      change = 'incr';
      break;
    case 'subt':
      lex += 1;
      // now expecting '1'
      if (!lexemes[lex]) throw newError('for23');
      if (!isSameLineType(lexemes, lex, 'int')) throw newError('for24');
      if (lexemes[lex].value !== 1) throw newError('for25');
      compare = 'less';
      change = 'decr';
      break;
    default:
      throw newError('for26');
  }
  lex += 1;
  // now expecting right bracket
  if (!lexemes[lex]) throw newError('for27');
  if (!isSameLineType(lexemes, lex, 'rbkt')) throw newError('for28');
  lex += 1;
  // now expecting a colon
  if (!lexemes[lex]) throw newError('for29');
  if (!isSameLineType(lexemes, lex, 'colon')) throw newError('for30');
  lex += 1;
  // now expecting a block of code, indented on a new line
  if (!lexemes[lex]) throw newError('for31');
  if (isSameLine(lexemes, lex)) throw newError('for32');
  if (!isIndented(lexemes, lex)) throw newError('for33');
  result = block(routine, lex, startLine + 3, lexemes[lex].indent);
  lex = result.lex;
  innerCode = result.pcode;
  // now we have everything we need to generate the pcode
  return { lex, pcode: pcoder.forLoop(startLine, variable, initial, final, compare, change, innerCode) };
};

// generate the pcode for a WHILE structure
// ----------
const compileWhile = (routine, lex, startLine) => {
  const lexemes = routine.lexemes;
  var result;
  var test;
  var innerCode;
  // expecting a boolean expression on the same line
  if (!lexemes[lex]) throw newError('while01');
  if (!isSameLine(lexemes, lex)) throw newError('while02');
  result = atoms.expression(routine, lex, 'null', 'bool', 'Python');
  lex = result.lex;
  test = result.pcode[0];
  // now expecting a colon on the same line
  if (!lexemes[lex]) throw newError('while03');
  if (!isSameLineType(lexemes, lex, 'colon')) throw newError('while04');
  lex += 1;
  // now expecting a block of code, indented on a new line
  if (!lexemes[lex]) throw newError('while05');
  if (isSameLine(lexemes, lex)) throw newError('while06');
  if (!isIndented(lexemes, lex)) throw newError('while07');
  result = block(routine, lex, startLine + 1, lexemes[lex].indent);
  lex = result.lex;
  innerCode = result.pcode;
  // now we have everything we need to generate the pcode
  return { lex, pcode: pcoder.whileLoop(startLine, test, innerCode) };
};

// generate the pcode for a command structure
// ----------
// a command structure is either a single command (variable assignment or
// procedure call) or some more complex structure (if, for, while, etc.)
// containing a series of such single atoms - in the latter case, the
// function for dealing with the more complex structure calls this function
// again, potentially recursively, allowing for structures of indefinite
// complexity
// ----------
const parser2 = (routine, lex, startLine) => {
  const lexemes = routine.lexemes;
  var variable;
  var pcode;
  var result;
  switch (lexemes[lex].type) {
    // identifiers (assignment or procedure call)
    case 'turtle': // fallthrough
    case 'identifier':
      if (lexemes[lex + 1] && (lexemes[lex + 1].type === 'eqal')) {
        // looks like the wrong assignment operator
        throw newError('cmd01');
      }
      if (lexemes[lex + 1] && (lexemes[lex + 1].type === 'asgn')) {
        // looks like the right assignment operator
        variable = find.variable(routine, lexemes[lex].string, 'Python');
        result = atoms.variableAssignment(routine, variable, lex + 2, 'Python');
      } else {
        // otherwise it should be a procedure call
        result = atoms.commandCall(routine, lex, 'procedure', 'Python');
      }
      lex = result.lex;
      pcode = result.pcode;
      break;
    // return (assign return variable of a function)
    case 'return':
      variable = find.variable(routine, 'return', 'Python');
      result = atoms.variableAssignment(routine, variable, lex + 1, 'Python');
      break;
    // start of IF structure
    case 'if':
      result = compileIf(routine, lex + 1, startLine);
      lex = result.lex;
      pcode = result.pcode;
      break;
    // start of FOR structure
    case 'for':
      result = compileFor(routine, lex + 1, startLine);
      lex = result.lex;
      pcode = result.pcode;
      break;
    // start of WHILE structure
    case 'while':
      result = compileWhile(routine, lex + 1, startLine);
      lex = result.lex;
      pcode = result.pcode;
      break;
    // any thing else is a mistake
    default:
      throw newError('cmd02', 'cmdWeird', lexemes[lex]);
  }
  return { lex, pcode };
};

module.exports = parser2;
