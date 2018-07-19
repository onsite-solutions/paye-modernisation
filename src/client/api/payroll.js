//@ts-check

var api = require('./api');
var Message = require('../../message');

/**
 * POST /payroll/:employerRegistrationNumber/:taxYear/:payrollRunReference/:submissionID
 *
 * Create a payroll submission
 *
 * @param {string} payrollRunReference
 * @param {string} submissionId
 */
function createPayrollSubmission(payrollRunReference, submissionId, payload) {
  let { cert, config } = api.getCertAndConfig('test', 999963666); // or 999963665

  let hostName = config.host;
  let endPoint = `${config.basePath}/payroll/${cert.epn}/${
    config.year
  }/${payrollRunReference}/${submissionId}?softwareUsed=${encodeURIComponent(
    config.softwareName
  )}&softwareVersion=${encodeURIComponent(config.softwareVersion)}`;

  return new Message(api.options('POST', hostName, endPoint), cert, payload);
}

module.exports = {
  createPayrollSubmission
};
