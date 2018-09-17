/*
compile the basic 'atoms' of a program, i.e. expressions, variable assignments, and procedure calls
*/

// generate pcode for an expression (mutually recursive with simple, term, and factor below)
module.exports.expression = (routine, lex, type, needed, language) => {
  const expTypes = ['eqal', 'less', 'lseq', 'more', 'mreq', 'noeq']

  // expressions are boolean anyway
  if (needed === 'boolean') needed = 'null'

  // evaluate the first bit
  let result = simple(routine, lex, type, needed, language)

  // evaluate the expression operator and next bit (if any), and merge the results
  while (routine.lexemes[result.lex] && (expTypes.indexOf(routine.lexemes[result.lex].value) > -1)) {
    let operator = unambiguousOperator(routine.lexemes[result.lex].value, result.type)
    let next = simple(routine, result.lex + 1, result.type, needed, language)
    result = pcoder.mergeWithOperator(result.pcode, next, operator)
  }

  // return the whole thing
  return result
}

// variable assignment
module.exports.variableAssignment = (routine, variable, lex, language) => {
  const { lexemes } = routine.lexemes

  // check there is something, and evaluate it
  if (!lexemes[lex]) throw error('atoms', 7, lexemes[lex - 1])
  let result = module.exports.expression(routine, lex, 'null', variable.fulltype.type, language)

  // return the next lexeme index and pcode
  return { lex, pcode: pcoder.merge(result.pcode, [pcoder.storeVariableValue(variable)]) }
}

// procedure call (but also used internally by the functionCall function below, since most of the
// code for calling a function (loading arguments onto the stack, then calling the command) is the
// same
module.exports.procedureCall = (routine, lex, language, procedureCheck = true) => {
  // look for the command
  const command = find.command(routine, routine.lexemes[lex].content, language)
  if (!command) throw error('{lex} is not defined.', routine.lexemes[lex])

  // check it is a procedure; N.B. this function is also used below for handling functions, where
  // the procedureCheck argument is false
  if (procedureCheck && command.type !== 'procedure') {
    throw error('{lex} is a function, not a procedure.', routine.lexemes[lex])
  }

  // split into two cases: with and without parameters
  return (command.parameters.length === 0)
    ? commandNoParameters(routine, lex, command, language)
    : commandWithParameters(routine, lex, command, language)
}

// dependencies
const atoms = require('./atoms')
const check = require('./check')
const error = require('./error')
const find = require('./find')
const pcoder = require('./pcoder')

// get unambiguous operator from ambiguous one
const unambiguousOperator = (operator, type) => {
  const integerVersions = ['eqal', 'less', 'lseq', 'more', 'mreq', 'noeq', 'plus']
  const stringVersions = ['seql', 'sles', 'sleq', 'smor', 'smeq', 'sneq', 'scat']
  return ((type === 'string') || (type === 'char'))
    ? stringVersions[integerVersions.indexOf(operator)]
    : operator
}

// handle a simple
const simple = (routine, lex, type, needed, language) => {
  const simpleTypes = ['plus', 'subt', 'or', 'xor']

  // evaluate the first bit
  let result = term(routine, lex, type, needed, language)

  // evaluate the expression operator and next bit (if any), and merge the results
  while (routine.lexemes[lex] && (simpleTypes.indexOf(routine.lexemes[lex].value) > -1)) {
    let operator = unambiguousOperator(routine.lexemes[result.lex].value, result.type)
    let next = term(routine, result.lex + 1, result.type, needed, language)
    result = pcoder.mergeWithOperator(result.pcode, next, operator)
  }

  // return the whole thing
  return result
}

// handle a term
const term = (routine, lex, type, needed, language) => {
  const termTypes = ['and', 'div', 'divr', 'mod', 'mult']

  // evaluate the first bit
  let result = factor(routine, lex, type, needed, language)

  // evaluate the term operator and next bit (if any), and merge the results
  while (routine.lexemes[lex] && termTypes.indexOf(routine.lexemes[lex].value) > -1) {
    let operator = unambiguousOperator(routine.lexemes[result.lex].value, result.type)
    let next = factor(routine, result.lex + 1, result.type, needed, language)
    result = pcoder.mergeWithOperator(result.pcode, next, operator)
  }

  // return the whole thing
  return result
}

// handle a factor (the lowest level of an expression)
const factor = (routine, lex, type, needed, language) => {
  switch (routine.lexemes[lex].type) {
    // operators
    case 'operator':
      return negative(routine, lex, needed, language) ||
        (() => { throw error('{lex} makes no sense here.', routine.lexemes[lex]) })()

    // literal values
    case 'boolean': // fallthrough
    case 'char': // fallthrough
    case 'integer': // fallthrough
    case 'string':
      return atoms.literal(routine.lexemes, lex, needed)

    // input codes
    case 'keycode': // fallthrough
    case 'query':
      return atoms.input(routine.lexemes, lex, needed, language) ||
        (() => { throw error('{lex} is not a valid input code.', routine.lexemes[lex]) })()

    // identifiers
    case 'turtle': // fallthrough
    case 'identifier':
      return atoms.constant(routine, lex, needed, language) ||
        atoms.variable(routine, lex, needed, language) ||
        atoms.colour(routine, lex, needed, language) ||
        functionCall(routine, lex, needed, language) ||
        (() => { throw error('{lex} is not defined.', routine.lexemes[lex]) })()

    // everything else
    default:
      return brackets(routine, lex, type, needed, language) ||
        (() => { throw error('{lex} makes no sense here.', routine.lexemes[lex]) })()
  }
}

