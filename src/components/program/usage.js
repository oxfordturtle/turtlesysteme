/**
 * the usage display component
 */

// global imports
const { create } = require('dom');
const state = require('state');
require('styles/usage.scss');

// the table header
const thead = create('thead', { content: [
  create('tr', { content: [
    create('th', { content: 'Expression' }),
    create('th', { content: 'Level' }),
    create('th', { content: 'Count' }),
    create('th', { content: 'Program Lines' }),
  ] })
] });

// the table body (content updated to reflect current usage data)
const tbody = create('tbody');

// the usage table
const usage = create('table', { classes: [ 'tsx-usage-table' ], content: [ thead, tbody ] });

// function for updating the table body
const refresh = (usage) => {
  tbody.innerHTML = '';
  usage.forEach((category) => {
    tbody.appendChild(create('tr', {
      classes: [ 'category-heading' ],
      content: [ create('th', { colspan: '4', content: category.category }) ],
    }));
    category.expressions.forEach((expression) => {
      tbody.appendChild(create('tr', { content: [
        create('td', { content: expression.name }),
        create('td', { content: expression.level.toString() }),
        create('td', { content: expression.count.toString() }),
        create('td', { content: expression.lines.replace(/ /g, ', ') }),
      ] }));
    });
    tbody.appendChild(create('tr', {
      content: [
        create('td'),
        create('th', { content: 'TOTAL:' }),
        create('th', { content: category.total.toString() }),
        create('td'),
      ],
    }));
  });
};

// subscribe to keep the tbody in sync with the application state
refresh(state.getUsage());
state.on('usage-changed', refresh);

// exports
module.exports = usage;
