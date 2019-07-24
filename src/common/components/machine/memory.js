/*
The machine memory component.
*/
import { send, on } from 'common/system/state'

// the memory elements
export const buttons = document.createElement('div')
export const stack = document.createElement('div')
export const heap = document.createElement('div')

// initialise the elements
buttons.classList.add('tse-buttons')
buttons.innerHTML = `
  <button data-bind="dump">Show Current State</button>`

stack.classList.add('tse-memory-container')
stack.innerHTML = `
  <table>
    <thead>
      <tr>
        <td>Stack</td>
        <th>+0</th>
        <th>+1</th>
        <th>+2</th>
        <th>+3</th>
        <th>+4</th>
        <th>+5</th>
        <th>+6</th>
        <th>+7</th>
      </tr>
    </thead>
    <tbody data-bind="stack"></tbody>
  </table>`

heap.classList.add('tse-memory-container')
heap.innerHTML = `
  <table>
    <thead>
      <tr>
        <td>Heap</td>
        <th>+0</th>
        <th>+1</th>
        <th>+2</th>
        <th>+3</th>
        <th>+4</th>
        <th>+5</th>
        <th>+6</th>
        <th>+7</th>
      </tr>
    </thead>
    <tbody data-bind="heap"></tbody>
  </table>`

// grab subelements of interest
const dumpButton = buttons.querySelector('[data-bind="dump"]')
const stackTable = stack.querySelector('[data-bind="stack"]')
const heapTable = heap.querySelector('[data-bind="heap"]')

// add event listeners to interactive elements
dumpButton.addEventListener('click', (e) => {
  send('dump-memory')
  dumpButton.blur()
})

// register to keep in sync with system state
on('dump-memory', (memory) => {
  const stackSplit = []
  const heapSplit = []
  while (memory.stack.length > 0) {
    stackSplit[stackSplit.length] = memory.stack.splice(0, 8)
  }
  while (memory.heap.length > 0) {
    heapSplit[heapSplit.length] = memory.heap.splice(0, 8)
  }
  stackTable.innerHTML = ''
  heapTable.innerHTML = ''
  stackSplit.map(tr.bind(null, 0)).forEach((bytes) => {
    stackTable.appendChild(bytes)
  })
  heapSplit.map(tr.bind(null, memory.heapBase)).forEach((bytes) => {
    heapTable.appendChild(bytes)
  })
})

// function to create a tr row of bytes
const tr = (offset, bytes, index) => {
  const tr = document.createElement('tr')
  tr.innerHTML = `<th>${(offset + index * 8).toString(10)}</th>`
  tr.innerHTML += bytes.map(byte => `<td>${byte.toString(10)}</td>`).join('')
  return tr
}
