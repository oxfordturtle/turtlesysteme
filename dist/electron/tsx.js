/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * create a pre-filled html element
 */
const create = (type, options = {}) => {
  const element = document.createElement(type);
  Object.keys(options).forEach((key) => {
    switch (key) {
      case 'classes':
        options.classes.forEach(x => element.classList.add(x));
        break;
      case 'content':
        if (typeof options.content === 'string') {
          element.innerHTML = options.content;
        } else {
          options.content.forEach(child => element.appendChild(child));
        }
        break;
      case 'on':
        options.on.forEach(e => element.addEventListener(e.type, e.callback));
        break;
      default:
        element.setAttribute(key, options[key]);
        break;
    }
  });
  return element;
};

/* harmony default export */ __webpack_exports__["a"] = (create);


/***/ }),
/* 1 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			var styleTarget = fn.call(this, selector);
			// Special case to return head of iframe instead of iframe itself
			if (styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[selector] = styleTarget;
		}
		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(19);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton) options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else if (typeof options.insertAt === "object" && options.insertAt.before) {
		var nextSibling = getElement(options.insertInto + " " + options.insertAt.before);
		target.insertBefore(style, nextSibling);
	} else {
		throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__data_constants__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_error__ = __webpack_require__(21);
/**
 * getters and setters for system-wide state variables (saved to the browser session for
 * consistency across different pages)
 */



// type checker (used for validating input)
const type = input =>
  Object.prototype.toString.call(input).slice(8, -1);

// the current turtle programming language
const language = {
  get: () => sessionStorage.getItem('language'),
  set: (value) => {
    if (type(value) === 'string') {
      if (__WEBPACK_IMPORTED_MODULE_0__data_constants__["a" /* LANGUAGES */].indexOf(value) > -1) {
        sessionStorage.setItem('language', value);
        return true;
      }
      Object(__WEBPACK_IMPORTED_MODULE_1__components_error__["a" /* default */])(`'${value}' is not a valid language`);
      return false;
    }
    Object(__WEBPACK_IMPORTED_MODULE_1__components_error__["a" /* default */])(`language must be a string; ${type(value)} received`);
    return false;
  },
};

// the current machine version
const version = {
  get: () => JSON.parse(sessionStorage.getItem('version')),
  set: (value) => {
    if (__WEBPACK_IMPORTED_MODULE_0__data_constants__["b" /* VERSIONS */].indexOf(value) > -1) {
      sessionStorage.setItem('version', JSON.stringify(value));
      return true;
    }
    Object(__WEBPACK_IMPORTED_MODULE_1__components_error__["a" /* default */])(`${value} is not a valid version value`);
    return false;
  },
};

// files and their properties
const name = {
  get: () => sessionStorage.getItem(`name-${language.get()}`),
  set: (value) => {
    if (type(value) === 'String') {
      sessionStorage.setItem(`name-${language.get()}`, value);
      return true;
    }
    Object(__WEBPACK_IMPORTED_MODULE_1__components_error__["a" /* default */])(`file name must be a string; ${type(value)} received`);
    return false;
  },
};

const compiled = {
  get: () => JSON.parse(sessionStorage.getItem(`compiled-${language.get()}`)),
  set: (value) => {
    if (type(value) === 'Boolean') {
      sessionStorage.setItem(`compiled-${language.get()}`, value);
      return true;
    }
    Object(__WEBPACK_IMPORTED_MODULE_1__components_error__["a" /* default */])(`compiled must be a boolean; ${type(value)} received`);
    return false;
  },
  toggle: () => {
    sessionStorage.setItem(`compiled-${language.get()}`, JSON.stringify(!compiled.get()));
    return true;
  },
};

const code = {
  get: () => sessionStorage.getItem(`code-${language.get()}`),
  set: (value) => {
    if (type(value) === 'String') {
      sessionStorage.setItem(`code-${language.get()}`, value);
      return true;
    }
    Object(__WEBPACK_IMPORTED_MODULE_1__components_error__["a" /* default */])(`program code must be a string; ${type(value)} received`);
    return false;
  },
};

const usage = {
  get: () => JSON.parse(sessionStorage.getItem(`usage-${language.get()}`)),
  set: (value) => {
    if (type(value) === 'Array') {
      sessionStorage.setItem(`usage-${language.get()}`, JSON.stringify(value));
      return true;
    }
    Object(__WEBPACK_IMPORTED_MODULE_1__components_error__["a" /* default */])(`program usage must be an array; ${type(value)} received`);
    return false;
  },
};

const pcode = {
  get: () => JSON.parse(sessionStorage.getItem(`pcode-${language.get()}`)),
  set: (value) => {
    if (type(value) === 'Array') {
      sessionStorage.setItem(`pcode-${language.get()}`, JSON.stringify(value));
      return true;
    }
    Object(__WEBPACK_IMPORTED_MODULE_1__components_error__["a" /* default */])(`program pcode must be an array; ${type(value)} received`);
    return false;
  },
};

const file = {
  get: () => ({
    name: name.get(),
    compiled: compiled.get(),
    code: code.get(),
    usage: usage.get(),
    pcode: pcode.get(),
  }),
  set: (filename, content) => {
    const bits = filename.split('.');
    const ext = bits.pop();
    const newName = bits.join('.');
    switch (ext) {
      case 'tgb':
        return language.set('BASIC') && name.set(newName) && code.set(content);
      case 'tgp':
        return language.set('Pascal') && name.set(newName) && code.set(content);
      case 'tgy':
        return language.set('Python') && name.set(newName) && code.set(content);
      case 'tgx':
        try {
          const data = JSON.parse(content);
          return language.set(data.language)
            && name.set(data.name)
            && compiled.set(true)
            && code.set(data.code)
            && usage.set(data.usage)
            && pcode.set(data.pcode);
        } catch (ignore) {
          Object(__WEBPACK_IMPORTED_MODULE_1__components_error__["a" /* default */])('file content must be valid JSON');
          return false;
        }
      default:
        Object(__WEBPACK_IMPORTED_MODULE_1__components_error__["a" /* default */])('incorrect file type');
        return false;
    }
  },
};

