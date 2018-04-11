// find module
// for finding stuff, and figuring out what identifiers refer to

/*jslint browser: true */
/*global define */

define(function (require) {

    "use strict";

    var commands = require("data/commands");
    var colours = require("data/colours");
    var inputs = require("data/inputs");

    var matches;
    var something;
    var constant;
    var variable;
    var colour;
    var input;
    var customCommand;
    var nativeCommand;
    var anyCommand;
    var init;

    matches = function (name, language, object) {
        var objectName;
        objectName = (object.name || object.names[language.toLowerCase()]);
        return objectName === name;
    };

    something = function (routines, sub, haystack, name) {
        var language;
        var match;
        language = routines[0].language;
        match = false;
        switch (language) {
        case "BASIC":
            if (haystack === "subroutines") {
                return routines.find(matches.bind(null, name, language));
            } else { // search for constant or variable
                match = routines[sub][haystack].find(matches.bind(null, name, language));
                if (match || sub === 0) {
                    return match;
                }
                return something(routines, 0, haystack, name, language);
            }
        case "Pascal":
            match = routines[sub][haystack].find(matches.bind(null, name, language));
            if (match) {
                return match;
            }
            if (routines[sub].parent) {
                return something(routines, routines[sub].parent.index, haystack, name, language);
            }
            return false;
        }
    };

    constant = function (routines, sub, name) {
        return something(routines, sub, "constants", name);
    };

    variable = function (routines, sub, name) {
        var language;
        var turtle;
        language = routines[0].language;
        turtle = (language === "BASIC")
            ? ["TURTX%", "TURTY%", "TURTD%", "TURTT%", "TURTC%"]
            : ["turtx", "turty", "turtd", "turtt", "turtc"];
        if (turtle.indexOf(name) > -1) {
            return {
                turtle: turtle.indexOf(name) + 1,
                type: "integer"
            };
        }
        return something(routines, sub, "variables", name);
    };

    colour = function (name, language) {
        name = name.replace(/gray/, "grey"); // allow American spelling of "grey"
        name = name.replace(/GRAY/, "GREY");
        return colours.find(matches.bind(null, name, language));
    };

    input = function (name, language) {
        return inputs.find(matches.bind(null, name, language));
    };

    customCommand = function (routines, sub, name) {
        if (routines[sub].name === name) {
            return routines[sub]; // recursive call to self is fine
        }
        return something(routines, sub, "subroutines", name);
    };

    nativeCommand = function (name, language) {
        if (language === "BASIC") { // allow American spelling of "colour"
            name = name.replace(/^COLOR$/, "COLOUR");
        } else {
            name = name.replace(/^color$/, "colour");
        }
        return commands.find(matches.bind(null, name, language));
    };

    anyCommand = function (routines, sub, name, language) {
        return (customCommand(routines, sub, name) || nativeCommand(name, language));
    };

    init = function () {
        return {
            constant: constant,
            variable: variable,
            colour: colour,
            input: input,
            customCommand: customCommand,
            nativeCommand: nativeCommand,
            anyCommand: anyCommand
        };
    };

    return init();

});