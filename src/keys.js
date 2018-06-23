//@ts-check
'use strict';

/**
 * Stores the Private, Public and Certificate PEM files for a Cert
 * @param {string} privateKeyPem The private key PEM file
 * @param {string} PublicKeyPem The public key PEM file
 * @param {string} CertificatePem The certificate PEM file
 */
function Keys(privateKeyPem, PublicKeyPem, CertificatePem) {
  this.privateKeyPem = privateKeyPem;
  this.PublicKeyPem = PublicKeyPem;
  this.CertificatePem = CertificatePem;
}

Keys.prototype.removeBeginEnd = function(pemString) {
  // cut the first line:
  var result = pemString.substring(pemString.indexOf('\n') + 1);
  // cut the last line:
  result = result.substring(result.lastIndexOf('-----END') + 1, -1);
  return result;
};

module.exports = Keys;
