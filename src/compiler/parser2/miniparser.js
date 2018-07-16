/* compiler/pcoder/miniparser
----------------------------------------------------------------------------------------------------
for Pascal, everything can be determined on the first pass; however:

- for BASIC, function return types can only be determined by evaluating the return expression
- for Python, all variable and parameter types can only be determined by evaluating the first
  assignment expression

so this module works these things out, before running the main pcoder on the result
----------------------------------------------------------------------------------------------------
*/

// local imports
// ----------
const atoms = require('./atoms');
const find = require('./find');

// try to determine return value type (for Python)
// ----------
const determineReturnType = (variable, routine, lex) => {
  // try to determine the type
  try {
    expression = atoms.expression(routine, lex, 'null', 'null', 'Python');
    variable.type = expression.type;
    if (expression.type === 'str') {
      variable.length = 34;
    }
  }
  // fail silently if we can't - any problems should be picked up later
  catch (ignore) {}
  return variable;
};

// determine the types for the variables of a routine (for Python)
// ----------
const determineVariableTypes = (routines, index) => {
  var routine = routines[index];
  var lexemes = routine.lexemes;
  var lex = 0;
  var variable;
  var expression;
  // do what we can with the current routine
  while (lex < lexemes.length) {
    if (lexemes[lex].type === 'identifier') {
      variable = find.variable(routine, lexemes[lex].string, 'Python');
      if (variable && (variable.type === 'boolint')) {
        lex += 1;
        // expecting '=' or 'in' (as in 'for [variable] in range...'
        if (lexemes[lex] && (lexemes[lex].type === 'in')) {
          variable.type = 'int';
          variable.length = 0;
          lex += 1;
        } else if (lexemes[lex] && (lexemes[lex].content === '=')) {
          lex += 1;
          // expecting an expression whose type we can figure out
          if (lexemes[lex]) {
            try {
              expression = atoms.expression(routine, lex, 'null', 'null', 'Python');
              variable.type = expression.type;
              if (expression.type === 'str') {
                variable.length = 34;
              }
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
          variable.type = expression.type;
          if (expression.type === 'str') {
            variable.length = 34;
          }
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

// determine the types of the parameters of a routine
// ----------
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

// the main miniparser function
// ----------
const miniparser = (routines, language) => {
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
  // return the routines, now fixed accordingly
  return routines;
};

module.exports = miniparser;
