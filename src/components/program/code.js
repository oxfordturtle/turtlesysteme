/**
 * the code editor component
 */
const create = require('../../dom/create');
const highlight = require('../../languages/highlight');
const session = require('../../state/session');
const signals = require('../../state/signals');
require('../../styles/code.scss');

// define the main HTML elements for this component
const ol = create('ol'); // for line numbers

const code = create('code'); // for the highlighted code

const pre = create('pre', { content: [code] }); // for the above code element

const textarea = create('textarea', { // for the plain text input by the user
  wrap: 'off',
  spellcheck: 'false',
  autocapitalize: 'off',
  autocomplete: 'off',
  autocorrect: 'off',
  on: [
    { // catch tab press on keydown, and insert spaces instead of losing focus
      type: 'keydown',
      callback: (e) => {
        if (e.keyCode === 9) {
          const pos = e.currentTarget.selectionStart;
          const left = e.currentTarget.value.slice(0, pos);
          const right = e.currentTarget.value.slice(pos);
          e.preventDefault();
          e.currentTarget.value = [left, right].join('  ');
          signals.send('set-code', e.currentTarget.value);
          e.currentTarget.selectionStart = pos + 2;
          e.currentTarget.selectionEnd = pos + 2;
        }
      }
    },
    { // send 'set-code' signal on input
      type: 'input',
      callback: (e) => { signals.send('set-code', e.currentTarget.value); }
    }
  ]
});

// function to refresh the textarea
const refreshTextarea = (text) => {
  textarea.value = text;
  textarea.style.height = `${ol.scrollHeight.toString(10)}px`;
  textarea.style.width = `${ol.scrollWidth.toString(10)}px`;
};

// function to synchronise the component with the application state
const refresh = (text, language = session.language.get()) => {
  const lines = text.split('\n');
  ol.innerHTML = lines.map((x, y) => `<li>${(y + 1).toString(10)}</li>`).join('');
  code.innerHTML = highlight(text, language);
  window.requestAnimationFrame(refreshTextarea.bind(null, text));
};

// synchronise with the current state, and subscribe to 'code-changed' reply to keep it in sync
refresh(session.code.get(), session.language.get());
signals.on('code-changed', refresh);

// the exposed div, wrapping up all the above elements
const div = create('div', { classes: ['tsx-code'], content: [textarea, ol, pre] });
signals.on('file-changed', () => { div.scrollTop = 0; div.scrollLeft = 0; });

// expose the HTML element for this component
module.exports = div;
