/*
Interactive table showing native commands.
*/

// create the HTML elements first
const { element } = require('dom')
const commands = element('div', { content: 'commands' })

// export the HTML element
module.exports = commands
