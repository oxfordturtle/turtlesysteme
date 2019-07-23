/*
Parser for Turtle Python - lexemes go in, array of routines comes out the first element in the
array is the main PROGRAM object.

Look at the factory module to see what the PROGRAM object (and its components) look like.

this analyses the structure of the program, and builds up lists of all the variables and
subroutines (with their variables and parameters) - lexemes for the program (and any
subroutine) code themselves are just stored for subsequent handling by the pcoder
*/
import error from '../tools/error'
import * as factory from './factory/python'

export default (lexemes) => {
  const routines = [] // array of routines to be returned (0 being the main program)
  const routineStack = [] // stack of routines
  let lex = 0 // index of current lexeme
  let routine // the current routine
  let result
  let state = 'crossroads'

  // setup program
  routine = factory.program()
  routines.push(routine)
  routineStack.push(routine)

  // loop through the lexemes
  while (lex < lexemes.length) {
    switch (state) {
      case 'crossroads':
        // expecting declarations, indent/dedent, or routine statements
        if (lexemes[lex].type === 'identifier' || lexemes[lex].type === 'turtle') {
          state = 'identifier'
        } else if (lexemes[lex].type === 'DEDENT') {
          const indents = routine.lexemes.filter(x => x.type === 'INDENT').length
          const dedents = routine.lexemes.filter(x => x.type === 'DEDENT').length
          if (indents === dedents) {
            // end of subroutine
            state = 'end'
          } else {
            // otherwise keep going
            routine.lexemes.push(lexemes[lex])
          }
          // either way move past this lexeme
          lex += 1
        } else if (lexemes[lex].content === 'def') {
          state = 'def'
        } else if (lexemes[lex].content === 'global') {
          state = 'global'
        } else if (lexemes[lex].content === 'nonlocal') {
          state = 'nonlocal'
        } else {
          // default is just to add the lexeme to the current routine, and stay here
          routine.lexemes.push(lexemes[lex])
          lex += 1
        }
        break

      case 'identifier':
        // like the default above, we need to add the lexemes to the current routine;
        // but we also might need to make a note of the variable
        if (lexHas(lexemes[lex + 1], 'content', ':') && lexHas(lexemes[lex + 2], 'type', 'identifier')) {
          // typed variable assignment
          result = factory.typedVariable(lexemes, lex, routine)
          routine.variables.push(result.variable)
          // add all the lexemes to the routine as well
          while (lex < result.lex) {
            routine.lexemes.push(lexemes[lex])
            lex += 1
          }
        } else if (lexHas(lexemes[lex + 1], 'content', 'in')) {
          // range variable (must be an integer)
          if (lexemes[lex].type === 'identifier') { // don't bother for turtle variables
            if (!declared(lexemes[lex].content, routine)) {
              result = factory.variable(lexemes[lex], routine)
              result.fulltype = factory.fulltype('integer')
              routine.variables.push(result)
            }
          }
          // add the lexeme to the routine as well
          routine.lexemes.push(lexemes[lex])
          lex += 1
        } else {
          // add the lexeme to the routine regardless
          routine.lexemes.push(lexemes[lex])
          lex += 1
        }
        // back to the crossroads
        state = 'crossroads'
        break

      case 'def':
        // subroutine definition
        result = factory.subroutine(lexemes, lex + 1, routine)
        routine.subroutines.push(result.subroutine)
        routineStack.push(result.subroutine)
        routine = result.subroutine
        lex = result.lex
        if (!lexemes[lex]) {
          throw error('No statements found after subroutine definition.', lexemes[lex - 1])
        }
        if (lexemes[lex].type !== 'NEWLINE') {
          throw error('Subroutine definition must be followed by a line break.', lexemes[lex])
        }
        lex += 1
        if (!lexemes[lex]) {
          throw error('No statements found after subroutine definition.', lexemes[lex - 1])
        }
        if (lexemes[lex].type !== 'INDENT') {
          throw error('Indent needed after subroutine definition.', lexemes[lex])
        }
        lex += 1
        state = 'crossroads'
        break

      case 'global': // fallthrough
      case 'nonlocal':
        // global/nonlocal variable declarations
        const names = (state === 'global') ? routine.globals : routine.nonlocals
        if (routine.index === 0) {
          throw error('Main program cannot include any global/nonlocal statements.', lexemes[lex])
        }
        lex += 1
        if (lexemes[lex].type === 'NEWLINE') {
          throw error('Global/nonlocal statements must be on one line.', lexemes[lex - 1])
        }
        while (lexemes[lex] && lexemes[lex].type !== 'NEWLINE') {
          if (lexemes[lex].type !== 'turtle' && lexemes[lex].type !== 'identifier') {
            throw error('{lex} is not a valid variable name.', lexemes[lex])
          }
          names.push(lexemes[lex].content)
          lex += 1
          if (lexemes[lex].content === ',') lex += 1
        }
        if (lexemes[lex].type === 'NEWLINE') lex += 1
        state = 'crossroads'
        break

      case 'end':
        // end of a subroutine
        routine.index = routines.length
        routines.push(routineStack.pop())
        // discard newline lexeme at the end of the routine
        if (routine.lexemes[routine.lexemes.length - 1].type === 'NEWLINE') {
          routine.lexemes.pop()
        }
        // set current routine to the previous one
        routine = routineStack[routineStack.length - 1]
        // and go back to the crossroads
        state = 'crossroads'
        break
    }
  }

  // return the routines array
  return routines
}

// check if a lexeme exists and has a given property
const lexHas = (lexeme, field, value) =>
  lexeme && lexeme[field] === value

// check if variable name has been declared as local, global, or nonlocal
const declared = (name, routine) =>
  (routine.globals && routine.globals.includes(name)) ||
    (routine.nonlocals && routine.nonlocals.includes(name)) ||
    routine.variables.some(x => x.name === name)
