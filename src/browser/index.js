/*
The entry point for the browser version.
*/
import system from './system'
import help from './help'
import about from './about'
import { send } from 'common/system/state'
import 'common/styles/browser.scss'

// grab the #tsx element and add style classes
const tsx = document.getElementById('app')
tsx.classList.add('tsx')
document.body.parentElement.classList.add('tsx-browser')

switch (tsx.dataset.page) {
  case 'system':
    system(tsx)
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
