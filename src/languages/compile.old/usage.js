// usage module
// arrays of lexemes and subroutines go in, usage data comes out

/*jslint browser: true */
/*global define */

define(function (require) {

    "use strict";

    var categories = require("data/categories");

    var isCalled;
    var isUsed;
    var linesList;
    var usageExpression;
    var countTotal;
    var usageCategory;
    var nonEmpty;
    var usage;
    var init;

    isCalled = function (name, lexeme) {
        return lexeme.string === name;
    };

    isUsed = function (language, lexemes, expression) {
        var name;
        var uses;
        name = expression.name || expression.names[language.toLowerCase()];
        uses = lexemes.filter(isCalled.bind(null, name));
        return uses.length > 0;
    };

    linesList = function (sofar, lexeme, index) {
        if (index !== 0) {
            sofar += " ";
        }
        sofar += lexeme.line.toString(10);
        return sofar;
    };

    usageExpression = function (language, lexemes, expression) {
        var name;
        var uses;
        name = expression.name || expression.names[language.toLowerCase()];
        uses = lexemes.filter(isCalled.bind(null, name));
        return {
            name: name,
            level: expression.level + 1,
            count: uses.length,
            lines: uses.reduce(linesList, "")
        };
    };

    countTotal = function (sofar, expression) {
        return sofar + expression.count;
    };

    usageCategory = function (language, lexemes, category) {
        var expressions;
        var total;
        expressions = category.expressions.filter(isUsed.bind(null, language, lexemes));
        expressions = expressions.map(usageExpression.bind(null, language, lexemes));
        total = expressions.reduce(countTotal, 0);
        return {
            category: category.category,
            expressions: expressions,
            total: total
        };
    };

    nonEmpty = function (category) {
        return category.expressions.length > 0;
    };

    usage = function (lexemes, subroutines, language) {
        var usageData;
        usageData = categories.slice(0);
        usageData.push({
            category: "Subroutine calls",
            expressions: subroutines
        });
        usageData = usageData.map(usageCategory.bind(null, language, lexemes));
        return usageData.filter(nonEmpty);
    };

    init = function () {
        return usage;
    };

    return init();

});