/**
 * the code editor component
 */
const { element } = require('dom');
const state = require('state');

// define the main HTML elements for this component
const ol = element('ol'); // for line numbers

const code = element('code'); // for the highlighted code

const pre = element('pre', { content: [code] }); // for the above code element

const textarea = element('textarea', { // for the plain text input by the user
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
          state.send('set-code', e.currentTarget.value);
          e.currentTarget.selectionStart = pos + 2;
          e.currentTarget.selectionEnd = pos + 2;
        }
      }
    },
    { // send 'set-code' signal on input
      type: 'input',
      callback: (e) => { state.send('set-code', e.currentTarget.value); }
    }
  ]
});

// function to refresh the textarea
const refreshTextarea = (text) => {
  textarea.value = text;
  textarea.style.height = `${ol.scrollHeight.toString(10)}px`;
  textarea.style.width = `${pre.scrollWidth.toString(10)}px`;
};

// function to synchronise the component with the application state
const refresh = (text, language = state.getLanguage()) => {
  const lines = text.split('\n');
  ol.innerHTML = lines.map((x, y) => `<li>${(y + 1).toString(10)}</li>`).join('');
  code.innerHTML = state.highlight(text, language);
  window.requestAnimationFrame(refreshTextarea.bind(null, text));
};

// synchronise with the current state, and subscribe to 'code-changed' reply to keep it in sync
refresh(state.getCode(), state.getLanguage());
state.on('code-changed', refresh);

// the exposed div, wrapping up all the above elements
const div = element('div', { classes: ['tsx-code'], content: [textarea, ol, pre] });
state.on('file-changed', () => { div.scrollTop = 0; div.scrollLeft = 0; });

// expose the HTML element for this component
module.exports = div;
