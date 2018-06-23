//@ts-check
'use strict';

/* Script for testing the various components of the encryption process */

const forge = require('node-forge');

const Cert = require('../src/cert');
const utils = require('../src/utils');
const certs = require('../test/certs');

let failed = 0;

// utils - hexToAscii
if (utils.hexToAscii('32343630') !== '2460') {
  console.log('FAIL: utils.hexToAscii');
  failed++;
}

// utils - isEmpty
if (
  !utils.isEmpty(null) ||
  !utils.isEmpty(undefined) ||
  !utils.isEmpty({}) ||
  !utils.isEmpty('') ||
  !utils.isEmpty('   ') ||
  utils.isEmpty({ value: 12 }) ||
  utils.isEmpty('test')
) {
  console.log('FAIL: utils.isEmpty');
  failed++;
}

// Fetch a digital certificate from the certs array
var certParams = certs.find(c => c.id == 999963666); // or 999963665

var cert = new Cert(
  certParams.id,
  certParams.epn,
  certParams.name,
  certParams.password
);

// Confirm cert is instantiated
if (utils.isEmpty(cert)) {
  console.log('FAIL: could not instantiate Cert prototype');
  failed++;
}
// Check that the hashed password has generated correctly:
let testPassword = 'Password123';
let expectedHash = 'QvdJref54ZW/R183pEyvyw==';

if (cert.getHashedPassword(testPassword) !== expectedHash) {
  console.log('FAIL: Password MD5 hash calculated incorrectly');
}

// Check that PEM keys have been extracted:
if (
  cert.keys.privateKeyPem.split('\n')[0].indexOf('BEGIN RSA PRIVATE KEY') === -1
) {
  console.log('FAIL: Private Key PEM was not extracted');
} else if (
  cert.keys.PublicKeyPem.split('\n')[0].indexOf('BEGIN PUBLIC KEY') === -1
) {
  console.log('FAIL: Public Key PEM was not extracted');
} else if (
  cert.keys.CertificatePem.split('\n')[0].indexOf('BEGIN CERTIFICATE') === -1
) {
  console.log('FAIL: Certificate PEM was not extracted');
}

var keyId = cert.keys.removeBeginEnd(cert.keys.CertificatePem);
console.log(keyId);

console.log(`Testing completed. ${failed} test(s) failed`);
