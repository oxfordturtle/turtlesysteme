/*
The program pcode component.
*/
import pcodes from 'common/constants/pcodes'
import { send, on } from 'common/system/state'

// the pcode elements
export const options = document.createElement('div')
export const list = document.createElement('ol')

// initialise the elements
options.classList.add('tsx-checkboxes')
options.innerHTML = `
  <label><input type="radio" name="pcodeOptions1" data-bind="assembler">Assembler Code</label>
  <label><input type="radio" name="pcodeOptions2" data-bind="decimal">Decimal</label>
  <label><input type="radio" name="pcodeOptions1" data-bind="machine">Machine Code</label>
  <label><input type="radio" name="pcodeOptions2" data-bind="hexadecimal">Hexadecimal</label>`

list.classList.add('tsx-pcode')

// grab sub-elements of interest
const assemblerInput = options.querySelector('[data-bind="assembler"]')
const machineInput = options.querySelector('[data-bind="machine"]')
const decimalInput = options.querySelector('[data-bind="decimal"]')
const hexadecimalInput = options.querySelector('[data-bind="hexadecimal"]')

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
  list.innerHTML = ''
  pcode.map((line) => {
    const li = document.createElement('li')
    const content = assembler
      ? assemble(line, 0, decimal)
      : line.reduce((sofar, current) => sofar.concat(cell(current, decimal)), [])
    while (content.length % 8 > 0) {
      content.push(document.createElement('div'))
    }
    content.forEach((div) => { li.appendChild(div) })
    return li
  }).forEach((x) => list.appendChild(x))
})

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
  const div = document.createElement('div')
  if (content === null) {
    div.innerHTML = ':('
  } else if (decimal === undefined) {
    div.innerHTML = content
  } else if (decimal) {
    div.innerHTML = content.toString(10)
  } else {
    div.innerHTML = content.toString(16).toUpperCase()
  }
  return div
}
