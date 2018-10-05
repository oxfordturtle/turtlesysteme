/*
The program tabs. N.B. The CSS rules for the Electron version hide the file tab (whose functionality
is handled instead by the application menu); but to keep this code simple it might as well be
included invisibly.
*/
import { element, show, tabs } from '../tools.js'
import * as examples from '../data/examples.js'
import { pcodes } from '../data/pcodes.js'
import highlight from '../compiler/highlight.js'
import { send, on } from '../system/state.js'

// the file tab elements
const newFileButtons = element('div', {
  classes: ['tsx-buttons'],
  content: [
    element('button', {
      content: 'Blank Program',
      on: [{ type: 'click', callback: () => send('new-program') }]
    }),
    element('button', {
      content: 'Skeleton Program',
      on: [{ type: 'click', callback: () => send('new-skeleton-program') }]
    })
  ]
})

const fileInput = element('input', {
  type: 'file',
  on: [{
    type: 'change',
    callback: (e) => {
      const file = e.currentTarget.files[0]
      const fr = new window.FileReader()
      fr.onload = () => { send('set-file', { filename: file.name, content: fr.result }) }
      fr.readAsText(file)
    }
  }]
})

const optgroup = group =>
  element('optgroup', {
    label: `${group.index}. ${group.title}`,
    content: group.examples.map(x => element('option', { value: x, content: examples.names[x] }))
  })

const exampleSelect = examples =>
  element('select', {
    content: examples.map(optgroup),
    on: [
      { type: 'change', callback: (e) => { send('set-example', e.currentTarget.value) } },
      { type: 'focus', callback: (e) => { e.currentTarget.selectedIndex = -1 } }
    ]
  })

const saveFileButtons = element('div', {
  classes: ['tsx-buttons'],
  content: [
    element('button', {
      content: 'Save Program File',
      on: [{ type: 'click', callback: () => { send('save-program') } }]
    }),
    element('button', {
      content: 'Export TGX File',
      on: [{ type: 'click', callback: () => { send('save-tgx-program') } }]
    })
  ]
})

const fileBox = (title, content) =>
  element('div', {
    classes: ['tsx-file-box'],
    content: [element('label', { content: title }), content]
  })

const newFile = fileBox('New File', newFileButtons)

const openLocal = fileBox('Open Local File', fileInput)

const openHelp = fileBox('Open Example Program', exampleSelect(examples.help))

const openCSAC = fileBox('Open CSAC Book Program', exampleSelect(examples.csac))

const saveFile = fileBox('Save File', saveFileButtons)

// the code tab
const numbers = element('ol') // for line numbers

const prettyCode = element('code') // for the highlighted code

const prettyWrapper = element('pre', { content: [prettyCode] }) // warpper for the highlighted code

const plainCode = element('textarea', { // for capturing the user input
  wrap: 'off',
  spellcheck: 'false',
  autocapitalize: 'off',
  autocomplete: 'off',
  autocorrect: 'off',
  on: [
    {
      type: 'keydown',
      callback: (e) => {
        if (e.keyCode === 9) {
          const pos = e.currentTarget.selectionStart
          const left = e.currentTarget.value.slice(0, pos)
          const right = e.currentTarget.value.slice(pos)
          e.preventDefault()
          e.currentTarget.value = [left, right].join('  ')
          send('set-code', e.currentTarget.value)
          e.currentTarget.selectionStart = pos + 2
          e.currentTarget.selectionEnd = pos + 2
        }
      }
    },
    { type: 'input', callback: (e) => { send('set-code', e.currentTarget.value) } }
  ]
})

const code = element('div', {
  classes: ['tsx-code'],
  content: [plainCode, numbers, prettyWrapper]
})

// the usage tab
const usageHead = element('thead', { content: [
  element('tr', { content: [
    element('th', { content: 'Expression' }),
    element('th', { content: 'Level' }),
    element('th', { content: 'Count' }),
    element('th', { content: 'Program Lines' })
  ] })
] })

const usageBody = element('tbody')

const usage = element('table', { classes: ['tsx-usage-table'], content: [usageHead, usageBody] })

