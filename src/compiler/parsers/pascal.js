/*
parser for Turtle Pascal - lexemes go in, array of routines comes out; the first element in the
array is the main PROGRAM object

look at the factory module to see what the PROGRAM object (and its components) look like

this analyses the structure of the program, and builds up lists of all the constants, variables,
and subroutines (with their variables and parameters) - lexemes for the program (and any
subroutine) code themselves are just stored for subsequent handling by the pcoder
*/
import error from '../tools/error.js'
import * as factory from '../tools/factory.js'
import * as find from '../tools/find.js'

export default (lexemes) => {
  const routines = [] // array of routines to be returned (0 being the main program)
  const routineStack = [] // stack of routines
  let lex = 0 // index of current lexeme
  let routine // the current routine
  let routineCount = 0 // index of the current routine
  let parent // the parent of the current routine
  let state = 'program'

  // loop through the lexemes
  while (lex < lexemes.length) {
    switch (state) {
      case 'program':
        // expecting "PROGRAM <identifier>;"
        ({ lex, routine, state } = program(lexemes, lex))
        routines.push(routine)
        routineStack.push(routine)
        break

      case 'crossroads':
        // expecting "CONST", "VAR", "PROCEDURE|FUNCTION", or "BEGIN[;]"
        ({ lex, state } = crossroads(lexemes, lex, routine))
        break

      case 'constant':
        // expecting "<identifier> = <value>;"
        ({ lex, state } = constant(lexemes, lex, routine))
        break

      case 'variable':
        // expecting "<identifier>[, <identifier2>, ...]: <type>;"
        ({ lex, state } = variable(lexemes, lex, routine))
        break

      case 'procedure': // fallthrough
      case 'function':
        // expecting "<identifier>[(<parameters>)];"
        parent = routineStack[routineStack.length - 1]
        ;({ lex, routine } = subroutine(lexemes, lex, state, parent))
        parent.subroutines.push(routine)
        routineStack.push(routine)
        state = 'crossroads'
        break

      case 'begin':
        // expecting routine commands
        ({ lex, state } = content(lexemes, lex, routine))
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
          lex += 1 // so we exit the loop
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

// look for "PROGRAM identifier;"; return program object and next lexeme index
const program = (lexemes, lex) => {
  const [keyword, identifier] = lexemes.slice(lex, lex + 2)

  // error checking
  if (!keyword) throw error('Program must start with keyword "PROGRAM".')
  if (keyword.content !== 'program') {
    throw error('Program must start with keyword "PROGRAM".', keyword)
  }
  if (!identifier) {
    throw error('"PROGRAM" must be followed by a legal program name.', keyword)
  }
  if (identifier.type === 'turtle') {
    throw error('Program cannot be given the name of a Turtle attribute.', identifier)
  }
  if (identifier.type !== 'identifier') {
    throw error('{lex} is not a valid program name.', identifier)
  }

  // return the program object
  return {
    lex: next(lexemes, lex + 2, true),
    routine: factory.program(identifier.content, 'Pascal'),
    state: 'crossroads'
  }
}

// look for "CONST|VAR|PROCEDURE|FUNCTION|BEGIN(;)"; return next state and next lexeme index
const crossroads = (lexemes, lex, routine) => {
  const keyword = lexemes[lex]
  const message = 'Expected "BEGIN", constant/variable definitions, or subroutine definitions.'

  // error checking
  if (!keyword) {
    throw error(message, lexemes[lex - 1])
  }

  // do different things depending on the keyword
  switch (keyword.content) {
    case 'const':
      if (routine.variables.length > 0) {
        throw error('Constants must be defined before any variables.', keyword)
      }
      if (routine.subroutines.length > 0) {
        throw error('Constants must be defined before any subroutines.', keyword)
      }
      return { lex: lex + 1, state: 'constant' }

    case 'var':
      if (routine.subroutines.length > 0) {
        throw error('Variables must be defined before any subroutines.', keyword)
      }
      return { lex: lex + 1, state: 'variable' }

    case 'function': // fallthrough
    case 'procedure':
      return { lex: lex + 1, state: keyword.content }

    case 'begin':
      return { lex: next(lexemes, lex + 1), state: 'begin' }

    default:
      throw error(message, keyword)
  }
}

// look for "identifier = value;"; return constant object and next lexeme index
const constant = (lexemes, lex, routine) => {
  const [identifier, assignment, next] = lexemes.slice(lex, lex + 3)

  // error checking
  if (!identifier) {
    throw error('No constant name found.', lexemes[lex - 1])
  }
  if (identifier.type === 'turtle') {
    throw error('{lex} is the name of a predefined Turtle property, and cannot be used as a constant name.', identifier)
  }
  if (identifier.type !== 'identifier') {
    throw error('{lex} is not a valid constant name.', identifier)
  }
  if (identifier.content === find.program(routine).name) {
    throw error('Constant name {lex} is already the name of the program.', identifier)
  }
  if (isDuplicate(routine, identifier.content)) {
    throw error('{lex} is already the name of a constant in the current scope.', identifier)
  }
  if (!assignment) {
    throw error('Constant must be assigned a value.', identifier)
  }
  if (assignment.content !== '=' || !next) {
    throw error('Constant must be assigned a value.', assignment)
  }

  // get the constant
  let result = (next.content === '-')
    ? negativeConstant(lexemes, lex + 3, identifier.content, routine)
    : nonnegativeConstant(lexemes, lex + 2, identifier.content, routine)

  // add the constant to the routine
  routine.constants.push(result.constant)

  // final error checking
  if (!lexemes[result.lex]) {
    throw error('No program text found after constant definition.', lexemes[result.lex - 1])
  }

  // return next lexeme and state
  return (lexemes[result.lex].type === 'identifier')
    ? { lex: result.lex, state: 'constant' }
    : { lex: result.lex, state: 'crossroads' }
}

// look for integer literal followed by semicolon; return constant object and next lexeme index
const negativeConstant = (lexemes, lex, name, routine) => {
  const value = lexemes[lex]

  // error checking
  if (!value) throw error('Constant must be assigned a value.', lexemes[lex - 1])

  // do different things depending on the type
  switch (value.type) {
    case 'string':
      throw error('Strings cannot be negated.', value)

    case 'boolean':
      throw error('Boolean values cannot be negated.', value)

    case 'integer':
      return {
        lex: next(lexemes, lex + 1, true),
        constant: factory.constant(name, value.type, -value.value)
      }

    case 'identifier':
      let constant = find.constant(routine, value.content, 'Pascal') ||
        find.colour(value.content, 'Pascal')
      if (!constant) throw error('{lex} is not a valid constant value.', value)
      return {
        lex: next(lexemes, lex + 1, true),
        constant: factory.constant(name, constant.type, -constant.value)
      }

    default:
      throw error('{lex} is not a valid constant value.', value)
  }
}

// look for any literal value followed by semicolon; return constant object and next lexeme index
const nonnegativeConstant = (lexemes, lex, name, routine) => {
  const value = lexemes[lex]

  // error checking
  if (!value) throw error('Constant must be assigned a value.', lexemes[lex - 1])

  // do different things depending on the type
  switch (value.type) {
    case 'boolean': // fallthrough
    case 'integer': // fallthrough
    case 'string':
      return {
        lex: next(lexemes, lex + 1, true),
        constant: factory.constant(name, value.type, value.value)
      }

    case 'identifier':
      let constant = find.constant(routine, value.content, 'Pascal') ||
        find.colour(value.content, 'Pascal')
      if (!constant) throw error('{lex} is not a valid constant value.', value)
      return {
        lex: next(lexemes, lex + 1, true),
        constant: factory.constant(name, constant.type, constant.value)
      }

    default:
      throw error('{lex} is not a valid constant value.', value)
  }
}

// array of typed variables (with index of the next lexeme)
const variable = (lexemes, lex, routine, parameter = false, byref = false) => {
  const variables = []

  // gather the variable names
  let more = true
  while (more) {
    // initial error checking
    if (!lexemes[lex]) {
      throw error('No variable name found.', lexemes[lex - 1])
    }
    if (lexemes[lex].type === 'turtle') {
      throw error('{lex} is the name of a predefined Turtle property, and cannot be used as a variable name.', lexemes[lex])
    }
    if (lexemes[lex].type !== 'identifier') {
      throw error('{lex} is not a valid variable name.', lexemes[lex])
    }
    if (lexemes[lex].content === find.program(routine).name) {
      throw error('Variable name {lex} is already the name of the program.', lexemes[lex])
    }
    if (isDuplicate(routine, lexemes[lex].content)) {
      throw error('{lex} is already the name of a constant or variable in the current scope.', lexemes[lex])
    }

    // create the variable and add it to the array of variables
    variables.push(factory.variable(lexemes[lex], routine, byref))

    // check there is something next
    if (!lexemes[lex + 1]) {
      throw error('Variable name must be followed by a colon, then the variable type (array, boolean, char, integer, or string).', lexemes[lex])
    }

    // expecting a comma or a colon
    if (lexemes[lex + 1].content === ',') {
      lex += 2
    } else if (lexemes[lex + 1].content === ':') {
      lex += 2
      more = false
    } else if (lexemes[lex + 1].type === 'identifier') {
      throw error('Comma missing between variable declarations.', lexemes[lex + 1])
    } else {
      throw error('Variable name must be followed by a colon, then the variable type (array, boolean, char, integer, or string).', lexemes[lex + 1])
    }
  }

  // now expecing type definition for the variables just gathered
  let result = fulltype(lexemes, lex, routine, parameter, byref)

  // add type information for those variables
  variables.forEach(x => { x.fulltype = result.fulltype })

  // add the variables to the routine
  routine.variables = routine.variables.concat(variables)

  // move to the next lexeme
  lex = (!parameter || lexemes[result.lex].content !== ')')
    ? next(lexemes, result.lex, true)
    : result.lex

  // final error checking
  if (!lexemes[lex]) {
    throw error('No text found after variable declarations.', lexemes[lex - 1])
  }

  // return the next lexeme index and state
  return (lexemes[lex].type === 'identifier')
    ? { lex, variables, state: 'variable' }
    : { lex, variables, state: 'crossroads' }
}

// look for "<fulltype>: boolean|integer|char|string[size]|array of <fulltype>"; return fulltype
// object (a property of variables/parameters) and next lexeme index
const fulltype = (lexemes, lex, routine, parameter, byref) => {
  const type = lexemes[lex]

  // initial error checking
  if (!lexemes[lex]) {
    throw error('Variable name must be followed by a colon, then the variable type (array, boolean, char, integer, or string).', lexemes[lex - 1])
  }

  // do different things based on content
  switch (type.content) {
    case 'boolean': // fallthrough
    case 'integer': // fallthrough
    case 'char':
      return { lex: lex + 1, fulltype: factory.fulltype(type.content) }

    case 'string':
      if (lexemes[lex + 1] && lexemes[lex + 1].content === '[') {
        // string of custom size
        const [ size, rbkt ] = lexemes.slice(lex + 2, lex + 4)
        if (!size) {
          throw error('Opening bracket must be followed by an integer value.', lexemes[lex + 1])
        }
        if (size.type !== 'integer') {
          throw error('String size must be an integer.', size)
        }
        if (!rbkt) {
          throw error('String size must be followed by a closing square bracket "]".', size)
        }
        if (rbkt.content !== ']') {
          throw error('String size must be followed by a closing square bracket "]".', rbkt)
        }
        return { lex: lex + 4, fulltype: factory.fulltype('string', size.value) }
      } else {
        // string of default size
        return { lex: lex + 1, fulltype: factory.fulltype('string') }
      }

    case 'array':
      return parameter
        ? arrayParameterType(lexemes, lex + 1, routine, byref)
        : arrayVariableType(lexemes, lex + 1, routine)

    default:
      throw error('{lex} is not a valid variable type (expected "array", "boolean", "char", "integer", or "string").', type)
  }
}

// look for "of <fulltype>" (following "array" in parameter declaration)
const arrayParameterType = (lexemes, lex, routine, byref) => {
  // error checking
  if (!lexemes[lex]) {
    throw error('Array declaration must be followed by "of", and then the type of the elements of the array.', lexemes[lex - 1])
  }
  if (!byref) {
    throw error('Array parameters can only be passed by reference, not by value.', lexemes[lex])
  }
  if (lexemes[lex].content === '[') {
    throw error('Array references parameters cannot be given a size specification.', lexemes[lex])
  }
  if (lexemes[lex].content !== 'of') {
    throw error('Array declaration must be followed by "of", and then the type of the elements of the array.', lexemes[lex])
  }

  // return the fulltype
  return fulltype(lexemes, lex + 1, routine, true, byref)
}

// look for "[n..m] of <fulltype>" (following "array" in variable declaration)
const arrayVariableType = (lexemes, lex, routine) => {
  const [ lbkt, start, dots, end, rbkt, keyof ] = lexemes.slice(lex, lex + 6)
  let endValue, startValue, result

  // check for left bracket
  if (!lbkt) {
    throw error('Array declarations take the form "array[n..m]", where "n" and "m" are integer values specifying the start and end index of the array.', lexemes[lex - 1])
  }
  if (lbkt.content !== '[') {
    throw error('Array declarations take the form "array[n..m]", where "n" and "m" are integer values specifying the start and end index of the array.', lbkt)
  }

  // check for start value
  if (!start) {
    throw error('Array declarations take the form "array[n..m]", where "n" and "m" are integer values specifying the start and end index of the array.', lbkt)
  }
  switch (start.type) {
    case 'identifier':
      let constant = find.constant(routine, start.content, 'Pascal')
      if (!constant) {
        throw error('Constant {lex} has not been defined.', start)
      }
      if (constant.type !== 'integer') {
        throw error('{lex} is not an integer constant.', start)
      }
      startValue = constant.value
      break

    case 'integer':
      startValue = start.value
      break

    default:
      throw error('Array declarations take the form "array[n..m]", where "n" and "m" are integer values specifying the start and end index of the array.', start)
  }

  // check for dots
  if (!dots) {
    throw error('Array declarations take the form "array[n..m]", where "n" and "m" are integer values specifying the start and end index of the array.', start)
  }
  if (dots.content !== '..') {
    throw error('Array declarations take the form "array[n..m]", where "n" and "m" are integer values specifying the start and end index of the array.', dots)
  }

  // check for end value
  if (!end) {
    throw error('Array declarations take the form "array[n..m]", where "n" and "m" are integer values specifying the start and end index of the array.', dots)
  }
  switch (end.type) {
    case 'identifier':
      let constant = find.constant(routine, end.content, 'Pascal')
      if (!constant) {
        throw error('Constant {lex} has not been defined.', end)
      }
      if (constant.type !== 'integer') {
        throw error('{lex} is not an integer constant.', end)
      }
      endValue = constant.value
      break

    case 'integer':
      endValue = end.value
      break

    default:
      throw error('Array declarations take the form "array[n..m]", where "n" and "m" are integer values specifying the start and end index of the array.', end)
  }

  // check for right bracket
  if (!rbkt) {
    throw error('Array declarations take the form "array[n..m]", where "n" and "m" are integer values specifying the start and end index of the array.', end)
  }
  if (rbkt.content !== ']') {
    throw error('Array declarations take the form "array[n..m]", where "n" and "m" are integer values specifying the start and end index of the array.', rbkt)
  }

  // check for 'of' keyword
  if (!keyof) {
    throw error('Array declaration must be followed by "of", and then the type of the elements of the array.', rbkt)
  }
  if (keyof.content !== 'of') {
    throw error('Array declaration must be followed by "of", and then the type of the elements of the array.', keyof)
  }

  // now get fulltype
  result = fulltype(lexemes, lex + 6, routine)

  // return the array type and next lexeme index
  return {
    lex: result.lex,
    fulltype: factory.fulltype('array', endValue - startValue + 1, startValue, result.fulltype)
  }
}

// look for "identifier[(parameters)];"
const subroutine = (lexemes, lex, type, parent) => {
  const identifier = lexemes[lex]

  let routine, result

  // initial error checking
  if (!identifier) {
    throw error('No subroutine name found.', lexemes[lex - 1])
  }
  if (identifier.type === 'turtle') {
    throw error('{lex} is the name of a predefined Turtle property, and cannot be used as a subroutine name.', identifier)
  }
  if (identifier.type !== 'identifier') {
    throw error('{lex} is not a valid subroutine name.', identifier)
  }
  if (identifier.content === find.program(parent).name) {
    throw error('Subroutine name {lex} is already the name of the program.', identifier)
  }
  if (find.custom(parent, identifier.content, 'Pascal')) {
    throw error('{lex} is already the name of a subroutine in the current scope.', identifier)
  }

  // create the routine object
  routine = factory.subroutine(identifier.content, type, parent)

  // add result variable to functions
  if (type === 'function') {
    routine.variables.push(factory.variable({ content: 'result' }, routine, false))
  }

  // look for semicolon or parameters
  lex += 1
  if (!lexemes[lex]) {
    throw error('Subroutine declaration must be followed by a semicolon.', identifier)
  }
  if (lexemes[lex].content === '(') {
    result = parameter(lexemes, lex + 1, routine)
    routine.parameters = result.parameters
    routine.variables = routine.variables.concat(result.parameters)
    lex = result.lex
  }

  // if it's a function, look for colon and return type
  if (type === 'function') {
    if (!lexemes[lex]) {
      throw error('Function must be followed by a colon, the the return type (integer, boolean, char, or string).', lexemes[lex - 1])
    }
    if (lexemes[lex].content !== ':') {
      throw error('Function must be followed by a colon, the the return type (integer, boolean, char, or string).', lexemes[lex])
    }
    result = fulltype(lexemes, lex + 1, routine)
    // TODO: throw an error if return type is array ??
    routine.variables[0].fulltype = result.fulltype
    lex = result.lex
  }

  // look for semicolons and move past them
  lex = next(lexemes, lex, true)

  // return the next lexeme index and the routine object
  return { lex, routine }
}

// look for "[var] identifier1[, identifier2, ...]: <fulltype>"; return array of parameters and
// index of the next lexeme
const parameter = (lexemes, lex, routine) => {
  let parameters = []
  let result

  let more = true
  while (more) {
    result = (lexemes[lex] && lexemes[lex].content === 'var')
      ? variable(lexemes, lex + 1, routine, true, true)
      : variable(lexemes, lex, routine, true, false)
    parameters = parameters.concat(result.variables)
    lex = result.lex
    if (!lexemes[lex]) {
      throw error('Parameter declarations must be followed by a closing bracket ")".', lexemes[lex - 1])
    }
    switch (lexemes[lex].content) {
      case ';':
        lex += 1
        break

      case ')':
        lex += 1
        more = false
        break

      default:
        throw error('Parameter declarations must be followed by a closing bracket ")".', lexemes[lex])
    }
  }

  return { lex, parameters }
}

// grab everything up to "END"
const content = (lexemes, lex, routine) => {
  // grab all the content
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

  // return the next lexeme and end state
  return { lex, state: 'end' }
}

// check if a string is already the name of a variable or constant in a routine
const isDuplicate = (routine, name) =>
  routine.variables.concat(routine.constants).some((x) => x.name === name)

// index of the next lexeme (after any semicolons)
const next = (lexemes, lex, compulsory = false) => {
  if (compulsory) {
    if (!lexemes[lex]) throw error('Semicolon needed after statement.', lexemes[lex - 1])
    if (lexemes[lex].content !== ';') throw error('Semicolon needed after statement.', lexemes[lex])
  }

  while (lexemes[lex] && lexemes[lex].content === ';') lex += 1

  return lex
}
