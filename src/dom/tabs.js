/**
 * create tabs with associated tab panes
 */

// local imports
const create = require('./create');

// function to activate a node (and deactivate its siblings)
const activate = (node) => {
  const siblings = Array.prototype.slice.call(node.parentElement.children);
  siblings.forEach(x => x.classList.remove('active'));
  node.classList.add('active');
};

// function to change tab
const changeTab = (e) => {
  activate(e.currentTarget);
  activate(document.getElementById(e.currentTarget.getAttribute('data-target')));
};

// function to create a tab
const tab = options =>
  create('a', {
    classes: options.active ? [ 'tsx-tab', 'active' ] : [ 'tsx-tab' ],
    content: options.label,
    'data-target': options.label.replace(/ /g, ''),
    on: [ { type: 'click', callback: changeTab } ],
  });

// function to create a list of tabs
const list = optionsArray =>
  create('nav', { classes: [ 'tsx-tab-list' ], content: optionsArray.map(tab) });

// function to create a tab pane
const pane = options =>
  create('div', {
    classes: options.active ? [ 'tsx-tab-pane', 'active' ] : [ 'tsx-tab-pane' ],
    content: options.content,
    id: options.label.replace(/ /g, ''),
  });

// function to create a set of tab panes
const panes = optionsArray =>
  create('div', { classes: [ 'tsx-tab-panes' ], content: optionsArray.map(pane) });

// function to create the tabs div (tab list on top, tab panes below)
const tabs = (customClass, optionsArray) =>
  create('div', {
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
  create: tabs,
  show,
};
