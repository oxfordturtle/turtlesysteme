/* languages/parser/pascal
----------------------------------------------------------------------------------------------------
parser for Turtle Pascal - lexemes go in, array of routines comes out; the first element in the
array is the main PROGRAM object

look at the factory module to see what the PROGRAM object (and its components) look like

this analyses the structure of the program, and builds up lists of all the constants, variables, and
subroutines (with their variables and parameters) - lexemes for the program (and any subroutine)
code themselves are just stored for subsequent handling by the pcoder
----------------------------------------------------------------------------------------------------
*/

// local imports
const factory = require('./factory');

// generate an error message
const message = (messageId, lexeme) => {
  switch (messageId) {
    // program declaration errors
    case 'progBegin':
      return 'Program must start with keyword "PROGRAM".';
    case 'progName':
      return '"PROGRAM" must be followed by a legal program name.';
    case 'progTurtle':
      return 'Program cannot be given the name of a Turtle attribute.';
    case 'progId':
      return `"${lexeme.content}" is not a valid program name.`;
    case 'progSemi':
      return 'Program name must be followed by a semicolon.';
    // errors at the crossroads
    case 'constVar':
      return 'Constants must be defined before any variables.';
    case 'constSub':
      return 'Constants must be defined before any subroutines.';
    case 'varSub':
      return 'Variables must be defined before any subroutines.';
    case 'progWeird':
      return 'Expected "BEGIN", constant/variable definitions, or subroutine definitions.';
    // constant value errors
    case 'constDef':
      return 'Constant must be assigned a value.';
    case 'constNegString':
      return 'Strings cannot be negated.';
    case 'constNegBoolean':
      return 'Boolean values cannot be negated.';
    case 'constSemi':
      return 'Constant declaration must be followed by a semicolon.';
    case 'constValue':
      return `"${lexeme.content}" is not a valid constant value.`;
    // constant declaration errors
    case 'constName':
      return 'No constant name found.';
    case 'constTurtle':
      return `"${lexeme.content}" is the name of a predefined Turtle property, and cannot be used as a constant name.`;
    case 'constId':
      return `"${lexeme.content}" is not a valid constant name.`;
    case 'constProg':
      return `Constant name "${lexeme.content}" is already the name of the program.`;
    case 'constDupl':
      return `"${lexeme.content}" is already the name of a constant in the current scope.`;
    // variable type errors
    case 'varType':
      return 'Variable name must be followed by a colon, then the variable type (array, boolean, char, integer, or string).';
    case 'varBadType':
      return `"${lexeme.content}" is not a valid variable type (expected "array", "boolean", "char", "integer", or "string").`;
    case 'varStringNoSize':
      return 'Opening bracket must be followed by an integer value.';
    case 'varStringBadSize':
      return 'String size must be an integer.'
    case 'varStringRbkt':
      return 'String size must be followed by a closing square bracket "]".'
    case 'varArrayBadSize':
      return 'Array declarations take the form "array[n..m]", where "n" and "m" are integer values specifying the start and end index of the array.';
    case 'varArrayNoConstant':
      return `Constant "${lexeme.content}" has not been declared.`;
    case 'varArrayBadConstant':
      return `"${lexeme.content}" is not an integer constant.`;
    case 'varArrayOf':
      return 'Array declaration must be followed by "of", and then the type of the elements of the array.'
    // variable definition errors
    case 'varName':
      return 'No variable name found.';
    case 'varTurtle':
      return `"${lexeme.content}" is the name of a predefined Turtle property, and cannot be used as a variable name.`;
    case 'varId':
      return `"${lexeme.content}" is not a valid variable name.`;
    case 'varProg':
      return `Variable name "${lexeme.content}" is already the name of the program.`;
    case 'varDupl':
      return `"${lexeme.content}" is already the name of a constant or variable in the current scope.`;
    case 'varComma':
      return 'Comma missing between variable declarations.';
    // routine declaration errors
    case 'subName':
      return 'No subroutine name found.';
    case 'subTurtle':
      return `"${lexeme.content}" is the name of a predefined Turtle property, and cannot be used as a subroutine name.`;
    case 'subId':
      return `"${lexeme.content}" is not a valid subroutine name.`;
    case 'subProg':
      return `Subroutine name "${lexeme.content}" is already the name of the program.`;
    case 'subDupl':
      return `"${lexeme.content}" is already the name of a subroutine in the current scope.`;
    case 'subSemi':
      return 'Subroutine declaration must be followed by a semicolon.';
    case 'fnType':
      return 'Function must be followed by a colon, the the return type (integer, boolean, char, or string).';
    case 'fnBadType':
      return `"${lexeme.content}" is not a valid return type (expected "integer", "boolean", "char", or "string").`;
    case 'subEnd':
      return 'Routine commands must finish with "END".';
    // general parser errors
    case 'constAfter':
      return 'No program text found after constant declarations.';
    case 'varAfter':
      return 'No text found after variable declarations.';
    case 'varSemi':
      return 'Variable declaration(s) must be followed by a semicolon.';
    case 'progDot':
      return 'Program "END" must be followed by a full stop.';
    case 'progOver':
      return 'No text can appear after program "END".';
    default:
      return messageId;
  }
};

