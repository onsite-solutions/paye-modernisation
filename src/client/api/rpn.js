//@ts-check

var Cert = require('../../cert');
var certs = require('../certs/certs');
var Config = require('../../../config/config');
var environments = require('../../../config/environments');
var Message = require('../../message');

/**
 * Returns the digital certificate and the environment configuration
 *
 * @param {string} envName Environment name (e.g. test)
 * @param {number} certId The digital certificate identification number
 */
function getCertAndConfig(envName, certId) {
  let config = environments.find(x => x.name === envName).config;
  let params = certs.find(c => c.id === certId);
  let cert = new Cert(params.id, params.epn, params.name, params.password);

  return { cert, config };
}

/**
 *
 * @param {string} method
 * @param {string} hostName
 * @param {string} endPoint
 */
function options(method, hostName, endPoint) {
  let utcDate = new Date().toUTCString();

  return {
    uri: `https://${hostName}/${endPoint}`,
    hostname: hostName,
    path: endPoint,
    method: method,
    headers: {
      Method: method,
      Path: endPoint,
      Host: hostName,
      Date: utcDate,
      Signature: null
    }
  };
}

/**
 * GET /rpn/{employerRegistrationNumber}/{taxYear}/{employeeId}
 *
 * Look up Revenue Payroll Notification (RPN) by employee
 *
 * @param {string} employeeId
 */
function lookupRpnByEmployee(employeeId) {
  let { cert, config } = getCertAndConfig('test', 999963666); // or 999963665

  let hostName = config.host;
  let endPoint = `${config.basePath}/rpn/${cert.epn}/${
    config.year
  }/${employeeId}?softwareUsed=${encodeURIComponent(
    config.softwareName
  )}&softwareVersion=${encodeURIComponent(config.softwareVersion)}`;

  return new Message(options('GET', hostName, endPoint), cert);
}

/**
 * GET rpn/{employerRegistrationNumber}/{taxYear}
 *
 * Look up Revenue Payroll Notification (RPN) by employer and optionally filter by date last updated and/or employee ids
 */
function lookUpRpnByEmployer() {
  let { cert, config } = getCertAndConfig('test', 999963666); // or 999963665

  let hostName = config.host;
  let endPoint = `${config.basePath}/rpn/${cert.epn}/${
    config.year
  }?softwareUsed=${encodeURIComponent(
    config.softwareName
  )}&softwareVersion=${encodeURIComponent(config.softwareVersion)}`;

  return new Message(options('GET', hostName, endPoint), cert);
}

module.exports = {
  lookupRpnByEmployee,
  lookUpRpnByEmployer
};
