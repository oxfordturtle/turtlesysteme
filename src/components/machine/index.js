/*
The machine component.

Other components merely export HTML elements. This component also exports various methods for
outputting the results of the program (drawing on the canvas, outputting text, etc.).
*/

// create the HTML elements first
const { element, show, tabs } = require('dom')
const settings = require('./settings')
const memory = require('./memory')
const canvas = element('canvas', { classes: ['tsx-canvas'], width: 500, height: 500 })
const context = canvas.getContext('2d')
const console = element('pre', { classes: ['tsx-console'] })
const output = element('pre', { classes: ['tsx-output'] })

// export the tabs
module.exports.tabs = tabs('tsx-system-tabs', [
  { label: 'Settings', active: false, content: [settings] },
  { label: 'Canvas', active: true, content: [canvas, console] },
  { label: 'Output', active: false, content: [output] },
  { label: 'Memory', active: false, content: [memory] }
])

// show a tab
module.exports.show = (tab) => {
  if (tab === 'canvas' || tab === 'console') tabs.show('Canvas')
  if (tab === 'output') tabs.show('Output')
  if (tab === 'memory') tabs.show('Memory')
}

// add/remove event listeners to/from the canvas
module.exports.addEventListener = (type, callback) => {
  canvas.addEventListener(type, callback)
}

module.exports.removeEventListener = (type, callback) => {
  canvas.removeEventListener(type, callback)
}

// actual canvas size and position on the page
module.exports.bounds = () =>
  canvas.getBoundingClientRect()

// set the canvas resolution
module.exports.resolution = (width, height) => {
  canvas.width = width
  canvas.height = height
}

// set the canvas cursor
module.exports.cursor = (code) => {
  const corrected = (code < 0 || code > 15) ? 1 : code
  canvas.style.cursor = cursors[corrected].css
}

// draw text on the canvas
module.exports.print = (turtle, string, font, size) => {
  context.textBaseline = 'top'
  context.fillStyle = hex(turtle.c)
  context.font = `${size}pt ${fonts[font & 0xF].css}`
  if ((font & 0x10) > 0) {
    context.font = `bold ${context.font}`
  }
  if ((font & 0x20) > 0) {
    context.font = `italic ${context.font}`
  }
  context.fillText(string, turtle.x, turtle.y)
}

// draw a line on the canvas
module.exports.line = (turtle, x, y) => {
  context.beginPath()
  context.moveTo(turtle.x, turtle.y)
  context.lineTo(x, y)
  context.lineCap = 'round'
  context.lineWidth = turtle.t
  context.strokeStyle = hex(turtle.c)
  context.stroke()
}

// draw a polygon (optionally filled)
module.exports.poly = (turtle, coords, fill) => {
  context.beginPath()
  coords.forEach((coords, index) => {
    if (index === 0) {
      context.moveTo(coords[0], coords[1])
    } else {
      context.lineTo(coords[0], coords[1])
    }
  })
  if (fill) {
    context.closePath()
    context.fillStyle = hex(turtle.c)
    context.fill()
  } else {
    context.lineCap = 'round'
    context.lineWidth = turtle.t
    context.strokeStyle = hex(turtle.c)
    context.stroke()
  }
}

// draw a circle/ellipse (optionally filled)
module.exports.arc = (turtle, radiusx, radiusy, fill) => {
  context.beginPath()
  if (radiusx === radiusy) {
    context.arc(turtle.x, turtle.y, radiusx, 0, 2 * Math.PI, false)
  } else {
    context.save()
    context.translate(turtle.x - radiusx, turtle.y - radiusy)
    context.scale(radiusx, radiusy)
    context.arc(1, 1, 1, 0, 2 * Math.PI, false)
    context.restore()
  }
  if (fill) {
    context.fillStyle = hex(turtle.c)
    context.fill()
  } else {
    context.lineWidth = turtle.t
    context.strokeStyle = hex(turtle.c)
    context.stroke()
  }
}

