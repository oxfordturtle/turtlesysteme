/*
The entry point for the browser version.
*/
import all from './all'
import about from './about'
import system from './system'
import help from './help'
import examples from './examples'
import { send } from 'common/system/state'
import 'common/styles/browser.scss'

// grab the #tse element and add style classes
const tse = document.getElementById('tse')
tse.classList.add('tse')
document.body.parentElement.classList.add('tse-browser')

// initialise the app
switch (tse.dataset.page) {
  case 'system':
    system(tse)
    break

  case 'help':
    help(tse)
    break

  case 'about':
    about(tse)
    break

  case 'examples':
    examples(tse)
    break

  default:
    all(tse)
    break
}

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
