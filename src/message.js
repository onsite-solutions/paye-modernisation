//@ts-check
'use strict';

var forge = require('node-forge');
var crypto = require('crypto');

var utils = require('./utils');
var Cert = require('./cert');

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

  //If there is a POST body/payload, create the Digest header
  if (headers.Method === 'POST' && !utils.isEmpty(this.options.form)) {
    this.setDigest();
  }

  this.signingString = this.setSigningString();

  this.httpSignatureHeader = this.setSignatureHeader();
}

/**
 * Sets the digest header from the POST body/payload.
 * Calculates the SHA512 digest hash of the JSON document and converts it to a BASE64 encoded String
 *
 * @link https://gist.github.com/RevenueGitHubAdmin/22566bb275f5b084d78e3532c0947d3c
 */
Message.prototype.setDigest = function() {
  // The sha512 warning is a TypeScript issue, the property does exist but is not
  this.digest = forge.util.encode64(
    forge.md.sha512
      .create()
      .update(this.options.form)
      .digest()
      .getBytes()
  );

  this.options.headers.Digest = this.digest;
};

/**
 * Sets the string to be signed as part of the Signature String Construction
 */
Message.prototype.setSigningString = function() {
  var result = [];
  let headerString = '';
  let options = this.options;
  let hdrs = this.options.headers;

  // (request-target)
  result.push(`(request-target): ${hdrs.Method.toLowerCase()} ${hdrs.Path}`);
  headerString += '(request-target) ';

  // host
  result.push(`host: ${hdrs.Host}`);
  headerString += 'host ';

  // date
  result.push(`date: ${hdrs.Date}`);
  headerString += 'date ';

  // x-date

  // digest
  if (hdrs.Method === 'POST' && !utils.isEmpty(hdrs.Digest)) {
    result.push(`digest: ${hdrs.Digest}`);
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
