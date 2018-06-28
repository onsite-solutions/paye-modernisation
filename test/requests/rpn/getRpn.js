//@ts-check
'use strict';

var Cert = require('../../../src/cert');

/**
 * GET https://softwaretest.ros.ie/paye-employers/v1/rest/rpn/{employerRegistrationNumber}/{taxYear}
 * @param {any} conf
 * @param {Cert} cert
 */
function getRpn(conf, cert) {
  var hostName = conf.host;
  var endPoint = `${conf.basePath}/rpn/${cert.epn}/${
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

module.exports = getRpn;
