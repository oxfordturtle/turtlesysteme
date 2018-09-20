/*
The machine control bar: a RUN/HALT button, a PLAY/PAUSE button, and a display showing the current
Turtle properties.
*/

// create the elements first
const { element, hex } = require('dom')
const run = () => { state.send('compile-code', true) }
const halt = () => { state.send('machine-halt') }
const playPause = () => { state.send('machine-play-pause') }
const runHaltButton = element('button', {
  content: 'RUN',
  classes: ['tsx-run-halt-button'],
  on: [{ type: 'click', callback: run }]
})
const playPauseButton = element('button', {
  content: '&#10074;&#10074;',
  classes: ['tsx-play-pause-button']
})
const turtx = element('dd', { classes: ['tsx-turtxy'], content: '500' })
const turty = element('dd', { classes: ['tsx-turtxy'], content: '500' })
const turtd = element('dd', { classes: ['tsx-turtd'], content: '0' })
const turtt = element('dd', { classes: ['tsx-turttc'], content: '2' })
const turtc = element('dd', { classes: ['tsx-turttc'], style: 'background-color:#000;' })
const turtleDisplay = element('dl', {
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
  content: [runHaltButton, playPauseButton, turtleDisplay]
})

// expose the root HTML element
module.exports = controls

// dependencies
const state = require('state')

// subscribe to keep buttons in sync with the machine state
state.on('machine-started', () => {
  runHaltButton.innerHTML = 'HALT'
  runHaltButton.removeEventListener('click', run)
  runHaltButton.addEventListener('click', halt)
  playPauseButton.innerHTML = '&#10074;&#10074;'
  playPauseButton.addEventListener('click', playPause)
  turtx.innerHTML = '500'
  turty.innerHTML = '500'
  turtd.innerHTML = '0'
  turtt.innerHTML = '2'
  turtc.style = 'background-color:#000'
})

state.on('machine-stopped', () => {
  runHaltButton.innerHTML = 'RUN'
  runHaltButton.removeEventListener('click', halt)
  runHaltButton.addEventListener('click', run)
  playPauseButton.innerHTML = '&#10074;&#10074;'
  playPauseButton.removeEventListener('click', playPause)
})

state.on('machine-played', () => {
  playPauseButton.innerHTML = '&#10074;&#10074;'
})

state.on('machine-paused', () => {
  playPauseButton.innerHTML = '&#9658;'
})

// subscribe to keep the turtle property display in sync with machine state
state.on('turtle-changed', ({ property, value }) => {
  switch (property) {
    case 1:
      turtx.innerHTML = value
      break
    case 2:
      turty.innerHTML = value
      break
    case 3:
      turtd.innerHTML = value
      break
    case 4:
      turtt.innerHTML = value
      break
    case 5:
      turtc.style.background = hex(value)
      break
    default:
      break
  }
})
