//@ts-check
'use strict';

/**
 * Environment configuration
 * @param {string} host
 * @param {string} basePath
 * @param {number} year
 * @param {string} softwareName
 * @param {string} softwareVersion
 */
function Config(host, basePath, year, softwareName, softwareVersion) {
  this.host = host;
  this.basePath = basePath;
  this.year = year;
  this.softwareName = softwareName;
  this.softwareVersion = softwareVersion;
}

module.exports = Config;
