//@ts-check
'use strict';

const validation = require('../src/validation');

// Test regex
//console.log(validation.isPpsn('1234567A'));
//console.log(validation.isPpsn('1234567BA'));
//console.log(validation.isPpsn('123456AA'));

console.log('These should be true');
console.log(validation.isPpsn('1599774O'));
console.log(validation.isPpsn('0123130A'));
console.log(validation.isPpsn('0166330B'));
console.log(validation.isPpsn('2165355FW'));
console.log(validation.isPpsn('1156033U'));
console.log(validation.isPpsn('1621030G'));
console.log(validation.isPpsn('1085107G'));
console.log(validation.isPpsn('0166034U'));
console.log(validation.isPpsn('1763143O'));
console.log(validation.isPpsn('2360287D'));
console.log('These should be false');
console.log(validation.isPpsn('1595774O'));
console.log(validation.isPpsn('0125130A'));
console.log(validation.isPpsn('0165330B'));
console.log(validation.isPpsn('2166355FW'));
console.log(validation.isPpsn('1157033U'));
console.log(validation.isPpsn('1626030G'));
console.log(validation.isPpsn('1082107G'));
console.log(validation.isPpsn('0165034U'));
console.log(validation.isPpsn('1765143O'));
console.log(validation.isPpsn('2365287D'));
console.log('end');
