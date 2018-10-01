/*
Browser Version Main Entry Point
*/
import { tabs } from './tools.js'
import * as popup from './components/popup.js'
import * as controls from './components/controls.js'
import program from './components/program.js'
import machine from './components/machine.js'
import { on, send } from './system/state.js'

// grab the #tsx element
const tsx = document.getElementById('tsx')

// add the basic classes
tsx.classList.add('tsx')
tsx.classList.add('tsx-system')

// add the global .tsx-browser class to the root element (for browser-specific stylyes)
document.body.parentElement.classList.add('tsx-browser')

// fill the #tsx element with stuff
tsx.appendChild(tabs('tsx-top-tabs', [
  { label: 'Program', active: true, content: [controls.program, program] },
  { label: 'Machine', active: false, content: [controls.machine, machine] }
]))

// add the popup overlay to the document body
document.body.appendChild(popup.overlay)

// register to show errors on the modal dialog
on('error', popup.show)

// send the page ready signal (which will update all the components to reflect the initial state)
send('ready')
