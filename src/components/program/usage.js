/**
 * the usage display component
 */
const { create } = require('dom');
const state = require('state');

const table = create('table');

const compile = create('button', {
  content: 'compile',
  on: [{ type: 'click', callback: state.send.bind(null, 'compile-code') }]
});

const div = create('div', { content: [compile, table] });

const tr = (category) =>
  `<tr><td>${JSON.stringify(category)}</td></tr>`;

const refresh = (usage) => {
  usage.innerHTML = usage.map(tr);
};

refresh(state.getUsage());
state.on('usage-changed', refresh);

// expose the HTML element for this component
module.exports = div;
