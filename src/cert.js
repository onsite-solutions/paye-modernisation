//@ts-check
'use strict';

var forge = require('node-forge');
var fs = require('fs');
var crypto = require('crypto');

/**
 * Represents a Digital certificate
 * @param {string} id Digital certificate identification number
 * @param {string} epn
 * @param {string} name Employer name
 * @param {string} password Password for the Digital certificate
 */
function Cert(id, epn, name, password) {
  this.id = id;
  this.epn = epn;
  this.name = name;
  this.password = password;

  this.keyStoreFilePath = `./src/client/certs/${this.id}.p12`;

  // Get the MD5 hash of the password
  this.hashedPassword = this.getHashedPassword(password);

  // set the keyStore object
  this.pkcs12KeyStore = this.openKeyStore(
    this.keyStoreFilePath,
    this.hashedPassword
  );

  // Set the certificate and private key
  let keys = this.getCertificateAndKeyFromKeyStore(this.pkcs12KeyStore);

  this.certificate = keys.certificate;
  this.privateKey = keys.privateKey;

  // Get the encoded certificate (keyId component of the signing string)
  this.keyId = this.encodeCertificate(this.certificate);
}

/**
 * Converts the customer password to an MD5 hashed password that can open a PKCS#12 file
 * @param {string} password The customer password to be converted
 * @link https://gist.github.com/RevenueGitHubAdmin/17073ac5724d19c69d950b76f41fa0fa
 */
Cert.prototype.getHashedPassword = function(password) {
  return forge.util.encode64(
    forge.md.md5
      .create()
      .update(password)
      .digest()
      .getBytes()
  );
};

/**
 * Gets the PKCS#12 KeyStore from the .p12 file
 * @param {string} keyStoreFilePath
 * @param {string} hashedPassword
 * @link https://gist.github.com/RevenueGitHubAdmin/325b4f3451529a2cf29c646596e99b5f
 */
Cert.prototype.openKeyStore = function(keyStoreFilePath, hashedPassword) {
  var asn1 = forge.asn1.fromDer(fs.readFileSync(keyStoreFilePath, 'binary'));

  return forge.pkcs12.pkcs12FromAsn1(asn1, hashedPassword);
};

/**
 * Get the certificate and private key from the PKCS#12 KeyStore file
 * @param {any} pkcs12KeyStore The PKCS#12 KeyStore object
 * @link https://gist.github.com/RevenueGitHubAdmin/8e63418835e1eb12c67169e532bed599
 */
Cert.prototype.getCertificateAndKeyFromKeyStore = function(pkcs12KeyStore) {
  var certificateBag = pkcs12KeyStore.getBags({
    bagType: forge.pki.oids.certBag
  });
  var privateKeyBag = pkcs12KeyStore.getBags({
    bagType: forge.pki.oids.pkcs8ShroudedKeyBag
  });
  var certificate = certificateBag[forge.pki.oids.certBag][0].cert;
  var privateKey = privateKeyBag[forge.pki.oids.pkcs8ShroudedKeyBag][0].key;

  return {
    certificate: certificate,
    privateKey: privateKey
  };
};

/**
 * Encodes the binary representation of the certificate into a Base 64 string
 * @param {any} certificate
 * @link https://gist.github.com/RevenueGitHubAdmin/c7191d975599e381c45f21782305d06d
 */
Cert.prototype.encodeCertificate = function(certificate) {
  return forge.util.encode64(
    //@ts-ignore
    forge.asn1.toDer(forge.pki.certificateToAsn1(certificate)).getBytes()
  );
};

/**
 * Signs the provided string with the with the private key and rsa-sha512 algorithm and returns a base 64 encoded string
 * @param {string} signingString The string to be signed with th
 */
Cert.prototype.signStringWithPrivateKey = function(signingString) {
  var sign = crypto.createSign('RSA-SHA512');
  sign.update(signingString);
  return sign.sign(forge.pki.privateKeyToPem(this.privateKey), 'base64');
};

module.exports = Cert;
