/*
The program tabs. N.B. The CSS rules for the Electron version hide the file tab (whose functionality
is handled instead by the application menu); but to keep this code simple it might as well be
included invisibly.
*/

// create the HTML elements first
const { show, tabs } = require('dom')
const file = require('./file')
const code = require('./code')
const usage = require('./usage')
const pcode = require('./pcode')
const program = tabs('tsx-system-tabs', [
  { label: 'File', active: false, content: [file] },
  { label: 'Code', active: true, content: [code] },
  { label: 'Usage', active: false, content: [usage] },
  { label: 'PCode', active: false, content: [pcode.options, pcode.table] }
])

// export the root HTML element
module.exports = program

// dependencies
const state = require('state')

// register to show code tab when file changes
state.on('file-changed', show.bind(null, 'Code'))