// create an error object
const error = (messageId, lexeme) =>
  ({
    type: 'Compiler',
    message: message(messageId, lexeme),
    lexeme,
  });

// check if a string is already the name of a variable or constant in a routine
const isDuplicate = (routine, name) =>
  routine.variables.concat(routine.constants).some((x) => x.name === name);

// index of the next lexeme (after any semicolons)
const next = (lexemes, lex, compulsory = false, messageId = null) => {
  if (compulsory) {
    if (!lexemes[lex]) throw error(messageId, lexemes[lex - 1]);
    if (lexemes[lex].content !== ';') throw error(messageId, lexemes[lex]);
  }
  while (lexemes[lex] && lexemes[lex].content === ';') lex += 1;
  return lex;
};

// look for "PROGRAM identifier;"; return program object and next lexeme index
const programAndNext = (lexemes, lex) => {
  const [keyword, identifier] = lexemes.slice(lex, lex + 2);
  if (!keyword || keyword.content !== 'program') throw error('progBegin', lexemes[lex]);
  if (!identifier) throw error('progName', lexemes[lex]);
  if (identifier.type === 'turtle') throw error('progTurtle', lexemes[lex + 1]);
  if (identifier.type !== 'identifier') throw error('progId', lexemes[lex + 1]);
  return {
    lex: next(lexemes, lex + 2, true, 'progSemi'),
    routine: factory.program(identifier.content, 'Pascal'),
  };
};

// look for "CONST|VAR|PROCEDURE|FUNCTION|BEGIN(;)"; return next state and next lexeme index
const stateAndNext = (lexemes, lex, routine) => {
  const keyword = lexemes[lex];
  if (!keyword) throw error('progWeird', lexemes[lex - 1]);
  switch (keyword.content) {
    case 'const':
      if (routine.variables.length > 0) throw error('constVar', lexemes[lex]);
      if (routine.subroutines.length > 0) throw error('constSub', lexemes[lex]);
      return { lex: lex + 1, state: 'const' };
    case 'var':
      if (routine.subroutines.length > 0) throw error('varSub', lexemes[lex]);
      return { lex: lex + 1, state: 'var' };
      break;
    case 'function': // fallthrough
    case 'procedure':
      return { lex: lex + 1, state: keyword.content };
      break;
    case 'begin':
      return { lex: next(lexemes, lex + 1), state: 'begin' };
    default:
      throw error('progWeird', lexemes[lex]);
  }
};

// look for integer literal followed by semicolon; return constant object and next lexeme index
const negativeAndNext = (lexemes, lex, name) => {
  const value = lexemes[lex];
  if (!value) throw error('constDef', lexemes[lex - 1]);
  switch (value.type) {
    case 'string':
      throw error('constNegString', lexemes[lex]);
    case 'boolean':
      throw error('constNegBoolean', lexemes[lex]);
    case 'integer': // fallthrough
    case 'colour':
      return {
        lex: next(lexemes, lex + 1, true, 'constSemi'),
        constant: factory.constant(name, 'integer', -value.value),
      };
    default:
      throw error('constValue', lexemes[lex]);
  }
};

