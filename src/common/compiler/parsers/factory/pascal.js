/*
*/
import * as factory from './factory'
import error from '../../tools/error'
import * as find from '../../tools/find'

// look for "PROGRAM identifier"; return program object and index of the next lexeme
export const program = (lexemes, lex) => {
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

  // return the program object and index of the next lexeme
  return { lex: lex + 2, program: factory.program(identifier.content, 'Pascal') }
}

// look for "identifier = value"; return constant object and next lexeme index
export const constant = (lexemes, lex, routine) => {
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

  // return the constant object and index of the next lexeme
  return result
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
      return { lex: lex + 1, constant: factory.constant(name, value.type, -value.value) }

    case 'identifier':
      let constant = find.constant(routine, value.content, 'Pascal') ||
        find.colour(value.content, 'Pascal')
      if (!constant) throw error('{lex} is not a valid constant value.', value)
      return { lex: lex + 1, constant: factory.constant(name, constant.type, -constant.value) }

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
      return { lex: lex + 1, constant: factory.constant(name, value.type, value.value) }

    case 'identifier':
      let constant = find.constant(routine, value.content, 'Pascal') ||
        find.colour(value.content, 'Pascal')
      if (!constant) throw error('{lex} is not a valid constant value.', value)
      return { lex: lex + 1, constant: factory.constant(name, constant.type, constant.value) }

    default:
      throw error('{lex} is not a valid constant value.', value)
  }
}

// array of typed variables (with index of the next lexeme)
export const variables = (lexemes, lex, routine, parameter = false, byref = false) => {
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

  // return the array of variables and index of the next lexeme
  return { lex: result.lex, variables }
}

// look for "<fulltype>: boolean|integer|char|string[size]|array of <fulltype>"; return fulltype
// object (a property of variables/parameters) and index of the next lexeme
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
        const [size, rbkt] = lexemes.slice(lex + 2, lex + 4)
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
      throw error('The Turtle System E does not yet support arrays. This feature will be added soon. In the meantime, please use the Turtle System D.', lexemes[lex])
      /*return parameter
        ? arrayParameterType(lexemes, lex + 1, routine, byref)
        : arrayVariableType(lexemes, lex + 1, routine)*/

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
    throw error('Array reference parameters cannot be given a size specification.', lexemes[lex])
  }
  if (lexemes[lex].content !== 'of') {
    throw error('Array declaration must be followed by "of", and then the type of the elements of the array.', lexemes[lex])
  }

  // return the fulltype
  return fulltype(lexemes, lex + 1, routine, true, byref)
}

// look for "[n..m] of <fulltype>" (following "array" in variable declaration)
const arrayVariableType = (lexemes, lex, routine) => {
  const [lbkt, start, dots, end, rbkt, keyof] = lexemes.slice(lex, lex + 6)
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

// look for "identifier[(parameters)]"
export const subroutine = (lexemes, lex, type, parent) => {
  const identifier = lexemes[lex]

  let subroutine, result

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
  subroutine = factory.subroutine(identifier.content, type, parent)

  // add result variable to functions
  if (type === 'function') {
    subroutine.variables.push(factory.variable({ content: 'result' }, subroutine, false))
  }

  // move on
  lex += 1
  if (lexemes[lex]) {
    // check for parameter declarations
    if (lexemes[lex].content === '(') {
      result = parameters(lexemes, lex + 1, subroutine)
      subroutine.parameters = result.parameters
      subroutine.variables = subroutine.variables.concat(result.parameters)
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
      result = fulltype(lexemes, lex + 1, subroutine)
      if (result.fulltype.type === 'array') throw error('Functions cannot return arrays.', lexemes[result.lex])
      subroutine.variables[0].fulltype = result.fulltype
      subroutine.returns = result.fulltype.type
      lex = result.lex
    }
  }

  // return the next lexeme index and the routine object
  return { lex, subroutine }
}

// look for "[var] identifier1[, identifier2, ...]: <fulltype>"; return array of parameters and
// index of the next lexeme
const parameters = (lexemes, lex, routine) => {
  let parameters = []
  let result

  let more = true
  while (more) {
    result = (lexemes[lex] && lexemes[lex].content === 'var')
      ? variables(lexemes, lex + 1, routine, true, true)
      : variables(lexemes, lex, routine, true, false)
    parameters = parameters.concat(result.variables)
    lex = result.lex
    switch (lexemes[lex].content) {
      case ';':
        while (lexemes[lex].content === ';') lex = lex + 1
        break

      case ')':
        lex = lex + 1
        more = false
        break

      default:
        // anything else is an error
        throw error('Parameter declarations must be followed by a closing bracket ")".', lexemes[lex])
    }
  }

  return { lex, parameters }
}

// check if a string is already the name of a variable or constant in a routine
const isDuplicate = (routine, name) =>
  routine.variables.concat(routine.constants).some((x) => x.name === name)
