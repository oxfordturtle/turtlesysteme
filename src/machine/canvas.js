/**
 * the virtual turtle machine canvas
 */
require('styles/canvas.scss');
const { create, hex } = require('dom');
const { cursors, fonts } = require('data');
const memory = require('./memory');

// the canvas and drawing context
const canvas = create('canvas', { classes: ['tsx-canvas'], width: 500, height: 500 });

const context = canvas.getContext('2d');

// the virtual canvas
const vcanvas = {
  startx: 0,
  starty: 0,
  sizex: 1000,
  sizey: 1000,
  degrees: 360,
  doubled: false,
};

// convert x to virtual canvas coordinate
const virtx = (x) => {
  const { left } = canvas.getBoundingClientRect();
  const exact = (((x - left) * vcanvas.sizex) / canvas.offsetWidth) + vcanvas.startx;
  return Math.round(exact);
};

// convert y to virtual canvas coordinate
const virty = (y) => {
  const { top } = canvas.getBoundingClientRect();
  const exact = (((y - top) * vcanvas.sizey) / canvas.offsetHeight) + vcanvas.starty;
  return Math.round(exact);
};

// convert turtx to virtual canvas coordinate
const turtx = (x) => {
  const exact = ((x - vcanvas.startx) * canvas.width) / vcanvas.sizex;
  return (vcanvas.doubled) ? Math.round(exact) + 1 : Math.round(exact);
};

// convert turty to virtual canvas coordinate
const turty = (y) => {
  const exact = ((y - vcanvas.starty) * canvas.height) / vcanvas.sizey;
  return (vcanvas.doubled) ? Math.round(exact) + 1 : Math.round(exact);
};

// convert turtt to virtual canvas thickness
const turtt = t =>
  ((vcanvas.doubled) ? t * 2 : t);

// convert turtc to hexadecimal string (CSS style)
const turtc = c =>
  hex(c);

// store mouse coordinates in virtual memory
const storeMouseXY = (event) => {
  switch (event.type) {
    case 'mousemove':
      memory.setQuery(7, virtx(event.clientX));
      memory.setQuery(8, virty(event.clientY));
      break;
    case 'touchmove': // fallthrough
    case 'touchstart':
      memory.setQuery(7, virtx(event.touches[0].clientX));
      memory.setQuery(8, virty(event.touches[0].clientY));
      break;
    default:
      break;
  }
};

// store mouse click coordinates in virtual memory
const storeClickXY = (event) => {
  const now = new Date().getTime();
  memory.setQuery(4, 128);
  if (event.shiftKey) {
    memory.incrementQuery(4, 8);
  }
  if (event.altKey) {
    memory.incrementQuery(4, 16);
  }
  if (event.ctrlKey) {
    memory.incrementQuery(4, 32);
  }
  if (now - memory.getQuery(11) < 300) { // double click
    memory.incrementQuery(4, 64);
  }
  memory.setQuery(11, now); // save to check for next double click
  switch (event.type) {
    case 'mousedown':
      memory.setQuery(5, virtx(event.clientX));
      memory.setQuery(6, virty(event.clientY));
      switch (event.button) {
        case 0:
          memory.incrementQuery(4, 1);
          memory.setQuery(1, memory.getQuery(4));
          memory.setQuery(2, -1);
          memory.setQuery(3, -1);
          break;
        case 1:
          memory.incrementQuery(4, 4);
          memory.setQuery(1, -1);
          memory.setQuery(2, -1);
          memory.setQuery(3, memory.getQuery(4));
          break;
        case 2:
          memory.incrementQuery(4, 2);
          memory.setQuery(1, -1);
          memory.setQuery(2, memory.getQuery(4));
          memory.setQuery(3, -1);
          break;
        default:
          break;
      }
      break;
    case 'touchstart':
      memory.setQuery(5, virtx(event.touches[0].clientX));
      memory.setQuery(6, virty(event.touches[0].clientY));
      memory.incrementQuery(4, 1);
      memory.setQuery(1, memory.getQuery(4));
      memory.setQuery(2, -1);
      memory.setQuery(3, -1);
      storeMouseXY(event);
      break;
    default:
      break;
  }
};

// store mouse release coordinates in virtual memory
const releaseClickXY = (event) => {
  memory.invertQuery(4);
  switch (event.type) {
    case 'mouseup':
      switch (event.button) {
        case 0:
          memory.invertQuery(1);
          break;
        case 1:
          memory.invertQuery(3);
          break;
        case 2:
          memory.invertQuery(2);
          break;
        default:
          break;
      }
      break;
    case 'touchend':
      memory.invertQuery(1);
      break;
    default:
      break;
  }
};

// prevent default (for blocking context menus on right click)
const preventDefault = (event) => {
  event.preventDefault();
};

