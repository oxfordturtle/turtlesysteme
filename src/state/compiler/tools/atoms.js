/**
 * compile the basic 'atoms' of a program, i.e. literal values, variable calls, function calls, etc.
 *
 * these functions are called by the molecules module - they are where the recursions in that
 * module ultimately bottom out
 */

const error = require('./error')
const find = require('./find')
const pcoder = require('./pcoder')

// literal value
const literal = (lexemes, lex, needed) => {
  const { type, value } = lexemes[lex]

  // check this type is ok (will throw an error if not)
  error.check(needed, type, 'atoms00', lexemes[lex])

  // return the stuff
  return (type === 'char' && needed === 'string')
    ? { type, lex: lex + 1, pcode: [pcoder.loadLiteralValue(type, value), pcoder.applyOperator('ctos')] }
    : { type, lex: lex + 1, pcode: [pcoder.loadLiteralValue(type, value)] }
}

// input keycode or query
const input = (lexemes, lex, needed, language) => {
  const hit = find.input(lexemes[lex].content, language)

  if (hit) {
    // check the type is ok (will throw an error if not)
    error.check(needed, hit.type, 'atoms01', lexemes[lex])

    // return the stuff
    return { type: 'integer', lex: lex + 1, pcode: [pcoder.loadInputValue(hit)] }
  }
}

// constant
const constant = (routine, lex, needed, language) => {
  const { lexemes } = routine
  const hit = find.constant(routine, lexemes[lex].content, language)

  if (hit) {
    // check the type is ok (will throw an error if not)
    error.check(needed, hit.type, 'atoms02', lexemes[lex])

    // return the stuff
    return { type: hit.type, lex: lex + 1, pcode: [pcoder.loadLiteralValue(hit.type, hit.value)] }
  }
}

// variable
const variable = (routine, lex, needed, language) => {
  const { lexemes } = routine
  const hit = find.variable(routine, lexemes[lex].content, language)

  if (hit) {
    // check the type is okay (will throw an error if not)
    error.check(needed, hit.fulltype.type, 'atoms03', lexemes[lex])

    // return the stuff
    return { type: hit.fulltype.type, lex: lex + 1, pcode: [pcoder.loadVariableValue(hit)] }
  }
}

// native colour constant
const colour = (routine, lex, needed, language) => {
  const { lexemes } = routine
  const hit = find.colour(lexemes[lex].content, language)

  if (hit) {
    // check the type is ok (will throw an error if not)
    error.check(needed, 'integer', 'atoms04', lexemes[lex])

    // return the stuff
    return { type: 'integer', lex: lex + 1, pcode: [pcoder.loadLiteralValue('integer', hit.value)] }
  }
}

// export the functions
module.exports = {
  literal,
  input,
  constant,
  variable,
  colour
}
