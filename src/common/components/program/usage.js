/*
The program usage component.
*/
import * as dom from 'common/components/dom'
import { on } from 'common/system/state'

// elements within the usage element
const usageTHead = dom.createElement('thead', null, [
  dom.createElement('tr', null, [
    dom.createElement('th', null, 'Expression'),
    dom.createElement('th', null, 'Level'),
    dom.createElement('th', null, 'Count'),
    dom.createElement('th', null, 'Program Lines')
  ])
])

const usageTBody = dom.createElement('tbody')

const usageTable = dom.createElement('table', 'tse-usage-table', [usageTHead, usageTBody])

const expressionRow = expression =>
  dom.createElement('tr', null, [
    dom.createElement('td', null, expression.name),
    dom.createElement('td', null, expression.level.toString(10)),
    dom.createElement('td', null, expression.count.toString(10)),
    dom.createElement('td', null, expression.lines.replace(/\s/g, ', '))
  ])

const categoryFragment = category =>
  dom.createFragment([
    dom.createElement('tr', 'tse-category-heading', `<th colspan="4">${category.title}</th>`),
    dom.createFragment(category.expressions.map(expressionRow)),
    dom.createElement('tr', null, [
      dom.createElement('td'),
      dom.createElement('td', null, 'TOTAL:'),
      dom.createElement('td', null, category.total.toString(10)),
      dom.createElement('td')
    ])
  ])

// register to keep in sync with the application state
on('usage-changed', (usage) => {
  dom.setContent(usageTBody, usage.map(categoryFragment))
})

// the usage element
export default dom.createElement('div', 'tse-usage', [usageTable])
