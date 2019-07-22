/*
lexemes go in, array of routines comes out; the first element of the array is the main PROGRAM, and
any subsequent elements are its SUBROUTINES, in the order in which they need to be compiled

look at the tools/factory module to see what the PROGRAM and SUBROUTINE objects look like

this analyses the structure of the program, and builds up lists of all the constants, variables, and
subroutines (with their variables and parameters) - lexemes for the program (and any subroutine)
code themselves are just stored for subsequent handling by the pcoder
*/
import error from './tools/error'
import * as molecules from './tools/molecules'
import * as find from './tools/find'
import * as factory from './parsers/factory/factory'
import BASIC from './parsers/basic'
import Pascal from './parsers/pascal'
import Python from './parsers/python'

export default (lexemes, language) => {
  const parsers = { BASIC, Pascal, Python }
  if (lexemes.length === 0) throw error('Program does not contain any lexemes.')
  const routines = parsers[language](lexemes)
  const program = routines[0]
  const subroutines = routines.slice(1)
  // now do some final calculations
  routines.forEach(fixVariableMemory)
  program.turtleAddress = basePointers + subroutinePointers(subroutines)
  program.resultAddress = basePointers + subroutines.length
  // and return the array of routines
  return routines
}

// set the address of the variables for a routine, and determine how much memory it needs
const fixVariableMemory = (routine) => {
  let memoryNeeded = 0
  routine.variables.forEach((variable) => {
    memoryNeeded += 1
    variable.index = memoryNeeded
    if (variable.fulltype && variable.fulltype.length !== null) {
      memoryNeeded += variable.fulltype.length
    }
  })
  routine.memoryNeeded = memoryNeeded
}

// base number of pointers (turtle, keybuffer, plus 8 file slots)
const basePointers = 10

// subroutine pointers needed (number of subroutines, plus 1 for the return value if there's at
// least one function)
const subroutinePointers = subroutines =>
  subroutines.some(x => x.type === 'function') ? subroutines.length + 1 : subroutines.length
