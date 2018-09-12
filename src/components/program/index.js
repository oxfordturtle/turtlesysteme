/**
 * the program tabs; one set for the browser environment, and one for electron
 */

// global imports
const { tabs } = require('dom');
const state = require('state');

// loval imports
const file = require('./file');
const code = require('./code');
const usage = require('./usage');
const pcode = require('./pcode');

// file tab
const fileTab = { label: 'File', active: false, content: [file] };

// other tabs
const otherTabs = [
  { label: 'Code', active: true, content: [code] },
  { label: 'Usage', active: false, content: [usage] },
  { label: 'PCode', active: false, content: [pcode] },
];

// all tabs (optionally including the file tab)
const allTabs = includeFileTab =>
  (includeFileTab ? [fileTab, ...otherTabs] : otherTabs);

// register to show Code tab when file changes
state.on('file-changed', tabs.show.bind(null, 'Code'));

// program tabs (with or without file tab)
const programTabs = (context) => {
  switch (context) {
    case 'browser':
      return tabs.tabs('tsx-system-tabs', allTabs(true));
    case 'electron':
      return tabs.tabs('tsx-system-tabs', allTabs(false));
  }
};

// expose a function to create the whole div, with content relative to the context
module.exports = {
  tabs: programTabs,
};
