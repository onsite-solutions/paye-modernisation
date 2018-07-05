//@ts-check
'use strict';

var Cert = require('../../../src/cert');

/**
 * POST rpn/{employerRegistrationNumber}/{taxYear}
 * @param {any} conf
 * @param {Cert} cert
 */
function postRpnNew(conf, cert) {
  var hostName = conf.host;
  var endPoint = `${conf.basePath}/rpn/${cert.epn}/${
    conf.year
  }?softwareUsed=${encodeURIComponent(
    conf.softwareName
  )}&softwareVersion=${encodeURIComponent(conf.softwareVersion)}`;
  var utcDate = new Date().toUTCString();

  return {
    hostname: hostName,
    path: endPoint,
    method: 'POST',
    headers: {
      Method: 'POST',
      Path: endPoint,
      Host: hostName,
      Date: utcDate,
      Signature: null
    }
  };
}

module.exports = postRpnNew;
