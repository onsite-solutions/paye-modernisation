//@ts-check

var api = require('./api');
var Message = require('../../message');

/**
 * GET /handshake
 *
 * Connectivity handshake
 */
function handshake() {
  let { cert, config } = api.getCertAndConfig();

  let endPoint = `${config.basePath}/handshake?employerRegistrationNumber=${
    cert.epn
  }&softwareUsed=${config.softwareName}&softwareVersion=${
    config.softwareVersion
  }`;

  return new Message(api.options('GET', config.host, endPoint), cert);
}

module.exports = {
  handshake
};
