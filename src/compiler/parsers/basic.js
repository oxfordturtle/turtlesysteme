/*
parser for Turtle BASIC - lexemes go in, array of routines comes out; the first element in the array
is the main PROGRAM object

look at the factory module to see what the PROGRAM object (and its components) look like

this analyses the structure of the program, and builds up lists of all the constants, variables, and
subroutines (with their variables and parameters) - lexemes for the program (and any subroutine)
code themselves are just stored for subsequent handling by the pcoder
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
    // program errors
    case 'progDef':
      return 'Subroutines must be defined after program "END".';
    case 'progNoDim':
      return 'The online compiler does not support arrays. Please compile your program in the downloadable system.';
    case 'progDim':
      return '"DIM" commands must occur at the top of the program.';
    case 'progPrivate':
      return 'Private variables cannot be defined in the main program.';
    case 'progLocal':
      return 'Local variables cannot be defined in the main program.';
    case 'progAfter':
      return 'No program text can appear after program "END" (except subroutine definitions).';
    case 'progNoEnd':
      return 'Program must finish with "END".';
    // subroutine errors
    case 'subName':
      return '"DEF" must be followed by a valid procedure or function name. (Procedure names must begin with "PROC", and function names must begin with "FN".)';
    case 'subBadName':
      return '';
    case 'subDim':
      return '"DIM" commands can only occur within the main program. To declare a local or private array, use "LOCAL" or "PRIVATE" instead.';
    case 'subEmpty':
      return 'Subroutine definition must be followed by some commands.';
    case 'subPrivate':
      return 'Private variables must be declared at the start of the subroutine.';
    case 'subLocal':
      return 'Local variables must be declared at the start of the subroutine.';
    case 'subDef':
      return 'The next subroutine must be defined after subroutine "ENDPROC".';
    case 'subEndFn':
      return 'Function must end with "=&lt;expression&gt;", not "ENDPROC".';
    case 'subEndProc':
      return 'Procedure must end with "ENDPROC", not "=&lt;expression&gt;".';
    case 'subEmptyResult':
      return '"=" must be followed by a return value.';
    case 'subAfter':
      return 'No program text can appear after subroutine end (except further subroutine definitions).';
    case 'subNoEndProc':
      return 'Procedure must finish with "ENDPROC".';
    case 'subNoEndFunc':
      return 'Function must finish with "=&lt;expression$gt;".';
    // paramater errors
    case 'parName':
      return 'Parameter name expected.';
    case 'parTurtle':
      return `"${lexeme.content}" is the name of a Turtle property, and cannot be used as a parameter name.`;
    case 'parId':
      return `"${lexeme.content}" is not a valid parameter name. Integer parameters must end with "%", and string parameters must end with "$".`;
    case 'parDupl':
      return `"${lexeme.content}" is already a parameter for this subroutine.`;
    case 'parBracket':
      return 'Closing bracket needed after parameters.';
    case 'parComma':
      return 'Comma needed after parameter.';
    // variable errors
    case 'varName':
      return 'Variable name expected.';
    case 'varTurtle':
      return `"${lexeme.content}" is the name of a Turtle property, and cannot be used as a variable name.`;
    case 'varId':
      return `"${lexeme.content}" is not a valid variable name. Integer variables must end with "%", and string variables must end with "$".`;
    case 'varDupl':
      return `"${lexeme.content}" is already a variable in the current scope.`;
    default:
      return 'Bad error message ID.';
  }
};

// create an error object
const error = (messageId, lexeme) =>
  ({
    type: 'Compiler',
    message: message(messageId, lexeme),
    lexeme,
  });

// check if a string matches the name of an object
const matches = (string, obj) =>
  (obj.name || obj.names.basic) === string;

// check if a routine contains a variable of a given name
const exists = (routine, string) =>
  routine.variables.some((x) => ((x.name || x.names.basic) === string));

// get variable fulltype from its name
const varFulltype = string => {
  const type = string.slice(-1) === '%' ? 'boolint' : 'string';
  const length = type === 'boolint' ? 0 : 34;
  return factory.fulltype(type, length);
};

// get the type of a subroutine from its name
const subType = (string) => {
  if (string.slice(0, 4) === 'PROC') return 'procedure';
  if (string.slice(0, 2) === 'FN') return 'function';
  return false;
};

// the parser function
const parser = (lexemes) => {
  const routines = []; // array of routines (0 being the main program)
  var lex = 0; // index of current lexeme
  var inProgram, inProcedure, inFunction; // flags
  var routine, variable; // object references
  var fnResultLex;
  var fnResultLine;
  var fnResultExp;
  var state = 'start';
  while (lex < lexemes.length) {
    switch (state) {
      case 'start':
        inProgram = true;
        inProcedure = false;
        inFunction = false;
        // the main program needs a name for the search functions - make it illegal (!) so it won't
        // clash with any subroutine names
        routine = factory.program('!', 'BASIC');
        routines.push(routine);
        // expecting array declarations or program commands (subroutine definitions not allowed)
        if (lexemes[lex].content === 'DEF') throw error('progDef', lexemes[lex]);
        state = (lexemes[lex].content === 'DIM') ? 'dim' : 'prog';
        break;
      case 'dim':
        // TODO
        break;
      case 'prog':
        // expecting program commands or "END" (definitions not allowed)
        if (lexemes[lex].content === 'DIM') throw error('progDim', lexemes[lex]);
        if (lexemes[lex].content === 'PRIVATE') throw error('progPrivate', lexemes[lex]);
        if (lexemes[lex].content === 'LOCAL') throw error('progLocal', lexemes[lex]);
        if (lexemes[lex].content === 'DEF') throw error('progDef', lexemes[lex]);
        if (lexemes[lex].content === 'END') {
          inProgram = false;
          state = 'end';
        } else {
          if (lexemes[lex].type === 'variable') {
            if (!exists(routines[0], lexemes[lex].content)) {
              variable = factory.variable(lexemes[lex].content, routines[0], false);
              variable.fulltype = varFulltype(lexemes[lex].content);
              routines[0].variables.push(variable);
            }
          }
          routines[0].lexemes.push(lexemes[lex]);
        }
        lex += 1;
        break;
      case 'end':
        // expecting nothing, or the start of a new subroutine
        if (lexemes[lex]) {
          if (lexemes[lex].content === 'DEF') {
            // okay, subroutine definition
            lex += 1;
            state = 'def';
          } else {
            // anything else is an error
            if (routine.index === 0) throw error('progAfter', lexemes[lex]);
            throw error('subAfter', lexemes[lex]);
          }
        }
        break;
      case 'def':
        // expecting subroutine name
        if (!lexemes[lex]) throw error('subName', lexemes[lex - 1]);
        if (!subType(lexemes[lex].content)) throw error('subBadName', lexemes[lex]);
        routine = factory.subroutine(lexemes[lex].content, subType(lexemes[lex].content, routines[0]));
        routine.parent = routines[0];
        routines.push(routine);
        routines[0].subroutines.push(routine);
        if (routine.type === 'procedure') {
          inProcedure = true;
        } else {
          inFunction = true;
          variable = factory.variable('result', routine);
          routine.variables.push(variable);
        }
        // expecting parameters, variables, or the start of the subroutine
        if (!lexemes[lex + 1]) throw error('subAfter', lexemes[lex]);
        lex += 1;
        if (lexemes[lex].content === '(') {
          lex += 1;
          state = 'parameters';
        } else {
          state = 'variables';
        }
        break;
      case 'parameters':
        if (!lexemes[lex]) throw error('parName', lexemes[lex - 1]);
        byref = (lexemes[lex].content === 'RETURN');
        lex = (lexemes[lex].content === 'RETURN') ? lex + 1 : lex;
        if (!lexemes[lex]) throw error('parName', lexemes[lex - 1]);
        if (lexemes[lex].type === 'turtle') throw error('parTurtle', lexemes[lex]);
        if (lexemes[lex].type !== 'variable') throw error('parId', lexemes[lex]);
        if (exists(routine, lexemes[lex].content)) throw error('parDupl', lexemes[lex]);
        variable = factory.variable(lexemes[lex].content, routine, byref);
        variable.fulltype = varFulltype(lexemes[lex].content);
        routine.parameters.push(variable);
        routine.variables.push(variable);
        lex += 1;
        // expecting comma or closing bracket
        if (!lexemes[lex]) throw error('parBracket', lexemes[lex - 1]);
        if (lexemes[lex].type === 'variable') throw error('parComma', lexemes[lex]);
        if (lexemes[lex].content === ')') {
          state = 'variables';
        } else {
          if (lexemes[lex].content !== ',') throw error('parBracket', lexemes[lex]);
        }
        lex += 1;
        break;
      case 'variables':
        // expecting variable declarations, or the start of the subroutine commands
        if (!lexemes[lex]) throw error('subEmpty', lexemes[lex - 1]);
        switch (lexemes[lex].content) {
          case 'DIM':
            throw error('subDim', lexemes[lex]);
          case 'PRIVATE':
            lex += 1;
            state = 'private';
            break;
          case 'LOCAL':
            lex += 1;
            state = 'local'
            break;
          default:
            state = 'subroutine';
        }
        break;
      case 'private':
        // expecting comma separated list of private variables
        if (!lexemes[lex]) throw error('varName', lexemes[lex - 1]);
        if (lexemes[lex].type === 'turtle') throw error('varTurtle', lexemes[lex]);
        if (lexemes[lex].type !== 'variable') throw error('varId', lexemes[lex]);
        if (exists(routine, lexemes[lex].content)) throw error('varDupl', lexemes[lex]);
        variable = factory.variable(lexemes[lex].content, routines[0]);
        variable.fulltype = varFulltype(lexemes[lex].content);
        variable.private = routine; // flag the variable as private to this routine
        routines[0].variables.push(variable);
        lex += 1;
        // expecting a comma, or the rest of the subroutine
        if (!lexemes[lex]) throw error('subNoEnd', lexemes[lex - 1]);
        if (lexemes[lex].content === ',') {
          lex += 1; // stay here
        } else {
          state = 'variables'; // move back
        }
        break;
      case 'local':
        // expecting comma separated list of local variables
        if (!lexemes[lex]) throw error('varName', lexemes[lex - 1]);
        if (lexemes[lex].type === 'turtle') throw error('varTurtle', lexemes[lex]);
        if (lexemes[lex].type !== 'variable') throw error('varId', lexemes[lex]);
        if (exists(routine, lexemes[lex].content)) throw error('varDupl', lexemes[lex]);
        variable = factory.variable(lexemes[lex].content, routine);
        variable.fulltype = varFulltype(lexemes[lex].content);
        routine.variables.push(variable);
        lex += 1;
        // expecting a comma, or the rest of the subroutine
        if (!lexemes[lex]) {
          if (routine.type === 'procedure') throw error('subNoEndProc', lexemes[lex]);
          throw error('subNoEndFn', lexemes[lex]);
        }
        if (lexemes[lex].content === ',') {
          lex += 1; // stay here
        } else {
          state = 'variables'; // move back
        }
        break;
      case 'subroutine':
        // expecting subroutine commands
        // DIMs only allowed in the main program
        if (lexemes[lex].content === 'DIM') throw error('subDim', lexemes[lex]);
        // too late for PRIVATE or LOCAL variables to be declared
        if (lexemes[lex].content === 'PRIVATE') throw error('subPrivate', lexemes[lex]);
        if (lexemes[lex].content === 'LOCAL') throw error('subLocal', lexemes[lex]);
        // next subroutine DEF must come after this subroutine has finished
        if (lexemes[lex].content === 'DEF') throw error('subDef', lexemes[lex]);
        // check for undefined variables, and add them to the main program
        if (lexemes[lex].type === 'variable') {
          if (!exists(routines[0], lexemes[lex].content) && !exists(routine, lexemes[lex].content)) {
            variable = factory.variable(lexemes[lex].content, routines[0]);
            variable.fulltype = varFulltype(lexemes[lex].content);
            routines[0].variables.push(variable);
          }
        }
        // expecting "ENDPROC", "=<expression>", or subroutine commands
        if (lexemes[lex].content === 'ENDPROC') {
          if (routine.type === 'procedure') {
            lex += 1;
            inProcedure = false;
            state = 'end';
          } else {
            throw error('subEndFn', lexemes[lex]);
          }
        } else if ((lexemes[lex].line > lexemes[lex - 1].line) && lexemes[lex].content === '=') {
          if (routine.type === 'function') {
            routine.lexemes.push(lexemes[lex]);
            lex += 1;
            state = 'result';
          } else {
            throw error('subEndProc', lexemes[lex]);
          }
        } else {
          routine.lexemes.push(lexemes[lex]);
          lex += 1;
        }
        break;
      case 'result':
        if (!lexemes[lex]) throw error('subEmptyResult', lexemes[lex - 1]);
        fnResultLine = lexemes[lex].line;
        while (lexemes[lex] && lexemes[lex].line === fnResultLine) {
          routine.lexemes.push(lexemes[lex]);
          lex += 1;
        }
        inFunction = false;
        state = 'end';
        break;
    }
  }
  if (inProgram) throw error('progNoEnd', lexemes[lex - 1]);
  if (inProcedure) throw error('subNoEndProc', lexemes[lex - 1]);
  if (inFunction) throw error('subNoEndFn', lexemes[lex - 1]);
  return routines;
};

module.exports = parser;
*/
