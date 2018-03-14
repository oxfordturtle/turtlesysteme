/*
 * categories of commands and expressions
 */
const groups = require('./groups');

const newExpression = (names, level) =>
  ({
    names: {
      basic: names[0],
      pascal: names[1],
      python: names[2],
    },
    level,
  });

module.exports = groups.concat(
  {
    category: 'Command structures',
    expressions: [
      newExpression(['IF', 'if', 'if'], 0),
      newExpression(['ELSE', 'else', 'else'], 0),
      newExpression(['FOR', 'for', 'for'], 0),
      newExpression(['REPEAT', 'repeat', 'repeat'], 1),
      newExpression(['WHILE', 'while', 'while'], 1),
      newExpression(['DEF', null, 'def'], 1),
      newExpression([null, 'procedure', null], 1),
      newExpression([null, 'function', null], 2),
    ],
  },
  {
    category: 'Variable scope modifiers',
    expressions: [
      newExpression(['LOCAL', null, null], 1),
      newExpression(['PRIVATE', null, null], 2),
      newExpression([null, null, 'global'], 1),
      newExpression([null, null, 'nonlocal'], 2),
    ],
  },
);
