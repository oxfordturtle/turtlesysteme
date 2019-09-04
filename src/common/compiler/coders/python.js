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

// the coder is the default export, but it needs to be named so it can call itself recursively
const coder = (routine, lex, startLine) => {
  let result

  switch (routine.lexemes[lex].type) {
    // identifiers (variable declaration, variable assignment, or procedure call)
    case 'turtle': // fallthrough
    case 'identifier':
      if (routine.lexemes[lex + 1] && [':', '=', '=='].includes(routine.lexemes[lex + 1].content)) {
        // looks like variable declaration and/or assignment
        let varName = routine.lexemes[lex].content
        lex += 1
        // assignment with declaration
        if (routine.lexemes[lex].content === ':') {
          // N.B. relevant error checking has already been handled by the parser
          result = { lex: lex + 2, pcode: [] }
          lex = result.lex
        }
        // wrong assignment operator
        if (routine.lexemes[lex].content === '==') {
          throw error('Variable assignment in Python uses "=", not "==".', routine.lexemes[lex])
        }

        // right assignment operator
        if (routine.lexemes[lex].content === '=') {
          result = molecules.variableAssignment(routine, varName, lex + 1, 'Python')
          lex = result.lex
        }
      } else {
        // should be a procedure call
        result = molecules.procedureCall(routine, lex, 'Python')
      }

      // end of statement check
      if (routine.lexemes[result.lex]) {
        if (routine.lexemes[result.lex].content === ';') {
          result.lex += 1
          if (routine.lexemes[result.lex].type === 'NEWLINE') result.lex += 1
        } else if (routine.lexemes[result.lex].type === 'NEWLINE') {
          result.lex += 1
        } else {
          throw error('Statement must be separated by a semicolon or placed on a new line.', routine.lexemes[result.lex])
        }
      }
      break

    // keywords
    default:
      switch (routine.lexemes[lex].content) {
        // return (assign return variable of a function)
        case 'return':
          result = molecules.variableAssignment(routine, 'return', lex + 1, 'Python')
          break

        // start of IF structure
        case 'if':
          result = compileIf(routine, lex + 1, startLine)
          break

        // else is an error
        case 'else':
          throw error('Statement cannot begin with "else". If you have an "if" above, this line may need to be indented more.', routine.lexemes[lex])

        // start of FOR structure
        case 'for':
          result = compileFor(routine, lex + 1, startLine)
          break

        // start of WHILE structure
        case 'while':
          result = compileWhile(routine, lex + 1, startLine)
          break

        // PASS
        case 'pass':
          result = compilePass(routine, lex + 1)
          break

        // anything else is an error
        default:
          throw error('Statement cannot begin with {lex}.', routine.lexemes[lex])
      }
      break
  }

  // all good
  return result
}

export default coder

// generate the pcode for an IF structure
const compileIf = (routine, lex, startLine) => {
  // values we need to generate the IF code
  let test, ifCode, elseCode

  // working variable
  let result

  // expecting a boolean expression
  if (!routine.lexemes[lex]) {
    throw error('"if" must be followed by a Boolean expression.', routine.lexemes[lex - 1])
  }
  result = molecules.expression(routine, lex, 'null', 'boolean', 'Python')
  lex = result.lex
  test = result.pcode

  // expecting a colon
  if (!routine.lexemes[lex]) {
    throw error('"if <expression>" must be followed by a colon.', routine.lexemes[lex - 1])
  }
  lex += 1

  // expecting NEWLINE
  if (!routine.lexemes[lex]) {
    throw error('No statements found after "if <expression>:".', routine.lexemes[lex - 1])
  }
  if (routine.lexemes[lex].type !== 'NEWLINE') {
    throw error('Statements following "if <expression>:" must be on a new line.', routine.lexemes[lex])
  }
  lex += 1

  // expecting INDENT
  if (!routine.lexemes[lex]) {
    throw error('No statements found after "if <expression>:".', routine.lexemes[lex - 1])
  }
  if (routine.lexemes[lex].type !== 'INDENT') {
    throw error('Statements following "if <expression>:" must be indented.', routine.lexemes[lex])
  }
  lex += 1

  // expecting some statements
  if (!routine.lexemes[lex]) {
    throw error('No statements found after "if <expression>:".', routine.lexemes[lex - 1])
  }
  result = block(routine, lex, startLine + 1)
  lex = result.lex
  ifCode = result.pcode

  // happy with an "else" here (but it's optional)
  if (routine.lexemes[lex] && (routine.lexemes[lex].content === 'else')) {
    lex += 1

    // expecting a colon
    if (!routine.lexemes[lex]) {
      throw error('"else" must be followed by a colon.', routine.lexemes[lex - 1])
    }
    if (routine.lexemes[lex].content !== ':') {
      throw error('"else" must be followed by a colon.', routine.lexemes[lex])
    }
    lex += 1

    // expecting NEWLINE
    if (!routine.lexemes[lex]) {
      throw error('No statements found after "else:".', routine.lexemes[lex - 1])
    }
    if (routine.lexemes[lex].type !== 'NEWLINE') {
      throw error('Statements following "else:" must be on a new line.', routine.lexemes[lex])
    }
    lex += 1

    // expecting INDENT
    if (!routine.lexemes[lex]) {
      throw error('No statements found after "else:".', routine.lexemes[lex - 1])
    }
    if (routine.lexemes[lex].type !== 'INDENT') {
      throw error('Statements following "else:" must be indented.', routine.lexemes[lex])
    }
    lex += 1

    // expecting some statements
    if (!routine.lexemes[lex]) {
      throw error('No statements found after "else:".', routine.lexemes[lex - 1])
    }
    result = block(routine, lex, startLine + ifCode.length + 2)
    lex = result.lex
    elseCode = result.pcode
  }

  // now we have everything we need
  return { lex, pcode: pcoder.conditional(startLine, test, ifCode, elseCode) }
}

