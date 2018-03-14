/**
 * the machine status bar (shown above the machine tabs)
 */
const create = require('../dom/create');
const hex = require('../dom/hex');
const signals = require('../state/signals');
const canvas = require('../machine/canvas');
const console = require('../machine/console');
const output = require('../machine/output');
require('../styles/topbar.scss');

// functions for interacting with the machine (via signals)
const run = signals.send.bind(null, 'machine-run');
const halt = signals.send.bind(null, 'machine-halt');
const play = signals.send.bind(null, 'machine-play');
const pause = signals.send.bind(null, 'machine-pause');

// buttons for interacting with the machine
const runOrHaltButton = create('button', { content: 'RUN', on: [{ type: 'click', callback: run }] });
const playOrPauseButton = create('button', { content: '&#10074;&#10074;' });

// current turtle properties display
const turtx = create('dd', { content: '500' });
const turty = create('dd', { content: '500' });
const turtd = create('dd', { content: '0' });
const turtt = create('dd', { content: '2' });
const turtc = create('dd', { style: 'background-color:#000;' });
const turtleDisplay = create('dl', {
  classes: ['tsx-turtle-properties'],
  content: [
    create('dt', { content: 'X' }),
    turtx,
    create('dt', { content: 'Y' }),
    turty,
    create('dt', { content: 'D' }),
    turtd,
    create('dt', { content: 'T' }),
    turtt,
    create('dt', { content: 'C' }),
    turtc,
  ],
});

// subscribe to keep buttons in sync with machine state
signals.on('machine-started', () => {
  runOrHaltButton.innerHTML = 'HALT';
  runOrHaltButton.removeEventListener('click', run);
  runOrHaltButton.addEventListener('click', halt);
  playOrPauseButton.innerHTML = 'pause';
  playOrPauseButton.addEventListener('click', pause);
});
signals.on('machine-stopped', () => {
  runOrHaltButton.innerHTML = 'RUN';
  runOrHaltButton.removeEventListener('click', run);
  runOrHaltButton.addEventListener('click', halt);
  playOrPauseButton.innerHTML = 'pause';
  playOrPauseButton.removeEventListener('click', pause);
  playOrPauseButton.removeEventListener('click', play);
});
signals.on('machine-played', () => {
  playOrPauseButton.innerHTML = '&#10074;&#10074;';
  playOrPauseButton.removeEventListener('click', play);
  playOrPauseButton.addEventListener('click', pause);
});
signals.on('machine-paused', () => {
  playOrPauseButton.innerHTML = '&#9658;';
  playOrPauseButton.removeEventListener('click', pause);
  playOrPauseButton.addEventListener('click', play);
});

// subscribe to keep turtle property display in sync with machine state
signals.on('turtle-changed', ({ property, value }) => {
  switch (property) {
    case 'x':
      turtx.innerHTML = value;
      break;
    case 'y':
      turty.innerHTML = value;
      break;
    case 'd':
      turtd.innerHTML = value;
      break;
    case 't':
      turtt.innerHTML = value;
      break;
    case 'c':
      turtc.style('background-color', hex(value));
      break;
    default:
      break;
  }
});

// controls for the machine
const controls = create('div', { classes: ['tsx-topbar'], content: [runOrHaltButton, playOrPauseButton, turtleDisplay] });

// export the HTML element for this component
module.exports = {
  controls,
  canvas: canvas.canvas,
  console: console.console,
  output: output.output,
};
