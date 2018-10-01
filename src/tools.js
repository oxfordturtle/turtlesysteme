/*
a handful of system-wide tools
*/

// create a pre-filled HTML element, with specified content and attributes
export const element = (type, options = {}) => {
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
export const hex = colour =>
  `#${padded(colour.toString(16))}`

// padd a string with leading zeros
export const padded = string =>
  ((string.length < 6) ? padded(`0${string}`) : string)

// create tabs (tab list on top, tab panes below)
export const tabs = (customClass, optionsArray) =>
  element('div', {
    classes: [ 'tsx-tabs', customClass ],
    content: [ list(optionsArray), panes(optionsArray) ]
  })

// activate a particular tab
export const show = (id) => {
  activate(document.querySelector(`[data-target="${id}"]`))
  activate(document.getElementById(id))
}

// perform an ajax request
export const fetch = ({ url, success, error }) => {
  const xhr = new window.XMLHttpRequest()
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        success(xhr.responseText)
      } else {
        error(xhr.status)
      }
    }
  }
  xhr.open('GET', url)
  xhr.send()
}

// activate a node (and deactivate its siblings)
const activate = (node) => {
  if (node) {
    const siblings = Array.from(node.parentElement.children)
    siblings.forEach(x => x.classList.remove('active'))
    node.classList.add('active')
  }
}

// a tab
const tab = options =>
  element('a', {
    classes: options.active ? [ 'tsx-tab', 'active' ] : [ 'tsx-tab' ],
    content: options.label,
    'data-target': options.label.replace(/ /g, ''),
    on: [{
      type: 'click',
      callback: (e) => {
        activate(e.currentTarget)
        activate(document.getElementById(e.currentTarget.getAttribute('data-target')))
      }
    }]
  })

// a list of tabs
const list = optionsArray =>
  element('nav', { classes: [ 'tsx-tab-list' ], content: optionsArray.map(tab) })

// a tab pane
const pane = options =>
  element('div', {
    classes: options.active ? [ 'tsx-tab-pane', 'active' ] : [ 'tsx-tab-pane' ],
    content: options.content,
    id: options.label.replace(/ /g, '')
  })

// a set of tab panes
const panes = optionsArray =>
  element('div', { classes: [ 'tsx-tab-panes' ], content: optionsArray.map(pane) })
