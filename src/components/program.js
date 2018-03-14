/**
 * the program tabs; one set for the browser environment, and one for electron
 */
const tabs = require('../dom/tabs');
const signals = require('../state/signals');
const file = require('./program/file');
const code = require('./program/code');
const usage = require('./program/usage');
const pcode = require('./program/pcode');

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

// function to create the whole did, with or without the file tab
const program = includeFileTab =>
  tabs.create('tsx-system-tabs', allTabs(includeFileTab));

// register to show Code tab when file changes
signals.on('file-changed', tabs.show.bind(null, 'Code'));

// expose the function
module.exports = program;
