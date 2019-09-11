/*
The program pcode component.
*/
import * as dom from 'common/components/dom'
import pcodes from 'common/constants/pcodes'
import { send, on } from 'common/system/state'

// radio options
const assemblerInput = dom.createInput('radio', 'pcodeOptions1')
const decimalInput = dom.createInput('radio', 'pcodeOptions2')
const machineInput = dom.createInput('radio', 'pcodeOptions1')
const hexadecimalInput = dom.createInput('radio', 'pcodeOptions2')

// the checkbox div (exported)
export const options = dom.createElement('div', 'tse-checkboxes', [
  dom.createElement('label', null, [assemblerInput, dom.createTextNode('Assembler Code')]),
  dom.createElement('label', null, [decimalInput, dom.createTextNode('Decimal')]),
  dom.createElement('label', null, [machineInput, dom.createTextNode('Machine Code')]),
  dom.createElement('label', null, [hexadecimalInput, dom.createTextNode('Hexadecimal')])
])

// the pcode display (exported)
export const list = dom.createElement('ol', 'tse-pcode')

// setup event listeners on interactive elements
assemblerInput.addEventListener('change', () => {
  send('toggle-assembler')
})

machineInput.addEventListener('change', () => {
  send('toggle-assembler')
})

decimalInput.addEventListener('change', () => {
  send('toggle-decimal')
})

hexadecimalInput.addEventListener('change', () => {
  send('toggle-decimal')
})

// register to keep in sync with the application state
on('pcode-changed', ({ pcode, assembler, decimal }) => {
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
  dom.setContent(list, pcode.map(pcodeListItem.bind(null, assembler, decimal)))
})

const pcodeListItem = (assembler, decimal, line) => {
  const content = assembler
    ? assemble(line, 0, decimal)
    : line.reduce((sofar, current) => sofar.concat(cell(current, decimal)), [])
  while (content.length % 8 > 0) {
    content.push(dom.createElement('div'))
  }
  return dom.createElement('li', null, content)
}

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
  if (content === null) {
    return dom.createElement('div', null, ':(')
  } else if (decimal === undefined) {
    return dom.createElement('div', null, content)
  } else if (decimal) {
    return dom.createElement('div', null, content.toString(10))
  } else {
    return dom.createElement('div', null, content.toString(16).toUpperCase())
  }
}
