/**
 * the help component - tabs for language help, and system help
 */
const { tabs } = require('dom');
const about = require('./about');
const basics = require('./basics');
const commands = require('./commands');
const constants = require('./constants');
const input = require('./input');
const operators = require('./operators');
const structures = require('./structures');
const versions = require('./versions');

// the language help tabs
const language = tabs.tabs('tsx-help-tabs', [
  { label: 'Commands', active: true, content: [commands] },
  { label: 'Basics', active: false, content: [basics] },
  { label: 'Structures', active: false, content: [structures] },
  { label: 'Operators', active: false, content: [operators] },
  { label: 'User Input', active: false, content: [input] },
  { label: 'Constants', active: false, content: [constants] },
]);

// the system help tabs
const system = tabs.tabs('tsx-help-tabs', [
  { label: 'About', active: true, content: [about] },
  { label: 'Versions', active: false, content: [versions] },
]);

// expose the language and system tabs
module.exports = {
  language,
  system,
};