// look for any literal value followed by semicolon; return constant object and next lexeme index
const nonnegativeAndNext = (lexemes, lex, name) => {
  const value = lexemes[lex];
  if (!value) throw error('constDef', lexemes[lex - 1]);
  switch (value.type) {
    case 'boolean': // fallthrough
    case 'integer': // fallthrough
    case 'string':
      return {
        lex: next(lexemes, lex + 1, true, 'constSemi'),
        constant: factory.constant(name, value.type, value.value),
      };
    case 'colour':
      return {
        lex: next(lexemes, lex + 1, true, 'constSemi'),
        constant: factory.constant(name, 'integer', value.value),
      };
    default:
      throw error('constValue', lexemes[lex]);
  }
};

// look for "identifier = value;"; return constant object and next lexeme index
const constantAndNext = (lexemes, lex, routines, routine) => {
  const [identifier, assignment, next1, next2] = lexemes.slice(lex, lex + 3);
  if (!identifier) throw error('constName', lexemes[lex - 1]);
  if (identifier.type === 'turtle') throw error('constTurtle', identifier);
  if (identifier.type !== 'identifier') throw error('constId', identifier);
  if (identifier.content === routines[0].name) throw error('constProg', identifier);
  if (isDuplicate(routine, identifier.content)) throw error('constDupl', identifier);
  if (!assignment) throw error('constDef', identifier);
  if (assignment.content !== '=') throw error('constDef', assignment);
  return (next && next.content === '-')
    ? negativeAndNext(lexemes, lex + 3, identifier.content)
    : nonnegativeAndNext(lexemes, lex + 2, identifier.content);
};

// look for "<fulltype>: boolean|integer|char|string[size]|array of <fulltype>"; return fulltype
// object (a property of variables/parameters) and next lexeme index
const fulltypeAndNext = (lexemes, lex, routines) => {
  let result;
  if (!lexemes[lex]) throw error('varType', lexemes[lex - 1]);
  if (lexemes[lex].type !== 'type') throw error('varBadType', lexemes[lex]);
  switch (lexemes[lex].content) {
    case 'boolean': // fallthrough
    case 'integer': // fallthrough
    case 'char':
      return { lex: lex + 1, fulltype: factory.fulltype(lexemes[lex].content) };
    case 'string':
      if (lexemes[lex + 1] && lexemes[lex + 1].content === '[') {
        const [size, rbkt] = lexemes.slice(lex + 2, lex + 4);
        if (!size) throw error('varStringNoSize', lexemes[lex + 1]);
        if (size.type !== 'integer') throw error('varStringBadSize', lexemes[lex + 2]);
        if (!rbkt) throw error('varStringRbkt', lexemes[lex + 2]);
        if (rbkt.content !== ']') throw error('varStringRbkt', lexemes[lex + 3]);
        return { lex: lex + 4, fulltype: factory.fulltype('string', size.value) };
      } else {
        return { lex: lex + 1, fulltype: factory.fulltype('string') };
      }
    case 'array':
      const [lbkt, start, dots, end, rbkt, keyof] = lexemes.slice(lex + 1, lex + 7);
      let constant, endValue, startValue;
      if (!lbkt) throw error('varArrayBadSize', lexemes[lex]);
      if (lbkt.content !== '[') throw error('varArrayBadSize', lexemes[lex + 1]);
      if (!start) throw error('varArrayBadSize', lexemes[lex + 1]);
      switch (start.type) {
        case 'identifier':
          constant = routines[0].constants.find(x => x.name === start.content);
          if (!constant) throw error('varArrayNoConstant', lexemes[lex + 2]);
          if (constant.type !== 'integer') throw error('varArrayBadConstant', lexemes[lex + 2]);
          startValue = constant.value;
          break;
        case 'integer':
          startValue = start.value;
          break;
        default:
          throw error('varArrayBadSize', lexemes[lex + 2]);
      }
      if (!dots) throw error('varArrayBadSize', lexemes[lex + 2]);
      if (dots.content !== '..') throw error('varArrayBadSize', lexemes[lex + 3]);
      if (!end) throw error('varArrayBadSize', lexemes[lex + 3]);
      switch (end.type) {
        case 'identifier':
          constant = routines[0].constants.find(x => x.name === end.content);
          if (!constant) throw error('varArrayNoConstant', lexemes[lex + 4]);
          if (constant.type !== 'integer') throw error('varArrayBadConstant', lexemes[lex + 4]);
          endValue = constant.value;
          break;
        case 'integer':
          endValue = end.value;
          break;
        default:
          throw error('varArrayBadSize', lexemes[lex + 4]);
      }
      if (!rbkt) throw error('varArrayBadSize', lexemes[lex + 4]);
      if (rbkt.content !== ']') throw error('varArrayBadSize', lexemes[lex + 5]);
      if (!keyof) throw error('varArrayOf', lexemes[lex + 5]);
      if (keyof.content !== 'of') throw error('varArrayOf', lexemes[lex + 6]);
      result = fulltypeAndNext(lexemes, lex + 7);
      return {
        lex: result.lex,
        fulltype: factory.fulltype('array', endValue - startValue + 1, startValue, result.fulltype),
      };
  }
};

