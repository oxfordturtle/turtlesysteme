/*
Setup the system page (browser).
*/
import * as dom from 'common/components/dom'
import code from 'common/components/program/code'
import * as pcode from 'common/components/program/pcode'
import * as file from 'common/components/program/file'
import usage from 'common/components/program/usage'
import lexemes from 'common/components/program/lexemes'
import * as settings from 'common/components/machine/settings'
import canvas from 'common/components/machine/canvas'
import console from 'common/components/machine/console'
import * as controls from 'common/components/controls'
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
  dom.setContent(tse, [
    controls.program,
    controls.machine,
    dom.createTabs([
      { label: 'File', active: false, content: [file.newFile, file.openHelp] },
      { label: 'Code', active: true, content: [code] },
      { label: 'Usage', active: false, content: [usage] },
      { label: 'Lexemes', active: false, content: [lexemes] },
      { label: 'PCode', active: false, content: [pcode.options, pcode.list] }
    ]),
    dom.createTabs([
      { label: 'Settings',
        active: false,
        content: [
          dom.createElement('div', 'tse-settings', [
            settings.buttons,
            settings.showOptions,
            settings.drawCountMax,
            settings.codeCountMax,
            settings.smallSize,
            settings.stackSize
          ])
        ] },
      { label: 'Canvas', active: true, content: [canvas, console] },
      { label: 'Output', active: false, content: [output] },
      { label: 'Memory', active: false, content: [memory.buttons, memory.stack, memory.heap] }
    ])
  ])

  // register to switch tabs when called for
  on('file-changed', () => { dom.showTab('Code') })
  on('show-settings', () => { dom.showTab('Settings') })
  on('show-canvas', () => { dom.showTab('Canvas') })
  on('show-output', () => { dom.showTab('Output') })
  on('show-memory', () => { dom.showTab('Memory') })

  // register to show errors on the modal dialog
  on('error', (error) => {
    window.console.log(error) // for debugging
    if (error.lexeme) window.console.log(error.lexeme) // for debugging
    if (error.type) {
      // custom error
      modalTitle.innerHTML = `${error.type} Error`
      modalMessage.innerHTML = error.message
      if (error.lexeme) {
        modalTitle.innerHTML += `: "${error.lexeme.content}", line ${error.lexeme.line}`
      }
    } else {
      // native error
      modalTitle.innerHTML = 'System Error'
      modalMessage.innerHTML = 'An unexpected error has occured, suggesting there is a bug in the system. Please contact us with details of what you were doing when this message appeared, and we will do our best to locate and fix the bug.'
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
const modalTitle = dom.createElement('h2')

const modalMessage = dom.createElement('p')

const modalButton = dom.createElement('button', null, 'OK')

const overlay = dom.createElement('div', 'tse-overlay', [
  dom.createElement('div', 'tse-modal', [
    dom.createElement('div', 'tse-modal-head', [modalTitle]),
    dom.createElement('div', 'tse-modal-body', [
      modalMessage,
      dom.createElement('div', 'tse-modal-buttons', [modalButton])
    ])
  ])
])

overlay.classList.add('tse')

modalButton.addEventListener('click', () => {
  overlay.classList.remove('tse-open')
})
