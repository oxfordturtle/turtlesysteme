/**
 * the machine memory
 */
const { create } = require('dom');

// the machine memory
const memory = {
  main: [], // main memory
  keys: [], // keypress input statuses
  query: [], // other input statuses
  coords: [], // record of the turtle's (x,y) coordinates
  mainStack: [], // the main (evaluation) stack
  memoryStack: [], // stack of highest memory address
  returnStack: [], // return stack (pcode line to return to after subroutine)
  subroutineStack: [], // subroutine stack (index of the current subroutine)
  heapGlobal: -1, // start of usable heap (after globals), set during program execution
  heapBase: 19999, // actual start of heap (constant), set by runtime options on initialisation
  heapTemp: 19999, // temporary heap base
  heapPerm: 19999, // permanent heap base
  startTime: 0, // needed to handle pauses
  pendown: true, // runtime flag; whether or not to draw as the turtle moves
  update: true, // runtime flag; whether or not to update the canvas
  keyecho: true, // runtime flag; whether or not to echo keypresses to the console
  readln: '', // stores text temporarily on READLN function call
};

// function to initialise machine memory at start of program execution
const setup = (stackSize) => {
  memory.main = [];
  memory.keys = [];
  memory.query = [];
  memory.coords = [];
  memory.mainStack = [];
  memory.memoryStack = [];
  memory.returnStack = [];
  memory.subroutineStack = [];
  memory.heapGlobal = -1;
  memory.heapBase = stackSize - 1;
  memory.heapTemp = memory.heapBase;
  memory.heapPerm = memory.heapTemp;
  memory.main.length = 0x200000;
  memory.keys.length = 0x100;
  memory.query.length = 0x10;
  memory.main.fill(0);
  memory.keys.fill(-1);
  memory.query.fill(-1);
  memory.startTime = new Date().getTime();
  memory.pendown = true;
  memory.update = true;
  memory.keyecho = true;
  memory.readln = '';
};

// getters and setters for the main memory array
const getAddress = address =>
  memory.main[address];

const getPointer = (address, offset) =>
  getAddress(memory.main[address] + offset);

const getTurtle = () =>
  ({
    x: getPointer(0, 1),
    y: getPointer(0, 2),
    d: getPointer(0, 3),
    t: getPointer(0, 4),
    c: getPointer(0, 5)
  });

const setAddress = (address, value) => {
  memory.main[address] = value;
};

const setPointer = (address, offset, value) => {
  setAddress(memory.main[address] + offset, value);
};

// fill a chunk of main memory with zeros
const zero = (start, length) => {
  if (length > 0) {
    setAddress(start, 0);
    zero(start + 1, length - 1);
  }
};

// copy one chunk of main memory into another
const copy = (source, target, length) => {
  if (length > 0) {
    setAddress(target, getAddress(source));
    copy(source + 1, target + 1, length - 1);
  }
};

// getters and setters for input memory arrays
const getQuery = address =>
  memory.query[address];

const getKeys = address =>
  memory.keys[address];

const setQuery = (address, value) => {
  memory.query[address] = value;
};

const incrementQuery = (address, value) => {
  memory.query[address] += value;
};

const invertQuery = (address) => {
  memory.query[address] = -memory.query[address];
};

const setKey = (address, value) => {
  memory.keys[address] = value;
};

const invertKey = (address) => {
  memory.keys[address] = -memory.keys[address];
};

// getters and setters for the turtle's coordinates array
const getCoordsLength = () =>
  memory.coords.length;

const getCoords = (start, end) =>
  memory.coords.slice(start, end);

const remember = () => {
  memory.coords.push([getPointer(0, 1), getPointer(0, 2)]);
};

const forget = (n) => {
  memory.coords.length -= n;
};

// getters and setters for the stacks
const getStackLength = (stack = 'main') =>
  memory[`${stack}Stack`].length;

const push = (value, stack = 'main') => {
  const stackName = `${stack}Stack`;
  memory[stackName].push(value);
  if (stack === 'memory') {
    memory.memoryStackMax = Math.max(value, memory.memoryStackMax);
  }
};

const pop = (stack = 'main') =>
  memory[`${stack}Stack`].pop();

// modifying the heap base
const fixHeapGlobal = () => {
  if (memory.heapGlobal === -1) { // call this only once, on encountering the first subroutine
    memory.heapGlobal = memory.heapPerm;
  }
};

const fixHeapTop = () => {
  memory.heapPerm = memory.heapTemp;
};

const clearHeapTop = () => {
  memory.heapTemp = memory.heapPerm;
};

const resetHeapTop = () => {
  if (memory.heapGlobal > -1) { // don't do anything if heap global has not yet been initialised
    memory.heapTemp = memory.heapGlobal;
    memory.heapPerm = memory.heapGlobal;
  }
};

