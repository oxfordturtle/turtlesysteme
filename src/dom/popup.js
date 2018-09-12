/**
 * create a modal popup for displaying error messages
 */
const element = require('./element');

// the popup title
const title = element('h2')

// the popup message
const message = element('p');

// the OK (close) button
const button = element('button', {
  content: 'OK',
  on: [ { type: 'click', callback: () => {
    overlay.classList.remove('open');
  } } ],
});

// wrapper for the OK (close) button
const buttons = element('div', {
  classes: [ 'buttons' ],
  content: [ button ],
});

// the modal popup (contains title, message, and OK (close) button
const modal = element('div', {
  classes: [ 'tsx-modal' ],
  content: [
    element('div', {
      classes: [ 'tsx-modal-head' ],
      content: [ title ],
    }),
    element('div', {
      classes: [ 'tsx-modal-body'] ,
      content: [ message, buttons ],
    }),
  ],
});

// the overlay (contains the popup)
const overlay = element('div', {
  classes: [ 'tsx', 'tsx-modal-overlay' ],
  content: [ modal ],
});

// function for filling the modal with error message data and showing it
const show = (error) => {
  console.log(error);
  if (error.type) {
    // custom error
    title.innerHTML = `${error.type} Error`;
    message.innerHTML = error.message;
    if (error.lexeme) {
      title.innerHTML += ` - "${error.lexeme.content}", line ${error.lexeme.line}`;
    }
  } else {
    // native error
    title.innerHTML = 'System Error';
    message.innerHTML = 'An unexpected error has occured, suggesting there is a bug in the system. Please contact us with details of what you were doing when this message appeared, and we will do our best to locate and fix the bug.';
  }
  overlay.classList.add('open');
};

// module exports
module.exports = {
  overlay,
  show,
};
