/*
The Electron renderer process.
*/
import { ipcRenderer, remote } from 'electron'
import about from './about'
import help from './help'
import settings from './settings'
import system from './system'
import signals from 'common/constants/signals'
import { send } from 'common/system/state'
import 'common/styles/electron.scss'

// grab the #tse element and add style classes
const tse = document.getElementById('app')
tse.classList.add('tse')

// setup the page
switch (remote.getCurrentWindow().page) {
  case 'system':
    system(tse)
    break

  case 'settings':
    settings(tse)
    break

  case 'help':
    help(tse)
    break

  case 'about':
    about(tse)
    break
}

// register to pass ipcRenderer messages (from menu item clicks) onto the state module
signals.forEach((signal) => {
  ipcRenderer.on(signal, (event, data) => send(signal, data))
})

// send the page ready signal (which will update the components to reflect the initial state)
send('ready')
