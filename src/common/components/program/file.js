/*
The program file component.
*/
import * as examples from 'common/constants/examples'
import { on, send } from 'common/system/state'

// the file elements
export const newFile = document.createElement('div')
export const openHelp = document.createElement('div')
export const openCSAC = document.createElement('div')
const fileInput = document.createElement('input')

// create optgroup from examples group
const optgroup = (group) => `
  <optgroup label="${group.index.toString(10)}. ${group.title}">
    ${group.examples.map(x => `<option value="${x}">${examples.names[x]}</option>`).join('')}
  </optgroup>`

newFile.classList.add('tsx-file-box')
newFile.innerHTML = `
  <label>File</label>
  <div class="tsx-buttons">
    <button data-bind="new-program">New Program</button>
    <button data-bind="new-skeleton-program">New Skeleton Program</button>
  </div>
  <div class="tsx-buttons">
    <button data-bind="open-program">Open Program</button>
    <button data-bind="save-program">Save Program</button>
  </div>`

openHelp.classList.add('tsx-file-box')
openHelp.innerHTML = `
  <label>Example Programs</label>
  <select data-bind="help-examples">
    ${examples.help.map(optgroup)}
  </select>`

openCSAC.classList.add('tsx-file-box')
openCSAC.innerHTML = `
  <label>CSAC Book Programs</label>
  <select data-bind="csac-examples">
    ${examples.csac.map(optgroup)}
  </select>`

fileInput.type = 'file'

// grab sub-elements of interest
const newButton = newFile.querySelector('[data-bind="new-program"]')
const skeletonButton = newFile.querySelector('[data-bind="new-skeleton-program"]')
const openButton = newFile.querySelector('[data-bind="open-program"]')
const saveButton = newFile.querySelector('[data-bind="save-program"]')
const helpExamples = openHelp.querySelector('[data-bind="help-examples"]')
const csacExamples = openCSAC.querySelector('[data-bind="csac-examples"]')

// setup event listeners on interactive elements
newButton.addEventListener('click', () => {
  send('new-program')
})

skeletonButton.addEventListener('click', () => {
  send('new-skeleton-program')
})

openButton.addEventListener('click', () => {
  fileInput.click()
})

saveButton.addEventListener('click', () => {
  send('save-program')
})

helpExamples.addEventListener('focus', () => {
  helpExamples.selectedIndex = -1
})
helpExamples.addEventListener('change', () => {
  send('set-example', helpExamples.value)
})

csacExamples.addEventListener('focus', () => {
  csacExamples.selectedIndex = -1
})
csacExamples.addEventListener('change', () => {
  send('set-example', csacExamples.value)
})

fileInput.addEventListener('click', () => {
  const file = fileInput.files[0]
  const fr = new window.FileReader()
  fr.onload = () => { send('set-file', { filename: file.name, content: fr.result }) }
  fr.readAsText(file)
})
