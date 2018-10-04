/*
Settings Page Entry Point
*/
import { element } from './tools.js'
import { settings } from './components/machine.js'
import { send } from './system/state.js'

// grab the #tsx element
const tsx = document.getElementById('tsx')

// add the basic classes
tsx.classList.add('tsx')

// add the global .tsx-browser or .tsx-electron class to the root element
if (window.isElectron) {
  document.body.parentElement.classList.add('tsx-electron')
} else {
  document.body.parentElement.classList.add('tsx-browser')
}

// fill the #tsx element with stuff
tsx.appendChild(element('div', { classes: ['tsx-settings'], content: settings }))

// send the page ready signal (which will update all the components to reflect the initial state)
send('ready')
