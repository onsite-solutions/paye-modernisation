<<<<<<< HEAD
const md5 = require('md5');
const btoa = require('btoa');
var forge = require('node-forge');
var fs = require('fs');
/*
const getHashedPassword = require('./cryptography/getHashedPassword')
  .getHashedPassword;
=======
const crypto = require('crypto');

var password = 'Password123';
>>>>>>> 9d16571142aea337434e239c0e2d2748e9643ba0

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
// scr: https://stackoverflow.com/questions/37833952/getting-the-private-key-from-p12-file-using-javascript
function extractPrivateKey(pwd) {
  var keyFile = fs.readFileSync('digital-certs/999963665.p12');
  var keyBase64 = keyFile.toString('base64');
  
  var p12Der = forge.util.decode64(keyBase64);

  var p12Asn1 = forge.asn1.fromDer(p12Der);
  var p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, pwd);
  //https://stackoverflow.com/questions/17182848/best-approch-to-decode-the-pkcs12-file-and-get-the-encrypted-private-key-from-it
   // get bags by type
   var certBags = p12.getBags({bagType: forge.pki.oids.certBag});
   var pkeyBags = p12.getBags({bagType: forge.pki.oids.pkcs8ShroudedKeyBag});
// fetching certBag
var certBag = certBags[forge.pki.oids.certBag][0];
// fetching keyBag
var keybag = pkeyBags[forge.pki.oids.pkcs8ShroudedKeyBag][0];
// generate pem from private key
var privateKeyPem = forge.pki.privateKeyToPem(keybag.key);
// generate pem from cert
var certificate = forge.pki.certificateToPem(certBag.cert);
  return privateKeyPem;
}

<<<<<<< HEAD
var password = '5fd93c74';
// Then get the MD5 hash of these bytes
var hashed = hex2a(md5(password)); // md5 src: https://stackoverflow.com/a/33486055/7519287
console.log(btoa(hashed));

var pk = extractPrivateKey(btoa(hashed));


console.log(pk);

/*
=======
// Then get the MD5 hash of these bytes
// var hashed = hex2a(md5(password)); // md5 src: https://stackoverflow.com/a/33486055/7519287

// var hashed = console.log(btoa(hashed));

>>>>>>> 9d16571142aea337434e239c0e2d2748e9643ba0
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
