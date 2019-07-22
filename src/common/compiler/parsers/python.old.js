/*
Parser for Turtle Python - lexemes go in, array of routines comes out the first element in the
array is the main PROGRAM object.

Look at the factory module to see what the PROGRAM object (and its components) look like.

this analyses the structure of the program, and builds up lists of all the constants, variables,
and subroutines (with their variables and parameters) - lexemes for the program (and any
subroutine) code themselves are just stored for subsequent handling by the pcoder
*/
import error from '../tools/error'
import * as find from '../tools/find'
import * as factory from './factory/factory'

export default (lexemes) => {
  const routines = [] // array of routines to be returned (0 being the main program)
  const routineStack = [] // stack of routines
  let lex = 0 // index of current lexeme
  let routine // the current routine
  let state = 'crossroads'

  // setup program
  routine = factory.program('!', 'Python')
  routines.push(routine)
  routineStack.push(routine)

  // loop through the lexemes
  while (lex < lexemes.length) {
    switch (state) {
      case 'crossroads':
        // expecting 'global', 'nonlocal', 'def', or routine commands
        if (!lexemes[lex]) return routines

        if (!routine.indent) {
          // set the base indent for this routine from the current lexeme
          routine.indent = lexemes[lex].offset
        } else {
          // otherwise check it matches the base indent
          if (lexemes[lex].offset < routine.indent) {
            throw error('There are not enough spaces before {lex}.', lexemes[lex])
          }
          if (lexemes[lex].offset > routine.indent) {
            throw error('There are too many spaces before {lex}.', lexemes[lex])
          }
        }

        // do different things depending on the lexeme
        switch (lexemes[lex].content) {
          // global variable declarations
          case 'global':
            lex += 1
            state = 'global'
            break

          // nonlocal variable definitions
          case 'nonlocal':
            lex += 1
            state = 'nonlocal'
            break

          // subroutine definitions
          case 'def':
            lex += 1
            state = 'def'
            break

          // anything else
          default:
            state = 'commands'
            break
        }
        break

      case 'global':
        // expecting comma separated list of global variables on the same line
        // error checking
        if (routine.index === 0) {
          throw error('Global variables are only allowed in subroutines.', lexemes[lex])
        }
        if (routine.subroutines.length > 0) {
          throw error('Global variables must be declared before any subroutine definitions.', lexemes[lex])
        }
        ({ lex, state } = globals(lexemes, lex, routine))
        break

      case 'nonlocal':
        // expecting comma separated list of nonlocal variables
        // error checking
        if (routine.index === 0) {
          throw error('Nonlocal variables are only allowed in subroutines.', lexemes[lex])
        }
        if (routine.subroutines.length > 0) {
          throw error('Nonlocal variables must be declared before any subroutine definitions.', lexemes[lex])
        }
        ({ lex, state } = nonlocals(lexemes, lex, routine))
        break

      case 'def':
        // expecting subroutine name, followed by open bracket
        ({ lex, routine, state } = def(lexemes, lex, routine))
        routineStack.push(routine)
        break

      case 'parameters':
        // expecting a comma separated list of parameters, then a closing bracket and a colon
        ({ lex, state } = parameters(lexemes, lex, routine))
        break

      case 'commands':
        // expecting routine commands
        ({ lex, state } = commands(lexemes, lex, routine))
        if (routine.index === null) {
          routine.index = routines.length
          routines.push(routineStack.pop())
          routine = routineStack[routineStack.length - 1]
        }
        break
    }
  }

  // return the routines array
  return routines
}

// globals (expecting comma separated list of globals on the same line)
const globals = (lexemes, lex, routine) => {
  // error checking
  if (!lexemes[lex]) {
    throw error('"global" must be followed by an identifier.', lexemes[lex - 1])
  }
  if (lexemes[lex].line !== lexemes[lex - 1].line) {
    throw error('Global variable declarations must be on a single line.', lexemes[lex])
  }

  // loop through grabbing the variable names and creating the global variables as necessary
  while (lexemes[lex] && lexemes[lex].line === lexemes[lex - 1].line) {
    // error checking
    if (lexemes[lex].type !== 'turtle' && lexemes[lex].type !== 'identifier') {
      throw error('{lex} is not a valid variable name.', lexemes[lex])
    }
    if (routine.globals.indexOf(lexemes[lex].content) > -1) {
      throw error('Global variable {lex} has already been declared.', lexemes[lex])
    }

    // add the variable name to the routine's array of globals
    routine.globals.push(lexemes[lex].content)

    // create the global variable if it doesn't already exist
    const program = find.program(routine)
    if (lexemes[lex].type !== 'turtle' && !program.variables.some(v => v.name === lexemes[lex].content)) {
      program.variables.push(factory.variable(lexemes[lex], program))
    }

    // new line gets us out of here
    if (lexemes[lex + 1].line > lexemes[lex].line) {
      return { lex: lex + 1, state: 'crossroads' }
    }

    // otherwise check for a comma, increment past it, and continue with the loop
    if (!lexemes[lex + 1] || lexemes[lex + 1].content !== ',') {
      throw error('Comma missing after global variable declaration.', lexemes[lex])
    }
    if (!lexemes[lex + 2]) {
      throw error('Expected more global variable declarations after comma.', lexemes[lex + 1])
    }
    if (lexemes[lex + 2].line > lexemes[lex + 1].line) {
      throw error('Global variable declarations must be on a single line.', lexemes[lex + 2])
    }
    lex += 2
  }

  return { lex, state: 'crossroads' }
}

