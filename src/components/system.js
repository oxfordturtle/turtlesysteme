/**
 * the sytem control bar
 * -------------------------------------------------------------------------------------------------
 * basic system controls shown above the program tabs; includes current filename and language
 * select menu (the latter in the browser only)
 * -------------------------------------------------------------------------------------------------
 */

// global imports
require('styles/controls.scss');
const { languages } = require('data');
const { create } = require('dom');
const state = require('state');

// define the main HTML elements for this component (content depends on current application state)
const nameInput = create('input', {
  type: 'text',
  placeholder: 'filename',
  value: state.getName(),
  on: [{ type: 'input', callback: (e) => { state.send('set-name', e.currentTarget.value); } }]
});

const languageSelect = create('select', {
  content: languages.map(language => create('option', { content: language, value: language })),
  value: state.getLanguage(),
  on: [{ type: 'change', callback: (e) => { state.send('set-language', e.currentTarget.value); } }]
});

// subscribe to keep the elements in sync with the application state
state.on('name-changed', (name) => { nameInput.value = name; });
state.on('language-changed', (language) => { languageSelect.value = language; });

// expose different control bars for different contexts
module.exports = (context) => {
  switch (context) {
    case 'help':
      return create('div', { classes: ['tsx-controls'], content: [languageSelect] });
    case 'browser':
      return create('div', { classes: ['tsx-controls'], content: [nameInput, languageSelect]});
    case 'electron':
      return create('div', { classes: ['tsx-controls'], content: [nameInput]});
  }
};
