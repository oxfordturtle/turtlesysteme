/*
System State

The system state is a load of variables, representing the current state of the system (not including
the virtual machine, which for clarity has its own module). Getters and setters for these state
variables are defined here. This module also initializes the variables and saves them to local
storage, so that the state is maintained across different pages, and between sessions.

This module exports a "send" function for moving the application state forward, and an "on" function
for registering callbacks to execute after the state has changed. This module is thus the central
hub of the application; other modules can "send" it incoming signals to trigger a state change, and
register things to do "on" the sending of outgoing messages.

For clarity, "signals" are incoming, "messages" are outgoing. Conceptually, signals are requests
sent to this module, asking to change the state (which may result in an error being thrown rather
than a state change); messages are things sent by this module indicating a successful state change,
including also the new values of any relevant state variables.
*/
import * as examples from 'common/constants/examples'
import pcode from 'common/constants/pcode/pcode'
import extensions from 'common/constants/extensions'
import languages from 'common/constants/languages'
import compile from 'common/compiler/compile'
import lexer from 'common/compiler/lexer'
import * as machine from './machine'

// current version (should match the value in the package.json file)
// this is used at the end of this module to check against github repository, and advise the user
// if their version is out of date
const version = '1.0.0'

// function for "sending" signals to this module, asking it to update the state
export const send = (signal, data) => {
  try {
    // try to change the state depending on the signal
    switch (signal) {
      case 'ready':
        reply('language-changed', get('language'))
        reply('show-canvas-changed', get('show-canvas'))
        reply('show-output-changed', get('show-output'))
        reply('show-memory-changed', get('show-memory'))
        reply('draw-count-max-changed', get('draw-count-max'))
        reply('code-count-max-changed', get('code-count-max'))
        reply('small-size-changed', get('small-size'))
        reply('stack-size-changed', get('stack-size'))
        reply('group-changed', get('group'))
        reply('simple-changed', get('simple'))
        reply('intermediate-changed', get('intermediate'))
        reply('advanced-changed', get('advanced'))
        break

      case 'new-program':
        set('name', '')
        set('compiled', false)
        set('code', '')
        set('usage', [])
        set('lexemes', [])
        set('pcode', [])
        reply('file-changed')
        break

      case 'new-skeleton-program':
        set('name', 'Skeleton program')
        set('compiled', false)
        set('usage', [])
        set('lexemes', [])
        set('pcode', [])
        switch (get('language')) {
          case 'BASIC':
            set('code', 'REM progname\n\nvar1%=100\nCOLOUR(GREEN)\nBLOT(var1%)\nEND')
            break

          case 'Pascal':
            set('code', 'PROGRAM progname;\nVAR var1: integer;\nBEGIN\n  var1:=100;\n  colour(green);\n  blot(var1)\nEND.')
            break

          case 'Python':
            set('code', '# progname\n\ndef main():\n  var1=100\n  colour(green)\n  blot(var1)')
            break
        }
        reply('file-changed')
        break

      case 'save-program':
        const tg = new window.Blob([get('code')], { type: 'text/plain;charset=utf-8' })
        const a1 = document.createElement('a')
        a1.setAttribute('href', URL.createObjectURL(tg))
        a1.setAttribute('download', `${get('name')}.${extensions[get('language')]}`)
        a1.click()
        break

      case 'save-tgx-program':
        maybeCompile()
        const date = new Date()
        const json = JSON.stringify({
          format: 1,
          language: get('language'),
          version: 12,
          name: get('name'),
          author: 'unknown', // TODO: could get OS username in Electron, or make user editable
          date: `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`,
          time: `${date.getSeconds()}:${date.getMinutes()}:${date.getSeconds()}`,
          code: get('code'),
          usage: get('usage'),
          pcode: get('pcode')
        }, null, 2)
        const tgx = new window.Blob([json], { type: 'text/plain;charset=utf-8' })
        const a2 = document.createElement('a')
        a2.setAttribute('href', URL.createObjectURL(tgx))
        a2.setAttribute('download', `${get('name')}.tgx`)
        a2.click()
        break

      case 'set-language':
        if (!languages.includes(data)) {
          throw error(`Unknown language "${data}".`)
        }
        set('language', data)
        reply('language-changed', get('language'))
        break

      case 'set-example':
        if (!examples.names[data]) {
          throw error(`Unknown example "${data}".`)
        }
        languages.forEach((language) => {
          set(`name-${language}`, examples.names[data])
          set(`compiled-${language}`, false)
          set(`code-${language}`, examples.code[language][data].trim())
          set(`usage-${language}`, [])
          set(`lexemes-${language}`, [])
          set(`pcode-${language}`, [])
          // load precompiled pcode for examples this system can't compile yet
          if (pcode[data] && pcode[data][language]) {
            set(`pcode-${language}`, pcode[data][language])
            set(`compiled-${language}`, true)
          }
          reply('file-changed')
        })
        break

      case 'load-remote-file':
        const filename = data.split('/').pop()
        window.fetch(data).then((response) => {
          if (response.ok) {
            response.text().then((content) => {
              send('set-file', { filename, content })
            })
          } else {
            // reply instead of throwing error, because it won't be caught in this promise
            reply('error', error(`Couldn't retrieve file at "${data}".`))
          }
        })
        break

      case 'set-file':
        const bits = data.filename.split('.')
        const ext = bits.pop()
        const name = bits.join('.')
        switch (ext) {
          case 'tbas': // fallthrough
          case 'tgb': // support old file extension
            set('language', 'BASIC')
            set('name-BASIC', name)
            set('compiled-BASIC', false)
            set('code-BASIC', data.content.trim())
            set('usage-BASIC', [])
            set('lexemes-BASIC', [])
            set('pcode-BASIC', [])
            break

          case 'tpas': // fallthrough
          case 'tgp': // support old file extension
            set('language', 'Pascal')
            set('name-Pascal', name)
            set('compiled-Pascal', false)
            set('code-Pascal', data.content.trim())
            set('usage-Pascal', [])
            set('lexemes-Pascal', [])
            set('pcode-Pascal', [])
            break

          case 'tpy': // fallthrough
          case 'tgy': // support old file extension
            set('language', 'Python')
            set('name-Python', name)
            set('compiled-Python', false)
            set('code-Python', data.content.trim())
            set('usage-Python', [])
            set('lexemes-Python', [])
            set('pcode-Python', [])
            break

          case 'tgx':
            const result = validateTGX(data.content)
            set('language', result.language)
            set('name', result.name)
            set('compiled', true)
            set('code', result.code.trim())
            set('usage', result.usage)
            set('lexemes', lexer(result.code.trim(), get('language')))
            set('pcode', result.pcode)
            break

          default:
            throw error('Invalid file type.')
        }
        reply('language-changed', get('language'))
        break

      case 'set-name':
        set('name', data)
        reply('name-changed', get('name'))
        break

      case 'set-code':
        set('code', data)
        set('compiled', false)
        reply('code-changed', { code: get('code'), language: get('language') })
        break

      case 'toggle-assembler':
        set('assembler', !get('assembler'))
        reply('pcode-changed', { pcode: get('pcode'), assembler: get('assembler'), decimal: get('decimal') })
        break

      case 'toggle-decimal':
        set('decimal', !get('decimal'))
        reply('pcode-changed', { pcode: get('pcode'), assembler: get('assembler'), decimal: get('decimal') })
        break

      case 'toggle-show-canvas':
        set('show-canvas', !get('show-canvas'))
        reply('show-canvas-changed', get('show-canvas'))
        break

      case 'toggle-show-output':
        set('show-output', !get('show-output'))
        reply('show-output-changed', get('show-output'))
        break

      case 'toggle-show-memory':
        set('show-memory', !get('show-memory'))
        reply('show-memory-changed', get('show-memory'))
        break

      case 'show-settings':
        reply('show-settings')
        break

      case 'set-draw-count-max':
        set('draw-count-max', data)
        reply('draw-count-max-changed', get('draw-count-max'))
        break

      case 'set-code-count-max':
        set('code-count-max', data)
        reply('code-count-max-changed', get('code-count-max'))
        break

      case 'set-small-size':
        set('small-size', data)
        reply('small-size-changed', get('small-size'))
        break

      case 'set-stack-size':
        set('stack-size', data)
        reply('stack-size-changed', get('stack-size'))
        break

      case 'reset-machine-options':
        set('show-canvas', true)
        set('show-output', false)
        set('show-memory', true)
        set('draw-count-max', 4)
        set('code-count-max', 100000)
        set('small-size', 60)
        set('stack-size', 20000)
        reply('show-canvas-changed', get('show-canvas'))
        reply('show-output-changed', get('show-output'))
        reply('show-memory-changed', get('show-memory'))
        reply('draw-count-max-changed', get('draw-count-max'))
        reply('code-count-max-changed', get('code-count-max'))
        reply('small-size-changed', get('small-size'))
        reply('stack-size-changed', get('stack-size'))
        break

      case 'set-group':
        set('group', data)
        reply('help-options-changed', get('help-options'))
        break

      case 'toggle-simple':
        set('simple', !get('simple'))
        reply('help-options-changed', get('help-options'))
        break

      case 'toggle-intermediate':
        set('intermediate', !get('intermediate'))
        reply('help-options-changed', get('help-options'))
        break

      case 'toggle-advanced':
        set('advanced', !get('advanced'))
        reply('help-options-changed', get('help-options'))
        break

      case 'machine-run-halt':
        if (machine.isRunning()) {
          machine.halt()
        } else {
          maybeCompile()
          machine.run(get('pcode'), get('machine-options'), data)
        }
        break

      case 'machine-play-pause':
        if (machine.isRunning()) {
          if (machine.isPaused()) {
            machine.play()
          } else {
            machine.pause()
          }
        }
        break

      case 'dump-memory':
        reply('dump-memory', machine.dump())
        break

      default:
        console.log(`unknown signal '${signal}'`) // for debugging
        break
    }
  } catch (error) {
    // catch any error, and send it as a reply, so that any module can do what they want with it
    // what currently happens is the main module creates a popup showing the error
    reply('error', error)
  }
}

