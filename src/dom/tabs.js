/**
 * create tabs with associated tab panes
 */
const create = require('./create');

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
  create('a', {
    classes: options.active ? ['tsx-tab', 'active'] : ['tsx-tab'],
    content: options.label,
    'data-target': options.label.replace(/ /g, ''),
    on: [{ type: 'click', callback: changeTab }],
  });

const list = optionsArray =>
  create('nav', { classes: ['tsx-tab-list'], content: optionsArray.map(tab) });

const pane = options =>
  create('div', {
    classes: options.active ? ['tsx-tab-pane', 'active'] : ['tsx-tab-pane'],
    content: options.content,
    id: options.label.replace(/ /g, ''),
  });

const panes = optionsArray =>
  create('div', { classes: ['tsx-tab-panes'], content: optionsArray.map(pane) });

const tabs = (customClass, optionsArray) =>
  create('div', {
    classes: ['tsx-tabs', customClass],
    content: [list(optionsArray), panes(optionsArray)],
  });

const show = (id) => {
  activate(document.querySelector(`[data-target="${id}"]`));
  activate(document.getElementById(id));
};

module.exports = {
  create: tabs,
  show,
};
