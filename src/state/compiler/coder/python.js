/* compiler/coder/python
--------------------------------------------------------------------------------
called by coder; lexemes making up the atoms of a routine go in, inner
pcode for that routine comes out
--------------------------------------------------------------------------------
*/

// local imports
const { atoms, find, pcoder } = require('../tools');

// create an error message
const message = (id) => {
  switch (id) {
    default:
      return id;
  }
};

// create an error object
const error = (messageId, lexeme) =>
  ({ messageId, message: message(messageId), lexeme });

// check lexeme is on the same line as previous
const isSameLine = (lexemes, lex) =>
  (lexemes[lex].line === lexemes[lex - 1].line);

// check lexeme has a certain type and is on the same line as previous
const isSameLineType = (lexemes, lex, type) =>
  isSameLine(lexemes, lex) && (lexemes[lex].type === type);

// check lexeme is indented more than the previous one
const isIndented = (lexemes, lex) =>
  (lexemes[lex].indent > lexemes[lex - 1].indent);

// generate the pcode for a block (i.e. a sequence of commands/structures)
const block = (routine, lex, startLine, indent) => {
  const lexemes = routine.lexemes;
  const pcode = [];
  let result;
  let end = false;
  // expecting something
  if (!lexemes[lex]) throw error('block01', 'blockNothing', lexemes[lex - 1]);
  // loop through until the end of the block (or we run out of lexemes)
  while (!end && (lex < lexemes.length)) {
    end = (lexemes[lex].indent < indent);
    if (!end) {
      // compile the structure
      result = coder(routine, lex, startLine + pcode.length);
      lex = result.lex;
      pcode = pcode.concat(result.pcode);
    }
  }
  return { lex, pcode };
};

// generate the pcode for an IF structure
const compileIf = (routine, lex, startLine) => {
  const lexemes = routine.lexemes;
  let test;
  let ifCode;
  let elseCode = []; // empty by default, in case there is no ELSE
  let result;
  // if we're here, the previous lexeme was IF
  // so now we're expecting a boolean expression on the same line
  if (!lexemes[lex]) throw error('if01');
  if (!isSameLine(lexemes, lex)) throw error('if02');
  // evaluate the boolean expression
  result = atoms.expression(routine, lex, 'null', 'boolean', 'Python');
  lex = result.lex;
  test = result.pcode[0];
  // now we're expecting a colon on the same line
  if (!lexemes[lex]) throw error('if03');
  if (!isSameLineType(lexemes, lex, 'colon')) throw error('if04');
  lex += 1;
  // now we're expecting some commands indented on a new line
  if (!lexemes[lex]) throw error('if05');
  if (isSameLine(lexemes, lex)) throw error('if06');
  if (!isIndented(lexemes, lex)) throw error('if07');
  result = block(routine, lex, startLine + 1, lexemes[lex].indent);
  lex = result.lex;
  ifCode = result.pcode;
  // ? ... ELSE ... ?
  if (lexemes[lex] && (lexemes[lex].type === 'else')) {
    // check we're on a new line
    if (isSameLine(lexemes, lex)) throw error('if08');
    lex += 1;
    // now expecting a colon on the same line
    if (!lexemes[lex]) throw error('if09');
    if (!isSameLineType(lexemes, lex, 'colon')) throw error('if10');
    lex += 1;
    // now expecting a block of code indented on a new line
    if (!lexemes[lex]) throw error('if11');
    if (isSameLine(lexemes, lex)) throw error('if12');
    if (!isIndented(lexemes, lex)) throw error('if13');
    result = block(routine, lex, startLine + ifCode.length + 2, lexemes[lex].indent);
    lex = result.lex;
    elseCode = result.pcode;
  }
  return { lex, pcode: pcoder.conditional(startLine, test, ifCode, elseCode) };
};

