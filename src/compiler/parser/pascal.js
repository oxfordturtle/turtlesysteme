/* languages/parser/pascal
--------------------------------------------------------------------------------
parser for Turtle Pascal - lexemes go in, array of routines comes out; the first
element in the array is the main PROGRAM object

look at the factory module to see what the PROGRAM object (and its components)
look like

this analyses the structure of the program, and builds up lists of all the
constants, variables, and subroutines (with their variables and parameters) -
lexemes for the program (and any subroutine) code themselves are just stored
for subsequent handling by the pcoder
--------------------------------------------------------------------------------
*/

const { colours, inputs } = require('data');
const factory = require('./factory');

const messages = (messageId, lexeme) => {
  switch (messageId) {
    // program errors
    case 'progBegin':
      return 'Program must start with keyword "PROGRAM".';
    case 'progName':
      return '"PROGRAM" must be followed by a legal program name.';
    case 'progTurtle':
      return 'Program cannot be given the name of a Turtle attribute.';
    case 'progId':
      return `"${lexeme.string}" is not a valid program name.`;
    case 'progSemi':
      return 'Program name must be followed by a semicolon.';
    case 'progAfter':
      return 'No text found after program declaration.';
    case 'progEnd':
      return 'Program must finish with "END".';
    case 'progWeird':
      return 'Expected "BEGIN", constant/variable definitions, or subroutine definitions.';
    case 'progDot':
      return 'Program "END" must be followed by a full stop.';
    case 'progOver':
      return 'No text can appear after program "END".';
    // constant errors
    case 'constVar':
      return 'Constants must be defined before any variables.';
    case 'constSub':
      return 'Constants must be defined before any subroutines.';
    case 'constName':
      return 'No constant name found.';
    case 'constTurtle':
      return `"${lexeme.string}" is the name of a predefined Turtle property, and cannot be used as a constant name.`;
    case 'constId':
      return `"${lexeme.string}" is not a valid constant name.`;
    case 'constProg':
      return `Constant name "${lexeme.string}" is already the name of the program.`;
    case 'constDupl':
      retun `"${lexeme.string}" is already the name of a constant in the current scope.`;
    case 'constDef':
      return 'Constant must be assigned a value.';
    case 'constSubt':
      return '"-" must be followed by a value.';
    case 'constValue':
      return `"${lexeme.string}" is not a valid constant value.`;
    case 'constSemi':
      return 'Constant declaration must be followed by a semicolon.';
    case 'constAfter':
     return 'No program text found after constant declarations.';
    // variable errors
    case 'varSub':
      return 'Variables must be defined before any subroutines.';
    case 'varName':
      return 'No variable name found.';
    case 'varTurtle':
      return `"${lexeme.string}" is the name of a predefined Turtle property, and cannot be used as a variable name.`;
    case 'varId':
      return `"${lexeme.string}" is not a valid variable name.`;
    case 'varProg':
      return `Variable name "${lexeme.string}" is already the name of the program.`;
    case 'varDupl':
      return `"${lexeme.string}" is already the name of a constant or variable in the current scope.`;
    case 'varType':
      return 'Variable name must be followed by a colon, then the variable type (integer, boolean, char, or string).';
    case 'varBadType':
      return `"${lexeme.string}" is not a valid variable type (expected "integer", "boolean", "char", or "string").`;
    case 'varArray':
      return 'The online compiler does not support array variables. Please compile your program in the downloadable system.';
    case 'varComma':
      return 'Comma missing between variable declarations.';
    case 'varSemi':
      return 'Variable declaration(s) must be followed by a semicolon.';
    case 'varAfter':
      return 'No text found after variable declarations.';
    // parameter errors
    case 'parName':
      return 'No parameter name found.';
    case 'parTurtle':
      return `"${lexeme.string}" is the name of a predefined Turtle property, and cannot be used as a parameter name.`;
    case 'parId':
      return `"${lexeme.string}" is not a valid parameter name.`;
    case 'parProg':
      return `Parameter name "${lexeme.string}" is already the name of the program.`;
    case 'parDupl':
      return `"${lexeme.string}" is already the name of a parameter for this subroutine.`;
    case 'parType':
      return 'Parameter name must be followed by a colon, then the parameter type (integer, boolean, char, or string).';
    case 'parBadType':
      return `"${lexeme.string}" is not a valid parameter type (expected "integer", "boolean", "char", or "string").`;
    case 'parArray':
      return 'The online compiler does not support array parameters. Please compile your program in the downloadable system.';
    case 'parComma':
      return 'Comma missing between parameters.';
    case 'parAfter':
      return 'No text found after parameter declarations.';
    // subroutine errors
    case 'subName':
      return 'No subroutine name found.';
    case 'subTurtle':
      return `"${lexeme.string}" is the name of a predefined Turtle property, and cannot be used as a subroutine name.`;
    case 'subId':
      return `"${lexeme.string}" is not a valid subroutine name.`;
    case 'subProg':
      return `Subroutine name "${lexeme.string}" is already the name of the program.`;
    case 'subDupl':
      return `"${lexeme.string}" is already the name of a subroutine in the current scope.`;
    case 'subSemi':
      return 'Subroutine declaration must be followed by a semicolon.';
    case 'subAfter':
      return 'No text found after subroutine declaration.';
    case 'subBracket':
      return 'Subroutine parameters must be followed by a closing bracket.';
    case 'subEnd':
      return 'Missing subroutine "END".';
    case 'subEndSemi':
      return 'Semicolon needed after subroutine "END".';
    case 'fnType':
      return 'Function must be followed by a colon, the the return type (integer, boolean, char, or string).';
    case 'fnBadType':
      return `"${lexeme.string}" is not a valid return type (expected "integer", "boolean", "char", or "string").`;
    case 'fnArray':
      return 'Functions cannot return arrays.';
  }
};

