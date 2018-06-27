//@ts-check
'use strict';

/* Script for testing the various components of the encryption and messaging process */

var Cert = require('../src/cert');
var Message = require('../src/message');
var utils = require('../src/utils');
var config = require('../config/config');
var certs = require('../test/certs');

var testGet = require('./requests/testGet');
var testPost = require('./requests/testPost');
var testPostPayload = require('../test/requests/testPostPayload');

let failed = 0;

function logError(message) {
  console.log(`TEST FAILED: ${message}`);
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
  utils.isEmpty('test') ||
  utils.isEmpty(6)
) {
  logError('utils.isEmpty');
}

// Get config for the test environment
var conf = config.find(x => x.env === 'test');

// Fetch a digital certificate from the certs array
var certParams = certs.find(c => c.id == 999963666); // or 999963665

var cert = new Cert(
  certParams.id,
  certParams.epn,
  certParams.name,
  certParams.password
);

// Is cert instantiated
if (utils.isEmpty(cert)) {
  logError('Cert not instantiated from prototype');
}
// Is the password hashing function working as expected
let testPassword = 'Password123';
let expectedHash = 'QvdJref54ZW/R183pEyvyw==';

if (cert.getHashedPassword(testPassword) !== expectedHash) {
  logError('Password hash calculated incorrectly');
}

// Is there a hashed password on the cert
if (utils.isEmpty(cert.hashedPassword)) {
  logError('Hashed password not calculated');
}

// Is there a PKCS#12 KeyStore on the cert
if (utils.isEmpty(cert.pkcs12KeyStore)) {
  logError('PKCS#12 KeyStore not found');
}

// Has the certificate has been extracted
if (utils.isEmpty(cert.certificate)) {
  logError('Certificate was not extracted from PKCS#12 KeyStore');
}

// Has the private key been extracted
if (utils.isEmpty(cert.privateKey)) {
  logError('Private Key was not extracted from PKCS#12 KeyStore');
}

// Has the certificate been encoded to create the keyId
if (utils.isEmpty(cert.keyId)) {
  logError('Private Key was not extracted from PKCS#12 KeyStore');
}

// Create a test GET message
var options = testGet(conf, cert);

// Has the options object instantiated
if (utils.isEmpty(options)) {
  logError('options object not instantiated for GET request');
}

// Are all the fields populated
if (
  utils.isEmpty(options.headers) ||
  utils.isEmpty(options.headers.Method) ||
  utils.isEmpty(
    options.headers.Path ||
      utils.isEmpty(options.headers.Host) ||
      utils.isEmpty(options.headers.Date)
  )
) {
  logError('Some field(s) were not populated for the options object');
}

// Create the message object
var getMsg = new Message(options, cert);

// Is the GET message instantiated
if (utils.isEmpty(getMsg)) {
  logError('getMsg object was not instantiated');
}

// Test a GET endpoint
console.log(getMsg.options.headers.Signature);

console.log(`Testing completed. ${failed} test(s) failed`);
