/*
*/
import * as factory from './factory'
import error from '../../tools/error'
import * as find from '../../tools/find'

// look for "def identifier[(pars)][-> return type]:"
// return program object and index of the next lexeme
export const subroutine = (lexemes, lex, parent) => {
  // identifier error checking
  if (!lexemes[lex]) {
    throw error('\'def\' must be followed by an identifier.', lexemes[lex - 1])
  }
  if (lexemes[lex].type === 'turtle') {
    throw error('Subroutine cannot be given the name of a Turtle attribute.', identifier)
  }
  if (lexemes[lex].type !== 'identifier') {
    throw error('{lex} is not a valid subroutine name.', lexemes[lex])
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
  result = parameters(lexemes, lex + 2)

  // return the program object and index of the next lexeme
  return { lex: lex + 2, program: factory.program(identifier.content, 'Pascal') }
}

// parameter/variable definition
export const variable = (lexemes, lex, routine, parameter = false) => {
}

// look for "identifier[(parameters)]"
export const subroutine = (lexemes, lex, type, parent) => {
  const identifier = lexemes[lex]

  let subroutine, result

  // initial error checking
  if (!identifier) {
    throw error('No subroutine name found.', lexemes[lex - 1])
  }
  if (identifier.type === 'turtle') {
    throw error('{lex} is the name of a predefined Turtle property, and cannot be used as a subroutine name.', identifier)
  }
  if (identifier.type !== 'identifier') {
    throw error('{lex} is not a valid subroutine name.', identifier)
  }
  if (identifier.content === find.program(parent).name) {
    throw error('Subroutine name {lex} is already the name of the program.', identifier)
  }
  if (find.custom(parent, identifier.content, 'Pascal')) {
    throw error('{lex} is already the name of a subroutine in the current scope.', identifier)
  }

  // create the routine object
  subroutine = factory.subroutine(identifier.content, type, parent)

  // add result variable to functions
  if (type === 'function') {
    subroutine.variables.push(factory.variable({ content: 'result' }, subroutine, false))
  }

  // move on
  lex += 1
  if (lexemes[lex]) {
    // check for parameter declarations
    if (lexemes[lex].content === '(') {
      result = parameters(lexemes, lex + 1, subroutine)
      subroutine.parameters = result.parameters
      subroutine.variables = subroutine.variables.concat(result.parameters)
      lex = result.lex
    }

    // if it's a function, look for colon and return type
    if (type === 'function') {
      if (!lexemes[lex]) {
        throw error('Function must be followed by a colon, the the return type (integer, boolean, char, or string).', lexemes[lex - 1])
      }
      if (lexemes[lex].content !== ':') {
        throw error('Function must be followed by a colon, the the return type (integer, boolean, char, or string).', lexemes[lex])
      }
      result = fulltype(lexemes, lex + 1, subroutine)
      if (result.fulltype.type === 'array') throw error('Functions cannot return arrays.', lexemes[result.lex])
      subroutine.variables[0].fulltype = result.fulltype
      subroutine.returns = result.fulltype.type
      lex = result.lex
    }
  }

  // return the next lexeme index and the routine object
  return { lex, subroutine }
}

// look for "[var] identifier1[, identifier2, ...]: <fulltype>"; return array of parameters and
// index of the next lexeme
const parameters = (lexemes, lex, routine) => {
  let parameters = []
  let result

  let more = true
  while (more) {
    result = (lexemes[lex] && lexemes[lex].content === 'var')
      ? variables(lexemes, lex + 1, routine, true, true)
      : variables(lexemes, lex, routine, true, false)
    parameters = parameters.concat(result.variables)
    lex = result.lex
    switch (lexemes[lex].content) {
      case ';':
        while (lexemes[lex].content === ';') lex = lex + 1
        break

      case ')':
        lex = lex + 1
        more = false
        break

      default:
        // anything else is an error
        throw error('Parameter declarations must be followed by a closing bracket ")".', lexemes[lex])
    }
  }

  return { lex, parameters }
}

// check if a string is already the name of a variable or constant in a routine
const isDuplicate = (routine, name) =>
  routine.variables.concat(routine.constants).some((x) => x.name === name)
