/*
arrays of commands and command categories (for the compilers, the help page, and usage data)
*/
import { category, command, expression, parameter } from './factory.js'
import { pc } from './pcodes.js'

export const commands = ([
  // 0. Turtle: relative movement
  command({
    names: [ 'FORWARD', 'forward', 'forward' ],
    code: pc.fwrd,
    parameters: [
      parameter('n', 'integer')
    ],
    category: 0,
    level: 0,
    description: 'Moves the Turtle forward <code>n</code> units, drawing as it goes (unless the pen is up).'
  }),
  command({
    names: [ 'BACK', 'back', 'back' ],
    code: pc.back,
    parameters: [
      parameter('n', 'integer')
    ],
    category: 0,
    level: 0,
    description: 'Moves the Turtle back <code>n</code> units, drawing as it goes (unless the pen is up).'
  }),
  command({
    names: [ 'LEFT', 'left', 'left' ],
    code: pc.left,
    parameters: [
      parameter('n', 'integer')
    ],
    category: 0,
    level: 0,
    description: 'Rotates the Turtle left by <code>n</code> degrees.'
  }),
  command({
    names: [ 'RIGHT', 'right', 'right' ],
    code: pc.rght,
    parameters: [
      parameter('n', 'integer')
    ],
    category: 0,
    level: 0,
    description: 'Rotates the Turtle right by <code>n</code> degrees.'
  }),
  command({
    names: [ 'DRAWXY', 'drawxy', 'drawxy' ],
    code: pc.drxy,
    parameters: [
      parameter('x', 'integer'),
      parameter('y', 'integer')
    ],
    category: 0,
    level: 1,
    description: 'Moves the Turtle in a straight line to a point <code>x</code> units away along the x-axis and <code>y</code> units away along the y-axis, drawing as it goes (unless the pen is up).'
  }),
  command({
    names: [ 'MOVEXY', 'movexy', 'movexy' ],
    code: pc.mvxy,
    parameters: [
      parameter('x', 'integer'),
      parameter('y', 'integer')
    ],
    category: 0,
    level: 1,
    description: 'Moves the Turtle in a straight line to a point <code>x</code> units away along the x-axis and <code>y</code> units away along the y-axis, <em>without</em> drawing (regardless of the current pen status).'
  }),
  // 1. Turtle: absolute movement
  command({
    names: [ 'HOME', 'home', 'home' ],
    code: pc.home,
    category: 1,
    level: 0,
    description: 'Moves the Turtle back to its starting position in the centre of the canvas, facing north, drawing as it goes (unless the pen is up).'
  }),
  command({
    names: [ 'SETX', 'setx', 'setx' ],
    code: pc.setx,
    parameters: [
      parameter('x', 'integer')
    ],
    category: 1,
    level: 0,
    description: 'Sets the Turtle&rsquo;s <code>x</code> coordinate directly (without movement or drawing on the canvas). This can also be achieved by direct assignment of the global variable <code>turtx</code>.'
  }),
  command({
    names: [ 'SETY', 'sety', 'sety' ],
    code: pc.sety,
    parameters: [
      parameter('y', 'integer')
    ],
    category: 1,
    level: 0,
    description: 'Sets the Turtle&rsquo;s <code>y</code> coordinate directly (without movement or drawing on the canvas). This can also be achieved by direct assignment of the global variable <code>turty</code>.'
  }),
  command({
    names: [ 'SETXY', 'setxy', 'setxy' ],
    code: pc.toxy,
    parameters: [
      parameter('x', 'integer'),
      parameter('y', 'integer')
    ],
    category: 1,
    level: 0,
    description: 'Sets the Turtle&rsquo;s <code>x</code> and <code>y</code> coordinates directly (without movement or drawing on the canvas). This can also be achieved by direct assingment of the global variables <code>turtx</code> and <code>turty</code>.'
  }),
  command({
    names: [ 'DIRECTION', 'direction', 'direction' ],
    code: pc.setd,
    parameters: [
      parameter('n', 'integer')
    ],
    category: 1,
    level: 0,
    description: 'Sets the Turtle&rsquo;s direction to <code>n</code> degrees (0 for north, 90 for east, 180 for south, 270 for west). This can also be achieved by direct assignment of the global variable <code>turtd</code>. Note that the number of degrees in a circle (360 by default) can be changed with the <code>angles</code> command.'
  }),
  command({
    names: [ 'TURNXY', 'turnxy', 'turnxy' ],
    code: pc.turn,
    parameters: [
      parameter('x', 'integer'),
      parameter('y', 'integer')
    ],
    category: 1,
    level: 1,
    description: 'Turns the Turtle to face the point <code>x</code> units away alongthe x-axis and <code>y</code> units away along the y-axis.'
  }),
  // 2. Turtle: shape drawing
  command({
    names: [ 'CIRCLE', 'circle', 'circle' ],
    code: pc.circ,
    parameters: [
      parameter('radius', 'integer')
    ],
    category: 2,
    level: 0,
    description: 'Draws a circle outline in the Turtle&rsquo;s current colour and thickness, of the given <code>radius</code>, centred on the Turtle&rsquo;s current location.'
  }),
  command({
    names: [ 'BLOT', 'blot', 'blot' ],
    code: pc.blot,
    parameters: [
      parameter('radius', 'integer')
    ],
    category: 2,
    level: 0,
    description: 'Draws a filled circle in the Turtle&rsquo;s current colour, of the given <code>radius</code>, centred on the Turtle&rsquo;s current location.'
  }),
  command({
    names: [ 'ELLIPSE', 'ellipse', 'ellipse' ],
    code: pc.elps,
    parameters: [
      parameter('Xradius', 'integer'),
      parameter('Yradius', 'integer')
    ],
    category: 2,
    level: 0,
    description: 'Draws an ellipse outline in the Turtle&rsquo;s current colour and thickness, of the given <code>Xradius</code> and <code>Yradius</code>, centred on the Turtle&rsquo;s current location.'
  }),
  command({
    names: [ 'ELLBLOT', 'ellblot', 'ellblot' ],
    code: pc.eblt,
    parameters: [
      parameter('Xradius', 'integer'),
      parameter('Yradius', 'integer')
    ],
    category: 2,
    level: 0,
    description: 'Draws a filled ellipse in the Turtle&rsquo;s current colour, of the given <code>Xradius</code> and <code>Yradius</code>, centred on the Turtle&rsquo;s current location.'
  }),
  command({
    names: [ 'POLYLINE', 'polyline', 'polyline' ],
    code: pc.poly,
    parameters: [
      parameter('n', 'integer')
    ],
    category: 2,
    level: 1,
    description: 'Draws a polygon outline in the Turtle&rsquo;s current colour and thickness, connecting the last <code>n</code> locations that the Turtle has visited.'
  }),
  command({
    names: [ 'POLYGON', 'polygon', 'polygon' ],
    code: pc.pfil,
    parameters: [
      parameter('n', 'integer')
    ],
    category: 2,
    level: 1,
    description: 'Draws a filled polygon in the Turtle&rsquo;s current colour and thickness, connecting the last <code>n</code> locations that the Turtle has visited.'
  }),
  command({
    names: [ 'FORGET', 'forget', 'forget' ],
    code: pc.frgt,
    parameters: [
      parameter('n', 'integer')
    ],
    category: 2,
    level: 1,
    description: 'Makes the Turtle &ldquo;forget&rdquo; the last <code>n</code> points it has visited. Used in conjunction with <code>polyline</code> and <code>polygon</code>.'
  }),
  command({
    names: [ 'REMEMBER', 'remember', 'remember' ],
    code: pc.rmbr,
    category: 2,
    level: 1,
    description: 'Makes the Turtle &ldquo;remember&rdquo; its current location. This is only necessary if its current location was set by a direct assignment of the global variables <code>turtx</code> and <code>turty</code>; when using the standard moving commands, the Turtle automatically remembers where it has been.'
  }),
  command({
    names: [ 'BOX', 'box', 'box' ],
    code: pc.box,
    parameters: [
      parameter('x', 'integer'),
      parameter('y', 'integer'),
      parameter('colour', 'integer'),
      parameter('border', 'boolean')
    ],
    category: 2,
    level: 1,
    description: 'Draws a box of width <code>x</code> and height <code>y</code>, with the top left corner in the Turtle&rsquo;s current location, filled with the specified <code>colour</code>. If <code>border</code> is <code>true</code>, a border is drawn around the box in the Turtle&rsquo;s current colour and and thickness. This is intended to be used with the <code>print</code> command, to provide a box for framing text.'
  }),
  // 3. Other Turtle commands
  command({
    names: [ 'COLOUR', 'colour', 'colour' ],
    code: pc.colr,
    parameters: [
      parameter('colour', 'integer')
    ],
    category: 3,
    level: 0,
    description: 'Sets the <code>colour</code> of the Turtle&rsquo;s pen. Takes as an argument either an RGB value, or one of the Turtle System&rsquo;s fifty predefined colour constants (see the <b>Colours</b> tab). This can also be achieved by direct assignment of the global variable <code>turtc</code>.'
  }),
  command({
    names: [ 'RNDCOL', 'randcol', 'randcol' ],
    code: pc.rndc,
    parameters: [
      parameter('n', 'integer')
    ],
    category: 3,
    level: 0,
    description: 'Assigns a random colour to the Turte&rsquo;s pen, between 1 and <code>n</code> (maximum 50). The colours are taken from the Turtle System&rsquo;s fifty predefined colours, which are each assigned a number between 1 and 50 (see the <b>Colours</b> tab).'
  }),
  command({
    names: [ 'THICKNESS', 'thickness', 'thickness' ],
    code: pc.thik,
    parameters: [
      parameter('thickness', 'integer')
    ],
    category: 3,
    level: 0,
    description: 'Sets the <code>thickness</code> of the Turtle&rsquo;s pen (for line drawing, and outlines of circles, ellipses, boxes, and polygons). This can also be achieved by direct assignment of the global variable <code>turtt</code>.'
  }),
  command({
    names: [ 'PENUP', 'penup', 'penup' ],
    code: pc.pnup,
    category: 3,
    level: 0,
    description: 'Lifts the Turtle&rsquo;s pen, so that subsequent movement will not draw a line on the Canvas.'
  }),
  command({
    names: [ 'PENDOWN', 'pendown', 'pendown' ],
    code: pc.pndn,
    category: 3,
    level: 0,
    description: 'Lowers the Turtle&rsquo;s pen, so that subsequent movement will draw a line on the Canvas.'
  }),
  command({
    names: [ 'OUTPUT', 'output', 'output' ],
    code: pc.outp,
    parameters: [
      parameter('clear', 'boolean'),
      parameter('colour', 'integer'),
      parameter('tofront', 'boolean')
    ],
    category: 3,
    level: 1,
    description: 'Modifies the textual output. If the first argument is <code>true</code>, it clears any existing text. The second argument specifies the background colour, and the third argument is for switching the display. If the third argument is <code>true</code>, it switches to the <b>Output</b> tab, while if it is <code>false</code>, it switches to the <b>Canvas and Console</b> tab.'
  }),
  command({
    names: [ 'CONSOLE', 'console', 'console' ],
    code: pc.cons,
    parameters: [
      parameter('clear', 'boolean'),
      parameter('colour', 'integer')
    ],
    category: 3,
    level: 1,
    description: 'Modifies the Console; if the first argument is <code>true</code>, it clears any existing text, while the second argument specifies the background colour.'
  }),
  command({
    names: [ 'RGB', 'rgb', 'rgb' ],
    code: pc.rgb,
    parameters: [
      parameter('colour', 'integer')
    ],
    returns: 'integer',
    category: 3,
    level: 2,
    description: 'Returns the RGB value of the input <code>colour</code> (an integer between 1 and 50). For example, <code>rgb(red)=255</code>.'
  }),
  command({
    names: [ 'MIXCOLS', 'mixcols', 'mixcols' ],
    code: pc.mixc,
    parameters: [
      parameter('colour1', 'integer'),
      parameter('colour1', 'integer'),
      parameter('proportion1', 'integer'),
      parameter('proportion2', 'integer')
    ],
    returns: 'integer',
    category: 3,
    level: 2,
    description: 'Mixes the given colours in the given proportions.'
  }),
  command({
    names: [ 'NEWTURTLE', 'newturtle', 'newturtle' ],
    code: pc.newt,
    parameters: [
      parameter('array', 'integer', true, 5)
    ],
    category: 3,
    level: 2,
    description: 'Points the Turtle to a custom array in memory (this must be an array of five integers, corresponding to the Turtle&rsquo;s five properties, <code>turtx</code>, <code>turty</code>, <code>turtd</code>, <code>turtt</code>, and <code>turtc</code>). Use repeatedly to simulate multiple Turtles.'
  }),
  command({
    names: [ 'OLDTURTLE', 'oldturtle', 'oldturtle' ],
    code: pc.oldt,
    category: 3,
    level: 2,
    description: 'Points the Turtle back to the default (built-in) array in memory. Use in conjunction with <code>newturtle</code>.'
  }),
  // 4. Canvas operations
  command({
    names: [ 'UPDATE', 'update', 'update' ],
    code: pc.udat,
    category: 4,
    level: 0,
    description: 'Makes the Machine update the Canvas, and continue updating with all subsequent drawing commands. Used in conjunction with <em>noupdate</em>.'
  }),
  command({
    names: [ 'NOUPDATE', 'noupdate', 'noupdate' ],
    code: pc.ndat,
    category: 4,
    level: 0,
    description: 'Makes the Machine refrain from updating the Canvas when executing all subsequent drawing commands, until <em>update</em> is called. Use this to create smooth animations, by queueing up several drawing commands to execute simultaneously.'
  }),
  command({
    names: [ 'BLANK', 'blank', 'blank' ],
    code: pc.blnk,
    parameters: [
      parameter('colour', 'integer')
    ],
    category: 4,
    level: 0,
    description: 'Blanks the entire Canvas with the specified <code>colour</code>.'
  }),
  command({
    names: [ 'CANVAS', 'canvas', 'canvas' ],
    code: pc.canv,
    parameters: [
      parameter('x1', 'integer'),
      parameter('y1', 'integer'),
      parameter('x2', 'integer'),
      parameter('y2', 'integer')
    ],
    category: 4,
    level: 1,
    description: 'Sets the top left Canvas coordinate to <code>(x1,y1)</code>, and the Canvas width and height to <code>x2</code> and <code>y2</code> respectively. Note that the width and height fix the number of virtual points on the Canvas, not the number of actual pixels.'
  }),
  command({
    names: [ 'RESOLUTION', 'resolution', 'resolution' ],
    code: pc.reso,
    parameters: [
      parameter('x', 'integer'),
      parameter('y', 'integer')
    ],
    category: 4,
    level: 1,
    description: 'Sets the Canvas resolution, i.e. the number of actual pixels in the <code>x</code> and <code>y</code> dimensions. To be used in conjunction with the <code>canvas</code> command, typically to set the number of actual pixels equal to the number of virtual points on the Canvas.'
  }),
  command({
    names: [ 'ANGLES', 'angles', 'angles' ],
    code: pc.angl,
    parameters: [
      parameter('degrees', 'integer')
    ],
    category: 4,
    level: 1,
    description: 'Sets the number of <code>degrees</code> in a circle (360 by default).'
  }),
  command({
    names: [ 'PIXSET', 'pixset', 'pixset' ],
    code: pc.pixs,
    parameters: [
      parameter('x', 'integer'),
      parameter('y', 'integer'),
      parameter('colour', 'integer')
    ],
    category: 4,
    level: 2,
    description: 'Sets the <code>colour</code> at point <code>(x,y)</code>.'
  }),
  command({
    names: [ 'PIXCOL', 'pixcol', 'pixcol' ],
    code: pc.pixc,
    parameters: [
      parameter('x', 'integer'),
      parameter('y', 'integer')
    ],
    returns: 'integer',
    category: 4,
    level: 2,
    description: 'Returns the RGB value of the colour at point <code>(x,y)</code>.'
  }),
  command({
    names: [ 'RECOLOUR', 'recolour', 'recolour' ],
    code: pc.rcol,
    parameters: [
      parameter('x', 'integer'),
      parameter('y', 'integer'),
      parameter('colour', 'integer')
    ],
    category: 4,
    level: 2,
    description: 'Floods the Canvas with the specified <code>colour</code>, starting at point <code>(x,y)</code>, until reaching any different colour.'
  }),
  command({
    names: [ 'FILL', 'fill', 'fill' ],
    code: pc.fill,
    parameters: [
      parameter('x', 'integer'),
      parameter('y', 'integer'),
      parameter('colour', 'integer'),
      parameter('boundary', 'integer')
    ],
    category: 4,
    level: 2,
    description: 'Floods the Canvas with the specified <code>colour</code>, starting at point <code>(x,y)</code>, until reaching the <code>boundary</code> colour.'
  }),
  // 5. General arithmetic functions
  command({
    names: [ 'INC', 'inc', 'inc' ],
    code: pc.incr,
    parameters: [
      parameter('variable', 'integer', true)
    ],
    category: 5,
    level: 0,
    description: 'Increments the specified <code>variable</code> by 1.'
  }),
  command({
    names: [ 'DEC', 'dec', 'dec' ],
    code: pc.decr,
    parameters: [
      parameter('variable', 'integer', true)
    ],
    category: 5,
    level: 0,
    description: 'Decrements the specified <code>variable</code> by 1.'
  }),
  command({
    names: [ 'ABS', 'abs', 'abs' ],
    code: pc.abs,
    parameters: [
      parameter('n', 'integer')
    ],
    returns: 'integer',
    category: 5,
    level: 0,
    description: 'Returns the absolute value of <code>n</code>, i.e. <code>n</code> if positive, <code>-n</code> if negative.'
  }),
  command({
    names: [ 'SIGN', 'sign', 'sign' ],
    code: pc.sign,
    parameters: [
      parameter('a', 'integer')
    ],
    returns: 'integer',
    category: 5,
    level: 1,
    description: 'Returns <code>+1</code> if <code>a</code> is positive, <code>-1</code> if <code>a</code> is negative, and <code>0</code> otherwise.'
  }),
  command({
    names: [ 'MAX', 'max', 'max' ],
    code: pc.maxi,
    parameters: [
      parameter('a', 'integer'),
      parameter('b', 'integer')
    ],
    returns: 'integer',
    category: 5,
    level: 1,
    description: 'Returns the maximum of <code>a</code> and <code>b</code>.'
  }),
  command({
    names: [ 'MIN', 'min', 'min' ],
    code: pc.mini,
    parameters: [
      parameter('a', 'integer'),
      parameter('b', 'integer')
    ],
    returns: 'integer',
    category: 5,
    level: 1,
    description: 'Returns the minimum of <code>a</code> and <code>b</code>.'
  }),
  command({
    names: [ 'SQR', 'sqrt', 'sqrt' ],
    code: pc.sqrt,
    parameters: [
      parameter('a', 'integer'),
      parameter('mult', 'integer')
    ],
    returns: 'integer',
    category: 5,
    level: 1,
    description: 'Returns <code>&radic;a</code>, multiplied by <code>mult</code> and rounded to the nearest integer. Use the multiplier to approximate real numbers.'
  }),
  command({
    names: [ 'HYPOT', 'hypot', 'hypot' ],
    code: pc.hyp,
    parameters: [
      parameter('a', 'integer'),
      parameter('b', 'integer'),
      parameter('mult', 'integer')
    ],
    returns: 'integer',
    category: 5,
    level: 1,
    description: 'Returns <code>&radic;(a<sup>2</sup>+b<sup>2</sup>)</code>, multiplied by <code>mult</code> and rounded to the nearest integer. Use the multiplier to approximate real numbers.'
  }),
  command({
    names: [ 'RND', null, null ],
    code: pc.rand,
    parameters: [
      parameter('n', 'integer')
    ],
    returns: 'integer',
    category: 5,
    level: 1,
    description: 'Returns a random integer between 1 and <code>n</code>.'
  }),
  command({
    names: [ null, 'random', null ],
    code: pc.rand,
    parameters: [
      parameter('n', 'integer')
    ],
    returns: 'integer',
    category: 5,
    level: 1,
    description: 'Returns a random non-negative integer less than <code>n</code>.'
  }),
  command({
    names: [ null, null, 'randint' ],
    code: pc.rand,
    parameters: [
      parameter('a', 'integer'),
      parameter('b', 'integer')
    ],
    returns: 'integer',
    category: 5,
    level: 1,
    description: 'Returns a random integer between <code>a</code> and <code>b</code>.'
  }),
  command({
    names: [ 'POWER', 'power', 'power' ],
    code: pc.powr,
    parameters: [
      parameter('a', 'integer'),
      parameter('b', 'integer'),
      parameter('c', 'integer'),
      parameter('mult', 'integer')
    ],
    returns: 'integer',
    category: 5,
    level: 2,
    description: 'Returns <code>(a/b)<sup>c</sup></code>, multiplied by <code>mult</code> and rounded to the nearest integer. Use the multiplier to approximate real numbers.'
  }),
  command({
    names: [ 'ROOT', 'root', 'root' ],
    code: pc.root,
    parameters: [
      parameter('a', 'integer'),
      parameter('b', 'integer'),
      parameter('c', 'integer'),
      parameter('mult', 'integer')
    ],
    returns: 'integer',
    category: 5,
    level: 2,
    description: 'Returns <code><sup>c</sup>&radic;(a/b)</code>, multiplied by <code>mult</code> and rounded to the nearest integer. Use the multiplier to approximate real numbers.'
  }),
  command({
    names: [ 'DIVMULT', 'divmult', 'divmult' ],
    code: pc.divm,
    parameters: [
      parameter('a', 'integer'),
      parameter('b', 'integer'),
      parameter('mult', 'integer')
    ],
    returns: 'integer',
    category: 5,
    level: 2,
    description: 'Returns <code>a/b</code>, multiplied by <code>mult</code> and rounded to the nearest integer. Use the multiplier to approximate real numbers.'
  }),
  command({
    names: [ 'MAXINT', 'maxint', 'maxint' ],
    code: pc.mxin,
    returns: 'integer',
    category: 5,
    level: 2,
    description: 'Returns the maximum integer that the Machine can deal with (2<sup>31</sup>-1).'
  }),
  // 6. Trig / exp / log functions
  command({
    names: [ 'SIN', 'sin', 'sin' ],
    code: pc.sin,
    parameters: [
      parameter('a', 'integer'),
      parameter('b', 'integer'),
      parameter('mult', 'integer')
    ],
    returns: 'integer',
    category: 6,
    level: 1,
    description: 'Returns <code>sin(a/b)</code>, multiplied by <code>mult</code> and rounded to the nearest integer. Use the multiplier to approximate real numbers.'
  }),
  command({
    names: [ 'COS', 'cos', 'cos' ],
    code: pc.cos,
    parameters: [
      parameter('a', 'integer'),
      parameter('b', 'integer'),
      parameter('mult', 'integer')
    ],
    returns: 'integer',
    category: 6,
    level: 1,
    description: 'Returns <code>cos(a/b)</code>, multiplied by <code>mult</code> and rounded to the nearest integer. Use the multiplier to approximate real numbers.'
  }),
  command({
    names: [ 'TAN', 'tan', 'tan' ],
    code: pc.tan,
    parameters: [
      parameter('a', 'integer'),
      parameter('b', 'integer'),
      parameter('mult', 'integer')
    ],
    returns: 'integer',
    category: 6,
    level: 1,
    description: 'Returns <code>tan(a/b)</code>, multiplied by <code>mult</code> and rounded to the nearest integer. Use the multiplier to approximate real numbers.'
  }),
  command({
    names: [ 'PI', 'pi', 'pi' ],
    code: pc.pi,
    parameters: [
      parameter('mult', 'integer')
    ],
    returns: 'integer',
    category: 6,
    level: 1,
    description: 'Returns the value of Pi, multiplied by <code>mult</code> and rounded to the nearest integer. Use the multiplier to approximate real numbers.'
  }),
  command({
    names: [ 'EXP', 'exp', 'exp' ],
    code: pc.exp,
    parameters: [
      parameter('a', 'integer'),
      parameter('b', 'integer'),
      parameter('mult', 'integer')
    ],
    returns: 'integer',
    category: 6,
    level: 1,
    description: 'Returns <code>a<sup>b</sup></code>, multiplied by <code>mult</code> and rounded to the nearest integer. Use the multiplier to approximate real numbers.'
  }),
  command({
    names: [ 'LN', 'ln', 'ln' ],
    code: pc.ln,
    parameters: [
      parameter('a', 'integer'),
      parameter('b', 'integer'),
      parameter('mult', 'integer')
    ],
    returns: 'integer',
    category: 6,
    level: 1,
    description: 'Returns <code>ln(a/b)</code>, multiplied by <code>mult</code> and rounded to the nearest integer. Use the multiplier to approximate real numbers.'
  }),
  command({
    names: [ 'ANTILOG', 'antilog', 'antilog' ],
    code: pc.alog,
    parameters: [
      parameter('a', 'integer'),
      parameter('b', 'integer'),
      parameter('mult', 'integer')
    ],
    returns: 'integer',
    category: 6,
    level: 2,
    description: 'Returns <code>antilog<sub>10</sub>(a/b)</code> - i.e. <code>10<sup>a/b</sub></code> - multiplied by <code>mult</code> and rounded to the nearest integer. Use the multiplier to approximate real numbers.'
  }),
  command({
    names: [ 'LOG10', 'log10', 'log10' ],
    code: pc.log,
    parameters: [
      parameter('a', 'integer'),
      parameter('b', 'integer'),
      parameter('mult', 'integer')
    ],
    returns: 'integer',
    category: 6,
    level: 2,
    description: 'Returns <code>log<sub>10</sub>(a/b)</code>, multiplied by <code>mult</code> and rounded to the nearest integer. Use the multiplier to approximate real numbers.'
  }),
  command({
    names: [ 'ASN', 'arcsin', 'asin' ],
    code: pc.asin,
    parameters: [
      parameter('a', 'integer'),
      parameter('b', 'integer'),
      parameter('mult', 'integer')
    ],
    returns: 'integer',
    category: 6,
    level: 2,
    description: 'Returns <code>arcsin(a/b)</code>, multiplied by <code>mult</code> and rounded to the nearest integer. Use the multiplier to approximate real numbers.'
  }),
  command({
    names: [ 'ACS', 'arccos', 'acos' ],
    code: pc.acos,
    parameters: [
      parameter('a', 'integer'),
      parameter('b', 'integer'),
      parameter('mult', 'integer')
    ],
    returns: 'integer',
    category: 6,
    level: 2,
    description: 'Returns <code>arccos(a/b)</code>, multiplied by <code>mult</code> and rounded to the nearest integer. Use the multiplier to approximate real numbers.'
  }),
  command({
    names: [ 'ATN', 'arctan', 'atan' ],
    code: pc.atan,
    parameters: [
      parameter('a', 'integer'),
      parameter('b', 'integer'),
      parameter('mult', 'integer')
    ],
    returns: 'integer',
    category: 6,
    level: 2,
    description: 'Returns <code>arctan(a/b)</code>, multiplied by <code>mult</code> and rounded to the nearest integer. Use the multiplier to approximate real numbers.'
  }),
  // 7. String operations
  command({
    names: [ 'WRITE', 'write', 'write' ],
    code: pc.text,
    parameters: [
      parameter('string', 'string')
    ],
    category: 7,
    level: 0,
    description: 'Writes the input <code>string</code> to the console and textual output area of the System.'
  }),
  command({
    names: [ 'WRITELN', 'writeln', 'writeline' ],
    code: pc.texl,
    parameters: [
      parameter('string', 'string')
    ],
    category: 7,
    level: 0,
    description: 'Writes the input <code>string</code> to the console and textual output area of the System, followed by a line break.'
  }),
  command({
    names: [ 'PRINT', 'print', 'print' ],
    code: pc.prnt,
    parameters: [
      parameter('string', 'string'),
      parameter('font', 'integer'),
      parameter('size', 'integer')
    ],
    category: 7,
    level: 0,
    description: 'Prints the input <code>string</code> in the Turtle&rsquo;s current colour and at the Turtle&rsquo;s current location, in the specified <code>font</code> and <code>size</code>. Can be used in conjunction with the <code>box</code> drawing command. For a list of available fonts, see the <b>Constants</b> tab.'
  }),
  command({
    names: [ 'UCASE$', 'uppercase', 'upper' ],
    code: pc.uppc,
    parameters: [
      parameter('string', 'string')
    ],
    returns: 'string',
    category: 7,
    level: 1,
    description: 'Returns the input <code>string</code> as all uppercase.'
  }),
  command({
    names: [ 'LCASE$', 'lowercase', 'lower' ],
    code: pc.lowc,
    parameters: [
      parameter('string', 'string')
    ],
    returns: 'string',
    category: 7,
    level: 1,
    description: 'Returns the input <code>string</code> as all lowercase.'
  }),
  command({
    names: [ 'LEN', 'length', 'len' ],
    code: pc.slen,
    parameters: [
      parameter('string', 'string')
    ],
    returns: 'integer',
    category: 7,
    level: 1,
    description: 'Returns the length of the input <code>string</code> (i.e. the number of characters).'
  }),
  command({
    names: [ 'DEL$', 'delete', null ],
    code: pc.dels,
    parameters: [
      parameter('string', 'string'),
      parameter('index', 'integer'),
      parameter('length', 'integer')
    ],
    returns: 'string',
    category: 7,
    level: 2,
    description: 'Returns the input <code>string</code> with some characters removed, starting at the given <code>index</code> and of the specified <code>length</code>.'
  }),
  command({
    names: [ 'LEFT$', null, null ],
    code: pc.lefs,
    parameters: [
      parameter('string', 'string'),
      parameter('length', 'integer')
    ],
    returns: 'string',
    category: 7,
    level: 2,
    description: 'Returns a copy of the characters in the input <code>string</code>, starting on the left and of the specified <code>length</code>.'
  }),
  command({
    names: [ 'MID$', 'copy', 'copy' ],
    code: pc.copy,
    parameters: [
      parameter('string', 'string'),
      parameter('index', 'integer'),
      parameter('length', 'integer')
    ],
    returns: 'string',
    category: 7,
    level: 2,
    description: 'Returns a copy of the characters in the input <code>string</code>, starting at the given <code>index</code> and of the specified <code>length</code>.'
  }),
  command({
    names: [ 'RIGHT$', null, null ],
    code: pc.rgts,
    parameters: [
      parameter('string', 'string'),
      parameter('length', 'integer')
    ],
    returns: 'string',
    category: 7,
    level: 2,
    description: 'Returns a copy of the characters in the input <code>string</code>, starting on the right and of the specified <code>length</code>.'
  }),
  command({
    names: [ 'INS$', null, 'insert' ],
    code: pc.inss,
    parameters: [
      parameter('string', 'string'),
      parameter('index', 'integer'),
      parameter('substr', 'string')
    ],
    returns: 'string',
    category: 7,
    level: 2,
    description: 'Returns the input <code>string</code> with the specified <code>substring</code> inserted at the given <code>index</code>.'
  }),
  command({
    names: [ null, 'insert', null ],
    code: pc.inss,
    parameters: [
      parameter('substr', 'string'),
      parameter('string', 'string'),
      parameter('index', 'integer')
    ],
    returns: 'string',
    category: 7,
    level: 2,
    description: 'Returns the input <code>string</code> with the specified <code>substring</code> inserted at the given <code>index</code>.'
  }),
  command({
    names: [ 'REPLACE', 'replace', 'replace' ],
    code: pc.repl,
    parameters: [
      parameter('string', 'string'),
      parameter('substr', 'string'),
      parameter('replace', 'string'),
      parameter('n', 'integer')
    ],
    returns: 'string',
    category: 7,
    level: 2,
    description: 'Returns the input <code>string</code> with up to <code>n</code> occurences of <code>substring</code> replaced by <code>replace</code>. Set <code>n</code> equal to <code>0</code> to replace every occurence.'
  }),
  command({
    names: [ 'INSTR', null, 'find' ],
    code: pc.poss,
    parameters: [
      parameter('string', 'string'),
      parameter('substr', 'string')
    ],
    returns: 'integer',
    category: 7,
    level: 2,
    description: 'Searches for the input <code>substring</code> within the given <code>string</code>; returns the index of the first character if found, 0 otherwise.'
  }),
  command({
    names: [ null, 'pos', null ],
    code: pc.poss,
    parameters: [
      parameter('substr', 'string'),
      parameter('string', 'string')
    ],
    returns: 'integer',
    category: 7,
    level: 2,
    description: 'Searches for the input <code>substring</code> within the given <code>string</code>; returns the index of the first character if found, 0 otherwise.'
  }),
  // 8. Type conversion routines
  command({
    names: [ 'STR$', 'str', 'str' ],
    code: pc.itos,
    parameters: [
      parameter('n', 'integer')
    ],
    returns: 'string',
    category: 8,
    level: 0,
    description: 'Returns the integer <code>n</code> as a string, e.g. <code>str(12)=\'12\'</code>.'
  }),
  command({
    names: [ 'VAL', 'val', 'integer' ],
    code: pc.svd0,
    parameters: [
      parameter('string', 'string')
    ],
    returns: 'integer',
    category: 8,
    level: 0,
    description: 'Returns the input <code>string</code> as an integer, e.g. <code>val(\'12\')=12</code>. Returns <code>0</code> if the string cannot be converted (i.e. if it is not an integer string).'
  }),
  command({
    names: [ 'VALDEF', 'valdef', 'intdef' ],
    code: pc.sval,
    parameters: [
      parameter('string', 'string'),
      parameter('default', 'string')
    ],
    returns: 'integer',
    category: 8,
    level: 0,
    description: 'Returns the input <code>string</code> as an integer, e.g. <code>val(\'12\')=12</code>. Returns the specified <code>default</code> value if the string cannot be converted (i.e. if it is not an integer string).'
  }),
  command({
    names: [ 'QSTR$', 'qstr', 'qstr' ],
    code: pc.qtos,
    parameters: [
      parameter('a', 'integer'),
      parameter('b', 'integer'),
      parameter('decplaces', 'integer')
    ],
    returns: 'string',
    category: 8,
    level: 1,
    description: 'Returns the value of <code>a/b</code> to the specified number of decimal places, as a decimal string, e.g. <code>qstr(2,3,4)=\'0.6667\'</code>.'
  }),
  command({
    names: [ 'QVAL', 'qval', 'qval' ],
    code: pc.qval,
    parameters: [
      parameter('string', 'string'),
      parameter('mult', 'integer'),
      parameter('default', 'integer')
    ],
    returns: 'integer',
    category: 8,
    level: 1,
    description: 'Returns the input decimal <code>string</code> as an integer, multiplied by <code>mult</code> and rounded to the nearest integer, e.g. <code>qval(\'1.5\',10)=15</code>. Returns the specified <code>default</code> value if the string cannot be converted (i.e. if it is not a decimal string).'
  }),
  command({
    names: [ 'CHR$', 'chr', 'chr' ],
    code: pc.null,
    parameters: [
      parameter('n', 'integer')
    ],
    returns: 'char',
    category: 8,
    level: 2,
    description: 'Returns the character with ASCII character code <code>n</code>, e.g. <code>chr(65)=\'A\'</code>.'
  }),
  command({
    names: [ 'ASC', 'ord', 'ord' ],
    code: pc.null,
    parameters: [
      parameter('char', 'char')
    ],
    returns: 'integer',
    category: 8,
    level: 2,
    description: 'Returns the ASCII code of the input character <code>char</code> (which must be a string of length 1), e.g. <code>ord(\'A\')=65</code>.'
  }),
  command({
    names: [ 'BOOLINT', 'boolint', null ],
    code: pc.null,
    parameters: [
      parameter('boolean', 'boolean')
    ],
    returns: 'integer',
    category: 8,
    level: 2,
    description: 'Returns the input <code>boolean</code> as an integer (-1 for <code>true</code>, 0 for <code>false</code>).'
  }),
  command({
    names: [ null, null, 'boolint' ],
    code: pc.bool,
    parameters: [
      parameter('boolean', 'boolean')
    ],
    returns: 'integer',
    category: 8,
    level: 2,
    description: 'Returns the input <code>boolean</code> as an integer (1 for <code>true</code>, 0 for <code>false</code>).'
  }),
  command({
    names: [ 'HEX$', 'hexstr', 'hex' ],
    code: pc.hexs,
    parameters: [
      parameter('n', 'integer'),
      parameter('minlength', 'integer')
    ],
    category: 8,
    level: 2,
    description: 'Returns a string representation of integer <code>n</code> in hexadecimal format, padded with leading zeros as up to <code>minlength</code>, e.g. <code>hexstr(255,6)=\'0000FF\'</code>.'
  }),
  // 9. Input and timing routines
  command({
    names: [ 'PAUSE', 'pause', 'pause' ],
    code: pc.wait,
    parameters: [
      parameter('m', 'integer')
    ],
    category: 9,
    level: 0,
    description: 'Makes the Turtle Machine wait <code>m</code> milliseconds before performing the next operation. This is useful for controlling the speed of animations.'
  }),
  command({
    names: [ 'GETLINE$', 'readln', 'readline' ],
    code: pc.rdln,
    returns: 'string',
    category: 9,
    level: 0,
    description: 'Waits for the RETURN key to be pressed, then returns everything in the keybuffer up to (and not including) the new line character.'
  }),
  command({
    names: [ 'INPUT$', null, 'input' ],
    code: pc.ilin,
    parameters: [
      parameter('prompt', 'string')
    ],
    returns: 'string',
    category: 9,
    level: 0,
    description: 'Gives an input prompt, then returns the input when the RETURN key is pressed (using the keybuffer).'
  }),
  command({
    names: [ 'CURSOR', 'cursor', 'cursor' ],
    code: pc.curs,
    parameters: [
      parameter('cursorcode', 'integer')
    ],
    category: 9,
    level: 1,
    description: 'Sets which cursor to display (1-15) when the mouse pointer is over the canvas. 0 hides the cursor; any value outside the range 0-15 resets the default cursor. For a list of available cursors, see the <b>Cursors</b> tab.'
  }),
  command({
    names: [ 'KEYECHO', 'keyecho', 'keyecho' ],
    code: pc.kech,
    parameters: [
      parameter('on', 'boolean')
    ],
    category: 9,
    level: 1,
    description: 'Turns the keyboard echo to the console on (<code>true</code>) or off (<code>false</code>).'
  }),
  command({
    names: [ 'DETECT', 'detect', 'detect' ],
    code: pc.tdet,
    parameters: [
      parameter('keycode', 'integer'),
      parameter('m', 'integer')
    ],
    returns: 'boolean',
    category: 9,
    level: 1,
    description: 'Waits a maximum of <code>m</code> milliseconds for the key with the specified <code>keycode</code> to be pressed; returns <code>true</code> if pressed (and stops waiting), <code>false</code> otherwise.'
  }),
  command({
    names: [ 'GET$', 'read', 'read' ],
    code: pc.read,
    parameters: [
      parameter('n', 'integer')
    ],
    returns: 'string',
    category: 9,
    level: 1,
    description: 'Returns the first <code>n</code> characters from the keybuffer as a string.'
  }),
  command({
    names: [ 'TIME', 'time', 'time' ],
    code: pc.time,
    returns: 'integer',
    category: 9,
    level: 1,
    description: 'Returns the time (in milliseconds) since the program began.'
  }),
  command({
    names: [ 'TIMESET', 'timeset', 'timeset' ],
    code: pc.tset,
    parameters: [
      parameter('m', 'integer')
    ],
    category: 9,
    level: 1,
    description: 'Artificially sets the time since the program began to <code>m</code> milliseconds.'
  }),
  command({
    names: [ 'RESET', 'reset', 'reset' ],
    code: pc.iclr,
    parameters: [
      parameter('?input', 'integer')
    ],
    category: 9,
    level: 2,
    description: 'Resets the specified <code>?input</code> (<code>?mousex</code>, <code>?mousey</code>, <code>?click</code>, etc.) to its initial value (i.e. -1).'
  }),
  command({
    names: [ 'KEYSTATUS', 'keystatus', 'keystatus' ],
    code: pc.inpt,
    parameters: [
      parameter('keycode', 'integer')
    ],
    returns: 'integer',
    category: 9,
    level: 2,
    description: 'Returns the <code>?kshift</code> value for the most recent press of the key with the specified <code>keycode</code>.'
  }),
  command({
    names: [ 'KEYBUFFER', 'keybuffer', 'keybuffer' ],
    code: pc.bufr,
    parameters: [
      parameter('n', 'integer')
    ],
    category: 9,
    level: 2,
    description: 'Creates a new custom keybuffer of length <code>n</code>. A keybuffer of length 32 is available by default; use this command if you need a larger buffer.'
  }),
  // 10. Turtle Machine monitoring
  command({
    names: [ 'HALT', 'halt', 'halt' ],
    code: pc.halt,
    category: 10,
    level: 0,
    description: 'Halts the program.'
  }),
  command({
    names: [ 'TRACE', 'trace', 'trace' ],
    code: pc.trac,
    parameters: [
      parameter('on', 'boolean')
    ],
    category: 10,
    level: 2,
    description: 'Turns the PCode trace facility on (<code>true</code>) or off (<code>false</code>).'
  }),
  command({
    names: [ 'WATCH', 'watch', 'watch' ],
    code: pc.memw,
    parameters: [
      parameter('address', 'integer')
    ],
    category: 10,
    level: 2,
    description: 'Sets an <code>address</code> in memory for the trace facility to watch.'
  }),
  command({
    names: [ 'DUMP', 'dump', 'dump' ],
    code: pc.dump,
    category: 10,
    level: 2,
    description: '&ldquo;Dumps&rdquo; the current memory state into the display in the memory tab.'
  }),
  command({
    names: [ 'HEAPRESET', 'heapreset', 'heapreset' ],
    code: pc.hrst,
    category: 10,
    level: 2,
    description: 'Resets the memory heap to the initial global value.'
  })
])

