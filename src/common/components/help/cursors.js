/*
Cursors help text.
*/
import cursors from 'common/constants/cursors'

// the div for help text about cursors
const element = document.createElement('div')
export default element

// create the TD elements for a cursor
const tds = cursor =>
  `<td>${cursor.index}</td><td style="cursor:${cursor.css}">${cursor.name}</td>`

// initialise the element
element.innerHTML = `
  <h3>Cursors</h3>
  <p>The native <code>cursor</code> command sets which cursor to display when the mouse is over the canvas. Setting it to 0 makes the mouse invisible. Values in the range 1-15 set it to the cursor shown in the table below (move your mouse over each box to preview the cursor). Any other value will reset to the default cursor. Note that the actual cursor displayed depends on your operating system, and may vary from computer to computer.</p>
  <table class="tse-help-table">
    <thead>
      <tr>
        <th>No.</th>
        <th>Name</th>
        <th>No.</th>
        <th>Name</th>
        <th>No.</th>
        <th>Name</th>
        <th>No.</th>
        <th>Name</th>
      </tr>
    </thead>
    <tbody>
      <tr>${cursors.slice(0, 4).map(tds).join('')}</tr>
      <tr>${cursors.slice(4, 8).map(tds).join('')}</tr>
      <tr>${cursors.slice(8, 12).map(tds).join('')}</tr>
      <tr>${cursors.slice(12, 16).map(tds).join('')}</tr>
    </tbody>
  </table>`
