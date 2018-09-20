/*
The pcode display component.
*/

// create the HTML elements first
const { element } = require('dom')
const assemblerInput = element('input', {
  type: 'radio',
  name: 'pcodeOptions1',
  on: [{ type: 'change', callback: () => state.send('toggle-assembler') }]
})
const machineInput = element('input', {
  type: 'radio',
  name: 'pcodeOptions1',
  on: [{ type: 'change', callback: () => state.send('toggle-assembler') }]
})
const decimalInput = element('input', {
  type: 'radio',
  name: 'pcodeOptions2',
  on: [{ type: 'change', callback: () => state.send('toggle-decimal') }]
})
const hexadecimalInput = element('input', {
  type: 'radio',
  name: 'pcodeOptions2',
  on: [{ type: 'change', callback: () => state.send('toggle-decimal') }]
})
const options = element('div', {
  classes: [ 'tsx-pcode-options' ],
  content: [
    element('div', { content: [
      element('label', { content: [assemblerInput, 'Assembler Code'] }),
      element('label', { content: [machineInput, 'Machine Code'] })
    ] }),
    element('div', { content: [
      element('label', { content: [decimalInput, 'Decimal'] }),
      element('label', { content: [hexadecimalInput, 'Hexadecimal'] })
    ] })
  ]
})
const table = element('ol', { classes: ['tsx-pcode-table'] })

// export the options and table HTML elements
module.exports = { options, table }

// dependencies
const { pcodes } = require('data')
const state = require('state')

// function to syncronize with the application state
const refresh = ({ pcode, assembler, decimal }) => {
  if (assembler) {
    assemblerInput.setAttribute('checked', 'checked')
  } else {
    machineInput.setAttribute('checked', 'checked')
  }
  if (decimal) {
    decimalInput.setAttribute('checked', 'checked')
  } else {
    hexadecimalInput.setAttribute('checked', 'checked')
  }
  table.innerHTML = ''
  pcode.map(row.bind(null, assembler, decimal)).forEach((x) => table.appendChild(x))
}

// table row from line of pcode
const row = (assembler, decimal, line) => {
  const content = assembler ? assemble(line, 0, decimal) : line.reduce(toCells.bind(null, decimal), [])
  while (content.length % 8 > 0) {
    content.push(element('div'))
  }
  return element('li', { content })
}

// cell of pcode
const assemble = (line, index, decimal) => {
  const hit = pcodes[line[index]]
  const pcode = hit ? [cell(hit.str)] : [cell(line[index], decimal)]
  let args = 0
  if (hit) {
    if (hit.args < 0) {
      let length = line[index + 1]
      args += 1
      while (args <= length) {
        args += 1
        pcode.push(cell(String.fromCharCode(line[index + args])))
      }
    } else {
      while (args < hit.args) {
        args += 1
        pcode.push(cell(line[index + args], decimal))
      }
    }
  }
  if (index + args < line.length - 1) {
    return pcode.concat(assemble(line, index + args + 1, decimal))
  }
  return pcode
}

const cell = (content, decimal) => {
  if (decimal === undefined) return element('div', { content })
  return decimal
    ? element('div', { content: content.toString(10) })
    : element('div', { content: content.toString(16).toUpperCase() })
}

const toCells = (decimal, sofar, current) =>
  sofar.concat(cell(current, decimal))

// register to keep it syncronized with the application state
state.on('pcode-changed', refresh)