// generate the pcode for a FOR structure
const compileFor = (routine, lex, startLine) => {
  const lexemes = routine.lexemes;
  let result;
  let variable;
  let compare;
  let change;
  let initial;
  let final;
  let innerCode;
  // expecting an integer variable
  if (!lexemes[lex]) throw error('for01');
  // turtle globals are not allowed
  if (lexemes[lex].type === 'turtle') throw error('for02');
  // must be an identifier on the same line
  if (!isSameLineType(lexemes, lex, 'identifier')) throw error('for03');
  // must be a variable in scope
  variable = find.variable(routine, lexemes[lex].string, 'Python');
  if (!variable) throw error('for04');
  // must be an integer variable
  if ((variable.type !== 'integer') && (variable.type !== 'boolint')) throw error('for05');
  // otherwise ok, on we go...
  lex += 1;
  // now expecting 'in range(initial, final, increment):'
  // 'in' first...
  if (!lexemes[lex]) throw error('for06');
  if (!isSameLineType(lexemes, lex, 'in')) throw error('for07');
  lex += 1;
  // now 'range' please...
  if (!lexemes[lex]) throw error('for08');
  if (!isSameLineType(lexemes, lex, 'range')) throw error('for09');
  lex += 1;
  // now left bracket...
  if (!lexemes[lex]) throw error('for10');
  if (!isSameLineType(lexemes, lex, 'lbkt')) throw error('for11');
  lex += 1;
  // now expecting an integer expression (for the initial value)
  if (!lexemes[lex]) throw error('for12');
  if (!isSameLine(lexemes, lex)) throw error('for13');
  result = atoms.expression(routine, lex, 'null', 'integer', 'Python');
  lex = result.lex;
  initial = result.pcode[0];
  // now expecting a comma
  if (!lexemes[lex]) throw error('for14');
  if (!isSameLineType(lexemes, lex, 'comma')) throw error('for15');
  lex += 1;
  // now expecting an integer expression (for the final value)
  if (!lexemes[lex]) throw error('for16');
  if (!isSameLine(lexemes, lex)) throw error('for17');
  result = atoms.expression(routine, lex, 'null', 'integer', 'Python');
  lex = result.lex;
  final = result.pcode[0];
  // now expecting another comma
  if (!lexemes[lex]) throw error('for18');
  if (!isSameLineType(lexemes, lex, 'comma')) throw error('for19');
  lex += 1;
  // now expecting either '1' or '-1'
  if (!lexemes[lex]) throw error('for20');
  if (!isSameLine(lexemes, lex)) throw error('for21');
  switch (lexemes[lex].type) {
    case 'integer':
      // only 1 is allowed
      if (lexemes[lex].value !== 1) throw error('for22');
      // otherwise ok
      compare = 'more';
      change = 'incr';
      break;
    case 'subt':
      lex += 1;
      // now expecting '1'
      if (!lexemes[lex]) throw error('for23');
      if (!isSameLineType(lexemes, lex, 'integer')) throw error('for24');
      if (lexemes[lex].value !== 1) throw error('for25');
      compare = 'less';
      change = 'decr';
      break;
    default:
      throw error('for26');
  }
  lex += 1;
  // now expecting right bracket
  if (!lexemes[lex]) throw error('for27');
  if (!isSameLineType(lexemes, lex, 'rbkt')) throw error('for28');
  lex += 1;
  // now expecting a colon
  if (!lexemes[lex]) throw error('for29');
  if (!isSameLineType(lexemes, lex, 'colon')) throw error('for30');
  lex += 1;
  // now expecting a block of code, indented on a new line
  if (!lexemes[lex]) throw error('for31');
  if (isSameLine(lexemes, lex)) throw error('for32');
  if (!isIndented(lexemes, lex)) throw error('for33');
  result = block(routine, lex, startLine + 3, lexemes[lex].indent);
  lex = result.lex;
  innerCode = result.pcode;
  // now we have everything we need to generate the pcode
  return { lex, pcode: pcoder.forLoop(startLine, variable, initial, final, compare, change, innerCode) };
};

// generate the pcode for a WHILE structure
const compileWhile = (routine, lex, startLine) => {
  const lexemes = routine.lexemes;
  let result;
  let test;
  let innerCode;
  // expecting a boolean expression on the same line
  if (!lexemes[lex]) throw error('while01');
  if (!isSameLine(lexemes, lex)) throw error('while02');
  result = atoms.expression(routine, lex, 'null', 'bool', 'Python');
  lex = result.lex;
  test = result.pcode[0];
  // now expecting a colon on the same line
  if (!lexemes[lex]) throw error('while03');
  if (!isSameLineType(lexemes, lex, 'colon')) throw error('while04');
  lex += 1;
  // now expecting a block of code, indented on a new line
  if (!lexemes[lex]) throw error('while05');
  if (isSameLine(lexemes, lex)) throw error('while06');
  if (!isIndented(lexemes, lex)) throw error('while07');
  result = block(routine, lex, startLine + 1, lexemes[lex].indent);
  lex = result.lex;
  innerCode = result.pcode;
  // now we have everything we need to generate the pcode
  return { lex, pcode: pcoder.whileLoop(startLine, test, innerCode) };
};

/**
 * generate the pcode for a command structure
 *
 * a command structure is either a single command (variable assignment or // procedure call) or some
 * more complex structure (if, for, while, etc.) containing a series of such single atoms
 * in the latter case, the function for dealing with the more complex structure calls this function
 * again, potentially recursively, allowing for structures of indefinite complexity
 */
const coder = (routine, lex, startLine) => {
  const lexemes = routine.lexemes;
  let variable;
  let pcode;
  let result;
  switch (lexemes[lex].type) {
    // identifiers (assignment or procedure call)
    case 'turtle': // fallthrough
    case 'identifier':
      // wrong assignment operator
      if (lexemes[lex + 1] && (lexemes[lex + 1].content === '==')) throw error('cmd01');
      if (lexemes[lex + 1] && (lexemes[lex + 1].type === '=')) {
        // right assignment operator
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
      throw error('cmd02', 'cmdWeird', lexemes[lex]);
  }
  return { lex, pcode };
};

module.exports = coder;
