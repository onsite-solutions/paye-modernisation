//@ts-check
'use strict';

var md5 = require('md5');
var btoa = require('btoa');
var forge = require('node-forge');
var fs = require('fs');
var crypto = require('crypto');
var utils = require('./utils');

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
  this.hashedPassword = this.getMd5Hash(password);

  // Extract the keys
  this.extractKeys();
}

/**
 * Returns the MD5 hash of the provided string
 * @param {string} value The string to be hashed
 * @returns {string}
 */
Cert.prototype.getMd5Hash = function(value) {
  var hex = utils.hex2a(md5(value));
  return btoa(hex);
};

// scr: http://stackoverflow.com/questions/37833952/getting-the-private-key-from-p12-file-using-javascript

/**
 * Extracts the keys from the p12 file
 */
Cert.prototype.extractKeys = function() {
  var keyFile = fs.readFileSync('digital-certs/' + this.id + '.p12');
  var keyBase64 = keyFile.toString('base64');

  var p12Der = forge.util.decode64(keyBase64);

  var p12Asn1 = forge.asn1.fromDer(p12Der);
  var p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, this.hashedPassword);
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

  this.keys = {
    keyBase64: keyBase64,
    privateKey: privateKeyPem,
    publicKey: publicKeyPem,
    certificate: certificate
  };
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
  if (!this.isEmpty(header.digest)) {
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
