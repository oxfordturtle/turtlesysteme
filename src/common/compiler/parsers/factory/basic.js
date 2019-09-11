/*
*/
import * as factory from './factory'
import error from '../../tools/error'
import evaluate from '../../tools/evaluate'
import * as find from '../../tools/find'

// create main program object
export const program = name =>
  factory.program(name, 'BASIC')

// create subroutine object
export const subroutine = (name, type, parent) =>
  factory.subroutine(name, type, parent)

// create constant object
export const constant = (lexemes, lex, routine) => {
  const [identifier, assignment, next] = lexemes.slice(lex, lex + 3)

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
  if (assignment.content !== '=' || !next) {
    throw error('Constant must be assigned a value.', assignment)
  }

  // determine constant type based on name
  const type = identifier.content.slice(-1) === '$' ? 'string' : 'boolint'

  // get all the lexemes up to the first line break
  const valueLexemes = []
  lex += 1
  while (lexemes[lex + 1] && lexemes[lex + 1].type !== 'NEWLINE') {
    valueLexemes.push(lexemes[lex + 1])
    lex += 1
  }
  let value = evaluate(identifier, valueLexemes, routine)
  switch (typeof value) {
    case 'number':
      if (type === 'string') {
        throw error('String constant cannot be assigned an integer value.', identifier)
      }
      break

    case 'string':
      if (type === 'boolint') {
        throw error('Integer constant cannot be assigned a string value.', identifier)
      }
      break
  }

  // return the constant object and index of the next lexeme
  return { lex, constant: factory.constant(identifier.content, type, value) }
}

// create variable (and parameter) object
export const variable = (lexeme, routine, byref = false) =>
  factory.variable(lexeme, routine, byref)

export const fulltype = (type, length = null, start = null, fulltype = null) =>
  factory.fulltype(type, length, start, fulltype)
