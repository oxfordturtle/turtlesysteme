/**
 * application state
 * -------------------------------------------------------------------------------------------------
 * the central hub for maintaining application state and communicating between different modules
 * -------------------------------------------------------------------------------------------------
 */

// local imports
const session = require('./session');
const compiler = require('./compiler');
const machine = require ('./machine');

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

// function to play/pause the machine
const playPause = () => {
  machine.status.paused === !machine.status.paused;
};

// function to halt the machine
const halt = () => {
  if (status.running) {
    // remove event listeners on the canvas and console
    machine.canvas.removeEventListeners();
    machine.console.removeEventListeners();
    // reset the canvas cursor
    machine.canvas.setCursor(1);
    // reset the machine status
    machine.status.running = false;
    machine.status.paused = false;
  }
};

// these two are needed here so that the window listeners can be removed from within the
// executeCode function
let detectFn;
let readlnFn;

// function for executing a block of code; this will execute as much code as possible, until
// codeCountMax or drawCountMax is reached (when it stops to ensure the canvas is updated), or
// until some appropriate command calls for execution delay (PAUSE, DETECT, READLN), or until
// the HALT command is encountered
const executeCode = (pcode, startLine, startCode, options) => {
  const { canvas, console, memory, output, status } = machine;
  // don't do anything if we're not running
  if (!status.running) return;
  // try again in 1 millisecond if the machine is paused
  if (status.paused) {
    setTimeout(executeCode, 1, pcode, startLine, startCode, options);
    return;
  }
  // prototype detect function
  const detectProto = (keyCode, timeoutID, nextLine, nextCode, event) => {
    const pressedKey = event.keyCode || event.charCode;
    if (pressedKey === keyCode) {
      memory.pop(); // remove the default assumption of false (i.e. key not pressed) ...
      memory.push(tools.boolint(true)); // and push true instead
      window.clearTimeout(timeoutID); // stop the default resumption of the program
      executeCode(pcode, nextLine, nextCode, options); // and carry on from here intead
    }
  };
  // prototype readln function
  const readlnProto = (nextLine, nextCode, event) => {
    const pressedKey = event.keyCode || event.charCode;
    if (pressedKey === 13) { // if ENTER is pressed
      memory.makeHeapString(memory.getReadln()); // put the readline contents on the heap
      memory.clearReadln(); // empty the readln contents
      executeCode(pcode, nextLine, nextCode, options); // and carry on the program
    } else if (pressedKey === 8) { // backspace
      memory.deleteFromReadln();
    } else { // anything else
      memory.addToReadln(String.fromCharCode(pressedKey)); // add the character to the line
    }
  };
  // draw count and code count
  let drawCount = 0;
  let codeCount = 0;
  // what code to execute next
  let line = startLine;
  let code = startCode;
  // in case of DETECT or READLN, remove the event listeners the first time we carry on with the
  // program execution after they have been called
  window.removeEventListener('keypress', detectFn);
  window.removeEventListener('keypress', readlnFn);
  // execute as much code as possible
  while (drawCount < options.drawCountMax && codeCount <= options.codeCountMax) {
    // misccellaneous variables needed to work things out on the fly
    let a;
    let b;
    let c;
    let d;
    // the big switch: do something, depending on the current pcode
    switch (pcode[line][code]) {
      // 0x0 - basic stack operations, boolean operators
      case pc.dupl:
        a = memory.pop();
        memory.push(a);
        memory.push(a);
        break;
      case pc.swap:
        b = memory.pop();
        a = memory.pop();
        memory.push(b);
        memory.push(a);
        break;
      case pc.rota:
        c = memory.pop();
        b = memory.pop();
        a = memory.pop();
        memory.push(b);
        memory.push(c);
        memory.push(a);
        break;
      case pc.incr:
        a = memory.pop();
        memory.push(a + 1);
        break;
      case pc.decr:
        a = memory.pop();
        memory.push(a - 1);
        break;
      case pc.not:
        a = memory.pop();
        memory.push(~a);
        break;
      case pc.and:
        b = memory.pop();
        a = memory.pop();
        memory.push(a & b);
        break;
      case pc.or:
        b = memory.pop();
        a = memory.pop();
        memory.push(a | b);
        break;
      case pc.xor:
        b = memory.pop();
        a = memory.pop();
        memory.push(a ^ b);
        break;
      // 0x1 - integer operators
      case pc.neg:
        a = memory.pop();
        memory.push(-a);
        break;
      case pc.abs:
        a = memory.pop();
        memory.push(Math.abs(a));
        break;
      case pc.sign:
        a = memory.pop();
        memory.push(Math.sign(a));
        break;
      case pc.rand:
        a = memory.pop();
        memory.push(Math.floor(Math.random() * Math.abs(a)));
        break;
      case pc.plus:
        b = memory.pop();
        a = memory.pop();
        memory.push(a + b);
        break;
      case pc.subt:
        b = memory.pop();
        a = memory.pop();
        memory.push(a - b);
        break;
      case pc.mult:
        b = memory.pop();
        a = memory.pop();
        memory.push(a * b);
        break;
      case pc.divr:
        b = memory.pop();
        a = memory.pop();
        memory.push(Math.round(a / b));
        break;
      case pc.div:
        b = memory.pop();
        a = memory.pop();
        memory.push(Math.floor(a / b));
        break;
      case pc.mod:
        b = memory.pop();
        a = memory.pop();
        memory.push(a % b);
        break;
      // 0x2 - pseudo-real operators
      case pc.divm:
        c = memory.pop();
        b = memory.pop();
        a = memory.pop();
        memory.push(Math.round((a / b) * c));
        break;
      case pc.sqrt:
        b = memory.pop();
        a = memory.pop();
        memory.push(Math.round(Math.sqrt(a) * b));
        break;
      case pc.hyp:
        c = memory.pop();
        b = memory.pop();
        a = memory.pop();
        memory.push(Math.round(Math.sqrt((a * a) + (b * b)) * c));
        break;
      case pc.root:
        d = memory.pop();
        c = memory.pop();
        b = memory.pop();
        a = memory.pop();
        memory.push(Math.round(((a / b) ** (1 / c)) * d));
        break;
      case pc.powr:
        d = memory.pop();
        c = memory.pop();
        b = memory.pop();
        a = memory.pop();
        memory.push(Math.round(((a / b) ** c) * d));
        break;
      case pc.log:
        c = memory.pop();
        b = memory.pop();
        a = memory.pop();
        memory.push(Math.round((Math.log(a / b) / Math.LN10) * c));
        break;
      case pc.alog:
        c = memory.pop();
        b = memory.pop();
        a = memory.pop();
        memory.push(Math.round((10 ** (a / b)) * c));
        break;
      case pc.ln:
        c = memory.pop();
        b = memory.pop();
        a = memory.pop();
        memory.push(Math.round(Math.log(a / b) * c));
        break;
      case pc.exp:
        c = memory.pop();
        b = memory.pop();
        a = memory.pop();
        memory.push(Math.round(Math.exp(a / b) * c));
        break;
      case pc.sin:
        d = memory.pop();
        c = memory.pop();
        b = memory.pop();
        a = ((b / c) * (2 * Math.PI)) / canvas.getDegrees();
        memory.push(Math.round(Math.sin(a) * d));
        break;
      case pc.cos:
        d = memory.pop();
        c = memory.pop();
        b = memory.pop();
        a = ((b / c) * (2 * Math.PI)) / canvas.getDegrees();
        memory.push(Math.round(Math.cos(a) * d));
        break;
      case pc.tan:
        d = memory.pop();
        c = memory.pop();
        b = memory.pop();
        a = ((b / c) * (2 * Math.PI)) / canvas.getDegrees();
        memory.push(Math.round(Math.tan(a) * d));
        break;
      case pc.asin:
        d = memory.pop();
        c = memory.pop();
        b = memory.pop();
        a = canvas.getDegrees() / (2 * Math.PI);
        memory.push(Math.round(Math.asin(b / c) * d * a));
        break;
      case pc.acos:
        d = memory.pop();
        c = memory.pop();
        b = memory.pop();
        a = canvas.getDegrees() / (2 * Math.PI);
        memory.push(Math.round(Math.acos(b / c) * d * a));
        break;
      case pc.atan:
        d = memory.pop();
        c = memory.pop();
        b = memory.pop();
        a = canvas.getDegrees() / (2 * Math.PI);
        memory.push(Math.round(Math.atan2(b, c) * d * a));
        break;
      case pc.pi:
        a = memory.pop();
        memory.push(Math.round(Math.PI * a));
        break;
      // 0x3 - string operators
      case pc.ctos:
        a = memory.pop();
        memory.makeHeapString(String.fromCharCode(a));
        break;
      case pc.itos:
        a = memory.pop();
        memory.makeHeapString(a.toString());
        break;
      case pc.hexs:
        b = memory.pop();
        a = memory.pop().toString(16).toUpperCase();
        while (a.length < b) {
          a = `0${a}`;
        }
        memory.makeHeapString(a);
        break;
      case pc.sval:
        c = memory.pop();
        b = memory.pop();
        a = memory.getHeapString(b);
        if (a[0] === '#') {
          d = Number.isNaN(parseInt(a.slice(1), 16)) ? c : parseInt(a.slice(1), 16);
        } else {
          d = Number.isNaN(parseInt(a, 10)) ? c : parseInt(a, 10);
        }
        memory.push(d);
        break;
      case pc.qtos:
        d = memory.pop();
        c = memory.pop();
        b = memory.pop();
        a = (b / c);
        memory.makeHeapString(a.toFixed(d));
        break;
      case pc.qval:
        c = memory.pop();
        b = memory.pop();
        a = memory.getHeapString(memory.pop());
        d = Number.isNaN(parseFloat(a)) ? c : parseFloat(a);
        memory.push(Math.round(d * b));
        break;
      case pc.scat:
        b = memory.getHeapString(memory.pop());
        a = memory.getHeapString(memory.pop());
        memory.makeHeapString(a + b);
        break;
      case pc.slen:
        a = memory.getHeapString(memory.pop());
        memory.push(a.length);
        break;
      case pc.case:
        b = memory.pop();
        a = memory.getHeapString(memory.pop());
        if (b > 0) {
          memory.makeHeapString(a.toUpperCase());
        } else if (b < 0) {
          memory.makeHeapString(a.toLowerCase());
        } else {
          memory.makeHeapString(a);
        }
        break;
      case pc.copy:
        c = memory.pop();
        b = memory.pop();
        a = memory.getHeapString(memory.pop());
        memory.makeHeapString(a.substr(b - 1, c));
        break;
      case pc.dels:
        d = memory.pop();
        c = memory.pop();
        b = memory.getHeapString(memory.pop());
        a = b.substr(0, c - 1) + b.substr((c - 1) + d);
        memory.makeHeapString(a);
        break;
      case pc.inss:
        d = memory.pop();
        c = memory.getHeapString(memory.pop());
        b = memory.getHeapString(memory.pop());
        a = c.substr(0, d - 1) + b + c.substr(d - 1);
        memory.makeHeapString(a);
        break;
      case pc.poss:
        b = memory.getHeapString(memory.pop());
        a = memory.getHeapString(memory.pop());
        memory.push(b.indexOf(a) + 1);
        break;
      case pc.repl:
        d = memory.pop();
        c = memory.getHeapString(memory.pop());
        b = memory.getHeapString(memory.pop());
        a = memory.getHeapString(memory.pop());
        if (d > 0) {
          while (d > 0) {
            a = a.replace(b, c);
            d -= 1;
          }
          memory.makeHeapString(a);
        } else {
          memory.makeHeapString(a.replace(new RegExp(b, 'g'), c));
        }
        break;
      // 0x4 - comparison operators
      case pc.eqal:
        b = memory.pop();
        a = memory.pop();
        memory.push(tools.boolint(a === b));
        break;
      case pc.noeq:
        b = memory.pop();
        a = memory.pop();
        memory.push(tools.boolint(a !== b));
        break;
      case pc.less:
        b = memory.pop();
        a = memory.pop();
        memory.push(tools.boolint(a < b));
        break;
      case pc.more:
        b = memory.pop();
        a = memory.pop();
        memory.push(tools.boolint(a > b));
        break;
      case pc.lseq:
        b = memory.pop();
        a = memory.pop();
        memory.push(tools.boolint(a <= b));
        break;
      case pc.mreq:
        b = memory.pop();
        a = memory.pop();
        memory.push(tools.boolint(a >= b));
        break;
      case pc.maxi:
        b = memory.pop();
        a = memory.pop();
        memory.push(Math.max(a, b));
        break;
      case pc.mini:
        b = memory.pop();
        a = memory.pop();
        memory.push(Math.min(a, b));
        break;
      case pc.seql:
        b = memory.getHeapString(memory.pop());
        a = memory.getHeapString(memory.pop());
        memory.push(tools.boolint(a === b));
        break;
      case pc.sneq:
        b = memory.getHeapString(memory.pop());
        a = memory.getHeapString(memory.pop());
        memory.push(tools.boolint(a !== b));
        break;
      case pc.sles:
        b = memory.getHeapString(memory.pop());
        a = memory.getHeapString(memory.pop());
        memory.push(tools.boolint(a < b));
        break;
      case pc.smor:
        b = memory.getHeapString(memory.pop());
        a = memory.getHeapString(memory.pop());
        memory.push(tools.boolint(a > b));
        break;
      case pc.sleq:
        b = memory.getHeapString(memory.pop());
        a = memory.getHeapString(memory.pop());
        memory.push(tools.boolint(a <= b));
        break;
      case pc.smeq:
        b = memory.getHeapString(memory.pop());
        a = memory.getHeapString(memory.pop());
        memory.push(tools.boolint(a >= b));
        break;
      case pc.smax:
        b = memory.getHeapString(memory.pop());
        a = memory.getHeapString(memory.pop());
        if (a > b) {
          memory.makeHeapString(a);
        } else {
          memory.makeHeapString(b);
        }
        break;
      case pc.smin:
        b = memory.getHeapString(memory.pop());
        a = memory.getHeapString(memory.pop());
        if (a < b) {
          memory.makeHeapString(a);
        } else {
          memory.makeHeapString(b);
        }
        break;
      // 0x5 - loading stack
      case pc.ldin:
        memory.push(pcode[line][code + 1]);
        code += 1;
        break;
      case pc.ldvg:
        memory.push(memory.getAddress(pcode[line][code + 1]));
        code += 1;
        break;
      case pc.ldvv:
        a = pcode[line][code + 1];
        b = pcode[line][code + 2];
        memory.push(memory.getPointer(a + 9, b));
        code += 2;
        break;
      case pc.ldvr:
        a = pcode[line][code + 1];
        b = pcode[line][code + 2];
        memory.push(memory.getAddress(memory.getPointer(a + 9, b)));
        code += 2;
        break;
      case pc.ldag:
        memory.push(pcode[line][code + 1]);
        code += 1;
        break;
      case pc.ldav:
        a = pcode[line][code + 1];
        b = pcode[line][code + 2];
        memory.push(memory.getAddress(a + 9) + b);
        code += 2;
        break;
      case pc.ldar:
        a = pcode[line][code + 1];
        b = pcode[line][code + 2];
        memory.push(memory.getPointer(a + 9, b));
        code += 2;
        break;
      case pc.lstr:
        code += 1;
        a = '';
        while (pcode[line][code] !== 0) {
          a += String.fromCharCode(pcode[line][code]);
          code += 1;
        }
        memory.makeHeapString(a);
        break;
      case pc.ldmt:
        memory.push(memory.getStackLength('memory') - 1);
        break;
      case pc.ldmb:
        a = pcode[line][code + 1];
        memory.push(memory.getAddress(a + 9));
        code += 1;
        break;
      // 0x6 - storing from stack
      case pc.zero:
        a = pcode[line][code + 1];
        b = pcode[line][code + 2];
        memory.setPointer(a + 9, b, 0);
        code += 2;
        break;
      case pc.stvg:
        a = pcode[line][code + 1];
        b = memory.pop();
        memory.setAddress(a, b);
        updateTurtleDisplay(a, b);
        code += 1;
        break;
      case pc.stvv:
        a = pcode[line][code + 1];
        b = pcode[line][code + 2];
        c = memory.pop();
        memory.setPointer(a + 9, b, c);
        code += 2;
        break;
      case pc.stvr:
        a = pcode[line][code + 1];
        b = pcode[line][code + 2];
        c = memory.getPointer(a + 9, b);
        d = memory.pop();
        memory.setAddress(c, d);
        updateTurtleDisplay(c, d);
        code += 2;
        break;
      case pc.star:
        a = pcode[line][code + 1];
        b = pcode[line][code + 2];
        c = memory.pop();
        memory.setPointer(a + 9, b, c);
        code += 2;
        break;
      case pc.stmt:
        a = memory.pop();
        memory.push(a, 'memory');
        break;
      case pc.stmb:
        a = pcode[line][code + 1];
        b = memory.pop();
        memory.setAddress(a + 9, b);
        updateTurtleDisplay(a + 9, b);
        code += 1;
        break;
      // 0x7 - pointer handling
      case pc.lptr:
        a = memory.pop();
        memory.push(memory.getAddress(a));
        break;
      case pc.sptr:
        b = memory.pop();
        a = memory.pop();
        memory.setAddress(b, a);
        updateTurtleDisplay(b, a);
        break;
      case pc.cptr:
        c = memory.pop(); // length
        b = memory.pop(); // target
        a = memory.pop(); // source
        memory.copy(a, b, c);
        break;
      case pc.zptr:
        b = memory.pop();
        a = memory.pop();
        memory.zero(a, b);
        break;
      case pc.test:
        // not yet implemented
        break;
      case pc.cstr:
        b = memory.pop(); // target
        a = memory.pop(); // source
        d = memory.getAddress(b - 1); // maximum length of target
        c = memory.getAddress(a); // length of source
        memory.copy(a, b, Math.min(c, d) + 1);
        break;
      // 0x8 - flow control
      case pc.jump:
        line = pcode[line][code + 1] - 1;
        code = -1;
        break;
      case pc.ifno:
        if (memory.pop() === 0) {
          line = pcode[line][code + 1] - 1;
          code = -1;
        } else {
          code += 1;
        }
        break;
      case pc.halt:
        halt();
        return;
      case pc.subr:
        memory.fixHeapGlobal();
        memory.push(line + 1, 'return');
        line = pcode[line][code + 1] - 1;
        code = -1;
        break;
      case pc.retn:
        line = memory.pop('return');
        code = -1;
        break;
      case pc.pssr:
        memory.push(pcode[line][code + 1], 'subroutine');
        code += 1;
        break;
      case pc.plsr:
        memory.pop('subroutine');
        break;
      case pc.psrj:
        memory.push(line + 1);
        break;
      case pc.plrj:
        memory.pop('return');
        line = (memory.pop() - 1);
        code = -1;
        break;
      // 0x9 - memory control (also some dummy codes)
      case pc.memc:
        a = pcode[line][code + 1];
        b = pcode[line][code + 2];
        c = memory.pop('memory');
        if (c + b > options.stackSize) { // heap overflow check
          halt();
          throw tools.error('machine01', 'stackOverflow');
        }
        memory.push(memory.getAddress(a + 9), 'memory');
        memory.setAddress(a + 9, c);
        updateTurtleDisplay(a + 9, c);
        memory.push(c + b, 'memory');
        code += 2;
        break;
      case pc.memr:
        memory.pop('memory');
        a = pcode[line][code + 1];
        b = memory.pop('memory');
        memory.push(memory.getAddress(a + 9), 'memory');
        memory.setAddress(a + 9, b);
        updateTurtleDisplay(a + 9, b);
        code += 2;
        break;
      case pc.hfix:
        memory.fixHeapTop();
        break;
      case pc.hclr:
        memory.clearHeapTop();
        break;
      case pc.hrst:
        if (memory.getHeapGlobal() > -1) {
          memory.resetHeapTop();
        }
        break;
      // 0xA - runtime flags, text output, debugging (also some dummy codes)
      case pc.pnup:
        memory.setPendown(false);
        break;
      case pc.pndn:
        memory.setPendown(true);
        break;
      case pc.udat:
        memory.setUpdate(true);
        drawCount = options.drawCountMax; // force update
        break;
      case pc.ndat:
        memory.setUpdate(false);
        break;
      case pc.kech:
        a = (memory.pop() === -1); // -1 for TRUE
        memory.setKeyecho(a);
        break;
      case pc.outp:
        c = (memory.pop() === -1); // -1 for TRUE
        b = memory.pop();
        a = (memory.pop() === -1); // -1 for TRUE
        if (a) {
          output.clearText();
        }
        output.setBackground(b);
        if (c) {
          output.show();
        } else {
          console.show();
        }
        break;
      case pc.cons:
        b = memory.pop();
        a = (memory.pop() === -1); // -1 for TRUE
        if (a) {
          console.clearText();
        }
        console.setBackground(b);
        break;
      case pc.trac:
        // not implemented -
        // just pop the top off the stack
        memory.pop();
        break;
      case pc.memw:
        // not implemented -
        // just pop the top off the stack
        memory.pop();
        break;
      case pc.dump:
        memory.dump();
        if (options.showMemory) {
          // dom.id("memoryTab").click(); ????
        }
        break;
      // 0xB - timing, input, text output
      case pc.time:
        a = new Date().getTime();
        a -= memory.getStartTime();
        memory.push(a);
        break;
      case pc.tset:
        a = new Date().getTime();
        b = memory.pop();
        memory.setStartTime(a - b);
        break;
      case pc.wait:
        a = memory.pop();
        code += 1;
        if (code === pcode[line].length) { // line wrap
          line += 1;
          code = 0;
        }
        setTimeout(executeCode, a, pcode, line, code, options);
        return;
      case pc.tdet:
        b = memory.pop(); // keycode to listen for
        a = memory.pop(); // time to wait before giving up
        memory.push(0); // assume false (i.e. key not pressed) by default
        code += 1;
        if (code === pcode[line].length) { // line wrap
          line += 1;
          code = 0;
        }
        // setup default continuation after maximum time has passed
        c = setTimeout(executeCode, a, pcode, line, code, options);
        // listen for keypress in the meantime
        detectFn = detectProto.bind(null, b, c, line, code);
        window.addEventListener('keyup', detectFn);
        return;
      case pc.inpt:
        a = memory.pop();
        if (a < 0) {
          memory.push(memory.getQuery(-a));
        } else {
          memory.push(memory.getKeys(a));
        }
        break;
      case pc.iclr:
        a = memory.pop();
        if (a < 0) {
          memory.setQuery(-a, -1);
        } else {
          memory.setKeys(a, -1);
        }
        break;
      case pc.bufr:
        a = memory.pop();
        if (a > 0) {
          memory.makeKeyBuffer(a);
        }
        break;
      case pc.read:
        a = memory.pop();
        memory.readFromBuffer(a);
        break;
      case pc.rdln:
        code += 1;
        if (code === pcode[line].length) {
          line += 1;
          code = 0;
        }
        // add listener to read key inputs (saved to global so it can be removed when it's finished)
        readlnFn = readlnProto.bind(null, pcode, line, code, options);
        window.addEventListener('keypress', readlnFn);
        return;
      case pc.prnt:
        c = memory.pop();
        b = memory.pop();
        a = memory.getHeapString(memory.pop());
        canvas.drawText(memory.getTurtle(), a, b, c);
        break;
      case pc.text:
        a = memory.getHeapString(memory.pop());
        console.addText(a);
        output.addText(a);
        break;
      case pc.newl:
        console.addText('\n');
        output.addText('\n');
        break;
      // 0xC - file handling (not implemented in version 11)
      // 0xD - canvas, turtle settings
      case pc.canv:
        d = memory.pop();
        c = memory.pop();
        b = memory.pop();
        a = memory.pop();
        canvas.setDimensions(a, b, c, d);
        memory.setPointer(0, 1, Math.round(a + (c / 2)));
        memory.setPointer(0, 2, Math.round(b + (d / 2)));
        memory.setPointer(0, 3, 0);
        memory.remember();
        drawCount = options.drawCountMax; // force update
        break;
      case pc.reso:
        b = memory.pop();
        a = memory.pop();
        if (Math.min(a, b) < options.smallSize) {
          a *= 2;
          b *= 2;
          canvas.setDoubled(true);
        }
        canvas.setResolution(a, b);
        canvas.blank(0xFFFFFF);
        drawCount = options.drawCountMax; // force update
        break;
      case pc.pixc:
        b = memory.pop();
        a = memory.pop();
        memory.push(canvas.pixcol(a, b));
        break;
      case pc.pixs:
        c = memory.pop();
        b = memory.pop();
        a = memory.pop();
        canvas.pixset(a, b, c);
        if (memory.getUpdate()) {
          drawCount += 1;
        }
        break;
      case pc.angl:
        a = memory.pop();
        b = Math.round(a + ((memory.getPointer(0, 3) * a) / canvas.getDegrees()));
        memory.setPointer(0, 3, b % a);
        canvas.setDegrees(a);
        break;
      case pc.curs:
        a = memory.pop();
        canvas.setCursor(a);
        break;
      case pc.home:
        a = canvas.getDimensions();
        b = a.startx + (a.sizex / 2);
        c = a.starty + (a.sizey / 2);
        memory.setPointer(0, 1, Math.round(b));
        memory.setPointer(0, 2, Math.round(c));
        memory.setPointer(0, 3, 0);
        memory.remember();
        break;
      case pc.setx:
        a = memory.pop();
        memory.setPointer(0, 1, a);
        memory.remember();
        break;
      case pc.sety:
        a = memory.pop();
        memory.setPointer(0, 2, a);
        memory.remember();
        break;
      case pc.setd:
        a = memory.pop();
        memory.setPointer(0, 3, a % canvas.getDegrees());
        break;
      case pc.thik:
        a = memory.pop();
        memory.setPointer(0, 4, a);
        break;
      case pc.colr:
        a = memory.pop();
        memory.setPointer(0, 5, a);
        break;
      case pc.rgb:
        a = memory.pop();
        a %= 50;
        if (a <= 0) {
          a += 50;
        }
        a = colours[a - 1].value;
        memory.push(a);
        break;
      case pc.mixc:
        d = memory.pop();
        c = memory.pop();
        b = memory.pop();
        a = memory.pop();
        memory.push(tools.mixColours(a, b, c, d));
        break;
      // 0xE - turtle movement
      case pc.toxy:
        b = memory.pop();
        a = memory.pop();
        memory.setPointer(0, 1, a);
        memory.setPointer(0, 2, b);
        memory.remember();
        break;
      case pc.mvxy:
        b = memory.pop();
        a = memory.pop();
        memory.setPointer(0, 1, memory.getPointer(0, 1) + a);
        memory.setPointer(0, 2, memory.getPointer(0, 2) + b);
        memory.remember();
        break;
      case pc.drxy:
        b = memory.pop();
        a = memory.pop();
        if (memory.getPendown()) {
          canvas.drawLine(memory.getTurtle(), a, b);
          if (memory.getUpdate()) {
            drawCount += 1;
          }
        }
        memory.setPointer(0, 1, memory.getPointer(0, 1) + a);
        memory.setPointer(0, 2, memory.getPointer(0, 2) + b);
        memory.remember();
        break;
      case pc.fwrd:
        c = memory.pop();
        b = memory.getPointer(0, 3);
        b = Math.cos((b * Math.PI) / (canvas.getDegrees() / 2));
        b = -Math.round(b * c);
        a = memory.getPointer(0, 3);
        a = Math.sin((a * Math.PI) / (canvas.getDegrees() / 2));
        a = Math.round(a * c);
        if (memory.getPendown()) {
          canvas.drawLine(memory.getTurtle(), a, b);
          if (memory.getUpdate()) {
            drawCount += 1;
          }
        }
        memory.setPointer(0, 1, memory.getPointer(0, 1) + a);
        memory.setPointer(0, 2, memory.getPointer(0, 2) + b);
        memory.remember();
        break;
      case pc.back:
        c = memory.pop();
        b = memory.getPointer(0, 3);
        b = Math.cos((b * Math.PI) / (canvas.getDegrees() / 2));
        b = Math.round(b * c);
        a = memory.getPointer(0, 3);
        a = Math.sin((a * Math.PI) / (canvas.getDegrees() / 2));
        a = -Math.round(a * c);
        if (memory.getPendown()) {
          canvas.drawLine(memory.getTurtle(), a, b);
          if (memory.getUpdate()) {
            drawCount += 1;
          }
        }
        memory.setPointer(0, 1, memory.getPointer(0, 1) + a);
        memory.setPointer(0, 2, memory.getPointer(0, 2) + b);
        memory.remember();
        break;
      case pc.left:
        a = memory.pop();
        b = memory.getPointer(0, 3);
        memory.setPointer(0, 3, (b - a) % canvas.getDegrees());
        break;
      case pc.rght:
        a = memory.pop();
        b = memory.getPointer(0, 3);
        memory.setPointer(0, 3, (b + a) % canvas.getDegrees());
        break;
      case pc.turn:
        b = memory.pop();
        a = memory.pop();
        c = tools.angle(a, b);
        c = Math.round((c * canvas.getDegrees()) / Math.PI / 2);
        memory.setPointer(0, 3, c % canvas.getDegrees());
        break;
      case pc.rmbr:
        memory.remember();
        break;
      case pc.frgt:
        a = memory.pop();
        memory.forget(a);
        break;
      // 0xF - shapes and fills, maximum integer
      case pc.poly:
        c = memory.pop();
        b = memory.getCoordsLength();
        a = (c > b) ? 0 : b - c;
        canvas.drawPolyline(memory.getTurtle(), memory.getCoords(a, b));
        if (memory.getUpdate()) {
          drawCount += 1;
        }
        break;
      case pc.pfil:
        c = memory.pop();
        b = memory.getCoordsLength();
        a = (c > b) ? 0 : b - c;
        canvas.drawPolygon(memory.getTurtle(), memory.getCoords(a, b));
        if (memory.getUpdate()) {
          drawCount += 1;
        }
        break;
      case pc.circ:
        a = memory.pop();
        canvas.drawCircle(memory.getTurtle(), a);
        if (memory.getUpdate()) {
          drawCount += 1;
        }
        break;
      case pc.blot:
        a = memory.pop();
        canvas.drawBlot(memory.getTurtle(), a);
        if (memory.getUpdate()) {
          drawCount += 1;
        }
        break;
      case pc.elps:
        b = memory.pop();
        a = memory.pop();
        canvas.drawEllipse(memory.getTurtle(), a, b);
        if (memory.getUpdate()) {
          drawCount += 1;
        }
        break;
      case pc.eblt:
        b = memory.pop();
        a = memory.pop();
        canvas.drawEllblot(memory.getTurtle(), a, b);
        if (memory.getUpdate()) {
          drawCount += 1;
        }
        break;
      case pc.box:
        d = (memory.pop() === -1); // -1 for TRUE
        c = memory.pop();
        b = memory.pop();
        a = memory.pop();
        canvas.drawBox(memory.getTurtle(), a, b, c, d);
        if (memory.getUpdate()) {
          drawCount += 1;
        }
        break;
      case pc.blnk:
        a = memory.pop();
        canvas.blank(a);
        if (memory.getUpdate()) {
          drawCount += 1;
        }
        break;
      case pc.rcol:
        c = memory.pop();
        b = memory.pop();
        a = memory.pop();
        canvas.recolour(a, b, c);
        if (memory.getUpdate()) {
          drawCount += 1;
        }
        break;
      case pc.fill:
        d = memory.pop();
        c = memory.pop();
        b = memory.pop();
        a = memory.pop();
        canvas.fill(a, b, c, d);
        if (memory.getUpdate()) {
          drawCount += 1;
        }
        break;
      case pc.mxin:
        memory.push((2 ** 31) - 1);
        break;
      default:
        break;
    }
    codeCount += 1;
    code += 1;
    if (!pcode[line]) {
      halt();
      throw tools.error('machine02', 'pcodeBadLine');
    }
    if (code === pcode[line].length) { // line wrap
      line += 1;
      code = 0;
    }
  }
  // setTimeout (with no delay) instead of direct recursion means the function will return and the
  // canvas will be updated
  setTimeout(executeCode, 0, pcode, line, code, options);
};

