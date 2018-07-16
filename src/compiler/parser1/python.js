/* languages/parser1/python
----------------------------------------------------------------------------------------------------
parser for Turtle Python - lexemes go in, array of routines comes out; the first element in the
array is the main PROGRAM object

look at the factory module to see what the PROGRAM object (and its components) look like

this analyses the structure of the program, and builds up lists of all the constants, variables, and
subroutines (with their variables and parameters) - lexemes for the program (and any subroutine)
code themselves are just stored for subsequent handling by the pcoder
----------------------------------------------------------------------------------------------------
*/

const find = require('compiler/find');
const factory = require('./factory');

// generate an error message
message = (messageId, lexeme) => {
  switch (messageId) {
    // crossroad errors
    case 'xrdIndentSmall':
      return 'Not enough indents.';
    case 'xrdIndentLarge':
      return 'Too many indents.';
    case 'xrdGlobalNotSub':
      return 'Only subroutines can import global variables.';
    case 'xrdGlobalAfterSub':
      return 'Global import statements must come before any subroutine definitions.';
    case 'xrdNonlocalNotSub':
      return 'Only subroutines can import nonlocal variables.';
    case 'xrdNonlocalAfterSub':
      return 'Nonlocal import statements must come before any subroutine definitions.';
    case 'xrdDefAfterCommand':
      return 'Subroutine definitions must come before any routine commands.';
    // global errors
    case 'glblNothingAfter':
      return 'Keyword "global" must be followed by the name of a global variable to import.';
    case 'glblNotIdentifier':
      return `"${lexeme.content}" is not a valid variable name.`;
    case 'glblNewLine':
      return `Variable name "${lexeme.content}" cannot be on a new line.`;
    case 'glblRepeat':
      return `Global variable "${lexeme.content}" has already been imported into this routine.`;
    case 'glblNothingAfterId':
      return 'No commands found after global variables import statement.';
    case 'glblNoNewLine':
      return `"${lexeme.content}" must be on a new line.`;
    case 'glblNothingAfterComma':
      return 'Comma must be followed by the name of another global variable';
    // nonlocal errors
    case 'nlclNothingAfter':
      return 'Keyword "nonlocal" must be followed by the name of a nonlocal variable to import.';
    case 'nlclTurtle':
      return `"${lexeme.content}" is the name of a global variable, not a nonlocal one.`;
    case 'nlclNotIdentifier':
      return `"${lexeme.string}" is not a valid variable name.`;
    case 'nlclNewLine':
      return `Variable name "${lexeme.string}" cannot be on a new line.`;
    case 'nlclRepeat':
      return `Nonlocal variable "${lexeme.string}" has already been imported into this routine.`;
    case 'nlclNothingAfterId':
      return 'No commands found after nonlocal variables import statement.';
    case 'nlclNoNewLine':
      return `"${lexeme.string}" must be on a new line.`;
    case 'nlclNothingAfterComma':
      return 'Comma must be followed by the name of another nonlocal variable.';
    // def errors
    case 'defTurtle':
      return 'subroutine has turtle global as name';
    case 'defNotIdentifier':
      return 'subroutine is not an identifier';
    case 'defNewLine':
      return `subroutine name is on a new line ("def // ${lexeme.string}")`;
    case 'defRepeat':
      return 'subroutine name already used';
    case 'defNoLbkt':
      return 'no left bracket after subroutine name';
    case 'defLbktNewLine':
      return 'left bracket is on a new line';
    // parameters errors
    case 'parsNothing':
      return '"def name(" followed by nothing';
    case 'parsRbktNewLine':
      return 'closing bracket after parameter list is on a new line';
    case 'parsNoColon':
      return 'no colon following "def name()"';
    case 'parsColonNewLine':
      return 'colon is on a new line';
    case 'parsNothingAfter':
      return 'no commands following "def name(par1, par2, ...):"';
    case 'parsNoNewLineAfter':
      return 'no new line following "def name(par1, par2, ...):"';
    case 'parsIdNewLine':
      return 'parameter is on a new line';
    case 'parsIdRepeat':
      return 'parameter name already used';
    case 'parsIdNothingAfter':
      return 'parameter name followed by nothing';
    case 'parsCommaNothingAfter':
      return '"def name(par1," nothing afterwards';
    case 'parsCommaNoParameterAfter':
      return '"def name(par1,)"';
    case 'parsCommaNoIdAfter':
      return 'def name(par1,???';
    case 'parsTwoIdsNoComma':
      return 'def name(par1 par2';
    case 'parsNoCommaOrBracket':
      return 'def name(par1 ???';
    case 'parsTurtle':
      return 'turtle variable as parameter name';
    case 'parsNoIdOrBracket':
      return 'def name( ???';
    // command errors
    case 'cmdMainReturn':
      return 'The program cannot return a value.';
    case 'cmdMainSubReturn':
      return 'The "main" subroutine cannot return a value.';
    case 'cmdRepeatReturn':
      return 'Subroutines cannot contain more than one "return" statement.';
    // final
    case 'endNoMain':
      return 'Program must either contain some commands, or define a "main" subroutine.';
  }
};

