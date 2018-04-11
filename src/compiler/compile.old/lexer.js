// lexer module
// program text goes in, array of lexemes comes out

/*jslint browser: true */
/*global define */

define(function (require) {

    "use strict";

    var lextypes = require("data/lextypes");

    var lexType;
    var unescapeString;
    var lexValue;
    var createLexeme;
    var createError;
    var matchesCode;
    var lexer;
    var init;

    lexType = function (ruleType) {
        switch (ruleType) {
        case "decimal": // fallthrough
        case "binary": // fallthrough
        case "hexadecimal":
            return "integer";
        case "true": // fallthrough
        case "false":
            return "boolean";
        default:
            return ruleType;
        }
    };

    unescapeString = function (string, language) {
        switch (language) {
        case "BASIC":
            return string.replace(/""/g, "\"");
        case "Pascal":
            return string.replace(/''/g, "'");
        case "Python":
            return string.replace(/\\'/g, "'");
        }
    };

    lexValue = function (ruleType, string, language) {
        var turtleProperties;
        turtleProperties = ["x", "y", "d", "t", "c"];
        switch (ruleType) {
        case "decimal":
            return parseInt(string, 10);
        case "binary":
            return parseInt(string.replace(/^0?[%b]/i, ""), 2);
        case "hexadecimal":
            return parseInt(string.replace(/^0?[$&x]/i, "").replace(/#/, ""), 16);
        case "true":
            return -1;
        case "false":
            return 0;
        case "character":
            return string.charCodeAt(1);
        case "string":
            return unescapeString(string.substring(1, string.length - 1), language);
        case "turtle":
            return turtleProperties.indexOf(string[4].toLowerCase()) + 1;
        }
    };

    createLexeme = function (rule, string, counters, language) {
        if ((language === "Pascal") && (rule.type !== "string")) {
            string = string.toLowerCase(); // Pascal is case-insensitive
        }
        return {
            type: lexType(rule.type),
            string: string,
            value: lexValue(rule.type, string, language),
            line: counters.line,
            position: counters.position,
            spaces: counters.spaces
        };
    };

    createError = function (rule, lexeme) {
        return {
            id: "lexer",
            messageId: rule.messageId,
            message: rule.message,
            lexeme: lexeme
        };
    };

    matchesCode = function (code, index, rule) {
        return code.substring(index).match(rule.regex);
    };

    lexer = function (code, language) {
        var lexemes;
        var counters;
        var rules;
        var character;
        var rule;
        var string;
        var lexeme;
        lexemes = [];
        counters = {index: 0, line: 1, position: 0, spaces: 0};
        rules = lextypes[language.toLowerCase()];
        code = code.trim().replace(/\t/g, "  ").replace(/\r\n/g, "\n");
        while (counters.index < code.length) {
            counters.spaces = 0;
            character = code[counters.index];
            while ((character === " ") || (character === "\n")) {
                if (character === " ") {
                    counters.spaces += 1;
                    counters.position += 1;
                } else if (character === "\n") {
                    counters.line += 1;
                    counters.spaces = 0;
                    counters.position = 0;
                }
                counters.index += 1;
                character = code[counters.index];
            }
            rule = rules.find(matchesCode.bind(null, code, counters.index));
            if (rule) {
                string = code.substring(counters.index).match(rule.regex).pop();
                lexeme = createLexeme(rule, string, counters, language);
                switch (rule.type) {
                case "error":
                    throw createError(rule, lexeme);
                case "comment":
                    if (language !== "Pascal") { // languages other than Pascal
                        counters.line += 1;      // end comments with a new line
                    }
                    break;
                default:
                    lexemes.push(lexeme);
                }
                counters.index += string.length;
                counters.position += string.length;
            }
        }
        return lexemes;
    };

    init = function () {
        return lexer;
    };

    return init();

});
