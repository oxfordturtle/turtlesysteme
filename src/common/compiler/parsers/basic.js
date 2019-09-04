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
  let lex = 0 // index of the current lexeme
  let routine = {} // reference to the current routine
  let variable = {} // reference to the current variable
  let inProgram = true // whether we are currently parsing the main program code
  let inProcedure = false // whether we are currently parsing a procedure subroutine
  let inFunction = false // whether we are currently parsing a function subroutine
  let byref = false // whether the current variable is a reference variable
  let state = 'start'

  // the main program needs a name for the search functions - make it illegal (!) so it won't
  // clash with any subroutine names
  routine = factory.program('!', 'BASIC')
  routines.push(routine)

  // loop through the lexemes
  while (lex < lexemes.length) {
    switch (state) {
      case 'start':
        // expecting either global array declarations or the main program commands
        if (lexemes[lex].content === 'DEF') {
          throw error('Subroutines must be defined after program "END".', lexemes[lex])
        }
        state = (lexemes[lex].content === 'DIM') ? 'dim' : 'prog'
        break

      case 'dim':
        // expecting global array declarations
        // TODO
        throw error('The Turtle System E does not yet support arrays. This feature will be added soon. In the meantime, please use the Turtle System D to compile your program.', lexemes[lex])

      case 'prog':
        // expecting program commands or "END"

        // definitions are not allowed
        if (lexemes[lex].content === 'DIM') {
          throw error('"DIM" commands must occur at the top of the program.', lexemes[lex])
        }
        if (lexemes[lex].content === 'PRIVATE') {
          throw error('Private variables cannot be defined in the main program.', lexemes[lex])
        }
        if (lexemes[lex].content === 'LOCAL') {
          throw error('Local variables cannot be defined in the main program.', lexemes[lex])
        }
        if (lexemes[lex].content === 'DEF') {
          throw error('Subroutines must be defined after program "END".', lexemes[lex])
        }

        // 'END' indicates the end of the main program
        if (lexemes[lex].content === 'END') {
          inProgram = false
          lex = next(lexemes, lex)
          state = 'end'
        } else {
          // otherwise make a note of any variables ...
          if (lexemes[lex].type === 'identifier' && lexemes[lex + 1] && lexemes[lex + 1].content === '=') {
            if (!exists(routines[0], lexemes[lex].content)) {
              variable = factory.variable(lexemes[lex], routines[0], false)
              variable.fulltype = varFulltype(lexemes[lex].content)
              routines[0].variables.push(variable)
            }
          }
          // ... and add the lexeme to the main program and move on
          routines[0].lexemes.push(lexemes[lex])
          lex += 1
        }
        break

      case 'end':
        // expecting nothing, or the start of a new subroutine
        if (lexemes[lex]) {
          // if there's something, it must be 'DEF'
          if (lexemes[lex].content === 'DEF') {
            lex += 1
            state = 'def'
          } else {
            // anything else is an error
            if (routine.index === 0) {
              throw error('No program text can appear after program "END" (except subroutine definitions).', lexemes[lex])
            }
            throw error('No program text can appear after subroutine "END" (except further subroutine definitions).', lexemes[lex])
          }
        }
        break

      case 'def':
        // expecting subroutine name
        if (!lexemes[lex]) {
          throw error('"DEF" must be followed by a valid procedure or function name. (Procedure names must begin with "PROC", and function names must begin with "FN".)', lexemes[lex - 1])
        }
        if (!subType(lexemes[lex].content)) {
          throw error('"DEF" must be followed by a valid procedure or function name. (Procedure names must begin with "PROC", and function names must begin with "FN".)', lexemes[lex])
        }

        // create the subroutine and add it to the routine arrays
        routine = factory.subroutine(lexemes[lex].content, subType(lexemes[lex].content), routines[0])
        routine.index = routines.length
        routines.push(routine)
        routines[0].subroutines.push(routine)

        // set flags
        if (routine.type === 'procedure') {
          inProcedure = true
        } else {
          inFunction = true
          // add function return variable
          variable = factory.variable({ content: '!result' }, routine)
          variable.fulltype = varFulltype(lexemes[lex].content)
          routine.variables.push(variable)
          routine.returns = variable.fulltype.type
        }

        // expecting parameters, variables, or the start of the subroutine statements
        if (!lexemes[lex + 1]) {
          throw error('No statements found after subroutine declaration.', lexemes[lex])
        }
        if (lexemes[lex + 1].content === '(') {
          // expecting parameters
          lex += 2
          state = 'parameters'
        } else {
          // expecting variables or subroutine statements on a new line
          lex = next(lexemes, lex)
          state = 'crossroads'
        }
        break

      case 'parameters':
        // expecting a parameter name; but check for 'RETURN' first (indicating a reference parameter)
        if (lexemes[lex] && lexemes[lex].content === 'RETURN') {
          byref = true
          lex += 1
        } else {
          byref = false
        }

        // now we're definitely expecting a parameter name
        if (!lexemes[lex]) {
          throw error('Parameter name expected.', lexemes[lex - 1])
        }

        // error checking
        if (lexemes[lex].type === 'turtle') {
          throw error('{lex} is the name of a Turtle property, and cannot be used as a parameter name.', lexemes[lex])
        }
        if (lexemes[lex].type !== 'identifier') {
          throw error('{lex} is not a valid parameter name.', lexemes[lex])
        }
        if (exists(routine, lexemes[lex].content)) {
          throw error('{lex} is already a parameter for this subroutine.', lexemes[lex])
        }

        // otherwise create the variable and add it to the routine
        variable = factory.variable(lexemes[lex], routine, byref)
        variable.fulltype = varFulltype(lexemes[lex].content)
        routine.parameters.push(variable)
        routine.variables.push(variable)
        lex += 1

        // now expecting comma or closing bracket
        if (!lexemes[lex]) {
          throw error('Closing bracket needed after parameters.', lexemes[lex - 1])
        }
        if (lexemes[lex].type === 'identifier') {
          throw error('Comma needed after parameter.', lexemes[lex])
        }
        if (lexemes[lex].content === ')') {
          if (!lexemes[lex + 1]) {
            throw error('Subroutine definition must be followed by some commands.', lexemes[lex - 1])
          }
          lex = next(lexemes, lex)
          state = 'crossroads'
        } else {
          if (lexemes[lex].content !== ',') {
            throw error('Closing bracket needed after parameters.', lexemes[lex])
          }
          lex += 1
        }
        break

      case 'crossroads':
        // expecting variable declarations, or the start of the subroutine commands
        if (!lexemes[lex]) {
          throw error('Subroutine definition must be followed by some commands.', lexemes[lex - 1])
        }
        switch (lexemes[lex].content) {
          case 'DIM':
            throw error('"DIM" statements can only occur within the main program.', lexemes[lex])
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

      case 'private': // fallthrough
      case 'local':
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
        if (exists(routine, lexemes[lex].content)) {
          throw error('{lex} is already a variable in the current scope.', lexemes[lex])
        }

        // create the variable and add it to the routine
        if (state === 'private') {
          variable = factory.variable(lexemes[lex], routines[0])
          variable.fulltype = varFulltype(lexemes[lex].content)
          variable.private = routine // flag the variable as private to this routine
          routines[0].variables.push(variable)
        } else {
          variable = factory.variable(lexemes[lex], routine)
          variable.fulltype = varFulltype(lexemes[lex].content)
          routine.variables.push(variable)
        }

        // expecting a comma, or the rest of the subroutine
        if (lexemes[lex + 1] && lexemes[lex + 1].content === ',') {
          lex += 2 // move past the comma; stay here on the next loop
        } else {
          if (!lexemes[lex + 1]) {
            if (routine.type === 'procedure') {
              throw error('Procedure must finish with "ENDPROC".', lexemes[lex])
            }
            throw error('Function must finish with "=expression".', lexemes[lex])
          }
          lex = next(lexemes, lex)
          state = 'crossroads' // move back to crossroads
        }
        break

      case 'subroutine':
        // expecting subroutine commands
        // DIMs only allowed in the main program
        if (lexemes[lex].content === 'DIM') {
          throw error('"DIM" commands can only occur within the main program. To declare a local or private array, use "LOCAL" or "PRIVATE" instead.', lexemes[lex])
        }

        // too late for PRIVATE or LOCAL variables to be declared
        if (lexemes[lex].content === 'PRIVATE') {
          throw error('Private variables must be declared at the start of the subroutine.', lexemes[lex])
        }
        if (lexemes[lex].content === 'LOCAL') {
          throw error('Local variables must be declared at the start of the subroutine.', lexemes[lex])
        }

        // next subroutine DEF must come after this subroutine has finished
        if (lexemes[lex].content === 'DEF') {
          throw error('The next subroutine must be defined after subroutine "ENDPROC".', lexemes[lex])
        }

        // check for undefined variables, and add them to the main program
        if (lexemes[lex].type === 'identifier' && lexemes[lex + 1] && lexemes[lex + 1].content === '=') {
          if (!exists(routines[0], lexemes[lex].content) && !exists(routine, lexemes[lex].content)) {
            variable = factory.variable(lexemes[lex], routines[0])
            variable.fulltype = varFulltype(lexemes[lex].content)
            routines[0].variables.push(variable)
          }
        }

        // now expecting "ENDPROC", "=<expression>", or subroutine commands
        if (lexemes[lex].content === 'ENDPROC') {
          // end of procedure
          if (routine.type === 'procedure') {
            lex = next(lexemes, lex)
            inProcedure = false
            state = 'end'
          } else {
            throw error('Function must end with "=&lt;expression&gt;", not "ENDPROC".', lexemes[lex])
          }
        } else if (lexemes[lex].content === '=' && lexemes[lex - 1].type === 'NEWLINE') {
          // end of function
          if (routine.type === 'function') {
            routine.lexemes.push(lexemes[lex])
            lex += 1
            state = 'result'
          } else {
            throw error('Procedure must end with "ENDPROC", not "=&lt;expression&gt;".', lexemes[lex])
          }
        } else {
          // subroutine commands
          routine.lexemes.push(lexemes[lex])
          lex += 1
        }
        break

      case 'result':
        if (!lexemes[lex]) {
          throw error('Function return value must be specified.', lexemes[lex - 1])
        }
        while (lexemes[lex] && lexemes[lex].type !== 'NEWLINE') {
          routine.lexemes.push(lexemes[lex])
          lex += 1
        }
        lex = next(lexemes, lex - 1)
        inFunction = false
        state = 'end'
        break
    }
  }

  // final error checking
  if (inProgram) {
    throw error('Program must finish with "END".', lexemes[lex - 1])
  }
  if (inProcedure) {
    throw error('Procedure must finish with "ENDPROC".', lexemes[lex - 1])
  }
  if (inFunction) {
    throw error('Function must finish with "=expression".', lexemes[lex - 1])
  }

  // return the routines array
  return routines
}

// check for a new line and move past it
const next = (lexemes, lex) => {
  if (lexemes[lex + 1] && lexemes[lex + 1].type !== 'NEWLINE') {
    throw error('Statement must be on a new line.', lexemes[lex + 1])
  }
  return lex + 2
}

// check if a routine contains a variable of a given name
const exists = (routine, string) =>
  routine.variables.some((x) => ((x.name || x.names.basic) === string))

// get the fulltype of a variable from its name
const varFulltype = string => {
  const type = string.slice(-1) === '$' ? 'string' : 'boolint'
  const length = type === 'boolint' ? 0 : 34
  return factory.fulltype(type, length)
}

// get the type of a subroutine from its name
const subType = (string) => {
  if (string.slice(0, 4) === 'PROC') return 'procedure'
  if (string.slice(0, 2) === 'FN') return 'function'
  return false
}
