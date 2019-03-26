/*
Setup the system page (browser).
*/
import { create, show } from 'common/components/tabs'
import code from 'common/components/program/code'
import * as pcode from 'common/components/program/pcode'
import * as file from 'common/components/program/file'
import usage from 'common/components/program/usage'
import * as settings from 'common/components/machine/settings'
import canvas from 'common/components/machine/canvas'
import console from 'common/components/machine/console'
import controls from 'common/components/machine/controls'
import output from 'common/components/machine/output'
import * as memory from 'common/components/machine/memory'
import { on } from 'common/system/state'

// setup the system page
export default (tsx) => {
  // add the popup overlay to the document body
  document.body.appendChild(overlay)

  // append the component divs (defined below)
  tsx.appendChild(programControls)
  tsx.appendChild(machineControls)
  tsx.appendChild(programTabs)
  tsx.appendChild(machineTabs)

  // register to switch tabs when called for
  on('file-changed', () => { show('Code') })
  on('show-settings', () => { show('Settings') })
  on('show-canvas', () => { show('Canvas') })
  on('show-output', () => { show('Output') })
  on('show-memory', () => { show('Memory') })

  // register to show errors on the modal dialog
  on('error', (error) => {
    const title = overlay.querySelector('h2')
    const message = overlay.querySelector('p')
    console.log(error) // for debugging
    if (error.lexeme) console.log(error.lexeme) // for debugging
    if (error.type) {
      // custom error
      title.innerHTML = `${error.type} Error`
      message.innerHTML = error.message
      if (error.lexeme) {
        title.innerHTML += `: "${error.lexeme.content}", line ${error.lexeme.line}`
      }
    } else {
      // native error
      title.innerHTML = 'System Error'
      message.innerHTML = 'An unexpected error has occured, suggesting there is a bug in the system. Please contact us with details of what you were doing when this message appeared, and we will do our best to locate and fix the bug.'
    }
    overlay.classList.add('tsx-open')
  })
}

// modal and overlay
const overlay = document.createElement('div')
overlay.classList.add('tsx-overlay')
overlay.innerHTML = `
  <div class="tsx-modal">
    <div class="tsx-modal-head">
      <h2></h2>
    </div>
    <div class="tsx-modal-body">
      <p></p>
      <div class="tsx-modal-buttons">
        <button>OK</button>
      </div>
    </div>
  </div>`
overlay.querySelector('button').addEventListener('click', () => {
  overlay.classList.remove('tsx-open')
})

// program controls
const programControls = document.createElement('div')
programControls.classList.add('tsx-controls')
programControls.appendChild(file.nameInput)
programControls.appendChild(file.languageSelect)

// program tabs
const programTabs = create([
  { label: 'File', active: false, content: [file.newFile, file.openHelp, file.openCSAC] },
  { label: 'Code', active: true, content: [code] },
  { label: 'Usage', active: false, content: [usage] },
  { label: 'PCode', active: false, content: [pcode.options, pcode.list] }
])

// machine tabs
const machineTabs = create([
  { label: 'Settings', active: false, content: [settings.buttons, settings.showOptions, settings.drawCountMax, settings.codeCountMax, settings.smallSize, settings.stackSize] },
  { label: 'Canvas', active: true, content: [canvas, console] },
  { label: 'Output', active: false, content: [output] },
  { label: 'Memory', active: false, content: [memory.buttons, memory.stack, memory.heap] }
])

// system tabs (program and machine)
const machineControls = controls
