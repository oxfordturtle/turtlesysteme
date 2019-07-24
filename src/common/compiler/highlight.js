/*
code highlighter
*/
import tokenizer from './tokenizer.js'

export default (code, language) =>
  tokenizer(code, language).map(style).join('')

const style = token =>
  `<span class="tse-${token.type}">${token.content}</span>`
