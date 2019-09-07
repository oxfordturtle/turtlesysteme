/*
The program code component.
*/
import * as dom from 'common/components/dom'
import highlight from 'common/compiler/highlight'
import { send, on } from 'common/system/state'

// sub elements of the code element
const plainCode = dom.createElement('textarea')
plainCode.wrap = 'off'
plainCode.spellcheck = false
plainCode.autocapitalize = 'off'
plainCode.autocomplete = 'off'
plainCode.autocorrect = 'off'

const lineNumbers = dom.createElement('ol')

const prettyCode = dom.createElement('code')

const prettyWrapper = dom.createElement('pre', null, [prettyCode])

const code = dom.createElement('div', 'tse-code', [plainCode, lineNumbers, prettyWrapper])

// add event listeners to interactive elements
plainCode.addEventListener('keydown', (e) => {
  // catch tab press and insert two spaces at the cursor
  if (e.keyCode === 9) {
    const pos = plainCode.selectionStart
    const left = plainCode.value.slice(0, pos)
    const right = plainCode.value.slice(pos)
    e.preventDefault()
    plainCode.value = [left, right].join('  ')
    send('set-code', plainCode.value)
    plainCode.selectionStart = pos + 2
    plainCode.selectionEnd = pos + 2
  }
})

plainCode.addEventListener('input', () => {
  send('set-code', plainCode.value)
})

// register to keep in sync with the application state
on('file-changed', () => {
  code.scrollTop = 0
  code.scrollLeft = 0
})

on('code-changed', ({ code, language }) => {
  const lines = code.split('\n')
  dom.setContent(lineNumbers, lines.map((x, y) => dom.createElement('li', null, y + 1)))
  dom.setContent(prettyCode, highlight(code, language))
  window.requestAnimationFrame(() => {
    plainCode.value = code
    plainCode.style.height = `${lineNumbers.scrollHeight.toString(10)}px`
    plainCode.style.width = `${prettyWrapper.scrollWidth.toString(10)}px`
  })
})

// the code element
export default code
