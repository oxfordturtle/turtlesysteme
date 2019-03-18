/*
An array of command categories. Used by the help component.
*/
import commands from './commands'

export default [
  {
    index: 0,
    title: 'Turtle: relative movement',
    expressions: commands.filter(x => x.category === 0)
  },
  {
    index: 1,
    title: 'Turtle: absolute movement',
    expressions: commands.filter(x => x.category === 1)
  },
  {
    index: 2,
    title: 'Turtle: drawing shapes',
    expressions: commands.filter(x => x.category === 2)
  },
  {
    index: 3,
    title: 'Other Turtle commands',
    expressions: commands.filter(x => x.category === 3)
  },
  {
    index: 4,
    title: 'Canvas operations',
    expressions: commands.filter(x => x.category === 4)
  },
  {
    index: 5,
    title: 'General arithmetic functions',
    expressions: commands.filter(x => x.category === 5)
  },
  {
    index: 6,
    title: 'Trig / exp / log functions',
    expressions: commands.filter(x => x.category === 6)
  },
  {
    index: 7,
    title: 'String operations',
    expressions: commands.filter(x => x.category === 7)
  },
  {
    index: 8,
    title: 'Type conversion routines',
    expressions: commands.filter(x => x.category === 8)
  },
  {
    index: 9,
    title: 'Input and timing routines',
    expressions: commands.filter(x => x.category === 9)
  },
  {
    index: 10,
    title: 'Turtle Machine monitoring',
    expressions: commands.filter(x => x.category === 10)
  }
]
