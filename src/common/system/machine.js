/*
The Virtual Turtle Machine.
*/
import colours from 'common/constants/colours'
import pc from 'common/constants/pc'
import * as component from './component.js'

// machine constants
const turtxIndex = 1
const turtyIndex = 2
const turtdIndex = 3
const turtaIndex = 4
const turttIndex = 5
const turtcIndex = 6

// function for registering callbacks on the record of outgoing messages
export const on = (message, callback) => {
  replies[message] = callback
}

// get machine status
export const isRunning = () => status.running
export const isPaused = () => status.paused

// get machine memory
export const dump = () => {
  const stack = memory.slice(0, markers.stackTop + 1)
  const heap = memory.slice(markers.heapBase, markers.heapMax)
  return { stack, heap, heapBase: markers.heapBase }
}

// run the machine
export const run = (pcode, options) => {
  // clear the console and output
  component.resolution(1000, 1000)
  component.console(true, '#FFFFFF')
  component.output(true, '#FFFFFF')
  // optionally show the canvas
  if (options.showCanvas) replies.show('canvas')
  // set up the memory arrays
  memory.length = 0x200000
  keys.length = 0x100
  query.length = 0x10
  memory.fill(0)
  keys.fill(-1)
  query.fill(-1)
  // setup the stacks
  coords.length = 0
  stack.length = 0
  memoryStack.length = 0
  returnStack.length = 0
  subroutineStack.length = 0
  // set up stack top and markers.heapBase markers
  markers.stackTop = 0
  markers.heapGlobal = -1
  markers.heapBase = options.stackSize
  markers.heapTemp = markers.heapBase
  markers.heapPerm = markers.heapTemp
  markers.heapMax = markers.heapTemp
  // setup the virtual canvas
  // N.B. pcode for every program does most of this anyway; reconsider?
  vcanvas.startx = 0
  vcanvas.starty = 0
  vcanvas.sizex = 1000
  vcanvas.sizey = 1000
  vcanvas.width = 1000
  vcanvas.height = 1000
  vcanvas.doubled = false
  component.canvas(0, 0, 1000, 1000)
  // setup runtime variables (global to this module)
  runtime.startTime = Date.now()
  runtime.pendown = true
  runtime.update = true
  runtime.keyecho = true
  runtime.detect = null
  runtime.readline = null
  // setup the machine status
  status.running = true
  status.paused = false
  // add event listeners
  window.addEventListener('keydown', storeKey)
  window.addEventListener('keyup', releaseKey)
  window.addEventListener('keypress', putInBuffer)
  component.addEventListener('contextmenu', preventDefault)
  component.addEventListener('mousemove', storeMouseXY)
  component.addEventListener('touchmove', preventDefault)
  component.addEventListener('touchmove', storeMouseXY)
  component.addEventListener('mousedown', preventDefault)
  component.addEventListener('mousedown', storeClickXY)
  component.addEventListener('touchstart', storeClickXY)
  component.addEventListener('mouseup', releaseClickXY)
  component.addEventListener('touchend', releaseClickXY)
  // send the started signal (via the main state module)
  replies.run()
  // execute the first block of code (which will in turn trigger execution of the next block)
  execute(pcode, 0, 0, options)
}

// halt the machine
export const halt = () => {
  // remove event listeners
  window.removeEventListener('keydown', storeKey)
  window.removeEventListener('keyup', releaseKey)
  window.removeEventListener('keypress', putInBuffer)
  window.removeEventListener('keyup', runtime.detect)
  window.removeEventListener('keydown', runtime.readline)
  component.removeEventListener('contextmenu', preventDefault)
  component.removeEventListener('mousemove', storeMouseXY)
  component.removeEventListener('touchmove', preventDefault)
  component.removeEventListener('touchmove', storeMouseXY)
  component.removeEventListener('mousedown', preventDefault)
  component.removeEventListener('mousedown', storeClickXY)
  component.removeEventListener('touchstart', storeClickXY)
  component.removeEventListener('mouseup', releaseClickXY)
  component.removeEventListener('touchend', releaseClickXY)
  // reset the canvas cursor
  component.cursor(1)
  // reset the machine status
  status.running = false
  status.paused = false
  // send the stopped signal (via the main state module)
  replies.halt()
}

// play the machine
export const play = () => {
  status.paused = false
  replies.play()
}

// pause the machine
export const pause = () => {
  status.paused = true
  replies.pause()
}

// record of replies (callbacks to execute when sending signals out); the main state module
// specifies these functions, because they require things in scope from that module
const replies = {}

// the machine status
const status = {
  running: false,
  paused: false
}

// the machine memory (global, so they don't have to be passed around all the time)
const memory = []
const keys = []
const query = []
const coords = []
const stack = []
const memoryStack = []
const returnStack = []
const subroutineStack = []
const markers = {}
const vcanvas = {}
const runtime = {}

// window event listeners
const storeKey = (event) => {
  const pressedKey = event.keyCode || event.charCode
  // backspace
  if (pressedKey === 8) {
    event.preventDefault() // don't go back a page in the browser!
    const buffer = memory[1]
    if (buffer > 0) { // there is a keybuffer
      if (memory[buffer + 1] !== memory[buffer + 2]) { // the keybuffer has something in it
        if (memory[buffer + 2] === buffer + 3) {
          memory[buffer + 2] = memory[buffer] // go "back" to the end
        } else {
          memory[buffer + 2] -= 1 // go back one
        }
        if (runtime.keyecho) component.backspace()
      }
      // put buffer length in keys array
      if (memory[buffer + 2] >= memory[buffer + 1]) {
        keys[0] = memory[buffer + 2] - memory[buffer + 1]
      } else {
        keys[0] = memory[buffer + 2] - memory[buffer + 1] + memory[buffer] - buffer - 2
      }
    }
  }
  // arrow keys
  if (pressedKey >= 37 && pressedKey <= 40) {
    event.preventDefault() // don't scroll the page
  }
  // normal case
  query[9] = pressedKey
  query[10] = 128
  if (event.shiftKey) query[10] += 8
  if (event.altKey) query[10] += 16
  if (event.ctrlKey) query[10] += 32
  keys[pressedKey] = query[10]
}

