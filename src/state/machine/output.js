/**
 * the machine output
 * -------------------------------------------------------------------------------------------------
 * PRE element for displaying textual output from the program
 * -------------------------------------------------------------------------------------------------
 */

// global imports
const { create, hex } = require('dom');

// the output element
const element = create('pre');

// set the background colour
const setBackground = (colour) => {
  element.style.background = hex(colour);
};

// edit text content
const addText = (text) => {
  element.innerHTML += text;
};

const clearText = () => {
  element.innerHTML = '';
};

// exports
module.exports = {
  element,
  setBackground,
  addText,
  clearText,
};
