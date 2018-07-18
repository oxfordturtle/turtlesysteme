/**
 * coder for Turtle Pascal; lexemes making up the atoms of a routine go in, inner pcode for that
 * routine comes out
 */

// local imports
const { atoms, find, pcoder } = require('../tools');

// create an error message
const message = (id, lexeme) => {
  switch (id) {
    case 'ifExpression':
      return '"IF" must be followed by a boolean expression.';
    case 'ifThen':
      return '"IF ..." must be followed by "THEN".';
    case 'ifNothing':
      return 'No commands found after "IF".';
    case 'elseNothing':
      return 'No commands found after "ELSE".';
    case 'forVariable':
      return '"FOR" must be followed by an integer variable.';
    case 'forTurtle':
      return 'Turtle attribute cannot be used as a "FOR" variable.';
    case 'forNotFound':
      return `Variable "${lexeme.content}" not defined.`;
    case 'forNotInteger':
      return `"${lexeme.content}" is not an integer variable.`;
    case 'forAssignment':
      return '"FOR" variable must be assigned an initial value.';
    case 'forEquals':
      return 'Assignment operator is ":=", not "=".';
    case 'forInitial':
      return '"FOR" loop variable must be assigned an initial value.';
    case 'forToDownTo':
      return '"FOR ... := ..." must be followed by "TO" or "DOWNTO".';
    case 'forToNothing':
      return `"${lexeme.content.toUpperCase()}" must be followed by an integer (or integer constant).`;
    case 'forDo':
      return '"FOR" loop range must be followed by "DO".';
    case 'forNothing':
      return 'No commands found after "FOR" loop initialisation.';
    case 'repeatExpression':
      return '"UNTIL" must be followed by a boolean expression.';
    case 'whileExpression':
      return '"WHILE" must be followed by a boolean expression.';
    case 'whileDo':
      return '"WHILE ..." must be followed by "DO".';
    case 'whileNothing':
      return 'No commands found after "WHILE ... DO".';
    case 'blockNothing':
      return 'No commands found after "BEGIN".';
    case 'blockBegin':
      return `"END" expected, not "${lexeme.content.toUpperCase()}".`;
    case 'blockRepeat':
      return `"UNTIL" expected, not "${lexeme.content.toUpperCase()}".`;
    case 'blockNoEnd':
      return '"BEGIN" does not have any matching "END".';
    case 'cmdEqal':
      return 'Variable assignment requires ":=" rather than "=".';
    case 'cmdSemicolon':
      return 'Semicolon needed after command.';
    case 'cmdWeird':
      return `Command cannot begin with "${lexeme.content}".`;
    default:
      return id;
  }
};

// create an error object
const error = (messageId, lexeme) =>
  ({ messageId, message: message(messageId), lexeme });

// check for the ending to a block, and throw an error if it doesn't match the beginning
const blockEndCheck = (startLexeme, lexeme) => {
  switch (lexeme.content) {
    case 'end':
      if (startLexeme !== 'begin') throw error('blockBegin', lexeme);
      return true;
    case 'until':
      if (startLexeme !== 'repeat') throw error('blockRepeat', lexeme);
      return true;
    default:
      return false;
  }
};

// generate the pcode for a block (i.e. a sequence of commands/structures)
const block = (routine, lex, startLine, startLexeme, indent) => {
  const lexemes = routine.lexemes;
  let result = [];
  let end = false;
  let pcode;
  // expecting something
  if (!lexemes[lex]) throw error('blockNothing', lexemes[lex - 1]);
  // loop through until the end of the block (or we run out of lexemes)
  while (!end && (lex < lexemes.length)) {
    end = blockEndCheck(start, lexemes[lex]);
    if (end) {
      // move past the end lexeme
      lex += 1;
    } else {
      // compile the structure
      ({ lex, pcode } = coder(routine, lex, startLine + result.length));
      result = result.concat(pcode);
    }
  }
  // if we've run out of lexemes without reaching the end, this is an error
  if (!end) throw error('blockNoEnd', lexemes[lex - 1]);
  return { lex, pcode: result };
};

