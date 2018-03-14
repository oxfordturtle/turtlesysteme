/**
 * entry point for the desktop version of the system
 */
const electron = require('electron');
const tabs = require('./dom/tabs');
const system = require('./components/system');
const program = require('./components/program');
const controls = require('./components/controls');
const machine = require('./components/machine');
const help = require('./components/help');
const settings = require('./components/machine/settings');
const session = require('./state/session');
const signals = require('./state/signals');
require('./styles/system.scss');
require('./styles/help.scss');

// add the global .tsx-electron class to the root element (for electron-specific stylyes)
document.body.parentElement.classList.add('tsx-electron');

// grab the #tsx element
const tsx = document.getElementById('tsx');

// add basic classes
tsx.classList.add('tsx');
tsx.classList.add('tsx-system');

// fill the #tsx element with stuff, depending on the page
switch (electron.remote.getCurrentWindow().page) {
  case 'settings':
    tsx.apendChild(settings);
    break;
  case 'about':
    tsx.classList.add('tsx-help');
    tsx.appendChild(help.system);
    break;
  case 'help':
    tsx.classList.add('tsx-help');
    tsx.appendChild(help.language);
    break;
  default:
    tsx.appendChild(tabs.create('tsx-top-tabs', [
      { label: 'Program', active: true, content: [system(true, false), program(false)] },
      { label: 'Machine', active: false, content: [controls, machine(false)] },
    ]));
    break;
}

// pass ipcRenderer signals (from menu item clicks) onto the signals module
signals.signals.forEach((signal) => {
  electron.ipcRenderer.on(signal, (event, data) => signals.send(signal, data));
});

// in the system window, tell the main process when the language has changed, so that it can tell
// the help window about it
if (electron.remote.getCurrentWindow().page === 'system') {
  signals.on('language-changed', (language) => {
    electron.ipcRenderer.send('language-changed', language);
  });
}

// show errors as dialog boxes
signals.on('error', (error) => {
  electron.remote.dialog.showMessageBox({
    title: `${error.type} Error`,
    message: error.message,
    buttons: ['OK'],
  });
});

// tell the main process about the local storage, so it can fix the menus accordingly
electron.ipcRenderer.send('language', session.language.get());
electron.ipcRenderer.send('show-canvas', session.showCanvas.get());
electron.ipcRenderer.send('show-output', session.showOutput.get());
electron.ipcRenderer.send('show-memory', session.showMemory.get());
