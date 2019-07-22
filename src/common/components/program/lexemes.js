/*
The program lexemes component.
*/
import { on } from 'common/system/state'

// the lexemes element
const lexemes = document.createElement('div')
export default lexemes

// initialise the element
lexemes.innerHTML = `
  <table>
    <thead>
      <tr>
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
on('lexemes-changed', (lexemes) => {
  lexemesBody.innerHTML = ''
  lexemes.forEach((lexeme) => {
    lexemesBody.innerHTML += `
      <tr>
        <td>${lexeme.line}</td>
        <td>${lexeme.type}</td>
        <td>${lexeme.content || ''}</td>
      </tr>`
  })
})