// a record of outgoing messages, to which other modules can attach callbacks (and which are then
// executed by the reply function)
const replies = {}

// function for registering callbacks on the record of outgoing messages
export const on = (message, callback) => {
  if (replies[message]) {
    replies[message].push(callback)
  } else {
    replies[message] = [callback]
  }
}

// function for executing any registered callbacks following a state change
const reply = (message, data) => {
  // execute any callbacks registered for this message
  if (replies[message]) replies[message].forEach(callback => callback(data))

  // if the language has changed, reply that the file has changed as well
  if (message === 'language-changed') {
    reply('file-changed')
    reply('help-options-changed', get('help-options'))
  }

  // if the file has changed, reply that the file properties have changed as well
  if (message === 'file-changed') {
    reply('name-changed', get('name'))
    reply('code-changed', { code: get('code'), language: get('language') })
    reply('usage-changed', get('usage'))
    reply('lexemes-changed', { lexemes: get('lexemes'), language: get('language') })
    reply('pcode-changed', { pcode: get('pcode'), assembler: get('assembler'), decimal: get('decimal') })
  }
}

// universal getters and setters (save to local storage, and parse/stringify)
const set = (item, value) => {
  switch (item) {
    case 'name': // fallthrough
    case 'compiled': // fallthrough
    case 'code': // fallthrough
    case 'usage': // fallthrough
    case 'lexemes': // fallthrough
    case 'pcode':
      set(`${item}-${get('language')}`, value)
      break

    default:
      window.localStorage.setItem(item, JSON.stringify(value))
      break
  }
}

