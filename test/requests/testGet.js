//@ts-check
'use strict';

var Cert = require('../../src/cert');

/**
 * Request options for testing a GET endpoint
 * @param {any} conf
 * @param {Cert} cert
 */
function testGet(conf, cert) {
  var hostName = conf.host;
  var endPoint = `${conf.basePath}/payroll/${cert.epn}/${
    conf.year
  }/1?softwareUsed=${encodeURIComponent(
    'xyz'
  )}&softwareVersion=${encodeURIComponent('1.0')}`;
  var utcDate = new Date().toUTCString();

  return {
    hostname: hostName,
    path: endPoint,
    method: 'GET',
    headers: {
      Method: 'GET',
      Path: endPoint,
      Host: hostName,
      Date: utcDate,
      Signature: null
    }
  };
}

module.exports = testGet;
