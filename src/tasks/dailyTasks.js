//@ts-check
'use strict';

const moment = require('moment');
const getLastReturnPeriod = require('./getLastReturnPeriod');
const getPayrollRun = require('./getPayrollRun');
const getPayrollSubmission = require('./getPayrollSubmission');
const copyRpnsToSql = require('./copyRpnsToSql');
const copySubmissionsToSql = require('./copySubmissionsToSql');

/**
 * Queries API and updates ReturnPeriods, PayrollRuns and PayrollSubmissions to Mongo
 */
async function updateSubmissionsMongo() {
  try {
    const returnPeriod = await getLastReturnPeriod();

    const year = moment()
      .subtract(1, 'months')
      .year();

    for (let i = 0; i < returnPeriod.payrollRunDetails.length; i++) {
      let payrollRunReference =
        returnPeriod.payrollRunDetails[i].payrollRunReference;

      let runResponse = await getPayrollRun(year, payrollRunReference);

      for (let j = 0; j < runResponse.submissions.length; j++) {
        let submissionId = runResponse.submissions[j].submissionID;

        getPayrollSubmission(year, payrollRunReference, submissionId);
      }
    }
  } catch (error) {
    throw Error(error);
  }
}

/**
 * Runs scheduled database maintenance tasks
 */
async function run() {
  try {
    await updateSubmissionsMongo();

    await copyRpnsToSql();

    await copySubmissionsToSql();
  } catch (error) {
    throw Error(error);
  }
}

module.exports = { run };
