/*
Text for the system tab.
*/

// the element for system text
const system = document.createElement('div')
export default system

// initialise the element
system.innerHTML = `
  <h3>Turtle System X</h3>
  <p>This is a multi-platform version of the <i>Turtle System</i>. It is available for Windows, MacOS, and Linux, and can also be run directly in a web browser. It is written in JavaScript, and uses Node and Electron to create the downloadable desktop versions.</p>
  <p>The application is open source, and the source code can be viewed at <a href="https://github.com/oxfordturtle/turtlesystemx">https://github.com/oxfordturtle/turtlesystemx</a>.</p>
  <p>This version is developed in tandem with the original version of the <i>Turtle System</i>, which is written in Delphi Pascal, and is available for download as a Windows desktop application. The original Delphi Pascal version is more powerful in some respects, and is faster at compiling and running very long or complicated programs. Windows users may therefore prefer to use that version.</p>`
