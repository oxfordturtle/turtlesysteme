/**
 * entry point for the desktop version of the system
 */
require('styles/system.scss');
require('styles/help.scss');
const electron = require('electron');
const { tabs } = require('dom');
const { help, machine, program, system } = require('components');
const state = require('state');

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
    tsx.apendChild(machine.settings);
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
      { label: 'Program', active: true, content: [system('electron'), program('electron')] },
      { label: 'Machine', active: false, content: [machine.controls, machine.tabs('electron')] },
    ]));
    break;
}

// pass ipcRenderer signals (from menu item clicks) onto the signals module
state.signals.forEach((signal) => {
  electron.ipcRenderer.on(signal, (event, data) => signals.send(signal, data));
});

// in the system window, tell the main process when the language has changed, so that it can tell
// the help window about it
if (electron.remote.getCurrentWindow().page === 'system') {
  state.on('language-changed', (language) => {
    electron.ipcRenderer.send('language-changed', language);
  });
}

// show errors as dialog boxes
state.on('error', (error) => {
  electron.remote.dialog.showMessageBox({
    title: `${error.type} Error`,
    message: error.message,
    buttons: ['OK'],
  });
});

// tell the main process about the local storage, so it can fix the menus accordingly
electron.ipcRenderer.send('language', state.get.language());
electron.ipcRenderer.send('show-canvas', state.get.showCanvas());
electron.ipcRenderer.send('show-output', state.get.showOutput());
electron.ipcRenderer.send('show-memory', state.get.showMemory());
