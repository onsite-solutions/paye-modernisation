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
    hostname: `${conf.host}`,
    path: `${conf.basePath}/${cert.epn}/${conf.year}`,
    method: 'GET',
    headers: {
      Method: 'GET',
      Path: `${conf.basePath}/${cert.epn}/${conf.year}`,
      Host: `${conf.host}`,
      Date: new Date().toUTCString(),
      Signature: null
    }
  };
}

module.exports = testGet;
