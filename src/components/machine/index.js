/*
The machine tabs.
*/

// create the HTML elements first
const { show, tabs } = require('dom')
const { canvas, console, memory, output } = require('machine')
const settings = require('./settings')
const tabsSettings = [
  { label: 'Settings', active: false, content: [settings] },
  { label: 'Canvas', active: true, content: [canvas, console] },
  { label: 'Output', active: false, content: [output] },
  { label: 'Memory', active: false, content: [memory] }
]
const machine = tabs('tsx-system-tabs', tabsSettings)

// export the root HTML element
module.exports = machine

// dependencies
const state = require('state')

// respond to show settings request
state.on('show-settings', show.bind(null, 'Settings'))