// pcode display options
const pcodeDisplay = {
  get: () => ({
    assembler: JSON.parse(sessionStorage.getItem('assembler')),
    decimal: JSON.parse(sessionStorage.getItem('decimal')),
  }),
  toggle: (option) => {
    switch (option) {
      case 'assembler':
        sessionStorage.setItem('assembler', !pcodeDisplay.get('assembler'));
        return true;
      case 'decimal':
        sessionStorage.setItem('assembler', !pcodeDisplay.get('decimal'));
        return true;
      default:
        Object(__WEBPACK_IMPORTED_MODULE_1__components_error__["a" /* default */])(`pcode display option must be 'assembler' or 'decimal'; '${option}' received`);
        return false;
    }
  },
};

// machine runtime options
const machineOptions = {
  get: () => ({
    compileFirst: JSON.parse(sessionStorage.getItem('compile-first')),
    showCanvas: JSON.parse(sessionStorage.getItem('show-canvas')),
    showOutput: JSON.parse(sessionStorage.getItem('show-output')),
    showMemory: JSON.parse(sessionStorage.getItem('show-memory')),
    drawCountMax: JSON.parse(sessionStorage.getItem('draw-count-max')),
    codeCountMax: JSON.parse(sessionStorage.getItem('code-count-max')),
    smallSize: JSON.parse(sessionStorage.getItem('small-size')),
    stackSize: JSON.parse(sessionStorage.getItem('stack-size')),
  }),
  set: () => {},
  toggle: () => {},
};

// commands table options
const commandsTable = {
  get: () => ({
    group: JSON.parse(sessionStorage.getItem('group')),
    levels: JSON.parse(sessionStorage.getItem('levels')),
  }),
  set: (option, value) => {
    switch (option) {
      case 'group':
        return false;
      case 'simple':
        return false;
      case 'intermediate':
        return false;
      case 'advanced':
        return false;
      default:
        Object(__WEBPACK_IMPORTED_MODULE_1__components_error__["a" /* default */])(`${value} is not a valid commands table option`);
        return false;
    }
  },
  toggle: () => {},
};

// setup initial defaults if they haven't been initialised yet
sessionStorage.setItem('language', sessionStorage.getItem('language') || 'Pascal');
sessionStorage.setItem('version', sessionStorage.getItem('version') || '11');
__WEBPACK_IMPORTED_MODULE_0__data_constants__["a" /* LANGUAGES */].forEach((lang) => {
  sessionStorage.setItem(`name-${lang}`, sessionStorage.getItem(`name-${lang}`) || '');
  sessionStorage.setItem(`compiled-${lang}`, sessionStorage.getItem(`name-${lang}`) || 'false');
  sessionStorage.setItem(`code-${lang}`, sessionStorage.getItem(`name-${lang}`) || '');
  sessionStorage.setItem(`usage-${lang}`, sessionStorage.getItem(`name-${lang}`) || '[]');
  sessionStorage.setItem(`pcode-${lang}`, sessionStorage.getItem(`name-${lang}`) || '[]');
});
sessionStorage.setItem('assembler', sessionStorage.getItem('assembler') || 'true');
sessionStorage.setItem('decimal', sessionStorage.getItem('decimal') || 'true');
sessionStorage.setItem('compile-first', sessionStorage.getItem('advanced') || 'true');
sessionStorage.setItem('show-canvas', sessionStorage.getItem('show-canvas') || 'true');
sessionStorage.setItem('show-output', sessionStorage.getItem('show-output') || 'false');
sessionStorage.setItem('show-memory', sessionStorage.getItem('show-memory') || 'true');
sessionStorage.setItem('draw-count-max', sessionStorage.getItem('draw-count-max') || '4');
sessionStorage.setItem('code-count-max', sessionStorage.getItem('code-count-max') || '100000');
sessionStorage.setItem('small-size', sessionStorage.getItem('small-size') || '60');
sessionStorage.setItem('stack-size', sessionStorage.getItem('stack-size') || '20000');
sessionStorage.setItem('group', sessionStorage.getItem('group') || '0');
sessionStorage.setItem('simple', sessionStorage.getItem('simple') || 'true');
sessionStorage.setItem('intermediate', sessionStorage.getItem('intermediate') || 'false');
sessionStorage.setItem('advanced', sessionStorage.getItem('advanced') || 'false');

// export everything
/* harmony default export */ __webpack_exports__["a"] = ({
  language,
  version,
  name,
  code,
  compiled,
  usage,
  pcode,
  file,
  pcodeDisplay,
  machineOptions,
  commandsTable,
});


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__session__ = __webpack_require__(3);
/**
 * the central hub for maintaining application state and communicating between different modules
 */

// import compile from '../compilers/compile';
// import run from '../machine/run';

// a record of "replies", i.e. arrays of callbacks that other modules can register to be run after
// a state change
const replies = {
  'language-changed': [],
  'file-changed': [],
  'name-changed': [],
  'code-changed': [],
  'usage-changed': [],
  'pcode-changed': [],
  'pcode-display-changed': [],
  'machine-options-changed': [],
  'commands-table-changed': [],
};

// function (exposed) for registering callbacks in the replies record
const on = (signal, callback) => {
  if (replies[signal]) {
    replies[signal].push(callback);
  }
};

// function for executing any registered callbacks following a state change
const reply = (signal, data) => {
  if (replies[signal]) {
    replies[signal].forEach(callback => callback(data));
  }
  if (signal === 'language-changed') {
    // if language has changed, reply that file has changed as well
    reply('file-changed', __WEBPACK_IMPORTED_MODULE_0__session__["a" /* default */].file.get());
  }
  if (signal === 'file-changed') {
    // if file has changed, reply that file properties have changed as well
    reply('filename-changed', __WEBPACK_IMPORTED_MODULE_0__session__["a" /* default */].name.get());
    reply('code-changed', __WEBPACK_IMPORTED_MODULE_0__session__["a" /* default */].code.get());
    reply('usage-changed', __WEBPACK_IMPORTED_MODULE_0__session__["a" /* default */].usage.get());
    reply('pcode-changed', __WEBPACK_IMPORTED_MODULE_0__session__["a" /* default */].pcode.get());
  }
};

