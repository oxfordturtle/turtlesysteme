/* languages/tokenizer
--------------------------------------------------------------------------------
program code (a string) goes in, an array of tokens comes out; these are used
both for syntax highlighting, and as a basis for the lexical analysis part of
compilation

this module just groups together the separate tokenizers for each language
--------------------------------------------------------------------------------
*/

const BASIC = require('./tokenizer/basic');
const Pascal = require('./tokenizer/pascal');
const Python = require('./tokenizer/python');

const tokenizers = { BASIC, Pascal, Python };

const tokenizer = (code, language) =>
  tokenizers[language](code);

module.exports = tokenizer;
