/*
coder for Turtle Pascal - lexemes making up the atoms of a routine go in, inner pcode for that
routine comes out
*/
import error from '../tools/error.js'
import * as molecules from '../tools/molecules.js'
// import * as find from '../tools/find.js'
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
          throw error('{lex} makes no sense here.', routine.lexemes[lex])
      }
      break

    // any thing else is a mistake
    default:
      throw error('{lex} makes no sense here.', routine.lexemes[lex])
  }

  // semicolon check
  if (routine.lexemes[result.lex]) {
    if (routine.lexemes[result.lex].content !== ';') {
      if (noSemiAfter.indexOf(routine.lexemes[result.lex - 1].content) === -1) {
        if (noSemiBefore.indexOf(routine.lexemes[result.lex].content) === -1) {
          throw error('cmdSemicolon', routine.lexemes[result.lex])
        }
      }
    } else {
      while (routine.lexemes[result.lex] && routine.lexemes[result.lex].content === ';') {
        result.lex += 1
      }
    }
  }
  return result
}

// compile conditional
const compileIf = (routine, lex, startLine) => {}

// compile for loop
const compileFor = (routine, lex, startLine) => {}

// compile repeat loop
const compileRepeat = (routine, lex, startLine) => {
  let result, innerCode, test

  // expecting a block of code
  result = block(routine, lex, startLine, 'repeat')
  lex = result.lex
  innerCode = result.pcode

  // expecting a boolean expression
  if (!routine.lexemes[lex]) {
    throw error('repeat01', 'repeatExpression', routine.lexemes[lex - 1])
  }
  result = molecules.expression(routine, lex, 'null', 'boolean', false)
  lex = result.lex
  test = result.pcode[0]

  // now we have everything we need
  return { lex, pcode: pcoder.repeatLoop(startLine, test, innerCode) }
}

