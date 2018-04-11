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
    popup.classList.remove('open');
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
  title.innerHTML = `${error.type} Error`;
  message.innerHTML = error.message;
  if (error.text && error.line) {
    message.innerHTML += ` ('${error.text}', line ${error.line})`;
  }
  overlay.classList.add('open');
};

module.exports = {
  overlay,
  show,
};