// generate the pcode for an IF structure
const compileIf = (routine, lex, startLine) => {
  const lexemes = routine.lexemes;
  const pcode = [];
  const result = {};
  let ifnoLine = 0;
  let elseJump = 0;
  let oneLine = true; // for BASIC only
  // if we're here, the previous lexeme was IF
  // so now we're expecting a boolean expression
  if (!lexemes[lex]) {
    throw error('if01', 'ifExpression', lexemes[lex - 1]);
  }
  // must be on the same line for Python
  if (language === 'Python') {
    if (lexemes[lex].line > lexemes[lex - 1].line) {
      throw error('if06', 'ifColonLine', lexemes[lex]);
    }
  }
  // evaluate the boolean expression
  result = commands.expression(routines, sub, lex, addresses, 'null', 'bool', false);
  lex = result.lex;
  pcode = result.pcode;
  // push IFNO to the end of the pcode, and save the line for fixing the
  // jump later
  ifnoLine = pcode.length - 1;
  pcode[ifnoLine].push(pc.ifno);
  // now we're expecting THEN (BASIC and Pascal) or a colon (Python)
  switch (language) {
    case 'BASIC': // fallthrough
    case 'Pascal':
      if (!lexemes[lex]) {
        throw error('if02', 'ifThen', lexemes[lex - 1]);
      }
      if (lexemes[lex].type !== 'then') {
        throw error('if03', 'ifThen', lexemes[lex]);
      }
      break;
    case 'Python':
      if (!lexemes[lex]) {
        throw error('if04', 'ifColon', lexemes[lex - 1]);
      }
      if (lexemes[lex].type !== 'colon') {
        throw error('if05', 'ifColon', lexemes[lex]);
      }
      if (lexemes[lex].line > lexemes[lex - 1].line) {
        throw error('if06', 'ifColonLine', lexemes[lex]);
      }
      break;
  }
  // expecting some commands next
  lex += 1;
  if (!lexemes[lex]) {
    throw error('if07', 'ifNothing', lexemes[lex]);
  }
  // now things are a bit different for the different languages ...
  switch (language) {
    case 'BASIC':
      if (lexemes[lex].line > lexemes[lex - 1].line) {
        // if we're on a new line, expect a block of structures
        result = block(routines, sub, lex, addresses, offset + pcode.length, 'if', null);
        // and set oneLine to false, so we know to check that any
        // subsequent ELSE is on a new line
        oneLine = false;
      } else {
        // otherwise just expect a single structure
        result = structure(routines, sub, lex, addresses, offset + pcode.length);
      }
      break;
    case 'Pascal':
      if (lexemes[lex].type === 'begin') {
        // if there's a BEGIN, expect a block of structures
        result = block(routines, sub, lex + 1, addresses, offset + pcode.length, 'begin', null);
      } else {
        // otherwise just expect a single structure
        result = structure(routines, sub, lex, addresses, offset + pcode.length);
      }
      break;
    case 'Python':
      // always treat what follows as a block in Python, except the block
      // may consist of just a single command - it makes no difference
      result = block(routines, sub, lex, addresses, offset + pcode.length, null, lexemes[lex].indent);
      break;
  }
  lex = result.lex;
  pcode = pcode.concat(result.pcode);
  // ? ... ELSE ... ?
  if (elseCheck(language, lexemes, lex, oneLine)) {
    lex += 1; // move past 'else'
    if (!lexemes[lex]) {
      throw error('if04', 'elseNothing', lexemes[lex]);
    }
    elseJump = pcode.length;
    pcode.push([pc.jump]);
    // now things are a bit different for the different languages
    switch (language) {
      case 'BASIC':
        if (lexemes[lex].line > lexemes[lex - 1].line) {
          // if we're on a new line, expect a block of structures
          result = block(routines, sub, lex, addresses, offset + pcode.length, 'else', null);
        } else {
          // otherwise just expect a single structure
          result = structure(routines, sub, lex, addresses, offset + pcode.length);
        }
        break;
      case 'Pascal':
        if (lexemes[lex].type === 'begin') {
          // if there's a BEGIN, expect a block of structures
          result = block(routines, sub, lex + 1, addresses, offset + pcode.length, 'begin', null);
        } else {
          // otherwise just expect a single structure
          result = structure(routines, sub, lex, addresses, offset + pcode.length);
        }
        break;
      case 'Python':
        // always treat what follows as a block in Python, except the block
        // may consist of just a single command - it makes no difference
        result = block(routines, sub, lex, addresses, offset + pcode.length, null, lexemes[lex].indent);
        break;
    }
    lex = result.lex;
    pcode = pcode.concat(result.pcode);
    pcode[elseJump].push(offset + pcode.length + 1);
    pcode[ifnoLine].push(offset + elseJump + 2);
  } else {
    // no ELSE, just finish the IF
    pcode[ifnoLine].push(offset + pcode.length + 1);
  }
  return { lex, pcode };
};

