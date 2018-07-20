/**
 * the pcode display component
 */

// global imports
const { create } = require('dom');
const state = require('state');

// the options box
const options = create('div', {
  classes: [ 'tsx-pcode-options' ],
  content: 'options',
});

// the pcode table body
const tbody = create('tbody');

// the pcode table
const table = create('table', {
  classes: [ 'tsx-pcode-table' ],
  content: [
    create('thead', {
      content: '<tr><td></td><th>.1</th><th>.2</th><th>.3</th><th>.4</th><th>.5</th><th>.6</th><th>.7</th><th>.8</th></tr>',
    }),
    tbody,
  ],
});

// the main pcode element (includes the options box and the pcode table)
const element = create('div', { content: [ options, table ] });

// table cell from pcode
const td = code =>
  create('td', { content: code.toString(10) });

// table row from line of pcode
const tr = line =>
  create('tr', { content: line.map(td) });

// function to update the pcode table
const refresh = (pcode) => {
  tbody.innerHTML = '';
  pcode.map(tr).forEach((x) => tbody.appendChild(x));
};

// update with the current pcode, and subscribe to keep it in sync
refresh(state.getPCode());
state.on('pcode-changed', refresh);

// exports
module.exports = element;
