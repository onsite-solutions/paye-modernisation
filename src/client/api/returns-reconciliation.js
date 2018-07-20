//@ts-check

var api = require('./api');
var Message = require('../../message');

/**
 * GET /returns_reconciliation/:employerRegistrationNumber
 *
 * Look up payroll by returns period based on a range of dates
 *
 * @param {string} startDate Period start date e.g. 01/01/2019
 * @param {string} endDate Period end date e.g. 31/01/2019
 */
function lookupPayrollByReturnPeriod(startDate, endDate) {
  let { cert, config } = api.getCertAndConfig();

  let hostName = config.host;
  let endPoint = `${config.basePath}/returns_reconciliation/${
    cert.epn
  }?periodStartDate=${startDate}&periodEndDate=${endDate}&softwareUsed=${
    config.softwareName
  }&softwareVersion=${config.softwareVersion}`;

  return new Message(api.options('GET', hostName, endPoint), cert);
}

module.exports = {
  lookupPayrollByReturnPeriod
};
