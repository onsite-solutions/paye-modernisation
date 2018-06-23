//@ts-check
'use strict';

const http = require('http');
const certs = require('../test/certs');
var cert = require('./Cert');

/*
Following response from ROS this is a verbatim attempt to replicate their sample 'successful request' file.
Where there are contradictions between their documentation, the Cavage documentation and the sample file, 
the approach taken in the sample file will take precedence.
*/

// Fetch the digital certificate from the certs array
var certParams = certs.find(c => c.id == 999963666); // or 999963665

var cert = new Cert(
  certParams.id,
  certParams.epn,
  certParams.name,
  certParams.password
);

// Create options
var options = {
  host: 'softwaretest.ros.ie',
  headers: {
    Method: 'GET',
    Path:
      '/v1/rest/payroll/' +
      cert.epn +
      '/' +
      2018 +
      '/Payroll1/submission01?softwareUsed=SOftwareABC&softwareVersion=1.0.0',
    Date: new Date().toUTCString(),
    'Content-Type': 'application/json',
    Signature: ''
  }
};

// Create headers

// Build the plaintext signing string from the headers

var signingString = cert.getSigningString(options, '');

// console.log(signingString);

// Get the signature header

var signatureHeader = cert.getSignatureHeader(signingString);

options.headers.Signature = signatureHeader;

console.log(signingString);
console.log(signatureHeader);
console.log(options);

http
  .get(options, res => {
    let data = '';
    console.log('STATUS: ' + res.statusCode);
    console.log('HEADERS: ' + JSON.stringify(res.headers));
    res.setEncoding('utf8');
    res.on('data', function(chunk) {
      console.log('BODY: ' + chunk);
    });
    // A chunk of data has been recieved.
    //  res.on('data', chunk => {
    //    console.log('Receiving:' + chunk);
    //    data += chunk;
    // });

    // The whole response has been received. Print out the result.
    res.on('end', () => {
      console.log('Returned:' + data);
    });
  })
  .on('error', err => {
    console.log('Error: ' + err.message);
  });