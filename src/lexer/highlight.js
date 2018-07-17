/* lexer/highlight
----------------------------------------------------------------------------------------------------
syntax highlighting for the different languages; code string goes in, marked-up html comes out
----------------------------------------------------------------------------------------------------
*/
const tokenizer = require('./tokenizer');
require('styles/highlighting.scss');

const style = token =>
  `<span class="tsx-${token.type}">${token.content}</span>`;

const highlight = (code, language) =>
  tokenizer(code, language).map(style).join('');

module.exports = highlight;
