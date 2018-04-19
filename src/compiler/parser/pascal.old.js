/** parser for Turtle Pascal - lexemes go in, array of routines comes out; the first element in the
 *  array is the main PROGRAM object
 *
 *  look at the factory module to see what the PROGRAM object (and its components) look like
 *
 *  this analyses the structure of the program, and builds up lists of all the constants, variables,
 *  and subroutines (with their variables and parameters) - lexemes for the program (and any
 *  subroutine) code themselves are just stored for subsequent handling by the pcoder
 */

// global imports
const { colours, inputs } = require('data');

// local imports
const factory = require('./factory');

// generate an error message
const message = (messageId, lexeme) => {
  switch (messageId) {
    // program errors
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
    case 'progAfter':
      return 'No text found after program declaration.';
    case 'progEnd':
      return 'Program must finish with "END".';
    case 'progWeird':
      return 'Expected "BEGIN", constant/variable definitions, or subroutine definitions.';
    case 'progDot':
      return 'Program "END" must be followed by a full stop.';
    case 'progOver':
      return 'No text can appear after program "END".';
    // constant errors
    case 'constVar':
      return 'Constants must be defined before any variables.';
    case 'constSub':
      return 'Constants must be defined before any subroutines.';
    case 'constName':
      return 'No constant name found.';
    case 'constTurtle':
      return `"${lexeme.content}" is the name of a predefined Turtle property, and cannot be used as a constant name.`;
    case 'constId':
      return `"${lexeme.content}" is not a valid constant name.`;
    case 'constProg':
      return `Constant name "${lexeme.content}" is already the name of the program.`;
    case 'constDupl':
      retun `"${lexeme.content}" is already the name of a constant in the current scope.`;
    case 'constDef':
      return 'Constant must be assigned a value.';
    case 'constNeg':
      return '"-" must be followed by a value.';
    case 'constNegString':
      return 'Strings cannot be negated.';
    case 'constNegBoolean':
      return 'Boolean values cannot be negated.';
   case 'constValue':
      return `"${lexeme.content}" is not a valid constant value.`;
    case 'constSemi':
      return 'Constant declaration must be followed by a semicolon.';
    case 'constAfter':
     return 'No program text found after constant declarations.';
    // variable errors
    case 'varSub':
      return 'Variables must be defined before any subroutines.';
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
    case 'varType':
      return 'Variable name must be followed by a colon, then the variable type (integer, boolean, char, or string).';
    case 'varBadType':
      return `"${lexeme.content}" is not a valid variable type (expected "integer", "boolean", "char", or "string").`;
    case 'varArray':
      return 'The online compiler does not support array variables. Please compile your program in the downloadable system.';
    case 'varComma':
      return 'Comma missing between variable declarations.';
    case 'varSemi':
      return 'Variable declaration(s) must be followed by a semicolon.';
    case 'varAfter':
      return 'No text found after variable declarations.';
    // parameter errors
    case 'parName':
      return 'No parameter name found.';
    case 'parTurtle':
      return `"${lexeme.content}" is the name of a predefined Turtle property, and cannot be used as a parameter name.`;
    case 'parId':
      return `"${lexeme.content}" is not a valid parameter name.`;
    case 'parProg':
      return `Parameter name "${lexeme.content}" is already the name of the program.`;
    case 'parDupl':
      return `"${lexeme.content}" is already the name of a parameter for this subroutine.`;
    case 'parType':
      return 'Parameter name must be followed by a colon, then the parameter type (integer, boolean, char, or string).';
    case 'parBadType':
      return `"${lexeme.content}" is not a valid parameter type (expected "integer", "boolean", "char", or "string").`;
    case 'parArray':
      return 'The online compiler does not support array parameters. Please compile your program in the downloadable system.';
    case 'parComma':
      return 'Comma missing between parameters.';
    case 'parAfter':
      return 'No text found after parameter declarations.';
    // subroutine errors
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
    case 'subAfter':
      return 'No text found after subroutine declaration.';
    case 'subBracket':
      return 'Subroutine parameters must be followed by a closing bracket.';
    case 'subEnd':
      return 'Missing subroutine "END".';
    case 'subEndSemi':
      return 'Semicolon needed after subroutine "END".';
    case 'fnType':
      return 'Function must be followed by a colon, the the return type (integer, boolean, char, or string).';
    case 'fnBadType':
      return `"${lexeme.content}" is not a valid return type (expected "integer", "boolean", "char", or "string").`;
    case 'fnArray':
      return 'Functions cannot return arrays.';
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
const exists = (routine, string) =>
  routine.variables.concat(routine.constants).some((x) => x.name === string);

// set the type, length, and start index of all untyped variables
const fixVariableTypes = (routine, type, length = null, start = null) => {
  routine.variables.filter((x) => x.type === null).forEach((x) => {
    variable.type = type;
    variable.length = length;
    variable.start = start;
  });
};

// return the index of the next lexeme, or throw an error if it doesn't exist
const next = (lexemes, lex, messageId) => {
  if (!lexemes[lex + 1]) throw error(messageId, lexemes[lex]);
  return lex + 1;
};

// return the index of the next lexeme that isn't a semicolon, optionally throwing an error if
// there isn't at least one
const semicolons = (lexemes, lex, compulsory, messageId) => {
  if (compulsory) {
    if (!lexemes[lex]) throw error(messageId, lexemes[lex - 1]);
    if (lexemes[lex].content !== ';') throw error(messageId, lexemes[lex]);
  }
  while (lexemes[lex] && lexemes[lex].content === ';') {
    lex += 1;
  }
  return lex;
};

// check for a valid identifier
const identifierCheck = (lexemes, lex, messageId) => {

};

// parse the lexemes into an array of routines
const parser = (lexemes) => {
  const routines = []; // array of routines (0 being the main program)
  const routineStack = []; // stack of routine indexes
  let routine, parent, variable, constant; // object references
  let routineCount = 0; // index of the current routine
  let lex = 0; // index of current lexeme
  let begins = 0;
  let state = 'start';
  let byref = false;
  while (lex < lexemes.length) {
    switch (state) {
      case 'start':
        // expecting "PROGRAM identifier"
        if (lexemes[lex].content !== 'program') throw error('progBegin', lexemes[lex]);
        lex = next(lexemes, lex, 'progName');
        if (lexemes[lex].type === 'turtle') throw error('progTurtle', lexemes[lex]);
        if (lexemes[lex].type !== 'identifier') throw error('progId', lexemes[lex]);
        routine = factory.program(lexemes[lex + 1].content, 'Pascal');
        routines.push(routine);
        routineStack.push(routine);
        // expecting at least one semicolon next
        lex = next(lexemes, lex, 'progSemi');
        lex = semicolons(lexemes, lex, true, 'progSemi');
        // check we have something before moving on to the crossroads
        lex = next(lexemes, lex - 1, 'progAfter');
        state = 'crossroads';
        break;
      case 'crossroads':
        // expecting constant or variable declarations, subroutine definitions, or "BEGIN"
        switch (lexemes[lex].content) {
          case 'const':
            // no constant declarations after variable declarations
            if (routine.variables.length > 0) throw error('constVar', lexemes[lex]);
            // no constant declarations after subroutine definitions
            if (routine.subroutines.length > 0) throw error('constSub', lexemes[lex]);
            // check we have something before moving on to handle constants...
            lex = next(lexemes, lex, 'constName');
            state = 'constant';
            break;
          case 'var':
            // no variable declarations after subroutine definitions
            if (routine.subroutines.length > 0) throw error('varSub', lexemes[lex]);
            // check we have something before moving on to handle variables...
            lex = next(lexemes, lex, 'varName');
            state = 'variable';
            break;
          case 'function': // fallthrough
          case 'procedure':
            // nothing to check here, just go straight on to handle subroutines
            state = 'subroutine';
            break;
          case 'begin':
            // check we have something next
            lex = next(lexemes, lex, 'progEnd');
            // move past any (optional) semicolons
            lex = semicolons(lexemes, lex, false);
            // check we still have something before reading in the routine's lexemes
            lex = next(lexemes, lex - 1, 'progEnd');
            state = 'begin';
            break;
          default:
            // anything else is illegal here
            throw error('progWeird', lexemes[lex]);
        }
        break;
      case 'constant':
        // turtle property names are not allowed
        if (lexemes[lex].type === 'turtle') throw error('constTurtle', lexemes[lex]);
        // must be an identifier
        if (lexemes[lex].type !== 'identifier') throw error('constId', lexemes[lex]);
        // mustn't be the name of the program
        if (lexemes[lex].content === routines[0].name) throw error('constProg', lexemes[lex]);
        // mustn't clash with an existing constant
        if (exists(routine, lexemes[lex].content)) throw error('constDupl', lexemes[lex]);
        // otherwise okay
        constant = factory.constant(lexemes[lex].content);
        // expecting "="
        lex += 1;
        if (!lexemes[lex]) throw error('constDef', lexemes[lex - 1]);
        if (lexemes[lex].content !== '=') throw error('constDef', lexemes[lex]);
        // some value is now required
        lex += 1;
        if (!lexemes[lex]) throw error('constDef', lexemes[lex - 1]);
        // expecting literal value, "-" (for negative integers), or predefined colour constant
        if (lexemes[lex].type.matches(/^(boolean|integer|string)$/)) {
          constant.type = lexemes[lex].type;
          constant.value = lexemes[lex].value;
        } else if (lexemes[lex].type === 'colour') {
          constant.type = 'integer';
          constant.value = lexemes[lex].value;
        } else if (lexemes[lex].content === '-') {
          lex += 1;
          if (!lexemes[lex]) throw error('constNeg', lexemes[lex - 1]);
          // expecting integer literal or colour constant
          if (lexemes[lex].type === 'string') throw error('constNegString', lexemes[lex]);
          if (lexemes[lex].type === 'boolean') throw error('constNegBoolean', lexemes[lex]);
          if (lexemes[lex].type.matches(/^(integer|colour)$/)) {
            constant.type = 'integer';
            constant.value = -lexemes[lex].value;
          } else {
            throw error('constValue', lexemes[lex]);
          }
        } else {
          throw error('constValue', lexemes[lex]);
        }
        routine.constants.push(constant);
        // expecting a semicolon
        lex += 1;
        lex = semicolon(lexemes, lex, true, 'constSemi');
        // check we have something next
        if (!lexemes[lex]) throw error('constAfter');
        // stay here for more constants if the next lexeme is an identifier; otherwise back to
        // the crossroads
        if (lexemes[lex].type !== 'identifier') {
          state = 'crossroads';
        }
        break;
      case 'variable':
        // turtle property names not allowed
        if (lexemes[lex].type === 'turtle') throw error('varTurtle', lexemes[lex]);
        // must be a valid identifier
        if (lexemes[lex].type !== 'identifier') throw error('varId', lexemes[lex]);
        // program name is not allowed
        if (lexemes[lex].content === routines[0].name) throw error('varProg', lexemes[lex]);
        // cannot be the name of an existing constant or variable in this routine
        if (exists(routine, lexemes[lex].content)) throw error('varDupl', lexemes[lex]);
        // otherwise okay
        variable = factory.variable(lexemes[lex].content, routine, false);
        routine.variables.push(variable);
        // expecting more variable names or a type definition
        lex += 1;
        if (!lexemes[lex]) throw error('varType', lexemes[lex - 1]);
        if (lexemes[lex].type === 'identifier') throw error('varComma', lexemes[lex]);
        switch (lexemes[lex].content) {
          case ',':
            // expecting another variable name, so stay here for the next loop
            lex += 1;
            if (!lexemes[lex]) throw error('varName', lexemes[lex - 1]);
            break;
          case ':':
            // expecting a type definition
            lex += 1;
            if (!lexemes[lex]) throw error('varType', lexemes[lex - 1]);
            state = 'variableType';
            break;
          default:
            // everything else is an error
            throw error('varType', lexemes[lex]);
        }
        break;
      case 'variableType':
        // expecting a type definition
        if (lexemes[lex].type !== 'type') {
          throw error('parser35', 'varBadType', lexemes[lex]);
        }
        switch (lexemes[lex].content) {
          case 'array':
            // array size definition optional
            if (lexemes[lex + 1] && lexemes[lex + 1].content === '[') {
              lex += 1;

            }
            break;
          case 'string':
            if (lexemes[lex + 1] && lexemes[lex + 1].content === '[') {
              // expecting string size specification
              lex += 2;
              if (!lexemes[lex]) throw error('varNoStringSize', lexemes[lex - 1]);
              if (!lexemes[lex].type === 'integer') throw error('varBadStringSize', lexemes[lex]);
              fixVariableTypes(routine, 'string', lexemes[lex].value);
              // expecting right bracket
              lex += 1;
              if (!lexemes[lex]) throw error('varStringRbkt', lexemes[lex - 1]);
              if (!lexemes[lex].content === ']') throw error('varStringRbkt', lexemes[lex]);
            } else {
              // otherwise it's a string without a length specification
              fixVariableTypes(routine, lexemes[lex].content);
            }
            break;
          default:
            // char, boolean, and integer types are straightforward
            fixVariableTypes(routine, lexemes[lex].content);
            break;
        }
        // expecting one or more semicolons
        lex += 1;
        lex = semicolons(lexemes, lex, true, 'varSemi');
        // check there's something
        if (!lexemes[lex]) throw error('parser39', 'varAfter', lexemes[lex - 1]);
        // an identifier is another variable declaration, otherwise go back to the crossroads
        if (lexemes[lex].type === 'identifier') {
          state = 'variable';
        } else {
          state = 'crossroads';
        }
        break;
      case 'subroutine':
        // expecting "procedure|function identifier"; if we're here, we already now the current
        // lexeme is "procedure" or "function"
        lex += 1;
        if (!lexemes[lex]) throw error('subName', lexemes[lex]);
        if (lexemes[lex].type === 'turtle') throw error('subTurtle', lexemes[lex]);
        if (lexemes[lex].type !== 'identifier') throw error('subId', lexemes[lex]);
        if (lexemes[lex].content === routines[0].name) throw error('subProg', lexemes[lex]);
        if (routines.some(matches.bind(null, lexemes[lex].content))) {
          throw error('parser44', 'subDupl', lexemes[lex]);
        }
        // otherwise okay; create the subroutine and add it to the stack
        parent = routineStack[routineStack.length - 1];
        routine = factory.subroutine(lexemes[lex].content, lexemes[lex - 1].content, parent);
        parent.subroutines.push(routine);
        routineStack.push(routine);
        // set initial result variable for functions
        if (routine.type === 'function') {
          routine.variables.push(factory.variable('result', routine, false));
        }
        // check
        if (!lexemes[lex + 1]) {
          throw error('parser45', 'subSemi', lexemes[lex]);
        }
        lex += 1;
        switch (lexemes[lex].content) {
          case ';':
            while (lexemes[lex].content === ';') {
              lex += 1;
            }
            if (!lexemes[lex]) {
              throw error('parser46', 'subAfter', lexemes[lex]);
            }
            state = 'crossroads';
            break;
          case '(':
            if (!lexemes[lex + 1]) {
              throw error('parser47', 'parName', lexemes[lex]);
            }
            lex += 1;
            state = 'parameter';
            break;
          default:
            throw error('parser48', 'subSemi', lexemes[lex]);
        }
        break;
      case 'parameter':
        if (lexemes[lex].content === 'var') {
          byref = true;
          if (!lexemes[lex + 1]) {
            throw error('parser49', 'parName', lexemes[lex]);
          }
          lex += 1;
        }
        if (lexemes[lex].ttype === 'turtle') {
          throw error('parser50', 'parTurtle', lexemes[lex]);
        }
        if (lexemes[lex].type !== 'identifier') {
          throw error('parser51', 'parId', lexemes[lex]);
        }
        if (lexemes[lex].content === routines[0].name) {
          throw error('parser52', 'parProg', lexemes[lex]);
        }
        if (exists(routine, lexemes[lex].content)) {
          throw error('parser53', 'parDupl', lexemes[lex]);
        }
        variable = factory.variable(lexemes[lex].content, routine, byref);
        routine.parameters.push(variable);
        routine.variables.push(variable);
        if (!lexemes[lex + 1]) {
          throw error('parser54', 'parType', lexemes[lex]);
        }
        lex += 1;
        if (lexemes[lex].type === 'identifier') {
          throw error('parser57', 'parComma', lexemes[lex]);
        }
        switch (lexemes[lex].content) {
          case ',':
            if (!lexemes[lex + 1]) {
              throw error('parser55', 'parName', lexemes[lex]);
            }
            lex += 1;
            state = 'parameter';
            break;
          case ':':
            if (!lexemes[lex + 1]) {
              throw error('parser56', 'parType', lexemes[lex]);
            }
            byref = false;
            lex += 1;
            state = 'parameterType';
            break;
          default:
            throw error('parser58', 'parType', lexemes[lex]);
          }
          break;
      case 'parameterType':
        if (lexemes[lex].type !== 'type') {
          throw error('parser59', 'parBadType', lexemes[lex]);
        }
        if (lexemes[lex].content === 'array') {
          throw error('parser60', 'parArray', lexemes[lex]);
        }
        fixVariableTypes(routine, lexemes[lex].content);
        if (!lexemes[lex + 1]) {
          throw error('parser61', 'subBracket', lexemes[lex]);
        }
        lex += 1;
        switch (lexemes[lex].content) {
          case ';':
            if (!lexemes[lex + 1]) {
              throw error('parser62', 'parName', lexemes[lex]);
            }
            while (lexemes[lex].content === ';') {
              lex += 1;
            }
            state = 'parameter';
            break;
          case ')':
            if (routine.type === 'function') {
              if (!lexemes[lex + 1]) {
                throw error('parser63', 'fnType', lexemes[lex]);
              }
              lex += 1;
              if (lexemes[lex].content !== ':') {
                throw error('parser64', 'fnType', lexemes[lex]);
              }
              if (!lexemes[lex + 1]) {
                throw error('parser65', 'fnType', lexemes[lex]);
              }
              lex += 1;
              if (lexemes[lex].type !== 'type') {
                throw error('parser66', 'fnBadType', lexemes[lex]);
              }
              if (lexemes[lex].content === 'array') {
                throw error("parser67", "fnArray", lexemes[lex]);
              }
              routine.returns = lexemes[lex].content;
              routine.variables[0].type = lexemes[lex].content;
            }
            if (!lexemes[lex + 1]) {
              throw error('parser68', 'subSemi', lexemes[lex]);
            }
            lex += 1;
            if (lexemes[lex].content !== ';') {
              throw error('parser69', 'subSemi', lexemes[lex]);
            }
            while (lexemes[lex].content === ';') {
              lex += 1;
            }
            if (!lexemes[lex]) {
              throw error('parser70', 'subAfter', lexemes[lex]);
            }
            state = 'crossroads';
            break;
          default:
            throw error('parser71', 'subBracket', lexemes[lex]);
        }
        break;
      case 'begin':
        switch (lexemes[lex].content) {
          case 'begin':
            routine.lexemes.push(lexemes[lex]);
            begins += 1;
            break;
          case 'end':
            if (begins > 0) {
              routine.lexemes.push(lexemes[lex]);
              begins -= 1;
            } else {
              state = 'end';
            }
            break;
          default:
            routine.lexemes.push(lexemes[lex]);
        }
        if (state !== 'end') {
          if (!lexemes[lex + 1]) {
            throw error('parser72', 'subEnd', lexemes[lex]);
          }
          lex += 1;
        }
        break;
      case 'end':
        if (routine.index === 0) { // main program
          if (!lexemes[lex + 1]) {
            throw error('parser73', 'progDot', lexemes[lex]);
          }
          lex += 1;
          if (lexemes[lex].content !== '.') {
            throw error('parser74', 'progDot', lexemes[lex]);
          }
          lex += 1;
          state = 'finish';
        } else { // subroutine
          if (!lexemes[lex + 1]) {
            throw error('parser75', 'subEndSemi', lexemes[lex]);
          }
          lex += 1;
          if (lexemes[lex].content !== ';') {
            throw error('parser76', 'subEndSemi', lexemes[lex]);
          }
          while (lexemes[lex].content === ';') {
            lex += 1;
          }
          if (!lexemes[lex]) {
            throw error('parser77', 'subAfter', lexemes[lex]);
          }
          routineCount += 1;
          routine.index = routineCount;
          routines.push(routineStack.pop());
          routine = routineStack[routineStack.length - 1];
          state = 'crossroads';
        }
        break;
      case 'finish':
        throw error('parser78', 'progOver', lexemes[lex]);
    }
  }
  return routines;
};

module.exports = parser;
