//@ts-check
'use strict';

const sequelize = require('../../sequelize');
const SqlRpnResponse = sequelize.RpnResponse;

/**
 * Transform a MongoDB RPN Response model instance to a MySQL model instance
 * @param {any} rpnResponse
 */
function transform(rpnResponse) {
  return SqlRpnResponse.build({
    fileName: rpnResponse.fileName,
    year: rpnResponse.taxYear,
    rpnCount: rpnResponse.totalRPNCount
  });
}

module.exports = transform;
