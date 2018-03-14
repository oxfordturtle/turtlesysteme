// structures module
// language-independent pcode generation

/*jslint browser: true */
/*global define */

define(function (require) {

    "use strict";

    var pc = require("data/12/pc");
    var statements = require("./statements");
    var find = require("./find");
    var values = require("./values");

    var error;
    var blockEndError;
    var elseCheck;
    var compileIf;
    var compileFor;
    var compileRepeat;
    var compileWhile;
    var assignmentCheck;
    var semicolonCheck;
    var colonCheck;
    var blockEndCheck;
    var block;
    var statement;
    var structures;
    var init;

    error = function (errorId, messageId, lexeme) {
        var messages;
        messages = {
            ifExpression: "'IF' must be followed by a boolean expression.",
            ifThen: "'IF ...' must be followen by 'THEN'.",
            ifNothing: "No commands found after 'IF ... THEN'.",
            elseNothing: "No commands found after 'ELSE'.",
            forVariable: "'FOR' must be followed by an integer variable.",
            forTurtle: "Turtle attribute cannot be used as a 'FOR' variable.",
            forNotFound: "Variable '" + lexeme.string + "' not defined.",
            forNotInteger: "'" + lexeme.string + "' is not an integer variable.",
            forAssignment: "'FOR' variable must be assigned an initial value.",
            forEquals: "Assignment operator is ':=', not '='.",
            forInitial: "'FOR' loop variable must be assigned an initial value.",
            forToDownTo: "'FOR ... := ...' must be followed by 'TO' or 'DOWNTO'.",
            forToNothing: "'" + lexeme.string.toUpperCase() + "' must be followed by an integer "
                    + "(or integer constant).",
            forStep: "'STEP' statement must be of the form 'STEP -1'.",
            forDo: "'FOR' loop range must be followed by 'DO'.",
            forNothing: "No commands found after 'FOR' loop initialisation.",
            repeatExpression: "'UNTIL' must be followed by a boolean expression.",
            whileExpression: "'WHILE' must be followed by a boolean expression.",
            whileDo: "'WHILE ...' must be followed by 'DO'.",
            whileNothing: "No commands found after 'WHILE ... DO'.",
            blockNothing: "No commands found after 'BEGIN'.",
            blockBegin: "'END' expected, not '" + lexeme.type.toUpperCase() + "'.",
            blockIf: "'ENDIF' expected, not '" + lexeme.type.toUpperCase() + "'.",
            blockFor: "'NEXT' expected, not '" + lexeme.type.toUpperCase() + "'.",
            blockRepeat: "'UNTIL' expected, not '" + lexeme.type.toUpperCase() + "'.",
            blockWhile: "'ENDWHILE' expected, not '" + lexeme.type.toUpperCase() + "'.",
            blockNoEnd: "'BEGIN' does not have any matching 'END'.",
            stmtEqal: "Variable assignment requires ':='rather than '='.",
            stmtSemicolon: "Semicolon needed after command.",
            stmtColon: "Command must be on a new line, or followed by a colon.",
            stmtWeird: "Statement cannot begin with '" + lexeme.string + "'."
        };
        return {
            id: errorId,
            messageId: messageId,
            message: messages[messageId],
            lexeme: lexeme
        };
    };

    blockEndError = function (start, lexeme) {
        switch (start) {
        case "begin":
            return error("block02", "blockBegin", lexeme);
        case "if": // fallthrough
        case "else":
            return error("block03", "blockIf", lexeme);
        case "for":
            return error("block04", "blockFor", lexeme);
        case "repeat":
            return error("block05", "blockRepeat", lexeme);
        case "while":
            return error("block06", "blockWhile", lexeme);
        }
    };

    elseCheck = function (language, lexemes, lex, basicOneLine) {
        if (!lexemes[lex]) {
            return false;
        }
        switch (language) {
        case "BASIC":
            if (lexemes[lex].type !== "else") {
                return false;
            }
            if (basicOneLine && (lexemes[lex].line > lexemes[lex - 1].line)) {
                return false;
            }
            return true;
        case "Pascal":
            return (lexemes[lex].type === "else");
        }
    };

    compileIf = function (routines, sub, lex, addresses, offset) {
        var language;
        var lexemes;
        var pcode;
        var result;
        var ifnoLine;
        var elseJump;
        var basicOneLine;
        language = routines[0].language;
        lexemes = routines[sub].lexemes;
        pcode = [];
        result = {};
        ifnoLine = 0;
        elseJump = 0;
        basicOneLine = true;
        // IF <boolean> ...
        if (!lexemes[lex]) {
            throw error("if01", "ifExpression", lexemes[lex - 1]);
        }
        try {
            result = statements.expression(routines, sub, lex, addresses, "null", "boolean", false);
        } catch (ifError) {
            throw ifError; // pass it up
        }
        lex = result.lex;
        pcode = result.pcode;
        ifnoLine = pcode.length - 1;
        pcode[ifnoLine].push(pc.ifno);
        // ... THEN ...
        if (!lexemes[lex]) {
            throw error("if02", "ifThen", lexemes[lex - 1]);
        }
        if (lexemes[lex].type !== "then") {
            throw error("if03", "ifThen", lexemes[lex]);
        }
        if (!lexemes[lex + 1]) {
            throw error("if04", "ifNothing", lexemes[lex]);
        }
        lex += 1;
        try {
            switch (language) {
            case "BASIC":
                if (lexemes[lex].line > lexemes[lex - 1].line) {
                    basicOneLine = false; // changes how we handle ELSE
                    result = block(routines, sub, lex, addresses, offset + pcode.length, "if");
                } else {
                    result = statement(routines, sub, lex, addresses, offset + pcode.length);
                }
                break;
            case "Pascal":
                if (lexemes[lex].type === "begin") {
                    result = block(routines, sub, lex + 1, addresses, offset + pcode.length, "begin");
                } else {
                    result = statement(routines, sub, lex, addresses, offset + pcode.length);
                }
                break;
            }
        } catch (thenError) {
            throw thenError; // pass it up
        }
        lex = result.lex;
        pcode = pcode.concat(result.pcode);
        // ? ... ELSE ... ?
        if (elseCheck(language, lexemes, lex, basicOneLine)) {
            lex += 1; // move past "else"
            if (!lexemes[lex]) {
                throw error("if04", "elseNothing", lexemes[lex]);
            }
            elseJump = pcode.length;
            pcode.push([pc.jump]);
            try {
                switch (language) {
                case "BASIC":
                    if (lexemes[lex].line > lexemes[lex - 1].line) {
                        result = block(routines, sub, lex, addresses, offset + pcode.length, "else");
                    } else {
                        result = statement(routines, sub, lex, addresses, offset + pcode.length);
                    }
                    break;
                case "Pascal":
                    if (lexemes[lex].type === "begin") {
                        result = block(routines, sub, lex + 1, addresses, offset + pcode.length, "begin");
                    } else {
                        result = statement(routines, sub, lex, addresses, offset + pcode.length);
                    }
                    break;
                }
            } catch (elseError) {
                throw elseError; // pass it up
            }
            lex = result.lex;
            pcode = pcode.concat(result.pcode);
            pcode[elseJump].push(offset + pcode.length + 1);
            pcode[ifnoLine].push(offset + elseJump + 2);
        } else {
            // no ELSE, just finish the IF
            pcode[ifnoLine].push(offset + pcode.length + 1);
        }
        return {
            lex: lex,
            pcode: pcode
        };
    };

    compileFor = function (routines, sub, lex, addresses, offset) {
        var language;
        var lexemes;
        var pcode;
        var result;
        var variable;
        var increment;
        language = routines[0].language;
        lexemes = routines[sub].lexemes;
        pcode = [];
        result = {};
        variable = {};
        increment = 0;
        if (!lexemes[lex]) {
            throw error("for01", "forVariable", lexemes[lex - 1]);
        }
        if (lexemes[lex].type === "turtle") {
            throw error("for02", "forTurtle", lexemes[lex]);
        }
        if (lexemes[lex].type !== "identifier") {
            throw error("for03", "forVariable", lexemes[lex]);
        }
        variable = find.variable(routines, sub, lexemes[lex].string);
        if (!variable) {
            throw error("for04", "forNotFound", lexemes[lex]);
        }
        if ((variable.type !== "integer") && (variable.type !== "boolint")) {
            throw error("for05", "forNotInteger", lexemes[lex]);
        }
        if (!lexemes[lex + 1]) {
            throw error("for06", "forAssignment", lexemes[lex]);
        }
        lex += 1;
        switch (language) {
        case "BASIC":
            if (lexemes[lex].type !== "eqal") {
                throw error("for08", "forAssignment", lexemes[lex]);
            }
            break;
        case "Pascal":
            if (lexemes[lex].type === "eqal") {
                throw error("for07", "forEquals", lexemes[lex]);
            }
            if (lexemes[lex].type !== "asgn") {
                throw error("for08", "forAssignment", lexemes[lex]);
            }
            break;
        }
        if (!lexemes[lex + 1]) {
            throw error("for09", "forInitial", lexemes[lex]);
        }
        lex += 1;
        try {
            result = statements.expression(routines, sub, lex, addresses, "null", "integer", false);
        } catch (initialError) {
            throw initialError; // pass it up
        }
        lex = result.lex;
        pcode = result.pcode;
        pcode.push(values.storeVariable(variable));
        if (!lexemes[lex]) {
            throw error("for10", "forToDownTo", lexemes[lex - 1]);
        }
        switch (lexemes[lex].type) {
        case "to":
            increment = 1;
            break;
        case "downto":
            increment = -1;
            break;
        default:
            throw error("for11", "forToDownTo", lexemes[lex]);
        }
        if (!lexemes[lex + 1]) {
            throw error("for12", "forToNothing", lexemes[lex]);
        }
        lex += 1;
        try {
            result = statements.expression(routines, sub, lex, addresses, "null", "integer", false);
        } catch (finalError) {
            throw finalError; // pass it up
        }
        lex = result.lex;
        pcode[pcode.length - 1] = pcode[pcode.length - 1].concat(result.pcode.shift());
        pcode = pcode.concat(result.pcode);
        // for Pascal, we already know the increment; for BASIC, we may now
        // need to change the default...
        if (language === "BASIC") {
            if (lexemes[lex] && lexemes[lex].type === "step") {
                if (!lexemes[lex + 1]) {
                    throw error("for13", "forStep", lexemes[lex]);
                }
                lex += 1;
                if (lexemes[lex].type !== "subt") {
                    throw error("for14", "forStep", lexemes[lex]);
                }
                if (!lexemes[lex + 1]) {
                    throw error("for15", "forStep", lexemes[lex]);
                }
                lex += 1;
                if (lexemes[lex].string !== "1") {
                    throw error("for16", "forStep", lexemes[lex]);
                }
                lex += 1;
                increment = -1;
            }
        }
        pcode.push(values.loadVariable(variable, false));
        if (increment > 0) {
            pcode[pcode.length - 1].push(pc.mreq);
        } else {
            pcode[pcode.length - 1].push(pc.lseq);
        }
        pcode[pcode.length - 1].push(pc.ifno);
        // Pascal requires DO at this point
        if (language === "Pascal") {
            if (!lexemes[lex]) {
                throw error("for17", "forDo", lexemes[lex - 1]);
            }
            if (lexemes[lex].type !== "do") {
                throw error("for18", "forDo", lexemes[lex]);
            }
            lex += 1;
        }
        if (!lexemes[lex]) {
            throw error("for19", "forNothing", lexemes[lex]);
        }
        try {
            switch (language) {
            case "BASIC":
                if (lexemes[lex - 1].line < lexemes[lex].line) {
                    result = block(routines, sub, lex, addresses, offset + pcode.length, "for");
                } else {
                    result = statement(routines, sub, lex, addresses, offset + pcode.length);
                }
                break;
            case "Pascal":
                if (lexemes[lex].type === "begin") {
                    result = block(routines, sub, lex + 1, addresses, offset + pcode.length, "begin");
                } else {
                    result = statement(routines, sub, lex, addresses, offset + pcode.length);
                }
                break;
            }
        } catch (stmtError) {
            throw stmtError; // pass it up
        }
        lex = result.lex;
        pcode = pcode.concat(result.pcode);
        pcode.push(values.loadVariable(variable));
        if (increment > 0) {
            pcode[pcode.length - 1].push(pc.incr);
        } else {
            pcode[pcode.length - 1].push(pc.decr);
        }
        pcode[pcode.length - 1].push(pc.jump);
        pcode[pcode.length - 1].push(offset + 2);
        pcode[2].push(offset + pcode.length + 1); // backpatch initial IFNO jump
        return {
            lex: lex,
            pcode: pcode
        };
    };

    compileRepeat = function (routines, sub, lex, addresses, offset) {
        var lexemes;
        var pcode;
        var result;
        lexemes = routines[sub].lexemes;
        pcode = [];
        result = {};
        try {
            result = block(routines, sub, lex, addresses, offset + pcode.length, "repeat");
        } catch (repeatError) {
            throw repeatError; // pass it up
        }
        lex = result.lex;
        pcode = pcode.concat(result.pcode);
        if (!lexemes[lex]) {
            throw error("repeat01", "repeatExpression", lexemes[lex - 1]);
        }
        try {
            result = statements.expression(routines, sub, lex, addresses, "null", "boolean", false);
        } catch (untilError) {
            throw untilError; // pass it up
        }
        lex = result.lex;
        pcode = pcode.concat(result.pcode);
        pcode[pcode.length - 1].push(pc.ifno);
        pcode[pcode.length - 1].push(offset + 1);
        return {
            lex: lex,
            pcode: pcode
        };
    };

    compileWhile = function (routines, sub, lex, addresses, offset) {
        var language;
        var lexemes;
        var pcode;
        var result;
        var ifnoLine;
        language = routines[0].language;
        lexemes = routines[sub].lexemes;
        pcode = [];
        result = {};
        ifnoLine = 0;
        if (!lexemes[lex]) {
            throw error("while01", "whileExpression", lexemes[lex - 1]);
        }
        try {
            result = statements.expression(routines, sub, lex, addresses, "null", "boolean", false);
        } catch (whileError) {
            throw whileError; // pass it up
        }
        lex = result.lex;
        pcode = result.pcode;
        ifnoLine = pcode.length - 1;
        pcode[ifnoLine].push(pc.ifno);
        if (language === "Pascal") { // Pascal requires DO after WHILE expression
            if (!lexemes[lex]) {
                throw error("while02", "whileDo", lexemes[lex - 1]);
            }
            if (lexemes[lex].type !== "do") {
                throw error("while03", "whileDo", lexemes[lex]);
            }
            lex += 1;
        }
        if (!lexemes[lex]) {
            throw error("while04", "whileNothing", lexemes[lex]);
        }
        try {
            switch (language) {
            case "BASIC":
                if (lexemes[lex].line > lexemes[lex - 1].line) {
                    result = block(routines, sub, lex, addresses, offset + pcode.length, "while");
                } else {
                    result = statement(routines, sub, lex, addresses, offset + pcode.length);
                }
                break;
            case "Pascal":
                if (lexemes[lex].type === "begin") {
                    result = block(routines, sub, lex + 1, addresses, offset + pcode.length, "begin");
                } else {
                    result = statement(routines, sub, lex, addresses, offset + pcode.length);
                }
                break;
            }
        } catch (doError) {
            throw doError; // pass it up
        }
        lex = result.lex;
        pcode = pcode.concat(result.pcode);
        pcode.push([pc.jump, offset + 1]);
        pcode[ifnoLine].push(offset + pcode.length + 1);
        return {
            lex: lex,
            pcode: pcode
        };
    };

    assignmentCheck = function (language, lexeme) {
        if (language === "Pascal") {
            if (lexeme.type === "eqal") {
                throw error("stmt01", "stmtEqal", lexeme);
            }
            if (lexeme.type === "asgn") {
                return true;
            }
        } else {
            if (lexeme.type === "eqal") {
                return true;
            }
        }
        return false;
    };

    semicolonCheck = function (lexemes, lex) {
        var noSemiAfter;
        var noSemiBefore;
        noSemiAfter = ["begin", "do", "dot", "repeat", "semicolon", "then"];
        noSemiBefore = ["else", "end", "semicolon", "until"];
        if (lexemes[lex]) {
            if (lexemes[lex].type !== "semicolon") {
                if (noSemiAfter.indexOf(lexemes[lex - 1].type) === -1) {
                    if (noSemiBefore.indexOf(lexemes[lex].type) === -1) {
                        throw error("stmt02", "stmtSemicolon", lexemes[lex]);
                    }
                }
            } else {
                while (lexemes[lex] && lexemes[lex].type === "semicolon") {
                    lex += 1;
                }
            }
        }
        return lex;
    };

    colonCheck = function (lexemes, lex) {
        if (lexemes[lex]) {
            if (lexemes[lex].type !== "colon") {
                if (lexemes[lex].line === lexemes[lex - 1].line) {
                    if (lexemes[lex].type !== "else") {
                        throw error("stmt03", "stmtColon", lexemes[lex - 1]);
                    }
                }
            } else {
                while (lexemes[lex] && (lexemes[lex].type === "colon")) {
                    lex += 1;
                }
            }
        }
        return lex;
    };

    blockEndCheck = function (start, lexeme) {
        switch (lexeme.type) {
        case "end":
            if (start !== "begin") {
                throw blockEndError(start, lexeme);
            }
            return true;
        case "else":
            if (start !== "if") {
                throw blockEndError(start, lexeme);
            }
            return true;
        case "endif":
            if ((start !== "if") && (start !== "else")) {
                throw blockEndError(start, lexeme);
            }
            return true;
        case "next":
            if (start !== "for") {
                throw blockEndError(start, lexeme);
            }
            return true;
        case "until":
            if (start !== "repeat") {
                throw blockEndError(start, lexeme);
            }
            return true;
        case "endwhile":
            if (start !== "while") {
                throw blockEndError(start, lexeme);
            }
            return true;
        }
        return false;
    };

    block = function (routines, sub, lex, addresses, offset, start) {
        var language;
        var lexemes;
        var pcode;
        var result;
        var end;
        language = routines[0].language;
        lexemes = routines[sub].lexemes;
        pcode = [];
        result = {};
        end = false;
        if (!lexemes[lex]) {
            throw error("block01", "blockNothing", lexemes[lex - 1]);
        }
        while (!end && (lex < lexemes.length)) {
            try {
                end = blockEndCheck(start, lexemes[lex]);
            } catch (endError) { // errors block02-07
                throw endError; // pass it up
            }
            if (end) {
                // move past ending lexeme, except ELSE in the case of BASIC
                if (language !== "BASIC" || lexemes[lex].type !== "else") {
                    lex += 1;
                }
            } else { // compile the statement
                try {
                    result = statement(routines, sub, lex, addresses, offset + pcode.length);
                } catch (stmtError) {
                    throw stmtError; // pass it up
                }
                lex = result.lex;
                pcode = pcode.concat(result.pcode);
            }
        }
        if (!end) {
            throw error("block07", "blockNoEnd", lexemes[lex - 1]);
        }
        return {
            lex: lex,
            pcode: pcode
        };
    };

    statement = function (routines, sub, lex, addresses, offset) {
        var language;
        var lexemes;
        var pcode;
        var assignment;
        var result;
        language = routines[0].language;
        lexemes = routines[sub].lexemes;
        pcode = [];
        assignment = false;
        result = {};
        switch (lexemes[lex].type) {
        // identifiers (assignment or procedure call)
        case "turtle": // fallthrough
        case "result": // fallthrough
        case "identifier":
            if (lexemes[lex + 1]) { // check for assignment operator
                try {
                    assignment = assignmentCheck(language, lexemes[lex + 1]);
                } catch (asgnError1) {
                    throw asgnError1; // pass it up
                }
            }
            if (assignment) { // looks like an assignment
                try {
                    result = statements.assignment(routines, sub, lex, addresses);
                } catch (asgnError2) {
                    throw asgnError2; // pass it up
                }
                lex = result.lex;
                pcode = result.pcode;
                break;
            }
            try { // otherwise it should be a procedure call
                result = statements.command(routines, sub, lex, addresses, "procedure");
            } catch (commError) {
                throw commError; // pass it up
            }
            lex = result.lex;
            pcode = result.pcode;
            break;
        // start of if/for/repeat/while structure
        case "if":
            try {
                result = compileIf(routines, sub, lex + 1, addresses, offset);
            } catch (ifError) {
                throw ifError; // pass it up
            }
            lex = result.lex;
            pcode = result.pcode;
            break;
        case "for":
            try {
                result = compileFor(routines, sub, lex + 1, addresses, offset);
            } catch (forError) {
                throw forError; // pass it up
            }
            lex = result.lex;
            pcode = result.pcode;
            break;
        case "repeat":
            try {
                result = compileRepeat(routines, sub, lex + 1, addresses, offset);
            } catch (repeatError) {
                throw repeatError; // pass it up
            }
            lex = result.lex;
            pcode = result.pcode;
            break;
        case "while":
            try {
                result = compileWhile(routines, sub, lex + 1, addresses, offset);
            } catch (whileError) {
                throw whileError; // pass it up
            }
            lex = result.lex;
            pcode = result.pcode;
            break;
        // any thing else is a mistake
        default:
            throw error("stmt06", "stmtWeird", lexemes[lex]);
        }
        // end of statement check
        if (language === "BASIC") {
            try {
                lex = colonCheck(lexemes, lex);
            } catch (colonError) {
                throw colonError; // pass it up
            }
        }
        if (language === "Pascal") {
            try {
                lex = semicolonCheck(lexemes, lex);
            } catch (semicolonError) {
                throw semicolonError; // pass it up
            }
        }
        return {
            lex: lex,
            pcode: pcode
        };
    };

    structures = function (routines, sub, addresses, offset) {
        var lexemes;
        var lex;
        var pcode;
        var result;
        lexemes = routines[sub].lexemes;
        lex = 0;
        pcode = [];
        while (lex < lexemes.length) {
            try {
                result = statement(routines, sub, lex, addresses, offset + pcode.length);
            } catch (stmtError) {
                throw stmtError; // pass it up
            }
            lex = result.lex;
            pcode = pcode.concat(result.pcode);
        }
        return pcode;
    };

    init = function () {
        return structures;
    };

    return init();

});