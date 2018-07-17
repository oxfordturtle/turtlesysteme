/** the compiler
 * -------------------------------------------------------------------------------------------------
 *
 * -------------------------------------------------------------------------------------------------
 */

// global imports
require('styles/highlighting.scss');

// local imports
const analyser = require('./analyser');
const lexer = require('./lexer');
const parser1 = require('./parser1');
const parser2 = require('./parser2');
const parser3 = require('./parser3');
const tokenizer = require('./tokenizer');

// the highlight function (used for making code look pretty)
const style = token =>
  `<span class="tsx-${token.type}">${token.content}</span>`;

const highlight = (code, language) =>
  tokenizer(code, language).map(style).join('');

// the main compiler function
const compile = (code, language) => {
  const lexemes = lexer(code, language);
  const routines = parser2(parser1(lexemes, language), language);
  console.log(routines);
  const pcode = [];
  //const pcode = parser3(routines, language);
  //console.log(pcode);
  const usage = analyser(lexemes, routines.slice(1), language);
  console.log(usage);
  return { usage, pcode };
};

// exports
module.exports = {
  compile,
  highlight,
};
