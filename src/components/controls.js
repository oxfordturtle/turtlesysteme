/**
 * the machine control bar
 *
 * a RUN/HALT button, a PLAY/PAUSE button, and a display of the current turtle properties
 */
const { element, hex } = require('dom')
const state = require('state')

// functions for interacting with the machine (via state)
const run = state.send.bind(null, 'compile-code', true)

const halt = state.send.bind(null, 'machine-halt')

const playPause = state.send.bind(null, 'machine-play-pause')

// buttons for interacting with the machine
const runOrHaltButton = element('button', {
  content: 'RUN',
  classes: ['tsx-run-halt-button'],
  on: [{ type: 'click', callback: run }]
})

const playOrPauseButton = element('button', {
  content: '&#10074;&#10074;',
  classes: ['tsx-play-pause-button']
})

// current turtle properties display
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

// subscribe to keep buttons in sync with the machine state
state.on('machine-started', () => {
  runOrHaltButton.innerHTML = 'HALT'
  runOrHaltButton.removeEventListener('click', run)
  runOrHaltButton.addEventListener('click', halt)
  playOrPauseButton.innerHTML = '&#10074;&#10074;'
  playOrPauseButton.addEventListener('click', playPause)
})

state.on('machine-stopped', () => {
  runOrHaltButton.innerHTML = 'RUN'
  runOrHaltButton.removeEventListener('click', halt)
  runOrHaltButton.addEventListener('click', run)
  playOrPauseButton.innerHTML = '&#10074;&#10074;'
  playOrPauseButton.removeEventListener('click', playPause)
})

state.on('machine-played', () => {
  playOrPauseButton.innerHTML = '&#10074;&#10074;'
})

state.on('machine-paused', () => {
  playOrPauseButton.innerHTML = '&#9658;'
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

/**
 * the controls DIV (written as if different for different contexts, to match the other components,
 * although in fact this component is the same for all contexts)
 */
const controls = content =>
  element('div', {
    classes: ['tsx-controls'],
    content: [runOrHaltButton, playOrPauseButton, turtleDisplay]
  })

// expose the controls DIV
module.exports = controls
