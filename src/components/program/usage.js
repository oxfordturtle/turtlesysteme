/*
The usage display component.
*/

// create the HTML elements first
const { element } = require('dom')
const thead = element('thead', { content: [
  element('tr', { content: [
    element('th', { content: 'Expression' }),
    element('th', { content: 'Level' }),
    element('th', { content: 'Count' }),
    element('th', { content: 'Program Lines' })
  ] })
] })
const tbody = element('tbody')
const usage = element('table', { classes: ['tsx-usage-table'], content: [thead, tbody] })

// export the HTML element
module.exports = usage

// dependencies
const state = require('state')

// function for updating the table body
const refresh = (usage) => {
  tbody.innerHTML = ''
  usage.forEach((category) => {
    tbody.appendChild(element('tr', {
      classes: [ 'category-heading' ],
      content: [ element('th', { colspan: '4', content: category.title }) ]
    }))
    category.expressions.forEach((expression) => {
      tbody.appendChild(element('tr', { content: [
        element('td', { content: expression.name }),
        element('td', { content: expression.level.toString() }),
        element('td', { content: expression.count.toString() }),
        element('td', { content: expression.lines.replace(/ /g, ', ') })
      ] }))
    })
    tbody.appendChild(element('tr', {
      content: [
        element('td'),
        element('th', { content: 'TOTAL:' }),
        element('th', { content: category.total.toString() }),
        element('td')
      ]
    }))
  })
}

// subscribe to keep the tbody in sync with the application state
state.on('usage-changed', refresh)
