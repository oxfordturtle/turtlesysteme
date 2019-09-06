/*
Control bars for the machine half of the system.
*/
import canvas from './machine/canvas'
import console from './machine/console'
import output from './machine/output'
import languages from 'common/constants/languages'
import { send, on } from 'common/system/state'

// program controls element
export const program = document.createElement('div')

// machine controls element
export const machine = document.createElement('div')

// initialise the program controls element
program.classList.add('tse-controls')
program.innerHTML = `
  <select class="tse-language-select" data-bind="language-select">${languages.map(x => `<option value="${x}">${x}</option>`).join('')}</select>
  <input class="tse-filename-input" data-bind="name-input" type="text" placeholder="filename">`

// initialise the machine controls element
machine.classList.add('tse-controls')
machine.innerHTML = `
  <div class="tse-machine-buttons">
    <button class="tse-run-halt-button" data-bind="run-halt">RUN</button>
    <button class="tse-play-pause-button" data-bind="play-pause">&#10074;&#10074;</button>
  </div>
  <dl class="tse-turtle-properties">
    <dt>X</dt>
    <dd class="tse-turtxy" data-bind="turtx">500</dd>
    <dt>Y</dt>
    <dd class="tse-turtxy" data-bind="turty">500</dd>
    <dt>Direction</dt>
    <dd class="tse-turtd" data-bind="turtd">0</dd>
    <dt>Thickness</dt>
    <dd class="tse-turttc" data-bind="turtt">2</dd>
    <dt>Colour</dt>
    <dd class="tse-turttc" style="background:#000" data-bind="turtc"></dd>
  </dl>`

// grab subelements of interest
const nameInput = program.querySelector('[data-bind="name-input"]')
const languageSelect = program.querySelector('[data-bind="language-select"]')
const runHalt = machine.querySelector('[data-bind="run-halt"]')
const playPause = machine.querySelector('[data-bind="play-pause"]')
const turtx = machine.querySelector('[data-bind="turtx"]')
const turty = machine.querySelector('[data-bind="turty"]')
const turtd = machine.querySelector('[data-bind="turtd"]')
const turtt = machine.querySelector('[data-bind="turtt"]')
const turtc = machine.querySelector('[data-bind="turtc"]')

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

on('turtx-changed', (x) => {
  turtx.innerHTML = x.toString(10)
})

on('turty-changed', (y) => {
  turty.innerHTML = y.toString(10)
})

on('turtd-changed', (d) => {
  turtd.innerHTML = d.toString(10)
})

on('turtt-changed', (t) => {
  turtt.innerHTML = t.toString(10)
})

on('turtc-changed', (c) => {
  turtc.style.background = c
})
