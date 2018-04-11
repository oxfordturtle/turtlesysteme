// statements module
// language-independent pcode generation

/*jslint browser: true */
/*global define */

define(function (require) {

    "use strict";

    var pc = require("data/12/pc");
    var find = require("./find");
    var values = require("./values");

    var typeError;
    var typeFnError;
    var error;
    var checkType;
    var expression;
    var simple;
    var term;
    var factor;
    var assignment;
    var command;
    var init;

    typeError = function (errorId, needed, found, lexeme) {
        return {
            id: errorId,
            messageId: "expType",
            message: "Type error: '" + needed + "' expected but '" + found + "' found.",
            lexeme: lexeme
        };
    };

    typeFnError = function (errorId, needed, found, lexeme) {
        return {
            id: errorId,
            messageId: "cmdFuncType",
            message: "Type error: '" + lexeme.string + "' returns '" + found + "' rather than '" + needed + "'.",
            lexeme: lexeme
        };
    };

    error = function (errorId, messageId, lexeme) {
        var messages;
        messages = {
            expBracket: "Closing bracket missing after expression.",
            expKeycode: "'" + lexeme.string + "' is not a valid keycode.",
            expQuery: "'" + lexeme.string + "' is not a valid input query.",
            expProcedure: "'" + lexeme.string + "' is a procedure, not a function.",
            expNotFound: "'" + lexeme.string + "' is not defined.",
            expWeird: "'" + lexeme.string + "' makes no sense here.",
            asgnConst: "'" + lexeme.string + "' is a constant, not a variable.",
            asgnNotFound: "'" + lexeme.string + "' is not defined.",
            asgnNothing: "'" + lexeme.string + "' must be followed by a value.",
            cmdNotFound: "Command '" + lexeme.string + "' is not defined.",
            cmdLeftBracket: "Opening bracket missing after command.",
            cmdNoArgs: "Command '" + lexeme.string + "' does not take any arguments.",
            cmdMissingArgs: "Arguments missing for command '" + lexeme.string + "'.",
            cmdBadRef: "Reference parameter should be a defined variable.",
            cmdComma: "Comma needed after parameter.",
            cmdTooFew: "Not enough arguments have been given for this command.",
            cmdTooMany: "Too many arguments have been given for this command.",
            cmdRightBracket: "Closing bracket missing after command arguments."
        };
        return {
            id: errorId,
            messageId: messageId,
            message: messages[messageId],
            lexeme: lexeme
        };
    };

    checkType = function (needed, found) {
        if ((needed === "null") || (found === needed)) {
            return true;
        }
        if ((needed === "string") && (found === "character")) {
            return true;
        }
        if (needed === "boolint") {
            if ((found === "boolean") || (found === "integer")) {
                return true;
            }
        }
        if (found === "boolint") {
            if ((needed === "boolean") || (needed === "integer")) {
                return true;
            }
        }
        return false;
    };

    expression = function (routines, sub, lex, addresses, sofar, needed) {
        var lexemes;
        var expTypes;
        var expStrTypes;
        var index;
        var operator;
        var pcode;
        var result;
        lexemes = routines[sub].lexemes;
        expTypes = ["eqal", "less", "lseq", "more", "mreq", "noeq"];
        expStrTypes = ["seql", "sles", "sleq", "smor", "smeq", "sneq"];
        if (needed === "boolean") {
            needed = "null";
        }
        try {
            result = simple(routines, sub, lex, addresses, sofar, needed);
        } catch (compError1) {
            throw compError1; // pass it up
        }
        sofar = result.type;
        lex = result.lex;
        pcode = result.pcode;
        while (lexemes[lex] && (expTypes.indexOf(lexemes[lex].type) > -1)) {
            if ((sofar === "string") || (sofar === "character")) {
                index = expTypes.indexOf(lexemes[lex].type);
                lexemes[lex].type = expStrTypes[index];
            }
            operator = lexemes[lex].type;
            lex += 1;
            try {
                result = simple(routines, sub, lex, addresses, sofar, needed);
            } catch (compError2) {
                throw compError2; // pass it up
            }
            sofar = result.type;
            lex = result.lex;
            pcode[pcode.length - 1] = pcode[pcode.length - 1].concat(result.pcode.shift());
            pcode = pcode.concat(result.pcode);
            pcode[pcode.length - 1].push(pc[operator]);
        }
        return {
            type: sofar,
            lex: lex,
            pcode: pcode
        };
    };

    simple = function (routines, sub, lex, addresses, sofar, needed) {
        var lexemes;
        var simpleTypes;
        var operator;
        var pcode;
        var result;
        lexemes = routines[sub].lexemes;
        simpleTypes = ["plus", "subt", "or", "xor"];
        try {
            result = term(routines, sub, lex, addresses, sofar, needed);
        } catch (compError1) {
            throw compError1; // pass it up
        }
        sofar = result.type;
        lex = result.lex;
        pcode = result.pcode;
        while (lexemes[lex] && (simpleTypes.indexOf(lexemes[lex].type) > -1)) {
            if ((sofar === "string") || (sofar === "character")) {
                if (lexemes[lex].type === "plus") {
                    lexemes[lex].type = "scat";
                }
            }
            operator = lexemes[lex].type;
            lex += 1;
            try {
                result = term(routines, sub, lex, addresses, sofar, needed);
            } catch (compError2) {
                throw compError2; // pass it up
            }
            sofar = result.type;
            lex = result.lex;
            pcode[pcode.length - 1] = pcode[pcode.length - 1].concat(result.pcode.shift());
            pcode = pcode.concat(result.pcode);
            pcode[pcode.length - 1].push(pc[operator]);
        }
        return {
            type: sofar,
            lex: lex,
            pcode: pcode
        };
    };

    term = function (routines, sub, lex, addresses, sofar, needed) {
        var lexemes;
        var termTypes;
        var operator;
        var pcode;
        var result;
        lexemes = routines[sub].lexemes;
        termTypes = ["and", "div", "divr", "mod", "mult"];
        try {
            result = factor(routines, sub, lex, addresses, sofar, needed);
        } catch (compError1) {
            throw compError1; // pass it up
        }
        sofar = result.type;
        lex = result.lex;
        pcode = result.pcode;
        while (lexemes[lex] && termTypes.indexOf(lexemes[lex].type) > -1) {
            operator = lexemes[lex].type;
            lex += 1;
            try {
                result = factor(routines, sub, lex, addresses, sofar, needed);
            } catch (compError2) {
                throw compError2; // pass it up
            }
            sofar = result.type;
            lex = result.lex;
            pcode[pcode.length - 1] = pcode[pcode.length - 1].concat(result.pcode.shift());
            pcode = pcode.concat(result.pcode);
            pcode[pcode.length - 1].push(pc[operator]);
        }
        return {
            type: sofar,
            lex: lex,
            pcode: pcode
        };
    };

    factor = function (routines, sub, lex, addresses, sofar, needed) {
        var language;
        var lexemes;
        var found;
        var operator;
        var pcode;
        var result;
        var constant;
        var variable;
        var colour;
        var input;
        var comm;
        language = routines[0].language;
        lexemes = routines[sub].lexemes;
        switch (lexemes[lex].type) {
        case "subt":
            found = "integer";
            if (!checkType(needed, found)) {
                throw typeError("exp01", needed, found, lexemes[lex]);
            }
            sofar = found;
            lexemes[lex].type = "neg"; // disambiguate
            operator = lexemes[lex].type;
            lex += 1;
            try {
                result = factor(routines, sub, lex, addresses, sofar, needed);
            } catch (compError1) {
                throw compError1; // pass it up
            }
            sofar = result.type;
            lex = result.lex;
            pcode = result.pcode;
            pcode[pcode.length - 1].push(pc[operator]);
            break;
        case "not":
            found = "boolint";
            if (!checkType(needed, found)) {
                throw typeError("exp02", needed, found, lexemes[lex]);
            }
            sofar = found;
            operator = lexemes[lex].type;
            lex += 1;
            try {
                result = factor(routines, sub, lex, addresses, sofar, needed);
            } catch (compError2) {
                throw compError2; // pass it up
            }
            sofar = result.type;
            lex = result.lex;
            pcode = result.pcode;
            pcode[pcode.length - 1].push(pc[operator]);
            break;
        case "lbkt":
            lex += 1;
            try {
                result = expression(routines, sub, lex, addresses, sofar, needed);
            } catch (compError3) {
                throw compError3; // pass it up
            }
            sofar = result.type;
            lex = result.lex;
            pcode = result.pcode;
            if (lexemes[lex].type === 'rbkt') {
                lex += 1;
            } else {
                throw error("exp03", "expBracket", lexemes[lex - 1]);
            }
            break;
        case "integer":
            found = "integer";
            if (!checkType(needed, found)) {
                throw typeError("exp04", needed, found, lexemes[lex]);
            }
            sofar = found;
            pcode = [values.loadValue("integer", lexemes[lex].value)];
            lex += 1;
            break;
        case "boolean":
            found = "boolean";
            if (!checkType(needed, found)) {
                throw typeError("exp05", needed, found, lexemes[lex]);
            }
            sofar = found;
            pcode = [values.loadValue("boolean", lexemes[lex].value)];
            lex += 1;
            break;
        case "character":
            found = "character";
            if (!checkType(needed, found)) {
                throw typeError("exp06", needed, found, lexemes[lex]);
            }
            sofar = found;
            pcode = [values.loadValue("character", lexemes[lex].value)];
            if (needed === "string") {
                pcode[0].push(pc.ctos);
            }
            lex += 1;
            break;
        case "string":
            found = "string";
            if (!checkType(needed, found)) {
                throw typeError("exp07", needed, found, lexemes[lex]);
            }
            sofar = found;
            pcode = [values.loadValue("string", lexemes[lex].value)];
            lex += 1;
            break;
        case "key":
            input = find.input(lexemes[lex].string, language);
            if (!input) {
                throw error("exp08", "expKeycode", lexemes[lex]);
            }
            pcode = [values.loadValue("integer", input.value)];
            lex += 1;
            break;
        case "query":
            input = find.input(lexemes[lex].string, language);
            if (!input) {
                throw error("exp09", "expQuery", lexemes[lex]);
            }
            pcode = [values.loadValue("integer", input.value)];
            pcode[pcode.length - 1].push(pc.inpt);
            lex += 1;
            break;
        case "turtle": // fallthrough
        case "result": // fallthrough
        case "identifier":
            constant = find.constant(routines, sub, lexemes[lex].string, language);
            if (constant) {
                found = constant.type;
                if (!checkType(needed, found)) {
                    throw typeError("exp10", needed, found, lexemes[lex]);
                }
                sofar = found;
                pcode = [values.loadValue(constant.type, constant.value)];
                lex += 1;
                break;
            }
            variable = find.variable(routines, sub, lexemes[lex].string, language);
            if (variable) {
                found = variable.type;
                if (!checkType(needed, found)) {
                    throw typeError("exp11", needed, found, lexemes[lex]);
                }
                sofar = found;
                pcode = [values.loadVariable(variable)];
                lex += 1;
                break;
            }
            colour = find.colour(lexemes[lex].string, language);
            if (colour) {
                found = colour.type;
                if (!checkType(needed, found)) {
                    throw typeError("exp12", needed, found, lexemes[lex]);
                }
                sofar = found;
                pcode = [values.loadValue(colour.type, colour.value)];
                lex += 1;
                break;
            }
            comm = find.anyCommand(routines, sub, lexemes[lex].string, language);
            if (comm) {
                if (comm.type === "procedure") {
                    throw error("exp13", "expProcedure", lexemes[lex]);
                }
                found = comm.returns;
                if (!checkType(needed, found)) {
                    throw typeError("exp14", needed, found, lexemes[lex]);
                }
                sofar = found;
                try {
                    result = command(routines, sub, lex, addresses, "function");
                } catch (compError4) {
                    throw compError4; // pass it up
                }
                sofar = found;
                lex = result.lex;
                pcode = result.pcode;
                if (!comm.code) { // custom function
                    pcode.push([pc.ldvv, routines.length + 9, 1]);
                }
                break;
            }
            throw error("exp15", "expNotFound", lexemes[lex]);
        default:
            throw error("exp16", "expWeird", lexemes[lex]);
        }
        return {
            type: sofar,
            lex: lex,
            pcode: pcode
        };
    };

    assignment = function (routines, sub, lex, addresses) {
        var lexemes;
        var name;
        var language;
        var constant;
        var variable;
        var pcode;
        var result;
        lexemes = routines[sub].lexemes;
        name = lexemes[lex].string;
        language = routines[0].language;
        constant = find.constant(routines, sub, name, language);
        variable = find.variable(routines, sub, name, language);
        if (constant) {
            throw error("asgn01", "asgnConst", lexemes[lex]);
        }
        if (!variable) {
            throw error("asgn02", "asgnNotFound", lexemes[lex]);
        }
        // language specific module has already confirmed next lexeme is the
        // appropriate assignment operator, so just skip past it here
        lex += 2;
        if (!lexemes[lex]) {
            throw error("asgn03", "asgnNothing", lexemes[lex - 1]);
        }
        try {
            result = expression(routines, sub, lex, addresses, "null", variable.type);
        } catch (compError) {
            throw compError; // pass it on up
        }
        lex = result.lex;
        pcode = result.pcode;
        pcode[pcode.length - 1] = pcode[pcode.length - 1].concat(values.storeVariable(variable));
        return {
            lex: lex,
            pcode: pcode
        };
    };

    command = function (routines, sub, lex, addresses, expectedType) {
        var language;
        var lexemes;
        var comm;
        var argsExpected;
        var argsGiven;
        var currentArg;
        var variable;
        var pcode;
        var result;
        language = routines[0].language;
        lexemes = routines[sub].lexemes;
        comm = find.anyCommand(routines, sub, lexemes[lex].string, language);
        if (!comm) {
            throw error("cmd01", "cmdNotFound", lexemes[lex]);
        }
        if (comm.type !== expectedType) {
            throw typeFnError("cmd02", expectedType, comm.type, lexemes[lex]);
        }
        argsExpected = comm.parameters.length;
        pcode = [[]];
        if (argsExpected === 0) { // no arguments expected
            if (language === "Python") {
                if (!lexemes[lex + 1] || (lexemes[lex + 1].type !== "lbkt")) {
                    throw error("cmd03", "cmdLeftBracket", lexemes[lex]);
                }
                lex += 1;
                if (!lexemes[lex + 1] || (lexemes[lex + 1].type !== "rbkt")) {
                    throw error("cmd04", "cmdNoArgs", lexemes[lex - 1]);
                }
            } else {
                if (lexemes[lex + 1] && (lexemes[lex + 1].type === "lbkt")) {
                    throw error("cmd05", "cmdNoArgs", lexemes[lex]);
                }
            }
        } else { // some arguments expected
            if (lexemes[lex + 1].type !== "lbkt") {
                throw error("cmd06", "cmdMissingArgs", lexemes[lex]);
            }
            lex += 2;
            argsGiven = 0;
            while ((argsGiven < argsExpected) && (lexemes[lex].type !== "rbkt")) {
                currentArg = comm.parameters[argsGiven];
                if (currentArg.byref) { // reference parameter
                    variable = find.variable(routines, sub, lexemes[lex].string, routines[0].language);
                    if (!variable) {
                        throw error("cmd07", "cmdBadRef", lexemes[lex]);
                    }
                    lex += 1;
                    pcode[pcode.length - 1] = pcode[pcode.length - 1].concat(values.loadVariableAddress(variable));
                } else { // value parameter
                    try {
                        result = expression(routines, sub, lex, addresses, "null", currentArg.type);
                    } catch (compError) {
                        throw compError; // pass it up
                    }
                    lex = result.lex;
                    pcode[pcode.length - 1] = pcode[pcode.length - 1].concat(result.pcode.shift());
                    pcode = pcode.concat(result.pcode);
                }
                argsGiven += 1;
                if (argsGiven < argsExpected) {
                    if (!lexemes[lex] || (lexemes[lex].type !== "comma")) {
                        throw error("cmd08", "cmdComma", lexemes[lex]);
                    }
                    lex += 1;
                }
            }
            if (argsGiven < argsExpected) {
                throw error("cmd09", "cmdTooFew", lexemes[lex]);
            }
            if (lexemes[lex].type === "comma") {
                throw error("cmd10", "cmdTooMany", lexemes[lex]);
            }
            if (lexemes[lex].type !== "rbkt") {
                throw error("cmd11", "cmdRightBracket", lexemes[lex - 1]);
            }
        }
        lex += 1;
        if (comm.code) { // native command
            switch (comm.code) {
            case pc.newt:
                pcode[pcode.length - 1].push(pc.ldin, 0, pc.sptr);
                break;
            case pc.oldt:
                pcode[pcode.length - 1].push(pc.ldin, routines[0].turtle, pc.ldin, 0, pc.sptr);
                break;
            case pc.incr: // fallthrough
            case pc.decr:
                pcode[pcode.length - 1].push(pc.dupl, pc.lptr, comm.code, pc.swap, pc.sptr);
                break;
            case pc.rndc:
                pcode[pcode.length - 1].push(pc.rand, pc.incr, pc.rgb, pc.colr);
                break;
            case pc.rand:
                switch (language) {
                case 'BASIC':
                    pcode[pcode.length - 1].push(pc.rand, pc.incr);
                    break;
                case 'Pascal':
                    pcode[pcode.length - 1].push(pc.rand);
                    break;
                case 'Python':
                    pcode[pcode.length - 1].push(pc.swap, pc.dupl, pc.rota, pc.incr);
                    pcode[pcode.length - 1].push(pc.swap, pc.subt, pc.rand, pc.plus);
                    break;
                }
                break;
            case pc.texl:
                pcode[pcode.length - 1].push(pc.text, pc.newl);
                break;
            case pc.uppc:
                pcode[pcode.length - 1].push(pc.ldin, 1, pc.case);
                break;
            case pc.lowc:
                pcode[pcode.length - 1].push(pc.ldin, -1, pc.case);
                break;
            case pc.lefs:
                pcode[pcode.length - 1].push(pc.ldin, 1, pc.swap, pc.copy);
                break;
            case pc.rgts:
                pcode[pcode.length - 1].push(pc.swap, pc.dupl, pc.slen, pc.incr);
                pcode[pcode.length - 1].push(pc.rota, pc.subt, pc.mxin, pc.copy);
                break;
            case pc.inss:
                switch (language) {
                case 'BASIC': // fallthrough
                case 'Python':
                    pcode[pcode.length - 1].push(pc.rota, pc.rota, pc.inss);
                    break;
                case 'Pascal':
                    pcode[pcode.length - 1].push(pc.inss);
                    break;
                }
                break;
            case pc.poss:
                switch (language) {
                case 'BASIC': // fallthrough
                case 'Python':
                    pcode[pcode.length - 1].push(pc.swap, pc.poss);
                    break;
                case 'Pascal':
                    pcode[pcode.length - 1].push(pc.poss);
                    break;
                }
                break;
            case pc.svd0:
                pcode[pcode.length - 1].push(pc.ldin, 0, pc.sval);
                break;
            case pc.bool: // Python only - covert -1 to 1
                pcode[pcode.length - 1].push(pc.abs);
                break;
            case pc.ilin:
                pcode[pcode.length - 1].push(pc.text, pc.newl, pc.rdln);
                break;
            case pc.bufr:
                pcode[pcode.length - 1].push(pc.bufr, pc.ldin, 1, pc.sptr, pc.hfix);
                break;
            default:
                pcode[pcode.length - 1].push(comm.code);
            }
        } else { // custom command
            pcode[pcode.length - 1].push(pc.subr, addresses[comm.index - 1]);
        }
        return {
            lex: lex,
            pcode: pcode
        };
    };

    init = function () {
        return {
            expression: expression,
            assignment: assignment,
            command: command
        };
    };

    return init();

});