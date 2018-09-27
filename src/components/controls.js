/*
The machine control bar: a RUN/HALT button, a PLAY/PAUSE button, and a display showing the current
Turtle properties. The RUN/HALT function sends the machine component, so that the virtual machine
can use it to output to the canvas, console, etc.
*/

// create the elements first
const { element } = require('dom')
const machine = require('./machine')
const runHalt = element('button', {
  content: 'RUN',
  classes: ['tsx-run-halt-button'],
  on: [{ type: 'click', callback: () => { state.send('machine-run-halt', machine) } }]
})
const playPause = element('button', {
  content: '&#10074;&#10074;',
  classes: ['tsx-play-pause-button'],
  on: [{ type: 'click', callback: () => { state.send('machine-play-pause') } }]
})
const turtx = element('dd', { classes: ['tsx-turtxy'], content: '500' })
const turty = element('dd', { classes: ['tsx-turtxy'], content: '500' })
const turtd = element('dd', { classes: ['tsx-turtd'], content: '0' })
const turtt = element('dd', { classes: ['tsx-turttc'], content: '2' })
const turtc = element('dd', { classes: ['tsx-turttc'], style: 'background-color:#000;' })
const display = element('dl', {
  classes: ['tsx-turtle-properties'],
  content: [
    element('dt', { content: 'X' }),
    turtx,
    element('dt', { content: 'Y' }),
    turty,
    element('dt', { content: 'D' }),
    turtd,
    element('dt', { content: 'T' }),
    turtt,
    element('dt', { content: 'C' }),
    turtc
  ]
})
const controls = element('div', {
  classes: ['tsx-controls'],
  content: [runHalt, playPause, display]
})

// expose the root HTML element
module.exports = controls

// dependencies
const { hex } = require('dom')
const state = require('state')

// subscribe to keep buttons in sync with the machine state
state.on('machine-started', () => {
  runHalt.innerHTML = 'HALT'
  playPause.innerHTML = '&#10074;&#10074;'
})

state.on('machine-stopped', () => {
  runHalt.innerHTML = 'RUN'
  playPause.innerHTML = '&#10074;&#10074;'
})

state.on('machine-played', () => {
  playPause.innerHTML = '&#10074;&#10074;'
})

state.on('machine-paused', () => {
  playPause.innerHTML = '&#9658;'
})

state.on('turtx-changed', (x) => { turtx.innerHTML = x.toString(10) })
state.on('turty-changed', (y) => { turty.innerHTML = y.toString(10) })
state.on('turtd-changed', (d) => { turtd.innerHTML = d.toString(10) })
state.on('turtt-changed', (t) => { turtt.innerHTML = t.toString(10) })
state.on('turtc-changed', (c) => { turtc.style.background = hex(c) })