// record (exposed) of signals and related update functions
// this is used by the electron version of the app, to pass on any signals from the electron menu
const signals = {
  'set-language': (data) => {
    if (__WEBPACK_IMPORTED_MODULE_0__session__["a" /* default */].language.set(data)) {
      reply('language-changed', __WEBPACK_IMPORTED_MODULE_0__session__["a" /* default */].language.get());
    }
  },
  'set-file': (data) => {
    if (__WEBPACK_IMPORTED_MODULE_0__session__["a" /* default */].file.set(data.filename, data.content)) {
      reply('language-changed', __WEBPACK_IMPORTED_MODULE_0__session__["a" /* default */].language.get());
    }
  },
  'set-name': (data) => {
    if (__WEBPACK_IMPORTED_MODULE_0__session__["a" /* default */].name.set(data)) {
      reply('name-changed', __WEBPACK_IMPORTED_MODULE_0__session__["a" /* default */].name.get());
    }
  },
  'set-code': (data) => {
    if (__WEBPACK_IMPORTED_MODULE_0__session__["a" /* default */].code.set(data)) {
      reply('code-changed', __WEBPACK_IMPORTED_MODULE_0__session__["a" /* default */].code.get());
    }
  },
  'compile-code': () => {},
  'toggle-assembler': () => {
    if (__WEBPACK_IMPORTED_MODULE_0__session__["a" /* default */].assembler.toggle()) {
      reply('assembler-changed', __WEBPACK_IMPORTED_MODULE_0__session__["a" /* default */].assembler.get());
    }
  },
  'toggle-decimal': () => {
    if (__WEBPACK_IMPORTED_MODULE_0__session__["a" /* default */].decimal.toggle()) {
      reply('decimal-changed', __WEBPACK_IMPORTED_MODULE_0__session__["a" /* default */].decimal.get());
    }
  },
  'reset-machine-options': () => {},
  'toggle-compile-first': () => {},
  'toggle-show-canvas': () => {},
  'toggle-show-output': () => {},
  'toggle-show-memory': () => {},
  'set-draw-count-max': data => data,
  'set-code-count-max': data => data,
  'set-small-size': data => data,
  'set-stack-size': data => data,
  'set-group': data => data,
  'toggle-simple': () => {},
  'toggle-intermediate': () => {},
  'toggle-advanced': () => {},
};

// function (exposed) for "sending" signals to this module, instructing it to update the state
const send = (signal, data) => {
  if (signals[signal]) signals[signal](data);
};

/* harmony default export */ __webpack_exports__["a"] = ({
  on,
  send,
  signals,
});


/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LANGUAGES; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return VERSIONS; });
/* unused harmony export HELPSECTIONS */
const LANGUAGES = [
  'BASIC',
  'Pascal',
  'Python',
];

const VERSIONS = [
  11,
  12,
];

const HELPSECTIONS = [
  'commands',
  'basics',
  'structures',
  'operators',
  'input',
  'constants',
  'about',
  'differences',
];




/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_electron__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_electron___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_electron__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__help_commands__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__help_basics__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__help_structures__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__help_operators__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__help_input__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__help_constants__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__help_about__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__help_versions__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__components_tabs__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__components_topbar__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__components_file__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__components_code__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__components_usage__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__components_pcode__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__components_machine__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__components_settings__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__components_canvas__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__components_console__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__components_output__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__components_memory__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__styles_tsx_scss__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__styles_tsx_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_21__styles_tsx_scss__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__styles_electron_scss__ = __webpack_require__(43);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__styles_electron_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_22__styles_electron_scss__);
























const tsx = document.getElementById('tsx');

switch (__WEBPACK_IMPORTED_MODULE_0_electron__["remote"].getCurrentWindow().page) {
  case 'settings':
    tsx.apendChild(__WEBPACK_IMPORTED_MODULE_16__components_settings__["a" /* default */]);
    break;
  case 'help':
    tsx.classList.add('tsx-help');
    tsx.appendChild(Object(__WEBPACK_IMPORTED_MODULE_9__components_tabs__["a" /* default */])('tsx-help-tabs', [
      {
        id: 'commands',
        label: 'Commands',
        active: true,
        content: [__WEBPACK_IMPORTED_MODULE_1__help_commands__["a" /* default */]],
      },
      {
        id: 'basics',
        label: 'Basics',
        active: false,
        content: [__WEBPACK_IMPORTED_MODULE_2__help_basics__["a" /* default */]],
      },
      {
        id: 'structures',
        label: 'Structures',
        active: false,
        content: [__WEBPACK_IMPORTED_MODULE_3__help_structures__["a" /* default */]],
      },
      {
        id: 'operators',
        label: 'Operators',
        active: false,
        content: [__WEBPACK_IMPORTED_MODULE_4__help_operators__["a" /* default */]],
      },
      {
        id: 'input',
        label: 'User Input',
        active: false,
        content: [__WEBPACK_IMPORTED_MODULE_5__help_input__["a" /* default */]],
      },
      {
        id: 'constants',
        label: 'Constants',
        active: false,
        content: [__WEBPACK_IMPORTED_MODULE_6__help_constants__["a" /* default */]],
      },
      {
        id: 'about',
        label: 'About',
        active: false,
        content: [__WEBPACK_IMPORTED_MODULE_7__help_about__["a" /* default */]],
      },
      {
        id: 'versions',
        label: 'Different Versions',
        active: false,
        content: [__WEBPACK_IMPORTED_MODULE_8__help_versions__["a" /* default */]],
      },
    ]));
    break;
  default:
    tsx.appendChild(Object(__WEBPACK_IMPORTED_MODULE_9__components_tabs__["a" /* default */])('tsx-top-tabs', [
      {
        id: 'program',
        active: true,
        label: 'Program',
        content: [
          Object(__WEBPACK_IMPORTED_MODULE_10__components_topbar__["a" /* default */])(true),
          Object(__WEBPACK_IMPORTED_MODULE_9__components_tabs__["a" /* default */])('tsx-system-tabs', [
            {
              id: 'file',
              label: 'File',
              active: false,
              content: [__WEBPACK_IMPORTED_MODULE_11__components_file__["a" /* default */]],
            },
            {
              id: 'code',
              label: 'Code',
              active: true,
              content: [__WEBPACK_IMPORTED_MODULE_12__components_code__["a" /* default */]],
            },
            {
              id: 'usage',
              label: 'Usage',
              active: false,
              content: [__WEBPACK_IMPORTED_MODULE_13__components_usage__["a" /* default */]],
            },
            {
              id: 'pcode',
              label: 'PCode',
              active: false,
              content: [__WEBPACK_IMPORTED_MODULE_14__components_pcode__["a" /* default */]],
            },
          ]),
        ],
      },
      {
        id: 'machine',
        active: false,
        label: 'Machine',
        content: [
          __WEBPACK_IMPORTED_MODULE_15__components_machine__["a" /* default */],
          Object(__WEBPACK_IMPORTED_MODULE_9__components_tabs__["a" /* default */])('tsx-system-tabs', [
            {
              id: 'settings',
              label: 'Settings',
              active: false,
              content: [__WEBPACK_IMPORTED_MODULE_16__components_settings__["a" /* default */]],
            },
            {
              id: 'canvas',
              label: 'Canvas &amp; Console',
              active: true,
              content: [__WEBPACK_IMPORTED_MODULE_17__components_canvas__["a" /* default */], __WEBPACK_IMPORTED_MODULE_18__components_console__["a" /* default */]],
            },
            {
              id: 'output',
              label: 'Output',
              active: false,
              content: [__WEBPACK_IMPORTED_MODULE_19__components_output__["a" /* default */]],
            },
            {
              id: 'memory',
              label: 'Memory',
              active: false,
              content: [__WEBPACK_IMPORTED_MODULE_20__components_memory__["a" /* default */]],
            },
          ]),
        ],
      },
    ]));
    break;
}


