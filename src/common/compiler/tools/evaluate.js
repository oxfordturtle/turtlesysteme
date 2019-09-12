/*
evaluate a sequence of lexemes (to get the value of a constant)
*/
import error from './error.js'
import colours from 'common/constants/colours'

export default (identifier, lexemes, program) => {
  try {
    // generate JavaScript expression from the lexemes
    const code = lexemes.map(toJsString).join('')
    // make colour constants and previously defined constants available to the eval function
    const constants = {}
    colours.forEach((colour) => {
      constants[colour.names[program.language]] = colour.value
    })
    program.constants.forEach((constant) => {
      constants[constant.name] = constant.value
    })
    // try to evaluate the code
    const value = eval(code)
    // only integers and strings are allowed
    switch (typeof value) {
      case 'boolean':
        return value ? -1 : 0 // only BASIC and Pascal have constants, and they treat true as -1

      case 'number':
        return (value >= 0) ? Math.floor(value) : Math.ceil(value)

      case 'string':
        return value

      default:
        throw error() // empty error (will be caught below and ignored anyway)
    }
  } catch (ignore) {
    throw error('Could not parse expression for constant value.', identifier)
  }
}

// JavaScript string equivalent of a Turtle language lexeme
const toJsString = (lexeme) => {
  switch (lexeme.type) {
    case 'boolean':
      return lexeme.content.toLowerCase()

    case 'integer':
      return lexeme.content.replace(/^[$&]/, '0x') // fix hexadecimal values

    case 'string':
      return lexeme.content

    case 'identifier':
      return `constants['${lexeme.content}']`

    case 'operator':
      switch (lexeme.value) {
        case 'plus':
          return '+'

        case 'subt':
          return '-'

        case 'mult':
          return '*'

        case 'divr':
          return '/'

        case 'div':
          return '/'

        case 'mod':
          return '%'

        case 'eqal':
          return '==='

        case 'noeq':
          return '!=='

        case 'lseq':
          return '<='

        case 'mreq':
          return '>='

        case 'less':
          return '<'

        case 'more':
          return '>'

        case 'bnot':
          return '!'

        case 'not':
          return '~'

        case 'band':
          return '&&'

        case 'and':
          return '&'

        case 'bor':
          return '||'

        case 'or':
          return '|'

        case 'xor':
          return '^'
      }
      break

    case 'punctuation':
      if (lexeme.content === '(' || lexeme.content === ')') {
        return lexeme.content
      } else {
        throw error() // empty error (will be caught above anyway)
      }

    default:
      throw error() // empty error (will be caught above anyway)
  }
}
