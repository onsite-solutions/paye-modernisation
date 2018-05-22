const md5 = require('md5');
const btoa = require('btoa');

// src: https://stackoverflow.com/a/3745677/3181933
const hex2a = hexx => {
  var hex = hexx.toString(); //force conversion
  var str = '';
  for (var i = 0; i < hex.length; i += 2)
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  return str;
};

module.exports = getHashedPassword = password => {
  return btoa(hex2a(md5(password)));
};
