//@ts-check
'use strict';

const config = require('../config');
const sequelize = require('../sequelize');
const SqlSubmission = sequelize.Submission;
const MongoSubmission = require('../models/mongodb/PayrollSubmission');
const transformSubmission = require('../models/transform/transformSubmission');

/**
 * Gets the available Payroll Submissions from MongoDB for the current year
 */
async function getSubmissionsMongo() {
  try {
    const result = await MongoSubmission.find({
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
async function getSubmissionsSql() {
  try {
    const result = await SqlSubmission.findAll({
      where: {
        year: config.year
      }
    });
    return result;
  } catch (error) {
    throw Error(error);
  }
}

/**
 * Checks if a Mongo submission exists in an array of SQL submission objects
 * @param {any} sql The array of SQL Submission responses
 * @param {any} mongo The Mongo submission object to check against
 */
function sqlSubmissionExists(sql, mongo) {
  const exists = sql.filter(s => {
    return (
      s.year == mongo.taxYear &&
      s.payrollRun == mongo.payrollRunReference &&
      s.submissionId == mongo.submissionID
    );
  });
  return exists.length > 0;
}

/**
 * Creates a Submission record in the SQL database
 * @param {any} submission The MongoDB Submission to convert
 */
function createSubmissionSql(submission) {
  try {
    //transformSubmission(submission).save();
    let test = transformSubmission(submission);
    console.log(test);
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
      //transformRpn(rpnResponse, rpn).save();
    }
  } catch (error) {
    return Error(error);
  }
}

/**
 * Copy Submissions from MongoDB to MySQL
 */
async function copySubmissionsToSql() {
  const mongoSubmissions = await getSubmissionsMongo();

  const sqlSubmissions = await getSubmissionsSql();

  // For all files in MongoDB but not in MySQL, create RpnFile and Rpn in MySQL
  for (const submission of mongoSubmissions) {
    if (!sqlSubmissionExists(sqlSubmissions, submission)) {
      try {
        // TODO 04/02/2019: This not working.
        await createSubmissionSql(submission);
        //await createRpnSql(rpnResponse);
      } catch (error) {
        return Error(error);
      }
    }
  }
}

module.exports = copySubmissionsToSql;