/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("electron");

/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_create__ = __webpack_require__(0);


/* harmony default export */ __webpack_exports__["a"] = (Object(__WEBPACK_IMPORTED_MODULE_0__components_create__["a" /* default */])('div', { content: 'commands' }));


/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_create__ = __webpack_require__(0);


/* harmony default export */ __webpack_exports__["a"] = (Object(__WEBPACK_IMPORTED_MODULE_0__components_create__["a" /* default */])('div', { content: 'basics' }));


/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_create__ = __webpack_require__(0);


/* harmony default export */ __webpack_exports__["a"] = (Object(__WEBPACK_IMPORTED_MODULE_0__components_create__["a" /* default */])('div', { content: 'structures' }));


/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_create__ = __webpack_require__(0);


/* harmony default export */ __webpack_exports__["a"] = (Object(__WEBPACK_IMPORTED_MODULE_0__components_create__["a" /* default */])('div', { content: 'operators' }));


/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_create__ = __webpack_require__(0);


/* harmony default export */ __webpack_exports__["a"] = (Object(__WEBPACK_IMPORTED_MODULE_0__components_create__["a" /* default */])('div', { content: 'user input' }));


/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_create__ = __webpack_require__(0);


/* harmony default export */ __webpack_exports__["a"] = (Object(__WEBPACK_IMPORTED_MODULE_0__components_create__["a" /* default */])('div', { content: 'constants' }));


/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_create__ = __webpack_require__(0);


/* harmony default export */ __webpack_exports__["a"] = (Object(__WEBPACK_IMPORTED_MODULE_0__components_create__["a" /* default */])('div', { content: 'about' }));


/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_create__ = __webpack_require__(0);


/* harmony default export */ __webpack_exports__["a"] = (Object(__WEBPACK_IMPORTED_MODULE_0__components_create__["a" /* default */])('div', { content: 'versions' }));


/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__create__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__styles_tabs_scss__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__styles_tabs_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__styles_tabs_scss__);
/**
 * create tabs with associated tab panes
 */



const activate = (node) => {
  const siblings = Array.prototype.slice.call(node.parentElement.children);
  siblings.forEach(x => x.classList.remove('active'));
  node.classList.add('active');
};

const changeTab = (e) => {
  activate(e.currentTarget);
  activate(document.getElementById(e.currentTarget.getAttribute('data-target')));
};

const tab = options =>
  Object(__WEBPACK_IMPORTED_MODULE_0__create__["a" /* default */])('a', {
    classes: options.active ? ['active'] : [],
    content: options.label,
    'data-target': options.id,
    on: [{ type: 'click', callback: changeTab }],
  });

const list = optionsArray =>
  Object(__WEBPACK_IMPORTED_MODULE_0__create__["a" /* default */])('nav', { content: optionsArray.map(tab) });

const pane = options =>
  Object(__WEBPACK_IMPORTED_MODULE_0__create__["a" /* default */])('div', {
    classes: options.active ? ['active'] : [],
    content: options.content,
    id: options.id,
  });

const panes = optionsArray =>
  Object(__WEBPACK_IMPORTED_MODULE_0__create__["a" /* default */])('div', { content: optionsArray.map(pane) });

const tabs = (customClass, optionsArray) =>
  Object(__WEBPACK_IMPORTED_MODULE_0__create__["a" /* default */])('div', {
    classes: ['tsx-tabs', customClass],
    content: [list(optionsArray), panes(optionsArray)],
  });

// export default tabs;
/* harmony default export */ __webpack_exports__["a"] = (tabs);


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(18);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(2)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/sass-loader/lib/loader.js!./tabs.scss", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/sass-loader/lib/loader.js!./tabs.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(undefined);
// imports


// module
exports.push([module.i, "/**\n * constants for CSS styles\n */\n.tsx-tabs {\n  flex: 1;\n  display: flex;\n  flex-direction: column; }\n  .tsx-tabs > nav {\n    display: flex; }\n    .tsx-tabs > nav a {\n      display: block;\n      cursor: pointer; }\n      .tsx-tabs > nav a.active:hover {\n        cursor: default; }\n  .tsx-tabs > div {\n    flex: 1; }\n    .tsx-tabs > div > div {\n      display: none; }\n      .tsx-tabs > div > div.active {\n        display: block; }\n\n.tsx-top-tabs > nav a {\n  flex: 1;\n  padding: 1em;\n  background: #5b5b5b;\n  color: #fff; }\n  .tsx-top-tabs > nav a:hover {\n    background: #424242; }\n  .tsx-top-tabs > nav a.active {\n    background: #282828; }\n\n.tsx-top-tabs > div {\n  padding: 4px; }\n\n.tsx-system-tabs > nav a {\n  background: #ebebeb;\n  color: #282828;\n  padding: .625em .75em;\n  margin-right: .2em;\n  transform: translateY(0.125em);\n  transition: transform linear .1s; }\n  .tsx-system-tabs > nav a:hover, .tsx-system-tabs > nav a.active {\n    transform: translateY(0); }\n  .tsx-system-tabs > nav a.active {\n    background: #fff; }\n\n.tsx-system-tabs > div {\n  background: #fff;\n  flex: 1;\n  z-index: 2; }\n  .tsx-system-tabs > div > div {\n    padding: 4px;\n    height: 100%; }\n\n.tsx-help-tabs {\n  flex-direction: row; }\n", ""]);

