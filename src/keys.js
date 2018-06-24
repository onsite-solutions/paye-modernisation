//@ts-check
'use strict';

var utils = require('./utils');

/**
 * Stores the Private, Public and Certificate PEM files for a Cert
 * @param {string} privatePem The private key PEM file
 * @param {string} publicPem The public key PEM file
 * @param {string} certPem The certificate PEM file
 */
function Keys(privatePem, publicPem, certPem) {
  this.privatePem = privatePem;
  this.publicPem = publicPem;
  this.certPem = certPem;

  this.setKeyId();
}

/**
 * Removes BEGIN CERTIFICATE and END CERTIFICATE from the certificatePem
 * This seems to be what is expected as keyId in the signing string
 */
Keys.prototype.setKeyId = function() {
  // split the certificatePem into an array of lines
  var lines = this.certPem.split('\r\n');
  let keyId = '';

  // In the ROS sample file, they keyId does not have line breaks, so we just concatenate the relevant lines
  for (var i = 0; i < lines.length; i++) {
    if (!(lines[i].indexOf('CERTIFICATE') !== -1) && !utils.isEmpty(lines[i])) {
      keyId += lines[i];
    }
  }

  this.keyId = keyId;
};

module.exports = Keys;
