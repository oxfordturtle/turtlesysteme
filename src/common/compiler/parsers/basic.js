/*
parser for Turtle BASIC - lexemes go in, array of routines comes out; the first element in the
array is the main PROGRAM object

look at the factory module to see what the PROGRAM object (and its components) look like

this analyses the structure of the program, and builds up lists of all the constants, variables,
and subroutines (with their variables and parameters) - lexemes for the program (and any
subroutine) code themselves are just stored for subsequent handling by the pcoder
*/
import error from '../tools/error'
import * as factory from './factory/factory'

export default (lexemes) => {
  const routines = [] // array of routines (0 being the main program)
  var lex = 0 // index of current lexeme
  var inProgram, inProcedure, inFunction, byref // flags
  var routine, variable // object references
  // var fnResultLex
  // var fnResultExp
  var fnResultLine
  var state = 'start'
  while (lex < lexemes.length) {
    switch (state) {
      case 'start':
        inProgram = true
        inProcedure = false
        inFunction = false
        // the main program needs a name for the search functions - make it illegal (!) so it won't
        // clash with any subroutine names
        routine = factory.program('!', 'BASIC')
        routines.push(routine)
        // expecting array declarations or program commands (subroutine definitions not allowed)
        if (lexemes[lex].content === 'DEF') throw error('Subroutines must be defined after program "END".', lexemes[lex])
        state = (lexemes[lex].content === 'DIM') ? 'dim' : 'prog'
        break
      case 'dim':
        // TODO
        break
      case 'prog':
        // expecting program commands or "END" (definitions not allowed)
        if (lexemes[lex].content === 'DIM') throw error('"DIM" commands must occur at the top of the program.', lexemes[lex])
        if (lexemes[lex].content === 'PRIVATE') throw error('Private variables cannot be defined in the main program.', lexemes[lex])
        if (lexemes[lex].content === 'LOCAL') throw error('Local variables cannot be defined in the main program.', lexemes[lex])
        if (lexemes[lex].content === 'DEF') throw error('Subroutines must be defined after program "END".', lexemes[lex])
        if (lexemes[lex].content === 'END') {
          inProgram = false
          state = 'end'
        } else {
          if (lexemes[lex].type === 'identifier' && lexemes[lex + 1] && lexemes[lex + 1].content === '=') {
            if (!exists(routines[0], lexemes[lex].content)) {
              variable = factory.variable(lexemes[lex], routines[0], false)
              variable.fulltype = varFulltype(lexemes[lex].content)
              routines[0].variables.push(variable)
            }
          }
          routines[0].lexemes.push(lexemes[lex])
        }
        lex += 1
        break
      case 'end':
        // expecting nothing, or the start of a new subroutine
        if (lexemes[lex]) {
          if (lexemes[lex].content === 'DEF') {
            // okay, subroutine definition
            lex += 1
            state = 'def'
          } else {
            // anything else is an error
            if (routine.index === 0) throw error('No program text can appear after program "END" (except subroutine definitions).', lexemes[lex])
            throw error('No program text can appear after subroutine end (except further subroutine definitions).', lexemes[lex])
          }
        }
        break
      case 'def':
        // expecting subroutine name
        if (!lexemes[lex]) throw error('"DEF" must be followed by a valid procedure or function name. (Procedure names must begin with "PROC", and function names must begin with "FN".)', lexemes[lex - 1])
        if (!subType(lexemes[lex].content)) throw error('"DIM" commands can only occur within the main program. To declare a local or private array, use "LOCAL" or "PRIVATE" instead.', lexemes[lex])
        routine = factory.subroutine(lexemes[lex].content, subType(lexemes[lex].content, routines[0]))
        routine.parent = routines[0]
        routines.push(routine)
        routines[0].subroutines.push(routine)
        if (routine.type === 'procedure') {
          inProcedure = true
        } else {
          inFunction = true
          variable = factory.variable({ content: 'result' }, routine)
          routine.variables.push(variable)
        }
        // expecting parameters, variables, or the start of the subroutine
        if (!lexemes[lex + 1]) throw error('No program text can appear after subroutine end (except further subroutine definitions).', lexemes[lex])
        lex += 1
        if (lexemes[lex].content === '(') {
          lex += 1
          state = 'parameters'
        } else {
          state = 'variables'
        }
        break
      case 'parameters':
        if (!lexemes[lex]) {
          throw error('Parameter name expected.', lexemes[lex - 1])
        }
        byref = (lexemes[lex].content === 'RETURN')
        lex = (lexemes[lex].content === 'RETURN') ? lex + 1 : lex
        if (!lexemes[lex]) {
          throw error('Parameter name expected.', lexemes[lex - 1])
        }
        if (lexemes[lex].type === 'turtle') {
          throw error('{lex} is the name of a Turtle property, and cannot be used as a parameter name.', lexemes[lex])
        }
        if (lexemes[lex].type !== 'identifier') {
          throw error('{lex} is not a valid parameter name.', lexemes[lex])
        }
        if (!varFulltype(lexemes[lex].content)) {
          throw error('{lex} is not a valid parameter name. Integer parameters must end with "%", and string parameters must end with "$".', lexemes[lex])
        }
        if (exists(routine, lexemes[lex].content)) {
          throw error('{lex} is already a parameter for this subroutine.', lexemes[lex])
        }
        variable = factory.variable(lexemes[lex], routine, byref)
        variable.fulltype = varFulltype(lexemes[lex].content)
        routine.parameters.push(variable)
        routine.variables.push(variable)
        lex += 1
        // expecting comma or closing bracket
        if (!lexemes[lex]) throw error('Closing bracket needed after parameters.', lexemes[lex - 1])
        if (lexemes[lex].type === 'identifier') throw error('Comma needed after parameter.', lexemes[lex])
        if (lexemes[lex].content === ')') {
          state = 'variables'
        } else {
          if (lexemes[lex].content !== ',') throw error('Closing bracket needed after parameters.', lexemes[lex])
        }
        lex += 1
        break
      case 'variables':
        // expecting variable declarations, or the start of the subroutine commands
        if (!lexemes[lex]) throw error('Subroutine definition must be followed by some commands.', lexemes[lex - 1])
        switch (lexemes[lex].content) {
          case 'DIM':
            throw error('"DIM" commands can only occur within the main program. To declare a local or private array, use "LOCAL" or "PRIVATE" instead.', lexemes[lex])
          case 'PRIVATE':
            lex += 1
            state = 'private'
            break
          case 'LOCAL':
            lex += 1
            state = 'local'
            break
          default:
            state = 'subroutine'
        }
        break
      case 'private':
        // expecting comma separated list of private variables
        if (!lexemes[lex]) {
          throw error('Variable name expected.', lexemes[lex - 1])
        }
        if (lexemes[lex].type === 'turtle') {
          throw error('{lex} is the name of a Turtle property, and cannot be used as a variable name.', lexemes[lex])
        }
        if (lexemes[lex].type !== 'identifier') {
          throw error('{lex} is not a valid variable name.', lexemes[lex])
        }
        if (!varFulltype(lexemes[lex].content)) {
          throw error('{lex} is not a valid variable name. Integer variables must end with "%", and string variables must end with "$".', lexemes[lex])
        }
        if (exists(routine, lexemes[lex].content)) {
          throw error('{lex} is already a variable in the current scope.', lexemes[lex])
        }
        variable = factory.variable(lexemes[lex], routines[0])
        variable.fulltype = varFulltype(lexemes[lex].content)
        variable.private = routine // flag the variable as private to this routine
        routines[0].variables.push(variable)
        lex += 1
        // expecting a comma, or the rest of the subroutine
        if (!lexemes[lex]) throw error('subNoEnd', lexemes[lex - 1])
        if (lexemes[lex].content === ',') {
          lex += 1 // stay here
        } else {
          state = 'variables' // move back
        }
        break
      case 'local':
        // expecting comma separated list of local variables
        if (!lexemes[lex]) {
          throw error('Variable name expected.', lexemes[lex - 1])
        }
        if (lexemes[lex].type === 'turtle') {
          throw error('{lex} is the name of a Turtle property, and cannot be used as a variable name.', lexemes[lex])
        }
        if (lexemes[lex].type !== 'identifier') {
          throw error('{lex} is not a valid variable name.', lexemes[lex])
        }
        if (!varFulltype(lexemes[lex].content)) {
          throw error('{lex} is not a valid variable name. Integer variables must end with "%", and string variables must end with "$".', lexemes[lex])
        }
        if (exists(routine, lexemes[lex].content)) {
          throw error('{lex} is already a variable in the current scope.', lexemes[lex])
        }
        variable = factory.variable(lexemes[lex], routine)
        variable.fulltype = varFulltype(lexemes[lex].content)
        routine.variables.push(variable)
        lex += 1
        // expecting a comma, or the rest of the subroutine
        if (!lexemes[lex]) {
          if (routine.type === 'procedure') {
            throw error('Procedure must finish with "ENDPROC".', lexemes[lex])
          }
          throw error('Function must finish with "=expression".', lexemes[lex])
        }
        if (lexemes[lex].content === ',') {
          lex += 1 // stay here
        } else {
          state = 'variables' // move back
        }
        break
      case 'subroutine':
        // expecting subroutine commands
        // DIMs only allowed in the main program
        if (lexemes[lex].content === 'DIM') throw error('"DIM" commands can only occur within the main program. To declare a local or private array, use "LOCAL" or "PRIVATE" instead.', lexemes[lex])
        // too late for PRIVATE or LOCAL variables to be declared
        if (lexemes[lex].content === 'PRIVATE') throw error('Private variables must be declared at the start of the subroutine.', lexemes[lex])
        if (lexemes[lex].content === 'LOCAL') throw error('Local variables must be declared at the start of the subroutine.', lexemes[lex])
        // next subroutine DEF must come after this subroutine has finished
        if (lexemes[lex].content === 'DEF') throw error('The next subroutine must be defined after subroutine "ENDPROC".', lexemes[lex])
        // check for undefined variables, and add them to the main program
        if (lexemes[lex].type === 'variable') {
          if (!exists(routines[0], lexemes[lex].content) && !exists(routine, lexemes[lex].content)) {
            variable = factory.variable(lexemes[lex], routines[0])
            variable.fulltype = varFulltype(lexemes[lex].content)
            routines[0].variables.push(variable)
          }
        }
        // expecting "ENDPROC", "=<expression>", or subroutine commands
        if (lexemes[lex].content === 'ENDPROC') {
          if (routine.type === 'procedure') {
            lex += 1
            inProcedure = false
            state = 'end'
          } else {
            throw error('Function must end with "=&lt;expression&gt;", not "ENDPROC".', lexemes[lex])
          }
        } else if ((lexemes[lex].line > lexemes[lex - 1].line) && lexemes[lex].content === '=') {
          if (routine.type === 'function') {
            routine.lexemes.push(lexemes[lex])
            lex += 1
            state = 'result'
          } else {
            throw error('Procedure must end with "ENDPROC", not "=&lt;expression&gt;".', lexemes[lex])
          }
        } else {
          routine.lexemes.push(lexemes[lex])
          lex += 1
        }
        break
      case 'result':
        if (!lexemes[lex]) throw error('Subroutine definition must be followed by some commands.', lexemes[lex - 1])
        fnResultLine = lexemes[lex].line
        while (lexemes[lex] && lexemes[lex].line === fnResultLine) {
          routine.lexemes.push(lexemes[lex])
          lex += 1
        }
        inFunction = false
        state = 'end'
        break
    }
  }
  if (inProgram) throw error('Program must finish with "END".', lexemes[lex - 1])
  if (inProcedure) throw error('Procedure must finish with "ENDPROC".', lexemes[lex - 1])
  if (inFunction) throw error('Function must finish with "=expression".', lexemes[lex - 1])
  return routines
}

// check if a routine contains a variable of a given name
const exists = (routine, string) =>
  routine.variables.some((x) => ((x.name || x.names.basic) === string))

// get variable fulltype from its name
const varFulltype = string => {
  const type = string.slice(-1) === '%' ? 'boolint' : 'string'
  const length = type === 'boolint' ? 0 : 34
  return type ? factory.fulltype(type, length) : false
}

// get the type of a subroutine from its name
const subType = (string) => {
  if (string.slice(0, 4) === 'PROC') return 'procedure'
  if (string.slice(0, 2) === 'FN') return 'function'
  return false
}
