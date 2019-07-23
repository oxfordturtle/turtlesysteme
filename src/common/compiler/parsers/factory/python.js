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
    throw error('Subroutine name must be followed by brackets.', lexemes[lex])
  }
  if (lexemes[lex + 1].content !== '(') {
    throw error('Subroutine name must be followed by brackets "()".', lexemes[lex + 1])
  }

  // parameters
  const result = parameters(lexemes, lex + 2, subroutine)
  lex = result.lex
  subroutine.parameters = subroutine.parameters.concat(result.parameters)
  subroutine.variables = subroutine.variables.concat(result.parameters)

  // parameters evaluation will stop at closing bracket or when we run out of lexemes;
  // so here we should check it was the former
  if (!lexemes[lex]) {
    throw error('Subroutine parameters must be followed by a closing bracket ")".', lexemes[lex - 1])
  }
  if (lexemes[lex].content !== ')') {
    throw error('Subroutine parameters must be followed by a closing bracket ")".', lexemes[lex])
  }
  lex += 1

  // check for return type
  if (lexemes[lex] && lexemes[lex].content === '->') {
    subroutine.type = 'function'
    lex += 1
    if (!lexemes[lex]) {
      throw error('Function arrow "->" must be followed by a return type specification.', lexemes[lex - 1])
    }
    const variable = factory.variable({ content: 'return' }, subroutine)
    variable.fulltype = getFulltype(lexemes[lex])
    subroutine.returns = variable.fulltype.type
    subroutine.variables.unshift(variable)
    lex += 1
  }

  // check for colon
  if (!lexemes[lex]) {
    throw error('Subroutine declaration must be followed by a colon ":".', lexemes[lex - 1])
  }
  if (lexemes[lex].content !== ':') {
    throw error('Subroutine declaration must be followed by a colon ":".', lexemes[lex])
  }

  // return the subroutine object and index of the next lexeme
  return { lex: lex + 1, subroutine }
}

// create a variable
export const variable = (lexeme, routine) =>
  factory.variable(lexeme, routine)

// create a variable full type
export const fulltype = (type) =>
  factory.fulltype(type)

// look for identifier: type
// return a variable and the index of the next lexeme
export const typedVariable = (lexemes, lex, routine) => {
  // expecting identifier
  if (lexemes[lex].type === 'turtle') {
    throw error('{lex} is the name of a Turtle variable, and cannot be used as a custom variable name.', lexemes[lex])
  }
  if (lexemes[lex].type !== 'identifier') {
    throw error('{lex} is not a valid variable name.', lexemes[lex])
  }

  // check for duplicate
  if (isDuplicate(routine, lexemes[lex].content)) {
    throw error('{lex} is already the name of a variable in the current scope.', lexemes[lex])
  }

  // ok, create the variable and move on
  const variable = factory.variable(lexemes[lex], routine)
  lex += 1

  // expecting colon
  if (!lexemes[lex]) {
    throw error('Variable must be followed by a colon ":" and a type specification.', lexemes[lex - 1])
  }
  if (lexemes[lex].content !== ':') {
    throw error('Variable must be followed by a colon ":" and a type specification.', lexemes[lex])
  }
  lex += 1

  // expecting bool|int|str
  if (!lexemes[lex]) {
    throw error('Variable must be given a type specification ("bool", "int", or "str").', lexemes[lex - 1])
  }
  variable.fulltype = getFulltype(lexemes[lex])
  lex += 1

  // return the variable and the index of the next lexeme
  return { lex, variable }
}

// look for "identifier: type[, identifier: type ...])"; return array of parameters and
// index of the next lexeme
const parameters = (lexemes, lex, routine) => {
  const parameters = []

  while (lexemes[lex] && lexemes[lex].content !== ')') {
    // check for parameter name and type
    let result = typedVariable(lexemes, lex, routine)

    // add the parameter
    parameters.push(result.variable)
    lex = result.lex

    // check what's next
    if (!lexemes[lex]) {
      throw error('Parameter list must be followed by a closing bracket ")".', lexemes[lex - 1])
    }
    if (lexemes[lex].type === 'NEWLINE') {
      throw error('Parameters must all be on one line.', lexemes[lex])
    }
    if (lexemes[lex].type === 'identifier' || lexemes[lex].type === 'turtle') {
      throw error('Parameters must be separated by commas.', lexemes[lex])
    }
    if (lexemes[lex].content === ',') {
      lex += 1
      if (!lexemes[lex]) {
        throw error('Expected parameter name after comma.', lexemes[lex - 1])
      }
      if (lexemes[lex].type === 'NEWLINE') {
        throw error('Parameters must all be on one line.', lexemes[lex])
      }
    }
  }

  // return the parameters and the index of the next lexeme
  return { lex, parameters }
}

// get fulltype of variable
const getFulltype = (lexeme) => {
  switch (lexeme.content) {
    case 'bool':
      return factory.fulltype('boolean')

    case 'int':
      return factory.fulltype('integer')

    case 'str':
      return factory.fulltype('string')

    default:
      throw error('{lex} is not a valid type specification (expected "bool", "int", or "str")', lexeme)
  }
}

// check if a string is already the name of a variable or constant in a routine
const isDuplicate = (routine, name) =>
  routine.variables.some((x) => x.name === name)
