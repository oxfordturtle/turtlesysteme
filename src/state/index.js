/*
System State

The system state is a load of variables, representing the current state of the system (not including
the virtual machine, which for clarity has its own module). Getter and setters for these state
variables are defined in the session sub-module, which also initializes them and saves them to local
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

// function for "sending" signals to this module, asking it to update the state
module.exports.send = (signal, data) => {
  try {
    // try to change the state depending on the signal
    switch (signal) {
      case 'ready':
        reply('language-changed', session.language.get())
        break

      case 'new-program':
        session.file.new()
        reply('file-changed', session.file.get())
        break

      case 'save-program':
        // TODO
        break

      case 'save-program-as':
        // TODO
        break

      case 'set-language':
        session.language.set(data)
        reply('language-changed', session.language.get())
        break

      case 'set-example':
        session.example.set(data)
        reply('file-changed', session.file.get())
        break

      case 'set-file':
        session.file.set(data.filename, data.content)
        reply('language-changed', session.language.get())
        break

      case 'set-name':
        session.name.set(data, session.language.get())
        reply('name-changed', session.name.get())
        break

      case 'set-code':
        session.code.set(data, session.language.get())
        session.compiled.set(false, session.language.get())
        reply('code-changed', { code: session.code.get(), language: session.language.get() })
        break

      case 'toggle-assembler':
        session.assembler.toggle()
        reply('pcode-changed', { pcode: session.pcode.get(), assembler: session.assembler.get(), decimal: session.decimal.get() })
        break

      case 'toggle-decimal':
        session.decimal.toggle()
        reply('pcode-changed', { pcode: session.pcode.get(), assembler: session.assembler.get(), decimal: session.decimal.get() })
        break

      case 'toggle-show-canvas':
        session.showCanvas.toggle()
        reply('show-canvas-changed', session.showCanvas.get())
        break

      case 'toggle-show-output':
        session.showOutput.toggle()
        reply('show-output-changed', session.showOutput.get())
        break

      case 'toggle-show-memory':
        session.showMemory.toggle()
        reply('show-memory-changed', session.showMemory.get())
        break

      case 'show-settings':
        reply('show-settings')
        break

      case 'set-draw-count-max':
        session.drawCountMax.set(data)
        reply('draw-count-max-changed', session.drawCountMax.get())
        break

      case 'set-code-count-max':
        session.codeCountMax.set(data)
        reply('code-count-max-changed', session.codeCountMax.get())
        break

      case 'set-small-size':
        session.smallSize.set(data)
        reply('small-size-changed', session.smallSize.get())
        break

      case 'set-stack-size':
        session.stackSize.set(data)
        reply('stack-size-changed', session.stackSize.get())
        break

      case 'reset-machine-options':
        session.machineOptions.reset()
        reply('draw-count-max-changed', session.drawCountMax.get())
        reply('code-count-max-changed', session.codeCountMax.get())
        reply('small-size-changed', session.smallSize.get())
        reply('stack-size-changed', session.stackSize.get())
        break

      case 'set-group':
        session.group.set(data)
        reply('group-changed', session.group.get())
        break

      case 'toggle-simple':
        session.simple.toggle()
        reply('simple-changed', session.simple.get())
        break

      case 'toggle-intermediate':
        session.intermediate.toggle()
        reply('intermediate-changed', session.intermediate.get())
        break

      case 'toggle-advanced':
        session.advanced.toggle()
        reply('advanced-changed', session.advanced.get())
        break

      case 'machine-run-halt':
        if (machine.isRunning()) {
          machine.halt(data)
        } else {
          if (!session.compiled.get()) {
            if (session.code.get().length > 0) {
              let result = compiler.compile(session.code.get(), session.language.get())
              session.usage.set(result.usage, session.language.get())
              session.pcode.set(result.pcode, session.language.get())
              session.compiled.set(true, session.language.get())
              reply('usage-changed', result.usage)
              reply('pcode-changed', { pcode: result.pcode, assembler: session.assembler.get(), decimal: session.decimal.get() })
            }
          }
          if (session.pcode.get().length > 0) {
            machine.run(session.pcode.get(), session.machineOptions.get(), data)
          }
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

// function for registering callbacks on the record of outgoing messages
module.exports.on = (message, callback) => {
  if (replies[message]) {
    replies[message].push(callback)
  } else {
    replies[message] = [callback]
  }
}

// dependencies
const compiler = require('compiler')
const machine = require('./machine')
const session = require('./session')

// function for executing any registered callbacks following a state change
const reply = (message, data) => {
  // execute any callbacks registered for this message
  if (replies[message]) replies[message].forEach(callback => callback(data))

  // if the language has changed, reply that the file has changed as well
  if (message === 'language-changed') {
    reply('file-changed', session.file.get())
  }

  // if the file has changed, reply that the file properties have changed as well
  if (message === 'file-changed') {
    reply('name-changed', session.name.get())
    reply('code-changed', { code: session.code.get(), language: session.language.get() })
    reply('usage-changed', session.usage.get())
    reply('pcode-changed', { pcode: session.pcode.get(), assembler: session.assembler.get(), decimal: session.decimal.get() })
  }
}

// a record of outgoing messages, to which other modules can attach callbacks (and which are then
// executed by the reply function)
const replies = {}

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
