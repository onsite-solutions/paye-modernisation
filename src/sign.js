//@ts-check
'use strict';

var crypto = require('crypto');

var utils = require('./utils');

/**
 * Gets the string to be signed as part of the Signature String Construction
 * @param {any} options
 * @param {string} digest
 */
function getSigningString(options, digest) {
  // (request-target)
  //var result = header.method + ' ' + header.path + '\n';
  var result =
    '(request-target): ' +
    options.headers.Method.toLowerCase() +
    ' ' +
    options.headers.Path +
    '\n';
  // host
  result += 'host: ' + options.host + '\n';
  // date
  result += 'date: ' + options.headers.Date;
  // digest
  if (!utils.isEmpty(options.headers.digest)) {
    result += '\n' + options.headers.digest;
  }

  result += '\n' + 'content-type: application/json;charset=UTF-8';

  return result;
}

/**
 * Generates the signature header
 * @param {string} signingString
 */
function getSignatureHeader(signingString) {
  // keyId
  //var result = 'keyId="' + this.keys.keyId + '",';
  var result = `keyId="${this.keys.keyId}"`;
  // algorithm
  result += 'algorithm="rsa-sha512",';
  // headers
  result += 'headers="(request-target) host date content-type",';
  //result += 'headers="(request-target) host date digest",'
  // signature
  var sign = crypto.createSign('RSA-SHA512');
  sign.update(signingString);
  var signature = sign.sign(this.keys.privatePem, 'base64');

  //result += 'signature="' + forge.util.encode64(signature) + '"';
  result += 'signature="' + signature + '"';
  return result;
}

/**
 *
 * @param {any} postBody
 * @param {string} privateKey
 */
Cert.prototype.getDigest = function(postBody, privateKey) {
  var sign = crypto.createSign('RSA-SHA512');
  sign.update(JSON.stringify(postBody));
  var digest = sign.sign(privateKey, 'base64');

  return digest;
};