// nonlocals (expecting comma separated list of nonlocals on the same line
const nonlocals = (lexemes, lex, routine) => {
  // error checking
  if (!lexemes[lex]) throw error('"local" must be followed by an identifier.', lexemes[lex - 1])
  if (lexemes[lex].line > lexemes[lex - 1].line) {
    throw error('Nonlocal variable definitions must be on a single line.', lexemes[lex])
  }
  if (routine.nonlocals.indexOf(lexemes[lex].content) > -1) {
    throw error('Nonlocal variable {lex} has already been defined.', lexemes[lex])
  }

  // loop through grabbing the variable names
  while (lexemes[lex] && lexemes[lex].line === lexemes[lex - 1].line) {
    if (lexemes[lex].type === 'turtle') {
      throw error('Turtle variables are global, not nonlocal.', lexemes[lex])
    }
    if (lexemes[lex].type !== 'identifier') {
      throw error('{lex} is not a valid variable name.', lexemes[lex])
    }
    if (routine.nonlocals.indexOf(lexemes[lex].content) > -1) {
      throw error('Nonlocal variable {lex} has already been declared.', lexemes[lex])
    }

    // add the variable name to the routine's array of nonlocals
    routine.nonlocals.push(lexemes[lex].content)

    // new line gets us out of here
    if (lexemes[lex + 1].line > lexemes[lex].line) {
      return { lex: lex + 1, state: 'crossroads' }
    }

    // otherwise check for a comma, increment past it, and continue with the loop
    if (!lexemes[lex + 1] || lexemes[lex + 1].content !== ',') {
      throw error('Comma missing after nonlocal variable declaration.', lexemes[lex])
    }
    if (!lexemes[lex + 2]) {
      throw error('Expected more nonlocal variable declarations after comma.', lexemes[lex + 1])
    }
    if (lexemes[lex + 2].line > lexemes[lex + 1].line) {
      throw error('Nonlocal variable declarations must be on a single line.', lexemes[lex + 2])
    }
    lex += 2
  }

  return { lex, state: 'crossroads' }
}

// def (expecting subroutine name)
const def = (lexemes, lex, routine) => {
  // error checking
  if (!lexemes[lex]) throw error('"def" must be followed by an identifier.', lexemes[lex - 1])
  if (lexemes[lex - 1].line !== lexemes[lex].line) {
    throw error('Subroutine name must be on the same line as "def".', lexemes[lex])
  }
  if (lexemes[lex].type === 'turtle') {
    throw error('Subroutine cannot have the name of a global Turtle variable.', lexemes[lex])
  }
  if (lexemes[lex].type !== 'identifier') {
    throw error('{lex} is not a valid subroutine name.', lexemes[lex])
  }
  if (subroutineNameExists(lexemes[lex].content, routine)) {
    throw error('{lex} is already the name of a subroutine or variable in the current scope.', lexemes[lex])
  }

  // otherwise ok - create new routine with current routine as its parent
  routine = factory.subroutine(lexemes[lex].content, 'procedure', routine)
  routine.parent.subroutines.push(routine)

  // expecting opening bracket on the same line next
  if (!lexemes[lex + 1]) {
    throw error('Subroutine definition must be followed by an open bracket.', lexemes[lex - 1])
  }
  if (lexemes[lex + 1].content !== '(') {
    throw error('Subroutine definition must be followed by an open bracket.', lexemes[lex])
  }
  if (lexemes[lex].line !== lexemes[lex + 1].line) {
    throw error('Open bracket must be on the same line as the subroutine definition.', lexemes[lex])
  }

  return { lex: lex + 2, routine, state: 'parameters' }
}

