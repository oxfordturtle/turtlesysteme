const create = require('../../dom/create');
const hex = require('../../dom/hex');

const output = create('pre');

const setBackground = (colour) => {
  output.style.background = hex(colour);
};

const addText = (text) => {
  output.innerHTML += text;
};

const clearText = () => {
  output.innerHTML = '';
};

module.exports = {
  output,
  setBackground,
  addText,
  clearText
};
