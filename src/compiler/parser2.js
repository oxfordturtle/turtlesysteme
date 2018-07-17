/* compiler/parser2
----------------------------------------------------------------------------------------------------
the first pass determines routines and a certain amount about variables, and the third pass
generates the actual pcode; this second small pass just determines the remaining bit of information
about variables, and then how much memory each routine needs

most of the analysis is language specific, handled by the basic/pascal/python
modules; this just does a couple of language-independent things at the end,
which are easier to do after the first pass is complete - namely:

 1) fix the addresses of the variables, and the total memory needed by a
    routine, which is much easier to do once we know what all the variables are
 2) fix the address of the global turtle variable (which depends on the number
    of subroutines, and whether any of them is a function
----------------------------------------------------------------------------------------------------
*/

const { atoms, find } = require('./tools');

// try to determine return value type (for Python)
const determineReturnType = (variable, routine, lex) => {
  // try to determine the type
  try {
    expression = atoms.expression(routine, lex, 'null', 'null', 'Python');
    variable.fulltype = factory.fulltype(expression.type);
  }
  // fail silently if we can't - any problems should be picked up later
  catch (ignore) {}
  return variable;
};

// determine the types for the variables of a routine (for Python)
const determineVariableTypes = (routines, index) => {
  var routine = routines[index];
  var lexemes = routine.lexemes;
  var lex = 0;
  var variable;
  var expression;
  // do what we can with the current routine
  while (lex < lexemes.length) {
    if (lexemes[lex].type === 'identifier') {
      variable = find.variable(routine, lexemes[lex].content, 'Python');
      if (variable && (variable.fulltype === null)) {
        lex += 1;
        // expecting '=' or 'in' (as in 'for [variable] in range...'
        if (lexemes[lex] && (lexemes[lex].content === 'in')) {
          variable.fulltype = factory.fulltype('integer');
          lex += 1;
        } else if (lexemes[lex] && (lexemes[lex].content === '=')) {
          lex += 1;
          // expecting an expression whose type we can figure out
          console.log(lexemes[lex]);
          if (lexemes[lex]) {
            try {
              expression = atoms.expression(routine, lex, 'null', 'null', 'Python');
              variable.fulltype = factory.fulltype(expression.type);
              lex = expression.lex;
            } catch (ignore) {
              // fail silently - doesn't matter for now
              lex += 1;
            }
          }
        }
      } else {
        lex += 1;
      }
    } else if (lexemes[lex].content === 'return') {
      variable = find.variable(routine, 'return', 'Python');
      lex += 1;
      if (lexemes[lex]) {
        try {
          expression = atoms.expression(routine, lex, 'null', 'null', 'Python');
          variable.fulltype = factory.fulltype(expression.type);
          lex = expression.lex;
        }
        catch (ignore) {
          // fail silently - doesn't matter for now
          lex += 1;
        }
      }
    } else {
      lex += 1;
    }
  }
  // now decide whether to do another routine, or stop here
  if (index === 0) {
    // 0th routine (main program) should be done first
    if (routines.length === 1) {
      // just stop here if there are no subroutines
      return routines;
    } else {
      // otherwise do subroutines, starting with the last
      return determineVariableTypes(routines, (routines.length - 1));
    }
  } else if (index > 1) {
    // we've just done a subroutine, now do the previous one
    return determineVariableTypes(routines, (index - 1));
  } else {
    // we've just done the first subroutine, so we're done
    return routines;
  }
};

// determine the types of the parameters of a routine (for Python)
const determineParameterTypes = function (routines, index) {
  var routine = routines[index];
  var lexemes = routine.lexemes;
  var lex = 0;
  var command;
  var par;
  var expression;
  // do what we can with the current routine
  while (lex < lexemes.length) {
    if (lexemes[lex].type === 'identifier') {
      command = find.customCommand(routine, lexemes[lex].string, 'Python');
      if (command && (command.parameters.length > 0)) {
        par = 0;
        // move past open bracket
        lex += 2;
        while (par < command.parameters.length) {
          try {
            expression = atoms.expression(routine, lex, 'null', 'null', 'Python');
            if (command.parameters[par].type === 'boolint') {
              command.parameters[par].type = expression.type;
              if (expression.type === 'str') {
                command.parameters[par].length = 34;
              }
            }
            lex = expression.lex + 1; // move past comma or right bracket
          } catch (ignore) {
            // fail silently; it doesn't matter for now - either it will be determined later, or if
            // it's left undetermined, the pcoder module will complain
          }
          par += 1;
        }
      }
    }
    lex += 1;
  }
  // now decide whether to do another routine, or stop here
  if (index === 1) {
    return routines;
  } else {
    return determineParameterTypes(routines, index - 1);
  }
};

// set the address of the variables for a routine, and determine how much memory it needs
const fixVariableMemory = (routine) => {
  let memoryNeeded = 0;
  routine.variables.forEach((variable) => {
    memoryNeeded += 1;
    variable.index = memoryNeeded;
    if (variable.fulltype && variable.fulltype.length !== null) {
      memoryNeeded += variable.fulltype.length;
    }
  });
  routine.memoryNeeded = memoryNeeded;
};

// base number of pointers (turtle, keybuffer, plus 8 file slots)
const basePointers = 10;

// subroutine pointers needed (number of subroutines, plus 1 for the return value if there's at
// least one function)
const subroutinePointers = subroutines =>
  subroutines.some(x => x.type === 'function') ? subroutines.length + 1 : subroutines.length;

// get the address of the turtle global variable (offset by the pointers)
const turtleAddress = subroutines =>
  basePointers + subroutinePointers(subroutines);

// the main parser2 function
const parser2 = (routines, language) => {
  const program = routines[0];
  const subroutines = routines.slice(1);
  if (language === 'BASIC') {
    // determine function return types
    // TODO
  }
  if (language === 'Python') {
    // determine variable types recursively (start at main program, then work through subroutines)
    determineVariableTypes(routines, 0);
    // determine parameter types recursively (start at last subroutine, then work backwards)
    if (routines.length > 1) determineParameterTypes(routines, routines.length - 1);
  }
  // now do some final calculations
  routines.forEach(fixVariableMemory);
  program.turtleAddress = turtleAddress(subroutines);
  // and return the array of routines
  return routines;
};

// expose the main function
module.exports = parser2;
