const CryptoJS = require('crypto-js');
const md5 = require('md5');
const hasha = require('hasha');

/*
Each customer of ROS will have a digital certificate and private key stored in an industry standard
PKCS#12 file.
In order to create a digital signature, the private key of the customer must be accessed. A password
is required to retrieve the private key from the P12 file. This password can be obtained by prompting
the user for their password.
The password on the P12 is not the same as the password entered by the customer. It is in fact the
MD5 hash of that password, followed by the Base64-encoding of the resultant bytes.
To calculate the hashed password, follow these steps:
1. First get the bytes of the original password, assuming a "Latin-1" encoding. For the password
"Password123", these bytes are: 80 97 115 115 119 111 114 100 49 50 51(i.e. the value of
"P" is 80, "a" is 97, etc.).
2. Then get the MD5 hash of these bytes. MD5 is a standard, public algorithm. Once again, for
the password "Password123" these bytes work out as: 66 -9 73 -83 -25 -7 -31 -107 -65 71 95
55 -92 76 -81 -53.
3. Finally, create the new password by Base64-encoding the bytes from the previous step. For
example, the password, "Password123" this is “QvdJref54ZW/R183pEyvyw==”.
This new password can then be used to open a standard ROS P12 file.
*/

// The password on the P12 is not the same as the password entered by the customer. It is in fact the MD5 hash of that password, followed by the Base64-encoding of the resultant bytes. To calculate the hashed password, follow these steps:

// First get the bytes of the original password, assuming a "Latin-1" encoding:
/*
var byteBuffer = [];
const password = 'Password123'; // af4eb226
var buffer1 = new Buffer(password, 'latin1');
for (var i = 0; i < buffer1.length; i++) {
  byteBuffer.push(buffer1[i]);
}

console.log(byteBuffer);
*/

var byteArray = [];
const password = 'Password123'; // af4eb226
var buffer = new Buffer(password, 'latin1');
for (var i = 0; i < buffer.length; i++) {
  byteArray.push(buffer[i]);
}

console.log(byteArray);

// Then get the MD5 hash of these bytes

console.log(CryptoJS.md5.encrypt('Password123'));

CryptoJS.md5.H;

for (var i = 0; i < byteArray.length; i++) {
  console.log(byteArray[i]);
  console.log(md5(byteArray[i]));
}

//var md5Buffer = hasha(byteBuffer, { encoding: 'latin1', algorithm: 'md5' });

//var md5Buffer = CryptoJS.Buffer.md5Buffer(byteBuffer);

//console.log(md5Buffer);

/*

var password = 'af4eb226';
var data = [{ id: 1 }, { id: 2 }];

// Encrypt
var ciphertext = CryptoJS.MD5.encrypt(JSON.stringify(data), password);

// Decrypt
var bytes = CryptoJS.MD5.decrypt(ciphertext.toString(), password);
var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Latin1));

console.log(decryptedData);

const port = 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
*/
