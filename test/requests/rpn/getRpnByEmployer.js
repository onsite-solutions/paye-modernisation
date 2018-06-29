//@ts-check
'use strict';

var Cert = require('../../../src/cert');

/**
 * GET rpn/{employerRegistrationNumber}/{taxYear}
 * @param {any} conf
 * @param {Cert} cert
 */
function getRpnByEmployer(conf, cert) {
  var hostName = conf.host;
  var endPoint = `${conf.basePath}/rpn/${cert.epn}/${
    conf.year
  }?softwareUsed=${encodeURIComponent(
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

module.exports = getRpnByEmployer;
