//@ts-check

var api = require('./api');
var Message = require('../../message');

/**
 * GET /rpn/{employerRegistrationNumber}/{taxYear}/{employeeId}
 *
 * Look up Revenue Payroll Notification (RPN) by employee
 *
 * @param {string} employeeId
 */
function lookupRpnByEmployee(employeeId) {
  let { cert, config } = api.getCertAndConfig('test', 999963666); // or 999963665

  let hostName = config.host;
  let endPoint = `${config.basePath}/rpn/${cert.epn}/${
    config.year
  }/${employeeId}?softwareUsed=${encodeURIComponent(
    config.softwareName
  )}&softwareVersion=${encodeURIComponent(config.softwareVersion)}`;

  return new Message(api.options('GET', hostName, endPoint), cert);
}

/**
 * GET rpn/{employerRegistrationNumber}/{taxYear}
 *
 * Look up Revenue Payroll Notification (RPN) by employer and optionally filter by date last updated and/or employee ids
 */
function lookUpRpnByEmployer() {
  let { cert, config } = api.getCertAndConfig('test', 999963666); // or 999963665

  let hostName = config.host;
  let endPoint = `${config.basePath}/rpn/${cert.epn}/${
    config.year
  }?softwareUsed=${encodeURIComponent(
    config.softwareName
  )}&softwareVersion=${encodeURIComponent(config.softwareVersion)}`;

  return new Message(api.options('GET', hostName, endPoint), cert);
}

module.exports = {
  lookupRpnByEmployee,
  lookUpRpnByEmployer
};
