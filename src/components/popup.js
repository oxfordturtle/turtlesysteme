/*
a modal popup for displaying error messages
*/

// create all the HTML elements first
const { element } = require('dom')
const title = element('h2')
const message = element('p')
const hide = () => { overlay.classList.remove('tsx-open') }
const ok = element('button', { content: 'OK', on: [{ type: 'click', callback: hide }] })
const buttons = element('div', { classes: ['tsx-buttons'], content: [ok] })
const head = element('div', { classes: ['tsx-modal-head'], content: [title] })
const body = element('div', { classes: ['tsx-modal-body'], content: [message, buttons] })
const modal = element('div', { classes: ['tsx-modal'], content: [head, body] })
const overlay = element('div', { classes: ['tsx', 'tsx-modal-overlay'], content: [modal] })

// export the modal overlay
module.exports.overlay = overlay

// and the function to show the popup (with error details)
module.exports.show = (error) => {
  console.log(error) // for debugging
  if (error.lexeme) console.log(error.lexeme) // for debugging
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
  overlay.classList.add('tsx-open')
}