// exports


/***/ }),
/* 19 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 20 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__data_constants__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_create__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__common_session__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__common_signals__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__styles_topbar_scss__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__styles_topbar_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4__styles_topbar_scss__);
/**
 * the topbar component, displayed above the program tabs and help pages
 */






// define the main HTML elements for this component
const nameInput = Object(__WEBPACK_IMPORTED_MODULE_1__components_create__["a" /* default */])('input', { type: 'text', placeholder: 'filename' });
const languageOption = language => Object(__WEBPACK_IMPORTED_MODULE_1__components_create__["a" /* default */])('option', { content: language, value: language });
const languageSelect = Object(__WEBPACK_IMPORTED_MODULE_1__components_create__["a" /* default */])('select', { content: __WEBPACK_IMPORTED_MODULE_0__data_constants__["a" /* LANGUAGES */].map(languageOption) });
const versionOption = version => Object(__WEBPACK_IMPORTED_MODULE_1__components_create__["a" /* default */])('option', { content: `v.${version}`, value: version });
const versionSelect = Object(__WEBPACK_IMPORTED_MODULE_1__components_create__["a" /* default */])('select', { content: __WEBPACK_IMPORTED_MODULE_0__data_constants__["b" /* VERSIONS */].map(versionOption) });

// send 'set-name' signal on native name input event
nameInput.addEventListener('input', (e) => {
  __WEBPACK_IMPORTED_MODULE_3__common_signals__["a" /* default */].send('set-filename', e.currentTarget.value);
});

// send 'set-language' signal on native language menu change event
languageSelect.addEventListener('change', (e) => {
  __WEBPACK_IMPORTED_MODULE_3__common_signals__["a" /* default */].send('set-language', e.currentTarget.value);
});

// send 'set-version' signal on native version menu change event
versionSelect.addEventListener('change', (e) => {
  __WEBPACK_IMPORTED_MODULE_3__common_signals__["a" /* default */].send('set-version', e.currentTarget.value);
});

// function to synchronise the name input with the application state
const refreshName = (name) => {
  nameInput.value = name;
};

// function to synchronise the language menu with the application state
const refreshLanguage = (language) => {
  languageSelect.value = language;
};

// function to synchronise the version menu with the application state
const refreshVersion = (version) => {
  versionSelect.value = version;
};

// synchronise with the current state, and subscribe to keep it in sync
refreshName(__WEBPACK_IMPORTED_MODULE_2__common_session__["a" /* default */].name.get());
refreshLanguage(__WEBPACK_IMPORTED_MODULE_2__common_session__["a" /* default */].language.get());
refreshVersion(__WEBPACK_IMPORTED_MODULE_2__common_session__["a" /* default */].version.get());
__WEBPACK_IMPORTED_MODULE_3__common_signals__["a" /* default */].on('name-changed', refreshName);
__WEBPACK_IMPORTED_MODULE_3__common_signals__["a" /* default */].on('language-changed', refreshLanguage);
__WEBPACK_IMPORTED_MODULE_3__common_signals__["a" /* default */].on('version-changed', refreshVersion);

// the main div to expose
const topbar = includeNameInput =>
  Object(__WEBPACK_IMPORTED_MODULE_1__components_create__["a" /* default */])('div', {
    classes: ['tsx-topbar'],
    content: includeNameInput
      ? [nameInput, languageSelect, versionSelect]
      : [languageSelect, versionSelect],
  });

// expose a div with all the HTML elements
/* harmony default export */ __webpack_exports__["a"] = (topbar);


/***/ }),
/* 21 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = ((message) => {
  console.log(message);
});


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(23);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(2)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/sass-loader/lib/loader.js!./topbar.scss", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/sass-loader/lib/loader.js!./topbar.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(undefined);
// imports


// module
exports.push([module.i, "/**\n * constants for CSS styles\n */\n.tsx-topbar {\n  display: flex;\n  background: #fff;\n  padding: 4px;\n  margin-bottom: 4px; }\n  .tsx-topbar input {\n    flex: 1;\n    text-align: center; }\n  .tsx-topbar input:not(:last-child), .tsx-topbar select:not(:last-child), .tsx-topbar button:not(:last-child) {\n    margin-right: 4px; }\n", ""]);

// exports


/***/ }),
/* 24 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_create__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_signals__ = __webpack_require__(4);
/**
 * the file handling component
 */



const openFile = (e) => {
  const file = e.currentTarget.files[0];
  const fr = new FileReader();
  fr.onload = () => {
    __WEBPACK_IMPORTED_MODULE_1__common_signals__["a" /* default */].send('set-file', { filename: file.name, content: fr.result });
  };
  fr.readAsText(file);
};

const fileInput = Object(__WEBPACK_IMPORTED_MODULE_0__components_create__["a" /* default */])('input', {
  type: 'file',
  on: [{ type: 'change', callback: openFile }],
});

const openBox = Object(__WEBPACK_IMPORTED_MODULE_0__components_create__["a" /* default */])('div', {
  classes: ['tjs-file-box'],
  content: [fileInput],
});

// expose the HTML element for this component
/* harmony default export */ __webpack_exports__["a"] = (Object(__WEBPACK_IMPORTED_MODULE_0__components_create__["a" /* default */])('div', { content: [openBox] }));


/***/ }),
/* 25 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_create__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_session__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__common_signals__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__common_highlight__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__styles_code_scss__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__styles_code_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4__styles_code_scss__);
/**
 * the code editor component
 */






