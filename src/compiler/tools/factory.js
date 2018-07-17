/** factory for the language-specific parsers - creates objects for routines, constants,
 *  and variables; using this module in the language-specific parsers ensures the same basic
 *  structure for the output of the different parsers
 */

// create main program object
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

// create subroutine object
const subroutine = (name, type, parent) =>
  ({
    name,
    type, // "procedure|function"
    level: -1, // needed for the usage data table
    index: null, // set after initial construction
    indent: null, // Python only; set after initial construction
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

// create constant object
const constant = (name, type, value) =>
  ({ name, type, value });

// create variable (and parameter) object
const variable = (name, routine, byref = false) =>
  ({
    name,
    routine,
    byref: byref,   // true only for parameters (potentially)
    index: null,    // fixed later by the main parser module
    fulltype: null, // set after initial construction
    private: null, // routine for private variables (BASIC only)
  });

const fulltype = (type, length = null, start = null, fulltype = null) => {
  const ft = { type, length, start, fulltype };
  if (type === 'string') ft.length = 33;
  return ft;
};

// expose the factory functions
module.exports = {
  program,
  subroutine,
  constant,
  variable,
  fulltype,
};
