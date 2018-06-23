//@ts-check
'use strict';

/**
 * Converts a hexadecimal string to an ASCII string
 * @param {string} hex The hexadecimal string to be converted
 * @link http://stackoverflow.com/a/3745677/3181933
 */
function hexToAscii(hex) {
  var str = '';
  for (var i = 0; i < hex.length; i += 2)
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  return str;
}

/**
 * Indicates whether an object or primitive is empty
 * @param {any} value Object to check if is empty
 */
function isEmpty(value) {
  return (
    value === undefined ||
    value === null ||
    (typeof value === 'object' && Object.keys(value).length === 0) ||
    (typeof value === 'string' && value.trim().length === 0)
  );
}

module.exports = {
  hexToAscii,
  isEmpty
};
