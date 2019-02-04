//@ts-check
'use strict';

const config = require('../config');
const sequelize = require('../sequelize');
const SqlRpnResponse = sequelize.RpnResponse;
const MongoRpnResponse = require('../models/mongodb/RpnResponse');
const transformRpn = require('../models/transform/transformRpn');
const transformRpnResponse = require('../models/transform/transformRpnResponse');

/**
 * Gets the available RpnResponses from MongoDB for the current year
 */
async function getRpnResponsesMongo() {
  try {
    const result = await MongoRpnResponse.find({
      taxYear: config.year
    });
    return result;
  } catch (error) {
    throw Error(error);
  }
}

/**
 * Gets the RpnResponses already uploaded to MySQL for the current year
 */
async function getRpnResponsesSql() {
  try {
    const result = await SqlRpnResponse.findAll({
      attributes: ['fileName'],
      where: {
        year: config.year
      }
    });
    return result.map(x => {
      return x.fileName.toString();
    });
  } catch (error) {
    throw Error(error);
  }
}

/**
 * Creates an RpnResponse record in the SQL database
 * @param {any} rpnResponse The MongoDB RpnResponse to convert
 */
function createRpnResponseSql(rpnResponse) {
  try {
    transformRpnResponse(rpnResponse).save();
  } catch (error) {
    return Error(error);
  }
}

/**
 * Creates an Rpn record in the SQL database
 * @param {any} rpnResponse The MongoDB RpnResponse
 */
async function createRpnSql(rpnResponse) {
  try {
    for (const rpn of rpnResponse.rpns) {
      transformRpn(rpnResponse, rpn).save();
    }
  } catch (error) {
    return Error(error);
  }
}

/**
 * Copy RPNs from MongoDB to MySQL
 */
async function copyRpnsToSql() {
  const rpnResponses = await getRpnResponsesMongo();

  const rpnFiles = await getRpnResponsesSql();

  // For all files in MongoDB but not in MySQL, create RpnFile and Rpn in MySQL
  for (const rpnResponse of rpnResponses) {
    if (!rpnFiles.includes(rpnResponse.fileName)) {
      try {
        await createRpnResponseSql(rpnResponse);
        await createRpnSql(rpnResponse);
      } catch (error) {
        return Error(error);
      }
    }
  }
}

module.exports = copyRpnsToSql;
