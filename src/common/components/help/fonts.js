/*
Fonts help text.
*/
import fonts from 'common/constants/fonts'

// the div for help text about fonts
const element = document.createElement('div')
export default element

// create the TR element for a font
const tr = font => `
  <tr>
    <td style="font-family:${font.css}">${font.name}</td>
    <td>${font.index.toString(10)}</td>
    <td>${(font.index + 16).toString(10)}</td>
    <td>${(font.index + 32).toString(10)}</td>
    <td>${(font.index + 48).toString(10)}</td>
  </tr>`

// initialise the element
element.innerHTML = `
  <h3>Fonts</h3>
  <p>The Turtle System has 16 fonts for drawing text on the canvas, shown in the table below. The <code>print</code> command takes a font parameter, which must be an integer between 0 and 255. The integers in the range 0-15 correspond to plain versions of the 16 fonts. To render the text in italics, add 16 to this base; to render it in bold, add 32. This additions are cumulative; thus to render the text in italic and bold, add 16+32.</p>
  <div class="tse-help-table">
    <table>
      <thead>
        <tr>
          <th>Font Family Name</th>
          <th>Plain</th>
          <th>Italic</th>
          <th>Bold</th>
          <th>Italic+Bold</th>
        </tr>
      </thead>
      <tbody>
        ${fonts.map(tr).join('')}
      </tbody>
    </table>
  </div>`
