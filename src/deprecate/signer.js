//@ts-check
'use strict';

const md5 = require('md5');
const btoa = require('btoa');
var forge = require('node-forge');
var crypto = require('crypto');

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

function getMd5Hash(value) {
  return btoa(hex2a(md5(value)));
}

module.exports = {
  getSigningString,
  getSignatureHeader,
  getDigest,
  getMd5Hash
};
