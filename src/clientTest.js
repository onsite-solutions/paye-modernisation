//@ts-check
'use strict';

var https = require('https');

var certs = require('./client/certs/certs');
var Cert = require('./cert');
var Config = require('../config/config');
var environments = require('../config/environments');
var Message = require('./message');

var checkPayrollRunComplete = require('../src/client/requests/payroll/checkPayrollRunComplete');
var createPayrollSubmission = require('../src/client/requests/payroll/createPayrollSubmission');
var createPayrollSubmissionPayload = require('../src/client/requests/payroll/createPayrollSubmissionPayload');

var rpn = require('../src/client/api/rpn');

var createNewRpn = require('../src/client/requests/rpn/createNewRpn');
var createNewRpnPayload = require('../src/client/requests/rpn/createNewRpnPayload');

var options;
var payload = '';

// Get config for the test environment
var config = environments.find(x => x.name === 'test').config;

// Fetch the digital certificate params from the certs array
var certParams = certs.find(c => c.id == 999963666); // or 999963665

// Create the Cert object
var cert = new Cert(
  certParams.id,
  certParams.epn,
  certParams.name,
  certParams.password
);

// Create a test message. Construct the options from our test/requests folder

// GET Look up RPN by Employer
// options = lookUpRpnByEmployer(conf, cert);

// GET Look up RPN by Employee
options = lookUpRpnByEmployee(config, cert, '7007162KA-');

// GET Check Payroll Run Complete
// options = checkPayrollRunComplete(conf, cert);

// POST Create Payroll Submission
//options = createPayrollSubmission(conf, cert, '1', '1');
//payload = JSON.stringify(createPayrollSubmissionPayload);

// POST Create New RPN
//options = createNewRpn(conf, cert);
//payload = JSON.stringify(createNewRpnPayload);

// Create the message object
var message;

if (options.method === 'GET') {
  message = new Message(options, cert);
} else if (options.method === 'POST') {
  message = new Message(options, cert, payload);
}

//console.log(payload);
//console.log(message.signingString);
//console.log(message.options);
console.log(payload);

// Create headers

options.headers.Signature = message.httpSignatureHeader;

//console.log(options.headers.Digest);
//console.log(message.headerString);
//console.log(message.signingString);

// console.log(options);

if (options.method === 'GET') {
  https
    .get(options, res => {
      let data = '';
      console.log('STATUS: ' + res.statusCode);
      //console.log('HEADERS: ' + JSON.stringify(res.headers));
      res.setEncoding('utf8');
      // A chunk of data has been recieved.
      res.on('data', chunk => {
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
} else if (options.method === 'POST') {
  var req = https.request(options, res => {
    let postResData = '';
    console.log(`StatusCode: ${res.statusCode}`);
    console.log(`Headers: ${JSON.stringify(res.headers)}`);
    res.setEncoding('utf8');
    res.on('data', chunk => {
      postResData += chunk;
    });
    res.on('end', () => {
      console.log(`RESPONSE: ${postResData}`);
    });
  });

  req.on('error', e => {
    console.error(e);
  });

  req.write(payload);
  //req.write(JSON.stringify(payload));
  req.end();
}
