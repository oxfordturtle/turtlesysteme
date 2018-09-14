/*
the Electron renderer process

fills the page with the appropriate components (depending on what the main process asks for, via the
global 'page' variable)

also sets things up so that messages from the main process are passed on to the 'state' module, and
registers to show errors in a system dialog box
*/

const electron = require('electron')
const { tabs } = require('dom')
const { controls, help, machine, program, system } = require('components')
const state = require('state')

// grab the #tsx element
const tsx = document.getElementById('tsx')

// add basic classes
tsx.classList.add('tsx')
tsx.classList.add('tsx-system')

// add the global .tsx-electron class to the root element (for electron-specific stylyes)
document.body.parentElement.classList.add('tsx-electron')

// load the css styles
require('styles/main.scss')

// fill the #tsx element with stuff, depending on the page
switch (electron.remote.getCurrentWindow().page) {
  case 'settings':
    tsx.apendChild(machine.settings)
    break
  case 'about':
    tsx.classList.add('tsx-help')
    tsx.appendChild(help.system)
    break
  case 'help':
    tsx.classList.add('tsx-help')
    tsx.appendChild(help.language)
    break
  default:
    tsx.appendChild(tabs.tabs('tsx-top-tabs', [
      { label: 'Program',
        active: true,
        content: [
          system('electron'),
          program.tabs('electron')
        ] },
      { label: 'Machine',
        active: false,
        content: [
          controls('electron'),
          machine.tabs('electron')
        ] }
    ]))
    break
}

// pass ipcRenderer messages (from menu item clicks) onto the signals module
state.signals.forEach((signal) => {
  electron.ipcRenderer.on(signal, (event, data) => state.send(signal, data))
})

/**
 * in the system window, tell the main process when the language has changed, so that it can tell
 * the help window about it
 */
if (electron.remote.getCurrentWindow().page === 'system') {
  state.on('language-changed', (language) => {
    electron.ipcRenderer.send('language-changed', language)
  })
}

// show errors as dialog boxes
state.on('error', (error) => {
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

// tell the main process about the local storage, so that it can fix the menus accordingly
electron.ipcRenderer.send('language', state.getLanguage())
electron.ipcRenderer.send('show-canvas', state.getShowCanvas())
electron.ipcRenderer.send('show-output', state.getShowOutput())
electron.ipcRenderer.send('show-memory', state.getShowMemory())
