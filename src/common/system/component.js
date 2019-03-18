/*
The machine component
*/
import cursors from 'common/constants/cursors'
import fonts from 'common/constants/fonts'

// the HTML elements
let $canvas
let $context
let $console
let $output

// store the HTML elements in the module globals
export const init = ({ canvas, console, output }) => {
  $canvas = canvas
  $context = $canvas.getContext('2d')
  $console = console
  $output = output
}

// add/remove event listeners to/from the canvas
export const addEventListener = (type, callback) => {
  $canvas.addEventListener(type, callback)
}

export const removeEventListener = (type, callback) => {
  $canvas.removeEventListener(type, callback)
}

// actual canvas size and position on the page
export const bounds = () =>
  $canvas.getBoundingClientRect()

// set the canvas resolution
export const resolution = (width, height) => {
  $canvas.width = width
  $canvas.height = height
}

// set the canvas cursor
export const cursor = (code) => {
  const corrected = (code < 0 || code > 15) ? 1 : code
  $canvas.style.cursor = cursors[corrected].css
}

// draw text on the canvas
export const print = (turtle, string, font, size) => {
  $context.textBaseline = 'top'
  $context.fillStyle = turtle.c
  $context.font = `${size}pt ${fonts[font & 0xF].css}`
  if ((font & 0x10) > 0) {
    $context.font = `bold ${$context.font}`
  }
  if ((font & 0x20) > 0) {
    $context.font = `italic ${$context.font}`
  }
  $context.fillText(string, turtle.x, turtle.y)
}

// draw a line on the canvas
export const line = (turtle, x, y) => {
  $context.beginPath()
  $context.moveTo(turtle.x, turtle.y)
  $context.lineTo(x, y)
  $context.lineCap = 'round'
  $context.lineWidth = turtle.t
  $context.strokeStyle = turtle.c
  $context.stroke()
}

// draw a polygon (optionally filled)
export const poly = (turtle, coords, fill) => {
  $context.beginPath()
  coords.forEach((coords, index) => {
    if (index === 0) {
      $context.moveTo(coords[0], coords[1])
    } else {
      $context.lineTo(coords[0], coords[1])
    }
  })
  if (fill) {
    $context.closePath()
    $context.fillStyle = turtle.c
    $context.fill()
  } else {
    $context.lineCap = 'round'
    $context.lineWidth = turtle.t
    $context.strokeStyle = turtle.c
    $context.stroke()
  }
}

// draw a circle/ellipse (optionally filled)
export const arc = (turtle, radiusx, radiusy, fill) => {
  $context.beginPath()
  if (radiusx === radiusy) {
    $context.arc(turtle.x, turtle.y, radiusx, 0, 2 * Math.PI, false)
  } else {
    $context.save()
    $context.translate(turtle.x - radiusx, turtle.y - radiusy)
    $context.scale(radiusx, radiusy)
    $context.arc(1, 1, 1, 0, 2 * Math.PI, false)
    $context.restore()
  }
  if (fill) {
    $context.fillStyle = turtle.c
    $context.fill()
  } else {
    $context.lineWidth = turtle.t
    $context.strokeStyle = turtle.c
    $context.stroke()
  }
}

// draw a box
export const box = (turtle, x, y, fill, border) => {
  $context.beginPath()
  $context.moveTo(turtle.x, turtle.y)
  $context.lineTo(x, turtle.y)
  $context.lineTo(x, y)
  $context.lineTo(turtle.x, y)
  $context.closePath()
  $context.fillStyle = fill
  $context.fill()
  if (border) {
    $context.lineCap = 'round'
    $context.lineWidth = turtle.t
    $context.strokeStyle = turtle.c
    $context.stroke()
  }
}

// get the colour of a canvas pixel
export const pixcol = (x, y) => {
  const img = $context.getImageData(x, y, 1, 1)
  return (img.data[0] * 65536) + (img.data[1] * 256) + img.data[2]
}

// set the colour of a canvas pixel
export const pixset = (x, y, c, doubled) => {
  const img = $context.createImageData(1, 1)
  img.data[0] = (c >> 16) & 0xff
  img.data[1] = (c >> 8) & 0xff
  img.data[2] = c & 0xff
  img.data[3] = 0xff
  $context.putImageData(img, x, y)
  if (doubled) {
    $context.putImageData(img, x - 1, y)
    $context.putImageData(img, x, y - 1)
    $context.putImageData(img, x - 1, y - 1)
  }
}

// black the canvas in the given colour
export const blank = (colour) => {
  $context.fillStyle = colour
  $context.fillRect(0, 0, $canvas.width, $canvas.height)
}

// flood a portion of the canvas
export const flood = (x, y, c1, c2, boundary) => {
  const img = $context.getImageData(0, 0, $canvas.width, $canvas.height)
  const pixStack = []
  const dx = [0, -1, 1, 0]
  const dy = [-1, 0, 0, 1]
  let i = 0
  let offset = (((y * $canvas.width) + x) * 4)
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
      test1 = (nextX > 0 && nextX <= $canvas.width)
      test2 = (nextY > 0 && nextY <= $canvas.height)
      if (test1 && test2) {
        offset = (((nextY * $canvas.width) + nextX) * 4)
        nextC = (256 * 256 * img.data[offset])
        nextC += (256 * img.data[offset + 1])
        nextC += img.data[offset + 2]
        test1 = (nextC !== c1)
        test2 = ((nextC !== c2) || !boundary)
        test3 = ((nextC === c3) || boundary)
        if (test1 && test2 && test3) {
          offset = (((nextY * $canvas.width) + nextX) * 4)
          img.data[offset] = ((c1 & 0xFF0000) >> 16)
          img.data[offset + 1] = ((c1 & 0xFF00) >> 8)
          img.data[offset + 2] = (c1 & 0xFF)
          pixStack.push(nextX)
          pixStack.push(nextY)
        }
      }
    }
  }
  $context.putImageData(img, 0, 0)
}

// write text to the textual output and console
export const write = (text) => {
  $output.innerHTML += text
  $console.innerHTML += text
}

// log text in the console
export const log = (text) => {
  $console.innerHTML += text
}

// delete a character from the console
export const backspace = () => {
  $console.innerHTML = $console.innerHTML.slice(0, -1)
}

// clear and change the colour of the textual output
export const output = (clear, colour) => {
  if (clear) $output.innerHTML = ''
  $output.style.background = colour
}

// clear and change the colour of the console
export const console = (clear, colour) => {
  if (clear) $console.innerHTML = ''
  $console.style.background = colour
}
