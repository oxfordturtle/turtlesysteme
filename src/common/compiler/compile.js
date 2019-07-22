/*
the compiler module

exports two functions, one for syntax highlighting, the other for compiling program text into
pcode for the virtual machine

the compiler works in three stages: (1) the lexer gets lexemes from the code; (2) the parser gets
an array of routines from the lexemes (with details of variables etc.); (3) the coder generates the
actual pcode from the array of routines

the compiler also generates command and structure usage data from the lexemes and subroutines
*/
import analyser from './analyser.js'
import lexer from './lexer.js'
import parser from './parser.js'
import coder from './coder.js'

export default (code, language) => {
  // get lexemes from the code
  const lexemes = lexer(code, language)
  console.log(lexemes)

  // get routines from the lexemes
  const routines = parser(lexemes, language)
  console.log(routines)

  // get pcode from the routines
  const pcode = coder(routines, language)
  console.log(pcode)

  // get usage data from the lexemes and subroutines
  const usage = analyser(lexemes, routines.slice(1), language)

  // return usage and pcode
  return { lexemes, pcode, usage }
}
