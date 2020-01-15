/*
The program file component.
*/
import * as dom from 'common/components/dom'
import * as examples from 'common/constants/examples'
import { send } from 'common/system/state'

// current file select
const currentFileSelect = dom.createSelect([], false)

// buttons
const saveLocalButton = dom.createElement('button', null, 'Save on My Computer')
const saveRemoteButton = dom.createElement('button', null, 'Save on turtle.ox.ac.uk')
const newBlankButton = dom.createElement('button', null, 'New Blank Program')
const newSkeletonButton = dom.createElement('button', null, 'New Skeleton Program')
const openLocalButton = dom.createElement('button', null, 'Open from My Computer')
const openRemoteButton = dom.createElement('button', null, 'Open from turtle.ox.ac.uk')

// example menu things
const createGroupOption = (group, index) => dom.createOption(`Examples ${group.index} - ${group.title}`, index)
const exampleGroupMenu = dom.createElement('select', null, examples.menu.map(createGroupOption))
const createExampleOption = (example, index) => dom.createOption(`${index + 1}. ${examples.names[example]}`, example)
const createExampleMenu = group => dom.createSelect(group.examples.map(createExampleOption), true)
const exampleMenu = dom.createSelect(examples.menu[0].examples.map(createExampleOption), true)

// invisible file input (for opening a local file)
const fileInput = dom.createInput('file')

// file display elements
export const currentFile = dom.createElement('div', 'tse-file-box', [
  dom.createElement('label', null, 'Current File'),
  currentFileSelect,
  dom.createElement('div', 'tse-buttons', [saveLocalButton, saveRemoteButton])
])

export const newFile = dom.createElement('div', 'tse-file-box', [
  dom.createElement('label', null, 'New File'),
  dom.createElement('div', 'tse-buttons', [newBlankButton, newSkeletonButton])
])

export const openFile = dom.createElement('div', 'tse-file-box', [
  dom.createElement('label', null, 'Open File'),
  dom.createElement('div', 'tse-buttons', [openLocalButton, openRemoteButton])
])

export const openExample = dom.createElement('div', 'tse-file-box', [
  dom.createElement('label', null, 'Open Example'),
  exampleGroupMenu,
  exampleMenu
])

// setup event listeners on interactive elements
currentFileSelect.addEventListener('change', () => {
  // TODO
})

saveLocalButton.addEventListener('click', () => {
  send('save-program')
})

saveRemoteButton.addEventListener('click', () => {
  // TODO
})

newBlankButton.addEventListener('click', () => {
  send('new-program')
})

newSkeletonButton.addEventListener('click', () => {
  send('new-skeleton-program')
})

openLocalButton.addEventListener('click', () => {
  fileInput.click()
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

openRemoteButton.addEventListener('click', () => {
  // TODO
})

exampleGroupMenu.addEventListener('change', () => {
  dom.setContent(exampleMenu, examples.menu[exampleGroupMenu.value].examples.map(createExampleOption))
})

exampleMenu.addEventListener('change', () => {
  send('set-example', exampleMenu.value)
})