// add event listeners for program execution
const addEventListeners = () => {
  canvas.addEventListener('contextmenu', preventDefault);
  canvas.addEventListener('mousemove', storeMouseXY);
  canvas.addEventListener('touchmove', preventDefault);
  canvas.addEventListener('touchmove', storeMouseXY);
  canvas.addEventListener('mousedown', preventDefault);
  canvas.addEventListener('mousedown', storeClickXY);
  canvas.addEventListener('touchstart', storeClickXY);
  canvas.addEventListener('mouseup', releaseClickXY);
  canvas.addEventListener('touchend', releaseClickXY);
};

// remove event listeners (at the end of program execution)
const removeEventListeners = () => {
  canvas.removeEventListener('contextmenu', preventDefault);
  canvas.removeEventListener('mousemove', storeMouseXY);
  canvas.removeEventListener('touchmove', preventDefault);
  canvas.removeEventListener('touchmove', storeMouseXY);
  canvas.removeEventListener('mousedown', preventDefault);
  canvas.removeEventListener('mousedown', storeClickXY);
  canvas.removeEventListener('touchstart', storeClickXY);
  canvas.removeEventListener('mouseup', releaseClickXY);
  canvas.removeEventListener('touchend', releaseClickXY);
};

// getters/setters for the main canvas and virtual canvas properties
const getDegrees = () =>
  vcanvas.degrees;

const getDimensions = () =>
  ({
    startx: vcanvas.startx,
    starty: vcanvas.starty,
    sizex: vcanvas.sizex,
    sizey: vcanvas.sizey,
  });

const setDimensions = (startx, starty, sizex, sizey) => {
  vcanvas.startx = startx;
  vcanvas.starty = starty;
  vcanvas.sizex = sizex;
  vcanvas.sizey = sizey;
};

const setDegrees = (degrees) => {
  vcanvas.degrees = degrees;
};

const setDoubled = (doubled) => {
  vcanvas.doubled = doubled;
};

const setResolution = (width, height) => {
  canvas.width = width;
  canvas.height = height;
};

const setCursor = (code) => {
  const corrected = (code < 0 || code > 15) ? 1 : code;
  canvas.style.cursor = cursors[corrected].css;
};

// print text to the canvas
const drawText = (turtle, string, font, pt) => {
  context.textBaseline = 'top';
  context.fillStyle = turtc(turtle.c);
  context.font = `${pt}pt ${fonts[font & 0xF].css}`;
  if ((font & 0x10) > 0) {
    context.font = `bold ${context.font}`;
  }
  if ((font & 0x20) > 0) {
    context.font = `italic ${context.font}`;
  }
  context.fillText(string, turtx(turtle.x), turty(turtle.y));
};

// draw a line on the canvas
const drawLine = (turtle, distx, disty) => {
  context.beginPath();
  context.moveTo(turtx(turtle.x), turty(turtle.y));
  context.lineTo(turtx(turtle.x + distx), turty(turtle.y + disty));
  context.lineCap = 'round';
  context.lineWidth = turtt(turtle.t);
  context.strokeStyle = turtc(turtle.c);
  context.stroke();
};

// draw a line to the given coordinates
const drawToCoords = (coords, index) => {
  if (index === 0) {
    context.moveTo(turtx(coords[0]), turty(coords[1]));
  } else {
    context.lineTo(turtx(coords[0]), turty(coords[1]));
  }
};

// draw a polygon (optionally filled)
const drawPoly = (turtle, coords, fill) => {
  context.beginPath();
  coords.forEach(drawToCoords);
  if (fill) {
    context.closePath();
    context.fillStyle = turtc(turtle.c);
    context.fill();
  } else {
    context.lineCap = 'round';
    context.lineWidth = turtt(turtle.t);
    context.strokeStyle = turtc(turtle.c);
    context.stroke();
  }
};

// draw a polyline (unfilled polygon)
const drawPolyline = (turtle, coords) =>
  drawPoly(turtle, coords, false);

// draw a filled polygon
const drawPolygon = (turtle, coords) =>
  drawPoly(turtle, coords, true);

// draw a circle/ellipse (optionally filled)
const drawArc = (turtle, radiusx, radiusy, fill) => {
  const centrex = turtx(turtle.x);
  const centrey = turty(turtle.y);
  const fixedradiusx = turtx(radiusx + vcanvas.startx);
  const fixedradiusy = turty(radiusy + vcanvas.starty);
  context.beginPath();
  if (radiusx === radiusy) {
    context.arc(centrex, centrey, fixedradiusx, 0, 2 * Math.PI, false);
  } else {
    context.save();
    context.translate(centrex - fixedradiusx, centrey - fixedradiusy);
    context.scale(fixedradiusx, fixedradiusy);
    context.arc(1, 1, 1, 0, 2 * Math.PI, false);
    context.restore();
  }
  if (fill) {
    context.fillStyle = turtc(turtle.c);
    context.fill();
  } else {
    context.lineWidth = turtt(turtle.t);
    context.strokeStyle = turtc(turtle.c);
    context.stroke();
  }
};