const get = item => {
  switch (item) {
    case 'name': // fallthrough
    case 'compiled': // fallthrough
    case 'code': // fallthrough
    case 'usage': // fallthrough
    case 'lexemes': // fallthrough
    case 'pcode':
      return get(`${item}-${get('language')}`)

    case 'file':
      return {
        name: get('name'),
        compiled: get('compiled'),
        code: get('code'),
        usage: get('usage'),
        pcode: get('pcode')
      }

    case 'machine-options':
      return {
        showCanvas: get('show-canvas'),
        showOutput: get('show-output'),
        showMemory: get('show-memory'),
        drawCountMax: get('draw-count-max'),
        codeCountMax: get('code-count-max'),
        smallSize: get('small-size'),
        stackSize: get('stack-size')
      }

    case 'help-options':
      return {
        language: get('language'),
        group: get('group'),
        simple: get('simple'),
        intermediate: get('intermediate'),
        advanced: get('advanced')
      }

    default:
      return JSON.parse(window.localStorage.getItem(item))
  }
}

// compile the current program (if it isn't already compiled)
const maybeCompile = () => {
  if (!get('compiled')) {
    let result = compile(get('code'), get('language'))
    set('usage', result.usage)
    set('lexemes', result.lexemes)
    set('pcode', result.pcode)
    set('compiled', true)
    reply('usage-changed', result.usage)
    reply('lexemes-changed', { lexemes: result.lexemes, language: get('language') })
    reply('pcode-changed', { pcode: result.pcode, assembler: get('assembler'), decimal: get('decimal') })
  }
}

