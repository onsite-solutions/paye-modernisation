const md5 = require('md5');
const btoa = require('btoa');
var forge = require('node-forge');
var fs = require('fs');
var crypto = require('crypto');
const constants = require('constants');

// scr: http://stackoverflow.com/questions/37833952/getting-the-private-key-from-p12-file-using-javascript
function extractPrivateKey(pwd, certId) {
  var keyFile = fs.readFileSync('digital-certs/' + certId + '.p12');
  var keyBase64 = keyFile.toString('base64');

  var p12Der = forge.util.decode64(keyBase64);

  var p12Asn1 = forge.asn1.fromDer(p12Der);
  var p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, pwd);
  //http://stackoverflow.com/questions/17182848/best-approch-to-decode-the-pkcs12-file-and-get-the-encrypted-private-key-from-it
  // get bags by type
  var certBags = p12.getBags({ bagType: forge.pki.oids.certBag });
  var pkeyBags = p12.getBags({ bagType: forge.pki.oids.pkcs8ShroudedKeyBag });
  // fetching certBag
  var certBag = certBags[forge.pki.oids.certBag][0];
  // fetching keyBag
  var keybag = pkeyBags[forge.pki.oids.pkcs8ShroudedKeyBag][0];
  // generate pem from private key
  var privateKeyPem = forge.pki.privateKeyToPem(keybag.key);
  // generate pem from cert
  var certificate = forge.pki.certificateToPem(certBag.cert);
  return privateKeyPem;
}

// scr: http://stackoverflow.com/questions/37833952/getting-the-private-key-from-p12-file-using-javascript
function extractPublicKey(pwd, certId) {
  var keyFile = fs.readFileSync('digital-certs/' + certId + '.p12');
  var keyBase64 = keyFile.toString('base64');

  var p12Der = forge.util.decode64(keyBase64);

  var p12Asn1 = forge.asn1.fromDer(p12Der);
  var p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, pwd);
  //http://stackoverflow.com/questions/17182848/best-approch-to-decode-the-pkcs12-file-and-get-the-encrypted-private-key-from-it
  // get bags by type
  var certBags = p12.getBags({ bagType: forge.pki.oids.certBag });
  var pkeyBags = p12.getBags({ bagType: forge.pki.oids.pkcs8ShroudedKeyBag });
  // fetching certBag
  var certBag = certBags[forge.pki.oids.certBag][0];
  // fetching keyBag
  var keybag = pkeyBags[forge.pki.oids.pkcs8ShroudedKeyBag][0];
  // generate pem from private key
  var privateKeyPem = forge.pki.privateKeyToPem(keybag.key);
  // generate pem from cert
  var certificate = forge.pki.certificateToPem(certBag.cert);
  return certificate;
}

function isEmpty(value) {
  return (
    value === undefined ||
    value === null ||
    (typeof value === 'object' && Object.keys(value).length === 0) ||
    (typeof value === 'string' && value.trim().length === 0)
  );
}

// Gets the string to be signed as part of the Signature String Construction
function getSigningString(header) {
  // (request-target)
  var result = header.method + ' ' + header.path + '\n';
  // host
  result += header.host + '\n';
  // date
  result += header.date + '\n';
  // digest
  if (!isEmpty(header.digest)) {
    result += header.digest + '\n';
  }

  return result;
}

function getHttpSignatureHeader(
  signingString,
  privateKey,
  publicKey,
  cert,
  pwd
) {
  // keyId
  var result = 'Signature: keyId="' + forge.util.encode64(publicKey) + '",';
  // algorithm
  result += 'algorithm="rsa-sha512",';
  // headers
  result += 'headers="(request-target) host date",';
  //result += 'headers="(request-target) host date digest",'
  // signature

 // var signature = crypto.privateEncrypt(
 //   privateKey,
 //   new Buffer(signingString, 'base64')
 // );

  // var key = publicKey.toString('base64');
  var sign = crypto.createSign('RSA-SHA256');
  sign.update(signingString);
  var signature = sign.sign(privateKey, 'base64');

  result += 'signature="' + forge.util.encode64(signature) + '"';

  return result;
}

// src: http://stackoverflow.com/a/3745677/3181933
function hex2a(hexx) {
  var hex = hexx.toString(); //force conversion
  var str = '';
  for (var i = 0; i < hex.length; i += 2)
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  return str;
}

function getMd5Hash(value) {
  return btoa(hex2a(md5(value)));
}

module.exports = {
  extractPrivateKey,
  extractPublicKey,
  getSigningString,
  getHttpSignatureHeader,
  hex2a,
  getMd5Hash
};