const run = (pcode, options) => {
  if (!machine.status.running) {
    // initialize the machine
    machine.setup(options.stackSize);
    // clear detect and readln function pointers
    detectFn = null;
    readlnFn = null;
    // execute the first block of code (which will in turn trigger execution of the next block)
    executeCode(pcode, 0, 0, options);
  }
};

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
      case 'compile-code':
        if (session.code.get().length > 0) {
          result = compiler.compile(session.code.get(), session.language.get());
          session.usage.set(result.usage, session.language.get());
          session.pcode.set(result.pcode, session.language.get());
          session.compiled.set(true, session.language.get());
          reply('usage-changed', result.usage);
          reply('pcode-changed', result.pcode);
          // use data argument to specify whether to run when compiled
          if (data) send('machine-run');
        }
        break;
      case 'machine-run':
        if (session.pcode.get().length > 0) {
          reply('machine-started');
          run();
        }
        break;
      case 'machine-halt':
        reply('machine-stopped');
        break;
      case 'machine-play-pause':
        if (machine.status.running) {
          if (machine.status.paused) {
            machine.status.paused = false;
            reply('machine-played');
          } else {
            machine.status.paused = true;
            reply('machine-paused');
          }
        }
        break;
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
  canvas: machine.canvas.element,
  console: machine.console.element,
  memory: machine.memory.element,
  output: machine.output.element,
  highlight: compiler.highlight,
};