// generate the pcode for a FOR structure
const compileFor = (routine, lex, startLine) => {
  let lexemes = routine.lexemes;
  let pcode = [];
  let result = {};
  let variable = {};
  let increment = 0;
  if (!lexemes[lex]) {
    throw error('for01', 'forVariable', lexemes[lex - 1]);
  }
  if (lexemes[lex].type === 'turtle') {
    throw error('for02', 'forTurtle', lexemes[lex]);
  }
  if (lexemes[lex].type !== 'identifier') {
    throw error('for03', 'forVariable', lexemes[lex]);
  }
  variable = find.variable(routines, sub, lexemes[lex].string);
  if (!variable) {
    throw error('for04', 'forNotFound', lexemes[lex]);
  }
  if ((variable.type !== 'int') && (variable.type !== 'boolint')) {
    throw error('for05', 'forNotInteger', lexemes[lex]);
  }
  if (!lexemes[lex + 1]) {
    throw error('for06', 'forAssignment', lexemes[lex]);
  }
  lex += 1;
  switch (language) {
    case 'BASIC':
      if (lexemes[lex].type !== 'eqal') {
        throw error('for08', 'forAssignment', lexemes[lex]);
      }
      break;
    case 'Pascal':
      if (lexemes[lex].type === 'eqal') {
        throw error('for07', 'forEquals', lexemes[lex]);
      }
      if (lexemes[lex].type !== 'asgn') {
        throw error('for08', 'forAssignment', lexemes[lex]);
      }
      break;
    case 'Python':
      // WIP ...
      break;
  }
  if (!lexemes[lex + 1]) {
    throw error('for09', 'forInitial', lexemes[lex]);
  }
  lex += 1;
  result = commands.expression(routines, sub, lex, addresses, 'null', 'int', false);
  lex = result.lex;
  pcode = result.pcode;
  pcode.push(values.storeVariable(variable));
  if (!lexemes[lex]) {
    throw error('for10', 'forToDownTo', lexemes[lex - 1]);
  }
  switch (lexemes[lex].type) {
    case 'to':
      increment = 1;
      break;
    case 'downto':
      increment = -1;
      break;
    default:
      throw error('for11', 'forToDownTo', lexemes[lex]);
  }
  if (!lexemes[lex + 1]) {
    throw error('for12', 'forToNothing', lexemes[lex]);
  }
  lex += 1;
  result = commands.expression(routines, sub, lex, addresses, 'null', 'int', false);
  lex = result.lex;
  pcode[pcode.length - 1] = pcode[pcode.length - 1].concat(result.pcode.shift());
  pcode = pcode.concat(result.pcode);
  // for Pascal, we already know the increment; for BASIC, we may now
  // need to change the default...
  if (language === 'BASIC') {
    if (lexemes[lex] && lexemes[lex].type === 'step') {
      if (!lexemes[lex + 1]) {
        throw error('for13', 'forStep', lexemes[lex]);
      }
      lex += 1;
      if (lexemes[lex].type !== 'subt') {
        throw error('for14', 'forStep', lexemes[lex]);
      }
      if (!lexemes[lex + 1]) {
        throw error('for15', 'forStep', lexemes[lex]);
      }
      lex += 1;
      if (lexemes[lex].string !== '1') {
        throw error('for16', 'forStep', lexemes[lex]);
      }
      lex += 1;
      increment = -1;
    }
  }
  pcode.push(values.loadVariable(variable, false));
  if (increment > 0) {
    pcode[pcode.length - 1].push(pc.mreq);
  } else {
    pcode[pcode.length - 1].push(pc.lseq);
  }
  pcode[pcode.length - 1].push(pc.ifno);
  // Pascal requires DO at this point
  if (language === 'Pascal') {
    if (!lexemes[lex]) {
      throw error('for17', 'forDo', lexemes[lex - 1]);
    }
    if (lexemes[lex].type !== 'do') {
      throw error('for18', 'forDo', lexemes[lex]);
    }
    lex += 1;
  }
  if (!lexemes[lex]) {
    throw error('for19', 'forNothing', lexemes[lex]);
  }
  switch (language) {
    case 'BASIC':
      if (lexemes[lex - 1].line < lexemes[lex].line) {
        result = block(routines, sub, lex, addresses, offset + pcode.length, 'for');
      } else {
        result = structure(routines, sub, lex, addresses, offset + pcode.length);
      }
      break;
    case 'Pascal':
      if (lexemes[lex].type === 'begin') {
        result = block(routines, sub, lex + 1, addresses, offset + pcode.length, 'begin');
      } else {
         result = structure(routines, sub, lex, addresses, offset + pcode.length);
      }
      break;
    case 'Python':
      break;
  }
  lex = result.lex;
  pcode = pcode.concat(result.pcode);
  pcode.push(values.loadVariable(variable));
  if (increment > 0) {
    pcode[pcode.length - 1].push(pc.incr);
  } else {
    pcode[pcode.length - 1].push(pc.decr);
  }
  pcode[pcode.length - 1].push(pc.jump);
  pcode[pcode.length - 1].push(offset + 2);
  pcode[2].push(offset + pcode.length + 1); // backpatch initial IFNO jump
  return { lex, pcode };
};

