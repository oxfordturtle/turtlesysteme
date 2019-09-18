/*
Control bars for the machine half of the system.
*/
import * as dom from './dom'
import canvas from './machine/canvas'
import console from './machine/console'
import output from './machine/output'
import languages from 'common/constants/languages'
import { send, on } from 'common/system/state'

// program controls
const languageSelect = dom.createElement('select', 'tse-language-select', languages.map((language) => {
  return dom.createOption(language, language)
}))

const nameInput = dom.createTextInput('tse-filename-input', 'filename')

export const program = dom.createElement('div', 'tse-controls', [languageSelect, nameInput])

// machine controls
const runHalt = dom.createElement('button', 'tse-run-halt-button', 'RUN')

const playPause = dom.createElement('button', 'tse-play-pause-button', '&#10074;&#10074;')

const turtx = dom.createElement('dd', 'tse-turt-wide', '500')

const turty = dom.createElement('dd', 'tse-turt-wide', '500')

const turtda = dom.createElement('dd', 'tse-turt-wide', '0/360')

const turtt = dom.createElement('dd', 'tse-turt', '2')

const turtc = dom.createElement('dd', 'tse-turt')
turtc.style.background = '#000'

export const machine = dom.createElement('div', 'tse-controls', [
  dom.createElement('div', 'tse-machine-buttons', [runHalt, playPause]),
  dom.createElement('dl', 'tse-turtle-properties', [
    dom.createElement('dt', null, 'X'),
    turtx,
    dom.createElement('dt', null, 'Y'),
    turty,
    dom.createElement('dt', null, 'Direction'),
    turtda,
    dom.createElement('dt', null, 'Thickness'),
    turtt,
    dom.createElement('dt', null, 'Colour'),
    turtc
  ])
])

// setup event listeners on interactive elements
nameInput.addEventListener('input', (e) => {
  send('set-name', nameInput.value)
})

languageSelect.addEventListener('change', (e) => {
  send('set-language', languageSelect.value)
})

runHalt.addEventListener('click', (e) => {
  runHalt.blur()
  send('machine-run-halt', { canvas, console, output })
})

playPause.addEventListener('click', (e) => {
  playPause.blur()
  send('machine-play-pause')
})

// subscribe to keep in sync with system state
on('name-changed', (name) => {
  nameInput.value = name
})

on('language-changed', (language) => {
  languageSelect.value = language
})

on('machine-started', () => {
  runHalt.innerHTML = 'HALT'
  playPause.innerHTML = '&#10074;&#10074;'
  turtx.innerHTML = '500'
  turty.innerHTML = '500'
  turtda.innerHTML = '0/360'
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

on('turtx-changed', (x) => {
  turtx.innerHTML = x.toString(10)
})

on('turty-changed', (y) => {
  turty.innerHTML = y.toString(10)
})

on('turtd-changed', (d) => {
  const bits = turtda.innerHTML.split('/')
  turtda.innerHTML = `${d.toString(10)}/${bits[1]}`
})

on('turta-changed', (a) => {
  const bits = turtda.innerHTML.split('/')
  turtda.innerHTML = `${bits[1]}/${a.toString(10)}`
})

on('turtt-changed', (t) => {
  turtt.innerHTML = t.toString(10)
})

on('turtc-changed', (c) => {
  turtc.style.background = c
})

// tell the machine component what elements to use
send('set-machine-elements', { canvas, console, output })
