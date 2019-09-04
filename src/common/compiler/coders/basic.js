/*
coder for Turtle BASIC - lexemes making up the atoms of a routine go in, inner pcode for that
routine comes out
*/
import error from '../tools/error'
import * as molecules from '../tools/molecules'
import * as find from '../tools/find'
import * as pcoder from '../tools/pcoder'

// the coder is the default export, but it needs to be named so it can call itself recursively
const coder = (routine, lex, startLine, oneLine = false) => {
  let result

  switch (routine.lexemes[lex].type) {
    // identifiers (variable assignment or procedure call)
    case 'turtle': // fallthrough
    case 'identifier':
      // variable assignment
      if (routine.lexemes[lex + 1] && (routine.lexemes[lex + 1].content === '=')) {
        result = molecules.variableAssignment(routine, routine.lexemes[lex].content, lex + 2, 'BASIC')
        break
      }

      // otherwise it should be a procedure call
      result = molecules.procedureCall(routine, lex, 'BASIC')
      break

    // keywords
    default:
      switch (routine.lexemes[lex].content) {
        // start of IF structure
        case 'IF':
          result = compileIf(routine, lex + 1, startLine)
          break

        // start of FOR structure
        case 'FOR':
          result = compileFor(routine, lex + 1, startLine)
          break

        // start of REPEAT structure
        case 'REPEAT':
          result = compileRepeat(routine, lex + 1, startLine)
          break

        // start of WHILE structure
        case 'WHILE':
          result = compileWhile(routine, lex + 1, startLine)
          break

        // function return value
        case '=':
          result = molecules.variableAssignment(routine, '!result', lex + 1, 'BASIC')
          break

        default:
          throw error('Statement cannot begin with {lex}.', routine.lexemes[lex])
      }
      break
  }

  // end of statement check
  // bypass within oneLine IF...THEN...ELSE statement (check occurs at the end of the whole statement)
  if (!oneLine && routine.lexemes[result.lex]) {
    if (routine.lexemes[result.lex].content === ':' || routine.lexemes[result.lex].type === 'NEWLINE') {
      result.lex += 1
    } else {
      throw error('Statements must be separated by a colon or placed on different lines.', routine.lexemes[result.lex])
    }
  }

  // all good
  return result
}

export default coder