// handle negation (integer or boolean)
const negative = (routine, lex, needed, language) => {
  // check for a negation operator, and handle it if found
  if (routine.lexemes[lex].content === '-' || routine.lexemes[lex].value === 'not') {
    const found = routine.lexemes[lex].content === '-' ? 'integer' : 'boolint'
    const operator = routine.lexemes[lex].content === '-'
      ? [pcoder.applyOperator('neg')]
      : [pcoder.applyOperator('not')]

    // check the type is okay
    check(needed, 'integer', routine.lexemes[lex])

    // handle what follows (should be a factor)
    const result = factor(routine, lex + 1, found, needed, language)

    // return the result of the factor, with the negation operator appended
    return Object.assign(result, { pcode: pcoder.merge(result.pcode, operator) })
  }

  // return null if there's no negation operator
  return null
}

// handle a function call
const functionCall = (routine, lex, needed, language) => {
  // look for the function
  const hit = find.command(routine, routine.lexemes[lex].content, language)
  if (hit) {
    // check it is a function
    if (hit.type !== 'function') throw error()

    // check return type (throws an error if wrong)
    check(needed, hit.returns, routine.lexemes[lex])

    // handle the bulk of the function (mostly works just like a procedure call, expect that the
    // last argument is set to false, so as to bypass the procedure check)
    const result = module.exports.commandCall(routine, lex, language, false)

    // user-defined functions need this at the end
    if (!hit.code) result.pcode.push(pcoder.loadFunctionReturnValue(hit.resultAddress))

    return Object.assign(result, { type: hit.returns })
  }

  // return null if no function is found
  return null
}

// handle an expression that starts with an open bracket
const brackets = (routine, lex, type, needed, language) => {
  // look for an open bracket
  if (routine.lexemes[lex].content === '(') {
    // what follows should be an expression
    const result = module.exports.expression(routine, lex + 1, type, needed, language)

    // now check for a closing bracket
    if (routine.lexemes[result.lex] && (routine.lexemes[result.lex].content === ')')) {
      return Object.assign(result, { lex: result.lex + 1 })
    } else {
      throw error('atoms', 5, routine.lexemes[lex - 1])
    }
  }

  // return null if there is no open bracket
  return null
}

// handle a command with no parameters
const commandNoParameters = (routine, lex, command, language) => {
  // command with no parameters in Python
  if (language === 'Python') {
    // check for opening bracket
    if (!routine.lexemes[lex + 1] || (routine.lexemes[lex + 1].content !== '(')) {
      throw error('Opening bracket missing after command {lex}.', routine.lexemes[lex])
    }

    // check for immediate closing bracket (no arguments)
    if (!routine.lexemes[lex + 2] || (routine.lexemes[lex + 2].content !== ')')) {
      throw error('Command {lex} takes no arguments.', routine.lexemes[lex - 1])
    }

    // return the command call and the index of the next lexeme
    return { lex: lex + 3, pcode: [pcoder.callCommand(command, routine, language)] }
  }

  // command with no parameters in BASIC or Pascal
  if (routine.lexemes[lex + 1] && (routine.lexemes[lex + 1].content === '(')) {
    throw error('Command {lex} takes no arguments.', routine.lexemes[lex])
  }

  return { lex: lex + 1, pcode: [pcoder.callCommand(command, routine, language)] }
}

// handle a command with parameters
const commandWithParameters = (routine, lex, command, language) => {
  // check for opening bracket
  if (routine.lexemes[lex + 1].content !== '(') {
    throw error('Opening bracket missing after command {lex}.', routine.lexemes[lex])
  }

  // handle the parameters
  const result = args(routine, lex + 2, command, language)

  // return the parameters followed by the pcode for calling the command
  const callCommand = [pcoder.callCommand(command, routine, language)]
  return Object.assign(result, { pcode: pcoder.merge(result.pcode, callCommand) })
}

// pcode for loading arguments for a command call
const args = (routine, lex, command, language) => {
  const name = command.name || command.names[language]
  let result

  // handle the arguments
  const argsExpected = command.parameters.length
  let argsGiven = 0
  while ((argsGiven < argsExpected) && (routine.lexemes[lex].content !== ')')) {
    result = argument(routine, lex, command, argsGiven, language)
    argsGiven += 1
    lex = result.lex
    if (argsGiven < argsExpected) {
      if (!routine.lexemes[lex] || (routine.lexemes[lex].content !== ',')) {
        throw error('Comma needed after parameter.', routine.lexemes[lex])
      }
    }
  }

  // final error checking
  if (argsGiven < argsExpected) {
    throw error(`Not enough arguments given for command "${name}".`, routine.lexemes[lex])
  }
  if (routine.lexemes[lex].content === ',') {
    throw error(`Too many arguments given for command "${name}"`, routine.lexemes[lex])
  }
  if (routine.lexemes[lex].content !== ')') {
    throw error(`Closing bracket missing after command "${name}"`, routine.lexemes[lex - 1])
  }

  // return the next lex index and the pcode
  return Object.assign(result, { lex: lex + 1 })
}

// handle the argument to a command call
const argument = (routine, lex, command, index, language) => {
  // reference parameter
  if (command.parameters[index].byref) {
    let variable = find.variable(routine, routine.lexemes[lex].content, language)
    if (!variable) {
      throw error('{lex} is not defined.}', routine.lexemes[lex])
    }
    return { lex: lex + 1, pcode: [pcoder.loadVariableAddress(variable)] }
  }

  // value parameter
  return module.exports.expression(routine, lex, 'null', command.parameters[index].type, language)
}
