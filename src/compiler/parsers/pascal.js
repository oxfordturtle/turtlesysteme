/*
parser for Turtle Pascal - lexemes go in, array of routines comes out; the first element in the
array is the main PROGRAM object

look at the factory module to see what the PROGRAM object (and its components) look like

this analyses the structure of the program, and builds up lists of all the constants, variables,
and subroutines (with their variables and parameters) - lexemes for the program (and any
subroutine) code themselves are just stored for subsequent handling by the pcoder
*/
// import error from '../tools/error.js'
// import * as factory from '../tools/factory.js'
// import * as find from '../tools/find.js'

export default (lexemes) => {
  const routines = []
  return routines
}

/*
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
    // variable declaration errors
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
    // paramater declaration errors
    case 'parNoRbkt':
      return 'Parameter declarations must be followed by a closing bracket ")".';
    case 'parArrayNoRef':
      return 'Array parameters can only be passed by reference, not by value.';
    case 'parArraySize':
      return 'Array references parameters cannot be given a size specification.';
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
  ({ type: 'Compiler', message: message(messageId, lexeme), lexeme });

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
  if (!keyword || keyword.content !== 'program') throw error('progBegin', keyword);
  if (!identifier) throw error('progName', keyword);
  if (identifier.type === 'turtle') throw error('progTurtle', identifier);
  if (identifier.type !== 'identifier') throw error('progId', identifier);
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
      if (routine.variables.length > 0) throw error('constVar', keyword);
      if (routine.subroutines.length > 0) throw error('constSub', keyword);
      return { lex: lex + 1, state: 'const' };
    case 'var':
      if (routine.subroutines.length > 0) throw error('varSub', keyword);
      return { lex: lex + 1, state: 'var' };
      break;
    case 'function': // fallthrough
    case 'procedure':
      return { lex: lex + 1, state: keyword.content };
      break;
    case 'begin':
      return { lex: next(lexemes, lex + 1), state: 'begin' };
    default:
      throw error('progWeird', keyword);
  }
};

// look for integer literal followed by semicolon; return constant object and next lexeme index
const negativeAndNext = (lexemes, lex, name, routine) => {
  const value = lexemes[lex];
  let constant;
  if (!value) throw error('constDef', lexemes[lex - 1]);
  switch (value.type) {
    case 'string':
      throw error('constNegString', value);
    case 'boolean':
      throw error('constNegBoolean', value);
    case 'integer':
      return {
        lex: next(lexemes, lex + 1, true, 'constSemi'),
        constant: factory.constant(name, value.type, -value.value),
      };
    case 'identifier':
      constant = find.constant(routine, value.content, 'Pascal')
        || find.colour(value.content, 'Pascal');
      if (!constant) throw error('constValue', value);
      return {
        lex: next(lexemes, lex + 1, true, 'constSemi'),
        constant: factory.constant(name, constant.type, -constant.value),
      };
    default:
      throw error('constValue', value);
  }
};

// look for any literal value followed by semicolon; return constant object and next lexeme index
const nonnegativeAndNext = (lexemes, lex, name, routine) => {
  const value = lexemes[lex];
  let constant;
  if (!value) throw error('constDef', lexemes[lex - 1]);
  switch (value.type) {
    case 'boolean': // fallthrough
    case 'integer': // fallthrough
    case 'string':
      return {
        lex: next(lexemes, lex + 1, true, 'constSemi'),
        constant: factory.constant(name, value.type, value.value),
      };
    case 'identifier':
      constant = find.constant(routine, value.content, 'Pascal')
        || find.colour(value.content, 'Pascal');
      if (!constant) throw error('constValue', value);
      return {
        lex: next(lexemes, lex + 1, true, 'constSemi'),
        constant: factory.constant(name, constant.type, constant.value),
      };
    default:
      throw error('constValue', value);
  }
};

// look for "identifier = value;"; return constant object and next lexeme index
const constantAndNext = (lexemes, lex, routine) => {
  const [ identifier, assignment, next ] = lexemes.slice(lex, lex + 3);
  if (!identifier) throw error('constName', lexemes[lex - 1]);
  if (identifier.type === 'turtle') throw error('constTurtle', identifier);
  if (identifier.type !== 'identifier') throw error('constId', identifier);
  if (identifier.content === find.mainProgram(routine).name) throw error('constProg', identifier);
  if (isDuplicate(routine, identifier.content)) throw error('constDupl', identifier);
  if (!assignment) throw error('constDef', identifier);
  if (assignment.content !== '=') throw error('constDef', assignment);
  if (!next) throw error('constDef', assignment);
  return (next.content === '-')
    ? negativeAndNext(lexemes, lex + 3, identifier.content, routine)
    : nonnegativeAndNext(lexemes, lex + 2, identifier.content, routine);
};

// look for "[n..m] of <fulltype>" (following "array" in variable declaration)
const arrayVarTypeAndNext = (lexemes, lex, routine) => {
  const [ lbkt, start, dots, end, rbkt, keyof ] = lexemes.slice(lex, lex + 6);
  let constant, endValue, startValue;
  if (!lbkt) throw error('varArrayBadSize', type);
  if (lbkt.content !== '[') throw error('varArrayBadSize', lbkt);
  if (!start) throw error('varArrayBadSize', lbkt);
  switch (start.type) {
    case 'identifier':
      constant = find.constant(routine, start.content, 'Pascal');
      if (!constant) throw error('varArrayNoConstant', start);
      if (constant.type !== 'integer') throw error('varArrayBadConstant', start);
      startValue = constant.value;
      break;
    case 'integer':
      startValue = start.value;
      break;
    default:
      throw error('varArrayBadSize', start);
  }
  if (!dots) throw error('varArrayBadSize', start);
  if (dots.content !== '..') throw error('varArrayBadSize', dots);
  if (!end) throw error('varArrayBadSize', dots);
  switch (end.type) {
    case 'identifier':
      constant = find.constant(routine, end.content, 'Pascal');
      if (!constant) throw error('varArrayNoConstant', end);
      if (constant.type !== 'integer') throw error('varArrayBadConstant', end);
      endValue = constant.value;
      break;
    case 'integer':
      endValue = end.value;
      break;
    default:
      throw error('varArrayBadSize', end);
  }
  if (!rbkt) throw error('varArrayBadSize', end);
  if (rbkt.content !== ']') throw error('varArrayBadSize', rbkt);
  if (!keyof) throw error('varArrayOf', rbkt);
  if (keyof.content !== 'of') throw error('varArrayOf', keyof);
  result = fulltypeAndNext(lexemes, lex + 6, routine);
  return {
    lex: result.lex,
    fulltype: factory.fulltype('array', endValue - startValue + 1, startValue, result.fulltype),
  };
};

// look for "of <fulltype>" (following "array" in parameter declaration)
const arrayParTypeAndNext = (lexemes, lex, routine, byref) => {
  if (!byref) throw error('parArrayNoRef', type);
  if (!lexemes[lex]) throw error('varArrayOf', lexemes[lex - 1]);
  if (lexemes[lex].content === '[') throw error('parArraySize', lexemes[lex]);
  if (lexemes[lex].content !== 'of') throw error('varArrayOf', lexemes[lex]);
  return fulltypeAndNext(lexemes, lex + 1, routine, true, byref);
};

// look for "<fulltype>: boolean|integer|char|string[size]|array of <fulltype>"; return fulltype
// object (a property of variables/parameters) and next lexeme index
const fulltypeAndNext = (lexemes, lex, routine, parameter, byref) => {
  const type = lexemes[lex];
  let result;
  if (!lexemes[lex]) throw error('varType', lexemes[lex - 1]);
  switch (type.content) {
    case 'boolean': // fallthrough
    case 'integer': // fallthrough
    case 'char':
      return { lex: lex + 1, fulltype: factory.fulltype(type.content) };
    case 'string':
      if (lexemes[lex + 1] && lexemes[lex + 1].content === '[') {
        // string of custom size
        const [ size, rbkt ] = lexemes.slice(lex + 2, lex + 4);
        if (!size) throw error('varStringNoSize', lexemes[lex + 1]);
        if (size.type !== 'integer') throw error('varStringBadSize', size);
        if (!rbkt) throw error('varStringRbkt', size);
        if (rbkt.content !== ']') throw error('varStringRbkt', rbkt);
        return { lex: lex + 4, fulltype: factory.fulltype('string', size.value) };
      } else {
        // string of default size
        return { lex: lex + 1, fulltype: factory.fulltype('string') };
      }
    case 'array':
      return parameter ? arrayParTypeAndNext(lexemes, lex + 1, routine, byref)
        : arrayVarTypeAndNext(lexemes, lex + 1, routine);
    default:
      throw error('varBadType', type);
  }
};

// array of typed variables (with index of the next lexeme)
const variablesAndNext = (lexemes, lex, routine, parameter = false, byref = false) => {
  const variables = [];
  let more = true;
  // gather the variable names
  while (more) {
    if (!lexemes[lex]) throw error('varName', lexemes[lex - 1]);
    if (lexemes[lex].type === 'turtle') throw error('varTurtle', lexemes[lex]);
    if (lexemes[lex].type !== 'identifier') throw error('varId', lexemes[lex]);
    if (lexemes[lex].content === find.mainProgram(routine).name) throw error('varProg', lexemes[lex]);
    if (isDuplicate(routine, lexemes[lex].content)) throw error('varDupl', lexemes[lex]);
    variables.push(factory.variable(lexemes[lex].content, routine, byref));
    if (!lexemes[lex + 1]) throw error('varType', lexmes[lex]);
    if (lexemes[lex + 1].content === ',') {
      lex += 2;
    } else if (lexemes[lex + 1].content === ':') {
      lex += 2;
      more = false;
    } else {
      switch (lexemes[lex + 1].type) {
        case 'identifier':
          throw error('varComma', lexemes[lex + 1]);
        case 'type':
          throw error('varType', lexemes[lex + 1]);
        default:
          throw error('varType', lexemes[lex + 1]);
      }
    }
  }
  // expecing type definition for the variables just gathered
  ({ lex, fulltype } = fulltypeAndNext(lexemes, lex, routine, parameter, byref));
  variables.forEach((x) => x.fulltype = fulltype);
  return { lex, variables };
};

// look for "[var] identifier1[, identifier2, ...]: <fulltype>"; return array of parameters and
// index of the next lexeme
const parametersAndNext = (lexemes, lex, routine) => {
  let parameters = [];
  let variables = [];
  let more = true;
  while (more) {
    ({ lex, variables } = (lexemes[lex] && lexemes[lex].content === 'var')
      ? variablesAndNext(lexemes, lex + 1, routine, true, true)
      : variablesAndNext(lexemes, lex, routine, true, false));
    parameters = parameters.concat(variables);
    if (!lexemes[lex]) throw error('parNoRbkt', lexemes[lex - 1]);
    switch (lexemes[lex].content) {
      case ';':
        lex += 1;
        break;
      case ')':
        lex += 1;
        more = false;
        break;
      default:
        throw error('parNoRbkt', lexemes[lex]);
    }
  }
  return { lex, parameters };
};

// look for "identifier[(parameters)];"; return subroutine object and index of the next lexeme
const subroutineAndNext = (lexemes, lex, type, parent) => {
  const identifier = lexemes[lex];
  let routine, parameters, fulltype;
  if (!identifier) throw error('subName', lexemes[lex - 1]);
  if (identifier.type === 'turtle') throw error('subTurtle', identifier);
  if (identifier.type !== 'identifier') throw error('subId', identifier);
  if (identifier.content === find.mainProgram(parent).name) throw error('subProg', identifier);
  if (find.customCommand(parent, identifier.content, 'Pascal')) throw error('subDupl', identifier);
  routine = factory.subroutine(identifier.content, type, parent);
  if (type === 'function') routine.variables.push(factory.variable('result', routine, false));
  lex += 1;
  if (!lexemes[lex]) throw error('subSemi', identifier);
  if (lexemes[lex].content === '(') {
    ({ parameters, lex } = parametersAndNext(lexemes, lex + 1, routine));
    routine.parameters = parameters;
    routine.variables = routine.variables.concat(parameters);
  }
  if (type === 'function') {
    if (!lexemes[lex]) throw error('fnType', lexemes[lex - 1]);
    if (lexemes[lex].content !== ':') throw error('fnType', lexemes[lex]);
    ({ lex, fulltype } = fulltypeAndNext(lexemes, lex + 1, routine));
    // throw an error if return type is array ??
    routine.variables[0].fulltype = fulltype;
  }
  lex = next(lexemes, lex, true, 'subSemi');
  return { lex, routine };
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

// the main parser function
const parser1 = (lexemes) => {
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
        ({ lex, constant } = constantAndNext(lexemes, lex, routine));
        routine.constants.push(constant);
        if (!lexemes[lex]) throw error('constAfter', lexemes[lex - 1]);
        if (lexemes[lex].type !== 'identifier') state = 'crossroads';
        break;
      case 'var':
        // expecting "<identifier>[, <identifier2>, ...]: <type>;"
        ({ lex, variables } = variablesAndNext(lexemes, lex, routine));
        routine.variables = routine.variables.concat(variables);
        lex = next(lexemes, lex, true, 'varSemi');
        if (!lexemes[lex]) throw error('varAfter', lexemes[lex - 1]);
        if (lexemes[lex].type !== 'identifier') state = 'crossroads';
        break;
      case 'procedure': // fallthrough
      case 'function':
        // expecting "<identifier>[(<parameters>)];"
        parent = routineStack[routineStack.length - 1];
        ({ lex, routine } = subroutineAndNext(lexemes, lex, state, parent));
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

// exports
module.exports = parser1;
*/