// generate the pcode for a REPEAT structure
const compileRepeat = (routine, lex, startLine) => {
  let lexemes = routine.lexemes;
  let pcode = [];
  let result = {};
  result = block(routines, sub, lex, addresses, offset + pcode.length, 'repeat');
  lex = result.lex;
  pcode = pcode.concat(result.pcode);
  if (!lexemes[lex]) {
    throw error('repeat01', 'repeatExpression', lexemes[lex - 1]);
  }
  result = commands.expression(routines, sub, lex, addresses, 'null', 'bool', false);
  lex = result.lex;
  pcode = pcode.concat(result.pcode);
  pcode[pcode.length - 1].push(pc.ifno);
  pcode[pcode.length - 1].push(offset + 1);
  return { lex, pcode };
};

// generate the pcode for a WHILE structure
const compileWhile = (routines, sub, lex, addresses, offset) => {
  let language = routines[0].language;
  let lexemes = routines[sub].lexemes;
  let pcode = [];
  let result = {};
  let ifnoLine = 0;
  if (!lexemes[lex]) {
    throw error('while01', 'whileExpression', lexemes[lex - 1]);
  }
  result = commands.expression(routines, sub, lex, addresses, 'null', 'bool', false);
  lex = result.lex;
  pcode = result.pcode;
  ifnoLine = pcode.length - 1;
  pcode[ifnoLine].push(pc.ifno);
  if (language === 'Pascal') { // Pascal requires DO after WHILE expression
    if (!lexemes[lex]) {
      throw error('while02', 'whileDo', lexemes[lex - 1]);
    }
    if (lexemes[lex].type !== 'do') {
      throw error('while03', 'whileDo', lexemes[lex]);
    }
    lex += 1;
  }
  if (!lexemes[lex]) {
    throw error('while04', 'whileNothing', lexemes[lex]);
  }
  switch (language) {
    case 'BASIC':
      if (lexemes[lex].line > lexemes[lex - 1].line) {
        result = block(routines, sub, lex, addresses, offset + pcode.length, 'while');
      } else {
        result = structure(routines, sub, lex, addresses, offset + pcode.length);
      }
      break;
    case 'Pascal':
      if (lexemes[lex].type === 'begin') {
        result = block(routines, sub, lex + 1, addresses, offset + pcode.length, 'begin');
      } else {
        result = structure(routines, sub, lex, addresses, offset + pcode.length);
      }
      break;
    case 'Python':
      // WIP ...
      break;
  }
  lex = result.lex;
  pcode = pcode.concat(result.pcode);
  pcode.push([pc.jump, offset + 1]);
  pcode[ifnoLine].push(offset + pcode.length + 1);
  return { lex, pcode };
};

