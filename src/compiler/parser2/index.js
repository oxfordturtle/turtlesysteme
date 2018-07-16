/* compiler/parser2
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

const BASIC = require('./basic');
const miniparser = require('./miniparser');
const Pascal = require('./pascal');
const pcoder = require('./pcoder');
const Python = require('./python');

// generate the inner pcode for routines (minus start and end stuff)
// ----------
const compileInnerCode = (routine, startLine, language) => {
  const parsers = { BASIC, Pascal, Python };
  const pcode = [];
  var result;
  var lex = 0;
  while (lex < routine.lexemes.length) {
    result = parsers[language].call(null, routine, lex, startLine + pcode.length);
    lex = result.lex;
    pcode = pcode.concat(result.pcode);
  }
  return pcode;
};

// generate the pcode for subroutines (returns an empty array if there aren't any)
// ----------
const compileSubroutines = (routines, startLine, language) => {
  const subroutinesCode = [];
  var index = 1;
  var subroutineCode;
  var innerStartLine;
  var innerCode;
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

// the main parser2 function - generates pcode from the array of routines
// ----------
const parser2 = (routines, language) => {
  // run the miniparser (for BASIC and Python)
  routines = miniparser(routines, language);
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

module.exports = parser2;
