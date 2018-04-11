/*
 * cursors
 */
const newCursor = (index, name, css) =>
  ({ index, name, css });

module.exports = ([
  newCursor(0x0, 'None', 'none'),
  newCursor(0x1, 'Default', 'default'),
  newCursor(0x2, 'Pointer', 'pointer'),
  newCursor(0x3, 'Crosshair', 'crosshair'),
  newCursor(0x4, 'Text', 'text'),
  newCursor(0x5, 'Move', 'move'),
  newCursor(0x6, 'Resize NESW', 'nesw-resize'),
  newCursor(0x7, 'Resize NS', 'ns-resize'),
  newCursor(0x8, 'Resize NWSE', 'nwse-resize'),
  newCursor(0x9, 'Resize EW', 'ew-resize'),
  newCursor(0xA, 'Resize N', 'n-resize'),
  newCursor(0xB, 'Wait', 'wait'),
  newCursor(0xC, 'Progress', 'progress'),
  newCursor(0xD, 'No Drop', 'no-drop'),
  newCursor(0xE, 'Forbidden', 'not-allowed'),
  newCursor(0xF, 'Help', 'help'),
]);
