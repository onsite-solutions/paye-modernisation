//@ts-check
'use strict';

const https = require('https');
const Message = require('./message');

//TODO: Test error handling

/**
 * Sends the provided Message object to ROS as a GET request
 * @param {Message} message
 */
function get(message) {
  // TESTING REJECTION: message.options.headers.Signature = null;
  return new Promise((resolve, reject) => {
    https
      .get(message.options, res => {
        let data = '';

        res.setEncoding('utf8');
        res.on('data', chunk => {
          data += chunk;
        });
        res.on('end', () => {
          if (res.statusCode === 200) {
            resolve(data);
          } else {
            reject({ statusCode: res.statusCode, message: data });
          }
        });
      })
      .on('error', err => {
        reject(err);
      });
  });
}

/**
 * Sends the provided Message object to ROS as a POST request
 * @param {Message} message
 */
function post(message) {
  return new Promise((resolve, reject) => {
    var req = https
      .request(message.options, res => {
        let data = '';

        res.setEncoding('utf8');
        res.on('data', chunk => {
          data += chunk;
        });
        res.on('end', () => {
          resolve(data);
        });
      })
      .on('error', err => {
        reject(Error(err.message));
      });

    req.write(message.payload);
    req.end();
  });
}

module.exports = {
  get,
  post
};
