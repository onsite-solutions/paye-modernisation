//@ts-check
'use strict';

const forge = require('node-forge');
const fs = require('fs');
const crypto = require('crypto');
const btoa = require('btoa');
const md5 = require('md5');

const keys = require('./keys');
const utils = require('./utils');

/**
 * Represents a Digital certificate
 * @param {number} id Digital certificate identification number
 * @param {string} epn
 * @param {string} name Employer name
 * @param {string} password Password for the Digital certificate
 */
function Cert(id, epn, name, password) {
  this.id = id;
  this.epn = epn;
  this.name = name;
  this.password = password;

  // Get the MD5 hash of the password
  this.hashedPassword = this.getHashedPassword(password);

  // Extract the keys
  this.extractKeys();
}

/**
 * Converts the customer password to an MD5 hashed password that can open a PKCS#12 file
 * @param {string} password The customer password to be converted
 */
Cert.prototype.getHashedPassword = function(password) {
  // Get the MD5 hash of the input password. This btoa error is a TypeScript warning, but code is working
  return btoa(utils.hexToAscii(md5(password)));
};

/**
 * Extracts the keys from the PKCS#12 file
 * @link https://stackoverflow.com/q/37833952/5049533
 * @link https://stackoverflow.com/q/17182848/5049533
 */
Cert.prototype.extractKeys = function() {
  // Read the key file and convert to base64 encoded string
  var keyFile = fs
    .readFileSync(`./test/certs/${this.id}.p12`)
    .toString('base64');

  // Decode p12 from base64
  var p12Der = forge.util.decode64(keyFile);
  // Get p12 as an ASN.1 object
  var p12Asn1 = forge.asn1.fromDer(p12Der);
  // Decrypt p12 using the hashed password
  var p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, this.hashedPassword);

  // Get bags by type
  var certBags = p12.getBags({ bagType: forge.pki.oids.certBag });
  var keyBags = p12.getBags({ bagType: forge.pki.oids.pkcs8ShroudedKeyBag });

  // Get certBag and keyBag
  var certBag = certBags[forge.pki.oids.certBag][0];
  var keyBag = keyBags[forge.pki.oids.pkcs8ShroudedKeyBag][0];

  // generate PEMs from private key, public key and certificate
  var privateKeyPem = forge.pki.privateKeyToPem(keyBag.key);
  var publicKeyPem = forge.pki.publicKeyToPem(keyBag.key);
  var certificatePem = forge.pki.certificateToPem(certBag.cert);

  console.log(certBag.cert);

  this.keys = new keys(privateKeyPem, publicKeyPem, certificatePem);
};

/**
 * Gets the string to be signed as part of the Signature String Construction
 * @param {any} header
 * @param {string} digest
 */
Cert.prototype.getSigningString = function(header, digest) {
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
  if (!utils.isEmpty(header.digest)) {
    result += '\n' + header.digest;
  }

  result += '\n' + 'content-type: application/json';

  return result;
};

/**
 * Generates the signature header
 * @param {string} signingString
 */
Cert.prototype.getSignatureHeader = function(signingString) {
  // keyId
  var result = 'keyId="' + forge.util.encode64(this.keys.certificate) + '",';
  // algorithm
  result += 'algorithm="rsa-sha512",';
  // headers
  result += 'headers="(request-target) host date content-type",';
  //result += 'headers="(request-target) host date digest",'
  // signature
  var sign = crypto.createSign('RSA-SHA512');
  sign.update(signingString);
  var signature = sign.sign(this.keys.privateKey, 'base64');

  //result += 'signature="' + forge.util.encode64(signature) + '"';
  result += 'signature="' + signature + '"';
  return result;
};

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

module.exports = Cert;
