/*
 * groups of commands
 */
const commands = require('./commands');

const inGroup = (index, command) =>
  command.group === index;

const newGroup = (index, category) =>
  ({
    index,
    category,
    expressions: commands.filter(inGroup.bind(null, index))
  });

module.exports = ([
  newGroup(0, 'Turtle: relative movement'),
  newGroup(1, 'Turtle: absolute movement'),
  newGroup(2, 'Turtle: drawing shapes'),
  newGroup(3, 'Other Turtle commands'),
  newGroup(4, 'Canvas operations'),
  newGroup(5, 'General arithmetic functions'),
  newGroup(6, 'Trig / exp / log functions'),
  newGroup(7, 'String operations'),
  newGroup(8, 'Type conversion routines'),
  newGroup(9, 'Input and timing routines'),
  newGroup(10, 'Turtle Machine monitoring'),
]);
