//@ts-check
'use strict';

var request = require('request');

var certs = require('../test/certs');
var Cert = require('./cert');
var config = require('../config/config');
/*
Following response from ROS this is a verbatim attempt to replicate their sample 'successful request' file.
Where there are contradictions between their documentation, the Cavage documentation and the sample file, 
the approach taken in the sample file will take precedence.
*/

// Get config for the test environment
var conf = config.find(x => x.env === 'test');

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
  host: conf.host,
  headers: {
    Method: 'GET',
    Path: `${conf.pathRoot}${
      cert.epn
    }/${2018}?softwareUsed=SOftwareABC&softwareVersion=1.0.0`,
    Date: new Date().toUTCString(),
    'Content-Type': 'application/json;charset=UTF-8',
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

//console.log(signingString);
//console.log(signatureHeader);
//console.log(options);

request
  .get(options, res => {
    let data = '';
    //console.log('STATUS: ' + res.statusCode);
    //console.log('HEADERS: ' + JSON.stringify(res.headers));
    res.setEncoding('utf8');
    //res.on('data', function(chunk) {
    //console.log('BODY: ' + chunk);
    //});
    // A chunk of data has been recieved.
    res.on('data', chunk => {
      //console.log('Receiving:' + chunk);
      data += chunk;
    });

    // The whole response has been received. Print out the result.
    res.on('end', () => {
      console.log(data);
    });
  })
  .on('error', err => {
    console.log('Error: ' + err.message);
  });
