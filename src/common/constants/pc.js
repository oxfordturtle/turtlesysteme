/*
An object for looking up machine codes.
*/
import pcodes from './pcodes'

export default pcodes.filter(x => x !== undefined).reduce((sofar, pcode) => {
  sofar[pcode.str.toLowerCase()] = pcode.code
  return sofar
}, {})
