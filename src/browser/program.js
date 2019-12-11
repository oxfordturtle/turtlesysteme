/*
Setup the system page (browser).
*/
import * as dom from 'common/components/dom'
import code from 'common/components/program/code'
import * as pcode from 'common/components/program/pcode'
import * as file from 'common/components/program/file'
import usage from 'common/components/program/usage'
import lexemes from 'common/components/program/lexemes'
import * as controls from 'common/components/controls'
import { on } from 'common/system/state'

// setup the system page
export default (tse) => {
  // create the program div
  const content = [
    controls.program,
    dom.createTabs([
      { label: 'File', active: false, content: [file.newFile, file.openHelp] },
      { label: 'Code', active: true, content: [code] },
      { label: 'Usage', active: false, content: [usage] },
      { label: 'Lexemes', active: false, content: [lexemes] },
      { label: 'PCode', active: false, content: [pcode.options, pcode.list] }
    ])
  ]
  const programDiv = dom.createElement('div', 'tse-browser-tab-pane', content)
  programDiv.classList.add('tse-program')

  // register to switch tabs when called for
  on('file-changed', () => { dom.showTab('Code') })

  // return the program div
  return programDiv
}
