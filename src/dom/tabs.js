/**
 * create tabs with associated tab panes
 */
const element = require('./element');

// function to activate a node (and deactivate its siblings)
const activate = (node) => {
  if (node) {
    const siblings = Array.prototype.slice.call(node.parentElement.children);
    siblings.forEach(x => x.classList.remove('active'));
    node.classList.add('active');
  }
};

// function to change tab
const changeTab = (e) => {
  activate(e.currentTarget);
  activate(document.getElementById(e.currentTarget.getAttribute('data-target')));
};

// a tab
const tab = options =>
  element('a', {
    classes: options.active ? [ 'tsx-tab', 'active' ] : [ 'tsx-tab' ],
    content: options.label,
    'data-target': options.label.replace(/ /g, ''),
    on: [ { type: 'click', callback: changeTab } ],
  });

// a list of tabs
const list = optionsArray =>
  element('nav', { classes: [ 'tsx-tab-list' ], content: optionsArray.map(tab) });

// a tab pane
const pane = options =>
  element('div', {
    classes: options.active ? [ 'tsx-tab-pane', 'active' ] : [ 'tsx-tab-pane' ],
    content: options.content,
    id: options.label.replace(/ /g, ''),
  });

// a set of tab panes
const panes = optionsArray =>
  element('div', { classes: [ 'tsx-tab-panes' ], content: optionsArray.map(pane) });

// all the tab elements (tab list on top, tab panes below)
const tabs = (customClass, optionsArray) =>
  element('div', {
    classes: [ 'tsx-tabs', customClass ],
    content: [ list(optionsArray), panes(optionsArray) ],
  });

// function to activate a particular tab (exposed for remote tabbing control)
const show = (id) => {
  activate(document.querySelector(`[data-target="${id}"]`));
  activate(document.getElementById(id));
};

// exports
module.exports = {
  tabs,
  show,
};
