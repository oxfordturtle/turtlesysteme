/*
getters and setters for system-wide state variables (saved to the browser session for consistency
across different pages)
*/

// the current turtle programming language
module.exports.language = {
  get: () => get('language'),
  set: (value) => {
    if (type(value) !== 'String') throw error(`language must be a string; ${type(value)} received`)
    if (languages.indexOf(value) === -1) throw error(`"${value}" is not a valid language`)
    set('language', value)
  }
}

// files and their properties
module.exports.name = {
  get: () => get(`name-${get('language')}`),
  set: (value, language) => {
    if (type(value) !== 'String') throw error(`file name must be a string; ${type(value)} received`)
    set(`name-${language}`, value)
  }
}

module.exports.compiled = {
  get: () => get(`compiled-${get('language')}`),
  set: (value, language) => {
    if (type(value) !== 'Boolean') throw error(`compiled must be a boolean; ${type(value)} received`)
    set(`compiled-${language}`, value)
  }
}

module.exports.code = {
  get: () => get(`code-${get('language')}`),
  set: (value, language) => {
    if (type(value) !== 'String') throw error(`program code must be a string; ${type(value)} received`)
    set(`code-${language}`, value)
  }
}

module.exports.usage = {
  get: () => get(`usage-${get('language')}`),
  set: (value, language) => {
    if (type(value) !== 'Array') throw error(`program usage must be an array; ${type(value)} received`)
    set(`usage-${language}`, value)
  }
}

module.exports.pcode = {
  get: () => get(`pcode-${get('language')}`),
  set: (value, language) => {
    if (type(value) !== 'Array') throw error(`program pcode must be an array; ${type(value)} received`)
    set(`pcode-${language}`, value)
  }
}

module.exports.file = {
  get: () => ({
    name: get(`name-${get('language')}`),
    compiled: get(`compiled-${get('language')}`),
    code: get(`code-${get('language')}`),
    usage: get(`usage-${get('language')}`),
    pcode: get(`pcode-${get('language')}`)
  }),
  new: () => {
    const language = get('language')
    set(`name-${language}`, '')
    set(`compiled-${language}`, false)
    set(`code-${language}`, '')
    set(`usage-${language}`, [])
    set(`pcode-${language}`, [])
    return true
  },
  set: (filename, content) => {
    const bits = filename.split('.')
    const ext = bits.pop()
    const name = bits.join('.')
    if (type(content) !== 'String') throw error('Invalid file contents.')
    switch (ext) {
      case 'tgb':
        set('language', 'BASIC')
        set('name-BASIC', name)
        set('compiled-BASIC', false)
        set('code-BASIC', content.trim())
        set('usage-BASIC', [])
        set('pcode-BASIC', [])
        break
      case 'tgp':
        set('language', 'Pascal')
        set('name-Pascal', name)
        set('compiled-Pascal', false)
        set('code-Pascal', content.trim())
        set('usage-Pascal', [])
        set('pcode-Pascal', [])
        break
      case 'tgy':
        set('language', 'Python')
        set('name-Python', name)
        set('compiled-Python', false)
        set('code-Python', content.trim())
        set('usage-Python', [])
        set('pcode-Python', [])
        break
      case 'tgx':
        try {
          const data = JSON.parse(content)
          set('language', data.language)
          set(`name-${data.language}`, data.name)
          set(`compiled-${data.language}`, true)
          set(`code-${data.language}`, data.code.trim())
          set(`usage-${data.language}`, data.usage)
          set(`pcode-${data.language}`, data.pcode)
        } catch (ignore) {
          throw error('Invalid TGX file.')
        }
        break
      default:
        throw error('Invalid file type.')
    }
  }
}

module.exports.example = {
  set: (id) => {
    languages.forEach((language) => {
      set(`name-${language}`, examples.names[id])
      set(`compiled-${language}`, false)
      set(`code-${language}`, programs[language][id].trim())
      set(`usage-${language}`, [])
      set(`pcode-${language}`, [])
    })
    return true
  }
}

// pcode display options
module.exports.assembler = {
  get: () => get('assembler'),
  toggle: () => set('assembler', !get('assembler'))
}

module.exports.decimal = {
  get: () => get('decimal'),
  toggle: () => set('decimal', !get('decimal'))
}

// machine runtime options
module.exports.showCanvas = {
  get: () => get('show-canvas'),
  toggle: () => set('show-canvas', !get('show-canvas'))
}

module.exports.showOutput = {
  get: () => get('show-output'),
  toggle: () => set('show-output', !get('show-output'))
}

module.exports.showMemory = {
  get: () => get('show-memory'),
  toggle: () => set('show-memory', !get('show-memory'))
}

module.exports.drawCountMax = {
  get: () => get('draw-count-max'),
  set: (value) => set('draw-count-max', value)
}

module.exports.codeCountMax = {
  get: () => get('code-count-max'),
  set: (value) => set('code-count-max', value)
}

module.exports.smallSize = {
  get: () => get('small-size'),
  set: (value) => set('small-size', value)
}

module.exports.stackSize = {
  get: () => get('stack-size'),
  set: (value) => set('stack-size', value)
}

module.exports.machineOptions = {
  get: () => ({
    showCanvas: get('show-canvas'),
    showOutput: get('show-output'),
    showMemory: get('show-memory'),
    drawCountMax: get('draw-count-max'),
    codeCountMax: get('code-count-max'),
    smallSize: get('small-size'),
    stackSize: get('stack-size')
  }),
  reset: () => {
    set('draw-count-max', 4)
    set('code-count-max', 100000)
    set('small-size', 60)
    set('stack-size', 20000)
  }
}

// commands table options
module.exports.group = {
  get: () => get('group'),
  set: (value) => set('group', value)
}

module.exports.simple = {
  get: () => get('simple'),
  toggle: () => set('simple', !get('simple'))
}

module.exports.intermediate = {
  get: () => get('intermediate'),
  toggle: () => set('intermediate', !get('intermediate'))
}

module.exports.advanced = {
  get: () => get('advanced'),
  toggle: () => set('advanced', !get('advanced'))
}

// dependencies
const { examples, languages } = require('data')
const programs = require('programs')

// create an error object
const error = (message) => {
  const err = new Error(message)
  err.type = 'System'
  return err
}

// type checker (used for validating input)
const type = input =>
  Object.prototype.toString.call(input).slice(8, -1)

// universal getters and setters (save to local storage, and parse/stringify)
const set = (item, value) =>
  window.localStorage.setItem(item, JSON.stringify(value))

const get = item =>
  JSON.parse(window.localStorage.getItem(item))

// setup initial defaults if they haven't been initialised yet
set('language', get('language') || 'Pascal')
languages.forEach((language) => {
  set(`name-${language}`, get(`name-${language}`) || '')
  set(`compiled-${language}`, get(`compiled-${language}`) || false)
  set(`code-${language}`, get(`code-${language}`) || '')
  set(`usage-${language}`, get(`usage-${language}`) || [])
  set(`pcode-${language}`, get(`pcode-${language}`) || [])
})
set('assembler', get('assembler') || true)
set('decimal', get('decimal') || true)
set('show-canvas', get('show-canvas') || true)
set('show-output', get('show-output') || false)
set('show-memory', get('show-memory') || true)
set('draw-count-max', get('draw-count-max') || 4)
set('code-count-max', get('code-count-max') || 100000)
set('small-size', get('small-size') || 60)
set('stack-size', get('stack-size') || 20000)
set('group', get('group') || 0)
set('simple', get('simple') || true)
set('intermediate', get('intermediate') || false)
set('advanced', get('advanced') || false)
