/* compiler/parser
----------------------------------------------------------------------------------------------------
lexemes go in, array of routines comes out; the first element of the array is the main PROGRAM, and
any subsequent elements are its SUBROUTINES, in the order in which they need to be compiled

look at the tools/factory module to see what the PROGRAM and SUBROUTINE objects look like

this analyses the structure of the program, and builds up lists of all the constants, variables, and
subroutines (with their variables and parameters) - lexemes for the program (and any subroutine)
code themselves are just stored for subsequent handling by the pcoder
----------------------------------------------------------------------------------------------------
*/

const BASIC = require('./basic');
const Pascal = require('./pascal');
const Python = require('./python');

const parsers = { BASIC, Pascal, Python };

// parse the lexemes and return an array of routines
const parser = (lexemes, language) =>
  parsers[language](lexemes);

module.exports = parser;
