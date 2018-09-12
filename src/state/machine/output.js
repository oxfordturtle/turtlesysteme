/**
 * the machine output
 *
 * PRE element for displaying textual output from the program
 */
const { element, hex } = require('dom');

// the output element
const output = element('pre');

// set the background colour
const setBackground = (colour) => {
  output.style.background = hex(colour);
};

// edit text content
const addText = (text) => {
  output.innerHTML += text;
};

const clearText = () => {
  output.innerHTML = '';
};

// exports
module.exports = {
  output,
  setBackground,
  addText,
  clearText,
};