// array of typed variables (with index of the next lexeme)
const variablesAndNext = (lexemes, lex, routines, routine, byref) => {
  const variables = [];
  let more = true;
  // gather the variable names
  while (more) {
    if (!lexemes[lex]) throw error('varName', lexemes[lex - 1]);
    if (lexemes[lex].type === 'turtle') throw error('varTurtle', lexemes[lex]);
    if (lexemes[lex].type !== 'identifier') throw error('varId', lexemes[lex]);
    if (lexemes[lex].content === routines[0].name) throw error('varProg', lexemes[lex]);
    if (isDuplicate(routine, lexemes[lex].content)) throw error('varDupl', lexemes[lex]);
    variables.push(factory.variable(lexemes[lex].content, routine, byref));
    if (!lexemes[lex + 1]) throw error('varType', lexmes[lex]);
    if (lexemes[lex + 1].type === 'identifier') throw error('varComma', lexemes[lex + 1]);
    if (lexemes[lex + 1].type === 'type') throw error('varType', lexemes[lex + 1]);
    switch (lexemes[lex + 1].content) {
      case ',':
        lex += 2;
        break;
      case ':':
        lex += 2;
        more = false;
        break;
      default:
        throw error('varType', lexemes[lex + 1]);
    }
  }
  // expecing type definition for the variables just gathered
  ({ lex, fulltype } = fulltypeAndNext(lexemes, lex, routines));
  variables.forEach((x) => x.fulltype = fulltype);
  return { lex, variables };
};

// look for "[var] identifier1[, identifier2, ...]: <fulltype>"; return array of parameters and
// index of the next lexeme
const parametersAndNext = (lexemes, lex, routines, routine) => {
  let parameters = [];
  let variables = [];
  let more = true;
  while (more) {
    ({ lex, variables } = (lexemes[lex] && lexemes[lex].content === 'var')
      ? variablesAndNext(lexemes, lex + 1, routines, routine, true)
      : variablesAndNext(lexemes, lex, routines, routine, false));
    parameters = parameters.concat(variables);
    if (!lexemes[lex]) throw error();
    switch (lexemes[lex].content) {
      case ';':
        lex += 1;
        break;
      case ')':
        lex += 1;
        more = false;
        break;
      default:
        throw error();
    }
  }
  return { lex, parameters };
};

// look for "identifier[(parameters)];"; return subroutine object and index of the next lexeme
const subroutineAndNext = (lexemes, lex, type, routines, parent) => {
  const [identifier, after] = lexemes.slice(lex, lex + 2);
  let routine, parameters, returnType;
  if (!identifier) throw error('subName', lexemes[lex - 1]);
  if (identifier.type === 'turtle') throw error('subTurtle', lexemes[lex]);
  if (identifier.type !== 'identifier') throw error('subId', lexemes[lex]);
  if (identifier.content === routines[0].name) throw error('subProg', lexemes[lex]);
  if (routines.some((x) => x.name === identifier.content)) throw error('subDupl', lexemes[lex]);
  routine = factory.subroutine(identifier.content, type, parent);
  if (type === 'function') routine.variables.push(factory.variable('result', routine, false));
  if (!after) throw error('subSemi', identifier);
  switch (after.content) {
    case ';':
      return { lex: next(lexemes, lex + 2, false), routine };
    case '(':
      ({ parameters, lex } = parametersAndNext(lexemes, lex + 2, routines, routine));
      routine.parameters = parameters;
      routine.variables = routine.variables.concat(parameters);
      if (type === 'function') {
        if (!lexemes[lex]) throw error('fnType', lexemes[lex - 1]);
        if (lexemes[lex].content !== ':') throw error('fnType', lexemes[lex]);
        ({ returnType, lex } = fulltypeAndNext(lexemes, lex + 1));
        routine.variables[0].type = returnType;
      } else {
        lex = next(lexemes, lex, true, 'subSemi');
      }
      return { lex, routine };
    default:
      throw error('subSemi', after);
  }
};

