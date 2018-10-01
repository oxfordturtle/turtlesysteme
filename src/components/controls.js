/*
control bars for basic system interaction
*/
import { element, hex } from '../tools.js'
import { languages } from '../data/constants.js'
import { send, on } from '../system/state.js'

// create the base HTML elements first
const nameInput = element('input', {
  type: 'text',
  placeholder: 'filename',
  on: [{ type: 'input', callback: (e) => { send('set-name', e.currentTarget.value) } }]
})
const languageSelect = element('select', {
  content: languages.map(language => element('option', { content: language, value: language })),
  on: [{ type: 'change', callback: (e) => { send('set-language', e.currentTarget.value) } }]
})
const runHalt = element('button', {
  content: 'RUN',
  classes: ['tsx-run-halt-button'],
  on: [{
    type: 'click',
    callback: (e) => {
      send('machine-run-halt')
      e.currentTarget.blur()
    }
  }]
})
const playPause = element('button', {
  content: '&#10074;&#10074;',
  classes: ['tsx-play-pause-button'],
  on: [{
    type: 'click',
    callback: (e) => {
      send('machine-play-pause')
      e.currentTarget.blur()
    }
  }]
})
const turtx = element('dd', { classes: ['tsx-turtxy'], content: '500' })
const turty = element('dd', { classes: ['tsx-turtxy'], content: '500' })
const turtd = element('dd', { classes: ['tsx-turtd'], content: '0' })
const turtt = element('dd', { classes: ['tsx-turttc'], content: '2' })
const turtc = element('dd', { classes: ['tsx-turttc'], style: 'background:#000;' })
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

// export the two control bars
export const program = element('div', {
  classes: ['tsx-controls'],
  content: [nameInput, languageSelect]
})

export const machine = element('div', {
  classes: ['tsx-controls'],
  content: [runHalt, playPause, display]
})

// subscribe to keep the elements in sync with the machine state
on('name-changed', (name) => { nameInput.value = name })
on('language-changed', (language) => { languageSelect.value = language })

on('machine-started', () => {
  runHalt.innerHTML = 'HALT'
  playPause.innerHTML = '&#10074;&#10074;'
  turtx.innerHTML = '500'
  turty.innerHTML = '500'
  turtd.innerHTML = '0'
  turtt.innerHTML = '2'
  turtc.style.background = '#000'
})

on('machine-stopped', () => {
  runHalt.innerHTML = 'RUN'
  playPause.innerHTML = '&#10074;&#10074;'
})

on('machine-played', () => {
  playPause.innerHTML = '&#10074;&#10074;'
})

on('machine-paused', () => {
  playPause.innerHTML = '&#9658;'
})

on('turtx-changed', (x) => { turtx.innerHTML = x.toString(10) })
on('turty-changed', (y) => { turty.innerHTML = y.toString(10) })
on('turtd-changed', (d) => { turtd.innerHTML = d.toString(10) })
on('turtt-changed', (t) => { turtt.innerHTML = t.toString(10) })
on('turtc-changed', (c) => { turtc.style.background = hex(c) })