// parameters
const parameters = (lexemes, lex, routine) => {
  // error checking
  if (!lexemes[lex]) {
    throw error('Expecting parameter definition or closing bracket.', lexemes[lex - 1])
  }

  // right bracket means the end of the list
  if (lexemes[lex].content === ')') {
    // error checking
    if (lexemes[lex - 1].line !== lexemes[lex].line) {
      throw error('Closing bracket after parameters cannot be on a new line.', lexemes[lex])
    }
    if (!lexemes[lex + 1]) {
      throw error('Subroutine definition must be followed by a colon.', lexemes[lex])
    }
    if (lexemes[lex + 1].content !== ':') {
      throw error('Subroutine definition must be followed by a colon.', lexemes[lex + 1])
    }
    if (lexemes[lex + 1].line > lexemes[lex].line) {
      throw error('Colon following subroutine definition cannot be on a new line.', lexemes[lex + 1])
    }
    if (!lexemes[lex + 2]) {
      throw error('No commands found following subroutine declaration.', lexemes[lex + 1])
    }
    if (lexemes[lex + 2].line === lexemes[lex + 1].line) {
      throw error('Subroutine commands must be on a new line.', lexemes[lex])
    }

    return { lex: lex + 2, state: 'crossroads' }
  }

  // otherwise expecting a new identifier on the same line
  if (lexemes[lex].type === 'turtle') {
    throw error('{lex} is the name of a predefined global Turtle variable.', lexemes[lex])
  }
  if (lexemes[lex].type !== 'identifier') {
    throw error('{lex} is not a valid identifier.', lexemes[lex])
  }
  if (lexemes[lex - 1].line !== lexemes[lex].line) {
    throw error('Parameter declaration cannot be on a new line.', lexemes[lex])
  }
  if (routine.parameters.some(x => x.name === lexemes[lex].content)) {
    throw error('{lex} is already the name of a parameter for this subroutine.', lexemes[lex])
  }

  // otherwise ok; create the parameter and add it to the current routine
  let variable = factory.variable(lexemes[lex], routine)
  routine.parameters.push(variable)
  routine.variables.push(variable)

  // now see where to go depending on what's next (expecting comma or closing bracket)
  if (!lexemes[lex + 1]) {
    throw error('Closing bracket missing after parameter declarations.', lexemes[lex])
  }
  if (lexemes[lex + 1].type === 'turtle' || lexemes[lex + 1].type === 'identifier') {
    throw error('Comma missing between parameters.', lexemes[lex + 1])
  }
  if (lexemes[lex + 1].content === ',') {
    if (!lexemes[lex + 2]) {
      throw error('Expected parameter declaration after comma.', lexemes[lex + 1])
    }
    if (lexemes[lex + 2].content === ')') {
      throw error('Parameter list cannot end with a comma.', lexemes[lex + 1])
    }
    return { lex: lex + 2, state: 'parameters' }
  }
  if (lexemes[lex + 1].content === ')') {
    return { lex: lex + 1, state: 'parameters' }
  }

  throw error('py1parser43', 'parsNoCommaOrBracket', lexemes[lex])
}

// commands
const commands = (lexemes, lex, routine) => {
  let variable
  while (lexemes[lex] && (lexemes[lex].offset >= routine.indent)) {
    // maybe deal with return value
    if (lexemes[lex].content === 'return') {
      if (routine.index === 0) throw error('cmdMainReturn', lexemes[lex])
      if (routine.name === 'main') throw error('cmdMainSubReturn', lexemes[lex])
      if (routine.type === 'function') throw error('cmdRepeatReturn', lexemes[lex])
      routine.type = 'function'
      variable = factory.variable(lexemes[lex], routine, false)
      routine.variables.unshift(variable)
    }
    // maybe add a variable
    if (isNewLocalAssignment(routine, lexemes, lex)) {
      // create the variable and add it to the appropriate routine
      variable = factory.variable(lexemes[lex], routine, false)
      routine.variables.push(variable)
    }

    // in any case, add the lexeme to the routine and move past it
    routine.lexemes.push(lexemes[lex])
    lex += 1
  }
  return { lex, state: 'crossroads' }
}

// check if subroutine name has already been used
const subroutineNameExists = (name, routine) => {
  if (routine.index === 0) {
    return routine.subroutines.some(x => x.name === name)
  }
  return routine.subroutines.some(x => x.name === name) ||
    routine.globals.indexOf(name) > -1 ||
    routine.nonlocals.indexOf(name) > -1
}

// check if lexeme is a new local variable assignment
const isNewLocalAssignment = (routine, lexemes, lex) => {
  // not even close
  if (lexemes[lex].type !== 'identifier') return false

  // can't be an assignment
  if (!lexemes[lex + 1]) return false
  if ((lexemes[lex + 1].content !== '=') && (lexemes[lex + 1].content !== 'in')) return false

  // is an assignent, but variable is declared global or nonlocal
  if (routine.globals.indexOf(lexemes[lex].content) > -1) return false
  if (routine.nonlocals.indexOf(lexemes[lex].content) > -1) return false

  // is a local assignment, but variable has already been created
  if (find.variable(routine, lexemes[lex].content, 'Python')) return false

  // otherwise yes
  return true
}
