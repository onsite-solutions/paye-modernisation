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
  let { cert, config } = api.getCertAndConfig();

  let endPoint = `${config.basePath}/payroll/${cert.epn}/${
    config.year
  }/${payrollRunReference}/${submissionId}?softwareUsed=${
    config.softwareName
  }&softwareVersion=${config.softwareVersion}`;
  console.log(payload);
  console.log(endPoint);
  return new Message(api.options('POST', config.host, endPoint), cert, payload);
}

/**
 * GET /payroll/:employerRegistrationNumber/:taxYear/:payrollRunReference/:submissionID
 *
 * Check the current status of a payroll submission
 *
 * @param {string} payrollRunReference
 * @param {string} submissionId
 */
function checkPayrollSubmission(payrollRunReference, submissionId) {
  let { cert, config } = api.getCertAndConfig();

  let endPoint = `${config.basePath}/payroll/${cert.epn}/${
    config.year
  }/${payrollRunReference}/${submissionId}?softwareUsed=${
    config.softwareName
  }&softwareVersion=${config.softwareVersion}`;

  return new Message(api.options('GET', config.host, endPoint), cert);
}

/**
 * GET /payroll/:employerRegistrationNumber/:taxYear/:payrollRunReference
 *
 * Check the current status of a payroll run
 *
 * @param {string} payrollRunReference
 */
function checkPayrollRun(payrollRunReference) {
  let { cert, config } = api.getCertAndConfig();

  let endPoint = `${config.basePath}/payroll/${cert.epn}/${
    config.year
  }/${payrollRunReference}?softwareUsed=${
    config.softwareName
  }&softwareVersion=${config.softwareVersion}`;

  return new Message(api.options('GET', config.host, endPoint), cert);
}

module.exports = {
  createPayrollSubmission,
  checkPayrollSubmission,
  checkPayrollRun
};