const error = (errorId, messageId, lexeme) =>
  ({
    id: errorId,
    messageId,
    message: message(messageId, lexeme),
    lexeme
  });

const matches = (string, obj) =>
  ((obj.name || obj.names.pascal) === string);

const exists = (routine, string) =>
  routine.variables.some(matches.bind(null, string))
    || routine.constants.some(matches.bind(null, string));

const colour = name =>
  colours.find(matches.bind(null, name));

const input = name =>
  inputs.find(matches.bind(null, name));

const fixVariableType = (type, variable) => {
  if (variable.type === null) {
    variable.type = type;
    variable.length = (type === 'string') ? 34 : 0;
  }
};

const fixVariableTypes = (routine, type) => {
  routine.variables.forEach(fixVariableType.bind(null, type));
};

const parser = (lexemes) => {
  const routines = []; // array of routines (0 being the main program)
  const routineStack = []; // stack of routine indexes
  let routineCount = 0; // index of current routine
  let lex = 0; // index of current lexeme
  let begins = 0;
  let state = 'start';
  let byref = false;
  let constMult = 1;
  while (lex < lexemes.length) {
    switch (state) {
      case 'start':
        if (lexemes[lex].content !== 'program') {
          throw error('parser01', 'progBegin', lexemes[lex]);
        }
        if (!lexemes[lex + 1]) {
          throw error('parser02', 'progName', lexemes[lex]);
        }
        lex += 1;
        if (lexemes[lex].ttype === 'turtle') {
          throw error('parser03', 'progTurtle', lexemes[lex]);
        }
        if (lexemes[lex].type !== 'identifier') {
          throw error('parser04', 'progId', lexemes[lex]);
        }
        if (!lexemes[lex + 1]) {
          throw error('parser05', 'progSemi', lexemes[lex]);
        }
        lex += 1;
        if (lexemes[lex].type !== 'semicolon') {
          throw error('parser06', 'progSemi', lexemes[lex]);
        }
        routine = factory.program(lexemes[lex - 1].content, 'Pascal');
        routines.push(routine);
        routineStack.push(routine);
        while (lexemes[lex].content === ';') {
          lex += 1;
        }
        if (!lexemes[lex]) {
          throw error('parser07', 'progAfter', lexemes[lex]);
        }
        state = 'crossroads';
        break;
      case 'crossroads':
        switch (lexemes[lex].content) {
          case 'const':
            if (routine.variables.length > 0) {
              throw error('parser08', 'constVar', lexemes[lex]);
            }
            if (routine.subroutines.length > 0) {
              throw error('parser09', 'constSub', lexemes[lex]);
            }
            if (!lexemes[lex + 1]) {
              throw error('parser10', 'constName', lexemes[lex]);
            }
            lex += 1;
            state = 'constant';
            break;
          case 'var':
            if (routine.subroutines.length > 0) {
              throw error('parser11', 'varSub', lexemes[lex]);
            }
            if (!lexemes[lex + 1]) {
              throw error('parser12', 'varName', lexemes[lex]);
            }
            lex += 1;
            state = 'variable';
            break;
          case 'function': // fallthrough
          case 'procedure':
            state = 'subroutine';
            break;
          case 'begin':
            if (!lexemes[lex + 1]) {
              throw error('parser13', 'progEnd', lexemes[lex]);
            }
            lex += 1;
            while (lexemes[lex].content === ';') {
              lex += 1;
            }
            state = 'begin';
            break;
          default:
            throw error('parser14', 'progWeird', lexemes[lex]);
          }
          break;
        case 'constant':
          if (lexemes[lex].ttype === 'turtle') {
            throw error('parser15', 'constTurtle', lexemes[lex]);
          }
          if (lexemes[lex].type !== 'identifier') {
            throw error('parser16', 'constId', lexemes[lex]);
          }
          if (lexemes[lex].content === routines[0].name) {
            throw error('parser17', 'constProg', lexemes[lex]);
          }
          if (exists(routine, lexemes[lex].content)) {
            throw error('parser18', 'constDupl', lexemes[lex]);
          }
          constant = factory.constant(lexemes[lex].content);
          if (!lexemes[lex + 1]) {
            throw error('parser19', 'constDef', lexemes[lex]);
          }
          lex += 1;
          if (lexemes[lex].content !== '=') {
            throw error('parser20', 'constDef', lexemes[lex]);
          }
          if (!lexemes[lex + 1]) {
            throw error('parser21', 'constDef', lexemes[lex]);
          }
          lex += 1;
          if (lexemes[lex].content === '-') {
            constMult = -1;
            if (!lexemes[lex + 1]) {
              throw error('parser21', 'constSubt', lexemes[lex]);
            }
            lex += 1;
          } else {
            constMult = 1;
          }
          if (lexemes[lex].ttype === 'colour') {
            predefined = colour(lexemes[lex].string);
            constant.value = predefined.value * constMult;
            constant.type = predefined.type;
          } else {
            if (lexemes[lex].value === undefined) {
              throw error('parser22', 'constValue', lexemes[lex]);
            }
            constant.value = lexemes[lex].value * constMult;
            constant.type = lexemes[lex].type;
          }
          if (!lexemes[lex + 1]) {
            throw error('parser23', 'constSemi', lexemes[lex]);
          }
          lex += 1;
          if (lexemes[lex].content !== ';') {
            throw error('parser24', 'constSemi', lexemes[lex - 1]);
          }
          routine.constants.push(constant);
          while (lexemes[lex].content === ';') {
            lex += 1;
          }
          if (!lexemes[lex]) {
            throw error('parser25', 'constAfter');
          }
          if (lexemes[lex].type === 'identifier') {
            state = 'constant';
          } else {
            state = 'crossroads';
          }
          break;
        case ss.variable:
          if (lexemes[lex].ttype === 'turtle') {
            throw error('parser26', 'varTurtle', lexemes[lex]);
          }
          if (lexemes[lex].type !== 'identifier') {
            throw error('parser27', 'varId', lexemes[lex]);
          }
          if (lexemes[lex].content === routines[0].name) {
            throw error('parser28', 'varProg', lexemes[lex]);
          }
          if (exists(routine, lexemes[lex].content)) {
            throw error('parser29', 'varDupl', lexemes[lex]);
          }
          variable = factory.variable(lexemes[lex].content, routine, false);
          routine.variables.push(variable);
          if (!lexemes[lex + 1]) {
            throw error('parser30', 'varType', lexemes[lex]);
          }
          lex += 1;
          if (lexemes[lex].type === 'identifier') {
            throw error('parser31', 'varComma', lexemes[lex]);
          } else if (lexemes[lex].content === ',') {
            if (!lexemes[lex + 1]) {
              throw error('parser31', 'varName', lexemes[lex]);
            }
            lex += 1;
            state = 'variable';
          } else if (lexemes[lex].content === ':') {
            if (!lexemes[lex + 1]) {
              throw error('parser32', 'varType', lexemes[lex]);
            }
            lex += 1;
            state = 'variableType';
          } else {
            throw error('parser34', 'varType', lexemes[lex]);
          }
          break;
        case ss.variableType:
            type = variableType(lexemes[lex].type);
            if (!type) {
                throw error("parser35", "varBadType", lexemes[lex]);
            }
            if (lexemes[lex].type === "array") {
                throw error("parser36", "varArray", lexemes[lex]);
            }
            routine = fixVariableTypes(routine, type);
            if (!lexemes[lex + 1]) {
                throw error("parser37", "varSemi", lexemes[lex]);
            }
            lex += 1;
            if (lexemes[lex].type !== "semicolon") {
                throw error("parser38", "varSemi", lexemes[lex]);
            }
            while (lexemes[lex].type === "semicolon") {
                lex += 1;
            }
            if (!lexemes[lex]) {
                throw error("parser39", "varAfter", lexemes[lex - 1]);
            }
            if (lexemes[lex].type === "identifier") {
                state = ss.variable;
            } else {
                state = ss.crossroads;
            }
            break;
        case ss.subroutine:
            if (!lexemes[lex + 1]) {
                throw error("parser40", "subName", lexemes[lex]);
            }
            lex += 1;
            if (lexemes[lex].type === "turtle") {
                throw error("parser41", "subTurtle", lexemes[lex]);
            }
            if (lexemes[lex].type !== "identifier") {
                throw error("parser42", "subId", lexemes[lex]);
            }
            if (lexemes[lex].string === routines[0].name) {
                throw error("parser43", "subProg", lexemes[lex]);
            }
            if (routines.some(matches.bind(null, lexemes[lex].string))) {
                throw error("parser44", "subDupl", lexemes[lex]);
            }
            parent = subStack[subStack.length - 1];
            routine = {
                name: lexemes[lex].string,
                type: lexemes[lex - 1].type,
                level: -1, // needed for usage data table
                parent: parent,
                constants: [],
                parameters: [],
                variables: [],
                subroutines: [],
                lexemes: []
            };
            if (routine.type === "function") {
                routine.variables.push({
                    name: "result",
                    byref: false,
                    routine: routine,
                    index: 0
                });
            }
            parent.subroutines.push(routine);
            subStack.push(routine);
            if (!lexemes[lex + 1]) {
                throw error("parser45", "subSemi", lexemes[lex]);
            }
            lex += 1;
            switch (lexemes[lex].type) {
            case "semicolon":
                while (lexemes[lex].type === "semicolon") {
                    lex += 1;
                }
                if (!lexemes[lex]) {
                    throw error("parser46", "subAfter", lexemes[lex]);
                }
                state = ss.crossroads;
                break;
            case "lbkt":
                if (!lexemes[lex + 1]) {
                    throw error("parser47", "parName", lexemes[lex]);
                }
                lex += 1;
                state = ss.parameter;
                break;
            default:
                throw error("parser48", "subSemi", lexemes[lex]);
            }
            break;
        case ss.parameter:
            if (lexemes[lex].type === "var") {
                byref = true;
                if (!lexemes[lex + 1]) {
                    throw error("parser49", "parName", lexemes[lex]);
                }
                lex += 1;
            }
            if (lexemes[lex].type === "turtle") {
                throw error("parser50", "parTurtle", lexemes[lex]);
            }
            if (lexemes[lex].type !== "identifier") {
                throw error("parser51", "parId", lexemes[lex]);
            }
            if (lexemes[lex].string === routines[0].name) {
                throw error("parser52", "parProg", lexemes[lex]);
            }
            if (exists(routine, lexemes[lex].string)) {
                throw error("parser53", "parDupl", lexemes[lex]);
            }
            variable = {
                name: lexemes[lex].string,
                byref: byref,
                routine: routine,
                index: routine.variables.length
            };
            routine.parameters.push(variable);
            routine.variables.push(variable);
            if (!lexemes[lex + 1]) {
                throw error("parser54", "parType", lexemes[lex]);
            }
            lex += 1;
            switch (lexemes[lex].type) {
            case "comma":
                if (!lexemes[lex + 1]) {
                    throw error("parser55", "parName", lexemes[lex]);
                }
                lex += 1;
                state = ss.parameter;
                break;
            case "colon":
                if (!lexemes[lex + 1]) {
                    throw error("parser56", "parType", lexemes[lex]);
                }
                byref = false;
                lex += 1;
                state = ss.parameterType;
                break;
            case "identifier":
                throw error("parser57", "parComma", lexemes[lex]);
            default:
                throw error("parser58", "parType", lexemes[lex]);
            }
            break;
        case ss.parameterType:
            type = variableType(lexemes[lex].type);
            if (!type) {
                throw error("parser59", "parBadType", lexemes[lex]);
            }
            if (lexemes[lex].type === "array") {
                throw error("parser60", "parArray", lexemes[lex]);
            }
            routine = fixVariableTypes(routine, type);
            if (!lexemes[lex + 1]) {
                throw error("parser61", "subBracket", lexemes[lex]);
            }
            lex += 1;
            switch (lexemes[lex].type) {
            case "semicolon":
                if (!lexemes[lex + 1]) {
                    throw error("parser62", "parName", lexemes[lex]);
                }
                while (lexemes[lex].type === "semicolon") {
                    lex += 1;
                }
                state = ss.parameter;
                break;
            case "rbkt":
                if (routine.type === "function") {
                    if (!lexemes[lex + 1]) {
                        throw error("parser63", "fnType", lexemes[lex]);
                    }
                    lex += 1;
                    if (lexemes[lex].type !== "colon") {
                        throw error("parser64", "fnType", lexemes[lex]);
                    }
                    if (!lexemes[lex + 1]) {
                        throw error("parser65", "fnType", lexemes[lex]);
                    }
                    lex += 1;
                    type = variableType(lexemes[lex].type);
                    if (!type) {
                        throw error("parser66", "fnBadType", lexemes[lex]);
                    }
                    if (type === "array") {
                        throw error("parser67", "fnArray", lexemes[lex]);
                    }
                    routine.returns = type;
                    routine.variables[0].type = type;
                }
                if (!lexemes[lex + 1]) {
                    throw error("parser68", "subSemi", lexemes[lex]);
                }
                lex += 1;
                if (lexemes[lex].type !== "semicolon") {
                    throw error("parser69", "subSemi", lexemes[lex]);
                }
                while (lexemes[lex].type === "semicolon") {
                    lex += 1;
                }
                if (!lexemes[lex]) {
                    throw error("parser70", "subAfter", lexemes[lex]);
                }
                state = ss.crossroads;
                break;
            default:
                throw error("parser71", "subBracket", lexemes[lex]);
            }
            break;
        case ss.begin:
            switch (lexemes[lex].type) {
            case "begin":
                routine.lexemes.push(lexemes[lex]);
                begins += 1;
                break;
            case "end":
                if (begins > 0) {
                    routine.lexemes.push(lexemes[lex]);
                    begins -= 1;
                } else {
                    state = ss.end;
                }
                break;
            default:
                routine.lexemes.push(lexemes[lex]);
            }
            if (state !== ss.end) {
                if (!lexemes[lex + 1]) {
                    throw error("parser72", "subEnd", lexemes[lex]);
                }
                lex += 1;
            }
            break;
        case ss.end:
            if (routine.index === 0) { // main program
                if (!lexemes[lex + 1]) {
                    throw error("parser73", "progDot", lexemes[lex]);
                }
                lex += 1;
                if (lexemes[lex].type !== "dot") {
                    throw error("parser74", "progDot", lexemes[lex]);
                }
                lex += 1;
                state = ss.finish;
            } else { // subroutine
                if (!lexemes[lex + 1]) {
                    throw error("parser75", "subEndSemi", lexemes[lex]);
                }
                lex += 1;
                if (lexemes[lex].type !== "semicolon") {
                    throw error("parser76", "subEndSemi", lexemes[lex]);
                }
                while (lexemes[lex].type === "semicolon") {
                    lex += 1;
                }
                if (!lexemes[lex]) {
                    throw error("parser77", "subAfter", lexemes[lex]);
                }
                subCount += 1;
                routine.index = subCount;
                routines.push(subStack.pop());
                routine = subStack[subStack.length - 1];
                state = ss.crossroads;
            }
            break;
        case ss.finish:
            throw error("parser78", "progOver", lexemes[lex]);
    }
  }
  return routines;
};

module.exports = parser;
