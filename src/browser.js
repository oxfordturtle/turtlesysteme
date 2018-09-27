/*
Browser Version Entry Point

This module fills the page with the appropriate components (depending on the data-page attribute of
the #tsx element), and registers to show errors in a modal popup.
*/

// dependencies
const { tabs } = require('dom')
const { controls, help, machine, popup, program, system } = require('components')
const state = require('state')

// grab the #tsx element
const tsx = document.getElementById('tsx')

// add the basic classes
tsx.classList.add('tsx')
tsx.classList.add('tsx-system')

// add the global .tsx-browser class to the root element (for browser-specific stylyes)
document.body.parentElement.classList.add('tsx-browser')

// load the css styles
require('styles/main.scss')

// add the popup overlay to the document body
document.body.appendChild(popup.overlay)

// fill the #tsx element with stuff, depending on the page
switch (tsx.getAttribute('data-page')) {
  case 'about': // the about page
    tsx.classList.add('tsx-help')
    tsx.appendChild(system)
    tsx.appendChild(help.system)
    break
  case 'help': // the help page
    tsx.classList.add('tsx-help')
    tsx.appendChild(system)
    tsx.appendChild(help.language)
    break
  default: // the (main) system page
    tsx.appendChild(tabs('tsx-top-tabs', [
      { label: 'Program',
        active: true,
        content: [ system, program.tabs ]
      },
      { label: 'Machine',
        active: false,
        content: [ controls, machine.tabs ]
      }
    ]))
    break
}

// register to show errors on the modal dialog
state.on('error', popup.show)

// send the page ready signal (which will update all the components to reflect the initial state)
state.send('ready')
