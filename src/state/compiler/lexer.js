/**
 * lexical analysis; program code (a string) goes in, an array of lexemes comes out
 *
 * the lexer first uses the tokenizer to generate an array of tokens; then it checks for lexical
 * errors, strips whitespace and comments, and enriches the tokens with more information
 *
 * lexemes (enriched tokens) look like this: { type, content, value, line, offset }
 *
 * the types are the same as for token types, except that there are no whitespace or illegal
 * lexemes, and the "binary", "octal", "hexadecimal", and "decimal" token types are all just
 * "integer" lexical types
 *
 * the line and offset properties are generated using (and then discarding) the whitespace tokens
 *
 * the value property stores the result of evaluating literal value expressions, looking up the
 * corresponding integer for predefined colours, keycodes, and input queries, or the pcode
 * associated with an operator; it is null for all other lexical types
 */

module.exports = (code, language) => {
  // run the tokenizer on the code, then setup some constants
  const tokens = tokenizer(code, language)
  const lexemes = []
  const errorOffset = ['BASIC', 'Pascal', 'Python'].indexOf(language)

  // loop through the tokens, pushing lexemes into the lexemes array (or throwing an error)
  let index = 0
  let line = 1
  let startofline = true
  let offset = 0
  while (index < tokens.length) {
    switch (tokens[index].type) {
      case 'linebreak':
        line += 1
        startofline = true
        offset = 0
        break

      case 'spaces':
        if (startofline) offset = tokens[index].content.length
        startofline = false
        break

      case 'comment':
        startofline = false
        break

      case 'unterminated-comment':
        throw error(messages[0], lexeme(tokens[index], line, offset, language))

      case 'unterminated-string':
        throw error(messages[1], lexeme(tokens[index], line, offset, language))

      case 'bad-binary':
        throw error(messages[2 + errorOffset], lexeme(tokens[index], line, offset, language))

      case 'bad-octal':
        throw error(messages[5 + errorOffset], lexeme(tokens[index], line, offset, language))

      case 'bad-hexadecimal':
        throw error(messages[8 + errorOffset], lexeme(tokens[index], line, offset, language))

      case 'bad-decimal':
        throw error(messages[11], lexeme(tokens[index], line, offset, language))

      case 'illegal':
        throw error(messages[12], lexeme(tokens[index], line, offset, language))

      default:
        startofline = false
        lexemes.push(lexeme(tokens[index], line, offset, language))
        break
    }

    index += 1
  }

  // return the array of lexemes
  return lexemes
}

// dependencies
const { error } = require('./tools')
const tokenizer = require('./tokenizer')

// error messages
const messages = [
  'Unterminated comment.',
  'Unterminated string.',
  'Binary numbers in Turtle BASIC begin with \'%\'.',
  'Binary numbers in Turtle Pascal begin with \'%\'.',
  'Binary numbers in Turtle Python begin with \'0b\'.',
  'Turtle BASIC does not support octal numbers.',
  'Octal numbers in Turtle Pascal begin with \'&\'',
  'Octal numbers in Turtle Python begin with \'0o\'',
  'Hexadecimal numbers in Turtle BASIC begin with \'&\'',
  'Hexadecimal numbers in Turtle Pascal begin with \'$\'',
  'Hexadecimal numbers in Turtle Python begin with \'0x\'',
  'The Turtle System does not support real numbers.',
  'Illegal character in this context.'
]

// create a lexeme object
const lexeme = (token, line, offset, language) =>
  ({
    type: type(token.type, token.content),
    // Pascal is case-insensitive, so make everything lowercase for that language
    content: (language === 'Pascal') ? token.content.toLowerCase() : token.content,
    value: value(token.type, token.content),
    line,
    offset
  })

// type of a lexeme
const type = (type, content) => {
  switch (type) {
    case 'binary': // fallthrough
    case 'octal': // fallthrough
    case 'hexadecimal': // fallthrough
    case 'decimal': // falthrough
      return 'integer'
    case 'command': // fallthrough
    case 'colour': // fallthrough
    case 'custom': // fallthrough
    case 'variable':
      return 'identifier'
    default:
      return type
  }
}

// value of a lexeme
const value = (type, content) => {
  switch (type) {
    case 'operator':
      switch (content.toLowerCase()) {
        case '+':
          return 'plus'

        case '-':
          return 'subt'

        case '*':
          return 'mult'

        case '/':
          return 'divr'

        case 'div': // fallthrough
        case '//':
          return 'div'

        case 'mod': // fallthrough
        case '%':
          return 'mod'

        case '=': // fallthrough (in BASIC, this could also be variable assignment)
        case '==':
          return 'eqal'

        case '<>': // fallthrough
        case '!=':
          return 'noeq'

        case '<=':
          return 'lseq'

        case '>=':
          return 'mreq'

        case '<':
          return 'less'

        case '>':
          return 'more'

        case 'not':
          return 'not'

        case 'and':
          return 'and'

        case 'or':
          return 'or'

        case 'xor': // fallthrough
        case 'eor':
          return 'xor'

        default:
          return null
      }

    case 'string':
      return content.slice(1, -1).replace(/''/g, '\'').replace(/\\('|")/g, '$1')

    case 'boolean':
      // N.B. case sensitivity is already handled by the tokenizer
      return (content.toLowerCase() === 'true') ? -1 : 0

    case 'binary':
      return parseInt(content.slice(1), 2)

    case 'octal':
      return parseInt(content.slice(1), 8)

    case 'hexadecimal':
      return parseInt(content.slice(1), 16)

    case 'decimal':
      return parseInt(content)

    case 'turtle':
      return ['x', 'y', 'd', 't', 'c'].indexOf(content[4].toLowerCase()) + 1

    default:
      return null
  }
}
