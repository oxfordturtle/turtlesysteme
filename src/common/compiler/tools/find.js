/*
functions to find various things
*/
import colours from 'common/constants/colours'
import inputs from 'common/constants/inputs'
import commands from 'common/constants/commands'

// get the main program from a routine
export const program = (routine) =>
  routine.parent ? program(routine.parent) : routine

// find a constant visible to a routine
export const constant = (routine, name, language) =>
  something(routine, 'constants', name, language)

// find a variable visible to a routine
export const variable = (routine, name, language) => {
  const properties = (language === 'BASIC')
    ? ['turtx%', 'turty%', 'turtd%', 'turtt%', 'turtc%']
    : ['turtx', 'turty', 'turtd', 'turtt', 'turtc']
  const turtle = properties.indexOf(name) + 1
  const isGlobal = (routine.index > 0) ? (routine.globals.indexOf(name) > -1) : false
  if (turtle > 0) return { turtle, fulltype: { type: 'integer' } }
  if (isGlobal) return something(program(routine), 'variables', name, language)
  return something(routine, 'variables', name, language)
}

// find a predefined colour constant
export const colour = (name, language) =>
  colours.find(matches.bind(null, prepare(name), language))

// find an input mouse/key query code
export const input = (name, language) =>
  inputs.find(matches.bind(null, name, language))

// find a custom command visible to a routine
export const custom = (routine, name, language) =>
  something(routine, 'subroutines', name, language)

// find a native turtle command
export const native = (name, language) =>
  commands.find(matches.bind(null, prepare(name), language))

// find any command (custom or native)
export const command = (routine, name, language) =>
  custom(routine, name, language) || native(name, language)

// check if object name matches the given name (for the given language)
const matches = (name, language, object) =>
  ((object.name || object.names[language]) === name)

// find something (constant, variable, or subroutine) visible to a routine search the routine's
// haystack first, then it's parent (recursively)
const something = (routine, haystack, name, language) =>
  routine.parent
    ? routine[haystack].find(matches.bind(null, name, language)) ||
        something(routine.parent, haystack, name, language)
    : routine[haystack].find(matches.bind(null, name, language))

// prepare a name (to allow american spelling
const prepare = name =>
  name.replace(/gray/, 'grey')
    .replace(/GRAY/, 'GREY')
    .replace(/^COLOR$/, 'COLOUR')
    .replace(/^color$/, 'colour')
