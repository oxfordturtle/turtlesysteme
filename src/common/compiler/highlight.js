/*
code highlighter
*/
import tokenizer from './tokenizer.js'

export default (code, language) =>
  tokenizer(code, language).map(style).join('')

const style = token =>
  `<span class="tsx-${token.type}">${token.content}</span>`
