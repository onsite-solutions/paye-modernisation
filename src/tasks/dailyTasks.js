//@ts-check
'use strict';

const moment = require('moment');
const months = require('./months');
const getReturnPeriod = require('./getReturnPeriod');
const getSubmissionsFromPayroll = require('./getSubmissionsFromPayroll');
const getPayrollRun = require('./getPayrollRun');
const getPayrollSubmission = require('./getPayrollSubmission');
const copyRpnsToSql = require('./copyRpnsToSql');
const copySubmissionsToSql = require('./copySubmissionsToSql');

/**
 * Queries API and updates ReturnPeriods, PayrollRuns and PayrollSubmissions to Mongo
 * Run for the last period and the current period
 */
async function updateSubmissionsMongo() {
  try {
    for (let i = 0; i < months.length; i++) {
      const returnPeriod = await getReturnPeriod(
        months[i].startDate,
        months[i].endDate
      );

      for (let j = 0; j < returnPeriod.payrollRunDetails.length; j++) {
        let payrollRunReference =
          returnPeriod.payrollRunDetails[j].payrollRunReference;

        let runResponse = await getPayrollRun(
          months[i].year,
          payrollRunReference
        );

        for (let k = 0; k < runResponse.submissions.length; k++) {
          let submissionId = runResponse.submissions[k].submissionID;

          getPayrollSubmission(
            months[i].year,
            payrollRunReference,
            submissionId
          );
        }
      }
    }
  } catch (error) {
    throw new Error(error.message);
  }
}

/**
 * Runs scheduled database maintenance tasks
 */
async function run() {
  try {
    await updateSubmissionsMongo();

    //await getSubmissionsFromPayroll();

    await copyRpnsToSql();

    await copySubmissionsToSql();

    console.log('Daily tasks completed');
  } catch (error) {
    console.error(error);
  }
}

module.exports = { run };
