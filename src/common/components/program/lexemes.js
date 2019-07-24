/*
The program lexemes component.
*/
import highlight from 'common/compiler/highlight'
import { on } from 'common/system/state'

// the lexemes element
const lexemes = document.createElement('div')
export default lexemes

// initialise the element
lexemes.classList.add('tse-usage')
lexemes.innerHTML = `
  <table class="tse-lexemes-table">
    <thead>
      <tr>
        <th>Lex</th>
        <th>Line</th>
        <th style="width:50%">String</th>
        <th style="width:50%">Type</th>
      </tr>
    </thead>
    <tbody data-bind="lexemes"></tbody>
  </table>`

// grab sub-elements of interest
const lexemesBody = lexemes.querySelector('[data-bind="lexemes"]')

// register to keep in sync with the application state
on('lexemes-changed', ({ lexemes, language }) => {
  lexemesBody.innerHTML = ''
  lexemes.forEach((lexeme, index) => {
    lexemesBody.innerHTML += `
      <tr>
        <td>${index + 1}</td>
        <td>${lexeme.line}</td>
        <td><code>${lexeme.content ? highlight(lexeme.content, language) : ''}</code></td>
        <td>${lexeme.type}</td>
      </tr>`
  })
})
