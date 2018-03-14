const newFont = (index, name, css) =>
  ({ index, name, css });

module.exports = ([
  newFont(0x0, 'Arial', 'Arial, sans-serif'),
  newFont(0x1, 'Arial Black', '"Arial Black", sans-serif'),
  newFont(0x2, 'Comic Sans MS', '"Comic Sans MS", cursive, sans-serif'),
  newFont(0x3, 'Courier New', '"Courier New", Courier, monospace'),
  newFont(0x4, 'Georgia', 'Georgia, serif'),
  newFont(0x5, 'Impact', 'Impact, Charcoal, sans-serif'),
  newFont(0x6, 'Lucida Console', '"Lucida Console", monospace'),
  newFont(0x7, 'Lucida Sans Unicode', '"Lucida Sans Unicode", sans-serif'),
  newFont(0x8, 'Palatino Linotype', '"Palatino Linotype", "Book Antiqua", Palatino, serif'),
  newFont(0x9, 'Symbol', 'Symbol'),
  newFont(0xA, 'Tahoma', 'Tahoma, Geneva, sans-serif'),
  newFont(0xB, 'Times New Roman', '"Times New Roman", Times, serif'),
  newFont(0xC, 'Trebuchet MS', '"Trebuchet MS", helvetica, sans-serif'),
  newFont(0xD, 'Verdana', 'Verdana, Geneva, sans-serif'),
  newFont(0xE, 'Webdings', 'Webdings'),
  newFont(0xF, 'Wingdings', 'Wingdings'),
]);
