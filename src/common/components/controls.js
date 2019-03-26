/*
Control bars for the machine half of the system.
*/
import canvas from './machine/canvas'
import console from './machine/console'
import output from './machine/output'
import languages from 'common/constants/languages'
import { send, on } from 'common/system/state'

// the control bar element
const element = document.createElement('div')
export default element

// initialise the element
element.classList.add('tsx-controls')
element.innerHTML = `
  <div class="tsx-program-controls">
    <select class="tsx-language-select" data-bind="language-select">${languages.map(x => `<option value="${x}">${x}</option>`).join('')}</select>
    <input class="tsx-filename-input" data-bind="name-input" type="text" placeholder="filename">
  </div>
  <div class="tsx-machine-controls">
    <button class="tsx-run-halt-button" data-bind="run-halt">RUN</button>
    <button class="tsx-play-pause-button" data-bind="play-pause">&#10074;&#10074;</button>
    <dl class="tsx-turtle-properties">
      <dt>X</dt>
      <dd class="tsx-turtxy" data-bind="turtx">500</dd>
      <dt>Y</dt>
      <dd class="tsx-turtxy" data-bind="turty">500</dd>
      <dt>Direction</dt>
      <dd class="tsx-turtd" data-bind="turtd">0</dd>
      <dt>Thickness</dt>
      <dd class="tsx-turttc" data-bind="turtt">2</dd>
      <dt>Colour</dt>
      <dd class="tsx-turttc" style="background:#000" data-bind="turtc"></dd>
    </dl>
  </div>`

// grab subelements of interest
const nameInput = element.querySelector('[data-bind="name-input"]')
const languageSelect = element.querySelector('[data-bind="language-select"]')
const runHalt = element.querySelector('[data-bind="run-halt"]')
const playPause = element.querySelector('[data-bind="play-pause"]')
const turtx = element.querySelector('[data-bind="turtx"]')
const turty = element.querySelector('[data-bind="turty"]')
const turtd = element.querySelector('[data-bind="turtd"]')
const turtt = element.querySelector('[data-bind="turtt"]')
const turtc = element.querySelector('[data-bind="turtc"]')

// setup event listeners on interactive elements
nameInput.addEventListener('input', (e) => {
  send('set-name', nameInput.value)
})

languageSelect.addEventListener('change', (e) => {
  send('set-language', languageSelect.value)
})

runHalt.addEventListener('click', (e) => {
  send('machine-run-halt', { canvas, console, output })
  runHalt.blur()
})

playPause.addEventListener('click', (e) => {
  send('machine-play-pause')
  playPause.blur()
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
