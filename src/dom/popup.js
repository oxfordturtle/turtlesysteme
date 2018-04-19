/**
 * create a modal popup for displaying error messages
 */
require('styles/popup.scss');
const create = require('./create');

const title = create('h2')

const message = create('p');

const button = create('button', {
  content: 'OK',
  on: [{ type: 'click', callback: () => {
    overlay.classList.remove('open');
  } }],
});

const buttons = create('div', {
  classes: ['buttons'],
  content: [button],
});

const modal = create('div', {
  classes: ['tsx-modal'],
  content: [
    create('div', {
      classes: ['tsx-modal-head'],
      content: [title],
    }),
    create('div', {
      classes: ['tsx-modal-body'],
      content: [message, buttons],
    }),
  ],
});

const overlay = create('div', {
  classes: ['tsx', 'tsx-modal-overlay'],
  content: [modal],
});

const show = (error) => {
  if (error.type) { // custom error
    title.innerHTML = `${error.type} Error`;
    message.innerHTML = error.message;
    if (error.lexeme) {
      title.innerHTML += ` - "${error.lexeme.content}", line ${error.lexeme.line}`;
    }
  } else { // native error
    console.error(error);
    title.innerHTML = 'System Error';
    message.innerHTML = 'An unexpected error has occured, suggesting there is a bug in the system. Please contact us with details of what you were doing when this message appeared, and we will do our best to locate and fix the bug.';
  }
  overlay.classList.add('open');
};

module.exports = {
  overlay,
  show,
};
