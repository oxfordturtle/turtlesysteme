/**
 * getters and setters for system-wide state variables (saved to the browser session for
 * consistency across different pages)
 */
const { examples, languages } = require('data');
const programs = require('programs');

// create error objects
const error = (id, message) =>
  ({ type: 'System', id, message });

// type checker (used for validating input)
const type = input =>
  Object.prototype.toString.call(input).slice(8, -1);

// universal getters and setters (save to local storage, and parse/stringify)
const set = (item, value) => {
  localStorage.setItem(item, JSON.stringify(value));
};

const get = item =>
  JSON.parse(localStorage.getItem(item));

// the current turtle programming language
const language = {
  get: () => get('language'),
  set: (value) => {
    if (type(value) === 'String') {
      if (languages.indexOf(value) > -1) {
        set('language', value);
        return;
      }
      throw error('set-lang-01', `'${value}' is not a valid language`);
    }
    throw error('set-lang-02', `language must be a string; ${type(value)} received`);
  }
};

// files and their properties
const name = {
  get: () => get(`name-${language.get()}`),
  set: (value, language) => {
    if (type(value) === 'String') {
      set(`name-${language}`, value);
      return;
    }
    throw error('set-name-01', `file name must be a string; ${type(value)} received`);
  }
};

const compiled = {
  get: () => get(`compiled-${language.get()}`),
  set: (value, language) => {
    if (type(value) === 'Boolean') {
      set(`compiled-${language}`, value);
      return;
    }
    throw error('set-compiled-01', `compiled must be a boolean; ${type(value)} received`);
  }
};

const code = {
  get: () => get(`code-${language.get()}`),
  set: (value, language) => {
    if (type(value) === 'String') {
      set(`code-${language}`, value);
      return;
    }
    throw error('set-code-01', `program code must be a string; ${type(value)} received`);
  }
};

const usage = {
  get: () => get(`usage-${language.get()}`),
  set: (value, language) => {
    if (type(value) === 'Array') {
      set(`usage-${language}`, value);
      return;
    }
    throw error('set-usage-01', `program usage must be an array; ${type(value)} received`);
  }
};

const pcode = {
  get: () => get(`pcode-${language.get()}`),
  set: (value, language) => {
    if (type(value) === 'Array') {
      set(`pcode-${language}`, value);
      return;
    }
    throw error('set-pcode-01', `program pcode must be an array; ${type(value)} received`);
  }
};

const file = {
  get: () => ({
    name: name.get(),
    compiled: compiled.get(),
    code: code.get(),
    usage: usage.get(),
    pcode: pcode.get(),
  }),
  new: () => {
    return name.set('', language.get())
      && compiled.set(false, language.get())
      && code.set('', language.get())
      && usage.set([], language.get())
      && pcode.set([], language.get());
  },
  set: (filename, content) => {
    const bits = filename.split('.');
    const ext = bits.pop();
    const newName = bits.join('.');
    switch (ext) {
      case 'tgb':
        return language.set('BASIC')
          && name.set(newName, 'BASIC')
          && compiled.set(false, 'BASIC')
          && code.set(content.trim(), 'BASIC')
          && usage.set([], 'BASIC')
          && pcode.set([], 'BASIC');
      case 'tgp':
        return language.set('Pascal')
          && name.set(newName, 'Pascal')
          && compiled.set(false, 'Pascal')
          && code.set(content.trim(), 'Pascal')
          && usage.set([], 'Pascal')
          && pcode.set([], 'Pascal');
      case 'tgy':
        return language.set('Python')
          && name.set(newName, 'Python')
          && compiled.set(false, 'Python')
          && code.set(content.trim(), 'Python')
          && usage.set([], 'Python')
          && pcode.set([], 'Python');
      case 'tgx':
        try {
          const data = JSON.parse(content);
          return language.set(data.language)
            && name.set(data.name, data.language)
            && compiled.set(true, data.language)
            && code.set(data.code.trim(), data.language)
            && usage.set(data.usage, data.language)
            && pcode.set(data.pcode, data.language);
        } catch (ignore) {
          throw error('set-file-01', 'file content must be valid JSON');
        }
      default:
        throw error('set-file-02', 'incorrect file type');
    }
  }
};

