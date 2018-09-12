/**
 * the application components
 *
 * these are the HTML elements that make up the interface shown on the page
 */
const controls = require('./controls');
const help = require('./help');
const machine = require('./machine');
const program = require('./program');
const system = require('./system');

// export the components
module.exports = {
  controls,
  help,
  machine,
  program,
  system,
};