// define the main HTML elements for this component
const textarea = Object(__WEBPACK_IMPORTED_MODULE_0__components_create__["a" /* default */])('textarea', {
  wrap: 'off',
  spellcheck: 'false',
  autocapitalize: 'off',
  autocomplete: 'off',
  autocorrect: 'off',
});
const ol = Object(__WEBPACK_IMPORTED_MODULE_0__components_create__["a" /* default */])('ol');
const pre = Object(__WEBPACK_IMPORTED_MODULE_0__components_create__["a" /* default */])('pre');

// catch tab on the textarea, and insert spaces instead of losing focus
textarea.addEventListener('keydown', (e) => {
  if (e.keyCode === 9) {
    const pos = e.currentTarget.selectionStart;
    const left = e.currentTarget.value.slice(0, pos);
    const right = e.currentTarget.value.slice(pos);
    e.preventDefault();
    e.currentTarget.value = [left, right].join('  ');
    __WEBPACK_IMPORTED_MODULE_2__common_signals__["a" /* default */].send('set-code', e.currentTarget.value);
    e.currentTarget.selectionStart = pos + 2;
    e.currentTarget.selectionEnd = pos + 2;
  }
});

// send 'set-code' signal on native textarea input event
textarea.addEventListener('input', (e) => {
  __WEBPACK_IMPORTED_MODULE_2__common_signals__["a" /* default */].send('set-code', e.currentTarget.value);
});

// keep the textarea scroll in sync with the ol and pre elements
textarea.addEventListener('scroll', () => {
  ol.scrollTop = textarea.scrollTop;
  pre.scrollTop = textarea.scrollTop;
  if (pre.scrollTop !== textarea.scrollTop) {
    // on some browsers, textareas scroll a little bit past their actual height
    // this pulls them back in line with the pre element
    textarea.scrollTop = pre.scrollTop;
  }
  pre.scrollLeft = textarea.scrollLeft;
});

// function to synchronise the component with the appliation state
const refresh = (code, language = __WEBPACK_IMPORTED_MODULE_1__common_session__["a" /* default */].language.get()) => {
  const lines = code.split('\n').length;
  textarea.value = code;
  while (lines > ol.children.length) {
    ol.appendChild(Object(__WEBPACK_IMPORTED_MODULE_0__components_create__["a" /* default */])('li'));
  }
  while (lines < ol.children.length) {
    ol.removeChild(ol.lastChild);
  }
  pre.innerHTML = Object(__WEBPACK_IMPORTED_MODULE_3__common_highlight__["a" /* default */])(code, language);
};

// synchronise with the current state, and subscribe to 'code-changed' reply to keep it in sync
refresh(__WEBPACK_IMPORTED_MODULE_1__common_session__["a" /* default */].code.get(), __WEBPACK_IMPORTED_MODULE_1__common_session__["a" /* default */].language.get());
__WEBPACK_IMPORTED_MODULE_2__common_signals__["a" /* default */].on('code-changed', refresh);

// expose the HTML element for this component
/* harmony default export */ __webpack_exports__["a"] = (Object(__WEBPACK_IMPORTED_MODULE_0__components_create__["a" /* default */])('div', { classes: ['tjs-code'], content: [textarea, ol, pre] }));


/***/ }),
/* 26 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__styles_highlighting_scss__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__styles_highlighting_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__styles_highlighting_scss__);
/**
 * syntax highlighting for the different languages
 */


