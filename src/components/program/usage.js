/**
 * the usage display component
 */
const create = require('../../dom/create');
const session = require('../../state/session');
const signals = require('../../state/signals');

const table = create('table');

const compile = create('button', {
  content: 'compile',
  on: [{ type: 'click', callback: signals.send.bind(null, 'compile-code') }]
});

const div = create('div', { content: [compile, table] });

const tr = (category) =>
  `<tr><td>${JSON.stringify(category)}</td></tr>`;

const refresh = (usage) => {
  usage.innerHTML = usage.map(tr);
};

refresh(session.usage.get());
signals.on('usage-changed', refresh);

// expose the HTML element for this component
module.exports = div;