// create an error object
const error = (messageId, lexeme) =>
  ({
    type: 'Compiler',
    message: message(messageId, lexeme),
    lexeme,
  });

// check if an object has the given name
const isCalled = (name, object) =>
  name === object.name;

// check if a string equals the given string
const isString = (name, string) =>
  name === string;

// check if subroutine name has already been used
const subroutineNameExists = (name, routine) => {
  if (routine.index === 0) {
    return routine.subroutines.some(isCalled.bind(null, name));
  }
  return routine.subroutines.some(isCalled.bind(null, name))
    || routine.globals.some(isString.bind(null, name))
    || routine.nonlocals.some(isString.bind(null, name));
};

// check if lexeme is a (potential) variable definition
const isUndefinedVariableDefinition = (routine, lexemes, lex) => {
  const thisLexeme = lexemes[lex];
  const nextLexeme = lexemes[lex + 1];
  // not even close
  if (thisLexeme.type !== 'identifier') return false;
  // can't be a definition
  if (!nextLexeme) return false;
  // can't be a definition
  if ((nextLexeme.content !== '=') && (nextLexeme.content !== 'in')) return false;
  // is a definition, but variable is already defined
  if (find.variable(routine, thisLexeme.content, 'Python')) return false;
  // otherwise yes
  return true;
};

// get next state and lexeme at the crossroads
const stateAndNext = (lexemes, lex, routine) => {
  switch (lexemes[lex].content) {
    case 'global':
      // global variables are only allowed in subroutines
      if (routine.index === 0) throw error('xrdGlobalNotSub', lexemes[lex]);
      // globals must come before any subroutine definitions
      if (routine.subroutines.length > 0) throw error('xrdGlobalAfterSub', lexemes[lex]);
      // otherwise ok
      return { lex: lex + 1, state: 'global' };
    case 'nonlocal':
      // nonlocal variables are only allowed in subroutines
      if (routine.index === 0) throw error('xrdNonlocalNotSub', lexemes[lex]);
      // locals must come before any subroutine definitions
      if (routine.subroutines.length > 0) throw error('xrdNonLocalAfterSub', lexemes[lex]);
      // otherwise ok
      return { lex: lex + 1, state: 'nonlocal' };
    case 'def':
      // subroutine definitions must come before the routine's commands
      if (routine.lexemes.length > 0) throw error('xrdDefAfterCommand', lexemes[lex]);
      // otherwise ok
      return { lex: lex + 1, state: 'def' };
    default:
      // otherwise ok, and we're expecting the routine's commands
      return { lex, state: 'commands' };
  }
};

//
const variablesAndNext = (lexemes, lex, variables) => {
  let more = true;
  // gather the variable names
  while (more) {
    if (lexemes[lex].type === 'turtle') throw error();
    if (lexemes[lex].type !== 'identifier') throw error();
    if (variables.indexOf(lexemes[lex].content) > -1) throw error();
    variables.push(lexemes[lex].content);
    lex += 1;
    if (lexemes[lex] && lexemes[lex].line === lexemes[lex - 1].line) {
      if (lexemes[lex].content === ',') {
        lex += 1;
        if (!lexemes[lex]) throw error();
        if (lexemes[lex].line !== lexemes[lex - 1].line) throw error();
      }
    } else {
      more = false;
    }
  }
  return { lex, variables };
};

