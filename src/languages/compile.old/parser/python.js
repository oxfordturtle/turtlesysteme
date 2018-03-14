// parser module for Turtle Python
// lexemes go in, array of routines (with their lexemes) comes out

/*jslint browser: true */
/*global define */

define(function () {

    "use strict";

    var error;
    var exists;
    var parser;

    error = function (errorId, messageId, lexeme) {
        var messages;
        messages = {
            comingSoon: "The online system cannot yet compile Turtle Python programs. Please "
                    + "compile your program in the downloadable system."
        };
        return {
            id: errorId,
            messageId: messageId,
            message: messages[messageId],
            lexeme: lexeme
        };
    };

    exists = function (routines, lexeme) {
        // WIP...
        return routines + lexeme;
    };

    parser = function (lexemes) {
        var ss;
        var routines;
        var lex;
        var routine;
        var state;
        ss = {
            start: 0,
            function: 1,
            def: 2,
            parameters: 3
        };
        routines = []; // array of routines (0 being the main program)
        lex = 0; // index of current lexeme
        state = ss.start;
        while (lex < lexemes.length) {
            switch (state) {
            case ss.start:
                if (lexemes[lex].type !== "def") {
                    throw error();
                }
                if (lexemes[lex].index !== 0) {
                    throw error();
                }
                if (!lexemes[lex + 1]) {
                    throw error();
                }
                lex += 1;
                if (lexemes[lex].type !== "identifier") {
                    throw error();
                }
                if (lexemes[lex].string !== "main") {
                    throw error();
                }
                if (lexemes[lex].line !== lexemes[lex - 1].line) {
                    throw error();
                }
                if (!lexemes[lex + 1]) {
                    throw error();
                }
                lex += 1;
                if (lexemes[lex].type !== "lbkt") {
                    throw error();
                }
                if (lexemes[lex].line !== lexemes[lex - 1].line) {
                    throw error();
                }
                if (!lexemes[lex + 1]) {
                    throw error();
                }
                lex += 1;
                if (lexemes[lex].type === "identifier") {
                    throw error();
                }
                if (lexemes[lex].type !== "rbkt") {
                    throw error();
                }
                if (lexemes[lex].line !== lexemes[lex - 1].line) {
                    throw error();
                }
                if (!lexemes[lex + 1]) {
                    throw error();
                }
                lex += 1;
                if (lexemes[lex].type !== "colon") {
                    throw error();
                }
                if (lexemes[lex].line !== lexemes[lex - 1].line) {
                    throw error();
                }
                routine = {
                    language: "Python",
                    name: "main",
                    index: 0,
                    variables: [],
                    constants: [], // empty, but needed by search functions
                    lexemes: []
                };
                routines.push(routine);
                lex += 1; // doesn't matter if there isn't one
                state = ss.function;
                break;
            case ss.function:
                if (routine.lexemes.length === 0) {
                    if (lexemes[lex].line === lexemes[lex - 1].line) {
                        throw error();
                    }
                    if (lexemes[lex].index === 0) {
                        throw error();
                    }
                    routine.indent = lexemes[lex].index;
                    break;
                }
                if (lexemes[lex].index < routine.indent) {
                    state = ss.def;
                    break;
                }
                if (lexemes[lex].type === "def") {
                    throw error();
                }
                routine.lexemes.push(lexemes[lex]);
                lex += 1;
                break;
            case ss.def:
                if (lexemes[lex].type !== "def") {
                    throw error(); // this is probably bad indenting
                }
                if (!lexemes[lex + 1]) {
                    throw error();
                }
                lex += 1;
                if (lexemes[lex].type !== "identifier") {
                    throw error();
                }
                if (exists(routines, lexemes[lex].string)) {
                    throw error();
                }
                routine = {
                    name: lexemes[lex].string,
                    type: "function",
                    level: -1, // needed by usage data table
                    returns: "undefined",
                    index: routines.length,
                    parameters: [],
                    variables: [],
                    constants: [], // empty, but needed by search functions
                    lexemes: []
                };
                routines.push(routine);
                if (!lexemes[lex + 1]) {
                    throw error();
                }
                lex += 1;
                if (lexemes[lex].type !== "lbkt") {
                    throw error();
                }
                state = ss.parameters;
                break;
            case ss.parameters:
                switch (lexemes[lex].type) {
                case "identifier":
                    // WIP...
                    break;
                case "rbkt":
                    if (!lexemes[lex + 1]) {
                        throw error();
                    }
                    lex += 1;
                    if (lexemes[lex].type !== "colon") {
                        throw error();
                    }
                    lex += 1; // doesn't matter if there isn't one
                    state = ss.function;
                    break;
                default:
                    throw error();
                }
                break;
            }
        }
    };

    return parser;

});