/*
usage data generator

arrays of lexemes and subroutines go in, usage data comes out
*/

// the analyser function
module.exports = (lexemes, subroutines, language) =>
  usage.concat({ title: 'Subroutine calls', expressions: subroutines })
    .map(usageCategory.bind(null, language, lexemes))
    .filter(category => category.expressions.length > 0)

// dependencies
const { usage } = require('data')

// check if an expression is used in the program
const isUsed = (language, lexemes, expression) => {
  const name = expression.name || expression.names[language]
  const uses = lexemes.filter(lexeme => lexeme.content === name)
  return uses.length > 0
}

// reduce arrays of used expressions to a list of lines where they're used
const linesList = (sofar, lexeme) =>
  ` ${lexeme.line.toString(10)}`

// generate usage expression object
const usageExpression = (language, lexemes, expression) => {
  const name = expression.name || expression.names[language]
  const uses = lexemes.filter(lexeme => lexeme.content === name)
  return {
    name,
    level: expression.level + 1,
    count: uses.length,
    lines: uses.reduce(linesList, '').trim()
  }
}

// reduce array of expressions to count total
const countTotal = (sofar, expression) =>
  sofar + expression.count

// generate usage category object
const usageCategory = (language, lexemes, category) => {
  const filtered = category.expressions.filter(isUsed.bind(null, language, lexemes))
  const mapped = filtered.map(usageExpression.bind(null, language, lexemes))
  return {
    title: category.title,
    expressions: mapped,
    total: mapped.reduce(countTotal, 0)
  }
}
