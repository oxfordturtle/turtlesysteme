/*
the compiler module

exports two functions, one for syntax highlighting, the other for compiling program text into
pcode for the virtual machine

the compiler works in three stages: (1) the lexer gets lexemes from the code; (2) the parser gets
an array of routines from the lexemes (with details of variables etc.); (3) the coder generates the
actual pcode from the array of routines

the compiler also generates command and structure usage data from the lexemes and subroutines
*/

// syntax highlighting for the code editor
module.exports.highlight = (code, language) =>
  tokenizer(code, language).map(style).join('')

// the compile function
module.exports.compile = (code, language) => {
  // get lexemes from the code
  const lexemes = lexer(code, language)

  // get routines from the lexemes
  const routines = parser(lexemes, language)
  console.log(routines)

  // get pcode from the routines
  const pcode = coder(routines, language)
  console.log(pcode)

  // get usage data from the lexemes and subroutines
  const usage = analyser(lexemes, routines.slice(1), language)

  // return usage and pcode
  return { usage, pcode }
}

// dependencies
const analyser = require('./analyser')
const lexer = require('./lexer')
const parser = require('./parser')
const coder = require('./coder')
const tokenizer = require('./tokenizer')

// wrap a token in a <span> tag (used by the highlight function)
const style = token =>
  `<span class="tsx-${token.type}">${token.content}</span>`