const releaseKey = (event) => {
  const pressedKey = event.keyCode || event.charCode
  // keyup should set positive value to negative; use Math.abs to ensure the result is negative,
  // in case two keydown events fire close together, before the first keyup event fires
  query[9] = -Math.abs(query[9])
  query[10] = -Math.abs(query[10])
  keys[pressedKey] = -Math.abs(keys[pressedKey])
}

const putInBuffer = (event) => {
  const pressedKey = event.keyCode || event.charCode
  const buffer = memory[1]
  if (buffer > 0) { // there is a keybuffer
    let next = 0
    if (memory[buffer + 2] === memory[buffer]) {
      next = buffer + 3 // loop back round to the start
    } else {
      next = memory[buffer + 2] + 1
    }
    if (next !== memory[buffer + 1]) {
      memory[memory[buffer + 2]] = pressedKey
      memory[buffer + 2] = next
      // put buffer length in keys array
      if (memory[buffer + 2] >= memory[buffer + 1]) {
        keys[0] = memory[buffer + 2] - memory[buffer + 1]
      } else {
        keys[0] = memory[buffer + 2] - memory[buffer + 1] + memory[buffer] - buffer - 2
      }
      // maybe show in the console
      if (runtime.keyecho) component.log(String.fromCharCode(pressedKey))
    }
  }
}

// store mouse coordinates in virtual memory
const storeMouseXY = (event) => {
  switch (event.type) {
    case 'mousemove':
      query[7] = virtx(event.clientX)
      query[8] = virty(event.clientY)
      break

    case 'touchmove': // fallthrough
    case 'touchstart':
      query[7] = virtx(event.touches[0].clientX)
      query[8] = virty(event.touches[0].clientY)
      break
  }
}

// store mouse click coordinates in virtual memory
const storeClickXY = (event) => {
  const now = Date.now()
  query[4] = 128
  if (event.shiftKey) query[4] += 8
  if (event.altKey) query[4] += 16
  if (event.ctrlKey) query[4] += 32
  if (now - query[11] < 300) query[4] += 64 // double-click
  query[11] = now // save to check for next double-click
  switch (event.type) {
    case 'mousedown':
      query[5] = virtx(event.clientX)
      query[6] = virty(event.clientY)
      switch (event.button) {
        case 0:
          query[4] += 1
          query[1] = query[4]
          query[2] = -1
          query[3] = -1
          break

        case 1:
          query[4] += 4
          query[1] = -1
          query[2] = -1
          query[3] = query[4]
          break

        case 2:
          query[4] += 2
          query[1] = -1
          query[2] = query[4]
          query[3] = -1
          break
      }
      break

    case 'touchstart':
      query[5] = virtx(event.touches[0].clientX)
      query[6] = virty(event.touches[0].clientY)
      query[4] += 1
      query[1] = query[4]
      query[2] = -1
      query[3] = -1
      storeMouseXY(event)
      break
  }
}

// store mouse release coordinates in virtual memory
const releaseClickXY = (event) => {
  query[4] = -query[4]
  switch (event.type) {
    case 'mouseup':
      switch (event.button) {
        case 0:
          query[1] = -query[1]
          break

        case 1:
          query[2] = -query[3]
          break

        case 2:
          query[2] = -query[2]
          break
      }
      break

    case 'touchend':
      query[1] = -query[1]
      break
  }
}

// prevent default (for blocking context menus on right click)
const preventDefault = (event) => {
  event.preventDefault()
}

