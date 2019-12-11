/*
Setup the system page (browser).
*/
import * as dom from 'common/components/dom'
import { on } from 'common/system/state'

// setup the system page
export default () => {
  // create the modal and overlay
  const modalTitle = dom.createElement('h2')
  const modalMessage = dom.createElement('p')
  const modalButton = dom.createElement('button', null, 'OK')
  const overlay = dom.createElement('div', 'tse-overlay', [
    dom.createElement('div', 'tse-modal', [
      dom.createElement('div', 'tse-modal-head', [modalTitle]),
      dom.createElement('div', 'tse-modal-body', [
        modalMessage,
        dom.createElement('div', 'tse-modal-buttons', [modalButton])
      ])
    ])
  ])
  overlay.classList.add('tse')
  modalButton.addEventListener('click', () => {
    overlay.classList.remove('tse-open')
  })

  // register to show errors on the modal dialog
  on('error', (error) => {
    window.console.log(error) // for debugging
    if (error.lexeme) window.console.log(error.lexeme) // for debugging
    if (error.type) {
      // custom error
      modalTitle.innerHTML = `${error.type} Error`
      modalMessage.innerHTML = error.message
      if (error.lexeme) {
        modalTitle.innerHTML += `: "${error.lexeme.content}", line ${error.lexeme.line}`
      }
    } else {
      // native error
      modalTitle.innerHTML = 'System Error'
      modalMessage.innerHTML = 'An unexpected error has occured, suggesting there is a bug in the system. Please contact us with details of what you were doing when this message appeared, and we will do our best to locate and fix the bug.'
    }
    overlay.classList.add('tse-open')
  })

  // register to show warnings on the modal dialog
  on('warning', (warning) => {
    overlay.querySelector('h2').innerHTML = warning.title
    overlay.querySelector('p').innerHTML = warning.message
    overlay.classList.add('tse-open')
  })

  // return the overlay
  return overlay
}
