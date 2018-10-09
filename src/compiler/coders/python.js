/*
coder for Turtle Python

this function compiles a "command structure" for Turtle Python

a command structure is either a single command (i.e. a variable assignment or a procedure call) or
some more complex structure (conditional, loop) containing a series of such commands; in the latter
case, the exported function calls itself recusrively, allowing for structures of indefinite
complexity

a program or subroutine is a sequence of command structures; this function comiles a single one,
returning the pcode and the index of the next lexeme - the function calling this function (in the
main coder module) loops through the lexemes until all command structures have been compiled
*/
import error from '../tools/error.js'
import * as molecules from '../tools/molecules.js'
import * as find from '../tools/find.js'
import * as pcoder from '../tools/pcoder.js'

export const coder = (routine, lex, startLine) => {
  let result

  switch (routine.lexemes[lex].type) {
    // identifiers (variable assignment or procedure call)
    case 'turtle': // fallthrough
    case 'identifier':
      // wrong assignment operator
      if (routine.lexemes[lex + 1] && (routine.lexemes[lex + 1].content === '==')) {
        throw error('Variable assignment in Python uses "=", not "==".', routine.lexemes[lex + 1])
      }

      // right assignment operator
      if (routine.lexemes[lex + 1] && (routine.lexemes[lex + 1].content === '=')) {
        result = molecules.variableAssignment(routine, routine.lexemes[lex].content, lex + 2, 'Python')
        break
      }

      // otherwise it should be a procedure call
      result = molecules.procedureCall(routine, lex, 'Python')
      break

    // keywords
    case 'keyword':
      switch (routine.lexemes[lex].content) {
        // return (assign return variable of a function)
        case 'return':
          result = molecules.variableAssignment(routine, 'return', lex + 1, 'Python')
          break

        // start of IF structure
        case 'if':
          result = compileIf(routine, lex + 1, startLine)
          break

        // start of FOR structure
        case 'for':
          result = compileFor(routine, lex + 1, startLine)
          break

        // start of WHILE structure
        case 'while':
          result = compileWhile(routine, lex + 1, startLine)
          break

        default:
          throw error('{lex} makes no sense here.', routine.lexemes[lex])
      }
      break

    // any thing else is a mistake
    default:
      throw error('{lex} makes no sense here.', routine.lexemes[lex])
  }

  // end of command check
  if (routine.lexemes[result.lex] && routine.lexemes[result.lex].line === routine.lexemes[result.lex - 1].line) {
    throw error('Command must be on a new line.', routine.lexemes[result.lex])
  }

  // all good
  return result
}

// generate the pcode for an IF structure
const compileIf = (routine, lex, startLine) => {
  // values we need to generate the IF code
  let test, ifCode, elseCode

  // working variable
  let result

  // expecting a boolean expression on the same line
  if (!routine.lexemes[lex]) {
    throw error('if01', routine.lexemes[lex - 1])
  }
  if (!isSameLine(routine.lexemes, lex)) {
    throw error('if02', routine.lexemes[lex])
  }
  result = molecules.expression(routine, lex, 'null', 'boolean', 'Python')
  lex = result.lex
  test = result.pcode[0]

  // expecting a colon on the same line
  if (!routine.lexemes[lex]) {
    throw error('if03', routine.lexemes[lex - 1])
  }
  if (!isSameLineContent(routine.lexemes, lex, ':')) {
    throw error('if04', routine.lexemes[lex])
  }
  lex += 1

  // expecting some commands indented on a new line
  if (!routine.lexemes[lex]) {
    throw error('if05', routine.lexemes[lex - 1])
  }
  if (isSameLine(routine.lexemes, lex)) {
    throw error('if06', routine.lexemes[lex])
  }
  if (!isIndented(routine.lexemes, lex)) {
    throw error('if07', routine.lexemes[lex])
  }
  result = block(routine, lex, startLine + 1, routine.lexemes[lex].offset)
  lex = result.lex
  ifCode = result.pcode

  // happy with an "else" here (but it's optional)
  if (routine.lexemes[lex] && (routine.lexemes[lex].content === 'else')) {
    // check we're on a new line
    if (isSameLine(routine.lexemes, lex)) {
      throw error('if08', routine.lexemes[lex])
    }
    lex += 1

    // expecting a colon on the same line
    if (!routine.lexemes[lex]) {
      throw error('if09', routine.lexemes[lex - 1])
    }
    if (!isSameLineContent(routine.lexemes, lex, ':')) {
      throw error('if10', routine.lexemes[lex])
    }
    lex += 1

    // expecting some commands indented on a new line
    if (!routine.lexemes[lex]) {
      throw error('if11', routine.lexemes[lex - 1])
    }
    if (isSameLine(routine.lexemes, lex)) {
      throw error('if12', routine.lexemes[lex])
    }
    if (!isIndented(routine.lexemes, lex)) {
      throw error('if13', routine.lexemes[lex])
    }
    result = block(routine, lex, startLine + ifCode.length + 2, routine.lexemes[lex].offset)
    lex = result.lex
    elseCode = result.pcode
  }

  // now we have everything we need
  return { lex, pcode: pcoder.conditional(startLine, test, ifCode, elseCode) }
}

