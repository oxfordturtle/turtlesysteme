/*
array of fonts
*/

const font = (index, name, css) =>
  ({ index, name, css })

module.exports = ([
  font(0x0, 'Arial', 'Arial, sans-serif'),
  font(0x1, 'Arial Black', '"Arial Black", sans-serif'),
  font(0x2, 'Comic Sans MS', '"Comic Sans MS", cursive, sans-serif'),
  font(0x3, 'Courier New', '"Courier New", Courier, monospace'),
  font(0x4, 'Georgia', 'Georgia, serif'),
  font(0x5, 'Impact', 'Impact, Charcoal, sans-serif'),
  font(0x6, 'Lucida Console', '"Lucida Console", monospace'),
  font(0x7, 'Lucida Sans Unicode', '"Lucida Sans Unicode", sans-serif'),
  font(0x8, 'Palatino Linotype', '"Palatino Linotype", "Book Antiqua", Palatino, serif'),
  font(0x9, 'Symbol', 'Symbol'),
  font(0xA, 'Tahoma', 'Tahoma, Geneva, sans-serif'),
  font(0xB, 'Times New Roman', '"Times New Roman", Times, serif'),
  font(0xC, 'Trebuchet MS', '"Trebuchet MS", helvetica, sans-serif'),
  font(0xD, 'Verdana', 'Verdana, Geneva, sans-serif'),
  font(0xE, 'Webdings', 'Webdings'),
  font(0xF, 'Wingdings', 'Wingdings')
])
