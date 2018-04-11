// parser module for Turtle BASIC
// lexemes go in, array of routines (with their lexemes) comes out

/*jslint browser: true */
/*global define */

define(function (require) {

    "use strict";

    var statements = require("../pcoder/statements");

    var error;
    var matches;
    var exists;
    var varType;
    var varLength;
    var subType;
    var parser;

    error = function (errorId, messageId, lexeme) {
        var messages;
        messages = {
            // program errors
            progDef: "Subroutines must be defined after program 'END'.",
            progNoDim: "The online compiler does not support arrays. Please "
                    + "compile your program in the downloadable system.",
            progDim: "'DIM' statements must occur at the top of the program.",
            progPrivate: "Private variables cannot be defined in the main "
                    + "program.",
            progLocal: "Local variables cannot be defined in the main program.",
            progAfter: "No program text can appear after program 'END' (except "
                    + "subroutine definitions).",
            progNoEnd: "Program must finish with 'END'.",
            // subroutine errors
            subName: "'DEF' must be followed by a valid procedure or function "
                    + "name. (Procedure names must begin with 'PROC', and "
                    + "function names must begin with 'FN'.)",
            subBadName: "",
            subDim: "'DIM' statements can only occur within the main program. "
                    + "To declare a local or private array, use 'LOCAL' or "
                    + "'PRIVATE' instead.",
            subPrivate: "Private variables must be declared at the start "
                    + "of the subroutine.",
            subLocal: "Local variables must be declared at the start of "
                    + "the subroutine.",
            subDef: "The next subroutine must be defined after subroutine "
                    + "'ENDPROC'.",
            subEndFn: "Function must end with '=&lt;expression&gt;', not "
                    + "'ENDPROC'.",
            subEndProc: "Procedure must end with 'ENDPROC', not "
                    + "'=&lt;expression&gt;'.",
            subEmptyResult: "'=' must be followed by a return value.",
            subAfter: "No program text can appear after subroutine end "
                    + "(except further subroutine definitions).",
            subNoEndProc: "Procedure must finish with 'ENDPROC'.",
            subNoEndFunc: "Function must finish with '=&lt;expression$gt;'.",
            // paramater errors
            parName: "Parameter name expected.",
            parTurtle: "'" + lexeme.string + "' is the name of a Turtle "
                    + "property, and cannot be used as a parameter name.",
            parId: "'' is not a valid parameter name. Integer parameters "
                    + "must end with '%', and string parameters must end "
                    + "with '$'.",
            parDupl: "'" + lexeme.string + "' is already a parameter for "
                    + "this subroutine.",
            parBracket: "Closing bracket needed after parameters.",
            parComma: "Comma needed after parameter.",
            // variable errors
            varName: "Variable name expected.",
            varTurtle: "'" + lexeme.string + "' is the name of a Turtle "
                    + "property, and cannot be used as a variable name.",
            varId: "'' is not a valid variable name. Integer variables "
                    + "must end with '%', and string variables must end "
                    + "with '$'.",
            varDupl: "'" + lexeme.string + "' is already a variable in "
                    + "the current scope."
        };
        return {
            id: errorId,
            messageId: messageId,
            message: messages[messageId],
            lexeme: lexeme
        };
    };

    matches = function (string, obj) {
        var name;
        name = obj.name || obj.names.basic;
        return name === string;
    };

    exists = function (routine, string) {
        if (routine.variables.find(matches.bind(null, string))) {
            return true;
        }
        return false;
    };

    varType = function (string) {
        var reserved;
        reserved = [
            "UCASE$",
            "LCASE$",
            "DEL$",
            "LEFT$",
            "MID$",
            "RIGHT$",
            "INS$",
            "STR$",
            "QSTR$",
            "CHR$",
            "HEX$",
            "GETLINE$",
            "INPUT$",
            "GET$"
        ];
        if (string.slice(-1) === "%") {
            return "boolint";
        }
        if (string.slice(-1) === "$" && reserved.indexOf(string) === -1) {
            return "string";
        }
    };

    varLength = function (string) {
        if (string.slice(-1) === "%") {
            return 0;
        }
        if (string.slice(-1) === "$") {
            return 34;
        }
    };

    subType = function (string) {
        if (string.slice(0, 4) === "PROC") {
            return "procedure";
        }
        if (string.slice(0, 2) === "FN") {
            return "function";
        }
    };

    parser = function (lexemes) {
        var ss;
        var routines;
        var lex;
        var inProgram;
        var inProcedure;
        var inFunction;
        var routine;
        var variable;
        var fnResultLex;
        var fnResultLine;
        var fnResultExp;
        var state;
        ss = {
            start: 0,
            dim: 1,
            prog: 2,
            end: 3,
            def: 4,
            parameters: 5,
            variables: 6,
            private: 7,
            local: 8,
            subroutine: 9,
            result: 10
        };
        routines = []; // array of routines (0 being the main program)
        lex = 0; // index of current lexeme
        state = ss.start;
        while (lex < lexemes.length) {
            switch (state) {
            case ss.start:
                inProgram = true;
                inProcedure = false;
                inFunction = false;
                if (lexemes[lex].type === "def") {
                    throw error("parser01", "progDef", lexemes[lex]);
                }
                // the main program needs a name for the search functions -
                // make it illegal so it won't clash with any subroutine names
                routine = {
                    language: "BASIC",
                    name: "!",
                    index: 0,
                    variables: [],
                    constants: [], // empty, but needed by search functions
                    lexemes: []
                };
                routines.push(routine);
                if (lexemes[lex].type === "dim") {
                    state = ss.dim;
                } else {
                    state = ss.prog;
                }
                break;
            case ss.dim:
                throw error("parser02", "progNoDim", lexemes[lex]);
            case ss.prog:
                switch (lexemes[lex].type) {
                case "dim":
                    throw error("parser03", "progDim", lexemes[lex]);
                case "private":
                    throw error("parser04", "progPrivate", lexemes[lex]);
                case "local":
                    throw error("parser05", "progLocal", lexemes[lex]);
                case "def":
                    throw error("parser06", "progDef", lexemes[lex]);
                case "end":
                    lex += 1;
                    inProgram = false;
                    state = ss.end;
                    break;
                case "identifier":
                    if (varType(lexemes[lex].string)) {
                        if (!exists(routines[0], lexemes[lex].string)) {
                            variable = {
                                name: lexemes[lex].string,
                                type: varType(lexemes[lex].string),
                                length: varLength(lexemes[lex].string),
                                routine: routines[0]
                            };
                            routines[0].variables.push(variable);
                        }
                    }
                    routines[0].lexemes.push(lexemes[lex]);
                    lex += 1;
                    break;
                default:
                    routines[0].lexemes.push(lexemes[lex]);
                    lex += 1;
                }
                break;
            case ss.end:
                if (lexemes[lex]) {
                    if (lexemes[lex].type === "def") {
                        lex += 1;
                        state = ss.def;
                    } else {
                        if (routine.index === 0) {
                            throw error("parser07", "progAfter", lexemes[lex]);
                        } else {
                            throw error("parser08", "subAfter", lexemes[lex]);
                        }
                    }
                }
                break;
            case ss.def:
                if (!lexemes[lex]) {
                    throw error("parser09", "subName", lexemes[lex - 1]);
                }
                if (!subType(lexemes[lex].string)) {
                    throw error("parser10", "subBadName", lexemes[lex]);
                }
                routine = {
                    name: lexemes[lex].string,
                    type: subType(lexemes[lex].string),
                    level: -1, // needed by usage data table
                    index: routines.length,
                    parameters: [],
                    variables: [],
                    constants: [], // empty, but needed by search functions
                    lexemes: []
                };
                routines.push(routine);
                if (routine.type === "procedure") {
                    inProcedure = true;
                } else {
                    inFunction = true;
                    variable = {
                        name: "result",
                        routine: routine
                    };
                    routine.variables.push(variable);
                }
                if (!lexemes[lex + 1]) {
                    throw error("parser11", "subAfter", lexemes[lex]);
                }
                lex += 1;
                if (lexemes[lex].type === "lbkt") {
                    lex += 1;
                    state = ss.parameters;
                } else {
                    state = ss.variables;
                }
                break;
            case ss.parameters:
                if (lexemes[lex].type === "return") {
                    variable = {byref: true};
                    lex += 1;
                } else {
                    variable = {byref: false};
                }
                if (!lexemes[lex]) {
                    throw error("parser12", "parName", lexemes[lex - 1]);
                }
                if (lexemes[lex].type === "turtle") {
                    throw error("parser13", "parTurtle", lexemes[lex]);
                }
                if (!varType(lexemes[lex].string)) {
                    throw error("parser14", "parId", lexemes[lex]);
                }
                if (exists(routine, lexemes[lex].string)) {
                    throw error("parser15", "parDupl", lexemes[lex]);
                }
                variable.name = lexemes[lex].string;
                variable.type = varType(lexemes[lex].string);
                variable.length = varLength(lexemes[lex].string);
                variable.routine = routine;
                routine.parameters.push(variable);
                routine.variables.push(variable);
                if (!lexemes[lex + 1]) {
                    throw error("parser16", "parBracket", lexemes[lex]);
                }
                lex += 1;
                switch (lexemes[lex].type) {
                case "comma":
                    lex += 1;
                    break;
                case "identifier":
                    throw error("parser17", "parComma", lexemes[lex]);
                case "rbkt":
                    lex += 1;
                    state = ss.variables;
                    break;
                default:
                    throw error("parser18", "parBracket", lexemes[lex]);
                }
                break;
            case ss.variables:
                switch (lexemes[lex].type) {
                case "dim":
                    throw error("parser19", "subDim", lexemes[lex]);
                case "private":
                    lex += 1;
                    state = ss.private;
                    break;
                case "local":
                    lex += 1;
                    state = ss.local;
                    break;
                default:
                    state = ss.subroutine;
                }
                break;
            case ss.private:
                if (!lexemes[lex]) {
                    throw error("parser20", "varName", lexemes[lex - 1]);
                }
                if (lexemes[lex].type === "turtle") {
                    throw error("parser21", "varTurtle", lexemes[lex]);
                }
                if (!varType(lexemes[lex].string)) {
                    throw error("parser22", "varId", lexemes[lex]);
                }
                if (exists(routine, lexemes[lex].string)) {
                    throw error("parser23", "varDupl", lexemes[lex]);
                }
                variable = {
                    name: lexemes[lex].string,
                    type: varType(lexemes[lex].string),
                    length: varLength(lexemes[lex].string),
                    routine: routines[0], // make it effectively global
                    private: routine      // but flag it as private
                };
                routines[0].variables.push(variable);
                lex += 1;
                if (!lexemes[lex]) {
                    throw error("parser24", "subNoEnd", lexemes[lex - 1]);
                }
                switch (lexemes[lex].type) {
                case "comma":
                    lex += 1;
                    break;
                default:
                    state = ss.variables;
                }
                break;
            case ss.local:
                if (!lexemes[lex]) {
                    throw error("parser25", "varName", lexemes[lex - 1]);
                }
                if (lexemes[lex].type === "turtle") {
                    throw error("parser26", "varTurtle", lexemes[lex]);
                }
                if (!varType(lexemes[lex].string)) {
                    throw error("parser27", "varId", lexemes[lex]);
                }
                if (exists(routine, lexemes[lex].string)) {
                    throw error("parser28", "varDupl", lexemes[lex]);
                }
                variable = {
                    name: lexemes[lex].string,
                    type: varType(lexemes[lex].string),
                    length: varLength(lexemes[lex].string),
                    routine: routine
                };
                routine.variables.push(variable);
                if (!lexemes[lex + 1]) {
                    if (routine.type === "procedure") {
                        throw error("parser29", "subNoEndProc", lexemes[lex]);
                    } else {
                        throw error("parser30", "subNoEndFn", lexemes[lex]);
                    }
                }
                lex += 1;
                switch (lexemes[lex].type) {
                case "comma":
                    lex += 1;
                    break;
                default:
                    state = ss.variables;
                }
                break;
            case ss.subroutine:
                if (lexemes[lex].type === "dim") {
                    throw error("parser31", "subDim", lexemes[lex]);
                }
                if (lexemes[lex].type === "private") {
                    throw error("parser32", "subPrivate", lexemes[lex]);
                }
                if (lexemes[lex].type === "local") {
                    throw error("parser33", "subLocal", lexemes[lex]);
                }
                if (lexemes[lex].type === "def") {
                    throw error("parser34", "subDef", lexemes[lex]);
                }
                if (varType(lexemes[lex].string)) {
                    if (!exists(routines[0], lexemes[lex].string)) {
                        if (!exists(routine, lexemes[lex].string)) {
                            variable = {
                                name: lexemes[lex].string,
                                type: varType(lexemes[lex].string),
                                length: varLength(lexemes[lex].string),
                                routine: routines[0]
                            };
                            routines[0].variables.push(variable);
                        }
                    }
                }
                if (lexemes[lex].type === "endproc") {
                    if (routine.type === "procedure") {
                        lex += 1;
                        inProcedure = false;
                        state = ss.end;
                    } else {
                        throw error("parser35", "subEndFn", lexemes[lex]);
                    }
                } else if (lexemes[lex].line > lexemes[lex - 1].line && lexemes[lex].type === "eqal") {
                    if (routine.type === "function") {
                        routine.lexemes.push({
                            type: "identifier",
                            string: "result"
                        });
                        routine.lexemes.push(lexemes[lex]);
                        lex += 1;
                        state = ss.result;
                    } else {
                        throw error("parser36", "subEndProc", lexemes[lex]);
                    }
                } else {
                    routine.lexemes.push(lexemes[lex]);
                    lex += 1;
                }
                break;
            case ss.result:
                if (!lexemes[lex]) {
                    throw error("parser37", "subEmptyResult", lexemes[lex - 1]);
                }
                fnResultLex = routine.lexemes.length;
                fnResultLine = lexemes[lex].line;
                while (lexemes[lex] && lexemes[lex].line === fnResultLine) {
                    routine.lexemes.push(lexemes[lex]);
                    lex += 1;
                }
                try {
                    fnResultExp = statements.expression(
                        routines,
                        routine.index,
                        fnResultLex,
                        [],
                        "null",
                        "null"
                    );
                } catch (expressionError) {
                    throw expressionError; // pass it up
                }
                routine.variables[0].type = fnResultExp.type;
                routine.variables[0].length = (fnResultExp.type === "integer")
                    ? 0
                    : 34;
                routine.returns = fnResultExp.type;
                inFunction = false;
                state = ss.end;
                break;
            }
        }
        if (inProgram) {
            throw error("parser38", "progNoEnd", lexemes[lex - 1]);
        }
        if (inProcedure) {
            throw error("parser39", "subNoEndProc", lexemes[lex - 1]);
        }
        if (inFunction) {
            throw error("parser40", "subNoEndFn", lexemes[lex - 1]);
        }
        return routines;
    };

    return parser;

});