// the pcode tab
const assemblerInput = element('input', {
  type: 'radio',
  name: 'pcodeOptions1',
  on: [{ type: 'change', callback: () => send('toggle-assembler') }]
})

const machineInput = element('input', {
  type: 'radio',
  name: 'pcodeOptions1',
  on: [{ type: 'change', callback: () => send('toggle-assembler') }]
})

const decimalInput = element('input', {
  type: 'radio',
  name: 'pcodeOptions2',
  on: [{ type: 'change', callback: () => send('toggle-decimal') }]
})

const hexadecimalInput = element('input', {
  type: 'radio',
  name: 'pcodeOptions2',
  on: [{ type: 'change', callback: () => send('toggle-decimal') }]
})

const pcodeOptions = element('div', {
  classes: [ 'tsx-checkboxes' ],
  content: [
    element('label', { content: [assemblerInput, 'Assembler Code'] }),
    element('label', { content: [machineInput, 'Machine Code'] }),
    element('label', { content: [decimalInput, 'Decimal'] }),
    element('label', { content: [hexadecimalInput, 'Hexadecimal'] })
  ]
})

const pcodeList = element('ol', { classes: ['tsx-pcode-table'] })

// export the tabs (with or without the file tab)
export const component = (includeFileTab) =>
  includeFileTab
    ? tabs('tsx-system-tabs', [
      { label: 'File', active: false, content: [newFile, openLocal, openHelp, openCSAC, saveFile] },
      { label: 'Code', active: true, content: [code] },
      { label: 'Usage', active: false, content: [usage] },
      { label: 'PCode', active: false, content: [pcodeOptions, pcodeList] }
    ])
    : tabs('tsx-system-tabs', [
      { label: 'Code', active: true, content: [code] },
      { label: 'Usage', active: false, content: [usage] },
      { label: 'PCode', active: false, content: [pcodeOptions, pcodeList] }
    ])

// synchronise with the application state
on('file-changed', () => { show('Code') })

on('file-changed', () => {
  code.scrollTop = 0
  code.scrollLeft = 0
})

on('code-changed', ({ code, language }) => {
  const lines = code.split('\n')
  numbers.innerHTML = lines.map((x, y) => `<li>${(y + 1).toString(10)}</li>`).join('')
  prettyCode.innerHTML = highlight(code, language)
  window.requestAnimationFrame(() => {
    plainCode.value = code
    plainCode.style.height = `${numbers.scrollHeight.toString(10)}px`
    plainCode.style.width = `${prettyWrapper.scrollWidth.toString(10)}px`
  })
})

on('usage-changed', (usage) => {
  usageBody.innerHTML = ''
  usage.forEach((category) => {
    usageBody.appendChild(element('tr', {
      classes: [ 'category-heading' ],
      content: [ element('th', { colspan: '4', content: category.title }) ]
    }))
    category.expressions.forEach((expression) => {
      usageBody.appendChild(element('tr', { content: [
        element('td', { content: expression.name }),
        element('td', { content: expression.level.toString() }),
        element('td', { content: expression.count.toString() }),
        element('td', { content: expression.lines.replace(/ /g, ', ') })
      ] }))
    })
    usageBody.appendChild(element('tr', {
      content: [
        element('td'),
        element('th', { content: 'TOTAL:' }),
        element('th', { content: category.total.toString() }),
        element('td')
      ]
    }))
  })
})

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
  pcodeList.innerHTML = ''
  pcode.map((line) => {
    const content = assembler
      ? assemble(line, 0, decimal)
      : line.reduce((sofar, current) => sofar.concat(cell(current, decimal)), [])
    while (content.length % 8 > 0) {
      content.push(element('div'))
    }
    return element('li', { content })
  }).forEach((x) => pcodeList.appendChild(x))
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
  if (content === null) return element('div', { content: ':(' })
  if (decimal === undefined) return element('div', { content })
  return decimal
    ? element('div', { content: content.toString(10) })
    : element('div', { content: content.toString(16).toUpperCase() })
}
