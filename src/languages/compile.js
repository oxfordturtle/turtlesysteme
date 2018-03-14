const lexer = require('./lexer');

const compile = (code, language) => {
  console.log(lexer(code, language));
  return { usage: [], pcode: [] };
};

module.exports = compile;
