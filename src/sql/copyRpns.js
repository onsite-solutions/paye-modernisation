//@ts-check
'use strict';

const mongoose = require('mongoose');
const moment = require('moment');
const config = require('../config');

const transformRpn = require('../models/transform/transformRpn');

const sequelize = require('../sequelize');
const SqlRpn = sequelize.Rpn;
const SqlRpnFile = sequelize.RpnFile;

const Rpn = require('../models/mongodb/Rpn');
const RpnResponse = require('../models/mongodb/RpnResponse');

/**
 * Gets an array of available file names from MongoDB for the current year
 */
async function getFileNamesMongo() {
  try {
    const result = await RpnResponse.distinct('fileName', {
      taxYear: config.year
    });
    return result;
  } catch (error) {
    throw Error(error);
  }
}

/**
 * Gets an array of file names already uploaded to MySQL for the current year
 */
async function getFileNamesSql() {
  try {
    const result = await SqlRpnFile.findAll({
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
 * Creates an RpnFile record in the SQL database
 * @param {number} fileName
 * @param {number} year
 */
function createRpnFileSql(fileName, year) {
  let newSqlRpnFile = SqlRpnFile.build({
    fileName: fileName,
    year: year
  });
  newSqlRpnFile.save();
}

/**
 * Creates an Rpn record in the SQL database
 * @param {number} fileName
 */
async function createRpnSql(fileName) {
  // get data from mongdb
  let rpnMongo = await RpnResponse.findOne({ fileName: fileName });

  for (const rpn of rpnMongo.rpns) {
    //let newRpn = new Rpn(rpn);
    let sqlRpn = transformRpn.rpnMongoToSql(
      rpnMongo.taxYear,
      rpnMongo.fileName,
      rpn
    );

    sqlRpn.save();
  }
}

/**
 * Copy RPNs from MongoDB to MySQL
 */
async function copyRpnsToMySql() {
  const mongoFiles = await getFileNamesMongo();

  const sqlFiles = await getFileNamesSql();

  // For all files in MongoDB but not in MySQL, create RpnFile and Rpn in MySQL
  for (const file of mongoFiles) {
    if (!sqlFiles.includes(file)) {
      try {
        await createRpnFileSql(file, config.year);

        await createRpnSql(file);
      } catch (error) {
        return Error(error);
      }
    }
  }

  console.log('Finish: copyRpnsToMySql');
}

module.exports = { copyRpnsToMySql };
