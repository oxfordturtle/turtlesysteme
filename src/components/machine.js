/**
 * the machine tabs; one set for the browser environment, and one for electron
 */
const tabs = require('../dom/tabs');
const settings = require('./machine/settings');
const canvas = require('./machine/canvas');
const console = require('./machine/console');
const output = require('./machine/output');
const memory = require('./machine/memory');

// settings tab
const settingsTab = { label: 'Settings', active: false, content: [settings] };

// other tabs
const otherTabs = [
  { label: 'Canvas', active: true, content: [canvas.canvas, console.console] },
  { label: 'Output', active: false, content: [output.output] },
  { label: 'Memory', active: false, content: [memory.display] }
];

// all tabs (optionally including the settings tab)
const allTabs = includeSettingsTab =>
  (includeSettingsTab ? [settingsTab, ...otherTabs] : otherTabs);

// function to create the whole did, with or without the file tab
const machine = includeSettingsTab =>
  tabs.create('tsx-system-tabs', allTabs(includeSettingsTab));

// expose the two sets of tabs
module.exports = machine;
