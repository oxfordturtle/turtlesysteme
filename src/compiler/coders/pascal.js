/*
coder for Turtle Pascal - lexemes making up the atoms of a routine go in, inner pcode for that
routine comes out
*/
import error from '../tools/error.js'
import * as molecules from '../tools/molecules.js'
import * as find from '../tools/find.js'
import * as pcoder from '../tools/pcoder.js'

export const coder = (routine, lex, startLine) => {
  const noSemiAfter = ['begin', 'do', '.', 'repeat', ';', 'then']
  const noSemiBefore = ['else', 'end', ';', 'until']
  let result

  switch (routine.lexemes[lex].type) {
    // identifiers (variable assignment or procedure call)
    case 'turtle': // fallthrough
    case 'identifier':
      // wrong assignment operator
      if (routine.lexemes[lex + 1] && (routine.lexemes[lex + 1].content === '=')) {
        throw error('Variable assignment in Pascal uses ":=", not "=".', routine.lexemes[lex + 1])
      }

      // right assignment operator
      if (routine.lexemes[lex + 1] && (routine.lexemes[lex + 1].content === ':=')) {
        result = molecules.variableAssignment(routine, routine.lexemes[lex].content, lex + 2, 'Pascal')
        break
      }

      // otherwise it should be a procedure call
      result = molecules.procedureCall(routine, lex, 'Pascal')
      break

    // keywords
    case 'keyword':
      switch (routine.lexemes[lex].content) {
        // start of IF structure
        case 'if':
          result = compileIf(routine, lex + 1, startLine)
          break

        // start of FOR structure
        case 'for':
          result = compileFor(routine, lex + 1, startLine)
          break

        // start of REPEAT structure
        case 'repeat':
          result = compileRepeat(routine, lex + 1, startLine)
          break

        // start of WHILE structure
        case 'while':
          result = compileWhile(routine, lex + 1, startLine)
          break

        default:
          throw error('Command cannot begin with {lex}.', routine.lexemes[lex])
      }
      break

    // any thing else is a mistake
    default:
      throw error('Command cannot begin with {lex}.', routine.lexemes[lex])
  }

  // semicolon check
  if (routine.lexemes[result.lex]) {
    if (routine.lexemes[result.lex].content !== ';') {
      if (noSemiAfter.indexOf(routine.lexemes[result.lex - 1].content) === -1) {
        if (noSemiBefore.indexOf(routine.lexemes[result.lex].content) === -1) {
          throw error('Semicolon needed after command.', routine.lexemes[result.lex])
        }
      }
    } else {
      while (routine.lexemes[result.lex] && routine.lexemes[result.lex].content === ';') {
        result.lex += 1
      }
    }
  }

  // all good
  return result
}

// compile conditional
const compileIf = (routine, lex, startLine) => {
  // values we need to generate the IF code
  let test, ifCode, elseCode

  // working variable
  let result

  // expecting a boolean expression
  if (!routine.lexemes[lex]) {
    throw error('"IF" must be followed by a boolean expression.', routine.lexemes[lex - 1])
  }
  result = molecules.expression(routine, lex, 'null', 'boolean', 'Pascal')
  lex = result.lex
  test = result.pcode[0]

  // expecting "then"
  if (!routine.lexemes[lex]) {
    throw error('"IF ..." must be followed by "THEN".', routine.lexemes[lex - 1])
  }
  if (routine.lexemes[lex].content !== 'then') {
    throw error('"IF ..." must be followed by "THEN".', routine.lexemes[lex])
  }
  lex += 1

  // expecting a command or a block of commands
  if (!routine.lexemes[lex]) {
    throw error('No commands found after "IF".', routine.lexemes[lex])
  }
  if (routine.lexemes[lex].content === 'begin') {
    result = block(routine, lex + 1, startLine + 1, 'begin')
  } else {
    result = coder(routine, lex, startLine + 1)
  }
  lex = result.lex
  ifCode = result.pcode

  // happy with an "else" here (but it's optional)
  if (routine.lexemes[lex].content === 'else') {
    // expecting a command or a block of commands
    lex += 1
    if (!routine.lexemes[lex]) {
      throw error('No commands found after "ELSE".', routine.lexemes[lex])
    }
    if (routine.lexemes[lex].content === 'begin') {
      result = block(routine, lex + 1, startLine + ifCode.length + 2, 'begin')
    } else {
      result = coder(routine, lex, startLine + ifCode.length + 2)
    }
    lex = result.lex
    elseCode = result.pcode
  }

  // now we have everything we need
  return { lex, pcode: pcoder.conditional(startLine, test, ifCode, elseCode) }
}

