/*
Colours help text.
*/
import colours from 'common/constants/colours'
import { on } from 'common/system/state'

// the div for help text about colours
const element = document.createElement('div')
export default element

// initialise the element
element.innerHTML = `
  <h3>Colours</h3>
  <p>The Turtle System has 50 predefined colour constants, shown in the table below. Every command that takes a colour argument (e.g. the <code>colour</code> command, which sets the Turtle&lsquo;s current drawing colour) can be given an RGB value, or one of the predefined colour names below. The compiler will translate this name into the corresponding RGB value. Alternatively, you can also use the corresponding number between 1 and 50, which the Turtle Machine will translate into the RGB value when your program runs.</p>
  <table class="tse-help-table">
    <thead>
      <tr>
        <th>No.</th>
        <th>Name<br>Value</th>
        <th>No.</th>
        <th>Name<br>Value</th>
        <th>No.</th>
        <th>Name<br>Value</th>
        <th>No.</th>
        <th>Name<br>Value</th>
        <th>No.</th>
        <th>Name<br>Value</th>
      </tr>
    </thead>
    <tbody></tbody>
  </table>`

// subscribe to keep in sync with system state
on('language-changed', (language) => {
  const tbody = element.querySelector('tbody')
  tbody.innerHTML = ''
  for (let i = 0; i < 10; i += 1) {
    tbody.innerHTML += `<tr>${colours.slice(i * 5, i * 5 + 5).map(tds.bind(null, language)).join('')}</tr>`
  }
})

// create TD elements for a colour
const tds = (language, colour) => `
  <th>${colour.index}</th>
  <td style="background:#${colour.hex};color:${colour.text}">
    ${colour.names[language]}<br>${hex(language, colour.hex)}
  </td>`

// convert hex to language-relative string representation
const hex = (language, hex) => {
  if (language === 'BASIC') return `&${hex}`
  if (language === 'Pascal') return `$${hex}`
  return `0x${hex}`
}
