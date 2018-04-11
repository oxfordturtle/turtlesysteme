/* languages/parser/factory
--------------------------------------------------------------------------------
factory for the language-specific parsers - creates objects for routines,
constants, and variables

using this module in the language-specific parsers ensures the same basic
structure for the output of the different parsers
--------------------------------------------------------------------------------
*/

// pseudo-constructor for the main program
// ----------
const program = (name, language) =>
  ({
    language,
    name,
    index: 0,
    indent: 0, // base level of indent, for Python routines only
    constants: [],
    variables: [],
    subroutines: [],
    lexemes: [],
    turtleAddress: null, // fixed later by the main parser module
    memoryNeeded: null,  // fixed later by the main parser module
  });

// psuedo-constructor for subroutines
// ----------
const subroutine = (name, type, parent) =>
  ({
    name,
    type, // "procedure|function"
    level: -1, // needed for the usage data table
    index: null, // set after initial construction
    indent: null, // set after initial construction
    globals: [], // Python only
    nonlocals: [], // Python only
    constants: [], // Pascal only
    parameters: [],
    variables: [],
    parent,
    subroutines: [],
    lexemes: [],
    memoryNeeded: null // fixed later by the main parser module
  });

// pseudo-constructor for constants
// ----------
const constant = name =>
  ({
    name,
    type: null, // set after initial construction
    value: null // set after initial construction
  });

// pseudo-constructor for variables (and parameters)
// ----------
const variable = (name, routine, byref) =>
  ({
    name,
    routine,
    index: null,  // fixed later by the main parser module
    type: null,   // set after initial construction
    byref: byref, // true only for parameters (potentially)
    length: 0,    // > 0 for strings (changed after initial construction)
  });

module.exports = {
  program,
  subroutine,
  constant,
  variable,
};
