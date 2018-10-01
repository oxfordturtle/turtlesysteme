/*
pseudo constructors for data objects
*/
import { padded } from '../tools.js'

export const parameter = (name, type, byref = false, length = 1) =>
  ({ name, type, byref, length })

export const command = properties =>
  ({
    names: { BASIC: properties.names[0], Pascal: properties.names[1], Python: properties.names[2] },
    code: properties.code,
    parameters: properties.parameters || [],
    returns: properties.returns,
    type: properties.returns ? 'function' : 'procedure',
    category: properties.category,
    level: properties.level,
    description: properties.description
  })

export const category = (index, title, expressions) =>
  ({ index, title, expressions })

export const expression = (names, level) =>
  ({ names: { BASIC: names[0], Pascal: names[1], Python: names[2] }, level })

export const colour = (index, name, value, dark) =>
  ({
    index,
    names: { BASIC: name.toUpperCase(), Pascal: name, Python: name },
    type: 'integer',
    value,
    hex: {
      BASIC: `&${padded(value.toString(16))}`,
      Pascal: `$${padded(value.toString(16))}`,
      Python: `0x${padded(value.toString(16))}`
    },
    css: `#${padded(value.toString(16))}`,
    dark
  })

export const cursor = (index, name, css) =>
  ({ index, name, css })

export const font = (index, name, css) =>
  ({ index, name, css })

export const input = (name, value) =>
  ({ names: { BASIC: name.toUpperCase(), Pascal: name, Python: name }, value })

export const group = (index, title, examples) =>
  ({ index, title, examples })

export const pcode = (code, args, str) =>
  ({ code, args, str })
