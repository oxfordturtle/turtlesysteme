/*
Text for the about tab.
*/

// create the HTML elements first
const { element } = require('dom')
const about = element('div', { content: [
  element('h3', { content: 'Turtle System X' }),
  element('p', { content: 'This is a multi-platform version of the <i>Turtle System</i>. It is available for Windows, MacOS, and Linux, and can also be run directly in a web browser. It is written in JavaScript, and uses Node and Electron to create the downloadable desktop versions.' }),
  element('p', { content: 'The application is open source, and the source code can be viewed at <a href="https://github.com/oxfordturtle/turtlesystemx">https://github.com/oxfordturtle/turtlesystemx</a>.' }),
  element('p', { content: 'This version is developed in tandem with the original version of the <i>Turtle System</i>, which is written in Delphi Pascal, and is available for download as a Windows desktop application. The original Delphi Pascal version is more powerful in some respects, and is faster at compiling and running very long or complicated programs. Windows users may therefore prefer to use that version.' })
] })

// export the HTML element
module.exports = about
