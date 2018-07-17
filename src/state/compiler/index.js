const { lexer } = require('lexer');
const parser1 = require('./parser1');
const parser2 = require('./parser2');
//const parser3 = require('./parser3');
//const usage = require('./usage');

const compiler = (code, language) => {
  const lexemes = lexer(code, language);
  const routines1 = parser1(lexemes, language);
  const routines2 = parser2(routines1, language);
  console.log(routines2);
  //const usage = usage(lexemes, routines2, language);
  return { usage: [], pcode: [] };
};

module.exports = compiler;
