/**
 * example programs
 * stored as tgb/tgp/tgy files (i.e. plain text) in the subdirectories of this module; the index
 * file in each subdirectory wraps them up in an associative array, and this module wraps each of
 * those up in an associative array
 */

// direct export
module.exports = {
  BASIC: require('./basic'),
  Pascal: require('./pascal'),
  Python: require('./python'),
};
