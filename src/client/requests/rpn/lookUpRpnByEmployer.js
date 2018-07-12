//@ts-check
'use strict';

var Cert = require('../../../cert');

/**
 * GET rpn/{employerRegistrationNumber}/{taxYear}
 *
 * Look up Revenue Payroll Notification (RPN) by employer and optionally filter by date last updated and/or employee ids
 *
 * @param {any} conf
 * @param {Cert} cert
 */
function lookUpRpnByEmployer(conf, cert) {
  var hostName = conf.host;
  var endPoint = `${conf.basePath}/rpn/${cert.epn}/${
    conf.year
  }?softwareUsed=${encodeURIComponent(
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

module.exports = lookUpRpnByEmployer;
