/**
 * compile the basic 'atoms' of a program, i.e. expressions, variable assignments, and command calls
 */
const find = require('./find');
const pcoder = require('./pcoder');

// check if found type is okay, based on what is needed
const typeIsOk = (needed, found) => {
  // if NULL is needed, everything is ok
  if (needed === 'null') return true;
  // found and needed the same is obviously ok
  if (found === needed) return true;
  // if STRING is needed, CHAR is ok
  if ((needed === 'string') && (found === 'char')) return true;
  // if BOOLINT is needed, either BOOLEAN or INTEGER is ok
  if (needed === 'boolint' && (found === 'boolean' || found === 'integer')) return true;
  // if BOOLINT is found, either BOOLEAN or INTEGER needed is ok
  if (found === 'boolint' && (needed === 'boolean' || needed === 'integer')) return true;
  // everything else is an error
  return false;
};

// get unambiguous operator from ambiguous one
const unambiguousOperator = (operator, type) => {
  const integerVersions = ['eqal', 'less', 'lseq', 'more', 'mreq', 'noeq', 'plus'];
  const stringVersions = ['seql', 'sles', 'sleq', 'smor', 'smeq', 'sneq', 'scat'];
  return ((type === 'string') || (type === 'char'))
    ? stringVersions[integerVersions.indexOf(operator)]
    : operator;
};

// generate pcode for an expression (mutually recursive with simple, term, and factor below)
const expression = (routine, lex, type, needed, language) => {
  const { lexemes } = routine;
  const expTypes = ['eqal', 'less', 'lseq', 'more', 'mreq', 'noeq'];
  let operator;
  let pcode;
  let pcodeTemp;
  if (needed === 'boolean') needed = 'null';
  ({ type, lex, pcode } = simple(routine, lex, type, needed, language));
  while (lexemes[lex] && (expTypes.indexOf(lexemes[lex].value) > -1)) {
    operator = unambiguousOperator(lexemes[lex].value, type);
    pcodeTemp = pcode;
    ({ type, lex, pcode } = simple(routine, lex + 1, type, needed, language));
    pcode = merge(pcodeTemp, pcode);
    pcode = merge(pcode, pcoder.applyOperator(operator));
  }
  return { type, lex, pcode };
};

const simple = (routine, lex, type, needed, language) => {
  const { lexemes } = routine;
  const simpleTypes = ['plus', 'subt', 'or', 'xor'];
  let operator;
  let pcode;
  let pcodeTemp;
  ({ type, lex, pcode } = term(routine, lex, type, needed, language));
  while (lexemes[lex] && (simpleTypes.indexOf(lexemes[lex].value) > -1)) {
    operator = unambiguousOperator(lexemes[lex].value, type);
    pcodeTemp = pcode;
    ({ type, lex, pcode } = term(routine, lex + 1, type, needed, language));
    pcode = merge(pcodeTemp, pcode);
    pcode = merge(pcode, pcoder.applyOperator(operator));
  }
  return { type, lex, pcode };
};

const term = (routine, lex, type, needed, language) => {
  const { lexemes } = routine;
  const termTypes = ['and', 'div', 'divr', 'mod', 'mult'];
  let operator;
  let pcode;
  let pcodeTemp;
  ({ type, lex, pcode } = factor(routine, lex, type, needed, language));
  while (lexemes[lex] && termTypes.indexOf(lexemes[lex].value) > -1) {
    operator = lexemes[lex].value;
    pcodeTemp = pcode;
    ({ type, lex, pcode } = factor(routine, lex + 1, type, needed, language));
    pcode = merge(pcodeTemp, pcode);
    pcode = merge(pcode, pcoder.applyOperator(operator));
  }
  return { type, lex, pcode };
};

