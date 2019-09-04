/*
lexical analysis; program code (a string) goes in, an array of lexemes comes out

the lexer first uses the tokenizer to generate an array of tokens; then it checks for lexical
errors, strips whitespace and comments, and enriches the tokens with more information

lexemes (enriched tokens) look like this: { type, content, value, line }

the types are the same as for token types, except that there are no illegal lexemes, whitespace
is handled differently, and the "binary", "octal", "hexadecimal", and "decimal" token types are
all just "integer" lexical types

the value property stores the result of evaluating literal value expressions, looking up the
corresponding integer for predefined colours, keycodes, and input queries, or the pcode associated
with an operator; it is null for all other lexical types
*/
import error from './tools/error.js'
import tokenizer from './tokenizer.js'

export default (code, language) => {
  // run the tokenizer on the code, then setup some constants
  const tokens = tokenizer(code, language)
  const lexemes = []
  const errorOffset = ['BASIC', 'Pascal', 'Python'].indexOf(language)

  // loop through the tokens, pushing lexemes into the lexemes array (or throwing an error)
  let index = 0
  let line = 1
  let indent = 0
  let indents = [indent]
  while (index < tokens.length) {
    switch (tokens[index].type) {
      case 'linebreak':
        line += 1
        // line breaks are significant in BASIC and Python
        if (language === 'BASIC' || language === 'Python') {
          // create a NEWLINE lexeme, unless this is a blank line at the start f the program or
          // there's a blank line previously (which can happen following a single-line comment)
          if (lexemes[lexemes.length - 1] && lexemes[lexemes.length - 1].type !== 'NEWLINE') {
            lexemes.push({ content: 'NEWLINE', type: 'NEWLINE', line: line - 1 })
          }
          // move past any additional line breaks, just incrementing the line number
          while (tokens[index + 1] && tokens[index + 1].type === 'linebreak') {
            index += 1
            line += 1
          }
        }

        // indents are significant in Python
        if (language === 'Python') {
          indent = (tokens[index + 1] && tokens[index + 1].type === 'spaces')
            ? tokens[index + 1].content.length
            : 0
          if (indent > indents[indents.length - 1]) {
            indents.push(indent)
            lexemes.push({ content: 'INDENT', type: 'INDENT', line })
          } else {
            while (indent < indents[indents.length - 1]) {
              indents.pop()
              lexemes.push({ content: 'INDENT', type: 'DEDENT', line })
            }
            if (indent !== indents[indents.length - 1]) {
              throw error(`Inconsistent indentation at line ${line}.`)
            }
          }
        }
        break

      case 'spaces':
        // ignore
        break

      case 'comment':
        // ignore
        break

      case 'unterminated-comment':
        throw error(messages[0], lexeme(tokens[index], line, language))

      case 'unterminated-string':
        throw error(messages[1], lexeme(tokens[index], line, language))

      case 'bad-binary':
        throw error(messages[2 + errorOffset], lexeme(tokens[index], line, language))

      case 'bad-octal':
        throw error(messages[5 + errorOffset], lexeme(tokens[index], line, language))

      case 'bad-hexadecimal':
        throw error(messages[8 + errorOffset], lexeme(tokens[index], line, language))

      case 'bad-decimal':
        throw error(messages[11], lexeme(tokens[index], line, language))

      case 'illegal':
        throw error(messages[12], lexeme(tokens[index], line, language))

      default:
        lexemes.push(lexeme(tokens[index], line, language))
        break
    }

    index += 1
  }

  // return the array of lexemes (give NEWLINE, INDENT, and DEDENT some content for error messages)
  return lexemes
}

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
const lexeme = (token, line, language) =>
  ({
    type: type(token.type, token.content),
    // Pascal is case-insensitive, so make everything lowercase for that language
    content: (language === 'Pascal') ? token.content.toLowerCase() : token.content,
    value: value(token.type, token.content, language),
    line
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

    case 'keyword':
      if (content === 'result') return 'identifier' // treat 'result' as identifier in Pascal
      return type

    default:
      return type
  }
}

// value of a lexeme
const value = (type, content, language) => {
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
          // 'not' is bitwise negation in BASIC and Pascal, but boolean in Python
          return language === 'Python' ? 'bnot' : 'not'

        case '~':
          // in Python, '~' is bitwise negation
          return 'not'

        case 'and':
          // 'and' is bitwise conjucntion in BASIC and Pascal, but boolean in Python
          return language === 'Python' ? 'band' : 'and'

        case '&':
          // in Python, '&' is bitwise conjunction
          return 'and'

        case 'or':
          // 'or' is bitwise disjunction in BASIC and Pascal, but boolean in Python
          return language === 'Python' ? 'bor' : 'or'

        case '|':
          // in Python, '|' is bitwise disjunction
          return 'or'

        case 'xor': // fallthrough
        case 'eor': // fallthrough
        case '^':
          return 'xor'

        default:
          return null
      }

    case 'string':
      switch (language) {
        case 'BASIC':
          return content.slice(1, -1).replace(/""/g, '"')
        case 'Pascal':
          if (content[0] === '\'') return content.slice(1, -1).replace(/''/g, '\'')
          return content.slice(1, -1).replace(/""/g, '"')
        case 'Python':
          return content.slice(1, -1).replace(/\\('|")/g, '$1')
      }
      break

    case 'boolean':
      // N.B. case sensitivity is already handled by the tokenizer
      if (language === 'Python') return (content.toLowerCase() === 'true') ? 1 : 0
      return (content.toLowerCase() === 'true') ? -1 : 0

    case 'binary':
      return language === 'Python'
        ? parseInt(content.slice(2), 2)
        : parseInt(content.slice(1), 2)

    case 'octal':
      return language === 'Python'
        ? parseInt(content.slice(2), 8)
        : parseInt(content.slice(1), 8)

    case 'hexadecimal':
      return language === 'Python'
        ? parseInt(content.slice(2), 16)
        : parseInt(content.slice(1), 16)

    case 'decimal':
      return parseInt(content)

    case 'turtle':
      return ['x', 'y', 'd', 't', 'c'].indexOf(content[4].toLowerCase()) + 1

    default:
      return null
  }
}
