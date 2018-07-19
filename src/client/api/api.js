//@ts-check

var Cert = require('../../cert');
var certs = require('../certs/certs');
var environments = require('../../../config/environments');
var utils = require('../../utils');

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
 * Builds the request-promise options object for client API requests
 *
 * @param {string} method
 * @param {string} hostName
 * @param {string} endPoint
 * @param {any} payload
 */
function options(method, hostName, endPoint) {
  let utcDate = new Date().toUTCString();

  if (method === 'GET') {
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
  } else if (method === 'POST') {
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
        'Content-Type': 'application/json',
        Digest: null,
        Signature: null
      }
    };
  }
}

module.exports = {
  getCertAndConfig,
  options
};
