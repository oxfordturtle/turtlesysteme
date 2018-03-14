// parser module for Turtle Pascal
// lexemes go in, array of routines (with their lexemes) comes out

/*jslint browser: true */
/*global define */

define(function (require) {

    "use strict";

    var colours = require("data/colours");

    var error;
    var variableType;
    var matches;
    var exists;
    var find;
    var fixVariableType;
    var fixVariableTypes;
    var parser;

    error = function (errorId, messageId, lexeme) {
        var messages;
        messages = {
            // program errors
            progBegin: "Program must start with keyword 'PROGRAM'.",
            progName: "'PROGRAM' must be followed by a legal program name.",
            progTurtle: "Program cannot be given the name of a Turtle attribute.",
            progId: "'" + lexeme.string + "' is not a valid program name.",
            progSemi: "Program name must be followed by a semicolon.",
            progAfter: "No text found after program declaration.",
            progEnd: "Program must finish with 'END'.",
            progWeird: "Expected 'BEGIN', constant/variable definitions, or subroutine definitions.",
            progDot: "Program 'END' must be followed by a full stop.",
            progOver: "No text can appear after program 'END'.",
            // constant errors
            constVar: "Constants must be defined before any variables.",
            constSub: "Constants must be defined before any subroutines.",
            constName: "No constant name found.",
            constTurtle: "'" + lexeme.string + "' is the name of a predefined Turtle property, and "
                    + "cannot be used as a constant name.",
            constId: "'" + lexeme.string + "' is not a valid constant name.",
            constProg: "Constant name '" + lexeme.string + "' is already the name of the program.",
            constDupl: "'" + lexeme.string + "' is already the name of a constant in the current scope.",
            constDef: "Constant must be assigned a value.",
            constSubt: "'-' must be followed by a value.",
            constValue: "'" + lexeme.string + "' is not a valid constant value.",
            constSemi: "Constant declaration must be followed by a semicolon.",
            constAfter: "No program text found after constant declarations.",
            // variable errors
            varSub: "Variables must be defined before any subroutines.",
            varName: "No variable name found.",
            varTurtle: "'" + lexeme.string + "' is the name of a predefined Turtle property, and "
                    + "cannot be used as a variable name.",
            varId: "'" + lexeme.string + "' is not a valid variable name.",
            varProg: "Variable name '" + lexeme.string + "' is already the name of the program.",
            varDupl: "'" + lexeme.string + "' is already the name of a constant or variable in "
                    + "the current scope.",
            varType: "Variable name must be followed by a colon, then the variable type (integer, "
                    + "boolean, char, or string).",
            varBadType: "'" + lexeme.string + "' is not a valid variable type (expected 'integer', "
                    + "'boolean', 'char', or 'string').",
            varArray: "The online compiler does not support array variables. Please compile your "
                    + "program in the downloadable system.",
            varComma: "Comma missing between variable declarations.",
            varSemi: "Variable declaration(s) must be followed by a semicolon.",
            varAfter: "No text found after variable declarations.",
            // parameter errors
            parName: "No parameter name found.",
            parTurtle: "'" + lexeme.string + "' is the name of a predefined Turtle property, and "
                    + "cannot be used as a parameter name.",
            parId: "'" + lexeme.string + "' is not a valid parameter name.",
            parProg: "Parameter name '" + lexeme.string + "' is already the name of the program.",
            parDupl: "'" + lexeme.string + "' is already the name of a parameter for this subroutine.",
            parType: "Parameter name must be followed by a colon, then the parameter type "
                    + "(integer, boolean, char, or string).",
            parBadType: "'" + lexeme.string + "' is not a valid parameter type (expected 'integer', "
                    + "'boolean', 'char', or 'string').",
            parArray: "The online compiler does not support array parameters. Please compile "
                    + "your program in the downloadable system.",
            parComma: "Comma missing between parameters.",
            parAfter: "No text found after parameter declarations.",
            // subroutine errors
            subName: "No subroutine name found.",
            subTurtle: "'" + lexeme.string + "' is the name of a predefined Turtle property, and "
                    + "cannot be used as a subroutine name.",
            subId: "'" + lexeme.string + "' is not a valid subroutine name.",
            subProg: "Subroutine name '" + lexeme.string + "' is already the name of the program.",
            subDupl: "'" + lexeme.string + "' is already the name of a subroutine in the current "
                    + "scope.",
            subSemi: "Subroutine declaration must be followed by a semicolon.",
            subAfter: "No text found after subroutine declaration.",
            subBracket: "Subroutine parameters must be followed by a closing bracket.",
            subEnd: "Missing subroutine 'END'.",
            subEndSemi: "Semicolon needed after subroutine 'END'.",
            fnType: "Function must be followed by a colon, the the return type (integer, boolean, "
                    + "char, or string).",
            fnBadType: "'" + lexeme.string + "' is not a valid return type (expected 'integer', "
                    + "'boolean', 'char', or 'string').",
            fnArray: "Functions cannot return arrays."
        };
        return {
            id: errorId,
            messageId: messageId,
            message: messages[messageId],
            lexeme: lexeme
        };
    };

    variableType = function (type) {
        switch (type) {
        case "arr":
            return "array";
        case "bool":
            return "boolean";
        case "char":
            return "character";
        case "int":
            return "integer";
        case "str":
            return "string";
        }
    };

    matches = function (string, obj) {
        var name;
        name = obj.name || obj.names.pascal;
        return name === string;
    };

    exists = function (routine, string) {
        return routine.variables.some(matches.bind(null, string))
                || routine.constants.some(matches.bind(null, string));
    };

    find = function (name) {
        return colours.find(matches.bind(null, name));
    };

    fixVariableType = function (type, variable) {
        if (!variable.type) {
            variable.type = type;
            if (type === "string") {
                variable.length = 34; // 32 plus maximum length and actual length
            } else {
                variable.length = 0;
            }
        }
    };

    fixVariableTypes = function (routine, type) {
        routine.variables.forEach(fixVariableType.bind(null, type));
        return routine;
    };

    parser = function (lexemes) {
        var ss;
        var routines;
        var subStack;
        var subCount;
        var lex;
        var begins;
        var routine;
        var parent;
        var constant;
        var constMult;
        var variable;
        var predefined;
        var type;
        var state;
        var byref;
        ss = { // states
            start: 0,
            crossroads: 1,
            constant: 2,
            variable: 3,
            variableType: 4,
            subroutine: 5,
            parameter: 6,
            parameterType: 7,
            begin: 8,
            end: 9,
            finish: 10
        };
        routines = []; // array of routines (0 being the main program)
        subStack = []; // stack of routine indexes
        subCount = 0; // index of current routine
        lex = 0; // index of current lexeme
        begins = 0;
        state = ss.start;
        byref = false;
        while (lex < lexemes.length) {
            switch (state) {
            case ss.start:
                if (lexemes[lex].type !== "program") {
                    throw error("parser01", "progBegin", lexemes[lex]);
                }
                if (!lexemes[lex + 1]) {
                    throw error("parser02", "progName", lexemes[lex]);
                }
                lex += 1;
                if (lexemes[lex].type === "turtle") {
                    throw error("parser03", "progTurtle", lexemes[lex]);
                }
                if (lexemes[lex].type !== "identifier") {
                    throw error("parser04", "progId", lexemes[lex]);
                }
                if (!lexemes[lex + 1]) {
                    throw error("parser05", "progSemi", lexemes[lex]);
                }
                lex += 1;
                if (lexemes[lex].type !== "semicolon") {
                    throw error("parser06", "progSemi", lexemes[lex]);
                }
                routine = {
                    language: "Pascal",
                    name: lexemes[lex - 1].string,
                    index: 0,
                    constants: [],
                    variables: [],
                    subroutines: [],
                    lexemes: []
                };
                routines[0] = routine;
                subStack.push(routine);
                while (lexemes[lex].type === "semicolon") {
                    lex += 1;
                }
                if (!lexemes[lex]) {
                    throw error("parser07", "progAfter", lexemes[lex]);
                }
                state = ss.crossroads;
                break;
            case ss.crossroads:
                switch (lexemes[lex].type) {
                case "const":
                    if (routine.variables.length > 0) {
                        throw error("parser08", "constVar", lexemes[lex]);
                    }
                    if (routine.subroutines.length > 0) {
                        throw error("parser09", "constSub", lexemes[lex]);
                    }
                    if (!lexemes[lex + 1]) {
                        throw error("parser10", "constName", lexemes[lex]);
                    }
                    lex += 1;
                    state = ss.constant;
                    break;
                case "var":
                    if (routine.subroutines.length > 0) {
                        throw error("parser11", "varSub", lexemes[lex]);
                    }
                    if (!lexemes[lex + 1]) {
                        throw error("parser12", "varName", lexemes[lex]);
                    }
                    lex += 1;
                    state = ss.variable;
                    break;
                case "function": // fallthrough
                case "procedure":
                    state = ss.subroutine;
                    break;
                case "begin":
                    if (!lexemes[lex + 1]) {
                        throw error("parser13", "progEnd", lexemes[lex]);
                    }
                    lex += 1;
                    while (lexemes[lex].type === "semicolon") {
                        lex += 1;
                    }
                    state = ss.begin;
                    break;
                default:
                    throw error("parser14", "progWeird", lexemes[lex]);
                }
                break;
            case ss.constant:
                if (lexemes[lex].type === "turtle") {
                    throw error("parser15", "constTurtle", lexemes[lex]);
                }
                if (lexemes[lex].type !== "identifier") {
                    throw error("parser16", "constId", lexemes[lex]);
                }
                if (lexemes[lex].string === routines[0].name) {
                    throw error("parser17", "constProg", lexemes[lex]);
                }
                if (exists(routine, lexemes[lex].string)) {
                    throw error("parser18", "constDupl", lexemes[lex]);
                }
                constant = {name: lexemes[lex].string};
                if (!lexemes[lex + 1]) {
                    throw error("parser19", "constDef", lexemes[lex]);
                }
                lex += 1;
                if (lexemes[lex].type !== "eqal") {
                    throw error("parser20", "constDef", lexemes[lex]);
                }
                if (!lexemes[lex + 1]) {
                    throw error("parser21", "constDef", lexemes[lex]);
                }
                lex += 1;
                if (lexemes[lex].type === "subt") {
                    constMult = -1;
                    if (!lexemes[lex + 1]) {
                        throw error("parser21", "constSubt", lexemes[lex]);
                    }
                    lex += 1;
                } else {
                    constMult = 1;
                }
                predefined = find(lexemes[lex].string); // look for predefined constant
                if (predefined) {
                    constant.value = predefined.value * constMult;
                    constant.type = predefined.type;
                } else {
                    if (lexemes[lex].value === undefined) {
                        throw error("parser22", "constValue", lexemes[lex]);
                    }
                    constant.value = lexemes[lex].value * constMult;
                    constant.type = lexemes[lex].type;
                }
                if (!lexemes[lex + 1]) {
                    throw error("parser23", "constSemi", lexemes[lex]);
                }
                lex += 1;
                if (lexemes[lex].type !== "semicolon") {
                    throw error("parser24", "constSemi", lexemes[lex - 1]);
                }
                routine.constants.push(constant);
                while (lexemes[lex].type === "semicolon") {
                    lex += 1;
                }
                if (!lexemes[lex]) {
                    throw error("parser25", "constAfter");
                }
                if (lexemes[lex].type === "identifier") {
                    state = ss.constant;
                } else {
                    state = ss.crossroads;
                }
                break;
            case ss.variable:
                if (lexemes[lex].type === "turtle") {
                    throw error("parser26", "varTurtle", lexemes[lex]);
                }
                if (lexemes[lex].type !== "identifier") {
                    throw error("parser27", "varId", lexemes[lex]);
                }
                if (lexemes[lex].string === routines[0].name) {
                    throw error("parser28", "varProg", lexemes[lex]);
                }
                if (exists(routine, lexemes[lex].string)) {
                    throw error("parser29", "varDupl", lexemes[lex]);
                }
                variable = {
                    name: lexemes[lex].string,
                    routine: routine,
                    index: routine.variables.length
                };
                routine.variables.push(variable);
                if (!lexemes[lex + 1]) {
                    throw error("parser30", "varType", lexemes[lex]);
                }
                lex += 1;
                switch (lexemes[lex].type) {
                case "comma":
                    if (!lexemes[lex + 1]) {
                        throw error("parser31", "varName", lexemes[lex]);
                    }
                    lex += 1;
                    state = ss.variable;
                    break;
                case "colon":
                    if (!lexemes[lex + 1]) {
                        throw error("parser32", "varType", lexemes[lex]);
                    }
                    lex += 1;
                    state = ss.variableType;
                    break;
                case "identifier":
                    throw error("parser33", "varComma", lexemes[lex]);
                default:
                    throw error("parser34", "varType", lexemes[lex]);
                }
                break;
            case ss.variableType:
                type = variableType(lexemes[lex].type);
                if (!type) {
                    throw error("parser35", "varBadType", lexemes[lex]);
                }
                if (lexemes[lex].type === "arr") {
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
                if (type === "array") {
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

    return parser;

});