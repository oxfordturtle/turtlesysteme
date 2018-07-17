/* compiler/tools/pcoder
--------------------------------------------------------------------------------

--------------------------------------------------------------------------------
*/

const pc = require('data/pc');
const find = require('./find');

// convert character to ASCII key code
// ----------
const charToCode = (character) =>
  character.charCodeAt(0);

// pcode for loading a literal value onto the stack
// ----------
const loadLiteralValue = (type, value) =>
  (type === 'str')
    ? [pc.lstr, value.length].concat(Array.from(value).map(charToCode))
    : [pc.ldin, value];

// pcode for loading an input keycode onto the stack
// ----------
const loadKeyValue = (input) =>
  loadLiteralValue('int', input.value);

// pcode for loading the value of an input variable onto the stack
// ----------
const loadQueryValue = (input) =>
  loadLiteralValue("int", input.value).concat(pc.inpt);

// pcode for loading the value of a variable onto the stack
// ----------
const loadVariableValue = (variable) => {
  // predefined turtle property
  if (variable.turtle) {
    return [pc.ldin, 0, pc.lptr, pc.ldin, variable.turtle, pc.plus, pc.lptr];
  }
  // global variable
  if (variable.routine.index === 0) {
    return [pc.ldvg, variable.routine.turtleAddress + 5 + variable.index];
  }
  // local reference variable
  if (variable.byref) {
    return [pc.ldvr, variable.routine.index + 9, variable.index];
  }
  // local value variable
  return [pc.ldvv, variable.routine.index + 9, variable.index];
};

// pcode for loading the address of a variable onto the stack
// ----------
const loadVariableAddress = (variable) => {
  // predefined turtle property
  if (variable.turtle) {
    return [pc.ldin, 0, pc.lptr, pc.ldin, variable.turtle, pc.plus];
  }
  // global variable
  if (variable.routine.index === 0) {
    return [pc.ldag, variable.routine.turtleAddress + 5 + variable.index];
  }
  // local variable
  return [pc.ldav, variable.routine.index + 9, variable.index];
};

// pcode for storing the value of a variable in memory
// ----------
const storeVariableValue = (variable, parameter) => {
  const pcode = [];
  // predefined turtle property
  if (variable.turtle) {
    pcode.push(pc.ldin, 0, pc.lptr);
    pcode.push(pc.ldin, variable.turtle, pc.plus);
    pcode.push(pc.sptr);
    return pcode;
  }
  // global variable
  if (variable.routine.index === 0) {
    if (variable.type === "str") {
      pcode.push(pc.ldvg);
      pcode.push(variable.routine.turtleAddress + 5 + variable.index);
      pcode.push(pc.cstr);
    } else {
      pcode.push(pc.stvg);
      pcode.push(variable.routine.turtleAddress + 5 + variable.index);
    }
    return pcode;
  }
  // local variable
  if (variable.type === 'str') {
    pcode.push(pc.ldvv, variable.routine.index + 9, variable.index);
    pcode.push(pc.cstr, pc.hclr);
  } else {
    if (variable.byref && !parameter) {
      pcode.push(pc.stvr);
    } else {
      pcode.push(pc.stvv);
    }
    pcode.push(variable.routine.index + 9, variable.index);
  }
  return pcode;
};

// pcode for loading return value of a function onto the stack
// ----------
const loadFunctionReturnValue = returnAddress =>
  [pc.ldvv, returnAddress, 1];

// pcode for an expression operator
// ----------
const applyOperator = type =>
  [pc[type]];

// pcode for a custom command call
// (applied after any arguments have been loaded onto the stack)
// ----------
const callCustomCommand = address =>
  [pc.subr, address];

