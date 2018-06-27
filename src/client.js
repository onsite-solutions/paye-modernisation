//@ts-check
'use strict';

var request = require('request');
var https = require('https');

var certs = require('../test/certs');
var Cert = require('./cert');
var config = require('../config/config');
var Message = require('./message');

var testGet = require('../test/requests/testGet');
var testPost = require('../test/requests/testPost');
var testPostPayload = require('../test/requests/testPostPayload');

// Get config for the test environment
var conf = config.find(x => x.env === 'test');

// Fetch the digital certificate from the certs array
var cer = certs.find(c => c.id == 999963666); // or 999963665

// Create the Cert object
var cert = new Cert(cer.id, cer.epn, cer.name, cer.password);

// Create a test GET message. Fetch the options from our test/requests folder
var options = testGet(conf, cert);

// Create the message object
var message = new Message(options, cert);

console.log(message.signingString);
//console.log(message.headerString);

// Create headers

options.headers.Signature = message.httpSignatureHeader;

//console.log(signatureHeader);
//console.log(options);
/*
request()
  .then(function(res) {
    // Handle the response
  })
  .catch(function(err) {
    // Deal with the error
  });
*/

console.log(options);

https
  .get(options, res => {
    let data = '';
    console.log('STATUS: ' + res.statusCode);
    console.log('HEADERS: ' + JSON.stringify(res.headers));
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
