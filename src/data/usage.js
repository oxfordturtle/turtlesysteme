/*
array of usage categories

includes categories of native commands, plus command structures and variable scope modifiers
*/

const categories = require('./categories')

const expression = (names, level) =>
  ({ names: { BASIC: names[0], Pascal: names[1], Python: names[2] }, level })

module.exports = categories.concat(
  {
    title: 'Command structures',
    expressions: [
      expression(['IF', 'if', 'if'], 0),
      expression(['ELSE', 'else', 'else'], 0),
      expression(['FOR', 'for', 'for'], 0),
      expression(['REPEAT', 'repeat', 'repeat'], 1),
      expression(['WHILE', 'while', 'while'], 1),
      expression(['DEF', null, 'def'], 1),
      expression([null, 'procedure', null], 1),
      expression([null, 'function', null], 2)
    ]
  },
  {
    title: 'Variable scope modifiers',
    expressions: [
      expression(['LOCAL', null, null], 1),
      expression(['PRIVATE', null, null], 2),
      expression([null, null, 'global'], 1),
      expression([null, null, 'nonlocal'], 2)
    ]
  }
)