// compile for loop
const compileFor = (routine, lex, startLine) => {
  // values we need to generate the IF code
  let variable, initial, final, compare, change, innerCode

  // working variable
  let result

  // expecting an integer variable
  if (!routine.lexemes[lex]) {
    throw error('"FOR" must be followed by an integer variable.', routine.lexemes[lex - 1])
  }
  if (routine.lexemes[lex].type === 'turtle') {
    throw error('Turtle attribute cannot be used as a "FOR" variable.', routine.lexemes[lex])
  }
  if (routine.lexemes[lex].type !== 'identifier') {
    throw error('"FOR" must be followed by an integer variable.', routine.lexemes[lex])
  }
  variable = find.variable(routine, routine.lexemes[lex].content)
  if (!variable) {
    throw error('Variable {lex} has not been declared.', routine.lexemes[lex])
  }
  if (variable.fulltype.type !== 'integer') {
    throw error('{lex} is not an integer variable.', routine.lexemes[lex])
  }
  lex += 1

  // expecting assignment operator
  if (!routine.lexemes[lex]) {
    throw error('"FOR" loop variable must be assigned an initial value.', routine.lexemes[lex - 1])
  }
  if (routine.lexemes[lex].content === '=') {
    throw error('Assignment operator is ":=", not "=".', routine.lexemes[lex])
  }
  if (routine.lexemes[lex].content !== ':=') {
    throw error('"FOR" loop variable must be assigned an initial value.', routine.lexemes[lex])
  }
  lex += 1

  // expecting integer expression (for the initial value)
  if (!routine.lexemes[lex]) {
    throw error('"FOR" loop variable must be assigned an initial value.', routine.lexemes[lex - 1])
  }
  result = molecules.expression(routine, lex, 'null', 'integer', 'Pascal')
  lex = result.lex
  initial = result.pcode[0]

  // expecting "to" or "downto"
  if (!routine.lexemes[lex]) {
    throw error('"FOR ... := ..." must be followed by "TO" or "DOWNTO".', routine.lexemes[lex - 1])
  }
  switch (routine.lexemes[lex].content) {
    case 'to':
      compare = 'mreq'
      change = 'incr'
      break
    case 'downto':
      compare = 'lseq'
      change = 'decr'
      break
    default:
      throw error('"FOR ... := ..." must be followed by "TO" or "DOWNTO".', routine.lexemes[lex])
  }
  lex += 1

  // expecting integer expression (for the final value)
  if (!routine.lexemes[lex]) {
    throw error('"TO" or "DOWNTO" must be followed by an integer (or integer constant).', routine.lexemes[lex - 1])
  }
  result = molecules.expression(routine, lex, 'null', 'integer', 'Pascal')
  lex = result.lex
  final = result.pcode[0]

  // expecting "do"
  if (!routine.lexemes[lex]) {
    throw error('"FOR" loop range must be followed by "DO".', routine.lexemes[lex - 1])
  }
  if (routine.lexemes[lex].content !== 'do') {
    throw error('"FOR" loop range must be followed by "DO".', routine.lexemes[lex])
  }
  lex += 1

  // expecting a command or block of commands
  if (!routine.lexemes[lex]) {
    throw error('No commands found after "FOR" loop initialisation.', routine.lexemes[lex - 1])
  }
  if (routine.lexemes[lex].content === 'begin') {
    result = block(routine, lex + 1, startLine + 3, 'begin')
  } else {
    result = coder(routine, lex, startLine + 3)
  }
  lex = result.lex
  innerCode = result.pcode

  // now we have everything we need
  return {
    lex,
    pcode: pcoder.forLoop(startLine, variable, initial, final, compare, change, innerCode)
  }
}