// draw a box
module.exports.box = (turtle, x, y, fill, border) => {
  context.beginPath()
  context.moveTo(turtle.x, turtle.y)
  context.lineTo(x, turtle.y)
  context.lineTo(x, y)
  context.lineTo(turtle.x, y)
  context.closePath()
  context.fillStyle = hex(fill)
  context.fill()
  if (border) {
    context.lineCap = 'round'
    context.lineWidth = turtle.t
    context.strokeStyle = hex(turtle.c)
    context.stroke()
  }
}

// get the colour of a canvas pixel
module.exports.pixcol = (x, y) => {
  const img = context.getImageData(x, y, 1, 1)
  return (img.data[0] * 65536) + (img.data[1] * 256) + img.data[2]
}

// set the colour of a canvas pixel
module.exports.pixset = (x, y, c, doubled) => {
  const img = context.createImageData(1, 1)
  img.data[0] = (c >> 16) & 0xff
  img.data[1] = (c >> 8) & 0xff
  img.data[2] = c & 0xff
  img.data[3] = 0xff
  context.putImageData(img, x, y)
  if (doubled) {
    context.putImageData(img, x - 1, y)
    context.putImageData(img, x, y - 1)
    context.putImageData(img, x - 1, y - 1)
  }
}

// black the canvas in the given colour
module.exports.blank = (colour) => {
  context.fillStyle = hex(colour)
  context.fillRect(0, 0, canvas.width, canvas.height)
}

// flood a portion of the canvas
module.exports.flood = (x, y, c1, c2, boundary) => {
  const img = context.getImageData(0, 0, canvas.width, canvas.height)
  const pixStack = []
  const dx = [0, -1, 1, 0]
  const dy = [-1, 0, 0, 1]
  let i = 0
  let offset = (((y * canvas.width) + x) * 4)
  const c3 = (256 * 256 * img.data[offset]) + (256 * img.data[offset + 1]) + img.data[offset + 2]
  let nextX
  let nextY
  let nextC
  let test1
  let test2
  let test3
  let tx = x
  let ty = y
  pixStack.push(tx)
  pixStack.push(ty)
  while (pixStack.length > 0) {
    ty = pixStack.pop()
    tx = pixStack.pop()
    for (i = 0; i < 4; i += 1) {
      nextX = tx + dx[i]
      nextY = ty + dy[i]
      test1 = (nextX > 0 && nextX <= canvas.width)
      test2 = (nextY > 0 && nextY <= canvas.height)
      if (test1 && test2) {
        offset = (((nextY * canvas.width) + nextX) * 4)
        nextC = (256 * 256 * img.data[offset])
        nextC += (256 * img.data[offset + 1])
        nextC += img.data[offset + 2]
        test1 = (nextC !== c1)
        test2 = ((nextC !== c2) || !boundary)
        test3 = ((nextC === c3) || boundary)
        if (test1 && test2 && test3) {
          offset = (((nextY * canvas.width) + nextX) * 4)
          img.data[offset] = ((c1 & 0xFF0000) >> 16)
          img.data[offset + 1] = ((c1 & 0xFF00) >> 8)
          img.data[offset + 2] = (c1 & 0xFF)
          pixStack.push(nextX)
          pixStack.push(nextY)
        }
      }
    }
  }
  context.putImageData(img, 0, 0)
}

// write text to the textual output
module.exports.write = (text) => {
  output.innerHTML += text
}

// log text in the console
module.exports.log = (text) => {
  console.innerHTML += text
}

// delete a character from the console
module.exports.delete = () => {
  console.innerHTML = console.innerHTML.slice(0, -1)
}

// clear and change the colour of the textual output
module.exports.output = (clear, colour) => {
  output.innerHTML = ''
  output.style.background = hex(colour)
}

// clear and change the colour of the console
module.exports.console = (clear, colour) => {
  console.innerHTML = ''
  console.style.background = hex(colour)
}

// dump the memory into the memory display table
module.exports.dump = (stack, heap) => {
  memory.innerHTML = 'memory dump was asked for' // TODO
}

// dependencies
const { hex } = require('dom')
const { cursors, fonts } = require('data')
const state = require('state')

// register to keep in sync with system state
state.on('show-settings', show.bind(null, 'Settings'))
