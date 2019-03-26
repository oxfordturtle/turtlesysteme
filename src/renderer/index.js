/*
The Electron renderer process.
*/
import { remote } from 'electron'
import about from './about'
import help from './help'
import settings from './settings'
import system from './system'
import { send } from 'common/system/state'
import 'common/styles/electron.scss'

// grab the #tsx element and add style classes
const tsx = document.getElementById('app')
tsx.classList.add('tsx')

// setup the page
switch (remote.getCurrentWindow().page) {
  case 'system':
    system(tsx)
    break

  case 'settings':
    settings(tsx)
    break

  case 'help':
    help(tsx)
    break

  case 'about':
    about(tsx)
    break
}

// send the page ready signal (which will update the components to reflect the initial state)
send('ready')
