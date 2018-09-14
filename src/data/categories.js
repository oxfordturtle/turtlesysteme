/*
categories of commands (for the help page and usage data)
*/

const commands = require('./commands')

const category = (index, title) =>
  ({ index, title, expressions: commands.filter((x) => x.category === index) })

module.exports = ([
  category(0, 'Turtle: relative movement'),
  category(1, 'Turtle: absolute movement'),
  category(2, 'Turtle: drawing shapes'),
  category(3, 'Other Turtle commands'),
  category(4, 'Canvas operations'),
  category(5, 'General arithmetic functions'),
  category(6, 'Trig / exp / log functions'),
  category(7, 'String operations'),
  category(8, 'Type conversion routines'),
  category(9, 'Input and timing routines'),
  category(10, 'Turtle Machine monitoring')
])
