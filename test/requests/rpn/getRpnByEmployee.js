//@ts-check
'use strict';

var Cert = require('../../../src/cert');

/**
 * GET /rpn/{employerRegistrationNumber}/{taxYear}/{employeeId}
 * @param {any} conf
 * @param {Cert} cert
 * @param {string} employeeId
 */
function getRpnByEmployee(conf, cert, employeeId) {
  var hostName = conf.host;
  var endPoint = `${conf.basePath}/rpn/${cert.epn}/${
    conf.year
  }/${employeeId}?softwareUsed=${encodeURIComponent(
    conf.softwareName
  )}&softwareVersion=${encodeURIComponent(conf.softwareVersion)}`;
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

module.exports = getRpnByEmployee;