// execute a block of code
const execute = (pcode, line, code, options) => {
  // don't do anything if we're not running
  if (!status.running) return

  // try again in 1 millisecond if the machine is paused
  if (status.paused) {
    setTimeout(execute, 1, pcode, line, code, options)
    return
  }

  // in case of runtime.detect or runtime.readline, remove the event listeners the first time we carry on with the
  // program execution after they have been called
  window.removeEventListener('keyup', runtime.detect)
  window.removeEventListener('keydown', runtime.readline)

  // execute as much code as possible
  let drawCount = 0
  let codeCount = 0
  let a, b, c, d // miscellanous variables for working things out on the fly
  try {
    while (drawCount < options.drawCountMax && (codeCount <= options.codeCountMax)) {
      switch (pcode[line][code]) {
        // 0x0 - basic stack operations, boolean operators
        case pc.dupl:
          a = stack.pop()
          stack.push(a, a)
          break

        case pc.swap:
          b = stack.pop()
          a = stack.pop()
          stack.push(b, a)
          break

        case pc.rota:
          c = stack.pop()
          b = stack.pop()
          a = stack.pop()
          stack.push(b, c, a)
          break

        case pc.incr:
          a = stack.pop()
          stack.push(a + 1)
          break

        case pc.decr:
          a = stack.pop()
          stack.push(a - 1)
          break

        case pc.not:
          a = stack.pop()
          stack.push(~a)
          break

        case pc.and:
          b = stack.pop()
          a = stack.pop()
          stack.push(a & b)
          break

        case pc.or:
          b = stack.pop()
          a = stack.pop()
          stack.push(a | b)
          break

        case pc.xor:
          b = stack.pop()
          a = stack.pop()
          stack.push(a ^ b)
          break

        case pc.band:
          b = stack.pop()
          a = stack.pop()
          stack.push(a && b)
          break

        case pc.bor:
          b = stack.pop()
          a = stack.pop()
          stack.push(a || b)
          break

        // 0x1 - integer operators
        case pc.neg:
          a = stack.pop()
          stack.push(-a)
          break

        case pc.abs:
          a = stack.pop()
          stack.push(Math.abs(a))
          break

        case pc.sign:
          a = stack.pop()
          stack.push(Math.sign(a))
          break

        case pc.rand:
          a = stack.pop()
          stack.push(Math.floor(Math.random() * Math.abs(a)))
          break

        case pc.plus:
          b = stack.pop()
          a = stack.pop()
          stack.push(a + b)
          break

        case pc.subt:
          b = stack.pop()
          a = stack.pop()
          stack.push(a - b)
          break

        case pc.mult:
          b = stack.pop()
          a = stack.pop()
          stack.push(a * b)
          break

        case pc.divr:
          b = stack.pop()
          a = stack.pop()
          stack.push(Math.round(a / b))
          break

        case pc.div:
          b = stack.pop()
          a = stack.pop()
          stack.push(Math.floor(a / b))
          break

        case pc.mod:
          b = stack.pop()
          a = stack.pop()
          stack.push(a % b)
          break

        // 0x2 - pseudo-real operators
        case pc.divm:
          c = stack.pop()
          b = stack.pop()
          a = stack.pop()
          stack.push(Math.round((a / b) * c))
          break

        case pc.sqrt:
          b = stack.pop()
          a = stack.pop()
          stack.push(Math.round(Math.sqrt(a) * b))
          break

        case pc.hyp:
          c = stack.pop()
          b = stack.pop()
          a = stack.pop()
          stack.push(Math.round(Math.sqrt((a * a) + (b * b)) * c))
          break

        case pc.root:
          d = stack.pop()
          c = stack.pop()
          b = stack.pop()
          a = stack.pop()
          stack.push(Math.round(Math.pow(a / b, 1 / c) * d))
          break

        case pc.powr:
          d = stack.pop()
          c = stack.pop()
          b = stack.pop()
          a = stack.pop()
          stack.push(Math.round(Math.pow(a / b, c) * d))
          break

        case pc.log:
          c = stack.pop()
          b = stack.pop()
          a = stack.pop()
          stack.push(Math.round((Math.log(a / b) / Math.LN10) * c))
          break

        case pc.alog:
          c = stack.pop()
          b = stack.pop()
          a = stack.pop()
          stack.push(Math.round(Math.pow(10, a / b) * c))
          break

        case pc.ln:
          c = stack.pop()
          b = stack.pop()
          a = stack.pop()
          stack.push(Math.round(Math.log(a / b) * c))
          break

        case pc.exp:
          c = stack.pop()
          b = stack.pop()
          a = stack.pop()
          stack.push(Math.round(Math.exp(a / b) * c))
          break

        case pc.sin:
          d = stack.pop()
          c = stack.pop()
          b = stack.pop()
          a = (b / c) * (2 * Math.PI) / memory[memory[0] + turtaIndex]
          stack.push(Math.round(Math.sin(a) * d))
          break

        case pc.cos:
          d = stack.pop()
          c = stack.pop()
          b = stack.pop()
          a = (b / c) * (2 * Math.PI) / memory[memory[0] + turtaIndex]
          stack.push(Math.round(Math.cos(a) * d))
          break

        case pc.tan:
          d = stack.pop()
          c = stack.pop()
          b = stack.pop()
          a = (b / c) * (2 * Math.PI) / memory[memory[0] + turtaIndex]
          stack.push(Math.round(Math.tan(a) * d))
          break

        case pc.asin:
          d = stack.pop()
          c = stack.pop()
          b = stack.pop()
          a = memory[memory[0] + turtaIndex] / (2 * Math.PI)
          stack.push(Math.round(Math.asin(b / c) * d * a))
          break

        case pc.acos:
          d = stack.pop()
          c = stack.pop()
          b = stack.pop()
          a = memory[memory[0] + turtaIndex] / (2 * Math.PI)
          stack.push(Math.round(Math.acos(b / c) * d * a))
          break

        case pc.atan:
          d = stack.pop()
          c = stack.pop()
          b = stack.pop()
          a = memory[memory[0] + turtaIndex] / (2 * Math.PI)
          stack.push(Math.round(Math.atan2(b, c) * d * a))
          break

        case pc.pi:
          a = stack.pop()
          stack.push(Math.round(Math.PI * a))
          break

        // 0x3 - string operators
        case pc.ctos:
          a = stack.pop()
          makeHeapString(String.fromCharCode(a))
          break

        case pc.itos:
          a = stack.pop()
          makeHeapString(a.toString())
          break

        case pc.hexs:
          b = stack.pop()
          a = stack.pop().toString(16).toUpperCase()
          while (a.length < b) {
            a = '0' + a
          }
          makeHeapString(a)
          break

        case pc.sval:
          c = stack.pop()
          b = stack.pop()
          a = getHeapString(b)
          if (a[0] === '#') {
            d = isNaN(parseInt(a.slice(1), 16)) ? c : parseInt(a.slice(1), 16)
          } else {
            d = isNaN(parseInt(a, 10)) ? c : parseInt(a, 10)
          }
          stack.push(d)
          break

        case pc.qtos:
          d = stack.pop()
          c = stack.pop()
          b = stack.pop()
          a = (b / c)
          makeHeapString(a.toFixed(d))
          break

        case pc.qval:
          c = stack.pop()
          b = stack.pop()
          a = getHeapString(stack.pop())
          d = isNaN(parseFloat(a)) ? c : parseFloat(a)
          stack.push(Math.round(d * b))
          break

        case pc.scat:
          b = getHeapString(stack.pop())
          a = getHeapString(stack.pop())
          makeHeapString(a + b)
          break

        case pc.slen:
          a = getHeapString(stack.pop())
          stack.push(a.length)
          break

        case pc.case:
          b = stack.pop()
          a = getHeapString(stack.pop())
          if (b > 0) {
            makeHeapString(a.toUpperCase())
          } else if (b < 0) {
            makeHeapString(a.toLowerCase())
          } else {
            makeHeapString(a)
          }
          break

        case pc.copy:
          c = stack.pop()
          b = stack.pop()
          a = getHeapString(stack.pop())
          makeHeapString(a.substr(b - 1, c))
          break

        case pc.dels:
          d = stack.pop()
          c = stack.pop()
          b = getHeapString(stack.pop())
          a = b.substr(0, c - 1) + b.substr((c - 1) + d)
          makeHeapString(a)
          break

        case pc.inss:
          d = stack.pop()
          c = getHeapString(stack.pop())
          b = getHeapString(stack.pop())
          a = c.substr(0, d - 1) + b + c.substr(d - 1)
          makeHeapString(a)
          break

        case pc.poss:
          b = getHeapString(stack.pop())
          a = getHeapString(stack.pop())
          stack.push(b.indexOf(a) + 1)
          break

        case pc.repl:
          d = stack.pop()
          c = getHeapString(stack.pop())
          b = getHeapString(stack.pop())
          a = getHeapString(stack.pop())
          if (d > 0) {
            while (d > 0) {
              a = a.replace(b, c)
              d = d - 1
            }
            makeHeapString(a)
          } else {
            makeHeapString(a.replace(new RegExp(b, 'g'), c))
          }
          break

        case pc.sasc:
          a = getHeapString(stack.pop())
          if (a.length === 0) {
            stack.push(0)
          } else {
            stack.push(a.charCodeAt(0))
          }
          break

        // 0x4 - comparison operators (push -1 for true, 0 for false)
        case pc.eqal:
          b = stack.pop()
          a = stack.pop()
          stack.push(a === b ? -1 : 0)
          break

        case pc.noeq:
          b = stack.pop()
          a = stack.pop()
          stack.push(a !== b ? -1 : 0)
          break

        case pc.less:
          b = stack.pop()
          a = stack.pop()
          stack.push(a < b ? -1 : 0)
          break

        case pc.more:
          b = stack.pop()
          a = stack.pop()
          stack.push(a > b ? -1 : 0)
          break

        case pc.lseq:
          b = stack.pop()
          a = stack.pop()
          stack.push(a <= b ? -1 : 0)
          break

        case pc.mreq:
          b = stack.pop()
          a = stack.pop()
          stack.push(a >= b ? -1 : 0)
          break

        case pc.maxi:
          b = stack.pop()
          a = stack.pop()
          stack.push(Math.max(a, b))
          break

        case pc.mini:
          b = stack.pop()
          a = stack.pop()
          stack.push(Math.min(a, b))
          break

        case pc.seql:
          b = getHeapString(stack.pop())
          a = getHeapString(stack.pop())
          stack.push(a === b ? -1 : 0)
          break

        case pc.sneq:
          b = getHeapString(stack.pop())
          a = getHeapString(stack.pop())
          stack.push(a !== b ? -1 : 0)
          break

        case pc.sles:
          b = getHeapString(stack.pop())
          a = getHeapString(stack.pop())
          stack.push(a < b ? -1 : 0)
          break

        case pc.smor:
          b = getHeapString(stack.pop())
          a = getHeapString(stack.pop())
          stack.push(a > b ? -1 : 0)
          break

        case pc.sleq:
          b = getHeapString(stack.pop())
          a = getHeapString(stack.pop())
          stack.push(a <= b ? -1 : 0)
          break

        case pc.smeq:
          b = getHeapString(stack.pop())
          a = getHeapString(stack.pop())
          stack.push(a >= b ? -1 : 0)
          break

        case pc.smax:
          b = getHeapString(stack.pop())
          a = getHeapString(stack.pop())
          makeHeapString(Math.max(a, b))
          break

        case pc.smin:
          b = getHeapString(stack.pop())
          a = getHeapString(stack.pop())
          makeHeapString(Math.min(a, b))
          break

        // 0x5 - loading stack
        case pc.ldin:
          a = pcode[line][code + 1]
          stack.push(a)
          code += 1
          break

        case pc.ldvg:
          a = pcode[line][code + 1]
          stack.push(memory[a])
          code += 1
          break

        case pc.ldvv:
          a = pcode[line][code + 1]
          b = pcode[line][code + 2]
          stack.push(memory[memory[a] + b])
          code += 2
          break

        case pc.ldvr:
          a = pcode[line][code + 1]
          b = pcode[line][code + 2]
          stack.push(memory[memory[memory[a] + b]])
          code += 2
          break

        case pc.ldag:
          a = pcode[line][code + 1]
          stack.push(a)
          code += 1
          break

        case pc.ldav:
          a = pcode[line][code + 1]
          b = pcode[line][code + 2]
          stack.push(memory[a] + b)
          code += 2
          break

        case pc.lstr:
          code += 1
          a = pcode[line][code] // length of the string
          b = code + a // end of the string
          c = ''
          while (code < b) {
            code += 1
            c += String.fromCharCode(pcode[line][code])
          }
          makeHeapString(c)
          break

        case pc.ldmt:
          stack.push(memoryStack.length - 1)
          break

        // 0x6 - storing from stack
        case pc.zero:
          a = pcode[line][code + 1]
          b = pcode[line][code + 2]
          memory[memory[a] + b] = 0
          code += 2
          break

        case pc.stvg:
          a = stack.pop()
          memory[pcode[line][code + 1]] = a
          code += 1
          break

        case pc.stvv:
          a = pcode[line][code + 1]
          b = pcode[line][code + 2]
          c = stack.pop()
          memory[memory[a] + b] = c
          code += 2
          break

        case pc.stvr:
          a = pcode[line][code + 1]
          b = pcode[line][code + 2]
          c = stack.pop()
          memory[memory[memory[a] + b]] = c
          code += 2
          break

        case pc.stmt:
          a = stack.pop()
          memoryStack.push(a)
          markers.stackTop = Math.max(a, markers.stackTop)
          break

        // 0x7 - pointer handling
        case pc.lptr:
          a = stack.pop()
          stack.push(memory[a])
          break

        case pc.sptr:
          b = stack.pop()
          a = stack.pop()
          memory[b] = a
          break

        case pc.cptr:
          c = stack.pop() // length
          b = stack.pop() // target
          a = stack.pop() // source
          copy(a, b, c)
          break

        case pc.zptr:
          b = stack.pop()
          a = stack.pop()
          zero(a, b)
          break

        case pc.test:
          // not yet implemented
          break

        case pc.cstr:
          b = stack.pop() // target
          a = stack.pop() // source
          d = memory[b - 1] // maximum length of target
          c = memory[a] // length of source
          copy(a, b, Math.min(c, d) + 1)
          break

        // 0x8 - flow control
        case pc.jump:
          line = pcode[line][code + 1] - 1
          code = -1
          break

        case pc.ifno:
          if (stack.pop() === 0) {
            line = pcode[line][code + 1] - 1
            code = -1
          } else {
            code += 1
          }
          break

        case pc.halt:
          halt()
          return

        case pc.subr:
          if (markers.heapGlobal === -1) {
            markers.heapGlobal = markers.heapPerm
          }
          returnStack.push(line + 1)
          line = pcode[line][code + 1] - 1
          code = -1
          break

        case pc.retn:
          line = returnStack.pop()
          code = -1
          break

        case pc.pssr:
          subroutineStack.push(pcode[line][code + 1])
          code += 1
          break

        case pc.plsr:
          subroutineStack.pop()
          break

        case pc.psrj:
          stack.push(line + 1)
          break

        case pc.plrj:
          returnStack.pop()
          line = (stack.pop() - 1)
          code = -1
          break

        // 0x9 - memory control
        case pc.memc:
          a = pcode[line][code + 1]
          b = pcode[line][code + 2]
          c = memoryStack.pop()
          // heap overflow check
          if (c + b > options.stackSize) {
            halt()
            throw error('Memory stack has overflowed into memory heap. Probable cause is unterminated recursion.')
          }
          memoryStack.push(memory[a])
          markers.stackTop = Math.max(memory[a], markers.stackTop)
          memory[a] = c
          memoryStack.push(c + b)
          markers.stackTop = Math.max(c + b, markers.stackTop)
          code += 2
          break

        case pc.memr:
          memoryStack.pop()
          a = pcode[line][code + 1]
          b = memoryStack.pop()
          memoryStack.push(memory[a])
          markers.stackTop = Math.max(memory[a], markers.stackTop)
          memory[a] = b
          code += 2
          break

        case pc.hfix:
          markers.heapPerm = markers.heapTemp
          break

        case pc.hclr:
          markers.heapTemp = markers.heapPerm
          break

        case pc.hrst:
          if (markers.heapGlobal > -1) {
            markers.heapTemp = markers.heapGlobal
            markers.heapPerm = markers.heapGlobal
          }
          break

        // 0xA - runtime flags, text output, debugging
        case pc.pnup:
          runtime.pendown = false
          break

        case pc.pndn:
          runtime.pendown = true
          break

        case pc.udat:
          runtime.update = true
          drawCount = options.drawCountMax // force runtime.update
          break

        case pc.ndat:
          runtime.update = false
          break

        case pc.kech:
          a = (stack.pop() !== 0)
          runtime.keyecho = a
          break

        case pc.outp:
          c = (stack.pop() !== 0)
          b = stack.pop()
          a = (stack.pop() !== 0)
          component.output(a, hex(b))
          if (c) {
            replies.show('output')
          } else {
            replies.show('canvas')
          }
          break

        case pc.cons:
          b = stack.pop()
          a = (stack.pop() !== 0)
          component.console(a, hex(b))
          break

        case pc.trac:
          // not implemented -
          // just pop the top off the stack
          stack.pop()
          break

        case pc.memw:
          // not implemented -
          // just pop the top off the stack
          stack.pop()
          break

        case pc.dump:
          replies.dump(dump())
          if (options.showMemory) replies.show('memory')
          break

        // 0xB - timing, runtime.input, text output
        case pc.time:
          a = Date.now()
          a = a - runtime.startTime
          stack.push(a)
          break

        case pc.tset:
          a = Date.now()
          b = stack.pop()
          runtime.startTime = a - b
          break

        case pc.wait:
          a = stack.pop()
          code += 1
          if (code === pcode[line].length) {
            line += 1
            code = 0
          }
          setTimeout(execute, a, pcode, line, code, options)
          return

        case pc.tdet:
          b = stack.pop()
          a = stack.pop()
          stack.push(0)
          code += 1
          if (code === pcode[line].length) {
            line += 1
            code = 0
          }
          c = setTimeout(execute, a, pcode, line, code, options)
          runtime.detect = detectProto.bind(null, b, c, pcode, line, code, options)
          window.addEventListener('keyup', runtime.detect)
          return

        case pc.inpt:
          a = stack.pop()
          if (a < 0) {
            stack.push(query[-a])
          } else {
            stack.push(keys[a])
          }
          break

        case pc.iclr:
          a = stack.pop()
          if (a < 0) {
            // reset query value
            query[-a] = -1
          } else if (a === 0) {
            // reset keybuffer
            memory[memory[1] + 1] = memory[1] + 3
            memory[memory[1] + 2] = memory[1] + 3
          } else {
            // reset key value
            keys[a] = -1
          }
          break

        case pc.bufr:
          a = stack.pop()
          if (a > 0) {
            b = markers.heapTemp + 4
            stack.push(markers.heapTemp + 1)
            memory[markers.heapTemp + 1] = b + a
            memory[markers.heapTemp + 2] = b
            memory[markers.heapTemp + 3] = b
            memory.fill(0, b, b + a)
            markers.heapTemp = b + a
            markers.heapMax = Math.max(markers.heapTemp, markers.heapMax)
          }
          break

        case pc.read:
          a = stack.pop() // maximum number of characters to read
          b = memory[1] // the address of the buffer
          c = memory[memory[1]] // the address of the end of the buffer
          d = '' // the string read from the buffer
          let readNextAddress = memory[b + 1]
          let readLastAddress = memory[b + 2]
          if (a === 0) {
            while (readNextAddress !== readLastAddress) {
              d += String.fromCharCode(memory[readNextAddress])
              readNextAddress = (readNextAddress < c)
                ? readNextAddress + 1
                : c + 3 // loop back to the start
            }
          } else {
            while (readNextAddress !== readLastAddress && d.length <= a) {
              d += String.fromCharCode(memory[readNextAddress])
              if (readNextAddress < c) {
                readNextAddress += 1
              } else {
                readNextAddress = c + 3 // loop back to the start
              }
            }
            memory[b + 1] = readNextAddress
          }
          makeHeapString(d)
          break

        case pc.rdln:
          a = Math.pow(2, 31) - 1 // as long as possible
          code += 1
          if (code === pcode[line].length) {
            line += 1
            code = 0
          }
          b = setTimeout(execute, a, pcode, line, code, options)
          runtime.readline = readlineProto.bind(null, b, pcode, line, code, options)
          window.addEventListener('keydown', runtime.readline)
          return

        case pc.prnt:
          c = stack.pop()
          b = stack.pop()
          a = getHeapString(stack.pop())
          component.print(turtle(), a, b, c)
          break

        case pc.text:
          a = getHeapString(stack.pop())
          component.write(a)
          if (options.showOutput) replies.show('output')
          break

        case pc.newl:
          component.write('\n')
          break

        // 0xC - file handling, dummy codes
        case pc.fdir:
          // not yet implemented
          break

        case pc.open:
          // not yet implemented
          break

        case pc.clos:
          // not yet implemented
          break

        case pc.fptr:
          // not yet implemented
          break

        case pc.fbeg:
          // not yet implemented
          break

        case pc.eof:
          // not yet implemented
          break

        case pc.frds:
          // not yet implemented
          break

        case pc.frln:
          // not yet implemented
          break

        case pc.fwrs:
          // not yet implemented
          break

        case pc.fwnl:
          // not yet implemented
          break

        // 0xD - canvas, turtle settings
        case pc.canv:
          vcanvas.sizey = stack.pop()
          vcanvas.sizex = stack.pop()
          vcanvas.starty = stack.pop()
          vcanvas.startx = stack.pop()
          component.canvas(vcanvas.startx, vcanvas.starty, vcanvas.sizex, vcanvas.sizey)
          memory[memory[0] + turtxIndex] = Math.round(vcanvas.startx + (vcanvas.sizex / 2))
          memory[memory[0] + turtyIndex] = Math.round(vcanvas.starty + (vcanvas.sizey / 2))
          memory[memory[0] + turtdIndex] = 0
          replies.turtx(memory[memory[0] + turtxIndex])
          replies.turty(memory[memory[0] + turtyIndex])
          replies.turtd(memory[memory[0] + turtdIndex])
          coords.push([memory[memory[0] + turtxIndex], memory[memory[0] + turtyIndex]])
          drawCount = options.drawCountMax // force runtime.update
          break

        case pc.reso:
          b = stack.pop()
          a = stack.pop()
          if (Math.min(a, b) <= options.smallSize) {
            a = a * 2
            b = b * 2
            vcanvas.doubled = true
          }
          vcanvas.width = a
          vcanvas.height = b
          component.resolution(a, b)
          component.blank('#FFFFFF')
          drawCount = options.drawCountMax // force runtime.update
          break

        case pc.pixc:
          b = stack.pop()
          a = stack.pop()
          stack.push(component.pixcol(turtx(a), turty(b)))
          break

        case pc.pixs:
          c = stack.pop()
          b = stack.pop()
          a = stack.pop()
          component.pixset(turtx(a), turty(b), c, vcanvas.doubled)
          if (runtime.update) drawCount += 1
          break

        case pc.angl:
          a = stack.pop()
          b = Math.round(a + memory[memory[0] + turtdIndex] * a / memory[memory[0] + turtaIndex])
          memory[memory[0] + turtdIndex] = b % a
          memory[memory[0] + turtaIndex] = a
          replies.turtd(b % a)
          replies.turta(a)
          break

        case pc.curs:
          a = stack.pop()
          component.cursor(a)
          break

        case pc.home:
          a = vcanvas.startx + (vcanvas.sizex / 2)
          b = vcanvas.starty + (vcanvas.sizey / 2)
          memory[memory[0] + turtxIndex] = Math.round(a)
          memory[memory[0] + turtyIndex] = Math.round(b)
          memory[memory[0] + turtdIndex] = 0
          replies.turtx(memory[memory[0] + turtxIndex])
          replies.turty(memory[memory[0] + turtyIndex])
          replies.turtd(memory[memory[0] + turtdIndex])
          coords.push([memory[memory[0] + turtxIndex], memory[memory[0] + turtyIndex]])
          break

        case pc.setx:
          a = stack.pop()
          memory[memory[0] + turtxIndex] = a
          replies.turtx(a)
          coords.push([memory[memory[0] + turtxIndex], memory[memory[0] + turtyIndex]])
          break

        case pc.sety:
          a = stack.pop()
          memory[memory[0] + turtyIndex] = a
          replies.turty(a)
          coords.push([memory[memory[0] + turtxIndex], memory[memory[0] + turtyIndex]])
          break

        case pc.setd:
          a = stack.pop() % memory[memory[0] + turtaIndex]
          memory[memory[0] + turtdIndex] = a
          replies.turtd(a)
          break

        case pc.thik:
          a = stack.pop()
          memory[memory[0] + turttIndex] = a
          replies.turtt(a)
          break

        case pc.colr:
          a = stack.pop()
          memory[memory[0] + turtcIndex] = a
          replies.turtc(hex(a))
          break

        case pc.rgb:
          a = stack.pop()
          a = a % 50
          if (a <= 0) a += 50
          a = colours[a - 1].value
          stack.push(a)
          break

        case pc.mixc:
          d = stack.pop() // second proportion
          c = stack.pop() // first proportion
          b = stack.pop() // second colour
          a = stack.pop() // first colour
          const mixBytes = (byte1, byte2) =>
            Math.round(((byte1 * c) + (byte2 * d)) / (c + d))
          const extractRed = colour =>
            Math.floor(colour / 0x10000)
          const extractGreen = colour =>
            Math.floor((colour & 0xFF00) / 0x100)
          const extractBlue = colour =>
            colour & 0xFF
          const redByte = mixBytes(extractRed(a), extractRed(b))
          const greenByte = mixBytes(extractGreen(a), extractGreen(b))
          const blueByte = mixBytes(extractBlue(a), extractBlue(b))
          stack.push((redByte * 0x10000) + (greenByte * 0x100) + blueByte)
          break

        // 0xE - turtle movement
        case pc.toxy:
          b = stack.pop()
          a = stack.pop()
          memory[memory[0] + turtxIndex] = a
          memory[memory[0] + turtyIndex] = b
          replies.turtx(a)
          replies.turty(b)
          coords.push([a, b])
          break

        case pc.mvxy:
          b = stack.pop() + memory[memory[0] + turtyIndex]
          a = stack.pop() + memory[memory[0] + turtxIndex]
          memory[memory[0] + turtxIndex] = a
          memory[memory[0] + turtyIndex] = b
          replies.turtx(a)
          replies.turty(b)
          coords.push([a, b])
          break

        case pc.drxy:
          b = stack.pop() + memory[memory[0] + turtyIndex]
          a = stack.pop() + memory[memory[0] + turtxIndex]
          if (runtime.pendown) {
            component.line(turtle(), turtx(a), turty(b))
            if (runtime.update) drawCount += 1
          }
          memory[memory[0] + turtxIndex] = a
          memory[memory[0] + turtyIndex] = b
          replies.turtx(a)
          replies.turty(b)
          coords.push([a, b])
          break

        case pc.fwrd:
          c = stack.pop() // distance
          d = memory[memory[0] + turtdIndex] // turtle direction
          // work out final y coordinate
          b = Math.cos(d * Math.PI / (memory[memory[0] + turtaIndex] / 2))
          b = -Math.round(b * c)
          b += memory[memory[0] + turtyIndex]
          // work out final x coordinate
          a = Math.sin(d * Math.PI / (memory[memory[0] + turtaIndex] / 2))
          a = Math.round(a * c)
          a += memory[memory[0] + turtxIndex]
          if (runtime.pendown) {
            component.line(turtle(), turtx(a), turty(b))
            if (runtime.update) drawCount += 1
          }
          memory[memory[0] + turtxIndex] = a
          memory[memory[0] + turtyIndex] = b
          replies.turtx(a)
          replies.turty(b)
          coords.push([a, b])
          break

        case pc.back:
          c = stack.pop() // distance
          d = memory[memory[0] + turtdIndex] // turtle direction
          // work out final y coordinate
          b = Math.cos(d * Math.PI / (memory[memory[0] + turtaIndex] / 2))
          b = Math.round(b * c)
          b += memory[memory[0] + turtyIndex]
          // work out final x coordinate
          a = Math.sin(d * Math.PI / (memory[memory[0] + turtaIndex] / 2))
          a = -Math.round(a * c)
          a += memory[memory[0] + turtxIndex]
          if (runtime.pendown) {
            component.line(turtle(), turtx(a), turty(b))
            if (runtime.update) drawCount += 1
          }
          memory[memory[0] + turtxIndex] = a
          memory[memory[0] + turtyIndex] = b
          replies.turtx(a)
          replies.turty(b)
          coords.push([a, b])
          break

        case pc.left:
          a = (memory[memory[0] + turtdIndex] - stack.pop()) % memory[memory[0] + turtaIndex]
          memory[memory[0] + turtdIndex] = a
          replies.turtd(a)
          break

        case pc.rght:
          a = (memory[memory[0] + turtdIndex] + stack.pop()) % memory[memory[0] + turtaIndex]
          memory[memory[0] + turtdIndex] = a
          replies.turtd(a)
          break

        case pc.turn:
          b = stack.pop()
          a = stack.pop()
          if (Math.abs(b) >= Math.abs(a)) {
            c = Math.atan(-a / b)
            if (b > 0) {
              c += Math.PI
            } else if (a < 0) {
              c += 2
              c *= Math.PI
            }
          } else {
            c = Math.atan(b / a)
            if (a > 0) {
              c += Math.PI
            } else {
              c += 3
              c *= Math.PI
            }
            c /= 2
          }
          c = Math.round(c * memory[memory[0] + turtaIndex] / Math.PI / 2) % memory[memory[0] + turtaIndex]
          memory[memory[0] + turtdIndex] = c
          replies.turtd(c)
          break

        case pc.rmbr:
          coords.push([memory[memory[0] + turtxIndex], memory[memory[0] + turtyIndex]])
          break

        case pc.frgt:
          coords.length -= stack.pop()
          break

        // 0xF - shapes and fills, maximum integer
        case pc.poly:
          c = stack.pop()
          b = coords.length
          a = (c > b) ? 0 : b - c
          component.poly(turtle(), coords.slice(a, b).map(vcoords), false)
          if (runtime.update) drawCount += 1
          break

        case pc.pfil:
          c = stack.pop()
          b = coords.length
          a = (c > b) ? 0 : b - c
          component.poly(turtle(), coords.slice(a, b).map(vcoords), true)
          if (runtime.update) drawCount += 1
          break

        case pc.circ:
          a = stack.pop()
          component.arc(turtle(), turtx(a + vcanvas.startx), turty(a + vcanvas.starty), false)
          if (runtime.update) drawCount += 1
          break

        case pc.blot:
          a = stack.pop()
          component.arc(turtle(), turtx(a + vcanvas.startx), turty(a + vcanvas.starty), true)
          if (runtime.update) drawCount += 1
          break

        case pc.elps:
          b = stack.pop()
          a = stack.pop()
          component.arc(turtle(), turtx(a + vcanvas.startx), turty(b + vcanvas.starty), false)
          if (runtime.update) drawCount += 1
          break

        case pc.eblt:
          b = stack.pop()
          a = stack.pop()
          component.arc(turtle(), turtx(a + vcanvas.startx), turty(b + vcanvas.starty), true)
          if (runtime.update) drawCount += 1
          break

        case pc.box:
          d = (stack.pop() !== 0) // border
          c = stack.pop() // fill colour
          b = memory[memory[0] + turtyIndex] + stack.pop() // end y coordinate
          a = memory[memory[0] + turtxIndex] + stack.pop() // end x coordinate
          component.box(turtle(), turtx(a), turty(b), hex(c), d)
          if (runtime.update) drawCount += 1
          break

        case pc.blnk:
          a = stack.pop()
          component.blank(hex(a))
          if (runtime.update) drawCount += 1
          break

        case pc.rcol:
          c = stack.pop()
          b = stack.pop()
          a = stack.pop()
          component.flood(a, b, c, 0, false)
          if (runtime.update) drawCount += 1
          break

        case pc.fill:
          d = stack.pop()
          c = stack.pop()
          b = stack.pop()
          a = stack.pop()
          component.flood(a, b, c, d, true)
          if (runtime.update) drawCount += 1
          break

        case pc.mxin:
          stack.push(Math.pow(2, 31) - 1)
          break
      }
      codeCount += 1
      code += 1
      if (!pcode[line]) {
        halt()
        throw error('The program has tried to jump to a line that does not exist. This is either a bug in our compiler, or in your assembled code.')
      }
      if (code === pcode[line].length) { // line wrap
        line += 1
        code = 0
      }
    }
  } catch (error) {
    replies.error(error)
  }
  // setTimeout (with no delay) instead of direct recursion means the function will return and the
  // canvas will be runtime.updated
  setTimeout(execute, 0, pcode, line, code, options)
}

