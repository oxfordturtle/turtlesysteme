/* compiler/usage
--------------------------------------------------------------------------------
arrays of lexemes and subroutines go in, usage data comes out
--------------------------------------------------------------------------------
*/

const categories = require('data/categories');

// check if name matches lexeme
// ----------
const isCalled = (name, lexeme) =>
  lexeme.string === name;

// check if expression is used in the program
// ----------
const isUsed = (language, lexemes, expression) => {
  const name = expression.name || expression.names[language.toLowerCase()];
  const uses = lexemes.filter(isCalled.bind(null, name));
  return uses.length > 0;
};

// reduce arrays of used expressions to a list of lines where they're used
// ----------
const linesList = (sofar, lexeme, index) => {
  // separate line numbers by spaces
  if (index !== 0) sofar += " ";
  sofar += lexeme.line.toString(10);
  return sofar;
};

// generate usage expression object
// ----------
const usageExpression = (language, lexemes, expression) => {
  const name = expression.name || expression.names[language.toLowerCase()];
  const uses = lexemes.filter(isCalled.bind(null, name));
  return {
    name,
    level: expression.level + 1,
    count: uses.length,
    lines: uses.reduce(linesList, ''),
  };
};

// reduce array of expressions to count total
// ----------
const countTotal = (sofar, expression) =>
  sofar + expression.count;

// generate usage category object
// ----------
const usageCategory = (language, lexemes, category) => {
  const filtered = category.expressions.filter(isUsed.bind(null, language, lexemes));
  const mapped = filtered.map(usageExpression.bind(null, language, lexemes));
  return {
    category: category.category,
    expressions: mapped,
    total: mapped.reduce(countTotal, 0),
  };
};

// check if usage category is not empty
// ----------
const nonEmpty = (category) =>
  category.expressions.length > 0;

// the main usage function
// ----------
const usage = (lexemes, subroutines, language) => {
  // create a copy of the categories array as a basis for manipulating
  var copy = categories.slice(0);
  // extend it to include subroutine calls
  copy.push({category: "Subroutine calls", expressions: subroutines});
  // return the copy mapped and filtered
  return copy.map(usageCategory.bind(null, language, lexemes)).filter(nonEmpty);
};

module.exports = usage;
