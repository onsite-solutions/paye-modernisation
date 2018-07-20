//@ts-check

var api = require('./api');
var Message = require('../../message');
var utils = require('../../utils');

/**
 * GET /rpn/:employerRegistrationNumber/:taxYear
 *
 * Look up Revenue Payroll Notification (RPN) by employer and optionally filter by date last updated and/or employee ids
 *
 * @param {any} dateLastUpdated Look for RPN updated on or since a given date (YYYY-MM-DD)
 * @param {string[]} employeeIds Look up multiple employees at once
 */
function lookUpRpnByEmployer(dateLastUpdated = null, employeeIds = null) {
  let { cert, config } = api.getCertAndConfig();

  let endpoint = `${config.basePath}/rpn/${cert.epn}/${config.year}?`;

  if (!utils.isEmpty(dateLastUpdated)) {
    endpoint += `dateLastUpdated=${dateLastUpdated}&`;
  }

  endpoint += `softwareUsed=${config.softwareName}&softwareVersion=${
    config.softwareVersion
  }`;

  //TODO: test array functionality
  if (!utils.isEmpty(employeeIds)) {
    console.log(employeeIds);
    endpoint += `&employeeIDs=${employeeIds}`;
  }

  return new Message(api.options('GET', config.host, endpoint), cert);
}

/**
 * POST /rpn/:employerRegistrationNumber/:taxYear
 *
 * Create new RPN
 *
 * @param {any} payload
 */
function createNewRpn(payload) {
  let { cert, config } = api.getCertAndConfig();

  let endpoint = `${config.basePath}/rpn/${cert.epn}/${
    config.year
  }?softwareUsed=${config.softwareName}&softwareVersion=${
    config.softwareVersion
  }`;

  return new Message(api.options('POST', config.host, endpoint), cert, payload);
}

/**
 * GET /rpn/:employerRegistrationNumber/:taxYear/:employeeId
 *
 * Look up Revenue Payroll Notification (RPN) by employee
 *
 * @param {string} employeeId
 */
function lookupRpnByEmployee(employeeId) {
  let { cert, config } = api.getCertAndConfig();

  let endpoint = `${config.basePath}/rpn/${cert.epn}/${
    config.year
  }/${employeeId}?softwareUsed=${config.softwareName}&softwareVersion=${
    config.softwareVersion
  }`;

  return new Message(api.options('GET', config.host, endpoint), cert);
}

module.exports = {
  lookUpRpnByEmployer,
  lookupRpnByEmployee,
  createNewRpn
};