// compile while loop
const compileWhile = (routine, lex, startLine) => {
  let result, test, innerCode

  // expecting a boolean expression
  if (!routine.lexemes[lex]) {
    throw error('while01', 'whileExpression', routine.lexemes[lex - 1])
  }
  result = molecules.expression(routine, lex, 'null', 'boolean', false)
  lex = result.lex
  test = result.pcode[0]

  // expecting "DO"
  if (!routine.lexemes[lex]) {
    throw error('while02', 'whileDo', routine.lexemes[lex - 1])
  }
  if (routine.lexemes[lex].content !== 'do') {
    throw error('while03', 'whileDo', routine.lexemes[lex])
  }
  lex += 1

  // expecting a block of code
  if (!routine.lexemes[lex]) {
    throw error('while04', 'whileNothing', routine.lexemes[lex])
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
  if (!routine.lexemes[lex]) throw error('blockNothing', routine.lexemes[lex - 1])

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
  if (!end) throw error('blockNoEnd', routine.lexemes[lex - 1])

  // otherwise all good
  return { lex, pcode }
}

// check for the ending to a block, and throw an error if it doesn't match the beginning
const blockEndCheck = (start, lexeme) => {
  switch (lexeme.content) {
    case 'end':
      if (start !== 'begin') throw error('blockBegin', lexeme)
      return true

    case 'until':
      if (start !== 'repeat') throw error('blockRepeat', lexeme)
      return true

    default:
      return false
  }
}

/*
// create an error message
const message = (id, lexeme) => {
  switch (id) {
    case 'ifExpression':
      return '"IF" must be followed by a boolean expression.'
    case 'ifThen':
      return '"IF ..." must be followed by "THEN".'
    case 'ifNothing':
      return 'No commands found after "IF".'
    case 'elseNothing':
      return 'No commands found after "ELSE".'
    case 'forVariable':
      return '"FOR" must be followed by an integer variable.'
    case 'forTurtle':
      return 'Turtle attribute cannot be used as a "FOR" variable.'
    case 'forNotFound':
      return `Variable "${lexeme.content}" not defined.`
    case 'forNotInteger':
      return `"${lexeme.content}" is not an integer variable.`
    case 'forAssignment':
      return '"FOR" variable must be assigned an initial value.'
    case 'forEquals':
      return 'Assignment operator is ":=", not "=".'
    case 'forInitial':
      return '"FOR" loop variable must be assigned an initial value.'
    case 'forToDownTo':
      return '"FOR ... := ..." must be followed by "TO" or "DOWNTO".'
    case 'forToNothing':
      return `"${lexeme.content.toUpperCase()}" must be followed by an integer (or integer constant).`
    case 'forDo':
      return '"FOR" loop range must be followed by "DO".'
    case 'forNothing':
      return 'No commands found after "FOR" loop initialisation.'
    case 'repeatExpression':
      return '"UNTIL" must be followed by a boolean expression.'
    case 'whileExpression':
      return '"WHILE" must be followed by a boolean expression.'
    case 'whileDo':
      return '"WHILE ..." must be followed by "DO".'
    case 'whileNothing':
      return 'No commands found after "WHILE ... DO".'
    case 'blockNothing':
      return 'No commands found after "BEGIN".'
    case 'blockBegin':
      return `"END" expected, not "${lexeme.content.toUpperCase()}".`
    case 'blockRepeat':
      return `"UNTIL" expected, not "${lexeme.content.toUpperCase()}".`
    case 'blockNoEnd':
      return '"BEGIN" does not have any matching "END".'
    case 'cmdEqal':
      return 'Variable assignment requires ":=" rather than "=".'
    case 'cmdSemicolon':
      return 'Semicolon needed after command.'
    case 'cmdWeird':
      return `Command cannot begin with "${lexeme.content}".`
    default:
      return id
  }
}

// create an error object
const error = (messageId, lexeme) =>
  ({ messageId, message: message(messageId), lexeme })

// generate the pcode for an IF structure
const compileIf = (routine, lex, startLine) => {
  const lexemes = routine.lexemes
  let pcode = []
  let result = {}
  let ifnoLine = 0
  let elseJump = 0
  // if we're here, the previous lexeme was IF
  // so now we're expecting a boolean expression
  if (!lexemes[lex]) {
    throw error('if01', 'ifExpression', lexemes[lex - 1])
  }
  // evaluate the boolean expression
  result = molecules.expression(routine, lex, 'null', 'bool', false)
  lex = result.lex
  pcode = result.pcode
  // push IFNO to the end of the pcode, and save the line for fixing the jump later
  ifnoLine = pcode.length - 1
  pcode[ifnoLine].push(pc.ifno)
  // expecting THEN
  if (!lexemes[lex]) {
    throw error('if02', 'ifThen', lexemes[lex - 1])
  }
  if (lexemes[lex].type !== 'then') {
    throw error('if03', 'ifThen', lexemes[lex])
  }
  // expecting some commands next
  lex += 1
  if (!lexemes[lex]) {
    throw error('if07', 'ifNothing', lexemes[lex])
  }
  // now things are a bit different for the different languages ...
  if (lexemes[lex].type === 'begin') {
    // if there's a BEGIN, expect a block of structures
    result = block(routine, lex + 1, offset + pcode.length, 'begin', null)
  } else {
    // otherwise just expect a single structure
    result = structure(routines, sub, lex, addresses, offset + pcode.length)
  }
  lex = result.lex
  pcode = pcode.concat(result.pcode)
  // ? ... ELSE ... ?
  if (lexemes[lex].content === 'else') {
    lex += 1 // move past 'else'
    if (!lexemes[lex]) {
      throw error('if04', 'elseNothing', lexemes[lex])
    }
    elseJump = pcode.length
    pcode.push([pc.jump])
    if (lexemes[lex].content === 'begin') {
      // if there's a BEGIN, expect a block of structures
      result = block(routines, sub, lex + 1, addresses, offset + pcode.length, 'begin', null)
    } else {
      // otherwise just expect a single structure
      result = structure(routines, sub, lex, addresses, offset + pcode.length)
    }
    lex = result.lex
    pcode = pcode.concat(result.pcode)
    pcode[elseJump].push(offset + pcode.length + 1)
    pcode[ifnoLine].push(offset + elseJump + 2)
  } else {
    // no ELSE, just finish the IF
    pcode[ifnoLine].push(offset + pcode.length + 1)
  }
  return { lex, pcode }
}

// generate the pcode for a FOR structure
const compileFor = (routine, lex, startLine) => {
  const lexemes = routine.lexemes
  let result
  let variable
  let compare
  let change
  let initial
  let final
  let innerCode

  // now we have everything we need to generate the pcode
  return { lex, pcode: pcoder.forLoop(startLine, variable, initial, final, compare, change, innerCode) }
}

  let lexemes = routine.lexemes
  let pcode = []
  let result = {}
  let variable = {}
  let increment = 0
  if (!lexemes[lex]) {
    throw error('for01', 'forVariable', lexemes[lex - 1])
  }
  if (lexemes[lex].type === 'turtle') {
    throw error('for02', 'forTurtle', lexemes[lex])
  }
  if (lexemes[lex].type !== 'identifier') {
    throw error('for03', 'forVariable', lexemes[lex])
  }
  variable = find.variable(routines, sub, lexemes[lex].string)
  if (!variable) {
    throw error('for04', 'forNotFound', lexemes[lex])
  }
  if ((variable.type !== 'int') && (variable.type !== 'boolint')) {
    throw error('for05', 'forNotInteger', lexemes[lex])
  }
  if (!lexemes[lex + 1]) {
    throw error('for06', 'forAssignment', lexemes[lex])
  }
  lex += 1
  switch (language) {
    case 'BASIC':
      if (lexemes[lex].type !== 'eqal') {
        throw error('for08', 'forAssignment', lexemes[lex])
      }
      break
    case 'Pascal':
      if (lexemes[lex].type === 'eqal') {
        throw error('for07', 'forEquals', lexemes[lex])
      }
      if (lexemes[lex].type !== 'asgn') {
        throw error('for08', 'forAssignment', lexemes[lex])
      }
      break
    case 'Python':
      // WIP ...
      break
  }
  if (!lexemes[lex + 1]) {
    throw error('for09', 'forInitial', lexemes[lex])
  }
  lex += 1
  result = commands.expression(routines, sub, lex, addresses, 'null', 'int', false)
  lex = result.lex
  pcode = result.pcode
  pcode.push(values.storeVariable(variable))
  if (!lexemes[lex]) {
    throw error('for10', 'forToDownTo', lexemes[lex - 1])
  }
  switch (lexemes[lex].type) {
    case 'to':
      increment = 1
      break
    case 'downto':
      increment = -1
      break
    default:
      throw error('for11', 'forToDownTo', lexemes[lex])
  }
  if (!lexemes[lex + 1]) {
    throw error('for12', 'forToNothing', lexemes[lex])
  }
  lex += 1
  result = commands.expression(routines, sub, lex, addresses, 'null', 'int', false)
  lex = result.lex
  pcode[pcode.length - 1] = pcode[pcode.length - 1].concat(result.pcode.shift())
  pcode = pcode.concat(result.pcode)
  // for Pascal, we already know the increment for BASIC, we may now
  // need to change the default...
  if (language === 'BASIC') {
    if (lexemes[lex] && lexemes[lex].type === 'step') {
      if (!lexemes[lex + 1]) {
        throw error('for13', 'forStep', lexemes[lex])
      }
      lex += 1
      if (lexemes[lex].type !== 'subt') {
        throw error('for14', 'forStep', lexemes[lex])
      }
      if (!lexemes[lex + 1]) {
        throw error('for15', 'forStep', lexemes[lex])
      }
      lex += 1
      if (lexemes[lex].string !== '1') {
        throw error('for16', 'forStep', lexemes[lex])
      }
      lex += 1
      increment = -1
    }
  }
  pcode.push(values.loadVariable(variable, false))
  if (increment > 0) {
    pcode[pcode.length - 1].push(pc.mreq)
  } else {
    pcode[pcode.length - 1].push(pc.lseq)
  }
  pcode[pcode.length - 1].push(pc.ifno)
  // Pascal requires DO at this point
  if (language === 'Pascal') {
    if (!lexemes[lex]) {
      throw error('for17', 'forDo', lexemes[lex - 1])
    }
    if (lexemes[lex].type !== 'do') {
      throw error('for18', 'forDo', lexemes[lex])
    }
    lex += 1
  }
  if (!lexemes[lex]) {
    throw error('for19', 'forNothing', lexemes[lex])
  }
  switch (language) {
    case 'BASIC':
      if (lexemes[lex - 1].line < lexemes[lex].line) {
        result = block(routines, sub, lex, addresses, offset + pcode.length, 'for')
      } else {
        result = structure(routines, sub, lex, addresses, offset + pcode.length)
      }
      break
    case 'Pascal':
      if (lexemes[lex].type === 'begin') {
        result = block(routines, sub, lex + 1, addresses, offset + pcode.length, 'begin')
      } else {
         result = structure(routines, sub, lex, addresses, offset + pcode.length)
      }
      break
    case 'Python':
      break
  }
  lex = result.lex
  pcode = pcode.concat(result.pcode)
  pcode.push(values.loadVariable(variable))
  if (increment > 0) {
    pcode[pcode.length - 1].push(pc.incr)
  } else {
    pcode[pcode.length - 1].push(pc.decr)
  }
  pcode[pcode.length - 1].push(pc.jump)
  pcode[pcode.length - 1].push(offset + 2)
  pcode[2].push(offset + pcode.length + 1) // backpatch initial IFNO jump
  return { lex, pcode }
}

*/
