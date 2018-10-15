//@ts-check
'use strict';

var assert = require('assert');

/* Script for testing the various components of the encryption and messaging process */

var Cert = require('../src/cert');
var Message = require('../src/message');
var validation = require('../src/validation');
var Config = require('../src/config/config');
var environments = require('../src/config/environments');
var certs = require('../src/client/certs/certs');

//var testGet = require('./requests/testGet');
//var testPost = require('./requests/testPost');
//var testPostPayload = require('../test/requests/testPostPayload');

let failed = 0;

function logError(message) {
  console.log(`TEST FAILED: ${message}`);
  failed++;
}

// validation - isEmpty
if (
  !validation.isEmpty(null) ||
  !validation.isEmpty(undefined) ||
  !validation.isEmpty({}) ||
  !validation.isEmpty('') ||
  !validation.isEmpty('   ') ||
  validation.isEmpty({ value: 12 }) ||
  validation.isEmpty('test') ||
  validation.isEmpty(6)
) {
  logError('validation.isEmpty');
}

let config = environments.find(x => x.name === 'test').config;
let params = certs.find(c => c.id === 999963665); // 999963665 or 999963666
let cert = new Cert(params.id, params.epn, params.name, params.password);

// Is cert instantiated
if (validation.isEmpty(cert)) {
  logError('Cert not instantiated from prototype');
}
// Is the password hashing function working as expected
let testPassword = 'Password123';
let expectedHash = 'QvdJref54ZW/R183pEyvyw==';

if (cert.getHashedPassword(testPassword) !== expectedHash) {
  logError('Password hash calculated incorrectly');
}

// Is there a hashed password on the cert
if (validation.isEmpty(cert.hashedPassword)) {
  logError('Hashed password not calculated');
}

// Is there a PKCS#12 KeyStore on the cert
if (validation.isEmpty(cert.pkcs12KeyStore)) {
  logError('PKCS#12 KeyStore not found');
}

// Has the certificate has been extracted
if (validation.isEmpty(cert.certificate)) {
  logError('Certificate was not extracted from PKCS#12 KeyStore');
}

// Has the private key been extracted
if (validation.isEmpty(cert.privateKey)) {
  logError('Private Key was not extracted from PKCS#12 KeyStore');
}

// Has the certificate been encoded to create the keyId
if (validation.isEmpty(cert.keyId)) {
  logError('Private Key was not extracted from PKCS#12 KeyStore');
}

// // Create a test GET message
// var options = testGet(conf, cert);

// // Has the options object instantiated
// if (validation.isEmpty(options)) {
//   logError('options object not instantiated for GET request');
// }

// // Are all the fields populated
// if (
//   utils.isEmpty(options.headers) ||
//   utils.isEmpty(options.headers.Method) ||
//   utils.isEmpty(
//     options.headers.Path ||
//       utils.isEmpty(options.headers.Host) ||
//       utils.isEmpty(options.headers.Date)
//   )
// ) {
//   logError('Some field(s) were not populated for the options object');
// }

// // Create the message object
// var getMsg = new Message(options, cert);

// // Is the GET message instantiated
// if (utils.isEmpty(getMsg)) {
//   logError('getMsg object was not instantiated');
// }

// Test a GET endpoint
//console.log(getMsg.options.headers.Signature);

console.log(`Testing completed. ${failed} test(s) failed`);
