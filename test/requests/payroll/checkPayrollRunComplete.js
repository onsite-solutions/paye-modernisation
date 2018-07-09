//@ts-check
'use strict';

var Cert = require('../../../src/cert');

/**
 * GET https://softwaretest.ros.ie/paye-employers/v1/rest/payroll/{employerRegistrationNumber}/{taxYear}/{payrollRunReference}
 *
 * Check that the processing of a payroll run is completed
 *
 * @param {any} conf
 * @param {Cert} cert
 */
function checkPayrollRunComplete(conf, cert) {
  var hostName = conf.host;
  var endPoint = `${conf.basePath}/payroll/${cert.epn}/${
    conf.year
  }/1?softwareUsed=${encodeURIComponent(
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

module.exports = checkPayrollRunComplete;
