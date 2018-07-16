const lexer = require('./lexer');
const parser1 = require('./parser1');
//const parser2 = require('./parser2');
//const usage = require('./usage');

const compile = (code, language) => {
  const lexemes = lexer(code, language);
  const routines = parser1(lexemes, language);
  console.log(routines);
  //const pcode = parser2(routines, language);
  //console.log(pcode);
  //const usage = usage(lexemes, routines, language);
  //console.log(usage);
  return { usage: [], pcode: [] };
};

module.exports = compile;
