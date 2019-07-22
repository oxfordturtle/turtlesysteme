/*
Parser for Turtle Python - lexemes go in, array of routines comes out the first element in the
array is the main PROGRAM object.

Look at the factory module to see what the PROGRAM object (and its components) look like.

this analyses the structure of the program, and builds up lists of all the variables and
subroutines (with their variables and parameters) - lexemes for the program (and any
subroutine) code themselves are just stored for subsequent handling by the pcoder
*/
import error from '../tools/error'
import * as factory from './factory/factory'
import * as find from '../tools/find'

export default (lexemes) => {
  const routines = [] // array of routines to be returned (0 being the main program)
  const routineStack = [] // stack of routines
  let lex = 0 // index of current lexeme
  let routine // the current routine
  let result
  let state = 'crossroads'

  // setup program
  routine = factory.program('!', 'Python')
  routines.push(routine)
  routineStack.push(routine)

  // loop through the lexemes
  while (lex < lexemes.length) {
    switch (state) {
      case 'crossroads':
        if (lexemes[lex].type === 'identifier' || lexemes[lex].type === 'turtle') {
          state = 'identifier'
        } else if (lexemes[lex].type === 'INDENT') {
          state = 'indent'
        } else if (lexemes[lex].type === 'DEDENT') {
          state = 'dedent'
        } else if (lexemes[lex].content === 'def') {
          state = 'def'
        } else if (lexemes[lex].content === 'global') {
          state = 'global'
        } else if (lexemes[lex].content === 'nonlocal') {
          state = 'nonlocal'
        } else {
          routine.lexemes.push(lexemes[lex])
          lex += 1
        }
        break

      case 'identifier':
        if ((lexemes[lex + 1] && lexemes[lex + 1].content === ':') && (lexemes[lex + 2] && lexemes[lex + 2].type === 'identifier')) {
          result = typedVariable(lexemes, lex, routine)
          routine.variables.push(result.variable)
          while (lex < result.lex) {
            routine.lexemes.push(lexemes[lex])
            lex += 1
          }
        } else if (lexemes[lex + 1] && lexemes[lex + 1].content === 'in') {
          if (lexemes[lex].type === 'identifier') {
            if (!declared(lexemes[lex].content, routine)) {
              result = factory.variable(lexemes[lex], routine)
              result.fulltype = factory.fulltype('integer')
              routine.variables.push(result)
            }
            routine.lexemes.push(lexemes[lex])
            lex += 1
          }
        } else {
          routine.lexemes.push(lexemes[lex])
          lex += 1
        }
        state = 'crossroads'
        break

      case 'indent':
        routine.lexemes.push(lexemes[lex])
        lex += 1
        state = 'crossroads'
        break

      case 'dedent':
        const indents = routine.lexemes.filter(x => x.type === 'INDENT').length
        const dedents = routine.lexemes.filter(x => x.type === 'DEDENT').length
        if (indents === dedents) {
          state = 'end'
        } else {
          routine.lexemes.push(lexemes[lex])
          state = 'crossroads'
        }
        lex += 1
        break

      case 'def':
        result = subroutine(lexemes, lex + 1, routine)
        routine.subroutines.push(result.subroutine)
        routineStack.push(result.subroutine)
        routine = result.subroutine
        lex = result.lex
        if (!lexemes[lex]) {
          throw error('No statements found after subroutine definition.', lexemes[lex - 1])
        }
        if (lexemes[lex].type !== 'NEWLINE') {
          throw error('Subroutine definition must be followed by a line break.', lexemes[lex])
        }
        lex += 1
        if (!lexemes[lex]) {
          throw error('No statements found after subroutine definition.', lexemes[lex - 1])
        }
        if (lexemes[lex].type !== 'INDENT') {
          throw error('Indent needed after subroutine definition.', lexemes[lex])
        }
        lex += 1
        state = 'crossroads'
        break

      case 'global': // fallthrough
      case 'nonlocal':
        const names = (state === 'global') ? routine.globals : routine.nonlocals
        if (routine.index === 0) {
          throw error('Main program cannot include any global/nonlocal statements.', lexemes[lex])
        }
        lex += 1
        if (lexemes[lex].type === 'NEWLINE') {
          throw error('Global/nonlocal statements must be on one line.', lexemes[lex - 1])
        }
        while (lexemes[lex] && lexemes[lex].type !== 'NEWLINE') {
          if (lexemes[lex].type !== 'turtle' && lexemes[lex].type !== 'identifier') {
            throw error('{lex} is not a valid variable name.', lexemes[lex])
          }
          names.push(lexemes[lex].content)
          lex += 1
          if (lexemes[lex].content === ',') lex += 1
        }
        if (lexemes[lex].type === 'NEWLINE') lex += 1
        state = 'crossroads'
        break

      case 'end':
        routine.index = routines.length
        routines.push(routineStack.pop())
        routine = routineStack[routineStack.length - 1]
        state = 'crossroads'
        break
    }
  }

  // return the routines array
  return routines
}

// check if variable name has been declared as local, global, or nonlocal
const declared = (name, routine) =>
  (routine.globals && routine.globals.includes(name)) ||
    (routine.nonlocals && routine.nonlocals.includes(name)) ||
    routine.variables.some(x => x.name === name)

