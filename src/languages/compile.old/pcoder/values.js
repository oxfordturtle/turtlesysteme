// values module
// generate pcode for loading values (constants, literals, variables)

/*jslint browser: true */
/*global define */

define(function (require) {

    "use strict";

    var pc = require("data/12/pc");

    var charToCode;
    var loadValue;
    var loadVariable;
    var loadVariableAddress;
    var storeVariable;
    var init;

    charToCode = function (character) {
        return character.charCodeAt(0);
    };

    loadValue = function (type, value) {
        var pcode;
        switch (type) {
        case "string":
            pcode = [pc.lstr, value.length];
            pcode = pcode.concat(Array.from(value).map(charToCode));
            break;
        default:
            pcode = [pc.ldin, value];
        }
        return pcode;
    };

    loadVariable = function (variable) {
        if (variable.turtle) { // predefined turtle property
            return [
                pc.ldin,
                0,
                pc.lptr,
                pc.ldin,
                variable.turtle,
                pc.plus,
                pc.lptr
            ];
        }
        if (variable.routine.index === 0) { // global variable
            return [pc.ldvg, variable.routine.memoryBase + variable.index];
        }
        if (variable.byref) { // local reference variable
            return [pc.ldvr, variable.routine.index + 9, variable.index];
        }
        return [pc.ldvv, variable.routine.index + 9, variable.index]; // local value variable
    };

    loadVariableAddress = function (variable) {
        if (variable.turtle) { // predefined turtle property
            return [pc.ldin, 0, pc.lptr, pc.ldin, variable.turtle, pc.plus];
        }
        if (variable.routine.index === 0) { // global variable
            return [pc.ldag, variable.routine.memoryBase + variable.index];
        }
        return [pc.ldav, variable.routine.index + 9, variable.index]; // local variable
    };

    storeVariable = function (variable, parameter) {
        var pcode;
        pcode = [];
        if (variable.turtle) { // predefined turtle property
            pcode.push(pc.ldin, 0, pc.lptr);
            pcode.push(pc.ldin, variable.turtle, pc.plus);
            pcode.push(pc.sptr);
            return pcode;
        }
        if (variable.routine.index === 0) { // global variable
            if (variable.type === "string") {
                pcode.push(pc.ldvg);
                pcode.push(variable.routine.memoryBase + variable.index);
                pcode.push(pc.cstr);
            } else {
                pcode.push(pc.stvg);
                pcode.push(variable.routine.memoryBase + variable.index);
            }
            return pcode;
        }
        if (variable.type === "string") { // local variable
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

    init = function () {
        return {
            loadValue: loadValue,
            loadVariable: loadVariable,
            loadVariableAddress: loadVariableAddress,
            storeVariable: storeVariable
        };
    };

    return init();

});