/*
the main Electron renderer process

fills the page with the main system components, sets things up so that messages from the main
process are passed on to the 'state' module, and registers to show errors in a system dialog box
*/
import { tabs } from './tools.js'
import * as controls from './components/controls.js'
import * as machine from './components/machine.js'
import * as program from './components/program.js'
import { on, send } from './system/state.js'

// import electron (Nodejs style)
const electron = require('electron')

// grab the #tsx element
const tsx = document.getElementById('tsx')

// add basic classes
tsx.classList.add('tsx')

// add the global .tsx-electron class to the root element (for electron-specific stylyes)
document.body.parentElement.classList.add('tsx-electron')

// fill the #tsx element with stuff
tsx.appendChild(tabs('tsx-top-tabs', [
  { label: 'Program', active: true, content: [controls.program, program.component(false)] },
  { label: 'Machine', active: false, content: [controls.machine, machine.component(false)] }
]))

// pass ipcRenderer messages (from menu item clicks) onto the signals module
const signals = [
  'set-file',
  'set-language',
  'new-program',
  'save-program',
  'save-program-as',
  'toggle-show-canvas',
  'toggle-show-output',
  'toggle-show-memory',
  'show-settings',
  'set-example'
]
signals.forEach((signal) => {
  electron.ipcRenderer.on(signal, (event, data) => send(signal, data))
})

// in the system window, tell the main process when the language has changed, so that it can tell
// the help window about it
if (electron.remote.getCurrentWindow().page === 'system') {
  on('language-changed', (language) => {
    electron.ipcRenderer.send('language-changed', language)
  })
}

// show errors as dialog boxes
on('error', (error) => {
  let title
  let message
  console.log(error)
  if (error.type) {
    // custom error
    title = `${error.type} Error`
    message = error.message
    if (error.lexeme) {
      title += ` - "${error.lexeme.content}", line ${error.lexeme.line}`
    }
  } else {
    // native error
    title = 'System Error'
    message = 'An unexpected error has occured, suggesting there is a bug in the system. Please contact us with details of what you were doing when this message appeared, and we will do our best to locate and fix the bug.'
  }
  electron.remote.dialog.showMessageBox({ title, message, buttons: ['OK'] })
})

// send the page ready signal (which will update all the components to reflect the initial state)
send('ready')

// tell the main process about the local storage, so that it can fix the menus accordingly
// electron.ipcRenderer.send('language', state.getLanguage())
// electron.ipcRenderer.send('show-canvas', state.getShowCanvas())
// electron.ipcRenderer.send('show-output', state.getShowOutput())
// electron.ipcRenderer.send('show-memory', state.getShowMemory())