/**
 * generate the pcode for a command structure
 *
 * a command structure is either a single command (variable assignment or // procedure call) or some
 * more complex structure (if, for, while, etc.) containing a series of such single atoms
 * in the latter case, the function for dealing with the more complex structure calls this function
 * again, potentially recursively, allowing for structures of indefinite complexity
 */
const coder = function (routine, lex, startLine) {
  const lexemes = routine.lexemes;
  const noSemiAfter = [ 'begin', 'do', 'dot', 'repeat', 'semicolon', 'then' ];
  const noSemiBefore = [ 'else', 'end', 'semicolon', 'until' ];
  let variable;
  let pcode;
  if (lexemes[lex].type === 'turtle' || lexemes[lex].type === 'identifier') {
    // wrong assignment operator
    if (lexemes[lex + 1] && (lexemes[lex + 1].content === '=')) throw error('cmd01');
    if (lexemes[lex + 1] && (lexemes[lex + 1].type === ':=')) {
      // right assignment operator
      variable = find.variable(routine, lexemes[lex].content, 'Pascal');
      ({ lex, pcode } = atoms.variableAssignment(routine, variable, lex + 2, 'Pascal'));
    } else {
      // otherwise it should be a procedure call
      ({ lex, pcode } = atoms.commandCall(routine, lex, 'procedure', 'Pascal'));
    }
  } else {
    switch (lexemes[lex].content) {
      case 'if':
        ({ lex, pcode } = compileIf(routine, lex + 1, startLine));
        break;
      case 'for':
        ({ lex, pcode } = compileFor(routine, lex + 1, startLine));
        break;
      case 'repeat':
        ({ lex, pcode } = compileRepeat(routine, lex + 1, startLine));
        break;
      case 'while':
        ({ lex, pcode } = compileWhile(routine, lex + 1, startLine));
        break;
      default:
        throw error('cmdWeird', lexemes[lex]);
    }
  }
  // semicolon check
  if (lexemes[lex]) {
    if (lexemes[lex].content !== ';') {
      if (noSemiAfter.indexOf(lexemes[lex - 1].content) === -1) {
        if (noSemiBefore.indexOf(lexemes[lex].content) === -1) {
          throw error('cmdSemicolon', lexemes[lex]);
        }
      }
    } else {
      while (lexemes[lex] && lexemes[lex].content === ';') {
        lex += 1;
      }
    }
  }
  return { lex, pcode };
};

// exports
module.exports = coder;