// validate file input as TGX
const validateTGX = (data) => {
  try {
    const json = JSON.parse(data)
    if (json.language && json.name && json.code && json.usage && json.pcode) {
      return json
    }
    throw error('Invalid TGX file.')
  } catch (ignore) {
    throw error('Invalid TGX file.')
  }
}

// create an error object
const error = (message) => {
  const err = new Error(message)
  err.type = 'System'
  return err
}

// setup initial defaults if they haven't been initialised yet
if (get('language') === null) set('language', 'Pascal')
languages.forEach((language) => {
  if (get(`name-${language}`) === null) set(`name-${language}`, '')
  if (get(`compiled-${language}`) === null) set(`compiled-${language}`, false)
  if (get(`code-${language}`) === null) set(`code-${language}`, '')
  if (get(`usage-${language}`) === null) set(`usage-${language}`, [])
  if (get(`lexemes-${language}`) === null) set(`lexemes-${language}`, [])
  if (get(`pcode-${language}`) === null) set(`pcode-${language}`, [])
})
if (get('assembler') === null) set('assembler', true)
if (get('decimal') === null) set('decimal', true)
if (get('show-canvas') === null) set('show-canvas', true)
if (get('show-output') === null) set('show-output', false)
if (get('show-memory') === null) set('show-memory', true)
if (get('draw-count-max') === null) set('draw-count-max', 4)
if (get('code-count-max') === null) set('code-count-max', 100000)
if (get('small-size') === null) set('small-size', 60)
if (get('stack-size') === null) set('stack-size', 20000)
if (get('group') === null) set('group', 0)
if (get('simple') === null) set('simple', true)
if (get('intermediate') === null) set('intermediate', false)
if (get('advanced') === null) set('advanced', false)

// register to pass some signals on from the machine
machine.on('run', () => reply('machine-started'))
machine.on('halt', () => reply('machine-stopped'))
machine.on('play', () => reply('machine-played'))
machine.on('pause', () => reply('machine-paused'))
machine.on('turtx', (x) => reply('turtx-changed', x))
machine.on('turty', (y) => reply('turty-changed', y))
machine.on('turtd', (d) => reply('turtd-changed', d))
machine.on('turtt', (t) => reply('turtt-changed', t))
machine.on('turtc', (c) => reply('turtc-changed', c))
machine.on('show', (what) => reply(`show-${what}`))
machine.on('dump', (memory) => reply('dump-memory', memory))

// check for latest npm_package_version
window.fetch('https://raw.githubusercontent.com/oxfordturtle/turtlesysteme/master/package.json')
  .then((result) => {
    result.json().then((data) => {
      if (version !== data.version) {
        reply('warning', {
          title: 'Update Available',
          message: `This version of the Turtle System E is out of date. Please visit www.turtle.ox.ac.uk to download the latest version (v${data.version}).`
        })
      }
    })
  })
