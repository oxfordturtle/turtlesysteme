/*
array of cursors
*/

const cursor = (index, name, css) =>
  ({ index, name, css })

module.exports = ([
  cursor(0x0, 'None', 'none'),
  cursor(0x1, 'Default', 'default'),
  cursor(0x2, 'Pointer', 'pointer'),
  cursor(0x3, 'Crosshair', 'crosshair'),
  cursor(0x4, 'Text', 'text'),
  cursor(0x5, 'Move', 'move'),
  cursor(0x6, 'Resize NESW', 'nesw-resize'),
  cursor(0x7, 'Resize NS', 'ns-resize'),
  cursor(0x8, 'Resize NWSE', 'nwse-resize'),
  cursor(0x9, 'Resize EW', 'ew-resize'),
  cursor(0xA, 'Resize N', 'n-resize'),
  cursor(0xB, 'Wait', 'wait'),
  cursor(0xC, 'Progress', 'progress'),
  cursor(0xD, 'No Drop', 'no-drop'),
  cursor(0xE, 'Forbidden', 'not-allowed'),
  cursor(0xF, 'Help', 'help')
])