// create a machine runtime error
const error = (message) => {
  const err = new Error(message)
  err.type = 'Machine'
  return err
}

// make a string on the heap
const makeHeapString = (string) => {
  const stringArray = Array.from(string).map(c => c.charCodeAt(0))
  stack.push(markers.heapTemp + 1)
  markers.heapTemp += 1
  memory[markers.heapTemp] = string.length
  stringArray.forEach((code) => {
    markers.heapTemp += 1
    memory[markers.heapTemp] = code
  })
  markers.heapMax = Math.max(markers.heapTemp, markers.heapMax)
}

// get a string from the heap
const getHeapString = (address) => {
  const length = memory[address]
  const start = address + 1
  const charArray = memory.slice(start, start + length)
  const string = charArray.reduce((a, b) => a + String.fromCharCode(b), '')
  if (address + length + 1 > markers.heapPerm) {
    markers.heapTemp = address + length
  }
  return string
}

// fill a chunk of main memory with zeros
const zero = (start, length) => {
  if (length > 0) {
    memory[start] = 0
    zero(start + 1, length - 1)
  }
}

// copy one chunk of memory into another
const copy = (source, target, length) => {
  if (length > 0) {
    memory[target] = memory[source]
    copy(source + 1, target + 1, length - 1)
  }
}