// draw an empty circle
const drawCircle = (turtle, radius) =>
  drawArc(turtle, radius, radius, false);

// draw a blot (filled circle)
const drawBlot = (turtle, radius) =>
  drawArc(turtle, radius, radius, true);

// draw an empty ellipse
const drawEllipse = (turtle, radiusx, radiusy) =>
  drawArc(turtle, radiusx, radiusy, false);

// draw an elliptical blot (filled ellipse)
const drawEllblot = (turtle, radiusx, radiusy) =>
  drawArc(turtle, radiusx, radiusy, true);

// draw a box
const drawBox = (turtle, distx, disty, fillCol, border) => {
  context.beginPath();
  context.moveTo(turtx(turtle.x), turty(turtle.y));
  context.lineTo(turtx(turtle.x + distx), turty(turtle.y));
  context.lineTo(turtx(turtle.x + distx), turty(turtle.y + disty));
  context.lineTo(turtx(turtle.x), turty(turtle.y + disty));
  context.closePath();
  context.fillStyle = turtc(fillCol);
  context.fill();
  if (border) {
    context.lineCap = 'round';
    context.lineWidth = turtt(turtle.t);
    context.strokeStyle = turtc(turtle.c);
    context.stroke();
  }
};

// get the colour of a canvas pixel
const pixcol = (x, y) => {
  const img = context.getImageData(turtx(x), turty(y), 1, 1);
  return (img.data[0] * 65536) + (img.data[1] * 256) + img.data[2];
};

// set the colour of a canvas pixel
const pixset = (x, y, c) => {
  const img = context.createImageData(1, 1);
  img.data[0] = (c >> 16) & 0xff;
  img.data[1] = (c >> 8) & 0xff;
  img.data[2] = c & 0xff;
  img.data[3] = 0xff;
  context.putImageData(img, turtx(x), turty(y));
  if (vcanvas.doubled) {
    context.putImageData(img, (turtx(x) - 1), turty(y));
    context.putImageData(img, turtx(x), (turty(y) - 1));
    context.putImageData(img, (turtx(x) - 1), (turty(y) - 1));
  }
};

// black the canvas in the given colour
const blank = (c) => {
  context.fillStyle = turtc(c);
  context.fillRect(0, 0, canvas.width, canvas.height);
};

// flood a portion of the canvas
const flood = (x, y, c1, c2, boundary) => {
  const img = context.getImageData(0, 0, canvas.width, canvas.height);
  const pixStack = [];
  const dx = [0, -1, 1, 0];
  const dy = [-1, 0, 0, 1];
  let i = 0;
  let offset = (((y * canvas.width) + x) * 4);
  const c3 = (256 * 256 * img.data[offset]) + (256 * img.data[offset + 1]) + img.data[offset + 2];
  let nextX;
  let nextY;
  let nextC;
  let test1;
  let test2;
  let test3;
  let tx = turtx(x);
  let ty = turty(y);
  pixStack.push(tx);
  pixStack.push(ty);
  while (pixStack.length > 0) {
    ty = pixStack.pop();
    tx = pixStack.pop();
    for (i = 0; i < 4; i += 1) {
      nextX = tx + dx[i];
      nextY = ty + dy[i];
      test1 = (nextX > 0 && nextX <= canvas.width);
      test2 = (nextY > 0 && nextY <= canvas.height);
      if (test1 && test2) {
        offset = (((nextY * canvas.width) + nextX) * 4);
        nextC = (256 * 256 * img.data[offset]);
        nextC += (256 * img.data[offset + 1]);
        nextC += img.data[offset + 2];
        test1 = (nextC !== c1);
        test2 = ((nextC !== c2) || !boundary);
        test3 = ((nextC === c3) || boundary);
        if (test1 && test2 && test3) {
          offset = (((nextY * canvas.width) + nextX) * 4);
          img.data[offset] = ((c1 & 0xFF0000) >> 16);
          img.data[offset + 1] = ((c1 & 0xFF00) >> 8);
          img.data[offset + 2] = (c1 & 0xFF);
          pixStack.push(nextX);
          pixStack.push(nextY);
        }
      }
    }
  }
  context.putImageData(img, 0, 0);
};

// recolour a portion of the canvas
const recolour = (x, y, colour) =>
  flood(x, y, colour, 0, false);

// fill a portion of the canvas with a colour, up to the boundary colour
const fill = (x, y, colour, boundaryColour) =>
  flood(x, y, colour, boundaryColour, true);

module.exports = {
  canvas,
  addEventListeners,
  removeEventListeners,
  getDimensions,
  getDegrees,
  setDimensions,
  setDegrees,
  setDoubled,
  setResolution,
  setCursor,
  drawText,
  drawLine,
  drawPolyline,
  drawPolygon,
  drawCircle,
  drawBlot,
  drawEllipse,
  drawEllblot,
  drawBox,
  pixcol,
  pixset,
  blank,
  recolour,
  fill
};
