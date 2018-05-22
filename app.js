const md5 = require('md5');
const btoa = require('btoa');

/*
const getHashedPassword = require('./cryptography/getHashedPassword')
  .getHashedPassword;

var password = 'password123';

console.log(getHashedPassword(password));


function hex2a(hexx) {
  var hex = hexx.toString(); //force conversion
  var str = '';
  for (var i = 0; i < hex.length; i += 2)
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  return str;
}
*/

// src: https://stackoverflow.com/a/3745677/3181933
function hex2a(hexx) {
  var hex = hexx.toString(); //force conversion
  var str = '';
  for (var i = 0; i < hex.length; i += 2)
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  return str;
}

var password = 'Password123';
// Then get the MD5 hash of these bytes
var hashed = hex2a(md5(password)); // md5 src: https://stackoverflow.com/a/33486055/7519287

console.log(btoa(hashed));

/*
function hex2a(hexx) {
  var hex = hexx.toString(); //force conversion
  var str = '';
  for (var i = 0; i < hex.length; i += 2)
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  return str;
}

function getHashedPassword(password) {
  // Get the MD5 hash of these bytes
  var hashed = hex2a(md5(password)); // md5 src: https://stackoverflow.com/a/33486055/7519287
  return btoa(hex2a(md5(password)));
}

module.exports = getHashedPassword;
 */
