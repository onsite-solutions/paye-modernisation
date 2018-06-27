//@ts-check
'use strict';

var Cert = require('../../src/cert');

/**
 * Request options for testing a POST endpoint
 * @param {any} conf
 * @param {Cert} cert
 * @param {any} payload
 */
function getOptions(conf, cert, payload) {
  var result = {
    hostname: `${conf.host}`,
    path: `${conf.basePath}/${cert.epn}/${conf.year}`,
    method: 'POST',
    headers: {
      Method: 'POST',
      Path: `${conf.basePath}/${cert.epn}/2019/1/1`,
      Host: `${conf.host}`,
      Date: new Date().toUTCString(),
      'Content-Type': 'application/json;charset=UTF-8',
      Digest: null,
      Signature: null
    },
    form: payload
  };

  return result;
}

module.exports = getOptions;
