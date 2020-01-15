/*
functions for interacting with the dom
*/

// create an element
export const createElement = (type, className = null, content = null) => {
  const element = document.createElement(type)
  if (className) element.classList.add(className)
  if (content) setContent(element, content)
  return element
}

// create an input element
export const createInput = (type, name) => {
  const input = document.createElement('input')
  input.type = type
  input.name = name
  return input
}

// create a text input element
export const createTextInput = (className, placeholder) => {
  const input = document.createElement('input')
  input.type = 'text'
  input.classList.add(className)
  input.placeholder = placeholder
  return input
}

// create an optgroup element
export const createOptgroup = (label, content) => {
  const optgroup = document.createElement('optgroup')
  optgroup.setAttribute('label', label)
  setContent(optgroup, content)
  return optgroup
}

// create a select option
export const createOption = (label, value) => {
  const option = document.createElement('option')
  option.innerHTML = label
  option.setAttribute('value', value)
  return option
}

// create a select input
export const createSelect = (options, multiple) => {
  const select = document.createElement('select')
  if (multiple) {
    select.setAttribute('multiple', 'multiple')
  }
  setContent(select, options)
  return select
}

// create a text node
export const createTextNode = (text) =>
  document.createTextNode(text)

// create an img element
export const createImage = (src) => {
  const img = document.createElement('img')
  img.src = src
  return img
}

// create a document fragment
export const createFragment = (content = null) => {
  const fragment = document.createDocumentFragment()
  if (content) setContent(fragment, content)
  return fragment
}

// set the content of an element
export const setContent = (element, content) => {
  if (typeof content === 'object') {
    const fragment = document.createDocumentFragment()
    content.forEach((node) => { fragment.appendChild(node) })
    element.innerHTML = ''
    element.appendChild(fragment)
  } else {
    element.innerHTML = content
  }
}

// create tabs (tab panes on top, tab list below)
export const createTabs = optionsArray =>
  createElement('div', 'tse-tabs', [
    createElement('div', 'tse-tab-panes', optionsArray.map(tabPane)),
    createElement('nav', 'tse-tab-list', optionsArray.map(tab))
  ])

// create top tabs (tab list on top, tab panes below)
export const createTopTabs = optionsArray =>
  createElement('div', 'tse-tabs', [
    createElement('nav', 'tse-tab-list', optionsArray.map(tab)),
    createElement('div', 'tse-tab-panes', optionsArray.map(tabPane))
  ])

// activate a particular tab
export const showTab = (id) => {
  activate(document.querySelector(`[data-target="${id}"]`))
  activate(document.getElementById(id))
}

// a tab
const tab = (options) => {
  const a = createElement('a', 'tse-tab', options.label)
  if (options.active) a.classList.add('tse-active')
  a.dataset.target = options.label.replace(/\s/g, '')
  a.addEventListener('click', (e) => {
    activate(e.currentTarget)
    activate(document.getElementById(e.currentTarget.getAttribute('data-target')))
  })
  return a
}

// a tab pane
const tabPane = (options) => {
  const div = createElement('div', 'tse-tab-pane', options.content)
  if (options.active) div.classList.add('tse-active')
  div.id = options.label.replace(/\s/g, '')
  return div
}

// activate a node (and deactivate its siblings)
const activate = (node) => {
  if (node) {
    const siblings = Array.from(node.parentElement.children)
    siblings.forEach(x => x.classList.remove('tse-active'))
    node.classList.add('tse-active')
  }
}