// compile conditional
const compileIf = (routine, lex, startLine) => {
  // values we need to generate the IF code
  let test, ifCode, elseCode, oneLine

  // working variable
  let result

  // expecting a boolean expression
  if (!routine.lexemes[lex]) {
    throw error('"IF" must be followed by a boolean expression.', routine.lexemes[lex - 1])
  }
  result = molecules.expression(routine, lex, 'null', 'boolean', 'BASIC')
  lex = result.lex
  test = result.pcode

  // expecting "then"
  if (!routine.lexemes[lex]) {
    throw error('"IF ..." must be followed by "THEN".', routine.lexemes[lex - 1])
  }
  if (routine.lexemes[lex].content !== 'THEN') {
    throw error('"IF ..." must be followed by "THEN".', routine.lexemes[lex])
  }
  lex += 1

  // expecting a statement on the same line or a block of statements on a new line
  if (!routine.lexemes[lex]) {
    throw error('No statements found after "IF ... THEN".', routine.lexemes[lex])
  }
  if (routine.lexemes[lex].type === 'NEWLINE') {
    result = block(routine, lex + 1, startLine + 1, 'IF')
    oneLine = false
  } else {
    oneLine = true
    result = coder(routine, lex, startLine + 1, oneLine)
  }
  lex = result.lex
  ifCode = result.pcode

  // happy with an "else" here (but it's optional)
  if (routine.lexemes[lex] && routine.lexemes[lex].content === 'ELSE') {
    lex += 1
    if (!routine.lexemes[lex]) {
      throw error('No statements found after "ELSE".', routine.lexemes[lex])
    }
    if (oneLine) {
      if (routine.lexemes[lex].type === 'NEWLINE') {
        throw error('Statement following "ELSE" cannot be on a new line.', routine.lexemes[lex + 1])
      }
      result = coder(routine, lex, startLine + ifCode.length + 2, oneLine)
    } else {
      if (routine.lexemes[lex].type !== 'NEWLINE') {
        throw error('Statement following "ELSE" must be on a new line.', routine.lexemes[lex])
      }
      result = block(routine, lex + 1, startLine + ifCode.length + 2, 'ELSE')
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
    throw error('Variable {lex} not defined.', routine.lexemes[lex])
  }
  if (variable.fulltype.type !== 'integer' && variable.fulltype.type !== 'boolint') {
    throw error('{lex} is not an integer variable.', routine.lexemes[lex])
  }
  lex += 1

  // expecting assignment operator
  if (!routine.lexemes[lex]) {
    throw error('"FOR" loop variable must be assigned an initial value.', routine.lexemes[lex - 1])
  }
  if (routine.lexemes[lex].content !== '=') {
    throw error('"FOR" loop variable must be assigned an initial value.', routine.lexemes[lex])
  }
  lex += 1

  // expecting integer expression (for the initial value)
  if (!routine.lexemes[lex]) {
    throw error('"FOR" loop variable must be assigned an initial value.', routine.lexemes[lex - 1])
  }
  result = molecules.expression(routine, lex, 'null', 'integer', 'BASIC')
  lex = result.lex
  initial = result.pcode[0]

  // expecting "to"
  if (!routine.lexemes[lex]) {
    throw error('forToDownTo', routine.lexemes[lex - 1])
  }
  if (routine.lexemes[lex].content !== 'TO') {
    throw error('"FOR" loop initialisation must be followed by "TO".', routine.lexemes[lex])
  }
  lex += 1

  // expecting integer expression (for the final value)
  if (!routine.lexemes[lex]) {
    throw error('"TO" must be followed by an integer (or integer constant).', routine.lexemes[lex - 1])
  }
  result = molecules.expression(routine, lex, 'null', 'integer', 'BASIC')
  lex = result.lex
  final = result.pcode[0]

  // "STEP -1" possible here
  if (routine.lexemes[lex] && routine.lexemes[lex].content === 'STEP') {
    lex += 1
    if (!routine.lexemes[lex]) {
      throw error('"STEP" instruction must be of the form "STEP -1".', routine.lexemes[lex - 1])
    }
    if (routine.lexemes[lex].content !== '-') {
      throw error('"STEP" instruction must be of the form "STEP -1".', routine.lexemes[lex])
    }
    lex += 1
    if (!routine.lexemes[lex]) {
      throw error('"STEP" instruction must be of the form "STEP -1".', routine.lexemes[lex - 1])
    }
    if (routine.lexemes[lex].value !== 1) {
      throw error('"STEP" instruction must be of the form "STEP -1".', routine.lexemes[lex])
    }
    lex += 1
    compare = 'lseq'
    change = 'decr'
  } else {
    compare = 'mreq'
    change = 'incr'
  }

  // expecting a statement on the same line or a block of statements on a new line
  if (!routine.lexemes[lex]) {
    throw error('No statements found after "FOR" loop initialisation.', routine.lexemes[lex])
  }
  if (routine.lexemes[lex].type === 'NEWLINE') {
    result = block(routine, lex + 1, startLine + 3, 'FOR')
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
  let test
  let innerCode

  // working variable
  let result

  // expecting a statement on the same line or a block of statements on a new line
  if (!routine.lexemes[lex]) {
    throw error('No statements found after "REPEAT".', routine.lexemes[lex])
  }
  if (routine.lexemes[lex].type === 'NEWLINE') {
    result = block(routine, lex + 1, startLine, 'REPEAT')
  } else {
    result = coder(routine, lex, startLine)
  }
  lex = result.lex
  innerCode = result.pcode

  // expecting a boolean expression
  if (!routine.lexemes[lex]) {
    throw error('"UNTIL" must be followed by a boolean expression.', routine.lexemes[lex - 1])
  }
  result = molecules.expression(routine, lex, 'null', 'boolean', 'BASIC')
  lex = result.lex
  test = result.pcode

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
  result = molecules.expression(routine, lex, 'null', 'boolean', 'BASIC')
  lex = result.lex
  test = result.pcode

  // expecting a statement on the same line or a block of statements on a new line
  if (!routine.lexemes[lex]) {
    throw error('No commands found after "WHILE ... DO".', routine.lexemes[lex])
  }
  if (routine.lexemes[lex].type === 'NEWLINE') {
    result = block(routine, lex + 1, startLine + 1, 'WHILE')
  } else {
    result = coder(routine, lex, startLine + 1)
  }
  lex = result.lex
  innerCode = result.pcode

  // now we have everything we need to generate the pcode
  return { lex, pcode: pcoder.whileLoop(startLine, test, innerCode) }
}

// generate the pcode for a block of commands
const block = (routine, lex, startLine, startKeyword) => {
  let pcode = []
  let result
  let end = false

  // expecting something
  if (!routine.lexemes[lex]) {
    throw error(`No commands found after "${startKeyword}".`, routine.lexemes[lex - 1])
  }

  // loop through until the end of the block (or we run out of lexemes)
  while (!end && (lex < routine.lexemes.length)) {
    end = blockEndCheck(startKeyword, routine.lexemes[lex])
    if (end) {
      // move past the next lexeme, unless it's "else"
      if (routine.lexemes[lex].content !== 'ELSE') lex += 1
    } else {
      // compile the structure
      result = coder(routine, lex, startLine + pcode.length)
      pcode = pcode.concat(result.pcode)
      lex = result.lex
    }
  }

  // final checks
  if (!end) throw error(`Unterminated "${startKeyword}" statement.`, routine.lexemes[lex - 1])
  /* if (routine.lexemes[lex + 1]) {
    if (routine.lexemes[lex + 1].type === 'NEWLINE') {
      while (routine.lexemes[lex + 1].type === 'NEWLINE') lex += 1
    } else {
      throw error('Statement must be on a new line.', routine.lexemes[lex])
    }
  } */

  // otherwise all good
  return { lex, pcode }
}

// check for the ending to a block, and throw an error if it doesn't match the beginning
const blockEndCheck = (start, lexeme) => {
  switch (lexeme.content) {
    case 'ELSE':
      if (start !== 'IF') {
        throw error('"ELSE" does not have any matching "IF".', lexeme)
      }
      return true

    case 'ENDIF':
      if ((start !== 'IF') && (start !== 'ELSE')) {
        throw error('"ENDIF" does not have any matching "IF".', lexeme)
      }
      return true

    case 'NEXT':
      if (start !== 'FOR') {
        throw error('"NEXT" does not have any matching "FOR".', lexeme)
      }
      return true

    case 'UNTIL':
      if (start !== 'REPEAT') {
        throw error('"UNTIL" does not have any matching "REPEAT".', lexeme)
      }
      return true

    case 'ENDWHILE':
      if (start !== 'WHILE') {
        throw error('"ENDWHILE" does not have any matching "WHILE".', lexeme)
      }
      return true

    default:
      return false
  }
}
