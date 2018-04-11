const lexer = require('./lexer');
const parser = require('./parser');

const compile = (code, language) => {
  const lexemes = lexer(code, language);
  const routines = parser(lexemes, language);
  console.log(routines);
  return { usage: [], pcode: [] };
};

module.exports = compile;
