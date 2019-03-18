/*
The help component.
*/
import categories from 'common/constants/categories'
import commands from 'common/constants/commands'
import { on, send } from 'common/system/state'

// the div for commands help
const element = document.createElement('div')
export default element

// initialise the element
element.innerHTML = `
  <h3>Native Turtle Commands</h3>
  <p>The languages understood by the Turtle System come with several built in procedures and functions, including those that implement the Turtle Graphics drawing metaphor. A full list of commands is show in the table below. For convenience, they have been grouped into 11 categories, and divided into three difficulty levels. Only simple commands are shown by default; use the checkboxes below to show intermediate and advanced commands as well.</p>
  <div class="tsx-commands-options">
    <label>
      Select group
      <select data-bind="group">
        ${categories.map(x => `<option value="{x.index}">${x.index + 1}. ${x.title}</option>`).join('')}
      </select>
    </label>
    <label><input type="checkbox" data-bind="simple">Simple</label>
    <label><input type="checkbox" data-bind="intermediate">Intermediate</label>
    <label><input type="checkbox" data-bind="advanced">Advanced</label>
  </div>
  <table class="tsx-help-table">
    <thead>
      <tr><th>Command</th><th>Description</th></tr>
    </thead>
    <tbody data-bind="commands"></tbody>
  </table>`

// grab subelements of interest
const groupSelect = element.querySelector('[data-bind="group"]')
const simpleInput = element.querySelector('[data-bind="simple"]')
const intermediateInput = element.querySelector('[data-bind="intermediate"]')
const advancedInput = element.querySelector('[data-bind="advanced"]')
const commandsTable = element.querySelector('[data-bind="commands"]')

// setup event listeners on interactive elements
groupSelect.addEventListener('change', (e) => { send('set-group', parseInt(groupSelect.value)) })
simpleInput.addEventListener('change', (e) => { send('toggle-simple') })
intermediateInput.addEventListener('change', (e) => { send('toggle-intermediate') })
advancedInput.addEventListener('change', (e) => { send('toggle-advanced') })

// subscribe to keep in sync with system state
on('help-options-changed', ({ language, group, simple, intermediate, advanced }) => {
  let comm = commands.filter(x => x.category === group)
  if (!simple) comm = comm.filter(x => x.level !== 0)
  if (!intermediate) comm = comm.filter(x => x.level !== 1)
  if (!advanced) comm = comm.filter(x => x.level !== 2)
  groupSelect.value = group
  simpleInput.checked = simple
  intermediateInput.checked = intermediate
  advancedInput.checked = advanced
  commandsTable.innerHTML = ''
  comm.forEach(x => {
    if (x.names[language]) {
      commandsTable.innerHTML += `<tr><td>${x.names[language]}</td><td>${x.description}</td></tr>`
    }
  })
})
