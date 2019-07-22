/*
An array of expression categories (i.e. command categories plus a few other things). Used by the
usage analyser).
*/
import categories from './categories'

export default categories.concat(
  {
    title: 'Command structures',
    expressions: [
      {
        names: { BASIC: 'IF', Pascal: 'if', Python: 'if' },
        level: 0
      },
      {
        names: { BASIC: 'ELSE', Pascal: 'else', Python: 'else' },
        level: 0
      },
      {
        names: { BASIC: null, Pascal: null, Python: 'elif' },
        level: 0
      },
      {
        names: { BASIC: 'FOR', Pascal: 'for', Python: 'for' },
        level: 0
      },
      {
        names: { BASIC: 'REPEAT', Pascal: 'repeat', Python: null },
        level: 1
      },
      {
        names: { BASIC: 'WHILE', Pascal: 'while', Python: 'while' },
        level: 1
      },
      {
        names: { BASIC: 'DEF', Pascal: null, Python: 'def' },
        level: 1
      },
      {
        names: { BASIC: null, Pascal: 'procedure', Python: null },
        level: 1
      },
      {
        names: { BASIC: null, Pascal: 'function', Python: null },
        level: 2
      }
    ]
  },
  {
    title: 'Variable scope modifiers',
    expressions: [
      {
        names: { BASIC: 'LOCAL', Pascal: null, Python: null },
        level: 1
      },
      {
        names: { BASIC: 'PRIVATE', Pascal: null, Python: null },
        level: 2
      },
      {
        names: { BASIC: null, Pascal: null, Python: 'global' },
        level: 1
      },
      {
        names: { BASIC: null, Pascal: null, Python: 'nonlocal' },
        level: 2
      }
    ]
  }
)