const factor = (routine, lex, type, needed, language) => {
  const { lexemes } = routine;
  switch (lexemes[lex].type) {
    // operators
    case 'operator':
      return minus(lexemes, lex, needed, language)
        || negative(lexemes, lex, needed, language)
        || (() => { throw error('atoms', 0, lexemes[lex]); })();
    // literal values
    case 'boolean': // fallthrough
    case 'char': // fallthrough
    case 'integer': // fallthrough
    case 'string':
      return literal(lexemes, lex, needed);
    // input codes
    case 'keycode': // fallthrough
    case 'query':
      return input(lexemes, lex, needed, language)
        || (() => { throw error('atoms', 1, lexemes[lex]); })();
    // identifiers
    case 'turtle': // fallthrough
    case 'identifier':
      return constant(routine, lex, needed, language)
        || variable(routine, lex, needed, language)
        || colour(routine, lex, needed, language)
        || command(routine, lex, needed, language)
        || (() => { throw error('atoms', 4, lexemes[lex]); })();
    // everything else
    default:
      return brackets(routine, lex, type, needed, language)
        || (() => { throw error('atoms', 6, lexemes[lex]); })();
  }
};

// factors bottom out at one of the following
const operator = (lexemes, lex, needed, language) => {
  let type, pcode;
  // minus operator
  if (lexemes[lex].content === '-') {
    // check an integer here is ok
    if (!typeIsOk(needed, 'integer')) throw error('atoms', 100, lexemes[lex], needed, 'integer');
    ({ type, lex, pcode } = factor(routine, lex + 1, 'integer', needed, language));
    pcode = merge(pcode, [pcoder.applyOperator('neg')]);
    return { type, lex, pcode };
  }
  // negation operator
  if (lexemes[lex].content === 'not') {
    // check a boolint here is ok
    if (!typeIsOk(needed, 'boolint')) throw error('atoms', 101, lexemes[lex], needed, 'boolint');
    ({ type, lex, pcode } = factor(routine, lex + 1, 'boolint', needed, language));
    pcode = merge(pcode, [pcoder.applyOperator('not')]);
    return { type, lex, pcode };
  }
  // any other operator is an error
  throw error('atoms', 0, lexemes[lex]);
};

const literal = (lexemes, lex, needed) => {
  // check this type here is ok
  if (!typeIsOk(needed, lexemes[lex].type)) {
    throw error('atoms', 102, lexemes[lex], needed, lexemes[lex].type);
  }
  let pcode = [pcoder.loadLiteralValue(lexemes[lex].type, lexemes[lex].value)];
  // maybe add CTOS (char to string) conversion
  if (lexemes[lex].type === 'char' && needed === 'string') {
    pcode[0].push(pcoder.applyOperator('ctos'));
  }
  return { type: lexemes[lex].type, lex: lex + 1, pcode };
};

const input = (lexemes, lex, needed, language) => {
  const input = find.input(lexemes[lex].content, language);
  if (!hit) throw error('atoms', 1, lexemes[lex]);
  if (!typeIsOk(needed, 'integer')) throw error('atoms', 103, lexemes[lex], needed, 'integer');
  return { type: 'integer', lex: lex + 1, pcode: [pcoder.loadInputValue(input)] };
};

const constant = (routine, lex, needed, language) => {
  const { lexemes } = routine;
  const hit = find.constant(routine, lexemes[lex].content, language);
  if (hit) {
    if (!typeIsOk(needed, hit.type)) throw error('atoms', 106, lexemes[lex], needed, hit.type);
    return { type: hit.type, lex: lex + 1, pcode: [pcoder.loadLiteralValue(hit.type, hit.value)] };
  }
}

const variable = (routine, lex, needed, language) => {
  const { lexemes } = routine;
  const hit = find.variable(routine, lexemes[lex].content, language);
  if (hit) {
    if (!typeIsOk(needed, hit.fulltype.type)) throw error('atoms', 107, lexemes[lex], needed, hit.fulltype.type);
    return { type: hit.fulltype.type, lex: lex + 1, pcode: [pcoder.loadVariableValue(hit)] };
  }
};

const colour = (routine, lex, needed, language) => {
  const { lexemes } = routine;
  const hit = find.colour(lexemes[lex].content, language);
  if (hit) {
    if (!typeIsOk(needed, 'integer')) throw error('atoms', 108, lexemes[lex], needed, 'integer');
    return { type: 'integer', lex: lex + 1, pcode: [pcoder.loadLiteralValue('integer', hit.value)] };
  }
};

