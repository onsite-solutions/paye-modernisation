//@ts-check

var api = require('./api');
var Message = require('../../message');

/**
 * GET /returns_reconciliation/{employerRegistrationNumber}
 *
 * Look up payroll by returns period based on a range of dates
 *
 * @param {string} employeeId
 */
function lookupPayrollByReturnPeriod(employeeId) {
  let { cert, config } = api.getCertAndConfig('test', 999963666); // or 999963665

  let hostName = config.host;
  let endPoint = `${config.basePath}/rpn/${cert.epn}/${
    config.year
  }/${employeeId}?softwareUsed=${encodeURIComponent(
    config.softwareName
  )}&softwareVersion=${encodeURIComponent(config.softwareVersion)}`;

  return new Message(api.options('GET', hostName, endPoint), cert);
}

module.exports = {
  lookupPayrollByReturnPeriod
};