// generate the pcode for a FOR structure
const compileFor = (routine, lex, startLine) => {
  // values we need to generate the IF code
  let variable, initial, final, compare, change, innerCode

  // working variable
  let result

  // expecting an integer variable
  if (!routine.lexemes[lex]) {
    throw error('for01', routine.lexemes[lex - 1])
  }
  if (routine.lexemes[lex].type === 'turtle') {
    throw error('for02', routine.lexemes[lex])
  }
  if (!isSameLineType(routine.lexemes, lex, 'identifier')) {
    throw error('for03', routine.lexemes[lex])
  }
  variable = find.variable(routine, routine.lexemes[lex].content, 'Python')
  if (!variable) {
    throw error('for04', routine.lexemes[lex])
  }
  if ((variable.fulltype.type !== 'integer') && (variable.fulltype.type !== 'boolint')) {
    throw error('for05', routine.lexemes[lex])
  }
  lex += 1

  // expecting 'in'
  if (!routine.lexemes[lex]) {
    throw error('for06', routine.lexemes[lex - 1])
  }
  if (!isSameLineContent(routine.lexemes, lex, 'in')) {
    throw error('for07', routine.lexemes[lex])
  }
  lex += 1

  // expecting 'range'
  if (!routine.lexemes[lex]) {
    throw error('for08', routine.lexemes[lex - 1])
  }
  if (!isSameLineContent(routine.lexemes, lex, 'range')) {
    throw error('for09', routine.lexemes[lex])
  }
  lex += 1

  // expecting a left bracket
  if (!routine.lexemes[lex]) {
    throw error('for10', routine.lexemes[lex - 1])
  }
  if (!isSameLineContent(routine.lexemes, lex, '(')) {
    throw error('for11', routine.lexemes[lex])
  }
  lex += 1

  // expecting an integer expression (for the initial value)
  if (!routine.lexemes[lex]) {
    throw error('for12', routine.lexemes[lex - 1])
  }
  if (!isSameLine(routine.lexemes, lex)) {
    throw error('for13', routine.lexemes[lex])
  }
  result = molecules.expression(routine, lex, 'null', 'integer', 'Python')
  lex = result.lex
  initial = result.pcode[0]

  // expecting a comma
  if (!routine.lexemes[lex]) {
    throw error('for14', routine.lexemes[lex - 1])
  }
  if (!isSameLineContent(routine.lexemes, lex, ',')) {
    throw error('for15', routine.lexemes[lex])
  }
  lex += 1

  // expecting an integer expression (for the final value)
  if (!routine.lexemes[lex]) {
    throw error('for16', routine.lexemes[lex - 1])
  }
  if (!isSameLine(routine.lexemes, lex)) {
    throw error('for17', routine.lexemes[lex])
  }
  result = molecules.expression(routine, lex, 'null', 'integer', 'Python')
  lex = result.lex
  final = result.pcode[0]

  // now expecting another comma
  if (!routine.lexemes[lex]) {
    throw error('for18', routine.lexemes[lex - 1])
  }
  if (!isSameLineContent(routine.lexemes, lex, ',')) {
    throw error('for19', routine.lexemes[lex])
  }
  lex += 1

  // expecting either '1' or '-1'
  if (!routine.lexemes[lex]) {
    throw error('for20', routine.lexemes[lex - 1])
  }
  if (!isSameLine(routine.lexemes, lex)) {
    throw error('for21', routine.lexemes[lex])
  }
  if (routine.lexemes[lex].type === 'integer') {
    // only 1 is allowed
    if (routine.lexemes[lex].value !== 1) {
      throw error('for22', routine.lexemes[lex])
    }
    // otherwise ok
    compare = 'more'
    change = 'incr'
  } else if (routine.lexemes[lex].content === '-') {
    lex += 1
    // now expecting '1'
    if (!routine.lexemes[lex]) {
      throw error('for23', routine.lexemes[lex - 1])
    }
    if (!isSameLineType(routine.lexemes, lex, 'integer')) {
      throw error('for24', routine.lexemes[lex])
    }
    if (routine.lexemes[lex].value !== 1) {
      throw error('for25', routine.lexemes[lex])
    }
    compare = 'less'
    change = 'decr'
  } else {
    throw error('for26', routine.lexemes[lex])
  }
  lex += 1

  // expecting a right bracket
  if (!routine.lexemes[lex]) {
    throw error('for27', routine.lexemes[lex - 1])
  }
  if (!isSameLineContent(routine.lexemes, lex, ')')) {
    throw error('for28', routine.lexemes[lex])
  }
  lex += 1

  // expecting a colon
  if (!routine.lexemes[lex]) {
    throw error('for29', routine.lexemes[lex - 1])
  }
  if (!isSameLineContent(routine.lexemes, lex, ':')) {
    throw error('for30', routine.lexemes[lex])
  }
  lex += 1

  // now expecting a block of code, indented on a new line
  if (!routine.lexemes[lex]) {
    throw error('for31', routine.lexemes[lex - 1])
  }
  if (isSameLine(routine.lexemes, lex)) {
    throw error('for32', routine.lexemes[lex])
  }
  if (!isIndented(routine.lexemes, lex)) {
    throw error('for33', routine.lexemes[lex])
  }
  result = block(routine, lex, startLine + 3, routine.lexemes[lex].offset)
  lex = result.lex
  innerCode = result.pcode

  // now we have everything we need
  return {
    lex,
    pcode: pcoder.forLoop(startLine, variable, initial, final, compare, change, innerCode)
  }
}

