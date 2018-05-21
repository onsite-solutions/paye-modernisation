const express = require('express');
const expressOpenApi = require('express-openapi');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const CryptoJS = require('crypto-js');

const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// DB Config
//const db = require('./config/keys').mongoURI;

// Connect to MongoDB
//mongoose
//.connect(db)
//.then(() => console.log('MongoDB connected'))
//.catch(err => console.log(err));

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
