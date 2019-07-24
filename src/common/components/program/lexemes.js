/*
The program lexemes component.
*/
import highlight from 'common/compiler/highlight'
import { on } from 'common/system/state'

// the lexemes element
const lexemes = document.createElement('div')
export default lexemes

// initialise the element
lexemes.classList.add('tsx-usage')
lexemes.innerHTML = `
  <table>
    <thead>
      <tr>
        <th></th>
        <th>Line</th>
        <th>Type</th>
        <th>Content</th>
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
        <td>${lexeme.type}</td>
        <td><code>${lexeme.content ? highlight(lexeme.content, language) : ''}</code></td>
      </tr>`
  })
})
