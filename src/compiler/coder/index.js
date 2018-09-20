/*
coder: array of routines goes in, pcode comes out

this second pass over the lexemes generates the compiled pcode, using the language-independent
pcoder module (the only one that outputs pcode directly), and the appropriate language-specific
module

the language-specific modules are responsible for running through the lexemes that make up the
commands of the individual routines; this module pieces those results together, and wraps them up
in the appropriate routine start and end code
*/

// the coder function - generates pcode from the array of routines
module.exports = (routines, language) => {
  const program = routines[0]
  const subroutines = routines.slice(1)
  const subroutinesStartLine = (subroutines.length > 0) ? 4 : 3
  const subroutinesCode = compileSubroutines(routines, subroutinesStartLine, language)
  const programStartLine = subroutinesStartLine + subroutinesCode.length
  const innerCode = compileInnerCode(program, programStartLine, language)
  return pcoder.program(routines[0], subroutinesCode, innerCode)
}

// dependencies
const { pcoder } = require('../tools')
const coders = {
  BASIC: require('./basic'),
  Pascal: require('./pascal'),
  Python: require('./python')
}

// generate the pcode for subroutines (returns an empty array if there aren't any)
const compileSubroutines = (routines, startLine, language) => {
  let pcode = []

  // generate the pcode for each subroutine in turn, concatenating the results
  let index = 1
  while (index < routines.length) {
    routines[index].startLine = startLine
    const offset = pcoder.subroutineStartCode(routines[index]).length
    let innerCode = compileInnerCode(routines[index], startLine + offset, language)
    let subroutineCode = pcoder.subroutine(routines[index], innerCode)
    pcode = pcode.concat(subroutineCode)
    index += 1
    startLine += subroutineCode.length
  }

  // return the pcode
  return pcode
}

// generate the inner pcode for routines (minus start and end stuff)
const compileInnerCode = (routine, startLine, language) => {
  let pcode = []

  // loop through the routine lexmes, compiling each block of code with the coder, and concatenating
  // the result
  let lex = 0
  while (lex < routine.lexemes.length) {
    let result = coders[language].call(null, routine, lex, startLine + pcode.length)
    pcode = pcode.concat(result.pcode)
    lex = result.lex
  }

  // return the pcode
  return pcode
}