// generate the pcode for a WHILE structure
const compileWhile = (routine, lex, startLine) => {
  // values we need to generate the WHILE code
  let test, innerCode

  // working variable
  let result

  // expecting a boolean expression on the same line
  if (!routine.lexemes[lex]) {
    throw error('while01', routine.lexemes[lex - 1])
  }
  if (!isSameLine(routine.lexemes, lex)) {
    throw error('while02', routine.lexemes[lex])
  }
  result = molecules.expression(routine, lex, 'null', 'boolean', 'Python')
  lex = result.lex
  test = result.pcode[0]

  // expecting a colon on the same line
  if (!routine.lexemes[lex]) {
    throw error('while03', routine.lexemes[lex - 1])
  }
  if (!isSameLineContent(routine.lexemes, lex, ':')) {
    throw error('while04', routine.lexemes[lex])
  }
  lex += 1

  // expecting a block of code, indented on a new line
  if (!routine.lexemes[lex]) {
    throw error('while05', routine.lexemes[lex - 1])
  }
  if (isSameLine(routine.lexemes, lex)) {
    throw error('while06', routine.lexemes[lex])
  }
  if (!isIndented(routine.lexemes, lex)) {
    throw error('while07', routine.lexemes[lex])
  }
  result = block(routine, lex, startLine + 1, routine.lexemes[lex].offset)
  lex = result.lex
  innerCode = result.pcode

  // now we have everything we need
  return { lex, pcode: pcoder.whileLoop(startLine, test, innerCode) }
}

// check lexeme is on the same line as previous
const isSameLine = (lexemes, lex) =>
  (lexemes[lex].line === lexemes[lex - 1].line)

// check lexeme has a certain type and is on the same line as previous
const isSameLineType = (lexemes, lex, type) =>
  isSameLine(lexemes, lex) && (lexemes[lex].type === type)

// check lexeme has a certain content and is on the same line as previous
const isSameLineContent = (lexemes, lex, content) =>
  isSameLine(lexemes, lex) && (lexemes[lex].content === content)

// check lexeme is indented more than the previous one
const isIndented = (lexemes, lex) =>
  (lexemes[lex].offset > lexemes[lex - 1].offset)

// generate the pcode for a block (i.e. a sequence of commands/structures)
const block = (routine, lex, startLine, offset) => {
  let pcode = []
  let pcodeTemp
  let end = false

  // expecting something
  if (!routine.lexemes[lex]) {
    throw error('blockNothing', routine.lexemes[lex - 1])
  }

  // loop through until the end of the block (or we run out of lexemes)
  while (!end && (lex < routine.lexemes.length)) {
    end = (routine.lexemes[lex].offset < offset)
    if (!end) {
      // compile the structure
      pcodeTemp = pcode
      ;({ lex, pcode } = coder(routine, lex, startLine + pcode.length))
      pcode = pcodeTemp.concat(pcode)
    }
  }

  return { lex, pcode }
}
