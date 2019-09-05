/*
*/
import * as factory from './factory'
import error from '../../tools/error'
import * as find from '../../tools/find'

// create main program object
export const program = name =>
  factory.program(name, 'BASIC')

// create subroutine object
export const subroutine = (name, type, parent) =>
  factory.subroutine(name, type, parent)

// create constant object
export const constant = (lexemes, lex, routine) => {
  const [identifier, assignment, next1, next2] = lexemes.slice(lex, lex + 4)

  // basic error checking
  if (!identifier) {
    throw error('"CONST" must be followed by an identifier.', lexemes[lex - 1])
  }
  if (identifier.type === 'turtle') {
    throw error('{lex} is the name of a Turtle property, and cannot be used as a constant name.', lexemes[lex])
  }
  if (identifier.type !== 'identifier') {
    throw error('{lex} is not a valid constant name.', lexemes[lex])
  }
  if (find.program(routine).constants.some(x => x.name === identifier.content)) {
    throw error('Duplicate constant name {lex}.', lexemes[lex])
  }
  if (!assignment) {
    throw error('Constant must be assigned a value.', identifier)
  }
  if (assignment.content !== '=' || !next1) {
    throw error('Constant must be assigned a value.', assignment)
  }

  // determine constant type based on name
  const type = identifier.content.slice(-1) === '$' ? 'string' : 'boolint'

  // determine constant value
  let value
  if (next1.content === '-') {
    if (!next2) {
      throw error('Negation operator must be followed by an integer value.')
    }
    if (next2.type !== 'integer') {
      throw error('{lex} cannot be negated', next2)
    }
    if (type !== 'boolint') {
      throw error('Integer constants must have "%" at the end of their names.', identifier)
    }
    value = -next2.value
    lex = lex + 3
  } else {
    switch (next1.type) {
      case 'integer': // fallthrough
      case 'boolean':
        if (type !== 'boolint') {
          throw error('Integer and Boolean constants must have "%" at the end of their names.', identifier)
        }
        value = next1.value
        break

      case 'identifier':
        const hit = find.constant(routine, next1.content, 'BASIC') ||
          find.colour(next1.content, 'BASIC')
        if (hit) {
          if (type === 'boolint' && hit.type === 'string') {
            throw error('String constants must have "$" at the end of their names.', identifier)
          }
          if (type === 'string' && hit.type !== 'string') {
            throw error('Integet and Boolean constants must have "%" at the end of their names.', identifier)
          }
          value = hit.value
        } else {
          throw error('{lex} is not a valid constant value.')
        }
        break

      case 'string':
        if (type !== 'string') {
          throw error('String constants must have "$" at the end of their names.', identifier)
        }
        value = next1.value
        break

      default:
        throw error('{lex} is not a valid constant value.', next1)
    }
    lex = lex + 2
  }

  // return the constant object and index of the next lexeme
  return { lex, constant: factory.constant(identifier.content, type, value) }
}

// create variable (and parameter) object
export const variable = (lexeme, routine, byref = false) =>
  factory.variable(lexeme, routine, byref)

export const fulltype = (type, length = null, start = null, fulltype = null) =>
  factory.fulltype(type, length, start, fulltype)
