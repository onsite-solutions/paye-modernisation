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

/**
 * Remove keys with null values from an object
 * @param {any} obj The object from which null value keys are to be removed
 */
const removeEmpty = obj => {
  Object.keys(obj).forEach(key => obj[key] == null && delete obj[key]);
};

module.exports = {
  isEmpty,
  removeEmpty
};