// prototype key runtime.detection function
const detectProto = (keyCode, timeoutID, pcode, line, code, options, event) => {
  const pressedKey = event.keyCode || event.charCode
  if (pressedKey === keyCode) {
    stack.pop()
    stack.push(-1) // -1 for true
    window.clearTimeout(timeoutID)
    execute(pcode, line, code, options)
  }
}

// prototype line reading function
const readlineProto = (timeoutID, pcode, line, code, options, event) => {
  const pressedKey = event.keyCode || event.charCode
  if (pressedKey === 13) {
    // get heap string from the buffer, up to the first ENTER
    const bufferAddress = memory[1]
    const bufferEndAddress = memory[memory[1]]
    let string = ''
    let readNextAddress = memory[bufferAddress + 1]
    let readLastAddress = memory[bufferAddress + 2]
    while (readNextAddress !== readLastAddress && memory[readNextAddress] !== 13) {
      string += String.fromCharCode(memory[readNextAddress])
      readNextAddress = (readNextAddress < bufferEndAddress)
        ? readNextAddress + 1
        : bufferEndAddress + 3 // loop back to the start
    }
    // move past the ENTER
    memory[bufferAddress + 1] = (readNextAddress < bufferEndAddress)
      ? readNextAddress + 1
      : bufferEndAddress + 3 // loop back to the start
    // put the string on the heap
    makeHeapString(string)
    // clear the timeout and resume ordinary pcode execution
    window.clearTimeout(timeoutID)
    execute(pcode, line, code, options)
  }
}

