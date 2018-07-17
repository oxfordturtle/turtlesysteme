/* compiler/tools/atoms
--------------------------------------------------------------------------------

--------------------------------------------------------------------------------
*/

const find = require('./find');
const pcoder = require('./pcoder');

// pseudo-constructor for type errors
const newTypeError = (errorId, needed, found, lexeme) =>
  ({
    id: errorId,
    messageId: 'expType',
    message: `Type error: '${needed}' expected but '${found}' found.`,
    lexeme,
  });

// pseudo-constructor for function return type error
const newTypeFnError = (errorId, needed, found, lexeme) =>
  ({
    id: errorId,
    messageId: 'cmdFuncType',
    message: `Type error: '${lexeme.content}' returns '${found}' rather than '${needed}'.`,
    lexeme,
  });

// pseudo-constructor for any other error
const newError = (errorId, messageId, lexeme) => {
  const messages = {
    expBracket: 'Closing bracket missing after expression.',
    expKeycode: `'${lexeme.content}' is not a valid keycode.`,
    expQuery: `'${lexeme.content}' is not a valid input query.`,
    expProcedure: `'${lexeme.content}' is a procedure, not a function.`,
    expNotFound: `'${lexeme.content}' is not defined.`,
    expWeird: `'${lexeme.content}' makes no sense here.`,
    asgnConst: `'${lexeme.content}' is a constant, not a variable.`,
    asgnNotFound: `'${lexeme.content}' is not defined.`,
    asgnNothing: `'${lexeme.content}' must be followed by a value.`,
    cmdNotFound: `Command '${lexeme.content}' is not defined.`,
    cmdLeftBracket: 'Opening bracket missing after command.',
    cmdNoArgs: `Command '${lexeme.content}' does not take any arguments.`,
    cmdMissingArgs: `Arguments missing for command '${lexeme.content}'.`,
    cmdBadRef: 'Reference parameter should be a defined variable.',
    cmdComma: 'Comma needed after parameter.',
    cmdTooFew: 'Not enough arguments have been given for this command.',
    cmdTooMany: 'Too many arguments have been given for this command.',
    cmdRightBracket: 'Closing bracket missing after command arguments.'
  };
  return {
    id: errorId,
    message: messages[messageId],
    messageId,
    lexeme,
  };
};

