//@ts-check
'use strict';

var https = require('https');

var certs = require('../test/certs');
var Cert = require('./cert');
var config = require('../config/config');
var Message = require('./message');

var getPayrollRun = require('../test/requests/payroll/getPayrollRun');
var postPayrollSubmission = require('../test/requests/payroll/postPayrollSubmission');
var postPayrollSubmissionPayload = require('../test/requests/payroll/postPayrollSubmissionPayload');

var getRpnByEmployee = require('../test/requests/rpn/getRpnByEmployee');
var getRpnByEmployer = require('../test/requests/rpn/getRpnByEmployer');

var postRpnNew = require('../test/requests/rpn/postRpnNew');
var postRpnNewPayload = require('../test/requests/rpn/postRpnNewPayload');

var options;
var payload = '';

// Get config for the test environment
var conf = config.find(x => x.env === 'test');

// Fetch the digital certificate from the certs array
var cer = certs.find(c => c.id == 999963666); // or 999963665

// Create the Cert object
var cert = new Cert(cer.id, cer.epn, cer.name, cer.password);

// Create a test message. Construct the options from our test/requests folder

// GET Look up RPN by Employer
// options = getRpnByEmployer(conf, cert);

// GET Look up RPN by Employee
options = getRpnByEmployee(conf, cert, '7007162KA-');

// GET Check Payroll Run
// options = getPayrollRun(conf, cert);

// POST Payroll Submission
//options = postPayrollSubmission(conf, cert, '1', '1');
//payload = JSON.stringify(postPayrollSubmissionPayload);

// POST RPN New Employee
//options = postRpnNew(conf, cert);
//payload = JSON.stringify(postRpnNewPayload);

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
