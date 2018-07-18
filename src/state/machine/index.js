/**
 * the virtual turtle machine
 * -------------------------------------------------------------------------------------------------
 * -------------------------------------------------------------------------------------------------
 */

// local imports
const canvas = require('./canvas');
const console = require('./console');
const memory = require('./memory');
const output = require('./output');
const tools = require('./tools');

// current machine status
const status = {
  running: false,
  paused: false,
};

// function to initialize the machine at the start of program execution
const setup = (stackSize) => {
  // set up the canvas
  canvas.setDimensions(0, 0, 1000, 1000);
  canvas.setResolution(1000, 1000);
  canvas.setDegrees(360);
  canvas.setDoubled(false);
  canvas.addEventListeners();
  // set up the console
  console.clearText();
  console.setBackground(0xFFFFFF);
  console.addEventListeners();
  // set up the output
  output.clearText();
  output.setBackground(0xFFFFFF);
  // set up the memory
  memory.setup(stackSize);
  // set up machine status
  status.running = true;
  status.paused = false;
};

// exports
module.exports = {
  canvas,
  console,
  memory,
  output,
  setup,
  status,
  tools,
};
