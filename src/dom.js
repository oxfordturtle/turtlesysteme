/*
a handful of utilities for manipulating the DOM, together with the basic HTML elements of the
application (these are inserted into the page an initialised by the entry module; the components
module has functions for initialising them)
*/

// a pre-filled HTML element, with specified content and attributes
module.exports.element = (type, options = {}) => {
  // create the element
  const el = document.createElement(type)
  // iterate over the options adding content/attributes
  Object.keys(options).forEach((key) => {
    switch (key) {
      case 'classes':
        options.classes.forEach(x => el.classList.add(x))
        break
      case 'content':
        if (typeof options.content === 'string') {
          el.innerHTML = options.content
        } else {
          options.content.forEach(child => {
            if (typeof child === 'string') {
              el.appendChild(document.createTextNode(child))
            } else {
              el.appendChild(child)
            }
          })
        }
        break
      case 'value':
        el.value = options.value
        break
      case 'on':
        options.on.forEach(e => {
          el.addEventListener(e.type, e.callback)
        })
        break
      default:
        el.setAttribute(key, options[key])
        break
    }
  })
  return el
}

// convert a number to css colour #000000 format
module.exports.hex = colour =>
  `#${module.exports.padded(colour.toString(16))}`

// padded string with leading zeros (needed by the hex function)
module.exports.padded = string =>
  ((string.length < 6) ? module.exports.padded(`0${string}`) : string)

// create tabs (tab list on top, tab panes below)
module.exports.tabs = (customClass, optionsArray) =>
  module.exports.element('div', {
    classes: [ 'tsx-tabs', customClass ],
    content: [ list(optionsArray), panes(optionsArray) ]
  })

// activate a particular tab (exposed for remote tabbing control)
module.exports.show = (id) => {
  activate(document.querySelector(`[data-target="${id}"]`))
  activate(document.getElementById(id))
}

// function to activate a node (and deactivate its siblings)
const activate = (node) => {
  if (node) {
    const siblings = Array.prototype.slice.call(node.parentElement.children)
    siblings.forEach(x => x.classList.remove('active'))
    node.classList.add('active')
  }
}

// function to change tab
const changeTab = (e) => {
  activate(e.currentTarget)
  activate(document.getElementById(e.currentTarget.getAttribute('data-target')))
}

// a tab
const tab = options =>
  module.exports.element('a', {
    classes: options.active ? [ 'tsx-tab', 'active' ] : [ 'tsx-tab' ],
    content: options.label,
    'data-target': options.label.replace(/ /g, ''),
    on: [ { type: 'click', callback: changeTab } ]
  })

// a list of tabs
const list = optionsArray =>
  module.exports.element('nav', { classes: [ 'tsx-tab-list' ], content: optionsArray.map(tab) })

// a tab pane
const pane = options =>
  module.exports.element('div', {
    classes: options.active ? [ 'tsx-tab-pane', 'active' ] : [ 'tsx-tab-pane' ],
    content: options.content,
    id: options.label.replace(/ /g, '')
  })

// a set of tab panes
const panes = optionsArray =>
  module.exports.element('div', { classes: [ 'tsx-tab-panes' ], content: optionsArray.map(pane) })
