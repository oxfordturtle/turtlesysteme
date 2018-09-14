/**
 * the pcode display component
 */

// global imports
const { element } = require('dom')
const state = require('state')

// the options box
const options = element('div', {
  classes: [ 'tsx-pcode-options' ],
  content: 'options'
})

// the pcode table
const table = element('div', { classes: ['tsx-pcode-table'] })

// the main pcode element (includes the options box and the pcode table)
const pcode = element('div', { content: [ options, table ] })

// table cell from pcode
const td = code =>
  element('span', { content: code.toString(10) })

// table row from line of pcode
const row = (line, index) => {
  const number = index + 1
  return element('div', {
    classes: ['tsx-row'],
    content: [
      element('div', { classes: ['tsx-head'], content: number.toString(10) }),
      element('div', { classes: ['tsx-body'], content: line.map(td) })
    ]
  })
}

// function to update the pcode table
const refresh = (pcode) => {
  table.innerHTML = ''
  pcode.map(row).forEach((x) => table.appendChild(x))
}

// update with the current pcode, and subscribe to keep it in sync
refresh(state.getPCode())
state.on('pcode-changed', refresh)

// exports
module.exports = pcode
