//@ts-check
'use strict';

var Cert = require('../../../src/cert');

/**
 * POST https://softwaretest.ros.ie/paye-employers/v1/rest/payroll/{employerRegistrationNumber}/{taxYear}/{payrollRunReference}/{submissionID}
 *
 * Create a payroll submission
 *
 * @param {any} conf
 * @param {Cert} cert
 * @param {string} payrollRunReference
 * @param {string} submissionId
 */
function createPayrollSubmission(
  conf,
  cert,
  payrollRunReference,
  submissionId
) {
  var hostName = conf.host;
  var endPoint = `${conf.basePath}/payroll/${cert.epn}/${
    conf.year
  }/${payrollRunReference}/${submissionId}?softwareUsed=${encodeURIComponent(
    conf.softwareName
  )}&softwareVersion=${encodeURIComponent(conf.softwareVersion)}`;
  var utcDate = new Date().toUTCString();

  var result = {
    hostname: hostName,
    path: endPoint,
    method: 'POST',
    headers: {
      Method: 'POST',
      Path: endPoint,
      Host: hostName,
      Date: utcDate,
      'Content-Type': 'application/json',
      Digest: null,
      Signature: null
    }
  };

  return result;
}

module.exports = createPayrollSubmission;
