/*
coder: array of routines goes in, pcode comes out

this second pass over the lexemes generates the compiled pcode, using the language-independent
pcoder module (the only one that outputs pcode directly), and the appropriate language-specific
module

the language-specific modules are responsible for running through the lexemes that make up the
commands of the individual routines; this module pieces those results together, and wraps them up
in the appropriate routine start and end code
*/
import * as pcoder from './tools/pcoder'
import BASIC from './coders/basic'
import Pascal from './coders/pascal'
import Python from './coders/python'

// the coder function - generates pcode from the array of routines
export default (routines, language) => {
  const program = routines[0]
  const subroutines = routines.slice(1)
  const subroutinesStartLine = programStartLength(program, subroutines) + 1
  const subroutinesCode = compileSubroutines(routines, subroutinesStartLine, language)
  const programStartLine = subroutinesStartLine + subroutinesCode.length
  const innerCode = compileInnerCode(program, programStartLine, language)
  const pcode = pcoder.program(routines[0], subroutinesCode, innerCode)
  return pcode.map(patchLine.bind(null, routines))
}

// calculate the length of pcode at the start of the program (so we know what line subroutines
// start on)
const programStartLength = (program, subroutines) =>
  (subroutines.length > 0)
    ? pcoder.programStartCode(program).length + 1 // + 1 for jump line past subroutines
    : pcoder.programStartCode(program).length

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
  const coders = { BASIC, Pascal, Python }
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

// final patches
const patchLine = (routines, line) =>
  line.map(code => typeof code === 'string' ? patchCode(routines, code) : code)

const patchCode = (routines, code) => {
  const test = code.match(/SUBR(\d+)/)
  if (test) {
    const index = parseInt(test[1])
    const routine = routines.find(x => x.index === index)
    return routine.startLine
  }
}
