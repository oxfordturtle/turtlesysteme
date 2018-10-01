/*
Browser Version About Page Entry Point
*/
import { program } from './components/controls.js'
import about from './components/about.js'
import { send } from './system/state.js'

// grab the #tsx element
const tsx = document.getElementById('tsx')

// add the basic classes
tsx.classList.add('tsx')
tsx.classList.add('tsx-system')

// add the global .tsx-browser class to the root element (for browser-specific stylyes)
document.body.parentElement.classList.add('tsx-browser')

// fill the #tsx element with stuff
tsx.classList.add('tsx-help')
tsx.appendChild(program)
tsx.appendChild(about)

// send the page ready signal (which will update all the components to reflect the initial state)
send('ready')