// look for "def identifier[(pars)][-> return type]:"
// return subroutine object and index of the next lexeme
const subroutine = (lexemes, lex, parent) => {
  // identifier error checking
  if (!lexemes[lex]) {
    throw error('"def" must be followed by an identifier.', lexemes[lex - 1])
  }
  if (lexemes[lex].type === 'turtle') {
    throw error('Subroutine cannot be given the name of a Turtle attribute.', lexemes[lex])
  }
  if (lexemes[lex].type !== 'identifier') {
    throw error('{lex} is not a valid subroutine name.', lexemes[lex])
  }
  if (find.custom(parent, lexemes[lex].content, 'Python')) {
    throw error('{lex} is already the name of a subroutine in the current scope.', lexemes[lex])
  }

  // define the subroutine
  const subroutine = factory.subroutine(lexemes[lex].content, 'procedure', parent)

  // open bracket error checking
  if (!lexemes[lex + 1]) {
    throw error()
  }
  if (lexemes[lex + 1].content !== '(') {
    throw error()
  }

  // parameters
  const result = parameters(lexemes, lex + 2, subroutine)
  lex = result.lex
  subroutine.parameters.push(...result.parameters)
  subroutine.variables.push(...result.parameters)

  // closing bracket error checking
  if (!lexemes[lex]) {
    throw error()
  }
  if (lexemes[lex].content !== ')') {
    throw error()
  }
  lex += 1

  // check for return type
  if (lexemes[lex] && lexemes[lex].content === '->') {
    subroutine.type = 'function'
    lex += 1
    if (!lexemes[lex]) {
      throw error()
    }
    const variable = factory.variable({ content: 'return' }, subroutine)
    variable.fulltype = fulltype(lexemes[lex])
    subroutine.returns = variable.fulltype.type
    subroutine.variables.unshift(variable)
    lex += 1
  }

  // check for colon
  if (!lexemes[lex]) {
    throw error()
  }
  if (lexemes[lex].content !== ':') {
    throw error()
  }

  // return the subroutine object and index of the next lexeme
  return { lex: lex + 1, subroutine }
}

// look for identifier: type
// return a variable and the index of the next lexeme
const typedVariable = (lexemes, lex, routine) => {
  // expecting identifier
  if (lexemes[lex].type === 'turtle') {
    throw error()
  }
  if (lexemes[lex].type !== 'identifier') {
    throw error()
  }

  // check for duplicate
  // ...

  // ok, create the variable and move on
  const variable = factory.variable(lexemes[lex], routine)
  lex += 1

  // expecting colon
  if (!lexemes[lex]) {
    throw error()
  }
  if (lexemes[lex].content !== ':') {
    throw error()
  }
  lex += 1

  // expecting bool|int|str
  if (!lexemes[lex]) {
    throw error()
  }
  variable.fulltype = fulltype(lexemes[lex])
  lex += 1

  // return the variable and the index of the next lexeme
  return { lex, variable }
}

// look for "identifier: type[, identifier: type ...])"; return array of parameters and
// index of the next lexeme
const parameters = (lexemes, lex, routine) => {
  const parameters = []
  let parameter = {}

  while (lexemes[lex] && lexemes[lex].content !== ')') {
    // error checking
    if (lexemes[lex].type === 'turtle') {
      throw error('Parameter name cannot be a Turtle property.', lexemes[lex])
    }
    if (lexemes[lex].type !== 'identifier') {
      throw error('{lex} is not a valid parameter name.', lexemes[lex])
    }
    if (parameters.some(x => x.name === lexemes[lex].content)) {
      throw error('{lex} is the name of another parameter.', lexemes[lex])
    }

    // create the parameter
    parameter = factory.variable(lexemes[lex], routine)

    // check for type
    lex += 1
    if (!lexemes[lex]) {
      throw error('Parameter name must be followed by ": <type>".', lexemes[lex - 1])
    }
    if (lexemes[lex].content !== ':') {
      throw error('Parameter name must be followed by ": <type>".', lexemes[lex - 1])
    }
    lex += 1
    if (!lexemes[lex]) {
      throw error('Parameter name must be followed by ": <type>".', lexemes[lex - 2])
    }
    parameter.fulltype = fulltype(lexemes[lex])

    // add the parameter
    parameters.push(parameter)
    lex += 1

    // comma check
    if (lexemes[lex]) {
      if (lexemes[lex].type === 'turtle' || lexemes[lex].type === 'identifier') {
        throw error('Comma missing between routine parameters.', lexemes[lex])
      }
      if (lexemes[lex].content === ',') lex += 1
    }
  }

  // return the parameters and the index of the next lexeme
  return { lex, parameters }
}

// get fulltype of variable
const fulltype = (lexeme) => {
  switch (lexeme.content) {
    case 'bool':
      return factory.fulltype('boolean')

    case 'int':
      return factory.fulltype('integer')

    case 'str':
      return factory.fulltype('string')

    default:
      throw error('{lex} is not a valid type specification (expecting "bool", "int", or "str").', lexeme)
  }
}
