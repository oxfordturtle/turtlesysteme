/*
a modal popup for displaying error messages
*/

// function to initialise the overlay
module.exports.init = () => {
  overlay.classList.add('tsx')
  overlay.classList.add('tsx-modal-overlay')
  overlay.appendChild(modal)
  document.body.appendChild(overlay)
}

// function to show the modal
module.exports.show = (error) => {
  console.log(error)
  if (error.type) {
    // custom error
    title.innerHTML = `${error.type} Error`
    message.innerHTML = error.message
    if (error.lexeme) {
      title.innerHTML += `: "${error.lexeme.content}", line ${error.lexeme.line}`
    }
  } else {
    // native error
    title.innerHTML = 'System Error'
    message.innerHTML = 'An unexpected error has occured, suggesting there is a bug in the system. Please contact us with details of what you were doing when this message appeared, and we will do our best to locate and fix the bug.'
  }
  overlay.classList.add('open')
}

// the overlay element (and its component elements)
const { element, overlay } = require('dom')

const title = element('h2')

const message = element('p')

const button = element('button', {
  content: 'OK',
  on: [{
    type: 'click',
    callback: () => { overlay.classList.remove('open') }
  }]
})

const buttons = element('div', {
  classes: [ 'buttons' ],
  content: [ button ]
})

const modal = element('div', {
  classes: [ 'tsx-modal' ],
  content: [
    element('div', {
      classes: [ 'tsx-modal-head' ],
      content: [ title ]
    }),
    element('div', {
      classes: ['tsx-modal-body'],
      content: [ message, buttons ]
    })
  ]
})
