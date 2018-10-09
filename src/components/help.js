/*
the help component
*/
import { element, tabs } from '../tools.js'
import { colours, cursors, fonts } from '../data/constants.js'
import { categories, commands } from '../data/commands.js'
import * as basics from '../help/basics.js'
import * as structures from '../help/structures.js'
import * as operators from '../help/operators.js'
import * as input from '../help/input.js'
import { on, send } from '../system/state.js'

// create the HTML elements
const groupSelect = element('select', {
  content: categories.map(x => element('option', { content: `${x.index + 1}. ${x.title}`, value: x.index })),
  on: [{ type: 'change', callback: (e) => send('set-group', parseInt(e.currentTarget.value)) }]
})
const simpleInput = element('input', {
  type: 'checkbox',
  on: [{ type: 'change', callback: (e) => send('toggle-simple') }]
})
const intermediateInput = element('input', {
  type: 'checkbox',
  on: [{ type: 'change', callback: (e) => send('toggle-intermediate') }]
})
const advancedInput = element('input', {
  type: 'checkbox',
  on: [{ type: 'change', callback: (e) => send('toggle-advanced') }]
})
const commandsTable = element('tbody')
const commandsDiv = element('div', { content: [
  element('h3', { content: 'Native Turtle Commands' }),
  element('p', { content: 'The languages understood by the Turtle System come with several built in procedures and functions, including those that implement the Turtle Graphics drawing metaphor. A full list of commands is show in the table below. For convenience, they have been grouped into 11 categories, and divided into three difficulty levels. Only simple commands are shown by default; use the checkboxes below to show intermediate and advanced commands as well.' }),
  element('div', {
    classes: ['tsx-commands-options'],
    content: [
      element('label', { content: ['Select group', groupSelect] }),
      element('label', { content: [simpleInput, 'Simple'] }),
      element('label', { content: [intermediateInput, 'Intermediate'] }),
      element('label', { content: [advancedInput, 'Advanced'] })
    ]
  }),
  element('table', {
    classes: ['tsx-help-table'],
    content: [
      element('thead', { content: [
        element('tr', { content: [
          element('th', { content: 'Command' }),
          element('th', { content: 'Description' })
        ] })
      ] }),
      commandsTable
    ]
  })
] })
const basicsDiv = element('div')
const structuresDiv = element('div')
const operatorsDiv = element('div')
const inputDiv = element('div')
const coloursTable = element('tbody')
const cursorsRow = (sofar, current) =>
  `${sofar}<td>${current.index}</td><td style="cursor:${current.css}">${current.name}</td>`
