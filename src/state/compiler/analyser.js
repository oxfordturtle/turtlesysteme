/** usage data generator
 * -------------------------------------------------------------------------------------------------
 * arrays of lexemes and subroutines go in, usage data comes out
 * -------------------------------------------------------------------------------------------------
 */

// global imports
const { categories } = require('data');

// check if a name matches a lexeme
const isCalled = (name, lexeme) =>
  lexeme.content === name;

// check if an expression is used in the program
const isUsed = (language, lexemes, expression) => {
  const name = expression.name || expression.names[language];
  const uses = lexemes.filter(isCalled.bind(null, name));
  return uses.length > 0;
};

// reduce arrays of used expressions to a list of lines where they're used
const linesList = (sofar, lexeme, index) => {
  if (index !== 0) sofar += " "; // separate line numbers by spaces
  sofar += lexeme.line.toString(10);
  return sofar;
};

// generate usage expression object
const usageExpression = (language, lexemes, expression) => {
  const name = expression.name || expression.names[language];
  const uses = lexemes.filter(isCalled.bind(null, name));
  return {
    name,
    level: expression.level + 1,
    count: uses.length,
    lines: uses.reduce(linesList, ''),
  };
};

// reduce array of expressions to count total
const countTotal = (sofar, expression) =>
  sofar + expression.count;

// generate usage category object
const usageCategory = (language, lexemes, category) => {
  const filtered = category.expressions.filter(isUsed.bind(null, language, lexemes));
  const mapped = filtered.map(usageExpression.bind(null, language, lexemes));
  return {
    title: category.title,
    expressions: mapped,
    total: mapped.reduce(countTotal, 0),
  };
};

// check if usage category is not empty
const nonEmpty = (category) =>
  category.expressions.length > 0;

// create a new expression object
const expression = (names, level) =>
  ({ names: { BASIC: names[0], Pascal: names[1], Python: names[2] }, level });

// the main usage function
const usage = (lexemes, subroutines, language) => {
  // create a copy of the categories array as a basis for manipulating
  const copy = categories.slice(0);
  // extend it to include command structures, variable scope modifiers, and subroutine calls
  copy.push({
    title: 'Command structures',
    expressions: [
      expression(['IF', 'if', 'if'], 0),
      expression(['ELSE', 'else', 'else'], 0),
      expression(['FOR', 'for', 'for'], 0),
      expression(['REPEAT', 'repeat', 'repeat'], 1),
      expression(['WHILE', 'while', 'while'], 1),
      expression(['DEF', null, 'def'], 1),
      expression([null, 'procedure', null], 1),
      expression([null, 'function', null], 2),
    ],
  });
  copy.push({
    title: 'Variable scope modifiers',
    expressions: [
      expression(['LOCAL', null, null], 1),
      expression(['PRIVATE', null, null], 2),
      expression([null, null, 'global'], 1),
      expression([null, null, 'nonlocal'], 2),
    ],
  });
  copy.push({
    title: 'Subroutine calls',
    expressions: subroutines,
  });
  // return the copy mapped and filtered
  return copy.map(usageCategory.bind(null, language, lexemes)).filter(nonEmpty);
};

// exports
module.exports = usage;