// get current turtle properties
const turtle = () => ({
  x: turtx(memory[memory[0] + turtxIndex]),
  y: turty(memory[memory[0] + turtyIndex]),
  d: memory[memory[0] + turtdIndex],
  a: memory[memory[0] + turtaIndex],
  t: turtt(memory[memory[0] + turttIndex]),
  c: hex(memory[memory[0] + turtcIndex])
})

// convert turtx to virtual canvas coordinate
const turtx = (x) => {
  const exact = ((x - vcanvas.startx) * vcanvas.width) / vcanvas.sizex
  return vcanvas.doubled ? Math.round(exact) + 1 : Math.round(exact)
}

// convert turty to virtual canvas coordinate
const turty = (y) => {
  const exact = ((y - vcanvas.starty) * vcanvas.height) / vcanvas.sizey
  return vcanvas.doubled ? Math.round(exact) + 1 : Math.round(exact)
}

// convert turtt to virtual canvas thickness
const turtt = t =>
  vcanvas.doubled ? t * 2 : t

// map turtle coordinates to virtual turtle coordinates
const vcoords = ([x, y]) =>
  [turtx(x), turty(y)]

// convert x to virtual canvas coordinate
const virtx = (x) => {
  const { left, width } = component.bounds()
  const exact = (((x - left) * vcanvas.sizex) / width) + vcanvas.startx
  return Math.round(exact)
}

// convert y to virtual canvas coordinate
const virty = (y) => {
  const { height, top } = component.bounds()
  const exact = (((y - top) * vcanvas.sizey) / height) + vcanvas.starty
  return Math.round(exact)
}

// convert a number to css colour #000000 format
const hex = colour =>
  `#${padded(colour.toString(16))}`

// padd a string with leading zeros
const padded = string =>
  ((string.length < 6) ? padded(`0${string}`) : string)
