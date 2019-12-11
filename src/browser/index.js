/*
The entry point for the browser version.
*/
import program from './program'
import machine from './machine'
import help from './help'
import about from './about'
import modal from './modal'
import tabs from './tabs'
// import examples from './examples'
import * as dom from 'common/components/dom'
import { send } from 'common/system/state'
import 'common/styles/browser.scss'

// grab the #tse element and add style classes
const tse = document.getElementById('tse')
tse.classList.add('tse')
tse.classList.add('tse-browser')

// initialise the app
const programDiv = program()
const machineDiv = machine()
const helpDiv = help()
const aboutDiv = about()
const modalDiv = modal()
const tabsDiv = tabs(programDiv, machineDiv, helpDiv, aboutDiv)
const tabPanesDiv = dom.createElement('div', 'tse-browser-tab-panes', [
  programDiv,
  machineDiv,
  helpDiv,
  aboutDiv
])
dom.setContent(tse, [tabsDiv, tabPanesDiv])
document.body.appendChild(modalDiv)

// maybe setup state variables based on the app's data properties
if (tse.dataset.language) {
  send('set-language', tse.dataset.language)
}
if (tse.dataset.example) {
  send('set-example', tse.dataset.example)
}
if (tse.dataset.file) {
  send('load-remote-file', tse.dataset.file)
}

// send the page ready signal (which will update the components to reflect the initial state)
send('ready')
