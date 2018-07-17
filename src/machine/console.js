/**
 * the machine console
 * -------------------------------------------------------------------------------------------------
 * PRE element for displaying textual output from the program, and user textual input
 * -------------------------------------------------------------------------------------------------
 */

// global imports
const { create, hex } = require('dom');

// local imports
const memory = require('./memory');

// the console element
const element = create('pre', { classes: ['tsx-console'] });

const storeKey = (event) => {
  const pressedKey = event.keyCode || event.charCode;
  // backspace
  if (pressedKey === 8) {
    event.preventDefault(); // don't go back a page in the browser!
    memory.deleteFromBuffer();
    memory.deleteFromReadln();
    if (memory.getKeyecho()) {
      console.innerHTML = console.innerHTML.slice(0, -1);
    }
  }
  // arrow keys
  if (pressedKey >= 37 && pressedKey <= 40) {
    event.preventDefault(); // don't scroll the page
  }
  // normal case
  memory.setQuery(9, pressedKey);
  memory.setQuery(10, 128);
  if (event.shiftKey) {
    memory.incrementQuery(10, 8);
  }
  if (event.altKey) {
    memory.incrementQuery(10, 16);
  }
  if (event.ctrlKey) {
    memory.incrementQuery(10, 32);
  }
  memory.setKey(pressedKey, memory.getQuery(10));
};

const releaseKey = (event) => {
  const pressedKey = event.keyCode || event.charCode;
  memory.invertQuery(9);
  memory.invertQuery(10);
  memory.invertKey(pressedKey);
};

const putInBuffer = (event) => {
  const pressedKey = event.keyCode || event.charCode;
  memory.addToBuffer(pressedKey);
  if (memory.getKeyecho()) {
    console.innerHTML += String.fromCharCode(pressedKey);
    console.scrollTop = console.scrollHeight;
  }
};

const addEventListeners = () => {
  window.addEventListener('keydown', storeKey);
  window.addEventListener('keyup', releaseKey);
  window.addEventListener('keypress', putInBuffer);
};

const removeEventListeners = () => {
  window.removeEventListener('keydown', storeKey);
  window.removeEventListener('keyup', releaseKey);
  window.removeEventListener('keypress', putInBuffer);
};

const setBackground = (colour) => {
  console.style.background = hex(colour);
};

const addText = (text) => {
  console.innerHTML += text;
  console.scrollTop = console.scrollHeight;
};

const clearText = () => {
  console.innerHTML = '';
};

// exports
module.exports = {
  element,
  addEventListeners,
  removeEventListeners,
  setBackground,
  addText,
  clearText,
};
