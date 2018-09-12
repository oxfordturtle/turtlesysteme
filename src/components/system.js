/**
 * the sytem control bar
 *
 * basic system controls shown above the program tabs; includes current filename and language
 * select menu (the latter in the browser only)
 */
const { languages } = require('data');
const { element } = require('dom');
const state = require('state');

// define the main HTML elements for this component (content depends on current application state)
const nameInput = element('input', {
  type: 'text',
  placeholder: 'filename',
  value: state.getName(),
  on: [{ type: 'input', callback: (e) => { state.send('set-name', e.currentTarget.value); } }]
});

const languageSelect = element('select', {
  content: languages.map(language => element('option', { content: language, value: language })),
  value: state.getLanguage(),
  on: [{ type: 'change', callback: (e) => { state.send('set-language', e.currentTarget.value); } }]
});

// the system DIV
const system = (context) => {
  switch (context) {
    case 'help':
      return element('div', { classes: ['tsx-controls'], content: [languageSelect] });
    case 'browser':
      return element('div', { classes: ['tsx-controls'], content: [nameInput, languageSelect]});
    case 'electron':
      return element('div', { classes: ['tsx-controls'], content: [nameInput]});
  }
};

// subscribe to keep the elements in sync with the application state
state.on('name-changed', (name) => { nameInput.value = name; });
state.on('language-changed', (language) => { languageSelect.value = language; });

// export the system DIV element
module.exports = system;
