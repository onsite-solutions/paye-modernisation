//@ts-check
'use strict';

var Cert = require('../../src/cert');

/**
 * Request options for testing a GET endpoint
 * @param {any} conf
 * @param {Cert} cert
 */
function testGet(conf, cert) {
  return {
    headers: {
      Method: 'GET',
      Path: `${conf.basePath}/${cert.epn}/2019/1/1`,
      Host: `${conf.host}`,
      Date: new Date().toUTCString(),
      Signature: null
    }
  };
}

module.exports = testGet;