const expressions = {
  BASIC: {
    keywords: /(\b(DEF|DIM|ELSE|END|ENDIF|ENDPROC|ENDWHILE|FOR|IF|LOCAL|NEXT|PRIVATE|REPEAT|RETURN|STEP|THEN|TO|UNTIL|WHILE)\b)/g,
    commands: /(\b(ABS\b|ACS\b|ANGLES\b|ANTILOG\b|ASC\b|ASN\b|ATN\b|BACK\b|BLANK\b|BLOT\b|BOOLINT\b|BOX\b|CANVAS\b|CHR\$|CIRCLE\b|COLOU?R\b|CONSOLE\b|COS\b|CURSOR\b|DEC\b|DEL\$|DETECT\b|DIRECTION\b|DIVMULT\b|DRAWXY\b|DUMP\b|ELLBLOT\b|ELLIPSE\b|EXP\b|FILL\b|FORGET\b|FORWARD\b|GET\$|GETLINE\$|HEAPRESET|HEX\$|HOME\b|HYPOT\b|INC\b|INPUT\$|KEYBUFFER\b|KEYECHO\b|KEYSTATUS\b|LCASE\$|LEFT\$|LEFT\b|LEN\b|LN\b|LOG10\b|MAX\b|MAXINT\b|MID\$|MIN\b|MIXCOLS\b|MOVEXY\b|NEWTURTLE\b|NOUPDATE\b|OLDTURTLE\b|OUTPUT\b|PAUSE\b|PENDOWN\b|PENUP\b|PI\b|PIXCOL\b|PIXSET\b|POLYGON\b|POLYLINE\b|POWER\b|PRINT\b|QSTR\$|QVAL\b|RECOLOUR\b|REMEMBER\b|RESET\b|RESOLUTION\b|RGB\b|RIGHT\$|RIGHT\b|RND\b|RNDCOL\b|ROOT\b|SETX\b|SETXY\b|SETY\b|SIGN\b|SIN\b|SQR\b|STR\$|TAN\b|THICKNESS\b|TIME\b|TIMESET\b|TRACE\b|TURNXY\b|UPDATE\b|UCASE\$|VAL\b|VALDEF\b|WATCH\b|WRITE\b|WRITELN\b))/g,
    constants: /(\b(TRUE|FALSE|GREEN|DARKGREEN|LIGHTGREEN|SEAGREEN|GREENGREY|GREENGRAY|RED|DARKRED|LIGHTRED|MAROON|REDGREY|REDGRAY|BLUE|DARKBLUE|LIGHTBLUE|ROYAL|BLUEGREY|YELLOW|OCHRE|CREAM|GOLD|YELLOWGREY|YELLOWGRAY|VIOLET|INDIGO|LILAC|PURPLE|DARKGREY|DARKGRAY|LIME|OLIVE|YELLOWGREEN|EMERALD|MIDGREY|MIDGRAY|ORANGE|ORANGERED|PEACH|SALMON|LIGHTGREY|LIGHTGRAY|SKYBLUE|TEAL|CYAN|TURQUOISE|SILVER|BROWN|DARKBROWN|LIGHTBROWN|COFFEE|WHITE|PINK|MAGENTA|LIGHTPINK|ROSE|BLACK)\b)/g,
    operators: /(\+|-|\*|\/|\bDIV\b|\bMOD\b|=|<>|<|<=|>|>=|\bNOT\b|\bAND\b|\bOR\b|\bEOR\b)/g,
    integers: /(\b\d+\b|#[A-Fa-f0-9]+\b)/g,
    strings: /("(?:[^"]+|\\")*")/g,
    comments: /(REM.*\n)/g,
  },
  Pascal: {
    keywords: /(\b(array|begin|boolean|char|const|do|downto|else|end|for|function|if|integer|of|procedure|program|repeat|result|string|then|to|until|var|while)\b)/ig,
    commands: /(\b(abs|angles|antilog|arccos|arcsin|arctan|back|blank|blot|boolint|box|canvas|chr|circle|colou?r|console|copy|cos|cursor|dec|delete|detect|direction|divmult|drawxy|dump|ellblot|ellipse|exp|fill|forget|forward|heapreset|hexstr|home|hypot|inc|insert|keybuffer|keyecho|keystatus|left|length|ln|log10|lowercase|max|maxint|min|mixcols|movexy|newturtle|noupdate|oldturtle|ord|output|pause|pendown|penup|pi|pixcol|pixset|polygon|polyline|pos|power|print|qstr|qval|randcol|random|read|readln|recolour|remember|reset|resolution|rgb|right|root|setx|setxy|sety|sign|sin|sqrt|str|tan|thickness|time|timeset|trace|turnxy|update|uppercase|val|valdef|watch|write|writeln)\b)/ig,
    constants: /(\b(true|false|green|darkgreen|lightgreen|seagreen|greengrey|greengray|red|darkred|lightred|maroon|redgrey|redgray|blue|darkblue|lightblue|royal|bluegrey|yellow|ochre|cream|gold|yellowgrey|yellowgray|violet|indigo|lilac|purple|darkgrey|darkgray|lime|olive|yellowgreen|emerald|midgrey|midgray|orange|orangered|peach|salmon|lightgrey|lightgray|skyblue|teal|cyan|turquoise|silver|brown|darkbrown|lightbrown|coffee|white|pink|magenta|lightpink|rose|black)\b)/ig,
    operators: /(\+|-|\*|\/|\bdiv\b|\bmod\b|:=|=|<>|<|<=|>|>=|\bnot\b|\band\b|\bor\b|\bxor\b)/ig,
    integers: /(\b\d+\b|#[A-Fa-f0-9]+\b)/g,
    strings: /('(?:[^']+|'')*')/g,
    comments: /({.*})/g,
  },
  Python: {
    keywords: /\b(def|else|for|global|if|in|nonlocal|pass|range|return|while)\b/g,
    commands: /(\b(abs|acos|angles|antilog|asin|atan|back|blank|blot|boolint|box|canvas|chr|circle|colou?r|console|copy|cos|cursor|dec|detect|direction|divmult|drawxy|dump|ellblot|ellipse|exp|fill|find|forget|forward|heapreset|hex|home|hypot|inc|input|insert|int|intdef|keybuffer|keyecho|keystatus|left|len|ln|log10|lower|max|maxint|min|mixcols|movexy|newturtle|noupdate|oldturtle|ord|output|pause|pendown|penup|pi|pixcol|pixset|polygon|polyline|power|print|qstr|qval|randcol|randint|read|readline|recolour|remember|reset|resolution|rgb|right|root|setx|setxy|sety|sign|sin|sqrt|str|tan|thickness|time|timeset|trace|turnxy|update|upper|watch|write|writeline)\b)/g,
    constants: /(\b(true|false|green|darkgreen|lightgreen|seagreen|greengrey|greengray|red|darkred|lightred|maroon|redgrey|redgray|blue|darkblue|lightblue|royal|bluegrey|yellow|ochre|cream|gold|yellowgrey|yellowgray|violet|indigo|lilac|purple|darkgrey|darkgray|lime|olive|yellowgreen|emerald|midgrey|midgray|orange|orangered|peach|salmon|lightgrey|lightgray|skyblue|teal|cyan|turquoise|silver|brown|darkbrown|lightbrown|coffee|white|pink|magenta|lightpink|rose|black)\b)/g,
    operators: /(\+|-|\*|\/|\/\/|\b%\b|=|!=|<|<=|>|>=|\bnot\b|\band\b|\bor\b|\bxor\b)/g,
    integers: /(\b\d+\b|#[A-Fa-f0-9]+\b)/g,
    strings: /('(?:[^']+|\\')*')/g,
    comments: /(#.*\n)/g,
  },
};

/* harmony default export */ __webpack_exports__["a"] = ((code, language) => {
  const {
    keywords,
    commands,
    constants,
    operators,
    integers,
    strings,
    comments,
  } = expressions[language];
  return code.replace(strings, '<span class="tjs-highstring">$1</span>')
    .replace(operators, '<span class="tjs-highoperator">$1</span>')
    .replace(integers, '<span class="tjs-highinteger">$1</span>')
    .replace(comments, '<span class="tjs-highcomment">$1</span>')
    .replace(keywords, '<span class="tjs-highkeyword">$1</span>')
    .replace(commands, '<span class="tjs-highcommand">$1</span>')
    .replace(constants, '<span class="tjs-highconstant">$1</span>');
});


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(28);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(2)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/sass-loader/lib/loader.js!./highlighting.scss", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/sass-loader/lib/loader.js!./highlighting.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(undefined);
// imports


// module
exports.push([module.i, "pre > .tjs-highkeyword {\n  color: firebrick;\n  font-weight: bold; }\n\npre > .tjs-highcommand {\n  color: purple; }\n\npre > .tjs-highconstant {\n  color: steelblue; }\n\npre > .tjs-highoperator {\n  color: steelblue; }\n\npre > .tjs-highinteger {\n  color: peru; }\n\npre > .tjs-highstring {\n  color: seagreen; }\n\npre > .tjs-highcomment {\n  color: gray; }\n", ""]);

// exports


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(30);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(2)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/sass-loader/lib/loader.js!./code.scss", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/sass-loader/lib/loader.js!./code.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(undefined);
// imports


// module
exports.push([module.i, "/**\n * constants for CSS styles\n */\n.tjs-code {\n  background: #fff;\n  border: 1px solid silver;\n  position: relative;\n  overflow: auto;\n  height: 100%;\n  font-family: consolas, monospace;\n  line-height: 1.5; }\n  .tjs-code textarea, .tjs-code ol, .tjs-code pre {\n    position: absolute;\n    top: 0;\n    left: 0;\n    width: 100%;\n    height: 100%;\n    padding: 0 .5em 0 3em;\n    margin: 0;\n    overflow: auto;\n    font: inherit; }\n  .tjs-code textarea {\n    background: transparent;\n    border: 0;\n    outline: 0;\n    resize: none;\n    opacity: .4;\n    z-index: 1; }\n  .tjs-code ol, .tjs-code pre {\n    z-index: 2;\n    pointer-events: none; }\n  .tjs-code ol {\n    list-style: none;\n    counter-reset: li; }\n    .tjs-code ol li:before {\n      display: block;\n      color: lightgray;\n      content: counter(li);\n      counter-increment: li;\n      width: 3em;\n      margin-left: -3em;\n      padding-right: .5em;\n      text-align: right; }\n", ""]);

// exports


/***/ }),
/* 31 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_create__ = __webpack_require__(0);
/**
 * the usage display component
 */