// load a string onto the memory heap
const makeHeapString = (string) => {
  const stringArray = Array.from(string).map(c => c.charCodeAt(c));
  push(memory.heapTemp + 1);
  stringArray.forEach((code) => {
    memory.heapTemp += 1;
    memory.main[memory.heapTemp] = code;
  });
  memory.heapTemp += 1;
  memory.main[memory.heapTemp] = 0;
  memory.heapMax = Math.max(memory.heapTemp, memory.heapMax);
};

// get a string from the memory heap
const getHeapString = (address) => {
  let string = '';
  let index = address;
  while (memory.main[index] !== 0) {
    string += String.fromCharCode(memory.main[index]);
    index += 1;
  }
  if (index > memory.heapPerm) {
    memory.heapTemp = index;
  }
  return string;
};

// create a keybuffer on the memory heap of the given size
const makeKeyBuffer = (size) => {
  const start = memory.heapTemp + 4;
  push(memory.heapTemp + 1);
  memory.main[memory.heapTemp + 1] = start + size;
  memory.main[memory.heapTemp + 2] = start;
  memory.main[memory.heapTemp + 3] = start;
  memory.main.fill(0, start, start + size);
  memory.heapTemp = start + size;
  memory.heapMax = Math.max(memory.heapTemp, memory.heapMax);
};

// add a character to the keybuffer
const addToBuffer = (keyCode) => {
  const buffer = getAddress(1);
  let next = 0;
  if (buffer > 0) {
    next = 0;
    if (memory.main[buffer + 2] === memory.main[buffer]) {
      next = buffer + 3;
    } else {
      next = memory.main[buffer + 2] + 1;
    }
    if (next !== memory.main[buffer + 1]) {
      memory.main[memory.main[buffer + 2]] = keyCode;
      memory.main[buffer + 2] = next;
    }
  }
};

// delete a character from the keybuffer
const deleteFromBuffer = () => {
  const buffer = getAddress(1);
  const start = memory.main[buffer + 1];
  const end = memory.main[buffer + 2];
  if (start < end) {
    memory.main[end] = 0;
    memory.main[buffer + 2] -= 1;
  }
};

// read n characters from the keybuffer (putting them in a new heap string)
const readFromBuffer = (n) => {
  const buffer = getAddress(1);
  let finished = false;
  let string = '';
  let next = '';
  let i = n;
  while (i > 0 && !finished) {
    if (memory.main[buffer + 1] === memory.main[buffer + 2]) {
      finished = true;
    } else {
      next = memory.main[memory.main[buffer + 1]];
      string += String.fromCharChode(next);
      memory.main[buffer + 1] += 1;
    }
    i -= 1;
  }
  makeHeapString(string);
};

// getters and setters for runtime flags
const getStartTime = () =>
  memory.startTime;

const setStartTime = (time) => {
  memory.startTime = time;
};

const getPendown = () =>
  memory.pendown;

const getUpdate = () =>
  memory.update;

const getKeyecho = () =>
  memory.keyecho;

const setUpdate = (value) => {
  memory.update = !!value;
};

const setPendown = (value) => {
  memory.pendown = !!value;
};

const setKeyecho = (value) => {
  memory.keyecho = !!value;
};

const getReadln = () =>
  memory.readln;

const addToReadln = (char) => {
  memory.readln += char;
};

const deleteFromReadln = () => {
  memory.readln = memory.readln.slice(0, -1);
};

const clearReadln = () => {
  memory.readln = '';
};

// the html tables for displaying the main memory
const stackDisplay = create('table');

const heapDisplay = create('table');

// function for updating the stack and heap display tables with the current memory
const dump = () => {
  const stack = memory.main.slice(0, memory.memoryStackMax + 1);
  const heap = memory.main.slice(memory.heapBase + 1, memory.heapMax + 1);
  // TODO
  return {
    heapBase: memory.heapBase,
    stack,
    heap,
  };
};

// the memory display
const display = create('div', {
  content: [
    create('button', { content: 'Show Current State' }),
    stackDisplay,
    heapDisplay,
  ],
});

module.exports = {
  setup,
  getAddress,
  getPointer,
  getTurtle,
  setAddress,
  setPointer,
  zero,
  copy,
  getQuery,
  getKeys,
  setQuery,
  incrementQuery,
  invertQuery,
  setKey,
  invertKey,
  getCoordsLength,
  getCoords,
  remember,
  forget,
  getStackLength,
  push,
  pop,
  fixHeapGlobal,
  fixHeapTop,
  clearHeapTop,
  resetHeapTop,
  makeHeapString,
  getHeapString,
  makeKeyBuffer,
  addToBuffer,
  deleteFromBuffer,
  readFromBuffer,
  getStartTime,
  setStartTime,
  getPendown,
  getUpdate,
  getKeyecho,
  setPendown,
  setUpdate,
  setKeyecho,
  getReadln,
  addToReadln,
  deleteFromReadln,
  clearReadln,
  dump,
  display
};
