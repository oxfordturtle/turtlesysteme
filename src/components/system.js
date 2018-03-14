/**
 * the sytem control bar
 */
const { LANGUAGES, VERSIONS } = require('../state/constants');
const create = require('../dom/create');
const session = require('../state/session');
const signals = require('../state/signals');
require('../styles/controls.scss');

// define the main HTML elements for this component (content depends on current application state)
const nameInput = create('input', {
  type: 'text',
  placeholder: 'filename',
  value: session.name.get(),
  on: [{ type: 'input', callback: (e) => { signals.send('set-name', e.currentTarget.value); } }]
});

const languageSelect = create('select', {
  content: LANGUAGES.map(language => create('option', { content: language, value: language })),
  value: session.language.get(),
  on: [{ type: 'change', callback: (e) => { signals.send('set-language', e.currentTarget.value); } }]
});

// subscribe to keep the elements in sync with the application state
signals.on('name-changed', (name) => { nameInput.value = name; });
signals.on('language-changed', (language) => { languageSelect.value = language; });

// create the left hand side of the system control
const left = includeNameInput =>
  (includeNameInput ? [nameInput] : []);

// create the right hand side of the system control
const right = includeLanguageSelect =>
  (includeLanguageSelect ? [languageSelect] : []);

// function for creating the control bar, with different options
const system = (includeNameInput, includeLanguageSelect) => {
  return create('div', {
    classes: ['tsx-controls'],
    content: [...left(includeNameInput), ...right(includeLanguageSelect)]
  });
}

// expose the function
module.exports = system;
