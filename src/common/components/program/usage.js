/*
The program usage component.
*/
import { on } from 'common/system/state'

// the usage element
const usage = document.createElement('div')
export default usage

// initialise the element
usage.classList.add('tsx-usage')
usage.innerHTML = `
  <table class="tsx-usage-table">
    <thead>
      <tr>
        <th>Expression</th>
        <th>Level</th>
        <th>Count</th>
        <th>Program Lines</th>
      </tr>
    </thead>
    <tbody data-bind="usage"></tbody>
  </table>`

// grab sub-elements of interest
const usageBody = usage.querySelector('[data-bind="usage"]')

// register to keep in sync with the application state
on('usage-changed', (usage) => {
  usageBody.innerHTML = ''
  usage.forEach((category) => {
    usageBody.innerHTML += `
      <tr class="tsx-category-heading">
        <th colspan="4">${category.title}</th>
      </tr>`
    category.expressions.forEach((expression) => {
      usageBody.innerHTML += `
        <tr>
          <td>${expression.name}</td>
          <td>${expression.level.toString(10)}</td>
          <td>${expression.count.toString(10)}</td>
          <td>${expression.lines.replace(/\s/g, ', ')}</td>
        </tr>`
    })
    usageBody.innerHTML += `
      <tr>
        <td></td>
        <th>TOTAL:</th>
        <th>${category.total.toString(10)}</th>
        <td></td>
      </tr>`
  })
})
