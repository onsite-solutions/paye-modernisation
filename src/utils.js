//@ts-check
'use strict';

const moment = require('moment');

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
 * Determines whether a date string is valid
 *
 * @param {string} date Date in the format YYYY-MM-DD
 */
function isValidDate(date) {
  return !isEmpty(date) && moment(date, 'YYYY-MM-DD').isValid();
}

module.exports = {
  isEmpty,
  isValidDate
};
