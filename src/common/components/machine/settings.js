/*
The machine settings component.
*/
import { showTab } from '../dom'
import { send, on } from 'common/system/state'

// the exported elements
export const buttons = document.createElement('div')
export const showOptions = document.createElement('div')
export const drawCountMax = document.createElement('div')
export const codeCountMax = document.createElement('div')
export const smallSize = document.createElement('div')
export const stackSize = document.createElement('div')

// initialise the exported elements
buttons.classList.add('tse-buttons')
buttons.innerHTML = `
  <button data-bind="reset">Reset Defaults</button>`

showOptions.classList.add('tse-checkboxes')
showOptions.innerHTML = `
  <label><input type="checkbox" data-bind="show-canvas">Show canvas on run</label>
  <label><input type="checkbox" data-bind="show-output">Show output on write</label>
  <label><input type="checkbox" data-bind="show-memory">Show memory on dump</label>`

drawCountMax.classList.add('tse-option')
drawCountMax.innerHTML = `
  <label>Default number of simultaneous drawing commands:<input type="number" min="1" max="100" data-bind="draw-count-max"></label>
  <p>Performing more than one drawing command at a time greatly increases drawing speed. Set to 1 to see every drawing change individually (slower). The pause and update/noupdate commands override this default.</p>`

codeCountMax.classList.add('tse-option')
codeCountMax.innerHTML = `
  <label>Maximum number of commands before forced update:<input type="number" min="0" max="10000000" data-bind="code-count-max"></label>
  <p>This number sets how many commands to allow before forcing the canvas to update. A higher number generally results in faster program execution, but some programs can cause the system to hang if they execute a large number of commands without ever updating the canvas.</p>`

smallSize.classList.add('tse-option')
smallSize.innerHTML = `
  <label>Resolution at which to scale up the canvas:<input type="number" min="0" max="100" data-bind="small-size"></label>
  <p>When a program sets the canvas resolution to this value or less (in either dimension), the machine will artificially double the resolution, and make everything twice as big. This helps very low resolution images to display more clearly and accurately. Set to 0 to disable.</p>`

stackSize.classList.add('tse-option')
stackSize.innerHTML = `
  <label>Memory Stack size, after which Memory Heap starts:<input type="number" min="100" max="1000000" data-bind="stack-size"></label>
  <p>The Memory Stack stores the variables of the program and subroutines, with string variables represented as pointers to the Memory Heap. The Memory Heap lies directly above the Memory Stack, and stores the actual strings. The Memory Stack should be sufficiently large to avoid the storage of program variables overflowing into the Memory Heap.</p>`

// grab subelements of interest
const resetButton = buttons.querySelector('[data-bind="reset"]')
const showCanvasInput = showOptions.querySelector('[data-bind="show-canvas"]')
const showOutputInput = showOptions.querySelector('[data-bind="show-output"]')
const showMemoryInput = showOptions.querySelector('[data-bind="show-memory"]')
const drawCountMaxInput = drawCountMax.querySelector('[data-bind="draw-count-max"]')
const codeCountMaxInput = codeCountMax.querySelector('[data-bind="code-count-max"]')
const smallSizeInput = smallSize.querySelector('[data-bind="small-size"]')
const stackSizeInput = stackSize.querySelector('[data-bind="stack-size"]')

// add event listeners to interactive elements
resetButton.addEventListener('click', (e) => {
  send('reset-machine-options')
  e.currentTarget.blur()
})

showCanvasInput.addEventListener('change', (e) => {
  send('toggle-show-canvas')
})

showOutputInput.addEventListener('change', (e) => {
  send('toggle-show-output')
})

showMemoryInput.addEventListener('change', (e) => {
  send('toggle-show-memory')
})

drawCountMaxInput.addEventListener('change', (e) => {
  send('set-draw-count-max', drawCountMaxInput.value)
})

codeCountMaxInput.addEventListener('change', (e) => {
  send('set-code-count-max', codeCountMaxInput.value)
})

smallSizeInput.addEventListener('change', (e) => {
  send('set-small-size', smallSizeInput.value)
})

stackSizeInput.addEventListener('change', (e) => {
  send('set-stack-size', stackSizeInput.value)
})

// register to keep in sync with system state
on('show-settings', () => { showTab('Settings') })
on('show-canvas-changed', (value) => { showCanvasInput.checked = value })
on('show-output-changed', (value) => { showOutputInput.checked = value })
on('show-memory-changed', (value) => { showMemoryInput.checked = value })
on('draw-count-max-changed', (value) => { drawCountMaxInput.value = value })
on('code-count-max-changed', (value) => { codeCountMaxInput.value = value })
on('small-size-changed', (value) => { smallSizeInput.value = value })
on('stack-size-changed', (value) => { stackSizeInput.value = value })
