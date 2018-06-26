//@ts-check
'use strict';

var request = require('request');

var certs = require('../test/certs');
var Cert = require('./cert');
var config = require('../config/config');
var Message = require('./message');

var testBody = require('../test/requests/testBody');

/*
Following response from ROS this is a verbatim attempt to replicate their sample 'successful request' file.
Where there are contradictions between their documentation, the Cavage documentation and the sample file, 
the approach taken in the sample file will take precedence.
*/

// Get config for the test environment
var conf = config.find(x => x.env === 'test');

// Fetch the digital certificate from the certs array
var certParams = certs.find(c => c.id == 999963666); // or 999963665

// Create the Cert object
var cert = new Cert(
  certParams.id,
  certParams.epn,
  certParams.name,
  certParams.password
);

// Create options
var options = {
  headers: {
    Method: 'GET',
    Path: `${conf.basePath}/${cert.epn}/2019/1/1`,
    Host: `${conf.host}`,
    Date: new Date().toUTCString(),
    'Content-Type': 'application/json;charset=UTF-8',
    // Digest: '',
    Signature: ''
  }
  // form: testBody
};

// Create the message object
var message = new Message(options, cert);

console.log(message.signingString);
// console.log(message.headerString);

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
  */
