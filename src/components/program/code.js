/*
The code editor component.
*/

// create the HTML elements first
const { element } = require('dom')
const numbers = element('ol') // for line numbers
const prettyCode = element('code') // for the highlighted code
const prettyWrapper = element('pre', { content: [prettyCode] }) // warpper for the highlighted code
const handleTab = (event) => {
  if (event.keyCode === 9) {
    const pos = event.currentTarget.selectionStart
    const left = event.currentTarget.value.slice(0, pos)
    const right = event.currentTarget.value.slice(pos)
    event.preventDefault()
    event.currentTarget.value = [left, right].join('  ')
    state.send('set-code', event.currentTarget.value)
    event.currentTarget.selectionStart = pos + 2
    event.currentTarget.selectionEnd = pos + 2
  }
}
const plainCode = element('textarea', { // for capturing the user input
  wrap: 'off',
  spellcheck: 'false',
  autocapitalize: 'off',
  autocomplete: 'off',
  autocorrect: 'off',
  on: [
    { type: 'keydown', callback: handleTab },
    { type: 'input', callback: (e) => { state.send('set-code', e.currentTarget.value) } }
  ]
})
const code = element('div', { classes: ['tsx-code'], content: [plainCode, numbers, prettyWrapper] })

// export the HTML element
module.exports = code

// dependencies
const state = require('state')
const { highlight } = require('compiler')

// function to refresh the textarea
const refreshPlain = (text) => {
  plainCode.value = text
  plainCode.style.height = `${numbers.scrollHeight.toString(10)}px`
  plainCode.style.width = `${prettyWrapper.scrollWidth.toString(10)}px`
}

// function to synchronise the component with the application state
const refresh = ({ code, language }) => {
  const lines = code.split('\n')
  numbers.innerHTML = lines.map((x, y) => `<li>${(y + 1).toString(10)}</li>`).join('')
  prettyCode.innerHTML = highlight(code, language)
  window.requestAnimationFrame(refreshPlain.bind(null, code))
}

// synchronise with the application state
state.on('code-changed', refresh)

state.on('file-changed', () => {
  code.scrollTop = 0
  code.scrollLeft = 0
})
