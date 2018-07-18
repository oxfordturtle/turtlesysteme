/**
 * entry point for the browser version of the system
 */

// global imports
const { tabs, popup } = require('dom');
const { controls, help, machine, program, system } = require('components');
const state = require('state');

// grab the #tsx element
const tsx = document.getElementById('tsx');

// add the basic classes
tsx.classList.add('tsx');
tsx.classList.add('tsx-system');

// add the global .tsx-browser class to the root element (for browser-specific stylyes)
document.body.parentElement.classList.add('tsx-browser');

// load the css styles
require('styles/main.scss');

// fill the #tsx element with stuff, depending on the page
switch (tsx.getAttribute('data-page')) {
  case 'about': // the about page
    tsx.classList.add('tsx-help');
    tsx.appendChild(system('help'));
    tsx.appendChild(help.system);
    break;
  case 'help': // the help page
    tsx.classList.add('tsx-help');
    tsx.appendChild(system('help'));
    tsx.appendChild(help.language);
    break;
  default: // the (main) system page
    tsx.appendChild(tabs.create('tsx-top-tabs', [
      { label: 'Program', active: true, content: [
        system('browser'),
        program.tabs('browser'),
      ] },
      { label: 'Machine', active: false, content: [
        controls('browser'),
        machine.tabs('browser'),
      ] },
    ]));
    break;
}

// add the modal dialog (invisible to start with)
document.body.appendChild(popup.overlay);

// register to show errors on the modal dialog
state.on('error', popup.show);
