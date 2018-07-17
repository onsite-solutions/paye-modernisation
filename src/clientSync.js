//@ts-check
'use strict';

const requestPromise = require('request-promise');
const Message = require('./message');

/**
 * Sends the provided Message object to ROS as a GET request
 * @param {Message} message
 */
function getMessage(message) {
  return requestPromise(message.options)
    .then(res => {
      return JSON.parse(res);
    })
    .catch(err => {
      return err;
    });
}

module.exports = {
  getMessage
};
