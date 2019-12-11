/*
Setup the system page (browser).
*/
import * as dom from 'common/components/dom'
import * as settings from 'common/components/machine/settings'
import canvas from 'common/components/machine/canvas'
import console from 'common/components/machine/console'
import * as controls from 'common/components/controls'
import output from 'common/components/machine/output'
import * as memory from 'common/components/machine/memory'
import { on } from 'common/system/state'

// setup the system page
export default () => {
  // create the machine div
  const content = [
    controls.machine,
    dom.createTabs([
      {
        label: 'Settings',
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
        ]
      },
      { label: 'Canvas', active: true, content: [canvas, console] },
      { label: 'Output', active: false, content: [output] },
      { label: 'Memory', active: false, content: [memory.buttons, memory.stack, memory.heap] }
    ])
  ]
  const machineDiv = dom.createElement('div', 'tse-browser-tab-pane', content)
  machineDiv.classList.add('tse-machine')

  // register to switch tabs when called for
  on('show-settings', () => { dom.showTab('Settings') })
  on('show-canvas', () => { dom.showTab('Canvas') })
  on('show-output', () => { dom.showTab('Output') })
  on('show-memory', () => { dom.showTab('Memory') })

  // return the machine div
  return machineDiv
}
