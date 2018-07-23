//@ts-check
'use strict';

var forge = require('node-forge');

var validation = require('./validation');
var Cert = require('./cert');

/**
 * Wrapper for a https request conforming to the proposed Cavage HTTP Signature Header standard
 * @param {any} options The request options object
 * @param {Cert} cert the digital certificate
 * @param {any} payload
 * @link https://tools.ietf.org/html/draft-cavage-http-signatures-08#section-4
 */
function Message(options, cert, payload = null) {
  this.options = options;
  this.cert = cert;
  this.payload = payload;
  let headers = options.headers;

  //If there is a POST body/payload, create the Digest header
  if (headers.Method === 'POST' && !validation.isEmpty(this.payload)) {
    this.digest = this.getDigest(this.payload);
    this.options.headers.Digest = this.digest;
  }

  this.headerString = this.getHeaderString();
  this.signingString = this.getSigningString();
  this.httpSignatureHeader = this.getSignatureHeader();

  this.options.headers.Signature = this.httpSignatureHeader;
}

/**
 * Calculates the SHA512 digest hash of the JSON payload and converts it to a BASE64 encoded String
 * @param {any} payload
 * @link https://gist.github.com/RevenueGitHubAdmin/22566bb275f5b084d78e3532c0947d3c
 */
Message.prototype.getDigest = function(payload) {
  // The sha512 warning is a TypeScript false alarm
  return forge.util.encode64(
    forge.md.sha512
      .create()
      .update(payload)
      .digest()
      .getBytes()
  );
};

/**
 * Generates the headers string that forms part of the Signature header
 */
Message.prototype.getHeaderString = function() {
  let headerString = '';
  let hdrs = this.options.headers;

  // (request-target)
  headerString += '(request-target) ';

  // host
  headerString += 'host ';

  // date
  headerString += 'date ';

  // x-date

  // digest
  if (hdrs.Method === 'POST' && !validation.isEmpty(hdrs.Digest)) {
    headerString += 'digest ';
  }

  // content-type
  if (hdrs.Method === 'POST') {
    headerString += 'content-type ';
  }

  // x-http-method-override

  return headerString.trimRight();
};

/**
 * Gets the string to be signed as part of the Signature String Construction
 */
Message.prototype.getSigningString = function() {
  let signString = [];
  let hdrs = this.options.headers;

  // (request-target)
  signString.push(
    `(request-target): ${hdrs.Method.toLowerCase()} ${hdrs.Path}`
  );

  // host
  signString.push(`host: ${hdrs.Host}`);

  // date
  signString.push(`date: ${hdrs.Date}`);

  // x-date

  // digest
  if (hdrs.Method === 'POST' && !validation.isEmpty(hdrs.Digest)) {
    signString.push(`digest: ${hdrs.Digest}`);
  }

  // content-type
  if (hdrs.Method === 'POST') {
    signString.push('content-type: application/json');
  }

  // x-http-method-override

  return signString.join('\n');
};

/**
 * Generates the signature header (keyId, algorithm, headers, signature)
 */
Message.prototype.getSignatureHeader = function() {
  return (
    `keyId="${this.cert.keyId}",` +
    'algorithm="rsa-sha512",' +
    `headers="${this.headerString}",` +
    `signature="${this.cert.signStringWithPrivateKey(this.signingString)}"`
  );
};

module.exports = Message;
