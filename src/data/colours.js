/**
 * an array of native colour constants
 */

// pad a string with leading zeros
const zeroPadding = string =>
  (string.length < 6 ? zeroPadding(`0${string}`) : string);

// create a colour object
const colour = (index, name, value, dark) =>
  ({
    index,
    names: {
      BASIC: name.toUpperCase(),
      Pascal: name,
      Python: name,
    },
    type: 'integer',
    value,
    hex: {
      BASIC: `&${zeroPadding(value.toString(16))}`,
      Pascal: `$${zeroPadding(value.toString(16))}`,
      Python: `0x${zeroPadding(value.toString(16))}`,
    },
    css: `#${zeroPadding(value.toString(16))}`,
    dark,
  });

// direct export
module.exports = ([
  colour(1, 'green', 0x228B22, true),
  colour(2, 'red', 0xFF0000, true),
  colour(3, 'blue', 0x0000FF, true),
  colour(4, 'yellow', 0xFFFF00, false),
  colour(5, 'violet', 0x8A2BE2, true),
  colour(6, 'lime', 0x00FF00, false),
  colour(7, 'orange', 0xFFAA00, false),
  colour(8, 'skyblue', 0x00B0FF, false),
  colour(9, 'brown', 0x964B00, true),
  colour(10, 'pink', 0xEE1289, true),
  colour(11, 'darkgreen', 0x006400, true),
  colour(12, 'darkred', 0xB22222, true),
  colour(13, 'darkblue', 0x000080, true),
  colour(14, 'ochre', 0xC0B030, true),
  colour(15, 'indigo', 0x4B0082, true),
  colour(16, 'olive', 0x808000, true),
  colour(17, 'orangered', 0xFF6600, true),
  colour(18, 'teal', 0x008080, true),
  colour(19, 'darkbrown', 0x5C4033, true),
  colour(20, 'magenta', 0xFF00FF, true),
  colour(21, 'lightgreen', 0x98FB98, false),
  colour(22, 'lightred', 0xCD5C5C, false),
  colour(23, 'lightblue', 0x99BBFF, false),
  colour(24, 'cream', 0xFFFFBB, false),
  colour(25, 'lilac', 0xB093FF, false),
  colour(26, 'yellowgreen', 0xAACC33, false),
  colour(27, 'peach', 0xFFCCB0, false),
  colour(28, 'cyan', 0x00FFFF, false),
  colour(29, 'lightbrown', 0xB08050, false),
  colour(30, 'lightpink', 0xFFB6C1, false),
  colour(31, 'seagreen', 0x3CB371, false),
  colour(32, 'maroon', 0x800000, true),
  colour(33, 'royal', 0x4169E1, true),
  colour(34, 'gold', 0xFFC800, false),
  colour(35, 'purple', 0x800080, true),
  colour(36, 'emerald', 0x00C957, false),
  colour(37, 'salmon', 0xFA8072, false),
  colour(38, 'turquoise', 0x00BEC1, false),
  colour(39, 'coffee', 0x926F3F, false),
  colour(40, 'rose', 0xFF88AA, false),
  colour(41, 'greengrey', 0x709070, true),
  colour(42, 'redgrey', 0xB08080, true),
  colour(43, 'bluegrey', 0x8080A0, true),
  colour(44, 'yellowgrey', 0x909070, true),
  colour(45, 'darkgrey', 0x404040, true),
  colour(46, 'midgrey', 0x808080, true),
  colour(47, 'lightgrey', 0xA0A0A0, false),
  colour(48, 'silver', 0xC0C0C0, false),
  colour(49, 'white', 0xFFFFFF, false),
  colour(50, 'black', 0x000000, true),
]);
