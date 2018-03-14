/**
 * syntax highlighting for the different languages
 */
const BASIC = require('./tokenizer/basic');
const Pascal = require('./tokenizer/pascal');
const Python = require('./tokenizer/python');
require('../styles/highlighting.scss');

const tokenizer = { BASIC, Pascal, Python };

const style = token =>
  `<span class="tsx-${token.type}">${token.content}</span>`;

const highlight = (code, language) =>
  tokenizer[language](code).map(style).join('');

module.exports = highlight;
