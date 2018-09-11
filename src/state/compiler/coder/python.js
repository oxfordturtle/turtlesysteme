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

// check lexeme has a certain content and is on the same line as previous
const isSameLineContent = (lexemes, lex, content) =>
  isSameLine(lexemes, lex) && (lexemes[lex].content === content);

// check lexeme is indented more than the previous one
const isIndented = (lexemes, lex) =>
  (lexemes[lex].offset > lexemes[lex - 1].offset);

// generate the pcode for a block (i.e. a sequence of commands/structures)
const block = (routine, lex, startLine, offset) => {
  const lexemes = routine.lexemes;
  let pcode = [];
  let pcodeTemp;
  let end = false;
  // expecting something
  if (!lexemes[lex]) throw error('blockNothing', lexemes[lex - 1]);
  // loop through until the end of the block (or we run out of lexemes)
  while (!end && (lex < lexemes.length)) {
    end = (lexemes[lex].offset < offset);
    if (!end) {
      // compile the structure
      pcodeTemp = pcode;
      ({ lex, pcode } = coder(routine, lex, startLine + pcode.length));
      pcode = pcodeTemp.concat(pcode);
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
  if (!lexemes[lex]) throw error('if01', lexemes[lex - 1]);
  if (!isSameLine(lexemes, lex)) throw error('if02', lexemes[lex]);
  // evaluate the boolean expression
  result = atoms.expression(routine, lex, 'null', 'boolean', 'Python');
  lex = result.lex;
  test = result.pcode[0];
  // now we're expecting a colon on the same line
  if (!lexemes[lex]) throw error('if03', lexemes[lex - 1]);
  if (!isSameLineContent(lexemes, lex, ':')) throw error('if04', lexemes[lex]);
  lex += 1;
  // now we're expecting some commands indented on a new line
  if (!lexemes[lex]) throw error('if05', lexemes[lex - 1]);
  if (isSameLine(lexemes, lex)) throw error('if06', lexemes[lex]);
  if (!isIndented(lexemes, lex)) throw error('if07', lexemes[lex]);
  result = block(routine, lex, startLine + 1, lexemes[lex].offset);
  lex = result.lex;
  ifCode = result.pcode;
  // ? ... ELSE ... ?
  if (lexemes[lex] && (lexemes[lex].type === 'else')) {
    // check we're on a new line
    if (isSameLine(lexemes, lex)) throw error('if08', lexemes[lex]);
    lex += 1;
    // now expecting a colon on the same line
    if (!lexemes[lex]) throw error('if09', lexemes[lex - 1]);
    if (!isSameLineContent(lexemes, lex, ':')) throw error('if10', lexemes[lex]);
    lex += 1;
    // now expecting a block of code indented on a new line
    if (!lexemes[lex]) throw error('if11', lexemes[lex - 1]);
    if (isSameLine(lexemes, lex)) throw error('if12', lexemes[lex]);
    if (!isIndented(lexemes, lex)) throw error('if13', lexemes[lex]);
    result = block(routine, lex, startLine + ifCode.length + 2, lexemes[lex].offset);
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
  if (!lexemes[lex]) throw error('for01', lexemes[lex - 1]);
  // turtle globals are not allowed
  if (lexemes[lex].type === 'turtle') throw error('for02', lexemes[lex]);
  // must be an identifier on the same line
  if (!isSameLineType(lexemes, lex, 'identifier')) throw error('for03', lexemes[lex]);
  // must be a variable in scope
  variable = find.variable(routine, lexemes[lex].content, 'Python');
  if (!variable) throw error('for04', lexemes[lex]);
  // must be an integer variable
  if ((variable.fulltype.type !== 'integer') && (variable.fulltype.type !== 'boolint')) {
    throw error('for05', lexemes[lex]);
  }
  // otherwise ok, on we go...
  lex += 1;
  // now expecting 'in range(initial, final, increment):'
  // 'in' first...
  if (!lexemes[lex]) throw error('for06', lexemes[lex - 1]);
  if (!isSameLineContent(lexemes, lex, 'in')) throw error('for07', lexemes[lex]);
  lex += 1;
  // now 'range' please...
  if (!lexemes[lex]) throw error('for08', lexemes[lex - 1]);
  if (!isSameLineContent(lexemes, lex, 'range')) throw error('for09', lexemes[lex]);
  lex += 1;
  // now left bracket...
  if (!lexemes[lex]) throw error('for10', lexemes[lex - 1]);
  if (!isSameLineContent(lexemes, lex, '(')) throw error('for11', lexemes[lex]);
  lex += 1;
  // now expecting an integer expression (for the initial value)
  if (!lexemes[lex]) throw error('for12', lexemes[lex - 1]);
  if (!isSameLine(lexemes, lex)) throw error('for13', lexemes[lex]);
  result = atoms.expression(routine, lex, 'null', 'integer', 'Python');
  lex = result.lex;
  initial = result.pcode[0];
  // now expecting a comma
  if (!lexemes[lex]) throw error('for14', lexemes[lex - 1]);
  if (!isSameLineContent(lexemes, lex, ',')) throw error('for15', lexemes[lex]);
  lex += 1;
  // now expecting an integer expression (for the final value)
  if (!lexemes[lex]) throw error('for16', lexemes[lex - 1]);
  if (!isSameLine(lexemes, lex)) throw error('for17', lexemes[lex]);
  result = atoms.expression(routine, lex, 'null', 'integer', 'Python');
  lex = result.lex;
  final = result.pcode[0];
  // now expecting another comma
  if (!lexemes[lex]) throw error('for18', lexemes[lex - 1]);
  if (!isSameLineContent(lexemes, lex, ',')) throw error('for19', lexemes[lex]);
  lex += 1;
  // now expecting either '1' or '-1'
  if (!lexemes[lex]) throw error('for20', lexemes[lex - 1]);
  if (!isSameLine(lexemes, lex)) throw error('for21', lexemes[lex]);
  if (lexemes[lex].type === 'integer') {
    // only 1 is allowed
    if (lexemes[lex].value !== 1) throw error('for22', lexemes[lex]);
    // otherwise ok
    compare = 'more';
    change = 'incr';
  } else if (lexemes[lex].content === '-') {
    lex += 1;
    // now expecting '1'
    if (!lexemes[lex]) throw error('for23', lexemes[lex - 1]);
    if (!isSameLineType(lexemes, lex, 'integer')) throw error('for24', lexemes[lex]);
    if (lexemes[lex].value !== 1) throw error('for25', lexemes[lex]);
    compare = 'less';
    change = 'decr';
  } else {
    throw error('for26', lexemes[lex]);
  }
  lex += 1;
  // now expecting right bracket
  if (!lexemes[lex]) throw error('for27', lexemes[lex - 1]);
  if (!isSameLineContent(lexemes, lex, ')')) throw error('for28', lexemes[lex]);
  lex += 1;
  // now expecting a colon
  if (!lexemes[lex]) throw error('for29', lexemes[lex - 1]);
  if (!isSameLineContent(lexemes, lex, ':')) throw error('for30', lexemes[lex]);
  lex += 1;
  // now expecting a block of code, indented on a new line
  if (!lexemes[lex]) throw error('for31', lexemes[lex - 1]);
  if (isSameLine(lexemes, lex)) throw error('for32', lexemes[lex]);
  if (!isIndented(lexemes, lex)) throw error('for33', lexemes[lex]);
  result = block(routine, lex, startLine + 3, lexemes[lex].offset);
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
  if (!isSameLineContent(lexemes, lex, ':')) throw error('while04');
  lex += 1;
  // now expecting a block of code, indented on a new line
  if (!lexemes[lex]) throw error('while05');
  if (isSameLine(lexemes, lex)) throw error('while06');
  if (!isIndented(lexemes, lex)) throw error('while07');
  result = block(routine, lex, startLine + 1, lexemes[lex].offset);
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
  switch (lexemes[lex].type) {
    // identifiers (assignment or procedure call)
    case 'turtle': // fallthrough
    case 'identifier':
      // wrong assignment operator
      if (lexemes[lex + 1] && (lexemes[lex + 1].content === '==')) throw error('cmd01');
      if (lexemes[lex + 1] && (lexemes[lex + 1].content === '=')) {
        // right assignment operator
        variable = find.variable(routine, lexemes[lex].content, 'Python');
        return atoms.variableAssignment(routine, variable, lex + 2, 'Python');
      }
      // otherwise it should be a procedure call
      return atoms.commandCall(routine, lex, 'procedure', 'Python');
    // keywords
    case 'keyword':
      switch (lexemes[lex].content) {
        // return (assign return variable of a function)
        case 'return':
          variable = find.variable(routine, 'return', 'Python');
          return atoms.variableAssignment(routine, variable, lex + 1, 'Python');
        // start of IF structure
        case 'if':
          return compileIf(routine, lex + 1, startLine);
        // start of FOR structure
        case 'for':
          return compileFor(routine, lex + 1, startLine);
        // start of WHILE structure
        case 'while':
          return compileWhile(routine, lex + 1, startLine);
      }
    // any thing else is a mistake
    default:
      throw error('cmd02', 'cmdWeird', lexemes[lex]);
  }
};

module.exports = coder;
