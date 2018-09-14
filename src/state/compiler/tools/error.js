/*
create a compiler error object
*/
module.exports = (message, lexeme) => {
  const err = new Error(message)
  err.lexeme = lexeme
  err.type = 'Compiler'
  return err
}