// check if found type is okay, based on what is needed
const typeIsOk = (typeNeeded, typeFound) => {
  // if NULL is needed, everything is ok
  if (typeNeeded === 'null') return true;
  // found and needed the same is obviously ok
  if (typeFound === typeNeeded) return true;
  // if STRING is needed, CHAR is ok
  if ((typeNeeded === 'string') && (typeFound === 'char')) return true;
  // if BOOLINT is needed, either BOOLEAN or INTEGER is ok
  if (typeNeeded === 'boolint' && (typeFound === 'boolean' || typeFound === 'integer')) return true;
  // if BOOLINT is found, either BOOLEAN or INTEGER needed is ok
  if (typeFound === 'boolint' && (typeNeeded === 'boolean' || typeNeeded === 'integer')) return true;
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

// merge two arrays of pcode into one, without a line break between the last line of the first, and
// the first line of the second
const mergeLines = (pcode1, pcode2) => {
  const last = pcode1.length - 1;
  pcode1[last] = pcode1[last].concat(pcode2.shift());
  return pcode1.concat(pcode2);
};

// generate pcode for an expression
const expression = (routine, lex, type, typeNeeded, language) => {
  const lexemes = routine.lexemes;
  const expTypes = ['eqal', 'less', 'lseq', 'more', 'mreq', 'noeq'];
  var operator;
  var pcode;
  var pcodeTemp;
  if (typeNeeded === 'boolean') typeNeeded = 'null';
  ({ type, lex, pcode } = simple(routine, lex, type, typeNeeded, language));
  while (lexemes[lex] && (expTypes.indexOf(lexemes[lex].type) > -1)) {
    operator = unambiguousOperator(lexemes[lex].type, type);
    lex += 1;
    pcodeTemp = pcode;
    ({ type, lex, pcode } = simple(routine, lex, type, typeNeeded, language));
    pcode = mergeLines(pcodeTemp, pcode);
    pcode = mergeLines(pcode, pcoder.applyOperator(operator));
  }
  return { type, lex, pcode };
};

const simple = (routine, lex, type, typeNeeded, language) => {
  const lexemes = routine.lexemes;
  const simpleTypes = ['plus', 'subt', 'or', 'xor'];
  var operator;
  var pcode;
  var pcodeTemp;
  ({ type, lex, pcode } = term(routine, lex, type, typeNeeded, language));
  while (lexemes[lex] && (simpleTypes.indexOf(lexemes[lex].type) > -1)) {
    operator = unambiguousOperator(lexemes[lex].type, type);
    lex += 1;
    pcodeTemp = pcode;
    ({ type, lex, pcode } = term(routine, lex, type, typeNeeded, language));
    pcode = mergeLines(pcodeTemp, pcode);
    pcode = mergeLines(pcode, pcoder.applyOperator(operator));
  }
  return { type, lex, pcode };
};

const term = (routine, lex, type, typeNeeded, language) => {
  const lexemes = routine.lexemes;
  const termTypes = ['and', 'div', 'divr', 'mod', 'mult'];
  var operator;
  var pcode;
  var pcodeTemp;
  ({ type, lex, pcode } = factor(routine, lex, type, typeNeeded, language));
  while (lexemes[lex] && termTypes.indexOf(lexemes[lex].type) > -1) {
    operator = lexemes[lex].type;
    lex += 1;
    pcodeTemp = pcode;
    ({ type, lex, pcode } = factor(routine, lex, type, typeNeeded, language));
    pcode = mergeLines(pcodeTemp, pcode);
    pcode = mergeLines(pcode, pcoder.applyOperator(operator));
  }
  return { type, lex, pcode };
};

const factor = (routine, lex, type, typeNeeded, language) => {
  const lexemes = routine.lexemes;
  var typeFound;
  var operator;
  var pcode;
  var pcodeTemp;
  var constant;
  var variable;
  var colour;
  var input;
  var command;
  switch (lexemes[lex].type) {
    // operators
    case 'operator':
      if (lexemes[lex].content === '-') {
        typeFound = 'integer';
        if (!typeIsOk(typeNeeded, typeFound)) {
          throw newTypeError('exp01', typeNeeded, typeFound, lexemes[lex]);
        }
        type = typeFound;
        operator = 'neg';
        lex += 1;
        ({ type, lex, pcode } = factor(routine, lex, type, typeNeeded, language));
        pcode = mergeLines(pcode, [pcoder.applyOperator(operator)]);
      } else if (lexemes[lex].value === 'not') {
        typeFound = 'boolint';
        if (!typeIsOk(typeNeeded, typeFound)) {
          throw newTypeError('exp02', typeNeeded, typeFound, lexemes[lex]);
        }
        type = typeFound;
        operator = lexemes[lex].value;
        lex += 1;
        result = factor(routine, lex, type, typeNeeded, language);
        type = result.type;
        lex = result.lex;
        pcode = mergeLines(result.pcode, [pcoder.applyOperator(operator)]);
      } else {
        throw newError();
      }
      break;
    // brackets
    case 'lbkt':
      lex += 1;
      result = expression(routine, lex, type, typeNeeded, language);
      type = result.type;
      lex = result.lex;
      pcode = result.pcode;
      if (lexemes[lex] && (lexemes[lex].type === 'rbkt')) {
        lex += 1;
      } else {
        throw newError('exp03', 'expBracket', lexemes[lex - 1]);
      }
      break;
    // literal values
    case 'integer':
      typeFound = 'integer';
      if (!typeIsOk(typeNeeded, typeFound)) {
        throw newTypeError('exp04', typeNeeded, typeFound, lexemes[lex]);
      }
      type = typeFound;
      pcode = [pcoder.loadLiteralValue('int', lexemes[lex].value)];
      lex += 1;
      break;
    case 'boolean':
      typeFound = 'boolean';
      if (!typeIsOk(typeNeeded, typeFound)) {
        throw newTypeError('exp05', typeNeeded, typeFound, lexemes[lex]);
      }
      type = typeFound;
      pcode = [pcoder.loadLiteralValue('bool', lexemes[lex].value)];
      lex += 1;
      break;
    case 'char':
      typeFound = 'char';
      if (!typeIsOk(typeNeeded, typeFound)) {
        throw newTypeError('exp06', typeNeeded, typeFound, lexemes[lex]);
      }
      type = typeFound;
      pcode = [pcoder.loadLiteralValue('char', lexemes[lex].value)];
      if (typeNeeded === 'str') {
        pcode[0].push(pcoder.applyOperator('ctos'));
      }
      lex += 1;
      break;
    case 'string':
      typeFound = 'string';
      if (!typeIsOk(typeNeeded, typeFound)) {
        throw newTypeError('exp07', typeNeeded, typeFound, lexemes[lex]);
      }
      type = typeFound;
      pcode = [pcoder.loadLiteralValue('str', lexemes[lex].value)];
      lex += 1;
      break;
    case 'keycode':
      input = find.input(lexemes[lex].string, language);
      if (!input) {
        throw newError('exp08', 'expKeycode', lexemes[lex]);
      }
      type = 'int';
      pcode = [pcoder.loadKeyValue(input)];
      lex += 1;
      break;
    case 'query':
      input = find.input(lexemes[lex].string, language);
      if (!input) {
        throw newError('exp09', 'expQuery', lexemes[lex]);
      }
      type = 'int';
      pcode = [pcoder.loadQueryValue(input)];
      lex += 1;
      break;
    case 'turtle': // fallthrough
    case 'command': // fallthrough
    case 'custom': // fallthrough
    case 'constant': // fallthrough
    case 'identifier':
      constant = find.constant(routine, lexemes[lex].string, language);
      if (constant) {
        typeFound = constant.type;
        if (!typeIsOk(typeNeeded, typeFound)) {
          throw newTypeError('exp10', typeNeeded, typeFound, lexemes[lex]);
        }
        type = typeFound;
        pcode = [pcoder.loadLiteralValue(constant.type, constant.value)];
        lex += 1;
        break;
      }
      variable = find.variable(routine, lexemes[lex].string, language);
      if (variable) {
        typeFound = variable.type;
        if (!typeIsOk(typeNeeded, typeFound)) {
          throw newTypeError('exp11', typeNeeded, typeFound, lexemes[lex]);
        }
        type = typeFound;
        pcode = [pcoder.loadVariableValue(variable)];
        lex += 1;
        break;
      }
      colour = find.colour(lexemes[lex].string, language);
      if (colour) {
        typeFound = colour.type;
        if (!typeIsOk(typeNeeded, typeFound)) {
          throw newTypeError('exp12', typeNeeded, typeFound, lexemes[lex]);
        }
        type = typeFound;
        pcode = [pcoder.loadLiteralValue(colour.type, colour.value)];
        lex += 1;
        break;
      }
      command = find.anyCommand(routine, lexemes[lex].string, language);
      if (command) {
        if (command.type === 'procedure') {
          throw newError('exp13', 'expProcedure', lexemes[lex]);
        }
        typeFound = command.returns;
        if (!typeIsOk(typeNeeded, typeFound)) {
          throw newTypeError('exp14', typeNeeded, typeFound, lexemes[lex]);
        }
        type = typeFound;
        result = commandCall(routine, lex, 'function', language);
        type = typeFound;
        lex = result.lex;
        pcode = result.pcode;
        if (!command.code) { // custom function
          pcode.push(pcoder.loadFunctionReturnValue(command.resultAddress));
        }
        break;
      }
      throw newError('exp15', 'expNotFound', lexemes[lex]);
    // anything else is an error
    default:
      throw newError('exp16', 'expWeird', lexemes[lex]);
  }
  return { type, lex, pcode };
};

const variableAssignment = (routine, variable, lex, language) => {
  const lexemes = routine.lexemes;
  var pcode;
  var type;
  if (!lexemes[lex]) {
    throw newError('asgn01', 'asgnNothing', lexemes[lex - 1]);
  }
  ({ type, lex, pcode } = expression(routine, lex, 'null', variable.type, language));
  pcode = mergeLines(pcode, [pcoder.storeVariableValue(variable)]);
  return { lex, pcode };
};

const commandCall = (routine, lex, expectedType, language) => {
  const lexemes = routine.lexemes;
  const command = find.anyCommand(routine, lexemes[lex].content, language);
  var argsExpected;
  var argsGiven;
  var currentArg;
  var variable;
  var pcode;
  var result;
  if (!command) {
    throw newError('cmd01', 'cmdNotFound', lexemes[lex]);
  }
  if (command.type !== expectedType) {
    throw newTypeFnError('cmd02', expectedType, command.type, lexemes[lex]);
  }
  argsExpected = command.parameters.length;
  pcode = [[]];
  if (argsExpected === 0) { // no arguments expected
    if (language === 'Python') {
      if (!lexemes[lex + 1] || (lexemes[lex + 1].content !== '(')) {
        throw newError('cmd03', 'cmdLeftBracket', lexemes[lex]);
      }
      lex += 1;
      if (!lexemes[lex + 1] || (lexemes[lex + 1].content !== ')')) {
        throw newError('cmd04', 'cmdNoArgs', lexemes[lex - 1]);
      }
      lex += 1;
    } else {
      if (lexemes[lex + 1] && (lexemes[lex + 1].content === '(')) {
        throw newError('cmd05', 'cmdNoArgs', lexemes[lex]);
      }
    }
  } else { // some arguments expected
    if (lexemes[lex + 1].content !== '(') {
      throw newError('cmd06', 'cmdMissingArgs', lexemes[lex]);
    }
    lex += 2;
    argsGiven = 0;
    while ((argsGiven < argsExpected) && (lexemes[lex].content !== ')')) {
      currentArg = command.parameters[argsGiven];
      if (currentArg.byref) { // reference parameter
        variable = find.variable(routine, lexemes[lex].content, language);
        if (!variable) {
          throw newError('cmd07', 'cmdBadRef', lexemes[lex]);
        }
        lex += 1;
        pcode = mergeLines(pcode, [pcoder.loadVariableAddress(variable)]);
      } else { // value parameter
        result = expression(routine, lex, 'null', currentArg.type, language);
        lex = result.lex;
        pcode = mergeLines(pcode, result.pcode);
      }
      argsGiven += 1;
      if (argsGiven < argsExpected) {
        if (!lexemes[lex] || (lexemes[lex].content !== ',')) {
          throw newError('cmd08', 'cmdComma', lexemes[lex]);
        }
        lex += 1;
      }
    }
    if (argsGiven < argsExpected) {
      throw newError('cmd09', 'cmdTooFew', lexemes[lex]);
    }
    if (lexemes[lex].content === ',') {
      throw newError('cmd10', 'cmdTooMany', lexemes[lex]);
    }
    if (lexemes[lex].content !== ')') {
      throw newError('cmd11', 'cmdRightBracket', lexemes[lex - 1]);
    }
  }
  lex += 1;
  if (command.code) { // native command
    pcode = mergeLines(pcode, [pcoder.callNativeCommand(command, routine, language)]);
  } else { // custom command
    pcode = mergeLines(pcode, [pcoder.callCustomCommand(command.startLine)]);
  }
  return { lex, pcode };
};

module.exports = {
  expression,
  variableAssignment,
  commandCall,
};