export const categories = [
  category(0, 'Turtle: relative movement', commands.filter((x) => x.category === 0)),
  category(1, 'Turtle: absolute movement', commands.filter((x) => x.category === 1)),
  category(2, 'Turtle: drawing shapes', commands.filter((x) => x.category === 2)),
  category(3, 'Other Turtle commands', commands.filter((x) => x.category === 3)),
  category(4, 'Canvas operations', commands.filter((x) => x.category === 4)),
  category(5, 'General arithmetic functions', commands.filter((x) => x.category === 5)),
  category(6, 'Trig / exp / log functions', commands.filter((x) => x.category === 6)),
  category(7, 'String operations', commands.filter((x) => x.category === 7)),
  category(8, 'Type conversion routines', commands.filter((x) => x.category === 8)),
  category(9, 'Input and timing routines', commands.filter((x) => x.category === 9)),
  category(10, 'Turtle Machine monitoring', commands.filter((x) => x.category === 10))
]

export const usage = categories.concat(
  {
    title: 'Command structures',
    expressions: [
      expression(['IF', 'if', 'if'], 0),
      expression(['ELSE', 'else', 'else'], 0),
      expression(['FOR', 'for', 'for'], 0),
      expression(['REPEAT', 'repeat', 'repeat'], 1),
      expression(['WHILE', 'while', 'while'], 1),
      expression(['DEF', null, 'def'], 1),
      expression([null, 'procedure', null], 1),
      expression([null, 'function', null], 2)
    ]
  },
  {
    title: 'Variable scope modifiers',
    expressions: [
      expression(['LOCAL', null, null], 1),
      expression(['PRIVATE', null, null], 2),
      expression([null, null, 'global'], 1),
      expression([null, null, 'nonlocal'], 2)
    ]
  }
)