// expose the HTML element for this component
/* harmony default export */ __webpack_exports__["a"] = (Object(__WEBPACK_IMPORTED_MODULE_0__components_create__["a" /* default */])('div', { content: 'usage display' }));


/***/ }),
/* 32 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_create__ = __webpack_require__(0);
/**
 * the pcode display component
 */


// expose the HTML element for this component
/* harmony default export */ __webpack_exports__["a"] = (Object(__WEBPACK_IMPORTED_MODULE_0__components_create__["a" /* default */])('div', { content: 'pcode display' }));


/***/ }),
/* 33 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_create__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__styles_icons_scss__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__styles_icons_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__styles_icons_scss__);
/**
 * the machine status bar (shown above the machine tabs)
 */



const run = Object(__WEBPACK_IMPORTED_MODULE_0__components_create__["a" /* default */])('button', { content: 'RUN' });

const pause = Object(__WEBPACK_IMPORTED_MODULE_0__components_create__["a" /* default */])('button', { classes: ['tsx-icon', 'tsx-pause'] });

// export the HTML element for this component
/* harmony default export */ __webpack_exports__["a"] = (Object(__WEBPACK_IMPORTED_MODULE_0__components_create__["a" /* default */])('div', { classes: ['tsx-topbar'], content: [run, pause] }));


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(35);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(2)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/sass-loader/lib/loader.js!./icons.scss", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/sass-loader/lib/loader.js!./icons.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(undefined);
// imports


// module
exports.push([module.i, "@charset \"UTF-8\";\n/**\n * constants for CSS styles\n */\n.tjs-icon:before {\n  font-family: FontAwesome; }\n\n.tjs-play:before {\n  content: \"\\F04B\"; }\n\n.tjs-pause:before {\n  content: \"\\F04C\"; }\n\n.tjs-direction:before {\n  content: \"\\F021\"; }\n\n.tjs-thickness:before {\n  content: \"\\F040\"; }\n\n.tjs-colour:before {\n  content: \"\\F1FB\"; }\n", ""]);

// exports


/***/ }),
/* 36 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_create__ = __webpack_require__(0);


const settings = Object(__WEBPACK_IMPORTED_MODULE_0__components_create__["a" /* default */])('div', { content: 'settings page' });

/* harmony default export */ __webpack_exports__["a"] = (settings);


/***/ }),
/* 37 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_create__ = __webpack_require__(0);


/* harmony default export */ __webpack_exports__["a"] = (Object(__WEBPACK_IMPORTED_MODULE_0__components_create__["a" /* default */])('canvas', { id: 'tsx-canvas' }));


/***/ }),
/* 38 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_create__ = __webpack_require__(0);


/* harmony default export */ __webpack_exports__["a"] = (Object(__WEBPACK_IMPORTED_MODULE_0__components_create__["a" /* default */])('pre', { id: 'tsx-console' }));


/***/ }),
/* 39 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_create__ = __webpack_require__(0);


/* harmony default export */ __webpack_exports__["a"] = (Object(__WEBPACK_IMPORTED_MODULE_0__components_create__["a" /* default */])('pre', { id: 'tsx-output', content: 'output' }));


/***/ }),
/* 40 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_create__ = __webpack_require__(0);


/* harmony default export */ __webpack_exports__["a"] = (Object(__WEBPACK_IMPORTED_MODULE_0__components_create__["a" /* default */])('div', { id: 'tsx-memory', content: 'memory' }));


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(42);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(2)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/sass-loader/lib/loader.js!./tsx.scss", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/sass-loader/lib/loader.js!./tsx.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(undefined);
// imports


// module
exports.push([module.i, "/**\n * constants for CSS styles\n */\n.tsx {\n  box-sizing: border-box;\n  display: flex;\n  background: #282828;\n  font-family: helvetica, arial, sans-serif;\n  font-size: 16px;\n  line-height: 1; }\n  .tsx *, .tsx *::before, .tsx *::after {\n    box-sizing: border-box; }\n  .tsx input, .tsx select, .tsx button {\n    font: inherit;\n    height: 2em;\n    padding: 4px; }\n  .tsx input, .tsx select {\n    border: 1px solid silver; }\n  .tsx button {\n    background: #159d6b;\n    border: 0;\n    padding: 4px 8px;\n    cursor: pointer;\n    color: #fff;\n    text-align: center;\n    transition: background .3s; }\n    .tsx button:hover {\n      background: #0f704c; }\n", ""]);

// exports


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(44);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(2)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/sass-loader/lib/loader.js!./electron.scss", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/sass-loader/lib/loader.js!./electron.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(undefined);
// imports


// module
exports.push([module.i, "html, body {\n  margin: 0;\n  height: 100%; }\n\n.tjs {\n  height: 100%; }\n", ""]);

// exports


/***/ })
/******/ ]);