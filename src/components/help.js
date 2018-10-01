/*
the help component
*/
import { element, tabs } from '../tools.js'
import * as basics from '../help/basics.js'
import * as structures from '../help/structures.js'
import * as operators from '../help/operators.js'
import * as input from '../help/input.js'
import { on } from '../system/state.js'

// create the HTML elements
const commandsDiv = element('div')
const basicsDiv = element('div')
const structuresDiv = element('div')
const operatorsDiv = element('div')
const inputDiv = element('div')
const constantsDiv = element('div')

// the language help tabs
export default tabs('tsx-help-tabs', [
  { label: 'Commands', active: true, content: [commandsDiv] },
  { label: 'Basics', active: false, content: [basicsDiv] },
  { label: 'Structures', active: false, content: [structuresDiv] },
  { label: 'Operators', active: false, content: [operatorsDiv] },
  { label: 'User Input', active: false, content: [inputDiv] },
  { label: 'Constants', active: false, content: [constantsDiv] }
])

// keep in sync with system state
on('language-changed', (language) => {
  basicsDiv.innerHTML = ''
  structuresDiv.innerHTML = ''
  operatorsDiv.innerHTML = ''
  inputDiv.innerHTML = ''
  basics[language].forEach(x => basicsDiv.appendChild(x))
  structures[language].forEach(x => structuresDiv.appendChild(x))
  operators[language].forEach(x => operatorsDiv.appendChild(x))
  input[language].forEach(x => inputDiv.appendChild(x))
})
