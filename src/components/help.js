/**
 * the help component - tabs for language help, and system help
 */
const tabs = require('../dom/tabs');
const commands = require('./help/commands');
const basics = require('./help/basics');
const structures = require('./help/structures');
const operators = require('./help/operators');
const input = require('./help/input');
const constants = require('./help/constants');
const about = require('./help/about');
const versions = require('./help/versions');

// the language help tabs
const language = tabs.create('tsx-help-tabs', [
  { label: 'Commands', active: true, content: [commands] },
  { label: 'Basics', active: false, content: [basics] },
  { label: 'Structures', active: false, content: [structures] },
  { label: 'Operators', active: false, content: [operators] },
  { label: 'User Input', active: false, content: [input] },
  { label: 'Constants', active: false, content: [constants] }
]);

// the system help tabs
const system = tabs.create('tsx-help-tabs', [
  { label: 'About', active: true, content: [about] },
  { label: 'Versions', active: false, content: [versions] }
]);

// expose the language and system tabs
module.exports = { language, system };
