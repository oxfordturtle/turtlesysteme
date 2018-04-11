// parser module
// lexemes go in, array of routines (with their lexemes) comes out

/*jslint browser: true */
/*global define */

define(function (require) {

    "use strict";

    var parserBasic = require("./parser/basic");
    var parserPascal = require("./parser/pascal");
    var parserPython = require("./parser/python");

    var isFunction;
    var getTurtleAddress;
    var fixVariableAddresses;
    var parser;
    var init;

    isFunction = function (routine) {
        return (routine.type === "function");
    };

    getTurtleAddress = function (routines) {
        var pointers;
        var routineSpace;
        pointers = 10; // turtle, keybuffer, and 8 file slots
        routineSpace = routines.some(isFunction)
            ? routines.length
            : routines.length - 1;
        return (pointers + routineSpace);
    };

    fixVariableAddresses = function (routine) {
        var memory;
        memory = 0;
        routine.variables.forEach(function (variable) {
            memory += 1;
            variable.index = memory;
            memory += variable.length;
        });
        routine.memory = memory;
    };

    parser = function (lexemes, language) {
        var routines;
        try {
            switch (language) {
            case "BASIC":
                routines = parserBasic(lexemes);
                break;
            case "Pascal":
                routines = parserPascal(lexemes);
                break;
            case "Python":
                routines = parserPython(lexemes);
                break;
            }
        } catch (error) {
            throw error; // pass it up
        }
        routines[0].turtle = getTurtleAddress(routines);
        routines[0].memoryBase = routines[0].turtle + 5;
        routines.forEach(fixVariableAddresses);
        return routines;
    };

    init = function () {
        return parser;
    };

    return init();

});