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
  let headerString = '(request-target) host date ';

  if (this.options.headers.Method === 'POST') {
    if (!validation.isEmpty(this.options.headers.Digest)) {
      headerString += 'digest ';
    }
    headerString += 'content-type ';
  }

  return headerString.trimRight();
};

/**
 * Gets the string to be signed as part of the Signature String Construction
 */
Message.prototype.getSigningString = function() {
  let result = [];
  let headers = this.options.headers;

  result.push(
    `(request-target): ${headers.Method.toLowerCase()} ${headers.Path}`
  );
  result.push(`host: ${headers.Host}`);
  result.push(`date: ${headers.Date}`);

  if (headers.Method === 'POST') {
    if (!validation.isEmpty(headers.Digest)) {
      result.push(`digest: ${headers.Digest}`);
    }
    result.push('content-type: application/json');
  }

  return result.join('\n');
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
