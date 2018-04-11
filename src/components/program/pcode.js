/**
 * the pcode display component
 */
const { create } = require('dom');
const state = require('state');

const div = create('div');

const refresh = (pcode) => {
  div.innerHTML = JSON.stringify(pcode);
};

refresh(state.getPCode());
state.on('pcode-changed', refresh);

// expose the HTML element for this component
module.exports = div;
