//@ts-check
'use strict';

const validation = require('../src/validation');

// validation.isPpsn
try {
  console.assert(
    validation.isPpsn('2165355FW') === true,
    'Valid PPS number failed validation'
  );
  console.assert(
    validation.isPpsn('0165330B') === false,
    'Invalid PPS number passed validation'
  );
} catch (err) {
  console.log(err.message);
}
