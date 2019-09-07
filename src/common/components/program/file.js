/*
The program file component.
*/
import * as dom from 'common/components/dom'
import * as examples from 'common/constants/examples'
import { send } from 'common/system/state'

// buttons
const newButton = dom.createElement('button', null, 'New Program')

const skeletonButton = dom.createElement('button', null, 'New Skeleton Program')

const openButton = dom.createElement('button', null, 'Open Program')

const closeButton = dom.createElement('button', null, 'Close Program')

const saveButton = dom.createElement('button', null, 'Save Program')

const saveTgxButton = dom.createElement('button', null, 'Save Export File')

// file elements
export const newFile = dom.createElement('div', 'tse-file-box', [
  dom.createElement('label', null, 'File'),
  dom.createElement('div', 'tse-buttons', [newButton, skeletonButton]),
  dom.createElement('div', 'tse-buttons', [openButton, closeButton]),
  dom.createElement('div', 'tse-buttons', [saveButton, saveTgxButton])
])

// create optgroup from examples group
const optgroup = group =>
  dom.createOptgroup(`${group.index.toString(10)}. ${group.title}`, group.examples.map(x =>
    dom.createOption(examples.names[x], x)
  ))

const helpExamples = dom.createElement('select', null, examples.menu.map(optgroup))

export const openHelp = dom.createElement('div', 'tse-file-box', [
  dom.createElement('label', null, 'Example Programs'),
  helpExamples
])

const fileInput = dom.createInput('file')

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

closeButton.addEventListener('click', () => {
  send('new-program')
})

saveButton.addEventListener('click', () => {
  send('save-program')
})

saveTgxButton.addEventListener('click', () => {
  send('save-tgx-program')
})

helpExamples.addEventListener('focus', () => {
  helpExamples.selectedIndex = -1
})

helpExamples.addEventListener('change', () => {
  send('set-example', helpExamples.value)
})

fileInput.addEventListener('change', () => {
  const file = fileInput.files[0]
  const fr = new window.FileReader()
  fr.onload = () => {
    send('set-file', { filename: file.name, content: fr.result })
    // reset the file input so that the change event definitely triggers next time
    fileInput.type = ''
    fileInput.type = 'file'
  }
  fr.readAsText(file)
})
