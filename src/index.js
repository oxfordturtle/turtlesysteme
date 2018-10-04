/*
Browser Version Main Entry Point
*/
import { element, tabs } from './tools.js'
import * as controls from './components/controls.js'
import * as program from './components/program.js'
import * as machine from './components/machine.js'
import { on, send } from './system/state.js'

// grab the #tsx element
const tsx = document.getElementById('tsx')

// create the elements for the modal and overlay
const title = element('h2')
const message = element('p')
const hide = () => { overlay.classList.remove('tsx-open') }
const ok = element('button', { content: 'OK', on: [{ type: 'click', callback: hide }] })
const buttons = element('div', { classes: ['tsx-modal-buttons'], content: [ok] })
const head = element('div', { classes: ['tsx-modal-head'], content: [title] })
const body = element('div', { classes: ['tsx-modal-body'], content: [message, buttons] })
const modal = element('div', { classes: ['tsx-modal'], content: [head, body] })
const overlay = element('div', { classes: ['tsx-overlay'], content: [modal] })

// add the basic classes
tsx.classList.add('tsx')

// add the global .tsx-browser class to the root element (for browser-specific stylyes)
document.body.parentElement.classList.add('tsx-browser')

// fill the #tsx element with stuff
tsx.appendChild(tabs('tsx-top-tabs', [
  { label: 'Program', active: true, content: [controls.program, program.component(true)] },
  { label: 'Machine', active: false, content: [controls.machine, machine.component(true)] }
]))

// add the popup overlay to the document body
document.body.appendChild(overlay)

// register to show errors on the modal dialog
on('error', (error) => {
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
})

// send the page ready signal (which will update all the components to reflect the initial state)
send('ready')
