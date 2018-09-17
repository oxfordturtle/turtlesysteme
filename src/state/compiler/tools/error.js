/*
create a compiler error object

replaces '{lex}' in the message with the content of the lexeme; this just makes it easier to write
the error messages that are sent to this function, since many of them refer to the relevant lexeme
*/
module.exports = (message, lexeme) => {
  const err = new Error(message.replace('{lex}', `"${lexeme.content}"`))
  err.lexeme = lexeme
  err.type = 'Compiler'
  return err
}
