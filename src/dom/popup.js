/**
 * create a modal popup for displaying error messages
 */
const create = require('./create');
require ('../styles/popup.scss');

const title = create('h2')

const message = create('p');

const button = create('button', {
  content: 'OK',
  on: [{ type: 'click', callback: () => {
    popup.classList.remove('open');
  } }]
});

const buttons = create('div', { classes: ['buttons'], content: [button] });

const modal = create('div', {
  classes: ['tsx-modal'],
  content: [
    create('div', {
      classes: ['tsx-modal-head'],
      content: [title]
    }),
    create('div', {
      classes: ['tsx-modal-body'],
      content: [message, buttons]
    }),
  ],
});

const popup = create('div', {
  classes: ['tsx', 'tsx-popup'],
  content: [modal],
});

const show = (error) => {
  title.innerHTML = `${error.type} Error`;
  message.innerHTML = error.message;
  popup.classList.add('open');
};

module.exports = { popup, show };
