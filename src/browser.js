/**
 * entry point for the browser version of the system
 */
const tabs = require('./dom/tabs');
const popup = require('./dom/popup');
const system = require('./components/system');
const program = require('./components/program');
const controls = require('./components/controls');
const machine = require('./components/machine');
const help = require('./components/help');
const signals = require('./state/signals');
require('./styles/system.scss');
require('./styles/help.scss');

// add the global .tsx-browser class to the root element (for browser-specific stylyes)
document.body.parentElement.classList.add('tsx-browser');

// grab the #tsx element
const tsx = document.getElementById('tsx');

// fill the #tsx element with stuff, depending on the page
switch (tsx.getAttribute('data-page')) {
  case 'about': // the about page
    tsx.classList.add('tsx');
    tsx.classList.add('tsx-system');
    tsx.classList.add('tsx-help');
    tsx.appendChild(system(false, true));
    tsx.appendChild(help.system);
    break;
  case 'help': // the help page
    tsx.classList.add('tsx');
    tsx.classList.add('tsx-system');
    tsx.classList.add('tsx-help');
    tsx.appendChild(system(false, true));
    tsx.appendChild(help.language);
    break;
  default: // the (main) system page
    tsx.classList.add('tsx');
    tsx.classList.add('tsx-system');
    tsx.appendChild(tabs.create('tsx-top-tabs', [
      { label: 'Program', active: true, content: [system(true, true), program(true)] },
      { label: 'Machine', active: false, content: [controls, machine(true)] },
    ]));
    break;
}

// add the modal dialog (invisible to start with)
document.body.appendChild(popup.popup);

// register to show errors on the modal dialog
signals.on('error', popup.show);
