/**
 * the machine tabs; one set for the browser environment, and one for electron
 */
const { create, tabs } = require('dom');
const canvas = require('./canvas');
const console = require('./console');
const controls = require('./controls');
const memory = require('./memory');
const output = require('./output');
const settings = require('./settings');

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

// function to create the whole tabs div, with or without the file tab
const machineTabs = (context) => {
  switch (context) {
    case 'browser':
      return tabs.create('tsx-system-tabs', allTabs(true));
    case 'electron':
      return tabs.create('tsx-system-tabs', allTabs(false));
  }
};

// expose the two sets of tabs
module.exports = {
  canvas,
  console,
  controls,
  memory,
  output,
  settings,
  tabs: machineTabs,
};
