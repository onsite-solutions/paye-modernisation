//@ts-check
'use strict';

var config = require('../config/config');

/**
 * Wrapper for a https request conforming to the proposed Cavage HTTP Signature Header standard
 * @param {string} endpoint The API endpoint
 * @link https://tools.ietf.org/html/draft-cavage-http-signatures-08#section-4
 */
function Message(endpoint) {
  this.endpoint = endpoint;
}

// https://tools.ietf.org/html/draft-cavage-http-signatures-08#section-4

module.exports = Message;
