// compile module
// the main compilation function, which
//  1) runs the lexical analysis on the code to generate lexemes
//  2) runs the syntactic analysis on the lexemes to generate pcode
//     (and potentially tweak the lexemes)
//  3) generates usage data for the program

/*jslint browser: true */
/*global define */

define(function (require) {

    "use strict";

    var lexer = require("./lexer");
    var parser = require("./parser");
    var pcoder = require("./pcoder");
    var usage = require("./usage");

    var compile;

    compile = function (code, language) {
        var lexerResult;
        var parserResult;
        var pcoderResult;
        if (code.length === 0) {
            return {success: false};
        }
        try {
            lexerResult = lexer(code, language);
        } catch (lexerError) {
            throw lexerError; // pass it up
        }
        try {
            parserResult = parser(lexerResult, language);
        } catch (parserError) {
            throw parserError; // pass it up
        }
        try {
            pcoderResult = pcoder(parserResult, language);
        } catch (pcoderError) {
            throw pcoderError; // pass it up
        }
        return {
            usage: usage(lexerResult, parserResult.slice(1), language),
            pcode: pcoderResult
        };
    };

    return compile;

});