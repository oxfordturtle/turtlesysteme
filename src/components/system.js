/*
The sytem control bar.

Basic system controls shown above the program tabs; includes current filename and language select
menu. N.B. The latter is hidden by CSS rules in the Electron version, but might as well be included
anyway to make this module simpler.
*/

// create the HTML elements first
const { element } = require('dom')
const { languages } = require('data')
const nameInput = element('input', {
  type: 'text',
  placeholder: 'filename',
  on: [{ type: 'input', callback: (e) => { state.send('set-name', e.currentTarget.value) } }]
})
const languageSelect = element('select', {
  content: languages.map(language => element('option', { content: language, value: language })),
  on: [{ type: 'change', callback: (e) => { state.send('set-language', e.currentTarget.value) } }]
})
const system = element('div', { classes: ['tsx-controls'], content: [nameInput, languageSelect] })

// export the root HTML element
module.exports = system

// dependencies
const state = require('state')

// subscribe to keep the elements in sync with the application state
state.on('name-changed', (name) => { nameInput.value = name })
state.on('language-changed', (language) => { languageSelect.value = language })
