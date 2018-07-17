/* compiler/parser3
--------------------------------------------------------------------------------
array of routines goes in, pcode comes out

this second pass over the lexemes generates the compiled pcode, using the language-independent
pcoder module (the only one that outputs pcode directly), and the appropriate language-specific
module

the language-specific modules are responsible for running through the lexemes that make up the
commands of the individual routines; this module pieces those results together, and wraps them up in
the appropriate routine start and end code
--------------------------------------------------------------------------------
*/

// local imports
const { pcoder } = require('../tools');
const BASIC = require('./basic');
const Pascal = require('./pascal');
const Python = require('./python');

// generate the inner pcode for routines (minus start and end stuff)
const compileInnerCode = (routine, startLine, language) => {
  const parsers = { BASIC, Pascal, Python };
  let pcode = [];
  let result;
  let lex = 0;
  while (lex < routine.lexemes.length) {
    result = parsers[language].call(null, routine, lex, startLine + pcode.length);
    lex = result.lex;
    pcode = pcode.concat(result.pcode);
  }
  return pcode;
};

// generate the pcode for subroutines (returns an empty array if there aren't any)
const compileSubroutines = (routines, startLine, language) => {
  let subroutinesCode = [];
  let index = 1;
  let subroutineCode;
  let innerStartLine;
  let innerCode;
  while (index < routines.length) {
    routines[index].startLine = startLine;
    innerStartLine = startLine + pcoder.subroutineStartCode(routines[index]).length;
    innerCode = compileInnerCode(routines[index], innerStartLine, language);
    subroutineCode = pcoder.subroutine(routines[index], innerCode);
    subroutinesCode = subroutinesCode.concat(subroutineCode);
    index += 1;
    startLine += subroutineCode.length;
  }
  return subroutinesCode;
};

// the main parser3 function - generates pcode from the array of routines
const parser3 = (routines, language) => {
  const program = routines[0];
  const subroutines = routines.slice(1);
  const programStartCodeLength = pcoder.programStartCode(program).length;
  const subroutinesStartLine = (subroutines.length > 0)
    ? programStartCodeLength + 2
    : programStartCodeLength + 1;
  const subroutinesCode = compileSubroutines(routines, subroutinesStartLine, language);
  const programStartLine = subroutinesStartLine + subroutinesCode.length;
  const innerCode = compileInnerCode(program, programStartLine, language);
  return pcoder.program(routines[0], subroutinesCode, innerCode);
};

module.exports = parser3;