// pcode for a native command call
// (applied after any arguments have been loaded onto the stack)
// ----------
const callNativeCommand = (command, routine, language) => {
  const turtleAddress = find.mainProgram(routine).turtleAddress;
  switch (command.code) {
    case pc.newt:
      return [pc.ldin, 0, pc.sptr];
    case pc.oldt:
      return [pc.ldin, turtleAddress, pc.ldin, 0, pc.sptr];
    case pc.incr: // fallthrough
    case pc.decr:
      return [pc.dupl, pc.lptr, command.code, pc.swap, pc.sptr];
    case pc.rndc:
      return [pc.rand, pc.incr, pc.rgb, pc.colr];
    case pc.rand:
      switch (language) {
        case 'BASIC':
          return [pc.rand, pc.incr];
        case 'Pascal':
          return [pc.rand];
        case 'Python':
          return [pc.swap, pc.dupl, pc.rota, pc.incr, pc.swap, pc.subt, pc.rand, pc.plus];
      }
      break;
    case pc.texl:
      return [pc.text, pc.newl];
    case pc.uppc:
      return [pc.ldin, 1, pc.case];
    case pc.lowc:
      return [pc.ldin, -1, pc.case];
    case pc.lefs:
      return [pc.ldin, 1, pc.swap, pc.copy];
    case pc.rgts:
      return [pc.swap, pc.dupl, pc.slen, pc.incr, pc.rota, pc.subt, pc.mxin, pc.copy];
    case pc.inss:
      switch (language) {
        case 'BASIC': // fallthrough
        case 'Python':
          return [pc.rota, pc.rota, pc.inss];
        case 'Pascal':
          return [pc.inss];
      }
      break;
    case pc.poss:
      switch (language) {
        case 'BASIC': // fallthrough
        case 'Python':
          return [pc.swap, pc.poss];
        case 'Pascal':
          return [pc.poss];
      }
      break;
    case pc.svd0:
      return [pc.ldin, 0, pc.sval];
    case pc.bool: // Python only - covert -1 to 1
      return [pc.abs];
    case pc.ilin:
      return [pc.text, pc.newl, pc.rdln];
    case pc.bufr:
      return [pc.bufr, pc.ldin, 1, pc.sptr, pc.hfix];
    default:
      return [command.code];
  }
};

// pcode for a conditional structure
// ----------
const conditional = (startLine, test, ifCode, elseCode) => {
  const offset = (elseCode.length > 0) ? 2 : 1;
  const startCode = [
    test.concat([pc.ifno, ifCode.length + startLine + offset])
  ];
  const middleCode = [
    [pc.jump, ifCode.length + elseCode.length + startLine + offset]
  ];
  return elseCode.length > 0
    ? startCode.concat(ifCode).concat(middleCode).concat(elseCode)
    : startCode.concat(ifCode);
};

// pcode for a FOR loop structure
// ----------
const forLoop = (startLine, variable, initial, final, compare, change, innerCode) => {
  const ifnoLine = innerCode.length + startLine + 4;
  const startCode = [
    initial,
    storeVariableValue(variable).concat(final),
    loadVariableValue(variable).concat([pc[compare], pc.ifno, ifnoLine])
  ];
  const endCode = [
    loadVariableValue(variable).concat([pc[change], pc.jump, startLine + 1])
  ];
  return startCode.concat(innerCode).concat(endCode);
};

// pcode for a REPEAT loop structure
// ----------
const repeatLoop = (startLine, test, innerCode) => {
  const endCode = [
    test.concat([pc.ifno, startLine])
  ];
  return innerCode.concat(endCode);
};

// pcode for a WHILE loop structure
// ----------
const whileLoop = (startLine, test, innerCode) => {
  const startCode = [
    test.concat([pc.ifno, innerCode.length + startLine + 2])
  ];
  const endCode = [
    [pc.jump, startLine]
  ];
  return startCode.concat(innerCode).concat(endCode);
};

// check if variable is string
// ----------
const isString = (variable) =>
  (variable.type === 'str');

// pcode for initialising a global string variable
// ----------
const setupGlobalString = (variable) => {
  const index = variable.routine.turtleAddress + 5 + variable.index;
  return [
    pc.ldag,
    index + 2,
    pc.stvg,
    index,
    pc.ldin,
    variable.length - 1,
    pc.stvg,
    index + 1
  ];
};

// pcode for initialising a local string variable
// ----------
const setupLocalString = (variable) => {
  const routine = variable.routine.index + 9;
  const index = variable.index;
  return [
    pc.ldav,
    routine,
    index + 2,
    pc.stvv,
    routine,
    index,
    pc.ldin,
    variable.length - 1,
    pc.stvv,
    routine,
    index + 1
  ];
};

// pcode for initialising subroutine memory
// ----------
const initialiseSubroutineMemory = (routine) => {
  const claimMemory = [pc.memc, routine.index + 9, routine.memoryNeeded];
  const zeroMemory = [pc.ldav, routine.index + 9, 1, pc.ldin, routine.memoryNeeded, pc.zptr];
  const stringVariables = routine.variables.filter(isString);
  const claimAndZero = [claimMemory, zeroMemory];
  return (stringVariables.length > 0)
    ? claimAndZero.concat(stringVariables.map(setupLocalString))
    : claimAndZero;
};

