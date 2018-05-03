/* languages/parser
--------------------------------------------------------------------------------
lexemes go in, array of routines comes out; the first element of the array is
the main PROGRAM, and any subsequent elements are its SUBROUTINES, in the order
in which they need to be compiled

look at the parser/factory module to see what the PROGRAM and SUBROUTINE objects
look like

this analyses the structure of the program, and builds up lists of all the
constants, variables, and subroutines (with their variables and parameters) -
lexemes for the program (and any subroutine) code themselves are just stored
for subsequent handling by the pcoder

most of the analysis is language specific, handled by the basic/pascal/python
modules; this just does a couple of language-independent things at the end,
which are easier to do after the first pass is complete - namely:

 1) fix the addresses of the variables, and the total memory needed by a
    routine, which is much easier to do once we know what all the variables are
 2) fix the address of the global turtle variable (which depends on the number
    of subroutines, and whether any of them is a function
--------------------------------------------------------------------------------
*/

const BASIC = require('./basic');
const Pascal = require('./pascal');
const Python = require('./python');

const parsers = { BASIC, Pascal, Python };

// set the address of the variables for a routine, and determine how much
// memory it needs
// ----------
const fixVariableMemory = (routine) => {
  let memoryNeeded = 0;
  routine.variables.forEach((variable) => {
    memoryNeeded += 1;
    variable.index = memoryNeeded;
    if (variable.fulltype.length !== null) {
      memoryNeeded += variable.fulltype.length;
    }
  });
  routine.memoryNeeded = memoryNeeded;
};

// base number of pointers (turtle, keybuffer, plus 8 file slots)
// ----------
const basePointers = 10;

// subroutine pointers needed (number of subroutines, plus 1 for the return value if there's at
// least one function)
// ----------
const subroutinePointers = subroutines =>
  subroutines.some(x => x.type === 'function') ? subroutines.length + 1 : subroutines.length;

// get the address of the turtle global variable (offset by the pointers)
// ----------
const turtleAddress = subroutines =>
  basePointers + subroutinePointers(subroutines);

// parse the lexemes and return an array of routines
// ----------
const parser = (lexemes, language) => {
  // do the main parsing
  const routines = parsers[language](lexemes);
  const program = routines[0];
  const subroutines = routines.slice(1);
  // now do some final calculations
  routines.forEach(fixVariableMemory);
  program.turtleAddress = turtleAddress(subroutines);
  // and return the array of routines
  return routines;
};

module.exports = parser;
