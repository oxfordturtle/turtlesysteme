/* compiler/parser2/find
--------------------------------------------------------------------------------

--------------------------------------------------------------------------------
*/

const commands = require('data/commands');
const colours = require('data/colours');
const inputs = require('data/inputs');

// get the main program from a routine
// ----------
const mainProgram = (routine) =>
  routine.parent ? mainProgram(routine.parent) : routine;

// check if object name matches the given name (for the given language)
// ----------
matches = (name, language, object) =>
  ((object.name || object.names[language.toLowerCase()]) === name);

// find something (constant, variable, or subroutine) visible to a routine
// search the routine's haystack first, then it's parent (recursively)
// ----------
const something = (routine, haystack, name, language) =>
  routine.parent
    ? routine[haystack].find(matches.bind(null, name, language))
        || something(routine.parent, haystack, name, language)
    : routine[haystack].find(matches.bind(null, name, language));

// find a constant visible to a routine
// ----------
const constant = (routine, constantName, language) =>
  something(routine, 'constants', constantName, language);

// find a variable visible to a routine
// ----------
const variable = (routine, variableName, language) => {
  const turtleProperties = (language === "BASIC")
    ? ["TURTX%", "TURTY%", "TURTD%", "TURTT%", "TURTC%"]
    : ["turtx", "turty", "turtd", "turtt", "turtc"];
  const turtleProperty = turtleProperties.indexOf(variableName) + 1;
  const isGlobal = (routine.index > 0) ? (routine.globals.indexOf(variableName) > -1) : false;
  const program = mainProgram(routine);
  if (turtleProperty > 0) return { turtle: turtleProperty, type: 'int' };
  if (isGlobal) return something(program, 'variables', variableName, language);
  return something(routine, 'variables', variableName, language);
};

// find a predefined colour constant
// ----------
const colour = (name, language) => {
  // allow American spelling of "grey"
  name = name.replace(/gray/, 'grey');
  name = name.replace(/GRAY/, 'GREY');
  return colours.find(matches.bind(null, name, language));
};

// find an input mouse/key query code
const input = (name, language) =>
  inputs.find(matches.bind(null, name, language));

// find a custom command visible to a routine
// ----------
const customCommand = (routine, commandName, language) =>
  something(routine, 'subroutines', commandName, language);

// find a native turtle command
// ----------
const nativeCommand = (name, language) => {
  // allow American spelling of "colour"
  name = name.replace(/^COLOR$/, 'COLOUR');
  name = name.replace(/^color$/, 'colour');
  return commands.find(matches.bind(null, name, language));
};

// find any command (custom or native)
// ----------
const anyCommand = (routine, commandName, language) =>
  customCommand(routine, commandName, language) || nativeCommand(commandName, language);

module.exports = {
  mainProgram,
  constant,
  variable,
  colour,
  input,
  customCommand,
  nativeCommand,
  anyCommand,
};