const example = {
  set: (id) => {
    languages.forEach((language) => {
      name.set(examples.names[id], language);
      compiled.set(false, language);
      code.set(programs[language][id].trim(), language);
      usage.set([], language);
      pcode.set([], language);
    });
    return true;
  }
};

// pcode display options
const assembler = {
  get: () => get('assembler'),
  toggle: () => {
    set('assembler', !assembler.get());
  }
};

const decimal = {
  get: () => get('decimal'),
  toggle: () => {
    set('decimal', !decimal.get());
  }
};

// machine runtime options
const showCanvas = {
  get: () => get('show-canvas'),
  toggle: () => {
    set('show-canvas', !showCanvas.get());
  }
};

const showOutput = {
  get: () => get('show-output'),
  toggle: () => {
    set('show-output', !showOutput.get());
  }
};

const showMemory = {
  get: () => get('show-memory'),
  toggle: () => {
    set('show-memory', !showMemory.get());
  }
};

const drawCountMax = {
  get: () => get('draw-count-max'),
  set: (value) => {
    set('draw-count-max', value);
  }
};

const codeCountMax = {
  get: () => get('code-count-max'),
  set: (value) => {
    set('code-count-max', value);
  }
};

const smallSize = {
  get: () => get('small-size'),
  set: (value) => {
    set('small-size', value);
  }
};

const stackSize = {
  get: () => get('stack-size'),
  set: (value) => {
    set('stack-size', value);
  }
};

const machineOptions = {
  get: () => ({
    showCanvas: showCanvas.get(),
    showOutput: showOutput.get(),
    showMemory: showMemory.get(),
    drawCountMax: drawCountMax.get(),
    codeCountMax: codeCountMax.get(),
    smallSize: smallSize.get(),
    stackSize: stackSize.get(),
  }),
  reset: () =>
    drawCountMax.set(4) && codeCountMax.set(100000) && smallSize.set(60) && stackSize.set(20000)
};

// commands table options
const group = {
  get: () => get('group'),
  set: (value) => {
    set('group', value);
  }
};

const simple = {
  get: () => get('simple'),
  toggle: () => {
    set('simple', !simple.get());
  }
};

const intermediate = {
  get: () => get('intermediate'),
  toggle: () => {
    set('intermediate', !intermediate.get());
  }
};

const advanced = {
  get: () => get('advanced'),
  toggle: () => {
    set('advanced', !advanced.get());
  }
};

// setup initial defaults if they haven't been initialised yet
set('language', get('language') || 'Pascal');
languages.forEach((language) => {
  set(`name-${language}`, get(`name-${language}`) || '');
  set(`compiled-${language}`, get(`compiled-${language}`) || false);
  set(`code-${language}`, get(`code-${language}`) || '');
  set(`usage-${language}`, get(`usage-${language}`) || []);
  set(`pcode-${language}`, get(`pcode-${language}`) || []);
});
set('assembler', get('assembler') || true);
set('decimal', get('decimal') || true);
set('show-canvas', get('show-canvas') || true);
set('show-output', get('show-output') || false);
set('show-memory', get('show-memory') || true);
set('draw-count-max', get('draw-count-max') || 4);
set('code-count-max', get('code-count-max') || 100000);
set('small-size', get('small-size') || 60);
set('stack-size', get('stack-size') || 20000);
set('group', get('group') || 0);
set('simple', get('simple') || true);
set('intermediate', get('intermediate') || false);
set('advanced', get('advanced') || false);

// export everything
module.exports = {
  language,
  name,
  code,
  compiled,
  usage,
  pcode,
  file,
  example,
  assembler,
  decimal,
  showCanvas,
  showOutput,
  showMemory,
  drawCountMax,
  codeCountMax,
  smallSize,
  stackSize,
  machineOptions,
  group,
  simple,
  intermediate,
  advanced,
};
