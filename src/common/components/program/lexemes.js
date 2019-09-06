/*
The program lexemes component.
*/
import * as dom from 'common/components/dom'
import highlight from 'common/compiler/highlight'
import { on } from 'common/system/state'

// elements within the lexemes element
const lexemesTHead = dom.createElement('thead', null, [
  dom.createElement('tr', null, [
    dom.createElement('th', null, 'Lex'),
    dom.createElement('th', null, 'Line'),
    dom.createElement('th', 'tse-wide', 'String'),
    dom.createElement('th', 'tse-wide', 'Type')
  ])
])

const lexemesTBody = dom.createElement('tbody')

const lexemesTable = dom.createElement('table', 'tse-lexemes-table', [lexemesTHead, lexemesTBody])

const lexemesTBodyRow = (language, lexeme, index) =>
  dom.createElement('tr', null, [
    dom.createElement('td', null, `${index + 1}`),
    dom.createElement('td', null, lexeme.line.toString(10)),
    dom.createElement('td', null, [
      dom.createElement('code', null, lexeme.content ? highlight(lexeme.content, language) : '')
    ]),
    dom.createElement('td', null, lexeme.type)
  ])

// register to keep in sync with the application state
on('lexemes-changed', ({ lexemes, language }) => {
  dom.setContent(lexemesTBody, lexemes.map(lexemesTBodyRow.bind(null, language)))
})

// the lexemes element
export default dom.createElement('div', 'tse-lexemes', [lexemesTable])
