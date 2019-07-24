/*
Setup the system page (browser).
*/
import { create, show } from 'common/components/tabs'
import code from 'common/components/program/code'
import * as pcode from 'common/components/program/pcode'
import * as file from 'common/components/program/file'
import usage from 'common/components/program/usage'
import lexemes from 'common/components/program/lexemes'
import * as settings from 'common/components/machine/settings'
import canvas from 'common/components/machine/canvas'
import console from 'common/components/machine/console'
import controls from 'common/components/controls'
import output from 'common/components/machine/output'
import * as memory from 'common/components/machine/memory'
import { on } from 'common/system/state'

// setup the system page
export default (tse) => {
  // add the system class
  tse.classList.add('tse-system')

  // add the popup overlay to the document body
  document.body.appendChild(overlay)

  // append the component divs (defined below)
  tse.appendChild(controls)
  tse.appendChild(tabs)

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
    window.console.log(error) // for debugging
    if (error.lexeme) window.console.log(error.lexeme) // for debugging
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
    overlay.classList.add('tse-open')
  })

  // register to show warnings on the modal dialog
  on('warning', (warning) => {
    overlay.querySelector('h2').innerHTML = warning.title
    overlay.querySelector('p').innerHTML = warning.message
    overlay.classList.add('tse-open')
  })
}

// modal and overlay
const overlay = document.createElement('div')
overlay.classList.add('tse')
overlay.classList.add('tse-overlay')
overlay.innerHTML = `
  <div class="tse-modal">
    <div class="tse-modal-head">
      <h2></h2>
    </div>
    <div class="tse-modal-body">
      <p></p>
      <div class="tse-modal-buttons">
        <button>OK</button>
      </div>
    </div>
  </div>`
overlay.querySelector('button').addEventListener('click', () => {
  overlay.classList.remove('tse-open')
})

// program tabs
const programTabs = create([
  { label: 'File', active: false, content: [file.newFile, file.openHelp, file.openCSAC] },
  { label: 'Code', active: true, content: [code] },
  { label: 'Usage', active: false, content: [usage] },
  { label: 'Lexemes', active: false, content: [lexemes] },
  { label: 'PCode', active: false, content: [pcode.options, pcode.list] }
])

// settings div
const settingsDiv = document.createElement('div')
settingsDiv.classList.add('tse-settings')
settingsDiv.appendChild(settings.buttons)
settingsDiv.appendChild(settings.showOptions)
settingsDiv.appendChild(settings.drawCountMax)
settingsDiv.appendChild(settings.codeCountMax)
settingsDiv.appendChild(settings.smallSize)
settingsDiv.appendChild(settings.stackSize)

// machine tabs
const machineTabs = create([
  { label: 'Settings', active: false, content: [settingsDiv] },
  { label: 'Canvas', active: true, content: [canvas, console] },
  { label: 'Output', active: false, content: [output] },
  { label: 'Memory', active: false, content: [memory.buttons, memory.stack, memory.heap] }
])

// both tabs
const tabs = document.createElement('div')
tabs.classList.add('tse-body')
tabs.appendChild(programTabs)
tabs.appendChild(machineTabs)
