/*
Control bars for the machine half of the system.
*/
import canvas from './canvas'
import console from './console'
import output from './output'
import { send, on } from 'common/system/state'

// the control bar element
const element = document.createElement('div')
export default element

// initialise the element
element.classList.add('tsx-machine-controls')
element.innerHTML = `
  <button class="tsx-run-halt-button" data-bind="run-halt">RUN</button>
  <button class="tsx-play-pause-button" data-bind="play-pause">&#10074;&#10074;</button>
  <dl class="tsx-turtle-properties">
    <dt>X</dt>
    <dd class="tsx-turtxy" data-bind="turtx">500</dd>
    <dt>Y</dt>
    <dd class="tsx-turtxy" data-bind="turty">500</dd>
    <dt>D</dt>
    <dd class="tsx-turtd" data-bind="turtd">0</dd>
    <dt>T</dt>
    <dd class="tsx-turttc" data-bind="turtt">2</dd>
    <dt>C</dt>
    <dd class="tsx-turttc" style="background:#000" data-bind="turtc"></dd>
  </dl>`

// grab subelements of interest
const runHalt = element.querySelector('[data-bind="run-halt"]')
const playPause = element.querySelector('[data-bind="play-pause"]')
const turtx = element.querySelector('[data-bind="turtx"]')
const turty = element.querySelector('[data-bind="turty"]')
const turtd = element.querySelector('[data-bind="turtd"]')
const turtt = element.querySelector('[data-bind="turtt"]')
const turtc = element.querySelector('[data-bind="turtc"]')

// setup event listeners on interactive elements
runHalt.addEventListener('click', (e) => {
  send('machine-run-halt', { canvas, console, output })
  runHalt.blur()
})

playPause.addEventListener('click', (e) => {
  send('machine-play-pause')
  playPause.blur()
})

// subscribe to keep in sync with system state
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
