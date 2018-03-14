/**
 * the pcode display component
 */
const create = require('../../dom/create');
const session = require('../../state/session');
const signals = require('../../state/signals');

const div = create('div');

const refresh = (pcode) => {
  div.innerHTML = JSON.stringify(pcode);
};

refresh(session.pcode.get());
signals.on('pcode-changed', refresh);

// expose the HTML element for this component
module.exports = div;
