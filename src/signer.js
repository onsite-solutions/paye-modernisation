//@ts-check
'use strict';

const md5 = require('md5');
const btoa = require('btoa');
var forge = require('node-forge');
var fs = require('fs');
var crypto = require('crypto');

// scr: http://stackoverflow.com/questions/37833952/getting-the-private-key-from-p12-file-using-javascript
function extractKeys(pwd, certId) {
  var keyFile = fs.readFileSync('digital-certs/' + certId + '.p12');
  var keyBase64 = keyFile.toString('base64');

  var p12Der = forge.util.decode64(keyBase64);

  var p12Asn1 = forge.asn1.fromDer(p12Der);
  var p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, pwd);
  //http://stackoverflow.com/questions/17182848/best-approch-to-decode-the-pkcs12-file-and-get-the-encrypted-private-key-from-it
  // get bags by type
  var certBags = p12.getBags({ bagType: forge.pki.oids.certBag });
  var pkeyBags = p12.getBags({ bagType: forge.pki.oids.pkcs8ShroudedKeyBag });
  // fetching certBag
  var certBag = certBags[forge.pki.oids.certBag][0];
  // fetching keyBag
  var keybag = pkeyBags[forge.pki.oids.pkcs8ShroudedKeyBag][0];
  // generate pem from private key
  var privateKeyPem = forge.pki.privateKeyToPem(keybag.key);
  // public key
  var publicKeyPem = forge.pki.publicKeyToPem(keybag.key);
  // generate pem from cert
  var certificate = forge.pki.certificateToPem(certBag.cert);

  var keys = {
    keyBase64: keyBase64,
    privateKey: privateKeyPem,
    publicKey: publicKeyPem,
    certificate: certificate
  };

  return keys;
}

// Gets the string to be signed as part of the Signature String Construction
function getSigningString(header, digest) {
  // (request-target)
  //var result = header.method + ' ' + header.path + '\n';
  var result =
    '(request-target): ' +
    header.method.toLowerCase() +
    ' ' +
    header.path +
    '\n';
  // host
  result += 'host: ' + header.host + '\n';
  // date
  result += 'date: ' + header.date;
  // digest
  if (!isEmpty(header.digest)) {
    result += '\n' + header.digest;
  }

  result += '\n' + 'content-type: application/json';

  return result;
}

/**
 * Generates the signature header
 * @param {string} signingString
 * @param {object} keys
 */
function getSignatureHeader(signingString, keys) {
  // keyId
  var result = 'keyId="' + forge.util.encode64(keys.certificate) + '",';
  // algorithm
  result += 'algorithm="rsa-sha512",';
  // headers
  result += 'headers="(request-target) host date content-type",';
  //result += 'headers="(request-target) host date digest",'
  // signature
  var sign = crypto.createSign('RSA-SHA512');
  sign.update(signingString);
  var signature = sign.sign(keys.privateKey, 'base64');

  //result += 'signature="' + forge.util.encode64(signature) + '"';
  result += 'signature="' + signature + '"';
  return result;
}

function getDigest(postBody, privateKey) {
  var sign = crypto.createSign('RSA-SHA512');
  sign.update(JSON.stringify(postBody));
  var digest = sign.sign(privateKey, 'base64');

  return digest;
}

// src: http://stackoverflow.com/a/3745677/3181933
function hex2a(hexx) {
  var hex = hexx.toString(); //force conversion
  var str = '';
  for (var i = 0; i < hex.length; i += 2)
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  return str;
}

function getMd5Hash(value) {
  return btoa(hex2a(md5(value)));
}

function isEmpty(value) {
  return (
    value === undefined ||
    value === null ||
    (typeof value === 'object' && Object.keys(value).length === 0) ||
    (typeof value === 'string' && value.trim().length === 0)
  );
}

module.exports = {
  extractKeys,
  getSigningString,
  getSignatureHeader,
  getDigest,
  getMd5Hash
};
