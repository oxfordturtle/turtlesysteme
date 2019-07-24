/*
a handful of system-wide tools
*/

// create tabs (tab list on top, tab panes below)
export const create = (optionsArray) => {
  const div = document.createElement('div')
  div.classList.add('tse-tabs')
  optionsArray.forEach((x) => { div.appendChild(pane(x)) })
  div.appendChild(list(optionsArray))
  return div
}

// activate a particular tab
export const show = (id) => {
  activate(document.querySelector(`[data-target="${id}"]`))
  activate(document.getElementById(id))
}

// a list of tabs
const list = (optionsArray) => {
  const nav = document.createElement('nav')
  nav.classList.add('tse-tab-list')
  optionsArray.forEach((x) => { nav.appendChild(tab(x)) })
  return nav
}

// a tab
const tab = (options) => {
  const a = document.createElement('a')
  a.classList.add('tse-tab')
  if (options.active) a.classList.add('active')
  a.innerHTML = options.label
  a.dataset.target = options.label.replace(/\s/g, '')
  a.addEventListener('click', (e) => {
    activate(e.currentTarget)
    activate(document.getElementById(e.currentTarget.getAttribute('data-target')))
  })
  return a
}

// a set of tab panes
const panes = (optionsArray) => {
  const div = document.createElement('div')
  div.classList.add('tse-tab-panes')
  optionsArray.forEach((x) => { div.appendChild(pane(x)) })
  return div
}

// a tab pane
const pane = (options) => {
  const div = document.createElement('div')
  div.classList.add('tse-tab-pane')
  if (options.active) div.classList.add('active')
  div.id = options.label.replace(/\s/g, '')
  options.content.forEach((x) => { div.appendChild(x) })
  return div
}

// activate a node (and deactivate its siblings)
const activate = (node) => {
  if (node) {
    const siblings = Array.from(node.parentElement.children)
    siblings.forEach(x => x.classList.remove('active'))
    node.classList.add('active')
  }
}
