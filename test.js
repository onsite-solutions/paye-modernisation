const md5 = require('md5');
const atob = require('atob');
const btoa = require('btoa');
var forge = require('node-forge');
var fs = require('fs');
var certs = require('./digital-certs/certs');
var https = require('https');
var sign = require('./sign');

// Signature String Components


var signingString; // string to be signed consists of all the above headers fields
var signature;

// Fetch the digital certificate from the certs array

var cert = certs.find(c => c.id == '999963666'); // or 999963665

// console.log(cert.id + ' ' + cert.epn);

// Set the Header component values

//https://softwaretest.ros.ie/paye-employers/v1/rest/rpn/{employerRegistrationNumber}/{taxYear}
// 8000135UH/2019

var headers = {
  Method: 'GET',
  Path: '/paye-employers/v1/rest/rpn/' + cert.epn + '/' + 2019,
  Host: 'softwaretest.ros.ie',
  Date: new Date().toUTCString(),
  Signature: ''
};

//body = { Test: 'test' };

var method = 'GET';
var target = '/paye-employers/v1/rest/rpn' + cert.epn + '/' + 2018;
//var target = '/v1/rest/rpn/' + cert.epn + '/' + 2018;

// Get the MD5 hash of the password
var hashedPwd = sign.getMd5Hash(cert.password);

// Get the details from the cert

var keys = sign.extractKeys(hashedPwd, cert.id);

if (method === 'POST') {
  headers.Digest = sign.getDigest(body, keys.privateKey);
}

signingString = sign.getSigningString(headers, method, target, '');
//console.log(signingString);

// Get the HTTP Signature Header

var signatureHeader = sign.getHttpSignatureHeader(
  signingString,
  keys.privateKey,
  keys.publicKey,
  keys.certificate
);

headers.Signature = signatureHeader;

// md5 src: https://stackoverflow.com/a/33486055/7519287

// console.log(hashed);

var options = {
  hostname: 'softwaretest.ros.ie',
  path: target,
  //path: '/paye-employers/v1/rest/rpn/8000135UH/2019?softwareUsed=SOftwareABC&softwareVersion=1',
  method: 'GET',
  headers: headers
};

console.log(options);

if (method === 'GET') {
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
      // res.on('data', chunk => {
      //   console.log('Receiving:' + chunk);
      //   data += chunk;
      // });

      // The whole response has been received. Print out the result.
      res.on('end', () => {
        console.log('Returned:' + data);
      });
    })
    .on('error', err => {
      console.log('Error: ' + err.message);
    });
} else if (method === 'POST') {
  options = {
    hostname: 'softwaretest.ros.ie',
    path:
      '/paye-employers/v1/rest/rpn/8000135UH/2019?softwareUsed=SOftwareABC&softwareVersion=1',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  };

  var req = https.request(options, res => {
    //console.log('statusCode:', res.statusCode);
    //console.log('headers:', res.headers);

    res.on('data', d => {
      console.log(d);
    });
  });

  req.on('error', e => {
    console.log(e);
  });

  req.write(JSON.stringify(body));
  req.end();
}

//console.log(req.body);

// 'https://softwaretest.ros.ie/paye-employers/v1/rest/rpn/8000135UH/2018'
//* uncomment this for testing, don't want to send request to revenue on every save
/*/

/*
var y = https.request('https://softwaretest.ros.ie/paye-employers/v1/rest/rpn/8000135UH/2018', function(res){
  console.log("Connected");
  res.on('data',function(data){
    console.log(data);
  });
});
/*
var x = https.request(header,function(res){
  console.log("Connected");
  res.on('data',function(data){
    console.log(data);
  });
});
x.end();
*/
// console.log(pk);
