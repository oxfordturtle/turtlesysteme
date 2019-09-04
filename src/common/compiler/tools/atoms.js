/*
compile the basic 'atoms' of a program, i.e. literal values, variable calls, function calls, etc.

these functions are called by the molecules module - they are where the recursions in that
module ultimately bottom out
*/
import check from './check.js'
import error from './error.js'
import * as find from './find.js'
import * as pcoder from './pcoder.js'

// literal value
export const literal = (lexemes, lex, needed) => {
  const { type, value } = lexemes[lex]

  // check this type is ok (will throw an error if not)
  check(needed, type, lexemes[lex])

  // return the stuff
  return (type === 'char' && needed === 'string')
    ? { type, lex: lex + 1, pcode: [pcoder.loadLiteralValue(type, value), pcoder.applyOperator('ctos')] }
    : { type, lex: lex + 1, pcode: [pcoder.loadLiteralValue(type, value)] }
}

// input keycode or query
export const input = (lexemes, lex, needed, language) => {
  const hit = find.input(lexemes[lex].content, language)

  if (hit) {
    // check the type is ok (will throw an error if not)
    check(needed, 'integer', lexemes[lex])

    // return the stuff
    return { type: 'integer', lex: lex + 1, pcode: [pcoder.loadInputValue(hit)] }
  }
}

// constant
export const constant = (routine, lex, needed, language) => {
  const { lexemes } = routine
  const hit = find.constant(routine, lexemes[lex].content, language)

  if (hit) {
    // check the type is ok (will throw an error if not)
    check(needed, hit.type, lexemes[lex])

    // return the stuff
    return { type: hit.type, lex: lex + 1, pcode: [pcoder.loadLiteralValue(hit.type, hit.value)] }
  }
}

// variable
export const variable = (routine, lex, needed, language) => {
  const { lexemes } = routine
  const hit = find.variable(routine, lexemes[lex].content, language)

  if (hit) {
    // check for array element reference and throw error for now
    if (lexemes[lex + 1] && lexemes[lex + 1].content === '[') {
      throw error('The Turtle System E does not yet support arrays. This feature will be added soon. In the meantime, please use the Turtle System D to compile this program.', lexemes[lex])
    }

    // check the type is okay (will throw an error if not)
    check(needed, hit.fulltype.type, lexemes[lex])

    // return the stuff
    return { type: hit.fulltype.type, lex: lex + 1, pcode: [pcoder.loadVariableValue(hit)] }
  }
}

// native colour constant
export const colour = (routine, lex, needed, language) => {
  const { lexemes } = routine
  const hit = find.colour(lexemes[lex].content, language)

  if (hit) {
    // check the type is ok (will throw an error if not)
    check(needed, 'integer', lexemes[lex])

    // return the stuff
    return { type: 'integer', lex: lex + 1, pcode: [pcoder.loadLiteralValue('integer', hit.value)] }
  }
}