// load subroutine arguments from the stack
// ----------
const loadSubroutineArguments = (routine) => {
  const pars = routine.parameters.length;
  const result = [];
  while (pars > 0) {
    pars -= 1;
    result.push(storeVariableValue(routine.parameters[pars]));
  }
  return result;
};

// pcode for the start of a subroutine
// ----------
const subroutineStartCode = (routine) => {
  const firstLine = [[pc.pssr, routine.index]];
  const firstTwoLines = firstLine.concat(initialiseSubroutineMemory(routine));
  if (routine.variables.length > 0 && routine.parameters.length > 0) {
    return firstTwoLines.concat(loadSubroutineArguments(routine));
  }
  if (routine.variables.length > 0) {
    return firstTwoLines;
  }
  return firstLine;
};

// pcode for the end of a subroutine
// ----------
const subroutineEndCode = (routine) => {
  const subAddress = routine.index + 9;
  const fnResultAddress = find.mainProgram(routine).resultAddress;
  const storeFunctionResult = [pc.ldvg, subAddress, pc.stvg, fnResultAddress];
  const releaseMemory = [pc.memr, subAddress];
  const exit = [pc.plsr, pc.retn];
  if (routine.variables.length > 0 && routine.type === 'function') {
    return [storeFunctionResult, releaseMemory.concat(exit)];
  }
  if (routine.variables.length > 0) {
    return [releaseMemory.concat(exit)];
  }
  return [exit];
};

// pcode for a subroutine
// ----------
const subroutine = (routine, innerCode) => {
  const startCode = subroutineStartCode(routine);
  const endCode = subroutineEndCode(routine);
  return startCode.concat(innerCode).concat(endCode);
};

// pcode for the first line of a program (global memory setup)
// ----------
const setupGlobalMemory = (turtleAddress, memoryNeeded) =>
  ([
    pc.ldin,
    turtleAddress,
    pc.dupl,
    pc.dupl,
    pc.ldin,
    0, // address of the turtle pointer
    pc.sptr,
    pc.ldin,
    5, // number of turtle properties
    pc.swap,
    pc.sptr,
    pc.incr,
    pc.ldin,
    memoryNeeded + 5, // + 5 for the turtle properties
    pc.zptr,
    pc.ldin,
    turtleAddress + memoryNeeded + 5, // + 5 for the turtle properties
    pc.stmt
  ]);

// pcode for the second line of a program (program defaults)
// ----------
const setupProgramDefaults = [
  pc.home,
  pc.ldin,
  2,
  pc.thik,
  pc.ldin,
  32,
  pc.bufr,
  pc.ldin,
  1, // address of the keybuffer pointer
  pc.sptr,
  pc.hfix,
  pc.ldin,
  0,
  pc.dupl,
  pc.ldin,
  1000,
  pc.dupl,
  pc.dupl,
  pc.dupl,
  pc.reso,
  pc.canv
];

// pcode for the start of the main program
// ----------
const programStartCode = (routine) => {
  const stringVariables = routine.variables.filter(isString);
  const startCode = [
    setupGlobalMemory(routine.turtleAddress, routine.memoryNeeded),
    setupProgramDefaults,
  ];
  // maybe setup global string variables
  if (stringVariables.length > 0) {
    startCode = startCode.concat(stringVariables.map(setupGlobalString));
  }
  return startCode;
};

// pcode for the main program
// ----------
const program = (routine, subroutinesCode, innerCode) => {
  const startCode = programStartCode(routine);
  const jumpLine = [[pc.jump, startCode.length + subroutinesCode.length + 2]];
  const endCode = [[pc.halt]];
  return (subroutinesCode.length > 1)
    ? startCode.concat(jumpLine).concat(subroutinesCode).concat(innerCode).concat(endCode)
    : startCode.concat(innerCode).concat(endCode);
};

module.exports = {
  loadLiteralValue,
  loadKeyValue,
  loadQueryValue,
  loadVariableValue,
  loadVariableAddress,
  storeVariableValue,
  applyOperator,
  loadFunctionReturnValue,
  callCustomCommand,
  callNativeCommand,
  conditional,
  forLoop,
  repeatLoop,
  whileLoop,
  subroutineStartCode,
  subroutine,
  programStartCode,
  program,
};