const constantsDiv = element('div', { content: [
  element('h3', { content: 'Colours' }),
  element('p', { content: 'The Turtle System has 50 predefined colour constants, shown in the table below. Every command that takes a colour argument (e.g. the <code>colour</code> command, which sets the Turtle\'s current drawing colour) can be given an RGB value, or one of the predefined colour names below. The compiler will translate this name into the corresponding RGB value. Alternatively, you can also use the corresponding number between 1 and 50, which the Turtle Machine will translate into the RGB value when your program runs.' }),
  element('table', {
    classes: ['tsx-help-table'],
    content: [
      element('thead', { content: [
        element('tr', { content: [
          element('th', { content: 'No.' }),
          element('th', { content: 'Name<br>Value' }),
          element('th', { content: 'No.' }),
          element('th', { content: 'Name<br>Value' }),
          element('th', { content: 'No.' }),
          element('th', { content: 'Name<br>Value' }),
          element('th', { content: 'No.' }),
          element('th', { content: 'Name<br>Value' }),
          element('th', { content: 'No.' }),
          element('th', { content: 'Name<br>Value' })
        ] })
      ] }),
      coloursTable
    ]
  }),
  element('h3', { content: 'Fonts' }),
  element('p', { content: 'The Turtle System has 16 fonts for drawing text on the canvas, shown in the table below. The <code>print</code> command takes a font parameter, which must be an integer between 0 and 255. The integers in the range 0-15 correspond to plain versions of the 16 fonts. To render the text in italics, add 16 to this base; to render it in bold, add 32. This additions are cumulative; thus to render the text in italic and bold, add 16+32.' }),
  element('table', {
    classes: ['tsx-help-table'],
    content: [
      element('thead', { content: [
        element('tr', { content: [
          element('th', { content: 'Font Family Name' }),
          element('th', { content: 'Plain' }),
          element('th', { content: 'Italic' }),
          element('th', { content: 'Bold' }),
          element('th', { content: 'Italic+Bold' })
        ] })
      ] }),
      element('tbody', { content: fonts.map(font =>
        element('tr', { content: [
          element('td', { content: font.name, style: `font-family:${font.css}` }),
          element('td', { content: font.index.toString(10) }),
          element('td', { content: (font.index + 16).toString(10) }),
          element('td', { content: (font.index + 32).toString(10) }),
          element('td', { content: (font.index + 48).toString(10) })
        ] })
      ) })
    ]
  }),
  element('h3', { content: 'Cursors' }),
  element('p', { content: 'The native <code>cursor</code> command sets which cursor to display when the mouse is over the canvas. Setting it to 0 makes the mouse invisible. Values in the range 1-15 set it to the cursor shown in the table below (move your mouse over each box to preview the cursor). Any other value will reset to the default cursor. Note that the actual cursor displayed depends on your operating system, and may vary from computer to computer.' }),
  element('table', { content: [
    element('thead', { content: [
      element('tr', { content: [
        element('th', { content: 'No.' }),
        element('th', { content: 'Name' }),
        element('th', { content: 'No.' }),
        element('th', { content: 'Name' }),
        element('th', { content: 'No.' }),
        element('th', { content: 'Name' }),
        element('th', { content: 'No.' }),
        element('th', { content: 'Name' })
      ] })
    ] }),
    element('tbody', { content: [
      element('tr', { content: cursors.slice(0, 4).reduce(cursorsRow, '') }),
      element('tr', { content: cursors.slice(4, 8).reduce(cursorsRow, '') }),
      element('tr', { content: cursors.slice(8, 12).reduce(cursorsRow, '') }),
      element('tr', { content: cursors.slice(12, 16).reduce(cursorsRow, '') })
    ] })
  ] })
] })

// the language help tabs
export default tabs('tsx-system-tabs', [
  { label: 'Commands', active: true, content: [commandsDiv] },
  { label: 'Basics', active: false, content: [basicsDiv] },
  { label: 'Structures', active: false, content: [structuresDiv] },
  { label: 'Operators', active: false, content: [operatorsDiv] },
  { label: 'User Input', active: false, content: [inputDiv] },
  { label: 'Constants', active: false, content: [constantsDiv] }
])

// row of five colours
const coloursRow = (language, sofar, current) => {
  const color = current.dark ? '#fff' : '#000'
  return `${sofar}<th>${current.index}</th><td style="background:${current.css};color:${color}">${current.names[language]}<br>${current.hex[language]}</td>`
}

// refresh the commands table
const refreshCommands = ({ language, group, simple, intermediate, advanced }) => {
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
}

// keep in sync with system state
on('language-changed', (language) => {
  basicsDiv.innerHTML = ''
  structuresDiv.innerHTML = ''
  operatorsDiv.innerHTML = ''
  inputDiv.innerHTML = ''
  coloursTable.innerHTML = ''
  basics[language].forEach(x => basicsDiv.appendChild(x))
  structures[language].forEach(x => structuresDiv.appendChild(x))
  operators[language].forEach(x => operatorsDiv.appendChild(x))
  input[language].forEach(x => inputDiv.appendChild(x))
  for (let i = 0; i < 10; i += 1) {
    coloursTable.innerHTML += `<tr>${colours.slice(i * 5, i * 5 + 5).reduce(coloursRow.bind(null, language), '')}</tr>`
  }
})

on('help-options-changed', refreshCommands)
