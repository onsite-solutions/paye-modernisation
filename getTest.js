var forge = require('node-forge');
var fs = require('fs');
var certs = require('./digital-certs/certs');
var https = require('https');
var signer = require('./signer');

/*
Simple as possible GET request for the following endpoint:
https://softwaretest.ros.ie/paye-employers/v1/rest/rpn/8000135UH/2018?softwareUsed=abc&softwareVersion=1.0
*/

// Fetch the digital certificate from the certs array
var cert = certs.find(c => c.id == '999963666'); // or 999963665

var options = {
  method: 'GET',
  path: '/paye-employers/v1/rest/rpn/' + cert.epn + '/' + 2019,
  host: 'softwaretest.ros.ie',
	date: new Date().toUTCString(),
	headers: {
		Signature: ''
	}
};

// Build the plaintext signing string from the headers

var signingString = signer.getSigningString(options, '');

// console.log(signingString);

// Get the MD5 hash of the password
var hashedPwd = signer.getMd5Hash(cert.password);

// Get the details from the cert
var keys = signer.extractKeys(hashedPwd, cert.id);

// Get the signature header

var signatureHeader = signer.getHttpSignatureHeader(signingString, keys);

options.headers = {
	Signature: signatureHeader
}

console.log(options);

https
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
		