/*
Setup the system page (Electron).
*/
import { ipcRenderer, remote } from 'electron'
import * as dom from 'common/components/dom'
import * as controls from 'common/components/controls'
import code from 'common/components/program/code'
import * as pcode from 'common/components/program/pcode'
import usage from 'common/components/program/usage'
import lexemes from 'common/components/program/lexemes'
import canvas from 'common/components/machine/canvas'
import console from 'common/components/machine/console'
import output from 'common/components/machine/output'
import * as memory from 'common/components/machine/memory'
import { on } from 'common/system/state'

// setup the system page
export default (tse) => {
  // add the system class
  tse.classList.add('tse-system')

  // append the system components (defined below)
  dom.setContent(tse, [
    controls.program,
    controls.machine,
    dom.createTabs([
      { label: 'Code', active: true, content: [code] },
      { label: 'Usage', active: false, content: [usage] },
      { label: 'Lexemes', active: false, content: [lexemes] },
      { label: 'PCode', active: false, content: [pcode.options, pcode.list] }
    ]),
    dom.createTabs([
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

  // register to show errors as dialog boxes
  on('error', (error) => {
    const title = 'Error'
    let message
    let detail
    window.console.log(error) // for deugging
    if (error.lexeme) window.console.log(error.lexeme)
    if (error.type) {
      // custom error
      message = `${error.type} Error`
      detail = error.message
      if (error.lexeme) {
        message += ` - "${error.lexeme.content}", line ${error.lexeme.line}`
      }
    } else {
      // native error
      message = 'System Error'
      detail = 'An unexpected error has occured, suggesting there is a bug in the system. Please contact us with details of what you were doing when this message appeared, and we will do our best to locate and fix the bug.'
    }
    remote.dialog.showMessageBox({ title, message, detail, buttons: ['OK'] })
  })

  // register to show warnings as dialog boxes
  on('warning', (warning) => {
    remote.dialog.showMessageBox({
      title: warning.title,
      message: warning.title,
      detail: warning.message,
      buttons: ['OK']
    })
  })

  // register to tell the main process when certain things have changed (things that should trigger
  // menu changes)
  on('language-changed', (language) => {
    ipcRenderer.send('language-changed', language)
  })
  on('show-canvas-changed', (showCanvas) => {
    ipcRenderer.send('show-canvas-changed', showCanvas)
  })
  on('show-output-changed', (showOutput) => {
    ipcRenderer.send('show-output-changed', showOutput)
  })
  on('show-memory-changed', (showMemory) => {
    ipcRenderer.send('show-memory-changed', showMemory)
  })
}