// parse the lexemes into an array of routines
const parser = (lexemes) => {
  const routines = []; // array of routines (0 being the main program)
  const routineStack = []; // stack of routines
  let routineCount = 0; // index of the current routine
  let lex = 0; // index of current lexeme
  let routine, variable; // object references
  let state = 'crossroads';
  let temp = 0;
  // setup
  routine = factory.program('!', 'Python');
  routines.push(routine);
  routineStack.push(routine);
  // loop through lexemes
  while (lex < lexemes.length && temp < 10000) {
    // the big switch
    switch (state) {
      case 'crossroads':
        // expecting 'global', 'nonlocal', 'def', or routine commands
        if (!lexemes[lex]) throw error();
        if (!routine.indent) {
          // set the base indent for this routine from the current lexeme
          routine.indent = lexemes[lex].offset;
        } else {
          // otherwise check it matches the base indent
          if (lexemes[lex].offset < routine.indent) throw error('xrdIndentSmall', lexemes[lex]);
          if (lexemes[lex].offset > routine.indent) throw error('xrdIndentLarge', lexemes[lex]);
        }
        ({ lex, state } = stateAndNext(lexemes, lex, routine));
        break;
      case 'global':
        // expecting comma separated list of global variables on the same line
        if (!lexemes[lex]) throw error();
        if (lexemes[lex].line !== lexemes[lex - 1].line) throw error();
        ({ lex, variables } = globalAndNext(lexemes, lex, routine));
        routine.globals = routine.globals.concat(variables);
        routine.nonlocals = routine.nonlocals.concat(variables);
        state = 'crossroads';
        break;
      case 'nonlocal':
        // expecting comma separated list of nonlocal variables
        if (!lexemes[lex]) throw error('nlclNothingAfter', lexemes[lex - 1]);
        // mustn't be the name of a turtle global
        if (lexemes[lex].type === 'turtle') throw error('nlclTurtle', lexemes[lex]);
        // must be a valid identifier
        if (lexemes[lex].type !== 'identifier') throw error('nlclNotIdentifier', lexemes[lex]);
        // mustn't be on a new line
        if (lexemes[lex].line > lexemes[lex - 1].line) throw error('nlclNewLine', lexemes[lex]);
        // mustn't be a repeat declaration
        if (routine.nonlocals.some(isString.bind(null, lexemes[lex].content))) {
          throw error('nlclRepeat', lexemes[lex]);
        }
        // otherwise ok, add it to the list and move on
        routine.nonlocals.push(lexemes[lex].content);
        lex += 1;
        // expecting something
        if (!lexemes[lex]) throw error('nlclNothingAfterId', lexemes[lex - 1]);
        if (lexemes[lex].line === lexemes[lex - 1].line) {
          // same line means it should be a comma
          if (lexemes[lex].content !== ',') throw error('nlclNoNewLine', lexemes[lex]);
          lex += 1;
          // just check it exists - everything else is handled by this
          // same block of code on the next loop
          if (!lexemes[lex]) throw error('nlclNothingAfterComma', lexemes[lex - 1]);
        } else {
          // new line means go back to the crossroads and carry on
          state = 'crossroads';
        }
        break;
      case 'def':
        // expecting subroutine name, followed by open bracket
        // mustn't be the name of a turtle variable
        if (lexemes[lex].type === 'turtle') throw error('defTurtle', lexemes[lex]);
        // must be a valid identifier
        if (lexemes[lex].type !== 'identifier') throw error('defNotIdentifier', lexemes[lex]);
        // mustn't be on a new line
        if (lexemes[lex - 1].line !== lexemes[lex].line) throw error('defNewLine', lexemes[lex]);
        // check for namespace clashes
        if (subroutineNameExists(lexemes[lex].content, routine)) {
          throw error('defRepeat', lexemes[lex]);
        }
        // otherwise ok - create new routine with current routine as its parent, and make that the
        // new current routine
        routine = factory.subroutine(lexemes[lex].content, 'procedure', routine);
        routine.parent.subroutines.push(routine);
        lex += 1;
        // expecting opening bracket on the same line
        if (!lexemes[lex]) throw error('defNoLbkt', lexemes[lex - 1]);
        if (lexemes[lex].content !== '(') throw error('defNoLbkt', lexemes[lex]);
        if (lexemes[lex - 1].line !== lexemes[lex].line) throw error('defLbktNewLine', lexemes[lex]);
        lex += 1;
        state = 'parameters';
        break;
      case 'parameters':
        // expecting a comma separated list of parameters on the same line, then closing bracket and
        // a colon
        if (!lexemes[lex]) throw error('parsNothing', lexemes[lex - 1]);
        // right bracket means the end of the list
        if (lexemes[lex].content === ')') {
          // right bracket cannot be on a new line
          if (lexemes[lex - 1].line !== lexemes[lex].line) throw error('parsRbktNewLine', lexemes[lex]);
          lex += 1;
          // expecting a colon on the same line
          if (!lexemes[lex]) throw error('parsNoColon', lexemes[lex - 1]);
          if (lexemes[lex].content !== ':') throw error('parsNoColon', lexemes[lex]);
          if (lexemes[lex].line > lexemes[lex - 1].line) throw error('parsColonNewLine', lexemes[lex]);
          lex += 1;
          // expecting something on a new line
          // never mind what it is - CROSSROADS will sort that out
          if (!lexemes[lex]) throw error('parsNothingAfter', lexemes[lex - 1]);
          if (lexemes[lex].line === lexemes[lex - 1].line) throw error('parsNoNewLineAfter', lexemes[lex]);
          state = 'crossroads';
        // identifier is the next item in the list
        } else if (lexemes[lex].type === 'identifier') {
          // identifier cannot be on a new line
          if (lexemes[lex - 1].line !== lexemes[lex].line) throw error('parsIdNewLine', lexemes[lex]);
          // mustn't already be the name of a parameter
          if (routine.parameters.some(isCalled.bind(null, lexemes[lex].content))) {
            throw error('parsIdRepeat', lexemes[lex]);
          }
          // otherwise ok
          variable = factory.variable(lexemes[lex].content, routine);
          routine.parameters.push(variable);
          routine.variables.push(variable);
          lex += 1;
          // expecting either a comma and another parameter, or a right bracket
          // (that it isn't on a new line will be checked here on the next loop)
          if (!lexemes[lex]) throw error('parsIdNothingAfter', lexemes[lex - 1]);
          if (lexemes[lex].type === 'turtle' || lexemes[lex].type === 'identifier') {
            // looks like there's a comma missing
            throw error('parsCommaNoParameterAfter', lexemes[lex]);
          }
          switch (lexemes[lex].content) {
            // comma means another parameter is expected
            case ',':
              lex += 1;
              if (!lexemes[lex]) throw error('parsCommaNothingAfter', lexemes[lex - 1]);
              if (lexemes[lex].content === ')') throw error('parsCommaNoParameterAfter', lexemes[lex]);
              if (lexemes[lex].type !== 'turtle' && lexemes[lex].type !== 'identifier') {
                throw error('py1parser41', 'parsNoIdAfterComma', lexemes[lex]);
              }
              break;
            // right bracket means the end - handled on the next loop
            case ')':
              break;
            // anything else is an error
            default:
              throw error('py1parser43', 'parsNoCommaOrBracket', lexemes[lex]);
          }
        } else if (lexemes[lex].type === 'turtle') {
          // give a more specific error message for turtle properties
          throw error('parsTurtle', lexemes[lex]);
        } else {
          // anything else is a generic error
          throw error('parsNoIdAfterComma', lexemes[lex]);
        }
        break;
      case 'commands':
        // expecting routine commands
        while (lexemes[lex] && (lexemes[lex].offset >= routine.indent)) {
          // maybe deal with return value
          if (lexemes[lex].content === 'return') {
            if (routine.index === 0) throw error('cmdMainReturn', lexemes[lex]);
            if (routine.name === 'main') throw error('cmdMainSubReturn', lexemes[lex]);
            if (routine.type === 'function') throw error('cmdRepeatReturn', lexemes[lex]);
            routine.type = 'function';
            variable = factory.variable('return', routine, false);
            routine.variables.unshift(variable);
          }
          // maybe add a variable
          if (isUndefinedVariableDefinition(routine, lexemes, lex)) {
            // create the variable and add it to the appropriate routine
            if (routine.index === 0) {
              // normal global variable
              variable = factory.variable(lexemes[lex].content, routine, false);
              routine.variables.push(variable);
            } else if (routine.globals.indexOf(lexemes[lex].content) > -1) {
              // global variable within subroutine
              variable = factory.variable(lexemes[lex].content, routines[0], false);
              routines[0].variables.push(variable);
            } else if (routine.nonlocals.indexOf(lexemes[lex].content) > -1) {
              // nonlocal variable within subroutine
              variable = factory.variable(lexemes[lex].content, routine.parent, false);
              routine.parent.variables.push(variable);
            } else {
              // local variable
              variable = factory.variable(lexemes[lex].content, routine, false);
              routine.variables.push(variable);
            }
          }
          // add the lexeme to the routine and move past it
          routine.lexemes.push(lexemes[lex]);
          lex += 1;
        }
        if (routine.index !== 0) {
          routine.index = routines.length;
          routines.push(routine);
          routine = routine.parent;
        }
        state = 'crossroads';
        break;
      default:
        break;
    }
    temp += 1;
  }
  // finally, if the program has no commands, check for a 'main' subroutine, and fix the main
  // program so that it calls it
  if (routines[0].lexemes.length === 0) {
    if (routines.some(isCalled.bind(null, 'main'))) {
      routines[0].lexemes = [
        {type: 'identifier', content: 'main', indent: 0},
        {type: 'punctuation', content: '(', indent: 0},
        {type: 'punctuation', content: ')', indent: 0}
      ];
    } else {
      throw error('endNoMain', lexemes[lexemes.length - 1]);
    }
  }
  return routines;
};

module.exports = parser;