// grab everything up to "END"
const contentAndNext = (lexemes, lex) => {
  let content = [];
  let begins = 1;
  while (begins > 0 && lexemes[lex]) {
    if (lexemes[lex].content === 'begin') begins += 1;
    if (lexemes[lex].content === 'end') begins -= 1;
    content.push(lexemes[lex]);
    lex += 1;
  }
  if (begins > 0) throw error('subEnd', lexemes[lex]);
  return { lex, content: content.slice(0, -1) };
};

// the parser function
const parser = (lexemes) => {
  const routines = []; // array of routines (0 being the main program)
  const routineStack = []; // stack of routines
  let routineCount = 0; // index of the current routine
  let lex = 0; // index of current lexeme
  let routine, parent, constant, variables, content; // object references
  let state = 'program';
  while (lex < lexemes.length) {
    // the big switch
    switch (state) {
      case 'program':
        // expecting "PROGRAM <identifier>;"
        ({ lex, routine } = programAndNext(lexemes, lex));
        routines.push(routine);
        routineStack.push(routine);
        state = 'crossroads';
        break;
      case 'crossroads':
        // expecting "CONST", "VAR", "PROCEDURE|FUNCTION", or "BEGIN[;]"
        ({ lex, state } = stateAndNext(lexemes, lex, routine));
        break;
      case 'const':
        // expecting "<identifier> = <value>;"
        ({ lex, constant } = constantAndNext(lexemes, lex, routines, routine));
        routine.constants.push(constant);
        if (!lexemes[lex]) throw error('constAfter', lexemes[lex - 1]);
        if (lexemes[lex].type !== 'turtle' && lexemes[lex].type !== 'identifier') state = 'crossroads';
        break;
      case 'var':
        // expecting "<identifier>[, <identifier2>, ...]: <type>;"
        ({ lex, variables } = variablesAndNext(lexemes, lex, routines, routine));
        routine.variables = routine.variables.concat(variables);
        lex = next(lexemes, lex, true, 'varSemi');
        if (!lexemes[lex]) throw error('varAfter', lexemes[lex - 1]);
        if (lexemes[lex].type !== 'turtle' && lexemes[lex].type !== 'identifier') state = 'crossroads';
        break;
      case 'procedure': // fallthrough
      case 'function':
        // expecting "<identifier>[(<parameters>)];"
        parent = routineStack[routineStack.length - 1];
        ({ lex, routine } = subroutineAndNext(lexemes, lex, state, routines, parent));
        parent.subroutines.push(routine);
        routineStack.push(routine);
        state = 'crossroads';
        break;
      case 'begin':
        // expecting routine commands
        ({ lex, content } = contentAndNext(lexemes, lex));
        routine.lexemes = content;
        state = 'end';
        break;
      case 'end':
        // expecting "." at the end of the main program, or ";" at the end of a subroutine
        if (routine.index === 0) {
          if (!lexemes[lex]) throw error('progDot', lexemes[lex - 1]);
          if (lexemes[lex].content !== '.') throw error('progDot', lexemes[lex]);
          if (lexemes[lex + 1]) throw error('progOver', lexemes[lex + 1]);
          lex += 1; // so we exit the loop
        } else {
          lex = next(lexemes, lex, true, 'subSemi');
          routineCount += 1;
          routine.index = routineCount;
          routines.push(routineStack.pop());
          routine = routineStack[routineStack.length - 1];
          state = 'crossroads';
        }
        break;
      default:
        break;
    }
  }
  return routines;
};

module.exports = parser;
