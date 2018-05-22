const crypto = require('crypto');

var password = 'Password123';

console.log(`password: ${password}`);

// Use the node crypto module to get the md5 hash of the password

var hashedPassword = crypto
  .createHash('md5')
  .update(password)
  .digest('base64');

console.log(`hashed: ${hashedPassword}`);

/* NOTE: The above code has achieved the same as the functions commented out below */

/*
// src: https://stackoverflow.com/a/3745677/3181933
function hex2a(hexx) {
  var hex = hexx.toString(); //force conversion
  var str = '';
  for (var i = 0; i < hex.length; i += 2)
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  return str;
}

// Then get the MD5 hash of these bytes
// var hashed = hex2a(md5(password)); // md5 src: https://stackoverflow.com/a/33486055/7519287

// var hashed = console.log(btoa(hashed));

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
