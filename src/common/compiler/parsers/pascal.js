/*
parser for Turtle Pascal - lexemes go in, array of routines comes out; the first element in the
array is the main PROGRAM object

look at the factory module to see what the PROGRAM object (and its components) look like

this analyses the structure of the program, and builds up lists of all the constants, variables,
and subroutines (with their variables and parameters) - lexemes for the program (and any
subroutine) code themselves are just stored for subsequent handling by the pcoder
*/
import error from '../tools/error'
import * as factory from './factory/pascal'

export default (lexemes) => {
  const routines = [] // array of routines to be returned (0 being the main program)
  const routineStack = [] // stack of routines
  let result // reference to return values needed along the way
  let lex = 0 // index of current lexeme
  let routine // the current routine
  let routineCount = 0 // index of the current routine
  let parent // the parent of the current routine
  let state = 'program'

  // loop through the lexemes
  while (lex < lexemes.length) {
    switch (state) {
      case 'program':
        // expecting "PROGRAM <identifier>"
        result = factory.program(lexemes, lex)

        // semicolon check
        lex = next(lexemes, result.lex, true)

        // set the current routine to the main program, and add it to the stacks
        routine = result.program
        routines.push(routine)
        routineStack.push(routine)

        // where next
        state = 'crossroads'
        break

      case 'crossroads':
        // expecting "CONST", "VAR", "PROCEDURE|FUNCTION", or "BEGIN[;]"
        if (!lexemes[lex]) {
          throw error('Expected "BEGIN", constant/variable definitions, or subroutine definitions.', lexemes[lex - 1])
        }
        switch (lexemes[lex].content) {
          case 'const':
            if (routine.variables.length > 0) {
              throw error('Constants must be defined before any variables.', lexemes[lex])
            }
            if (routine.subroutines.length > 0) {
              throw error('Constants must be defined before any subroutines.', lexemes[lex])
            }
            lex = lex + 1
            state = 'constant'
            break

          case 'var':
            if (routine.subroutines.length > 0) {
              throw error('Variables must be defined before any subroutines.', lexemes[lex])
            }
            lex = lex + 1
            state = 'variables'
            break

          case 'function': // fallthrough
          case 'procedure':
            state = lexemes[lex].content
            lex = lex + 1
            break

          case 'begin':
            lex = next(lexemes, lex + 1, false) // move past any semicolons
            state = 'begin'
            break

          default:
            throw error('Expected "BEGIN", constant/variable definitions, or subroutine definitions.', lexemes[lex])
        }
        break

      case 'constant':
        // expecting "<identifier> = <value>"
        result = factory.constant(lexemes, lex, routine)
        // add the constant to the routine
        routine.constants.push(result.constant)
        // semicolon check
        lex = next(lexemes, result.lex, true)
        // sanity check
        if (!lexemes[lex]) {
          throw error('No program text found after constant definition.', lexemes[lex - 1])
        }
        // where next
        if (lexemes[lex].type !== 'identifier') state = 'crossroads'
        break

      case 'variables':
        // expecting "<identifier>[, <identifier2>, ...]: <type>"
        result = factory.variables(lexemes, lex, routine)
        // add the variables to the routine
        routine.variables = routine.variables.concat(result.variables)
        // semicolon check
        lex = next(lexemes, result.lex, true)
        // sanity check
        if (!lexemes[lex]) {
          throw error('No text found after variable declarations.', lexemes[lex - 1])
        }
        // where next
        if (lexemes[lex].type !== 'identifier') state = 'crossroads'
        break

      case 'procedure': // fallthrough
      case 'function':
        // expecting "<identifier>[(<parameters>)]"
        parent = routineStack[routineStack.length - 1]
        result = factory.subroutine(lexemes, lex, state, parent)

        // semicolon check
        lex = next(lexemes, result.lex, true)

        // set subroutine as the current routine and add to stacks
        routine = result.subroutine
        parent.subroutines.push(routine)
        routineStack.push(routine)

        // where next
        state = 'crossroads'
        break

      case 'begin':
        // expecting routine commands
        let begins = 1
        while (begins > 0 && lexemes[lex]) {
          if (lexemes[lex].content === 'begin') begins += 1
          if (lexemes[lex].content === 'end') begins -= 1
          routine.lexemes.push(lexemes[lex])
          lex += 1
        }

        // error check
        if (begins > 0) {
          throw error('Routine commands must finish with "END".', lexemes[lex])
        }

        // pop off the "end" lexeme
        routine.lexemes.pop()

        // where next
        state = 'end'
        break

      case 'end':
        // expecting "." at the end of the main program, or ";" at the end of a subroutine
        if (routine.index === 0) {
          if (!lexemes[lex]) {
            throw error('Program "END" must be followed by a full stop.', lexemes[lex - 1])
          }
          if (lexemes[lex].content !== '.') {
            throw error('Program "END" must be followed by a full stop.', lexemes[lex])
          }
          if (lexemes[lex + 1]) {
            throw error('No text can appear after program "END".', lexemes[lex + 1])
          }
          lex += 1 // so we exit the main loop
        } else {
          lex = next(lexemes, lex, true)
          routineCount += 1
          routine.index = routineCount
          routines.push(routineStack.pop())
          routine = routineStack[routineStack.length - 1]
          state = 'crossroads'
        }
        break
    }
  }

  // return the routines array
  return routines
}

// index of the next lexeme (after any semicolons)
const next = (lexemes, lex, compulsory = false) => {
  if (compulsory) {
    // there must be a lexeme ...
    if (!lexemes[lex]) {
      throw error('Semicolon needed after statement.', lexemes[lex - 1])
    }

    // ... and it must be a semicolon
    if (lexemes[lex].content !== ';') {
      throw error('Semicolon needed after statement.', lexemes[lex])
    }
  }

  // skip past any semicolons
  while (lexemes[lex] && lexemes[lex].content === ';') lex += 1

  return lex
}
