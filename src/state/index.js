/**
 * the central hub for maintaining application state and communicating between different modules
 */
const session = require('./session');
const { compile } = require('compiler');

// a record of outgoing signals, with arrays for registering callbacks
const replies = {
  'language-changed': [],
  'file-changed': [],
  'name-changed': [],
  'code-changed': [],
  'usage-changed': [],
  'pcode-changed': [],
  'assembler-changed': [],
  'decimal-changed': [],
  'show-canvas-changed': [],
  'show-output-changed': [],
  'show-memory-changed': [],
  'draw-count-max-changed': [],
  'code-count-max-changed': [],
  'small-size-changed': [],
  'stack-size-changed': [],
  'draw-count-max-changed': [],
  'code-count-max-changed': [],
  'small-size-changed': [],
  'stack-size-changed': [],
  'group-changed': [],
  'simple-changed': [],
  'intermediate-changed': [],
  'advanced-changed': [],
  'machine-started': [],
  'turtle-changed': [],
  'machine-stopped': [],
  'machine-played': [],
  'machine-paused': [],
  'error': [],
};

// function (exposed) for registering callbacks in the replies record
const on = (signal, callback) => {
  if (replies[signal]) {
    replies[signal].push(callback);
  } else {
    console.log(`cannot register callback to undefined signal '${signal}'`); // for debugging
  }
};

// function for executing any registered callbacks following a state change
const reply = (signal, data) => {
  if (replies[signal]) {
    replies[signal].forEach(callback => callback(data));
  }
  if (signal === 'language-changed') {
    // if language has changed, reply that file has changed as well
    reply('file-changed', session.file.get());
  }
  if (signal === 'file-changed') {
    // if file has changed, reply that file properties have changed as well
    reply('name-changed', session.name.get());
    reply('code-changed', session.code.get());
    reply('usage-changed', session.usage.get());
    reply('pcode-changed', session.pcode.get());
  }
};

// an array of incoming signals
const signals = [
  'new-program',
  'save-program',
  'save-program-as',
  'set-language',
  'set-example',
  'set-file',
  'set-name',
  'set-code',
  'toggle-assembler',
  'toggle-decimal',
  'toggle-show-canvas',
  'toggle-show-output',
  'toggle-show-memory',
  'set-draw-count-max',
  'set-code-count-max',
  'set-small-size',
  'set-stack-size',
  'reset-machine-options',
  'set-group',
  'toggle-simple',
  'toggle-intermediate',
  'toggle-advanced',
  'compile-code',
  'machine-run',
  'machine-halt',
  'machine-play-pause'
];

// function (exposed) for "sending" signals to this module, instructing it to update the state
const send = (signal, data) => {
  let result;
  try {
    switch (signal) {
      case 'new-program':
        session.file.new();
        reply('file-changed', session.file.get());
        break;
      case 'save-program':
        // TODO
        break;
      case 'save-program-as':
        // TODO
        break;
      case 'set-language':
        session.language.set(data);
        reply('language-changed', session.language.get());
        break;
      case 'set-example':
        session.example.set(data);
        reply('file-changed', session.file.get());
        break;
      case 'set-file':
        session.file.set(data.filename, data.content);
        reply('language-changed', session.language.get());
        break;
      case 'set-name':
        session.name.set(data, session.language.get());
        reply('name-changed', session.name.get());
        break;
      case 'set-code':
        session.code.set(data, session.language.get());
        reply('code-changed', session.code.get());
        break;
      case 'compile-code':
        if (session.code.get().length > 0) {
          result = compile(session.code.get(), session.language.get());
          session.usage.set(result.usage, session.language.get());
          session.pcode.set(result.pcode, session.language.get());
          session.compiled.set(true, session.language.get());
          reply('usage-changed', result.usage);
          reply('pcode-changed', result.pcode);
        }
        break;
      case 'toggle-assembler':
        session.assembler.toggle();
        reply('assembler-changed', session.assembler.get());
        break;
      case 'toggle-decimal':
        session.decimal.toggle();
        reply('decimal-changed', session.decimal.get());
        break;
      case 'toggle-show-canvas':
        session.showCanvas.toggle();
        reply('show-canvas-changed', session.showCanvas.get());
        break;
      case 'toggle-show-output':
        session.showOutput.toggle();
        reply('show-output-changed', session.showOutput.get());
        break;
      case 'toggle-show-memory':
        session.showMemory.toggle();
        reply('show-memory-changed', session.showMemory.get());
        break;
      case 'set-draw-count-max':
        session.drawCountMax.set(data);
        reply('draw-count-max-changed', session.drawCountMax.get());
        break;
      case 'set-code-count-max':
        session.codeCountMax.set(data);
        reply('code-count-max-changed', session.codeCountMax.get());
        break;
      case 'set-small-size':
        session.smallSize.set(data);
        reply('small-size-changed', session.smallSize.get());
        break;
      case 'set-stack-size':
        session.stackSize.set(data);
        reply('stack-size-changed', session.stackSize.get());
        break;
      case 'reset-machine-options':
        session.machineOptions.reset();
        reply('draw-count-max-changed', session.drawCountMax.get());
        reply('code-count-max-changed', session.codeCountMax.get());
        reply('small-size-changed', session.smallSize.get());
        reply('stack-size-changed', session.stackSize.get());
        break;
      case 'set-group':
        session.group.set(data);
        reply('group-changed', session.group.get());
        break;
      case 'toggle-simple':
        session.simple.toggle();
        reply('simple-changed', session.simple.get());
        break;
      case 'toggle-intermediate':
        session.intermediate.toggle();
        reply('intermediate-changed', session.intermediate.get());
        break;
      case 'toggle-advanced':
        session.advanced.toggle();
        reply('advanced-changed', session.advanced.get());
        break;
      case 'machine-run':
        if (!session.compiled.get()) {
          send('compile-code');
        }
        reply('machine-started');
        run(session.pcode.get(), session.options.get());
        break;
      case 'machine-halt':
        reply('machine-stopped');
        break;
      case 'machine-play':
        reply('machine-played');
        break;
      case 'machine-pause':
        reply('machine-paused');
      default:
        console.log(`unknown signal '${signal}'`); // for debugging
        break;
    }
  } catch (error) {
    reply('error', error);
  }
};

module.exports = {
  on,
  signals,
  send,
  getName: session.name.get,
  getLanguage: session.language.get,
  getCode: session.code.get,
  getPCode: session.pcode.get,
  getUsage: session.usage.get,
  getShowCanvas: session.showCanvas.get,
  getShowOutput: session.showOutput.get,
  getShowMemory: session.showMemory.get,
};
