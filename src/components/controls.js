/**
 * the machine control bar
 * -------------------------------------------------------------------------------------------------
 * a RUN/HALT button, a PLAY/PAUSE button, and a display of the current turtle properties
 * -------------------------------------------------------------------------------------------------
 */

// global imports
const { create, hex } = require('dom');
const state = require('state');

// functions for interacting with the machine (via state)
const run = state.send.bind(null, 'compile-code', true);

const halt = state.send.bind(null, 'machine-halt');

const playPause = state.send.bind(null, 'machine-play-pause');

// buttons for interacting with the machine
const runOrHaltButton = create('button', {
  content: 'RUN',
  classes: ['tsx-run-halt-button'],
  on: [{ type: 'click', callback: run }],
});

const playOrPauseButton = create('button', {
  content: '&#10074;&#10074;',
  classes: ['tsx-play-pause-button'],
});

// current turtle properties display
const turtx = create('dd', { classes: ['tsx-turtxy'], content: '500' });

const turty = create('dd', { classes: ['tsx-turtxy'], content: '500' });

const turtd = create('dd', { classes: ['tsx-turtd'], content: '0' });

const turtt = create('dd', { classes: ['tsx-turttc'], content: '2' });

const turtc = create('dd', { classes: ['tsx-turttc'], style: 'background-color:#000;' });

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

// subscribe to keep buttons in sync with the machine state
state.on('machine-started', () => {
  runOrHaltButton.innerHTML = 'HALT';
  runOrHaltButton.removeEventListener('click', run);
  runOrHaltButton.addEventListener('click', halt);
  playOrPauseButton.innerHTML = '&#10074;&#10074;';
  playOrPauseButton.addEventListener('click', playPause);
});

state.on('machine-stopped', () => {
  runOrHaltButton.innerHTML = 'RUN';
  runOrHaltButton.removeEventListener('click', halt);
  runOrHaltButton.addEventListener('click', run);
  playOrPauseButton.innerHTML = '&#10074;&#10074;';
  playOrPauseButton.removeEventListener('click', playPause);
});

state.on('machine-played', () => {
  playOrPauseButton.innerHTML = '&#10074;&#10074;';
});

state.on('machine-paused', () => {
  playOrPauseButton.innerHTML = '&#9658;';
});

// subscribe to keep the turtle property display in sync with machine state
state.on('turtle-changed', ({ property, value }) => {
  switch (property) {
    case 1:
      turtx.innerHTML = value;
      break;
    case 2:
      turty.innerHTML = value;
      break;
    case 3:
      turtd.innerHTML = value;
      break;
    case 4:
      turtt.innerHTML = value;
      break;
    case 5:
      turtc.style.background = hex(value);
      break;
    default:
      break;
  }
});

// the controls div (exposed)
const controls =

// expose different control bars for different contexts; in fact there are no differences here, but
// it's written like this for consistency with the system bar, and in case differences are needed
// in a later update
module.exports = (context) => {
  switch (context) {
    default:
      return create('div', {
        classes: ['tsx-controls'],
        content: [runOrHaltButton, playOrPauseButton, turtleDisplay]
      });
  }
};
