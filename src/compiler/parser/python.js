/* languages/parser/python
--------------------------------------------------------------------------------
parser for Turtle Python - lexemes go in, array of routines comes out; the first
element in the array is the main PROGRAM object

look at the factory module to see what the PROGRAM object (and its components)
look like

this analyses the structure of the program, and builds up lists of all the
constants, variables, and subroutines (with their variables and parameters) -
lexemes for the program (and any subroutine) code themselves are just stored
for subsequent handling by the pcoder
--------------------------------------------------------------------------------
*/

const factory = require('./factory');

const parser = (lexemes) => {
  return [factory.program('program', 'Python')];
};

module.exports = parser;
