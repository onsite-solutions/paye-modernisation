//@ts-check
'use strict';

const https = require('https');
const Message = require('./message');

//TODO: Test error handling

/**
 * Sends the provided Message object to ROS as a GET request
 * @param {Message} message
 */
function getMessage(message) {
  https
    .get(message.options, res => {
      let data = '';

      res.setEncoding('utf8');
      res.on('data', chunk => {
        data += chunk;
      });
      res.on('end', () => {
        return data;
      });
    })
    .on('error', err => {
      return err.message;
    });
}

/**
 * Sends the provided Message object to ROS as a POST request
 * @param {Message} message
 */
function postMessage(message) {
  var req = https
    .request(message.options, res => {
      let data = '';

      res.setEncoding('utf8');
      res.on('data', chunk => {
        data += chunk;
      });
      res.on('end', () => {
        return data;
      });
    })
    .on('error', err => {
      throw new Error(err.message);
    });

  req.write(message.payload);
  req.end();
}

module.exports = {
  getMessage,
  postMessage
};
