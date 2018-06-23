//@ts-check
'use strict';

/* Script for testing the various components of the encryption process */

var utils = require('../src/utils');

let count = 0;

// utils - hexToAscii
if (utils.hexToAscii('32343630') !== '2460') {
  console.log('FAIL: utils.hexToAscii');
  count++;
}

// utils - isEmpty
if (
  !utils.isEmpty(null) ||
  !utils.isEmpty(undefined) ||
  !utils.isEmpty({}) ||
  !utils.isEmpty('') ||
  !utils.isEmpty('   ') ||
  utils.isEmpty({ value: 12 }) ||
  utils.isEmpty('test')
) {
  console.log('FAIL: utils.isEmpty');
  count++;
}

console.log(`Testing completed. ${count} test(s) failed`);
