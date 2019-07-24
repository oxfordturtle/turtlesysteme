/*
The program code component.
*/
import highlight from 'common/compiler/highlight'
import { send, on } from 'common/system/state'

// the code element
const code = document.createElement('div')
export default code

// initialise the code element
code.classList.add('tse-code')
code.innerHTML = `
  <textarea data-bind="plain-code" wrap="off" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off"></textarea>
  <ol data-bind="line-numbers"></ol>
  <pre data-bind="pretty-wrapper"><code data-bind="pretty-code"></code></pre>`

// grab sub-elements of interest
const plainCode = code.querySelector('[data-bind="plain-code"]')
const prettyWrapper = code.querySelector('[data-bind="pretty-wrapper"]')
const prettyCode = code.querySelector('[data-bind="pretty-code"]')
const lineNumbers = code.querySelector('[data-bind="line-numbers"]')

// add event listeners to interactive elements
plainCode.addEventListener('keydown', (e) => {
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
  lineNumbers.innerHTML = lines.map((x, y) => `<li>${(y + 1).toString(10)}</li>`).join('')
  prettyCode.innerHTML = highlight(code, language)
  window.requestAnimationFrame(() => {
    plainCode.value = code
    plainCode.style.height = `${lineNumbers.scrollHeight.toString(10)}px`
    plainCode.style.width = `${prettyWrapper.scrollWidth.toString(10)}px`
  })
})
