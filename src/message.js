//@ts-check
'use strict';

var forge = require('node-forge');
var crypto = require('crypto');

var utils = require('./utils');
var Cert = require('./cert');
var config = require('../config/config');

/**
 * Wrapper for a https request conforming to the proposed Cavage HTTP Signature Header standard
 * @param {any} options The request options object
 * @param {Cert} cert the digital certificate
 * @link https://tools.ietf.org/html/draft-cavage-http-signatures-08#section-4
 */
function Message(options, cert) {
  this.options = options;
  this.cert = cert;
  let headers = options.headers;

  if (headers.Method === 'POST' && !utils.isEmpty(headers.Digest)) {
    this.setDigest();
  }

  this.signingString = this.setSigningString();

  this.httpSignatureHeader = this.setSignatureHeader();
}

/**
 * If there is a message body, creates the Digest header from the MD5 hash
 */
Message.prototype.setDigest = function() {
  // Convert payload to byte array
  var bytes = this.options.postBody.toString().getBytes('UTF-8');
  var md = forge.md.md5.create();
  md.update(bytes);
  let digest = forge.util.encode64(md.digest().toString());

  console.log(digest);

  this.options.headers.Digest = digest;
};

/**
 * Sets the string to be signed as part of the Signature String Construction
 */
Message.prototype.setSigningString = function() {
  var result = [];
  let headerString = '';
  let options = this.options;
  let headers = this.options.headers;

  // (request-target)
  result.push(
    `(request-target): ${headers.Method.toLowerCase()} ${headers.Path}`
  );
  headerString += '(request-target) ';

  // host
  result.push(`host: ${options.host}`);
  headerString += 'host ';

  // date
  result.push(`date: ${headers.Date}`);
  headerString += 'date ';

  // x-date

  // digest
  if (headers.Method === 'POST' && !utils.isEmpty(headers.Digest)) {
    result.push(`digest: ${headers.Digest}`);
    headerString += 'digest ';
  }

  // content-type
  result.push('content-type: application/json;charset=UTF-8');
  headerString += 'content-type ';

  // x-http-method-override

  // Set the headerString and signingString
  this.headerString = headerString.trimRight();
  this.signingString = result.join('\n');
};

/**
 * Generates the signature header
 */
Message.prototype.setSignatureHeader = function() {
  // keyId
  var result = `keyId="${this.cert.keys.keyId}"`;

  // algorithm
  result += 'algorithm="rsa-sha512",';

  // headers
  result += `headers="${this.headerString}",`;

  // signature
  var sign = crypto.createSign('RSA-SHA512');
  sign.update(this.signingString);
  var signature = sign.sign(this.cert.keys.privatePem, 'base64');

  //TODO: does this need to be encoded?
  //result += 'signature="' + forge.util.encode64(signature) + '"';
  result += 'signature="' + signature + '"';
  return result;
};

module.exports = Message;
