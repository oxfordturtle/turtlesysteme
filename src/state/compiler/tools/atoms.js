/**
 * compile the basic 'atoms' of a program, i.e. literal values, variable calls, function calls, etc.
 *
 * these functions are called by the molecules module - they are where the recursions in that
 * module ultimately bottom out
 */

// literal value
module.exports.literal = (lexemes, lex, needed) => {
  const { type, value } = lexemes[lex]

  // check this type is ok (will throw an error if not)
  check(needed, type, 'atoms00', lexemes[lex])

  // return the stuff
  return (type === 'char' && needed === 'string')
    ? { type, lex: lex + 1, pcode: [pcoder.loadLiteralValue(type, value), pcoder.applyOperator('ctos')] }
    : { type, lex: lex + 1, pcode: [pcoder.loadLiteralValue(type, value)] }
}

// input keycode or query
module.exports.input = (lexemes, lex, needed, language) => {
  const hit = find.input(lexemes[lex].content, language)

  if (hit) {
    // check the type is ok (will throw an error if not)
    check(needed, hit.type, 'atoms01', lexemes[lex])

    // return the stuff
    return { type: 'integer', lex: lex + 1, pcode: [pcoder.loadInputValue(hit)] }
  }
}

// constant
module.exports.constant = (routine, lex, needed, language) => {
  const { lexemes } = routine
  const hit = find.constant(routine, lexemes[lex].content, language)

  if (hit) {
    // check the type is ok (will throw an error if not)
    check(needed, hit.type, 'atoms02', lexemes[lex])

    // return the stuff
    return { type: hit.type, lex: lex + 1, pcode: [pcoder.loadLiteralValue(hit.type, hit.value)] }
  }
}

// variable
module.exports.variable = (routine, lex, needed, language) => {
  const { lexemes } = routine
  const hit = find.variable(routine, lexemes[lex].content, language)

  if (hit) {
    // check the type is okay (will throw an error if not)
    check(needed, hit.fulltype.type, 'atoms03', lexemes[lex])

    // return the stuff
    return { type: hit.fulltype.type, lex: lex + 1, pcode: [pcoder.loadVariableValue(hit)] }
  }
}

// native colour constant
module.exports.colour = (routine, lex, needed, language) => {
  const { lexemes } = routine
  const hit = find.colour(lexemes[lex].content, language)

  if (hit) {
    // check the type is ok (will throw an error if not)
    check(needed, 'integer', 'atoms04', lexemes[lex])

    // return the stuff
    return { type: 'integer', lex: lex + 1, pcode: [pcoder.loadLiteralValue('integer', hit.value)] }
  }
}

// dependencies
const check = require('./check')
const find = require('./find')
const pcoder = require('./pcoder')
