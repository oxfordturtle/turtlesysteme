/*
The machine component
*/
import { element, show, tabs } from '../tools.js'
import { send, on } from '../system/state.js'

// the settings tab (exported for inclusion in separate settings page in electron version)
const reset = element('button', {
  content: 'Reset Defaults',
  on: [{
    type: 'click',
    callback: (e) => {
      send('reset-machine-options')
      e.currentTarget.blur()
    }
  }]
})
const showCanvas = element('input', {
  type: 'checkbox',
  on: [{ type: 'change', callback: (e) => send('toggle-show-canvas') }]
})
const showOutput = element('input', {
  type: 'checkbox',
  on: [{ type: 'change', callback: (e) => send('toggle-show-output') }]
})
const showMemory = element('input', {
  type: 'checkbox',
  on: [{ type: 'change', callback: (e) => send('toggle-show-memory') }]
})
const drawCount = element('input', { type: 'number', min: '1', max: '100' })
const codeCount = element('input', { type: 'number', min: '0', max: '10000000' })
const smallSize = element('input', { type: 'number', min: '0', max: '100' })
const stackSize = element('input', { type: 'number', min: '100', max: '1000000' })
export const settings = [
  element('div', { classes: ['tsx-buttons'], content: [reset] }),
  element('div', {
    classes: ['tsx-checkboxes'],
    content: [
      element('label', { content: [showCanvas, 'Show canvas on run'] }),
      element('label', { content: [showOutput, 'Show output on write'] }),
      element('label', { content: [showMemory, 'Show memory on dump'] })
    ]
  }),
  element('div', {
    classes: ['tsx-option'],
    content: [
      element('label', { content: ['Default number of simultaneous drawing commands:', drawCount] }),
      element('p', { content: 'Performing more than one drawing command at a time greatly increases drawing speed. Set to 1 to see every drawing change individually (slower). Pause and update/noupdate override this default.' })
    ]
  }),
  element('div', {
    classes: ['tsx-option'],
    content: [
      element('label', { content: ['Maximum number of commands before forced update:', codeCount] }),
      element('p', { content: 'This number sets how many commands to allow before forcing the canvas to update. A higher number generally results in faster program execution, but some programs can cause the browser (or browser tab) to hang if they execute a large number of commands without ever updating the canvas.' })
    ]
  }),
  element('div', {
    classes: ['tsx-option'],
    content: [
      element('label', { content: ['Resolution at which to scale up the canvas:', smallSize] }),
      element('p', { content: 'When the program sets the resolution to this value or less (in either dimension), the machine will artificially double the resolution, and make everything twice as big. This helps very low resolution programs to display more clearly and accurately. Set to 0 to disable.' })
    ]
  }),
  element('div', {
    classes: ['tsx-option'],
    content: [
      element('label', { content: ['Memory Stack size, after which Memory Heap starts:', stackSize] }),
      element('p', { content: 'The Memory Stack stores the variables of the program and subroutines, with string variables represented as pointers to the Memory Heap. The Memory Heap lies directly above the Memory Stack, and stores the actual strings. The Memory Stack should be sufficiently large to avoid the storage of program variables overflowing into the Memory Heap.' })
    ]
  })
]

// the canvas and console tab
const canvas = element('canvas', { classes: ['tsx-canvas'], width: 500, height: 500 })
const console = element('pre', { classes: ['tsx-console'] })

// the output tab
const output = element('pre', { classes: ['tsx-output'] })

// the memory tab
const dump = (memory) => {}
const memoryButton = element('button', { on: [{ type: 'click', callback: dump }] })
const stack = element('ol', { classes: ['tsx-memory-table'] })
const heap = element('ol', { classes: ['tsx-memory-table'] })
const memory = element('div', {
  classes: ['tsx-memory'],
  content: [
    element('div', { classes: ['tsx-buttons'], content: [memoryButton] }),
    stack,
    heap
  ]
})

// export the tabs (with or without the settings tab
export const component = (includeSettings) =>
  includeSettings
    ? tabs('tsx-system-tabs', [
      { label: 'Settings', active: false, content: settings },
      { label: 'Canvas', active: true, content: [canvas, console] },
      { label: 'Output', active: false, content: [output] },
      { label: 'Memory', active: false, content: [memory] }
    ])
    : tabs('tsx-system-tabs', [
      { label: 'Canvas', active: true, content: [canvas, console] },
      { label: 'Output', active: false, content: [output] },
      { label: 'Memory', active: false, content: [memory] }
    ])

// register to keep in sync with system state
on('show-settings', show.bind(null, 'Settings'))
on('show-canvas', show.bind(null, 'Canvas'))
on('show-output', show.bind(null, 'Output'))
on('show-memory', show.bind(null, 'Memory'))
on('dump-memory', dump)
on('show-canvas-changed', (value) => { showCanvas.checked = value })
on('show-output-changed', (value) => { showOutput.checked = value })
on('show-memory-changed', (value) => { showMemory.checked = value })
on('draw-count-max-changed', (value) => { drawCount.value = value })
on('code-count-max-changed', (value) => { codeCount.value = value })
on('small-size-changed', (value) => { smallSize.value = value })
on('stack-size-changed', (value) => { stackSize.value = value })
