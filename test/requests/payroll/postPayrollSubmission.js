//@ts-check
'use strict';

var Cert = require('../../../src/cert');

/**
 * POST https://softwaretest.ros.ie/paye-employers/v1/rest/payroll/{employerRegistrationNumber}/{taxYear}/{payrollRunReference}/{submissionID}
 * @param {any} conf
 * @param {Cert} cert
 * @param {string} payrollRunReference
 * @param {string} submissionId
 */
function postPayrollSubmission(conf, cert, payrollRunReference, submissionId) {
  var hostName = conf.host;
  var endPoint = `${conf.basePath}/payroll/${cert.epn}/${
    conf.year
  }/${payrollRunReference}/${submissionId}?softwareUsed=${encodeURIComponent(
    'xyz'
  )}&softwareVersion=${encodeURIComponent('1.0')}`;
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

module.exports = postPayrollSubmission;
