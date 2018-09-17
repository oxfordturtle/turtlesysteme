/*
type check function (throws an error if check fails, does nothing otherwise)
*/

module.exports = (needed, found, lexeme) => {
  // if NULL is needed, everything is ok
  if (needed === 'null') return

  // found and needed the same is obviously ok
  if (found === needed) return

  // if STRING is needed, CHAR is ok
  if ((needed === 'string') && (found === 'char')) return

  // if BOOLINT is needed, either BOOLEAN or INTEGER is ok
  if (needed === 'boolint' && (found === 'boolean' || found === 'integer')) return

  // if BOOLINT is found, either BOOLEAN or INTEGER needed is ok
  if (found === 'boolint' && (needed === 'boolean' || needed === 'integer')) return

  // everything else is an error
  throw error(`Type error: '${needed}' expected but '${found}' found.`, lexeme)
}

// dependencies
const error = require('./error')