const command = (routine, lex, needed, language) => {
  const { lexemes } = routine;
  const hit = find.command(routine, lexemes[lex].content, language);
  if (hit) {
    // should be a function
    if (hit.type === 'procedure') throw error('atoms', 3, lexemes[lex]);
    if (!typeIsOk(needed, hit.returns)) throw error('atoms', 109, lexemes[lex], needed, hit.returns);
    ({ lex, pcode } = commandCall(routine, lex, 'function', language));
    // user-defined functions need this at the end
    if (!hit.code) {
      pcode.push(pcoder.loadFunctionReturnValue(hit.resultAddress));
    }
    return { type: hit.returns, lex, pcode };
  }
};

const brackets = (routine, lex, type, needed, language) => {
  if (lexemes[lex].content === '(') {
    ({ type, lex, pcode } = expression(routine, lex + 1, type, needed, language));
    if (lexemes[lex] && (lexemes[lex].content === ')')) {
      return { type, lex: lex + 1, pcode };
    } else {
      throw error('atoms', 5, lexemes[lex - 1]);
    }
  }
};

// variable assignment
const variableAssignment = (routine, variable, lex, language) => {
  const { lexemes } = routine.lexemes;
  let pcode;
  let type;
  if (!lexemes[lex]) throw error('atoms', 7, lexemes[lex - 1]);
  ({ type, lex, pcode } = expression(routine, lex, 'null', variable.fulltype.type, language));
  pcode = merge(pcode, [pcoder.storeVariableValue(variable)]);
  return { lex, pcode };
};

// command call
const commandCall = (routine, lex, expectedType, language) => {
  const lexemes = routine.lexemes;
  const command = find.command(routine, lexemes[lex].content, language);
  if (!command) throw error('cmd01', 'cmdNotFound', lexemes[lex]);
  if (command.type !== expectedType) throw error('cmd02', expectedType, command.type, lexemes[lex]);
  const argsExpected = command.parameters.length;
  let argsGiven;
  let currentArg;
  let variable;
  let pcode = [[]];
  let result;
  if (argsExpected === 0) { // no arguments expected
    if (language === 'Python') {
      if (!lexemes[lex + 1] || (lexemes[lex + 1].content !== '(')) {
        throw error('cmd03', 'cmdLeftBracket', lexemes[lex]);
      }
      lex += 1;
      if (!lexemes[lex + 1] || (lexemes[lex + 1].content !== ')')) {
        throw error('cmd04', 'cmdNoArgs', lexemes[lex - 1]);
      }
      lex += 1;
    } else {
      if (lexemes[lex + 1] && (lexemes[lex + 1].content === '(')) {
        throw error('cmd05', 'cmdNoArgs', lexemes[lex]);
      }
    }
  } else { // some arguments expected
    if (lexemes[lex + 1].content !== '(') {
      throw error('cmd06', 'cmdMissingArgs', lexemes[lex]);
    }
    lex += 2;
    argsGiven = 0;
    while ((argsGiven < argsExpected) && (lexemes[lex].content !== ')')) {
      currentArg = command.parameters[argsGiven];
      if (currentArg.byref) { // reference parameter
        variable = find.variable(routine, lexemes[lex].content, language);
        if (!variable) {
          throw error('cmd07', 'cmdBadRef', lexemes[lex]);
        }
        lex += 1;
        pcode = merge(pcode, [pcoder.loadVariableAddress(variable)]);
      } else { // value parameter
        result = expression(routine, lex, 'null', currentArg.type, language);
        lex = result.lex;
        pcode = merge(pcode, result.pcode);
      }
      argsGiven += 1;
      if (argsGiven < argsExpected) {
        if (!lexemes[lex] || (lexemes[lex].content !== ',')) {
          throw error('cmd08', 'cmdComma', lexemes[lex]);
        }
        lex += 1;
      }
    }
    // final error checking
    if (argsGiven < argsExpected) throw error('cmd09', 'cmdTooFew', lexemes[lex]);
    if (lexemes[lex].content === ',') throw error('cmd10', 'cmdTooMany', lexemes[lex]);
    if (lexemes[lex].content !== ')') throw error('cmd11', 'cmdRightBracket', lexemes[lex - 1]);
  }
  lex += 1;
  if (command.code) {
    // native command
    pcode = merge(pcode, [pcoder.callNativeCommand(command, routine, language)]);
  } else {
    // custom command
    pcode = merge(pcode, [pcoder.callCustomCommand(command.startLine)]);
  }
  return { lex, pcode };
};

// export the three main functions
module.exports = {
  expression,
  variableAssignment,
  commandCall,
};
