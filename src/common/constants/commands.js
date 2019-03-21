/*
An array of commands. Used by the compiler, the usage analyser, and the help component.
*/
import pc from './pc'

export default [
  // 0. Turtle: relative movement
  {
    names: { BASIC: 'FORWARD', Pascal: 'forward', Python: 'forward' },
    code: pc.fwrd,
    parameters: [
      { name: 'n', type: 'integer', byref: false, length: 1 }
    ],
    category: 0,
    level: 0,
    description: 'Moves the Turtle forward <code>n</code> units, drawing as it goes (unless the pen is up).'
  },
  {
    names: { BASIC: 'BACK', Pascal: 'back', Python: 'back' },
    code: pc.back,
    parameters: [
      { name: 'n', type: 'integer', byref: false, length: 1 }
    ],
    category: 0,
    level: 0,
    description: 'Moves the Turtle back <code>n</code> units, drawing as it goes (unless the pen is up).'
  },
  {
    names: { BASIC: 'LEFT', Pascal: 'left', Python: 'left' },
    code: pc.left,
    parameters: [
      { name: 'n', type: 'integer', byref: false, length: 1 }
    ],
    category: 0,
    level: 0,
    description: 'Rotates the Turtle left by <code>n</code> degrees.'
  },
  {
    names: { BASIC: 'RIGHT', Pascal: 'right', Python: 'right' },
    code: pc.rght,
    parameters: [
      { name: 'n', type: 'integer', byref: false, length: 1 }
    ],
    category: 0,
    level: 0,
    description: 'Rotates the Turtle right by <code>n</code> degrees.'
  },
  {
    names: { BASIC: 'DRAWXY', Pascal: 'drawxy', Python: 'drawxy' },
    code: pc.drxy,
    parameters: [
      { name: 'x', type: 'integer', byref: false, length: 1 },
      { name: 'y', type: 'integer', byref: false, length: 1 }
    ],
    category: 0,
    level: 1,
    description: 'Moves the Turtle in a straight line to a point <code>x</code> units away along the x-axis and <code>y</code> units away along the y-axis, drawing as it goes (unless the pen is up).'
  },
  {
    names: { BASIC: 'MOVEXY', Pascal: 'movexy', Python: 'movexy' },
    code: pc.mvxy,
    parameters: [
      { name: 'x', type: 'integer', byref: false, length: 1 },
      { name: 'y', type: 'integer', byref: false, length: 1 }
    ],
    category: 0,
    level: 1,
    description: 'Moves the Turtle in a straight line to a point <code>x</code> units away along the x-axis and <code>y</code> units away along the y-axis, <em>without</em> drawing (regardless of the current pen status).'
  },
  // 1. Turtle: absolute movement
  {
    names: { BASIC: 'HOME', Pascal: 'home', Python: 'home' },
    code: pc.home,
    parameters: [],
    category: 1,
    level: 0,
    description: 'Moves the Turtle back to its starting position in the centre of the canvas, facing north, drawing as it goes (unless the pen is up).'
  },
  {
    names: { BASIC: 'SETX', Pascal: 'setx', Python: 'setx' },
    code: pc.setx,
    parameters: [
      { name: 'x', type: 'integer', byref: false, length: 1 }
    ],
    category: 1,
    level: 0,
    description: 'Sets the Turtle&rsquo;s <code>x</code> coordinate directly (without movement or drawing on the canvas). This can also be achieved by direct assignment of the global variable <code>turtx</code>.'
  },
  {
    names: { BASIC: 'SETY', Pascal: 'sety', Python: 'sety' },
    code: pc.sety,
    parameters: [
      { name: 'y', type: 'integer', byref: false, length: 1 }
    ],
    category: 1,
    level: 0,
    description: 'Sets the Turtle&rsquo;s <code>y</code> coordinate directly (without movement or drawing on the canvas). This can also be achieved by direct assignment of the global variable <code>turty</code>.'
  },
  {
    names: { BASIC: 'SETXY', Pascal: 'setxy', Python: 'setxy' },
    code: pc.toxy,
    parameters: [
      { name: 'x', type: 'integer', byref: false, length: 1 },
      { name: 'y', type: 'integer', byref: false, length: 1 }
    ],
    category: 1,
    level: 0,
    description: 'Sets the Turtle&rsquo;s <code>x</code> and <code>y</code> coordinates directly (without movement or drawing on the canvas). This can also be achieved by direct assingment of the global variables <code>turtx</code> and <code>turty</code>.'
  },
  {
    names: { BASIC: 'DIRECTION', Pascal: 'direction', Python: 'direction' },
    code: pc.setd,
    parameters: [
      { name: 'n', type: 'integer', byref: false, length: 1 }
    ],
    category: 1,
    level: 0,
    description: 'Sets the Turtle&rsquo;s direction to <code>n</code> degrees (0 for north, 90 for east, 180 for south, 270 for west). This can also be achieved by direct assignment of the global variable <code>turtd</code>. Note that the number of degrees in a circle (360 by default) can be changed with the <code>angles</code> command.'
  },
  {
    names: { BASIC: 'TURNXY', Pascal: 'turnxy', Python: 'turnxy' },
    code: pc.turn,
    parameters: [
      { name: 'x', type: 'integer', byref: false, length: 1 },
      { name: 'y', type: 'integer', byref: false, length: 1 }
    ],
    category: 1,
    level: 1,
    description: 'Turns the Turtle to face the point <code>x</code> units away alongthe x-axis and <code>y</code> units away along the y-axis.'
  },
  // 2. Turtle: shape drawing
  {
    names: { BASIC: 'CIRCLE', Pascal: 'circle', Python: 'circle' },
    code: pc.circ,
    parameters: [
      { name: 'radius', type: 'integer', byref: false, length: 1 }
    ],
    category: 2,
    level: 0,
    description: 'Draws a circle outline in the Turtle&rsquo;s current colour and thickness, of the given <code>radius</code>, centred on the Turtle&rsquo;s current location.'
  },
  {
    names: { BASIC: 'BLOT', Pascal: 'blot', Python: 'blot' },
    code: pc.blot,
    parameters: [
      { name: 'radius', type: 'integer', byref: false, length: 1 }
    ],
    category: 2,
    level: 0,
    description: 'Draws a filled circle in the Turtle&rsquo;s current colour, of the given <code>radius</code>, centred on the Turtle&rsquo;s current location.'
  },
  {
    names: { BASIC: 'ELLIPSE', Pascal: 'ellipse', Python: 'ellipse' },
    code: pc.elps,
    parameters: [
      { name: 'Xradius', type: 'integer', byref: false, length: 1 },
      { name: 'Yradius', type: 'integer', byref: false, length: 1 }
    ],
    category: 2,
    level: 0,
    description: 'Draws an ellipse outline in the Turtle&rsquo;s current colour and thickness, of the given <code>Xradius</code> and <code>Yradius</code>, centred on the Turtle&rsquo;s current location.'
  },
  {
    names: { BASIC: 'ELLBLOT', Pascal: 'ellblot', Python: 'ellblot' },
    code: pc.eblt,
    parameters: [
      { name: 'Xradius', type: 'integer', byref: false, length: 1 },
      { name: 'Yradius', type: 'integer', byref: false, length: 1 }
    ],
    category: 2,
    level: 0,
    description: 'Draws a filled ellipse in the Turtle&rsquo;s current colour, of the given <code>Xradius</code> and <code>Yradius</code>, centred on the Turtle&rsquo;s current location.'
  },
  {
    names: { BASIC: 'POLYLINE', Pascal: 'polyline', Python: 'polyline' },
    code: pc.poly,
    parameters: [
      { name: 'n', type: 'integer', byref: false, length: 1 }
    ],
    category: 2,
    level: 1,
    description: 'Draws a polygon outline in the Turtle&rsquo;s current colour and thickness, connecting the last <code>n</code> locations that the Turtle has visited.'
  },
  {
    names: { BASIC: 'POLYGON', Pascal: 'polygon', Python: 'polygon' },
    code: pc.pfil,
    parameters: [
      { name: 'n', type: 'integer', byref: false, length: 1 }
    ],
    category: 2,
    level: 1,
    description: 'Draws a filled polygon in the Turtle&rsquo;s current colour and thickness, connecting the last <code>n</code> locations that the Turtle has visited.'
  },
  {
    names: { BASIC: 'FORGET', Pascal: 'forget', Python: 'forget' },
    code: pc.frgt,
    parameters: [
      { name: 'n', type: 'integer', byref: false, length: 1 }
    ],
    category: 2,
    level: 1,
    description: 'Makes the Turtle &ldquo;forget&rdquo; the last <code>n</code> points it has visited. Used in conjunction with <code>polyline</code> and <code>polygon</code>.'
  },
  {
    names: { BASIC: 'REMEMBER', Pascal: 'remember', Python: 'remember' },
    code: pc.rmbr,
    parameters: [],
    category: 2,
    level: 1,
    description: 'Makes the Turtle &ldquo;remember&rdquo; its current location. This is only necessary if its current location was set by a direct assignment of the global variables <code>turtx</code> and <code>turty</code>; when using the standard moving commands, the Turtle automatically remembers where it has been.'
  },
  {
    names: { BASIC: 'BOX', Pascal: 'box', Python: 'box' },
    code: pc.box,
    parameters: [
      { name: 'x', type: 'integer', byref: false, length: 1 },
      { name: 'y', type: 'integer', byref: false, length: 1 },
      { name: 'colour', type: 'integer', byref: false, length: 1 },
      { name: 'border', type: 'boolean', byref: false, length: 1 }
    ],
    category: 2,
    level: 1,
    description: 'Draws a box of width <code>x</code> and height <code>y</code>, with the top left corner in the Turtle&rsquo;s current location, filled with the specified <code>colour</code>. If <code>border</code> is <code>true</code>, a border is drawn around the box in the Turtle&rsquo;s current colour and and thickness. This is intended to be used with the <code>print</code> command, to provide a box for framing text.'
  },
  // 3. Other Turtle commands
  {
    names: { BASIC: 'COLOUR', Pascal: 'colour', Python: 'colour' },
    code: pc.colr,
    parameters: [
      { name: 'colour', type: 'integer', byref: false, length: 1 }
    ],
    category: 3,
    level: 0,
    description: 'Sets the <code>colour</code> of the Turtle&rsquo;s pen. Takes as an argument either an RGB value, or one of the Turtle System&rsquo;s fifty predefined colour constants (see the <b>Colours</b> tab). This can also be achieved by direct assignment of the global variable <code>turtc</code>.'
  },
  {
    names: { BASIC: 'RNDCOL', Pascal: 'randcol', Python: 'randcol' },
    code: pc.rndc,
    parameters: [
      { name: 'n', type: 'integer', byref: false, length: 1 }
    ],
    category: 3,
    level: 0,
    description: 'Assigns a random colour to the Turte&rsquo;s pen, between 1 and <code>n</code> (maximum 50). The colours are taken from the Turtle System&rsquo;s fifty predefined colours, which are each assigned a number between 1 and 50 (see the <b>Colours</b> tab).'
  },
  {
    names: { BASIC: 'THICKNESS', Pascal: 'thickness', Python: 'thickness' },
    code: pc.thik,
    parameters: [
      { name: 'thickness', type: 'integer', byref: false, length: 1 }
    ],
    category: 3,
    level: 0,
    description: 'Sets the <code>thickness</code> of the Turtle&rsquo;s pen (for line drawing, and outlines of circles, ellipses, boxes, and polygons). This can also be achieved by direct assignment of the global variable <code>turtt</code>.'
  },
  {
    names: { BASIC: 'PENUP', Pascal: 'penup', Python: 'penup' },
    code: pc.pnup,
    parameters: [],
    category: 3,
    level: 0,
    description: 'Lifts the Turtle&rsquo;s pen, so that subsequent movement will not draw a line on the Canvas.'
  },
  {
    names: { BASIC: 'PENDOWN', Pascal: 'pendown', Python: 'pendown' },
    code: pc.pndn,
    parameters: [],
    category: 3,
    level: 0,
    description: 'Lowers the Turtle&rsquo;s pen, so that subsequent movement will draw a line on the Canvas.'
  },
  {
    names: { BASIC: 'OUTPUT', Pascal: 'output', Python: 'output' },
    code: pc.outp,
    parameters: [
      { name: 'clear', type: 'boolean', byref: false, length: 1 },
      { name: 'colour', type: 'integer', byref: false, length: 1 },
      { name: 'tofront', type: 'boolean', byref: false, length: 1 }
    ],
    category: 3,
    level: 1,
    description: 'Modifies the textual output. If the first argument is <code>true</code>, it clears any existing text. The second argument specifies the background colour, and the third argument is for switching the display. If the third argument is <code>true</code>, it switches to the <b>Output</b> tab, while if it is <code>false</code>, it switches to the <b>Canvas and Console</b> tab.'
  },
  {
    names: { BASIC: 'CONSOLE', Pascal: 'console', Python: 'console' },
    code: pc.cons,
    parameters: [
      { name: 'clear', type: 'boolean', byref: false, length: 1 },
      { name: 'colour', type: 'integer', byref: false, length: 1 }
    ],
    category: 3,
    level: 1,
    description: 'Modifies the Console; if the first argument is <code>true</code>, it clears any existing text, while the second argument specifies the background colour.'
  },
  {
    names: { BASIC: 'RGB', Pascal: 'rgb', Python: 'rgb' },
    code: pc.rgb,
    parameters: [
      { name: 'colour', type: 'integer', byref: false, length: 1 }
    ],
    returns: 'integer',
    category: 3,
    level: 2,
    description: 'Returns the RGB value of the input <code>colour</code> (an integer between 1 and 50). For example, <code>rgb(red)=255</code>.'
  },
  {
    names: { BASIC: 'MIXCOLS', Pascal: 'mixcols', Python: 'mixcols' },
    code: pc.mixc,
    parameters: [
      { name: 'colour1', type: 'integer', byref: false, length: 1 },
      { name: 'colour1', type: 'integer', byref: false, length: 1 },
      { name: 'proportion1', type: 'integer', byref: false, length: 1 },
      { name: 'proportion2', type: 'integer', byref: false, length: 1 }
    ],
    returns: 'integer',
    category: 3,
    level: 2,
    description: 'Mixes the given colours in the given proportions.'
  },
  {
    names: { BASIC: 'NEWTURTLE', Pascal: 'newturtle', Python: 'newturtle' },
    code: pc.newt,
    parameters: [
      { name: 'array', type: 'integer', byref: true, length: 5 }
    ],
    category: 3,
    level: 2,
    description: 'Points the Turtle to a custom array in memory (this must be an array of five integers, corresponding to the Turtle&rsquo;s five properties, <code>turtx</code>, <code>turty</code>, <code>turtd</code>, <code>turtt</code>, and <code>turtc</code>). Use repeatedly to simulate multiple Turtles.'
  },
  {
    names: { BASIC: 'OLDTURTLE', Pascal: 'oldturtle', Python: 'oldturtle' },
    code: pc.oldt,
    parameters: [],
    category: 3,
    level: 2,
    description: 'Points the Turtle back to the default (built-in) array in memory. Use in conjunction with <code>newturtle</code>.'
  },
  // 4. Canvas operations
  {
    names: { BASIC: 'UPDATE', Pascal: 'update', Python: 'update' },
    code: pc.udat,
    parameters: [],
    category: 4,
    level: 0,
    description: 'Makes the Machine update the Canvas, and continue updating with all subsequent drawing commands. Used in conjunction with <em>noupdate</em>.'
  },
  {
    names: { BASIC: 'NOUPDATE', Pascal: 'noupdate', Python: 'noupdate' },
    code: pc.ndat,
    parameters: [],
    category: 4,
    level: 0,
    description: 'Makes the Machine refrain from updating the Canvas when executing all subsequent drawing commands, until <em>update</em> is called. Use this to create smooth animations, by queueing up several drawing commands to execute simultaneously.'
  },
  {
    names: { BASIC: 'BLANK', Pascal: 'blank', Python: 'blank' },
    code: pc.blnk,
    parameters: [
      { name: 'colour', type: 'integer', byref: false, length: 1 }
    ],
    category: 4,
    level: 0,
    description: 'Blanks the entire Canvas with the specified <code>colour</code>.'
  },
  {
    names: { BASIC: 'CANVAS', Pascal: 'canvas', Python: 'canvas' },
    code: pc.canv,
    parameters: [
      { name: 'x1', type: 'integer', byref: false, length: 1 },
      { name: 'y1', type: 'integer', byref: false, length: 1 },
      { name: 'x2', type: 'integer', byref: false, length: 1 },
      { name: 'y2', type: 'integer', byref: false, length: 1 }
    ],
    category: 4,
    level: 1,
    description: 'Sets the top left Canvas coordinate to <code>(x1,y1)</code>, and the Canvas width and height to <code>x2</code> and <code>y2</code> respectively. Note that the width and height fix the number of virtual points on the Canvas, not the number of actual pixels.'
  },
  {
    names: { BASIC: 'RESOLUTION', Pascal: 'resolution', Python: 'resolution' },
    code: pc.reso,
    parameters: [
      { name: 'x', type: 'integer', byref: false, length: 1 },
      { name: 'y', type: 'integer', byref: false, length: 1 }
    ],
    category: 4,
    level: 1,
    description: 'Sets the Canvas resolution, i.e. the number of actual pixels in the <code>x</code> and <code>y</code> dimensions. To be used in conjunction with the <code>canvas</code> command, typically to set the number of actual pixels equal to the number of virtual points on the Canvas.'
  },
  {
    names: { BASIC: 'ANGLES', Pascal: 'angles', Python: 'angles' },
    code: pc.angl,
    parameters: [
      { name: 'degrees', type: 'integer', byref: false, length: 1 }
    ],
    category: 4,
    level: 1,
    description: 'Sets the number of <code>degrees</code> in a circle (360 by default).'
  },
  {
    names: { BASIC: 'PIXSET', Pascal: 'pixset', Python: 'pixset' },
    code: pc.pixs,
    parameters: [
      { name: 'x', type: 'integer', byref: false, length: 1 },
      { name: 'y', type: 'integer', byref: false, length: 1 },
      { name: 'colour', type: 'integer', byref: false, length: 1 }
    ],
    category: 4,
    level: 2,
    description: 'Sets the <code>colour</code> at point <code>(x,y)</code>.'
  },
  {
    names: { BASIC: 'PIXCOL', Pascal: 'pixcol', Python: 'pixcol' },
    code: pc.pixc,
    parameters: [
      { name: 'x', type: 'integer', byref: false, length: 1 },
      { name: 'y', type: 'integer', byref: false, length: 1 }
    ],
    returns: 'integer',
    category: 4,
    level: 2,
    description: 'Returns the RGB value of the colour at point <code>(x,y)</code>.'
  },
  {
    names: { BASIC: 'RECOLOUR', Pascal: 'recolour', Python: 'recolour' },
    code: pc.rcol,
    parameters: [
      { name: 'x', type: 'integer', byref: false, length: 1 },
      { name: 'y', type: 'integer', byref: false, length: 1 },
      { name: 'colour', type: 'integer', byref: false, length: 1 }
    ],
    category: 4,
    level: 2,
    description: 'Floods the Canvas with the specified <code>colour</code>, starting at point <code>(x,y)</code>, until reaching any different colour.'
  },
  {
    names: { BASIC: 'FILL', Pascal: 'fill', Python: 'fill' },
    code: pc.fill,
    parameters: [
      { name: 'x', type: 'integer', byref: false, length: 1 },
      { name: 'y', type: 'integer', byref: false, length: 1 },
      { name: 'colour', type: 'integer', byref: false, length: 1 },
      { name: 'boundary', type: 'integer', byref: false, length: 1 }
    ],
    category: 4,
    level: 2,
    description: 'Floods the Canvas with the specified <code>colour</code>, starting at point <code>(x,y)</code>, until reaching the <code>boundary</code> colour.'
  },
  // 5. General arithmetic functions
  {
    names: { BASIC: 'INC', Pascal: 'inc', Python: 'inc' },
    code: pc.incr,
    parameters: [
      { name: 'variable', type: 'integer', byref: true, length: 1 }
    ],
    category: 5,
    level: 0,
    description: 'Increments the specified <code>variable</code> by 1.'
  },
  {
    names: { BASIC: 'DEC', Pascal: 'dec', Python: 'dec' },
    code: pc.decr,
    parameters: [
      { name: 'variable', type: 'integer', byref: true, length: 1 }
    ],
    category: 5,
    level: 0,
    description: 'Decrements the specified <code>variable</code> by 1.'
  },
  {
    names: { BASIC: 'ABS', Pascal: 'abs', Python: 'abs' },
    code: pc.abs,
    parameters: [
      { name: 'n', type: 'integer', byref: false, length: 1 }
    ],
    returns: 'integer',
    category: 5,
    level: 0,
    description: 'Returns the absolute value of <code>n</code>, i.e. <code>n</code> if positive, <code>-n</code> if negative.'
  },
  {
    names: { BASIC: 'SGN', Pascal: 'sign', Python: 'sign' },
    code: pc.sign,
    parameters: [
      { name: 'a', type: 'integer', byref: false, length: 1 }
    ],
    returns: 'integer',
    category: 5,
    level: 1,
    description: 'Returns <code>+1</code> if <code>a</code> is positive, <code>-1</code> if <code>a</code> is negative, and <code>0</code> otherwise.'
  },
  {
    names: { BASIC: 'MAX', Pascal: 'max', Python: 'max' },
    code: pc.maxi,
    parameters: [
      { name: 'a', type: 'integer', byref: false, length: 1 },
      { name: 'b', type: 'integer', byref: false, length: 1 }
    ],
    returns: 'integer',
    category: 5,
    level: 1,
    description: 'Returns the maximum of <code>a</code> and <code>b</code>.'
  },
  {
    names: { BASIC: 'MIN', Pascal: 'min', Python: 'min' },
    code: pc.mini,
    parameters: [
      { name: 'a', type: 'integer', byref: false, length: 1 },
      { name: 'b', type: 'integer', byref: false, length: 1 }
    ],
    returns: 'integer',
    category: 5,
    level: 1,
    description: 'Returns the minimum of <code>a</code> and <code>b</code>.'
  },
  {
    names: { BASIC: 'SQR', Pascal: 'sqrt', Python: 'sqrt' },
    code: pc.sqrt,
    parameters: [
      { name: 'a', type: 'integer', byref: false, length: 1 },
      { name: 'mult', type: 'integer', byref: false, length: 1 }
    ],
    returns: 'integer',
    category: 5,
    level: 1,
    description: 'Returns <code>&radic;a</code>, multiplied by <code>mult</code> and rounded to the nearest integer. Use the multiplier to approximate real numbers.'
  },
  {
    names: { BASIC: 'HYPOT', Pascal: 'hypot', Python: 'hypot' },
    code: pc.hyp,
    parameters: [
      { name: 'a', type: 'integer', byref: false, length: 1 },
      { name: 'b', type: 'integer', byref: false, length: 1 },
      { name: 'mult', type: 'integer', byref: false, length: 1 }
    ],
    returns: 'integer',
    category: 5,
    level: 1,
    description: 'Returns <code>&radic;(a<sup>2</sup>+b<sup>2</sup>)</code>, multiplied by <code>mult</code> and rounded to the nearest integer. Use the multiplier to approximate real numbers.'
  },
  {
    names: { BASIC: 'RND', Pascal: null, Python: null },
    code: pc.rand,
    parameters: [
      { name: 'n', type: 'integer', byref: false, length: 1 }
    ],
    returns: 'integer',
    category: 5,
    level: 1,
    description: 'Returns a random integer between 1 and <code>n</code>.'
  },
  {
    names: { BASIC: null, Pascal: 'random', Python: null },
    code: pc.rand,
    parameters: [
      { name: 'n', type: 'integer', byref: false, length: 1 }
    ],
    returns: 'integer',
    category: 5,
    level: 1,
    description: 'Returns a random non-negative integer less than <code>n</code>.'
  },
  {
    names: { BASIC: null, Pascal: null, Python: 'randint' },
    code: pc.rand,
    parameters: [
      { name: 'a', type: 'integer', byref: false, length: 1 },
      { name: 'b', type: 'integer', byref: false, length: 1 }
    ],
    returns: 'integer',
    category: 5,
    level: 1,
    description: 'Returns a random integer between <code>a</code> and <code>b</code>.'
  },
  {
    names: { BASIC: 'POWER', Pascal: 'power', Python: 'power' },
    code: pc.powr,
    parameters: [
      { name: 'a', type: 'integer', byref: false, length: 1 },
      { name: 'b', type: 'integer', byref: false, length: 1 },
      { name: 'c', type: 'integer', byref: false, length: 1 },
      { name: 'mult', type: 'integer', byref: false, length: 1 }
    ],
    returns: 'integer',
    category: 5,
    level: 2,
    description: 'Returns <code>(a/b)<sup>c</sup></code>, multiplied by <code>mult</code> and rounded to the nearest integer. Use the multiplier to approximate real numbers.'
  },
  {
    names: { BASIC: 'ROOT', Pascal: 'root', Python: 'root' },
    code: pc.root,
    parameters: [
      { name: 'a', type: 'integer', byref: false, length: 1 },
      { name: 'b', type: 'integer', byref: false, length: 1 },
      { name: 'c', type: 'integer', byref: false, length: 1 },
      { name: 'mult', type: 'integer', byref: false, length: 1 }
    ],
    returns: 'integer',
    category: 5,
    level: 2,
    description: 'Returns <code><sup>c</sup>&radic;(a/b)</code>, multiplied by <code>mult</code> and rounded to the nearest integer. Use the multiplier to approximate real numbers.'
  },
  {
    names: { BASIC: 'DIVMULT', Pascal: 'divmult', Python: 'divmult' },
    code: pc.divm,
    parameters: [
      { name: 'a', type: 'integer', byref: false, length: 1 },
      { name: 'b', type: 'integer', byref: false, length: 1 },
      { name: 'mult', type: 'integer', byref: false, length: 1 }
    ],
    returns: 'integer',
    category: 5,
    level: 2,
    description: 'Returns <code>a/b</code>, multiplied by <code>mult</code> and rounded to the nearest integer. Use the multiplier to approximate real numbers.'
  },
  {
    names: { BASIC: 'MAXINT', Pascal: 'maxint', Python: 'maxint' },
    code: pc.mxin,
    parameters: [],
    returns: 'integer',
    category: 5,
    level: 2,
    description: 'Returns the maximum integer that the Machine can deal with (2<sup>31</sup>-1).'
  },
  // 6. Trig / exp / log functions
  {
    names: { BASIC: 'SIN', Pascal: 'sin', Python: 'sin' },
    code: pc.sin,
    parameters: [
      { name: 'a', type: 'integer', byref: false, length: 1 },
      { name: 'b', type: 'integer', byref: false, length: 1 },
      { name: 'mult', type: 'integer', byref: false, length: 1 }
    ],
    returns: 'integer',
    category: 6,
    level: 1,
    description: 'Returns <code>sin(a/b)</code>, multiplied by <code>mult</code> and rounded to the nearest integer. Use the multiplier to approximate real numbers.'
  },
  {
    names: { BASIC: 'COS', Pascal: 'cos', Python: 'cos' },
    code: pc.cos,
    parameters: [
      { name: 'a', type: 'integer', byref: false, length: 1 },
      { name: 'b', type: 'integer', byref: false, length: 1 },
      { name: 'mult', type: 'integer', byref: false, length: 1 }
    ],
    returns: 'integer',
    category: 6,
    level: 1,
    description: 'Returns <code>cos(a/b)</code>, multiplied by <code>mult</code> and rounded to the nearest integer. Use the multiplier to approximate real numbers.'
  },
  {
    names: { BASIC: 'TAN', Pascal: 'tan', Python: 'tan' },
    code: pc.tan,
    parameters: [
      { name: 'a', type: 'integer', byref: false, length: 1 },
      { name: 'b', type: 'integer', byref: false, length: 1 },
      { name: 'mult', type: 'integer', byref: false, length: 1 }
    ],
    returns: 'integer',
    category: 6,
    level: 1,
    description: 'Returns <code>tan(a/b)</code>, multiplied by <code>mult</code> and rounded to the nearest integer. Use the multiplier to approximate real numbers.'
  },
  {
    names: { BASIC: 'PI', Pascal: 'pi', Python: 'pi' },
    code: pc.pi,
    parameters: [
      { name: 'mult', type: 'integer', byref: false, length: 1 }
    ],
    returns: 'integer',
    category: 6,
    level: 1,
    description: 'Returns the value of Pi, multiplied by <code>mult</code> and rounded to the nearest integer. Use the multiplier to approximate real numbers.'
  },
  {
    names: { BASIC: 'EXP', Pascal: 'exp', Python: 'exp' },
    code: pc.exp,
    parameters: [
      { name: 'a', type: 'integer', byref: false, length: 1 },
      { name: 'b', type: 'integer', byref: false, length: 1 },
      { name: 'mult', type: 'integer', byref: false, length: 1 }
    ],
    returns: 'integer',
    category: 6,
    level: 1,
    description: 'Returns <code>a<sup>b</sup></code>, multiplied by <code>mult</code> and rounded to the nearest integer. Use the multiplier to approximate real numbers.'
  },
  {
    names: { BASIC: 'LN', Pascal: 'ln', Python: 'ln' },
    code: pc.ln,
    parameters: [
      { name: 'a', type: 'integer', byref: false, length: 1 },
      { name: 'b', type: 'integer', byref: false, length: 1 },
      { name: 'mult', type: 'integer', byref: false, length: 1 }
    ],
    returns: 'integer',
    category: 6,
    level: 1,
    description: 'Returns <code>ln(a/b)</code>, multiplied by <code>mult</code> and rounded to the nearest integer. Use the multiplier to approximate real numbers.'
  },
  {
    names: { BASIC: 'ANTILOG', Pascal: 'antilog', Python: 'antilog' },
    code: pc.alog,
    parameters: [
      { name: 'a', type: 'integer', byref: false, length: 1 },
      { name: 'b', type: 'integer', byref: false, length: 1 },
      { name: 'mult', type: 'integer', byref: false, length: 1 }
    ],
    returns: 'integer',
    category: 6,
    level: 2,
    description: 'Returns <code>antilog<sub>10</sub>(a/b)</code> - i.e. <code>10<sup>a/b</sub></code> - multiplied by <code>mult</code> and rounded to the nearest integer. Use the multiplier to approximate real numbers.'
  },
  {
    names: { BASIC: 'LOG10', Pascal: 'log10', Python: 'log10' },
    code: pc.log,
    parameters: [
      { name: 'a', type: 'integer', byref: false, length: 1 },
      { name: 'b', type: 'integer', byref: false, length: 1 },
      { name: 'mult', type: 'integer', byref: false, length: 1 }
    ],
    returns: 'integer',
    category: 6,
    level: 2,
    description: 'Returns <code>log<sub>10</sub>(a/b)</code>, multiplied by <code>mult</code> and rounded to the nearest integer. Use the multiplier to approximate real numbers.'
  },
  {
    names: { BASIC: 'ASN', Pascal: 'arcsin', Python: 'asin' },
    code: pc.asin,
    parameters: [
      { name: 'a', type: 'integer', byref: false, length: 1 },
      { name: 'b', type: 'integer', byref: false, length: 1 },
      { name: 'mult', type: 'integer', byref: false, length: 1 }
    ],
    returns: 'integer',
    category: 6,
    level: 2,
    description: 'Returns <code>arcsin(a/b)</code>, multiplied by <code>mult</code> and rounded to the nearest integer. Use the multiplier to approximate real numbers.'
  },
  {
    names: { BASIC: 'ACS', Pascal: 'arccos', Python: 'acos' },
    code: pc.acos,
    parameters: [
      { name: 'a', type: 'integer', byref: false, length: 1 },
      { name: 'b', type: 'integer', byref: false, length: 1 },
      { name: 'mult', type: 'integer', byref: false, length: 1 }
    ],
    returns: 'integer',
    category: 6,
    level: 2,
    description: 'Returns <code>arccos(a/b)</code>, multiplied by <code>mult</code> and rounded to the nearest integer. Use the multiplier to approximate real numbers.'
  },
  {
    names: { BASIC: 'ATN', Pascal: 'arctan', Python: 'atan' },
    code: pc.atan,
    parameters: [
      { name: 'a', type: 'integer', byref: false, length: 1 },
      { name: 'b', type: 'integer', byref: false, length: 1 },
      { name: 'mult', type: 'integer', byref: false, length: 1 }
    ],
    returns: 'integer',
    category: 6,
    level: 2,
    description: 'Returns <code>arctan(a/b)</code>, multiplied by <code>mult</code> and rounded to the nearest integer. Use the multiplier to approximate real numbers.'
  },
  // 7. String operations
  {
    names: { BASIC: 'WRITE', Pascal: 'write', Python: 'write' },
    code: pc.text,
    parameters: [
      { name: 'string', type: 'string', byref: false, length: 1 }
    ],
    category: 7,
    level: 0,
    description: 'Writes the input <code>string</code> to the console and textual output area of the System.'
  },
  {
    names: { BASIC: 'WRITELN', Pascal: 'writeln', Python: 'writeline' },
    code: pc.texl,
    parameters: [
      { name: 'string', type: 'string', byref: false, length: 1 }
    ],
    category: 7,
    level: 0,
    description: 'Writes the input <code>string</code> to the console and textual output area of the System, followed by a line break.'
  },
  {
    names: { BASIC: 'PRINT', Pascal: 'print', Python: 'print' },
    code: pc.prnt,
    parameters: [
      { name: 'string', type: 'string', byref: false, length: 1 },
      { name: 'font', type: 'integer', byref: false, length: 1 },
      { name: 'size', type: 'integer', byref: false, length: 1 }
    ],
    category: 7,
    level: 0,
    description: 'Prints the input <code>string</code> in the Turtle&rsquo;s current colour and at the Turtle&rsquo;s current location, in the specified <code>font</code> and <code>size</code>. Can be used in conjunction with the <code>box</code> drawing command. For a list of available fonts, see the <b>Constants</b> tab.'
  },
  {
    names: { BASIC: 'UCASE$', Pascal: 'uppercase', Python: 'upper' },
    code: pc.uppc,
    parameters: [
      { name: 'string', type: 'string', byref: false, length: 1 }
    ],
    returns: 'string',
    category: 7,
    level: 1,
    description: 'Returns the input <code>string</code> as all uppercase.'
  },
  {
    names: { BASIC: 'LCASE$', Pascal: 'lowercase', Python: 'lower' },
    code: pc.lowc,
    parameters: [
      { name: 'string', type: 'string', byref: false, length: 1 }
    ],
    returns: 'string',
    category: 7,
    level: 1,
    description: 'Returns the input <code>string</code> as all lowercase.'
  },
  {
    names: { BASIC: 'LEN', Pascal: 'length', Python: 'len' },
    code: pc.slen,
    parameters: [
      { name: 'string', type: 'string', byref: false, length: 1 }
    ],
    returns: 'integer',
    category: 7,
    level: 1,
    description: 'Returns the length of the input <code>string</code> (i.e. the number of characters).'
  },
  {
    names: { BASIC: 'DEL$', Pascal: 'delete', Python: null },
    code: pc.dels,
    parameters: [
      { name: 'string', type: 'string', byref: false, length: 1 },
      { name: 'index', type: 'integer', byref: false, length: 1 },
      { name: 'length', type: 'integer', byref: false, length: 1 }
    ],
    returns: 'string',
    category: 7,
    level: 2,
    description: 'Returns the input <code>string</code> with some characters removed, starting at the given <code>index</code> and of the specified <code>length</code>.'
  },
  {
    names: { BASIC: 'LEFT$', Pascal: null, Python: null },
    code: pc.lefs,
    parameters: [
      { name: 'string', type: 'string', byref: false, length: 1 },
      { name: 'length', type: 'integer', byref: false, length: 1 }
    ],
    returns: 'string',
    category: 7,
    level: 2,
    description: 'Returns a copy of the characters in the input <code>string</code>, starting on the left and of the specified <code>length</code>.'
  },
  {
    names: { BASIC: 'MID$', Pascal: 'copy', Python: 'copy' },
    code: pc.copy,
    parameters: [
      { name: 'string', type: 'string', byref: false, length: 1 },
      { name: 'index', type: 'integer', byref: false, length: 1 },
      { name: 'length', type: 'integer', byref: false, length: 1 }
    ],
    returns: 'string',
    category: 7,
    level: 2,
    description: 'Returns a copy of the characters in the input <code>string</code>, starting at the given <code>index</code> and of the specified <code>length</code>.'
  },
  {
    names: { BASIC: 'RIGHT$', Pascal: null, Python: null },
    code: pc.rgts,
    parameters: [
      { name: 'string', type: 'string', byref: false, length: 1 },
      { name: 'length', type: 'integer', byref: false, length: 1 }
    ],
    returns: 'string',
    category: 7,
    level: 2,
    description: 'Returns a copy of the characters in the input <code>string</code>, starting on the right and of the specified <code>length</code>.'
  },
  {
    names: { BASIC: 'INS$', Pascal: null, Python: 'insert' },
    code: pc.inss,
    parameters: [
      { name: 'string', type: 'string', byref: false, length: 1 },
      { name: 'index', type: 'integer', byref: false, length: 1 },
      { name: 'substr', type: 'string', byref: false, length: 1 }
    ],
    returns: 'string',
    category: 7,
    level: 2,
    description: 'Returns the input <code>string</code> with the specified <code>substring</code> inserted at the given <code>index</code>.'
  },
  {
    names: { BASIC: null, Pascal: 'insert', Python: null },
    code: pc.inss,
    parameters: [
      { name: 'substr', type: 'string', byref: false, length: 1 },
      { name: 'string', type: 'string', byref: false, length: 1 },
      { name: 'index', type: 'integer', byref: false, length: 1 }
    ],
    returns: 'string',
    category: 7,
    level: 2,
    description: 'Returns the input <code>string</code> with the specified <code>substring</code> inserted at the given <code>index</code>.'
  },
  {
    names: { BASIC: 'REPLACE$', Pascal: 'replace', Python: 'replace' },
    code: pc.repl,
    parameters: [
      { name: 'string', type: 'string', byref: false, length: 1 },
      { name: 'substr', type: 'string', byref: false, length: 1 },
      { name: 'replace', type: 'string', byref: false, length: 1 },
      { name: 'n', type: 'integer', byref: false, length: 1 }
    ],
    returns: 'string',
    category: 7,
    level: 2,
    description: 'Returns the input <code>string</code> with up to <code>n</code> occurences of <code>substring</code> replaced by <code>replace</code>. Set <code>n</code> equal to <code>0</code> to replace every occurence.'
  },
  {
    names: { BASIC: 'INSTR', Pascal: null, Python: 'find' },
    code: pc.poss,
    parameters: [
      { name: 'string', type: 'string', byref: false, length: 1 },
      { name: 'substr', type: 'string', byref: false, length: 1 }
    ],
    returns: 'integer',
    category: 7,
    level: 2,
    description: 'Searches for the input <code>substring</code> within the given <code>string</code>; returns the index of the first character if found, 0 otherwise.'
  },
  {
    names: { BASIC: null, Pascal: 'pos', Python: null },
    code: pc.poss,
    parameters: [
      { name: 'substr', type: 'string', byref: false, length: 1 },
      { name: 'string', type: 'string', byref: false, length: 1 }
    ],
    returns: 'integer',
    category: 7,
    level: 2,
    description: 'Searches for the input <code>substring</code> within the given <code>string</code>; returns the index of the first character if found, 0 otherwise.'
  },
  // 8. Type conversion routines
  {
    names: { BASIC: 'STR$', Pascal: 'str', Python: 'str' },
    code: pc.itos,
    parameters: [
      { name: 'n', type: 'integer', byref: false, length: 1 }
    ],
    returns: 'string',
    category: 8,
    level: 0,
    description: 'Returns the integer <code>n</code> as a string, e.g. <code>str(12)=\'12\'</code>.'
  },
  {
    names: { BASIC: 'VAL', Pascal: 'val', Python: 'int' },
    code: pc.svd0,
    parameters: [
      { name: 'string', type: 'string', byref: false, length: 1 }
    ],
    returns: 'integer',
    category: 8,
    level: 0,
    description: 'Returns the input <code>string</code> as an integer, e.g. <code>val(\'12\')=12</code>. Returns <code>0</code> if the string cannot be converted (i.e. if it is not an integer string).'
  },
  {
    names: { BASIC: 'VALDEF', Pascal: 'valdef', Python: 'intdef' },
    code: pc.sval,
    parameters: [
      { name: 'string', type: 'string', byref: false, length: 1 },
      { name: 'default', type: 'string', byref: false, length: 1 }
    ],
    returns: 'integer',
    category: 8,
    level: 0,
    description: 'Returns the input <code>string</code> as an integer, e.g. <code>val(\'12\')=12</code>. Returns the specified <code>default</code> value if the string cannot be converted (i.e. if it is not an integer string).'
  },
  {
    names: { BASIC: 'QSTR$', Pascal: 'qstr', Python: 'qstr' },
    code: pc.qtos,
    parameters: [
      { name: 'a', type: 'integer', byref: false, length: 1 },
      { name: 'b', type: 'integer', byref: false, length: 1 },
      { name: 'decplaces', type: 'integer', byref: false, length: 1 }
    ],
    returns: 'string',
    category: 8,
    level: 1,
    description: 'Returns the value of <code>a/b</code> to the specified number of decimal places, as a decimal string, e.g. <code>qstr(2,3,4)=\'0.6667\'</code>.'
  },
  {
    names: { BASIC: 'QVAL', Pascal: 'qval', Python: 'qval' },
    code: pc.qval,
    parameters: [
      { name: 'string', type: 'string', byref: false, length: 1 },
      { name: 'mult', type: 'integer', byref: false, length: 1 },
      { name: 'default', type: 'integer', byref: false, length: 1 }
    ],
    returns: 'integer',
    category: 8,
    level: 1,
    description: 'Returns the input decimal <code>string</code> as an integer, multiplied by <code>mult</code> and rounded to the nearest integer, e.g. <code>qval(\'1.5\',10)=15</code>. Returns the specified <code>default</code> value if the string cannot be converted (i.e. if it is not a decimal string).'
  },
  {
    names: { BASIC: 'CHR$', Pascal: 'chr', Python: 'chr' },
    code: pc.null,
    parameters: [
      { name: 'n', type: 'integer', byref: false, length: 1 }
    ],
    returns: 'char',
    category: 8,
    level: 2,
    description: 'Returns the character with ASCII character code <code>n</code>, e.g. <code>chr(65)=\'A\'</code>.'
  },
  {
    names: { BASIC: 'ASC', Pascal: 'ord', Python: 'ord' },
    code: pc.null,
    parameters: [
      { name: 'char', type: 'char', byref: false, length: 1 }
    ],
    returns: 'integer',
    category: 8,
    level: 2,
    description: 'Returns the ASCII code of the input character <code>char</code> (which must be a string of length 1), e.g. <code>ord(\'A\')=65</code>.'
  },
  {
    names: { BASIC: 'BOOLINT', Pascal: 'boolint', Python: null },
    code: pc.null,
    parameters: [
      { name: 'boolean', type: 'boolean', byref: false, length: 1 }
    ],
    returns: 'integer',
    category: 8,
    level: 2,
    description: 'Returns the input <code>boolean</code> as an integer (-1 for <code>true</code>, 0 for <code>false</code>).'
  },
  {
    names: { BASIC: null, Pascal: null, Python: 'boolint' },
    code: pc.bool,
    parameters: [
      { name: 'boolean', type: 'boolean', byref: false, length: 1 }
    ],
    returns: 'integer',
    category: 8,
    level: 2,
    description: 'Returns the input <code>boolean</code> as an integer (1 for <code>true</code>, 0 for <code>false</code>).'
  },
  {
    names: { BASIC: 'HEX$', Pascal: 'hexstr', Python: 'hex' },
    code: pc.hexs,
    parameters: [
      { name: 'n', type: 'integer', byref: false, length: 1 },
      { name: 'minlength', type: 'integer', byref: false, length: 1 }
    ],
    category: 8,
    level: 2,
    description: 'Returns a string representation of integer <code>n</code> in hexadecimal format, padded with leading zeros as up to <code>minlength</code>, e.g. <code>hexstr(255,6)=\'0000FF\'</code>.'
  },
  // 9. Input and timing routines
  {
    names: { BASIC: 'PAUSE', Pascal: 'pause', Python: 'pause' },
    code: pc.wait,
    parameters: [
      { name: 'm', type: 'integer', byref: false, length: 1 }
    ],
    category: 9,
    level: 0,
    description: 'Makes the Turtle Machine wait <code>m</code> milliseconds before performing the next operation. This is useful for controlling the speed of animations.'
  },
  {
    names: { BASIC: 'GETLINE$', Pascal: 'readln', Python: 'readline' },
    code: pc.rdln,
    parameters: [],
    returns: 'string',
    category: 9,
    level: 0,
    description: 'Waits for the RETURN key to be pressed, then returns everything in the keybuffer up to (and not including) the new line character.'
  },
  {
    names: { BASIC: 'INPUT$', Pascal: null, Python: 'input' },
    code: pc.ilin,
    parameters: [
      { name: 'prompt', type: 'string', byref: false, length: 1 }
    ],
    returns: 'string',
    category: 9,
    level: 0,
    description: 'Gives an input prompt, then returns the input when the RETURN key is pressed (using the keybuffer).'
  },
  {
    names: { BASIC: 'CURSOR', Pascal: 'cursor', Python: 'cursor' },
    code: pc.curs,
    parameters: [
      { name: 'cursorcode', type: 'integer', byref: false, length: 1 }
    ],
    category: 9,
    level: 1,
    description: 'Sets which cursor to display (1-15) when the mouse pointer is over the canvas. 0 hides the cursor; any value outside the range 0-15 resets the default cursor. For a list of available cursors, see the <b>Cursors</b> tab.'
  },
  {
    names: { BASIC: 'KEYECHO', Pascal: 'keyecho', Python: 'keyecho' },
    code: pc.kech,
    parameters: [
      { name: 'on', type: 'boolean', byref: false, length: 1 }
    ],
    category: 9,
    level: 1,
    description: 'Turns the keyboard echo to the console on (<code>true</code>) or off (<code>false</code>).'
  },
  {
    names: { BASIC: 'DETECT', Pascal: 'detect', Python: 'detect' },
    code: pc.tdet,
    parameters: [
      { name: 'keycode', type: 'integer', byref: false, length: 1 },
      { name: 'm', type: 'integer', byref: false, length: 1 }
    ],
    returns: 'boolean',
    category: 9,
    level: 1,
    description: 'Waits a maximum of <code>m</code> milliseconds for the key with the specified <code>keycode</code> to be pressed; returns <code>true</code> if pressed (and stops waiting), <code>false</code> otherwise.'
  },
  {
    names: { BASIC: 'GET$', Pascal: 'read', Python: 'read' },
    code: pc.read,
    parameters: [
      { name: 'n', type: 'integer', byref: false, length: 1 }
    ],
    returns: 'string',
    category: 9,
    level: 1,
    description: 'Returns the first <code>n</code> characters from the keybuffer as a string.'
  },
  {
    names: { BASIC: 'TIME', Pascal: 'time', Python: 'time' },
    code: pc.time,
    parameters: [],
    returns: 'integer',
    category: 9,
    level: 1,
    description: 'Returns the time (in milliseconds) since the program began.'
  },
  {
    names: { BASIC: 'TIMESET', Pascal: 'timeset', Python: 'timeset' },
    code: pc.tset,
    parameters: [
      { name: 'm', type: 'integer', byref: false, length: 1 }
    ],
    category: 9,
    level: 1,
    description: 'Artificially sets the time since the program began to <code>m</code> milliseconds.'
  },
  {
    names: { BASIC: 'RESET', Pascal: 'reset', Python: 'reset' },
    code: pc.iclr,
    parameters: [
      { name: '?input', type: 'integer', byref: false, length: 1 }
    ],
    category: 9,
    level: 2,
    description: 'Resets the specified <code>?input</code> (<code>?mousex</code>, <code>?mousey</code>, <code>?click</code>, etc.) to its initial value (i.e. -1).'
  },
  {
    names: { BASIC: 'KEYSTATUS', Pascal: 'keystatus', Python: 'keystatus' },
    code: pc.inpt,
    parameters: [
      { name: 'keycode', type: 'integer', byref: false, length: 1 }
    ],
    returns: 'integer',
    category: 9,
    level: 2,
    description: 'Returns the <code>?kshift</code> value for the most recent press of the key with the specified <code>keycode</code>.'
  },
  {
    names: { BASIC: 'KEYBUFFER', Pascal: 'keybuffer', Python: 'keybuffer' },
    code: pc.bufr,
    parameters: [
      { name: 'n', type: 'integer', byref: false, length: 1 }
    ],
    category: 9,
    level: 2,
    description: 'Creates a new custom keybuffer of length <code>n</code>. A keybuffer of length 32 is available by default; use this command if you need a larger buffer.'
  },
  // 10. Turtle Machine monitoring
  {
    names: { BASIC: 'HALT', Pascal: 'halt', Python: 'halt' },
    code: pc.halt,
    parameters: [],
    category: 10,
    level: 0,
    description: 'Halts the program.'
  },
  {
    names: { BASIC: 'TRACE', Pascal: 'trace', Python: 'trace' },
    code: pc.trac,
    parameters: [
      { name: 'on', type: 'boolean', byref: false, length: 1 }
    ],
    category: 10,
    level: 2,
    description: 'Turns the PCode trace facility on (<code>true</code>) or off (<code>false</code>).'
  },
  {
    names: { BASIC: 'WATCH', Pascal: 'watch', Python: 'watch' },
    code: pc.memw,
    parameters: [
      { name: 'address', type: 'integer', byref: false, length: 1 }
    ],
    category: 10,
    level: 2,
    description: 'Sets an <code>address</code> in memory for the trace facility to watch.'
  },
  {
    names: { BASIC: 'DUMP', Pascal: 'dump', Python: 'dump' },
    code: pc.dump,
    parameters: [],
    category: 10,
    level: 2,
    description: '&ldquo;Dumps&rdquo; the current memory state into the display in the memory tab.'
  },
  {
    names: { BASIC: 'HEAPRESET', Pascal: 'heapreset', Python: 'heapreset' },
    code: pc.hrst,
    parameters: [],
    category: 10,
    level: 2,
    description: 'Resets the memory heap to the initial global value.'
  }
]
