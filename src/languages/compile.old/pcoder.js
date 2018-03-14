// pcoder module
// array of routines goes in, pcode comes out

/*jslint browser: true */
/*global define */

define(function (require) {

    "use strict";

    var pc = require("data/12/pc");
    var values = require("./pcoder/values");
    var structures = require("./pcoder/structures");

    var isString;
    var setupGlobalString;
    var setupLocalString;
    var compileProgram;
    var compileRoutines;
    var pcoder;
    var init;

    isString = function (variable) {
        return (variable.type === "string");
    };

    setupGlobalString = function (variable) {
        var index;
        var pcode;
        index = variable.routine.memoryBase + variable.index;
        pcode = [];
        pcode.push(pc.ldag, index + 2, pc.stvg, index);
        pcode.push(pc.ldin, variable.length - 1, pc.stvg, index + 1);
        return pcode;
    };

    setupLocalString = function (variable) {
        var routine;
        var index;
        var pcode;
        routine = variable.routine.index + 9;
        index = variable.index;
        pcode = [];
        pcode.push(pc.ldav, routine, index + 2, pc.stvv, routine, index);
        pcode.push(pc.ldin, variable.length - 1, pc.stvv, routine, index + 1);
        return pcode;
    };

    compileProgram = function (routines, pcode, addresses) {
        if (routines.length > 1) { // maybe fix initial jump past subroutines
            pcode[addresses[0] - 2].push(pcode.length + 1);
        }
        try { // compile main program
            pcode = pcode.concat(structures(routines, 0, addresses, pcode.length));
        } catch (error) {
            throw error; // pass it up
        }
        pcode.push([pc.halt]); // add final command
        return pcode;
    };

    compileRoutines = function (routines, sub, pcode, addresses, language) {
        var pars;
        pars = routines[sub].parameters.length;
        pcode.push([pc.pssr, sub]); // start subroutine
        addresses.push(pcode.length); // store subroutine start line
        if (routines[sub].variables.length > 0) { // maybe deal with local vars
            // claim memory
            pcode.push([pc.memc, sub + 9, routines[sub].memory]);
            // initialise memory to zero
            pcode.push([pc.ldav, sub + 9, 1, pc.ldin, routines[sub].memory, pc.zptr]);
        }
        // maybe setup string variables
        pcode = pcode.concat(
            routines[sub].variables.filter(isString).map(setupLocalString)
        );
        if (pars > 0) { // maybe initialise parameters from stack
            pcode.push([]);
            while (pars > 0) {
                pcode[(pcode.length - 1)] = pcode[(pcode.length - 1)].concat(
                    values.storeVariable(routines[sub].parameters[pars - 1], true)
                );
                pars -= 1;
            }
        }
        try { // compile the subroutine commands
            pcode = pcode.concat(structures(routines, sub, addresses, pcode.length));
        } catch (error) {
            throw error; // pass it up
        }
        if (routines[sub].type === "function") { // store function result
            pcode.push([pc.ldvg, sub + 9, pc.stvg, routines.length + 9]);
        }
        if (routines[sub].variables.length > 0) { // release memory and finish
            pcode.push([pc.memr, sub + 9, pc.plsr, pc.retn]);
        } else { // or just finish
            pcode.push([pc.plsr, pc.retn]);
        }
        // compile main program if subroutines are all done
        if (sub + 1 >= routines.length) {
            return compileProgram(routines, pcode, addresses);
        }
        // otherwise continue compiling subroutines (recursively)
        return compileRoutines(routines, sub + 1, pcode, addresses, language);
    };

    pcoder = function (routines, language) {
        var turtlePointer;
        var keybufferPointer;
        var turtleProperties;
        var pcode;
        turtlePointer = 0;
        keybufferPointer = 1;
        turtleProperties = 5;
        pcode = [];
        pcode.push([ // first line (global memory)
            pc.ldin,
            routines[0].turtle,
            pc.dupl,
            pc.dupl,
            pc.ldin,
            turtlePointer,
            pc.sptr,
            pc.ldin,
            turtleProperties,
            pc.swap,
            pc.sptr,
            pc.incr,
            pc.ldin,
            turtleProperties + routines[0].memory,
            pc.zptr,
            pc.ldin,
            routines[0].memoryBase + routines[0].memory,
            pc.stmt
        ]);
        pcode.push([ // second line (program defaults)
            pc.home,
            pc.ldin,
            2,
            pc.thik,
            pc.ldin,
            32,
            pc.bufr,
            pc.ldin,
            keybufferPointer,
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
        ]);
        pcode = pcode.concat( // maybe setup string globals
            routines[0].variables.filter(isString).map(setupGlobalString)
        );
        if (routines.length > 1) { // maybe jump past subroutines
            pcode.push([pc.jump]); // jump line set later by compileProgram
        }
        if (routines.length > 1) {
            return compileRoutines(routines, 1, pcode, [], language);
        }
        return compileProgram(routines, pcode, []);
    };

    init = function () {
        return pcoder;
    };

    return init();

});