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
 * Check whether a date string is valid
 *
 * @param {string} date Date in the format YYYY-MM-DD
 */
function isDate(date) {
  return !isEmpty(date) && moment(date, 'YYYY-MM-DD').isValid();
}

/**
 * Check whether a Personal Public Service number is valid
 *
 * @param {string} ppsn The Personal Public Service number to be validated
 */
function isPpsn(ppsn) {
  let ppsnRegex = /^(\d{7})([A-Z]{1,2})$/i;

  if (ppsnRegex.test(ppsn)) {
    // Create arrays of the characters and digits
    let digits = ppsn.split('', 7).map(Number);
    let characters = ppsn.substring(7).split('');
    let multiplier = 8;
    let sum = 0;

    // Checksum calculation, first 7 digits
    for (let i in digits) {
      sum += digits[i] * multiplier--;
    }

    // If there is a second character, multiply its integer value by 9 and add this to the sum
    if (characters.length > 1) {
      sum += (characters[1].toUpperCase().charCodeAt(0) - 64) * 9;
    }

    // Checksum modulus 23 operation
    let checksum = sum % 23;

    // Check the result against the ASCII table to confirm it matches the check digit
    return checksum + 64 === characters[0].toUpperCase().charCodeAt(0);
  } else {
    // PPSN fails regex validation
    return false;
  }
}

module.exports = {
  isEmpty,
  isDate,
  isPpsn
};