// compile repeat loop
const compileRepeat = (routine, lex, startLine) => {
  // values we need to generate the REPEAT code
  let test, innerCode

  // working variable
  let result

  // expecting a block of code
  result = block(routine, lex, startLine, 'repeat')
  lex = result.lex
  innerCode = result.pcode

  // expecting a boolean expression
  if (!routine.lexemes[lex]) {
    throw error('"UNTIL" must be followed by a boolean expression.', routine.lexemes[lex - 1])
  }
  result = molecules.expression(routine, lex, 'null', 'boolean', false)
  lex = result.lex
  test = result.pcode[0]

  // now we have everything we need
  return { lex, pcode: pcoder.repeatLoop(startLine, test, innerCode) }
}

// compile while loop
const compileWhile = (routine, lex, startLine) => {
  // values we need to generate the WHILE code
  let test, innerCode

  // working variable
  let result

  // expecting a boolean expression
  if (!routine.lexemes[lex]) {
    throw error('"WHILE" must be followed by a boolean expression.', routine.lexemes[lex - 1])
  }
  result = molecules.expression(routine, lex, 'null', 'boolean', false)
  lex = result.lex
  test = result.pcode[0]

  // expecting "DO"
  if (!routine.lexemes[lex]) {
    throw error('"WHILE ..." must be followed by "DO".', routine.lexemes[lex - 1])
  }
  if (routine.lexemes[lex].content !== 'do') {
    throw error('"WHILE ..." must be followed by "DO".', routine.lexemes[lex])
  }
  lex += 1

  // expecting a block of code
  if (!routine.lexemes[lex]) {
    throw error('No commands found after "WHILE" loop initialisation.', routine.lexemes[lex])
  }
  if (routine.lexemes[lex].content === 'begin') {
    result = block(routine, lex + 1, startLine + 1, 'begin')
  } else {
    result = coder(routine, lex, startLine + 1)
  }
  lex = result.lex
  innerCode = result.pcode

  // now we have everything we need to generate the pcode
  return { lex, pcode: pcoder.whileLoop(startLine, test, innerCode) }
}

// generate the pcode for a block (i.e. a sequence of commands/structures)
const block = (routine, lex, startLine, startKeyword) => {
  let pcode = []
  let pcodeTemp
  let end = false

  // expecting something
  if (!routine.lexemes[lex]) throw error('No commands found after "BEGIN".', routine.lexemes[lex - 1])

  // loop through until the end of the block (or we run out of lexemes)
  while (!end && (lex < routine.lexemes.length)) {
    end = blockEndCheck(startKeyword, routine.lexemes[lex])
    if (end) {
      // move past the end lexeme
      lex += 1
    } else {
      // compile the structure
      pcodeTemp = pcode
      ;({ lex, pcode } = coder(routine, lex, startLine + pcode.length))
      pcode = pcodeTemp.concat(pcode)
    }
  }

  // if we've run out of lexemes without reaching the end, this is an error
  if (!end) throw error('"BEGIN" does not have any matching "END".', routine.lexemes[lex - 1])

  // otherwise all good
  return { lex, pcode }
}

// check for the ending to a block, and throw an error if it doesn't match the beginning
const blockEndCheck = (start, lexeme) => {
  switch (lexeme.content) {
    case 'end':
      if (start !== 'begin') throw error('"END" does not have any matching "BEGIN".', lexeme)
      return true

    case 'until':
      if (start !== 'repeat') throw error('"UNTIL" does not have any matching "REPEAT".', lexeme)
      return true

    default:
      return false
  }
}