// generate the pcode for a FOR structure
const compileFor = (routine, lex, startLine) => {
  // values we need to generate the FOR code
  let variable, initial, final, compare, change, innerCode

  // working variable
  let result

  // expecting an integer variable
  if (!routine.lexemes[lex]) {
    throw error('"for" must be followed by an integer variable.', routine.lexemes[lex - 1])
  }
  if (routine.lexemes[lex].type !== 'turtle' && routine.lexemes[lex].type !== 'identifier') {
    throw error('{lex} is not a valid variable name.', routine.lexemes[lex])
  }
  variable = find.variable(routine, routine.lexemes[lex].content, 'Python')
  if (!variable) {
    throw error('Variable {lex} could not be found.', routine.lexemes[lex])
  }
  if (variable.fulltype.type !== 'integer') {
    throw error('Loop variable must be an integer.', routine.lexemes[lex])
  }
  lex += 1

  // expecting 'in'
  if (!routine.lexemes[lex]) {
    throw error('"for <variable>" must be followed by "in".', routine.lexemes[lex - 1])
  }
  if (routine.lexemes[lex].content !== 'in') {
    throw error('"for <variable>" must be followed by "in".', routine.lexemes[lex])
  }
  lex += 1

  // expecting 'range'
  if (!routine.lexemes[lex]) {
    throw error('"for <variable> in" must be followed by a range specification.', routine.lexemes[lex - 1])
  }
  if (routine.lexemes[lex].content !== 'range') {
    throw error('"for <variable> in" must be followed by a range specification.', routine.lexemes[lex])
  }
  lex += 1

  // expecting a left bracket
  if (!routine.lexemes[lex]) {
    throw error('"range" must be followed by an opening bracket.', routine.lexemes[lex - 1])
  }
  if (routine.lexemes[lex].content !== '(') {
    throw error('"range" must be followed by an opening bracket.', routine.lexemes[lex])
  }
  lex += 1

  // expecting an integer expression (for the initial value)
  if (!routine.lexemes[lex]) {
    throw error('Missing first argument to the "range" function.', routine.lexemes[lex - 1])
  }
  result = molecules.expression(routine, lex, 'null', 'integer', 'Python')
  lex = result.lex
  initial = result.pcode[0]

  // expecting a comma
  if (!routine.lexemes[lex]) {
    throw error('Argument must be followed by a comma.', routine.lexemes[lex - 1])
  }
  if (routine.lexemes[lex].content === ')') {
    throw error('Too few arguments for "range" function.', routine.lexemes[lex])
  }
  if (routine.lexemes[lex].content !== ',') {
    throw error('Argument must be followed by a comma.', routine.lexemes[lex])
  }
  lex += 1

  // expecting an integer expression (for the final value)
  if (!routine.lexemes[lex]) {
    throw error('Too few arguments for "range" function.', routine.lexemes[lex - 1])
  }
  result = molecules.expression(routine, lex, 'null', 'integer', 'Python')
  lex = result.lex
  final = result.pcode[0]

  // now expecting another comma
  if (!routine.lexemes[lex]) {
    throw error('Argument must be followed by a comma.', routine.lexemes[lex - 1])
  }
  if (routine.lexemes[lex].content === ')') {
    throw error('Too few arguments for "range" function.', routine.lexemes[lex])
  }
  if (routine.lexemes[lex].content !== ',') {
    throw error('Argument must be followed by a comma.', routine.lexemes[lex])
  }
  lex += 1

  // expecting either '1' or '-1'
  if (!routine.lexemes[lex]) {
    throw error('Too few arguments for "range" function.', routine.lexemes[lex - 1])
  }
  if (routine.lexemes[lex].type === 'integer') {
    // only 1 is allowed
    if (routine.lexemes[lex].value !== 1) {
      throw error('Step value for "range" function must be 1 or -1.', routine.lexemes[lex])
    }
    // otherwise ok
    compare = 'more'
    change = 'incr'
  } else if (routine.lexemes[lex].content === '-') {
    lex += 1
    // now expecting '1'
    if (!routine.lexemes[lex]) {
      throw error('Step value for "range" function must be 1 or -1.', routine.lexemes[lex - 1])
    }
    if (routine.lexemes[lex].type !== 'integer') {
      throw error('Step value for "range" function must be 1 or -1.', routine.lexemes[lex])
    }
    if (routine.lexemes[lex].value !== 1) {
      throw error('Step value for "range" function must be 1 or -1.', routine.lexemes[lex])
    }
    compare = 'less'
    change = 'decr'
  } else {
    throw error('Step value for "range" function must be 1 or -1.', routine.lexemes[lex])
  }
  lex += 1

  // expecting a right bracket
  if (!routine.lexemes[lex]) {
    throw error('Closing bracket needed after "range" function arguments.', routine.lexemes[lex - 1])
  }
  if (routine.lexemes[lex].content === ',') {
    throw error('Too many arguments for "range" function.', routine.lexemes[lex])
  }
  if (routine.lexemes[lex].content !== ')') {
    throw error('Closing bracket needed after "range" function arguments.', routine.lexemes[lex])
  }
  lex += 1

  // expecting a colon
  if (!routine.lexemes[lex]) {
    throw error('"for <variable> in range(...)" must be followed by a colon.', routine.lexemes[lex - 1])
  }
  if (routine.lexemes[lex].content !== ':') {
    throw error('"for <variable> in range(...)" must be followed by a colon.', routine.lexemes[lex])
  }
  lex += 1

  // expecting NEWLINE
  if (!routine.lexemes[lex]) {
    throw error('No statements found after "for <variable> in range(...):".', routine.lexemes[lex - 1])
  }
  if (routine.lexemes[lex].type !== 'NEWLINE') {
    throw error('Statements following "for <variable> in range(...):" must be on a new line.', routine.lexemes[lex])
  }
  lex += 1

  // expecting INDENT
  if (!routine.lexemes[lex]) {
    throw error('No statements found after "for <variable> in range(...):".', routine.lexemes[lex - 1])
  }
  if (routine.lexemes[lex].type !== 'INDENT') {
    throw error('Statements following "for <variable> in range(...):" must be indented.', routine.lexemes[lex])
  }
  lex += 1

  // now expecting a block of statements
  if (!routine.lexemes[lex]) {
    throw error('No statements found after "for <variable> in range(...):', routine.lexemes[lex - 1])
  }
  result = block(routine, lex, startLine + 3)
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

  // expecting a boolean expression
  if (!routine.lexemes[lex]) {
    throw error('"while" must be followed by a Boolean expression.', routine.lexemes[lex - 1])
  }
  result = molecules.expression(routine, lex, 'null', 'boolean', 'Python')
  lex = result.lex
  test = result.pcode

  // expecting a colon
  if (!routine.lexemes[lex]) {
    throw error('"while <expression>" must be followed by a colon.', routine.lexemes[lex - 1])
  }
  if (routine.lexemes[lex].content !== ':') {
    throw error('"while <expression>" must be followed by a colon.', routine.lexemes[lex])
  }
  lex += 1

  // expecting NEWLINE
  if (!routine.lexemes[lex]) {
    throw error('No statements found after "while <expression>:".', routine.lexemes[lex - 1])
  }
  if (routine.lexemes[lex].type !== 'NEWLINE') {
    throw error('Statements following "while <expression>:" must be on a new line.', routine.lexemes[lex])
  }
  lex += 1

  // expecting INDENT
  if (!routine.lexemes[lex]) {
    throw error('No statements found after "while <expression>:".', routine.lexemes[lex - 1])
  }
  if (routine.lexemes[lex].type !== 'INDENT') {
    throw error('Statements following "while <expression>:" must be indented.', routine.lexemes[lex])
  }
  lex += 1

  // expecting a block of statements
  if (!routine.lexemes[lex]) {
    throw error('No statements found after "while <expression>:".', routine.lexemes[lex - 1])
  }
  result = block(routine, lex, startLine + 1, routine.lexemes[lex].offset)
  lex = result.lex
  innerCode = result.pcode

  // now we have everything we need
  return { lex, pcode: pcoder.whileLoop(startLine, test, innerCode) }
}

// generate the pcode for a PASS statement
const compilePass = (routine, lex) => {
  // check for new line
  if (routine.lexemes[lex] && routine.lexemes[lex].type !== 'NEWLINE') {
    throw error('Statement must be on a new line.', routine.lexemes[lex])
  }
  // PASS is a dummy command, no pcode is necessary; just move past the NEWLINE lexeme
  return { lex: lex + 1, pcode: [] }
}

// generate the pcode for a block (i.e. a sequence of commands/structures)
const block = (routine, lex, startLine) => {
  let pcode = []
  let result

  // loop through until the end of the block (or we run out of lexemes)
  while (routine.lexemes[lex] && routine.lexemes[lex].type !== 'DEDENT') {
    result = coder(routine, lex, startLine + pcode.length)
    pcode = pcode.concat(result.pcode)
    lex = result.lex
  }

  // move past DEDENT lexeme
  if (routine.lexemes[lex]) lex += 1

  return { lex, pcode }
}
