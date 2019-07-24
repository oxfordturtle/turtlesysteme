/*
The entry point for the browser version.
*/
import system from './system'
import help from './help'
import about from './about'
import { send } from 'common/system/state'
import 'common/styles/browser.scss'

// grab the #tse element and add style classes
const tse = document.getElementById('app')
tse.classList.add('tse')
document.body.parentElement.classList.add('tse-browser')

// maybe setup state variables based on the app's data properties
if (tse.dataset.language) {
  send('set-language', tse.dataset.language)
}
if (tse.dataset.example) {
  send('set-example', tse.dataset.example)
}

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
}

// send the page ready signal (which will update the components to reflect the initial state)
send('ready')
