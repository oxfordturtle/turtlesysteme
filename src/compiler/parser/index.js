/*
lexemes go in, array of routines comes out; the first element of the array is the main PROGRAM, and
any subsequent elements are its SUBROUTINES, in the order in which they need to be compiled

look at the tools/factory module to see what the PROGRAM and SUBROUTINE objects look like

this analyses the structure of the program, and builds up lists of all the constants, variables, and
subroutines (with their variables and parameters) - lexemes for the program (and any subroutine)
code themselves are just stored for subsequent handling by the pcoder
*/

module.exports = (lexemes, language) => {
  const routines = parsers[language](lexemes)
  const program = routines[0]
  const subroutines = routines.slice(1)
  if (language === 'BASIC') {
    // determine function return types
    // TODO
  }
  if (language === 'Python') {
    // determine variable types recursively (start at main program, then work through subroutines)
    determineVariableTypes(routines, 0)
    // determine parameter types recursively (start at last subroutine, then work backwards)
    if (routines.length > 1) determineParameterTypes(routines, routines.length - 1)
    // throw errors if any types could not be determined
    const first = untypedVariable(routines)
    if (first) {
      throw error('Could not detetermine type of variable {lex}.', first.lexeme)
    }
  }
  // now do some final calculations
  routines.forEach(fixVariableMemory)
  program.turtleAddress = turtleAddress(subroutines)
  // and return the array of routines
  return routines
}

// dependencies
const { error, molecules, factory, find } = require('../tools')
const parsers = {
  BASIC: require('./basic'),
  Pascal: require('./pascal'),
  Python: require('./python')
}

// determine the types for the variables of a routine (for Python)
const determineVariableTypes = (routines, index) => {
  var routine = routines[index]
  var lexemes = routine.lexemes
  var lex = 0
  var variable
  var expression
  // do what we can with the current routine
  while (lex < lexemes.length) {
    if (lexemes[lex].type === 'identifier') {
      variable = find.variable(routine, lexemes[lex].content, 'Python')
      if (variable && (variable.fulltype === null)) {
        lex += 1
        // expecting '=' or 'in' (as in 'for [variable] in range...'
        if (lexemes[lex] && (lexemes[lex].content === 'in')) {
          variable.fulltype = factory.fulltype('integer')
          lex += 1
        } else if (lexemes[lex] && (lexemes[lex].content === '=')) {
          lex += 1
          // expecting an expression whose type we can figure out
          if (lexemes[lex]) {
            try {
              expression = molecules.expression(routine, lex, 'null', 'null', 'Python')
              variable.fulltype = factory.fulltype(expression.type)
              lex = expression.lex
            } catch (ignore) {
              // fail silently - doesn't matter for now
              lex += 1
            }
          }
        }
      } else {
        lex += 1
      }
    } else if (lexemes[lex].content === 'return') {
      variable = find.variable(routine, 'return', 'Python')
      lex += 1
      if (lexemes[lex]) {
        try {
          expression = molecules.expression(routine, lex, 'null', 'null', 'Python')
          variable.fulltype = factory.fulltype(expression.type)
          lex = expression.lex
        } catch (ignore) {
          // fail silently - doesn't matter for now
          lex += 1
        }
      }
    } else {
      lex += 1
    }
  }
  // now decide whether to do another routine, or stop here
  if (index === 0) {
    // 0th routine (main program) should be done first
    if (routines.length === 1) {
      // just stop here if there are no subroutines
      return routines
    } else {
      // otherwise do subroutines, starting with the last
      return determineVariableTypes(routines, (routines.length - 1))
    }
  } else if (index > 1) {
    // we've just done a subroutine, now do the previous one
    return determineVariableTypes(routines, (index - 1))
  } else {
    // we've just done the first subroutine, so we're done
    return routines
  }
}

// determine the types of the parameters of a routine (for Python)
const determineParameterTypes = function (routines, index) {
  var routine = routines[index]
  var lexemes = routine.lexemes
  var lex = 0
  var command
  var par
  var expression
  // do what we can with the current routine
  while (lex < lexemes.length) {
    if (lexemes[lex].type === 'identifier') {
      command = find.custom(routine, lexemes[lex].content, 'Python')
      if (command && (command.parameters.length > 0)) {
        par = 0
        // move past open bracket
        lex += 2
        while (par < command.parameters.length) {
          try {
            expression = molecules.expression(routine, lex, 'null', 'null', 'Python')
            if (command.parameters[par].fulltype === null) {
              command.parameters[par].fulltype = factory.fulltype(expression.type)
            }
            lex = expression.lex + 1 // move past comma or right bracket
          } catch (ignore) {
            // fail silently; it doesn't matter for now - either it will be determined later, or if
            // it's left undetermined, the pcoder module will complain
          }
          par += 1
        }
      }
    }
    lex += 1
  }
  // now decide whether to do another routine, or stop here
  if (index === 1) {
    return routines
  } else {
    return determineParameterTypes(routines, index - 1)
  }
}

// find the first untyped variable
const untypedVariable = (routines) => {
  const variables = routines.reduce((sofar, current) => sofar.concat(current.variables), [])
  return variables.find(x => x.fulltype === null)
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

// get the address of the turtle global variable (offset by the pointers)
const turtleAddress = subroutines =>
  basePointers + subroutinePointers(subroutines)
