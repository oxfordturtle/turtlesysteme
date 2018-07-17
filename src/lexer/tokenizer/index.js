/**
 * tokenizer; program code (a string) goes in, an array of tokens comes out; these are used both
 * for syntax highlighting, and as a basis for the lexical analysis part of the compilation
 *
 * tokens look like this: { type, content }; token types are as follows:
 *   - linebreak
 *   - spaces
 *   - comment / unterminated-comment
 *   - operator
 *   - punctuation
 *   - string / unterminated-string
 *   - boolean
 *   - binary / bad-binary (the latter uses the wrong prefix)
 *   - octal / bad-octal (the latter uses the wrong prefix)
 *   - hexadecimal / bad-hexadecimal (the latter uses the wrong prefix)
 *   - decimal / bad-decimal (the latter has a decimal point in; real numbers are not allowed)
 *   - keyword
 *   - type (Pascal only; special keywords for type definitions, e.g. "array", "char", "string")
 *   - command (native Turtle procedure or function)
 *   - turtle (built-in Turtle property variable, e.g. "turtx", "turty")
 *   - colour (predefined colour constant)
 *   - keycode (e.g. "\a", "\z", "\backspace")
 *   - query (e.g. "?mousex", "?clicky")
 *   - identifier (Pascal and Python only; variable, constant, or subroutine name)
 *   - subroutine (BASIC only; custom procedure or function name, e.g. "PROCname", "FNname")
 *   - variable (BASIC only; variable name, e.g. "integer%", "string$")
 *   - illegal (an error)
 */

// local imports
const BASIC = require('./basic');
const Pascal = require('./pascal');
const Python = require('./python');

// collect the language-specific tokenizers into a record
const tokenizers = { BASIC, Pascal, Python };

// the tokenizer function
const tokenizer = (code, language) =>
  tokenizers[language](code);

// export the tokenizer function
module.exports = tokenizer;
