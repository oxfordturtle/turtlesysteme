/**
 * the pcode display component
 */

// global imports
const { element } = require('dom');
const state = require('state');

// the options box
const options = element('div', {
  classes: [ 'tsx-pcode-options' ],
  content: 'options',
});

// the pcode table body
const tbody = element('tbody');

// the pcode table
const table = element('table', {
  classes: [ 'tsx-pcode-table' ],
  content: [
    element('thead', {
      content: '<tr><td></td><th>.1</th><th>.2</th><th>.3</th><th>.4</th><th>.5</th><th>.6</th><th>.7</th><th>.8</th></tr>',
    }),
    tbody,
  ],
});

// the main pcode element (includes the options box and the pcode table)
const pcode = element('div', { content: [ options, table ] });

// table cell from pcode
const td = code =>
  element('td', { content: code.toString(10) });

// table row from line of pcode
const tr = line =>
  element('tr', { content: line.map(td) });

// function to update the pcode table
const refresh = (pcode) => {
  tbody.innerHTML = '';
  pcode.map(tr).forEach((x) => tbody.appendChild(x));
};

// update with the current pcode, and subscribe to keep it in sync
refresh(state.getPCode());
state.on('pcode-changed', refresh);

// exports
module.exports = pcode;
