//@ts-check
'use strict';

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
  isEmpty
};
