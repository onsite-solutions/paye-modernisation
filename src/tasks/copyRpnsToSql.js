//@ts-check
'use strict';

const config = require('../config');
const sequelize = require('../sequelize');
const SqlRpnResponse = sequelize.RpnResponse;
const SqlRpn = sequelize.Rpn;
const MongoRpnResponse = require('../models/mongodb/RpnResponse');
const transformRpn = require('../models/transform/transformRpn');
const transformRpnResponse = require('../models/transform/transformRpnResponse');

/**
 * Gets the available RpnResponses from MongoDB for the current year
 */
function getRpnResponsesMongo() {
  try {
    return MongoRpnResponse.find({
      taxYear: config.year
    });
  } catch (error) {
    throw new Error(error.message);
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
    throw new Error(error.message);
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
    throw new Error(error.message);
  }
}

/**
 * Creates an Rpn record in the SQL database
 * @param {any} rpnResponse The MongoDB RpnResponse
 */
async function createRpnSql(rpnResponse) {
  try {
    for (const rpn of rpnResponse.rpns) {
      let newRpn = transformRpn(rpnResponse, rpn);

      // Check if the RPN exists
      let exists = await SqlRpn.findOne({
        where: { year: newRpn.year, ppsn: newRpn.ppsn, rpn: newRpn.rpn }
      });

      if (exists === null) {
        newRpn.save();
      }
    }
  } catch (error) {
    throw new Error(error.message);
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
        throw new Error(error.message);
      }
    }
  }
}

module.exports = copyRpnsToSql;
