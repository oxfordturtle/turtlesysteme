/*
*/
import * as factory from './factory'
import error from '../../tools/error'
import * as find from '../../tools/find'

// main program
export const program = () =>
  factory.program('!', 'Python')

// look for "def identifier[(pars)][-> return type]:"
// return subroutine object and index of the next lexeme
export const subroutine = (lexemes, lex, parent) => {
  // identifier error checking
  if (!lexemes[lex]) {
    throw error('\'def\' must be followed by an identifier.', lexemes[lex - 1])
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
  const subroutine = factory.subroutine(lexemes[lex], 'procedure', parent)

  // open bracket error checking
  if (!lexemes[lex + 1]) {
    throw error()
  }
  if (lexemes[lex + 1].content !== '(') {
    throw error()
  }

  // parameters
  const result = parameters(lexemes, lex + 2)
  lex = result.lex
  subroutine.parameters = result.parameters
  subroutine.variables = result.parameters

  // closing bracket error checking
  if (!lexemes[lex + 1]) {
    throw error()
  }
  if (lexemes[lex + 1].content !== ')') {
    throw error()
  }

  // check for return type
  if (lexemes[lex] && lexemes[lex].content === '->') {
    subroutine.type = 'function'
    lex += 1
    if (!lexemes[lex]) {
      throw error()
    }
    const variable = factory.variable({ content: 'return' }, subroutine)
    variable.fulltype = fulltype(lexemes[lex].content)
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

// create a variable
export const variable = (name, routine) =>
  factory.variable(name, routine)

// look for identifier: type
// return a variable and the index of the next lexeme
export const typedVariable = (lexemes, lex, routine) => {
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
  switch (lexemes[lex].content) {
    case 'bool':
      variable.fulltype = factory.fulltype('boolean')
      break

    case 'int':
      variable.fulltype = factory.fulltype('integer')
      break

    case 'str':
      variable.fulltype = factory.fulltype('string')
      break

    default:
      throw error()
  }
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
      throw error()
    }
    if (lexemes[lex].type !== 'identifier') {
      throw error()
    }
    if (isDuplicate(routine, lexemes[lex].content)) {
      throw error()
    }

    // create the parameter
    parameter = factory.variable(lexemes[lex].content, routine)

    // check for type
    lex += 1
    if (!lexemes[lex]) {
      throw error()
    }
    if (lexemes[lex].content !== ':') {
      throw error()
    }
    lex += 1
    if (!lexemes[lex]) {
      throw error()
    }
    parameter.fulltype = fulltype(lexemes[lex].content)

    // add the parameter and move on
    parameters.push(parameter)
    lex += 1
  }

  // return the parameters and the index of the next lexeme
  return { lex, parameters }
}

// get fulltype of variable
const fulltype = (content) => {
  switch (content) {
    case 'bool':
      return factory.fulltype('boolean')

    case 'int':
      return factory.fulltype('integer')

    case 'str':
      return factory.fulltype('string')

    default:
      throw error()
  }
}

// check if a string is already the name of a variable or constant in a routine
export const isDuplicate = (routine, name) =>
  routine.variables.concat(routine.constants).some((x) => x.name === name)
